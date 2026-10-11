import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

function s3Ready() {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.S3_BUCKET,
  );
}

export async function storePhoto(buffer: Buffer, mime: string, filename: string) {
  const key = `reports/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  if (s3Ready()) {
    const region = process.env.AWS_REGION || "ap-south-1";
    const bucket = process.env.S3_BUCKET as string;
    const client = new S3Client({ region });
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: mime,
      }),
    );
    const base =
      process.env.S3_PUBLIC_BASE_URL ||
      `https://${bucket}.s3.${region}.amazonaws.com`;
    return { url: `${base}/${key}`, key, backend: "s3" as const };
  }

  const dir = path.join(process.cwd(), "data", "uploads");
  await mkdir(dir, { recursive: true });
  const localName = key.replace("reports/", "");
  await writeFile(path.join(dir, localName), buffer);
  return { url: `/api/files/${localName}`, key: localName, backend: "local" as const };
}
