import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import type { Report } from "../types";

export async function notifyDepartment(report: Report) {
  const topic = process.env.SNS_TOPIC_ARN;
  if (!topic || !process.env.AWS_ACCESS_KEY_ID) {
    return { sent: false as const };
  }

  const client = new SNSClient({ region: process.env.AWS_REGION || "ap-south-1" });
  await client.send(
    new PublishCommand({
      TopicArn: topic,
      Subject: `[EcoGuardian] ${report.classification.severityLevel.toUpperCase()} — ${report.classification.label}`,
      Message: JSON.stringify(
        {
          trackingCode: report.trackingCode,
          department: report.departmentName,
          severity: report.classification.severity,
          address: report.address,
          lat: report.lat,
          lng: report.lng,
          summary: report.classification.summary,
        },
        null,
        2,
      ),
    }),
  );
  return { sent: true as const };
}
