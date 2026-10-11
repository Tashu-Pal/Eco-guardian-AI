import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import {
  DetectLabelsCommand,
  RekognitionClient,
} from "@aws-sdk/client-rekognition";
import { CATEGORIES, severityLevel } from "../departments";
import type { Classification, IssueCategory } from "../types";

const CATEGORY_KEYS = Object.keys(CATEGORIES) as IssueCategory[];

const KEYWORDS: Record<IssueCategory, string[]> = {
  illegal_dumping: ["garbage", "trash", "waste", "dump", "litter", "plastic", "debris", "landfill"],
  water_leakage: ["leak", "pipe", "water", "flood", "burst", "puddle", "hydrant"],
  air_pollution: ["smog", "haze", "pollution", "exhaust", "dust", "aqi"],
  heat_hotspot: ["heat", "hot", "scorch", "bare ground", "asphalt", "drought"],
  fallen_tree: ["tree", "branch", "fallen", "log", "wood", "uprooted"],
  overflowing_drain: ["drain", "sewer", "manhole", "overflow", "clog", "sludge"],
  smoke_fire: ["fire", "smoke", "burn", "flame", "blaze", "ash"],
  other: [],
};

function awsReady() {
  return Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
}

function scoreKeywords(text: string) {
  const t = text.toLowerCase();
  const scores: Partial<Record<IssueCategory, number>> = {};
  for (const cat of CATEGORY_KEYS) {
    scores[cat] = KEYWORDS[cat].reduce((n, w) => n + (t.includes(w) ? 2 : 0), 0);
  }
  return scores;
}

function heuristic(notes: string, rekognitionLabels: string[] = []): Classification {
  const scores = scoreKeywords(`${notes} ${rekognitionLabels.join(" ")}`);
  let category: IssueCategory = "other";
  let best = 0;
  for (const cat of CATEGORY_KEYS) {
    const s = scores[cat] ?? 0;
    if (s > best) {
      best = s;
      category = cat;
    }
  }
  if (category === "other" && notes.length < 8) category = "illegal_dumping";

  let severity = 4 + Math.min(4, best);
  if (category === "smoke_fire") severity = Math.max(severity, 8);
  if (category === "water_leakage") severity = Math.max(severity, 6);
  severity = Math.min(10, severity);

  return {
    category,
    label: CATEGORIES[category].label,
    summary: notes || `Detected likely ${CATEGORIES[category].label.toLowerCase()} from the report evidence.`,
    severity,
    severityLevel: severityLevel(severity),
    confidence: best > 0 ? Math.min(0.92, 0.45 + best * 0.08) : 0.4,
    labels: rekognitionLabels,
    engine: rekognitionLabels.length ? "rekognition" : "heuristic",
  };
}

async function rekognitionLabels(bytes: Uint8Array): Promise<string[]> {
  if (!awsReady() || process.env.USE_REKOGNITION === "false") return [];
  const client = new RekognitionClient({ region: process.env.AWS_REGION || "ap-south-1" });
  const res = await client.send(
    new DetectLabelsCommand({
      Image: { Bytes: bytes },
      MaxLabels: 15,
      MinConfidence: 55,
    }),
  );
  return (res.Labels ?? []).map((l) => l.Name ?? "").filter(Boolean);
}

async function bedrockClassify(
  notes: string,
  labels: string[],
  imageBase64: string,
  mime: string,
): Promise<Classification | null> {
  if (!awsReady() || process.env.USE_BEDROCK === "false") return null;
  const modelId = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0";
  const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "ap-south-1" });

  const prompt = `You are EcoGuardian AI, a civic environmental triage model.
Given a citizen photo (and optional notes) classify ONE issue.
Allowed category keys: ${CATEGORY_KEYS.join(", ")}.
Return ONLY JSON: {"category":"","summary":"","severity":1-10,"confidence":0-1}

Notes: ${notes || "(none)"}
Rekognition labels: ${labels.join(", ") || "(none)"}`;

  const body = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mime, data: imageBase64 },
          },
          { type: "text", text: prompt },
        ],
      },
    ],
  };

  const res = await client.send(
    new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(body),
    }),
  );

  const decoded = JSON.parse(new TextDecoder().decode(res.body));
  const text: string = decoded.content?.[0]?.text ?? "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  const parsed = JSON.parse(match[0]) as {
    category?: string;
    summary?: string;
    severity?: number;
    confidence?: number;
  };
  const category = CATEGORY_KEYS.includes(parsed.category as IssueCategory)
    ? (parsed.category as IssueCategory)
    : heuristic(notes, labels).category;
  const severity = Math.max(1, Math.min(10, Number(parsed.severity) || 5));
  return {
    category,
    label: CATEGORIES[category].label,
    summary: parsed.summary || notes || CATEGORIES[category].label,
    severity,
    severityLevel: severityLevel(severity),
    confidence: Math.max(0.3, Math.min(0.99, Number(parsed.confidence) || 0.7)),
    labels,
    engine: "bedrock+rekognition",
  };
}

export async function classifyIssue(input: {
  buffer: Buffer;
  mime: string;
  notes: string;
}): Promise<Classification> {
  const bytes = new Uint8Array(input.buffer);
  let labels: string[] = [];
  try {
    labels = await rekognitionLabels(bytes);
  } catch (err) {
    console.warn("Rekognition unavailable, using fallback", err);
  }

  try {
    const fromBedrock = await bedrockClassify(
      input.notes,
      labels,
      input.buffer.toString("base64"),
      input.mime === "image/png" ? "image/png" : "image/jpeg",
    );
    if (fromBedrock) return fromBedrock;
  } catch (err) {
    console.warn("Bedrock unavailable, using fallback", err);
  }

  return heuristic(input.notes, labels);
}
