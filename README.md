# EcoGuardian AI

AI-powered civic and environmental intelligence: citizens upload a photo, location is attached, AI classifies the issue and severity, the ticket is routed to the right department, and authorities work a live priority dashboard. Citizens track the same record.

Air, water, waste, and heat sit in **one** queue — not four disconnected apps.

## What you can do

- **Citizen report** — photo, GPS, optional notes
- **AI triage** — Amazon Rekognition labels + Amazon Bedrock (Claude) for category and severity; heuristic fallback if AWS is not configured
- **Routing** — waste, water, pollution, fire, parks, stormwater, public health
- **Authority dashboard** — live map, priority score, status updates
- **Tracking** — shareable `EG-XXXXXX` codes and citizen confirmations

## Run locally (no AWS required)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Demo reports are seeded on first launch into `data/reports.json`. Photos without S3 are stored under `data/uploads`.

## AWS (when you are ready)

| Piece | Service | Why |
| --- | --- | --- |
| Photos | **S3** | Evidence that scales beyond the app server |
| Scene labels | **Rekognition** | Detects smoke, garbage, water, vegetation, fire-like scenes |
| Issue + severity | **Bedrock** (Claude 3 Haiku) | Structured civic classification from the photo |
| Department alerts | **SNS** | Fan-out to WhatsApp/SMS/email bridges later |
| Hosting (optional) | **Amplify** or **App Runner** | Deploy this Next.js app |

1. Enable Bedrock model access for Claude 3 Haiku in `ap-south-1` (or your `AWS_REGION`).
2. Deploy infra:

```bash
aws cloudformation deploy \
  --template-file infra/cloudformation.yaml \
  --stack-name ecoguardian-ai \
  --capabilities CAPABILITY_NAMED_IAM
```

3. Copy stack outputs into `.env.local` (`AWS_*`, `S3_BUCKET`, `SNS_TOPIC_ARN`).
4. Restart `npm run dev`. New photos go to S3; classification uses Rekognition then Bedrock.

Keep IAM keys in `.env.local` only. The CloudFormation template creates a runtime user with S3, Rekognition, Bedrock, and SNS — not console admin.

## Priority model

`priority = severity×12 + freshness(hours remaining in a 24h window) + confirmations×4`

Fire and major leaks score higher; older tickets decay unless more citizens confirm them.

## Project layout

- `app/` — pages and API routes
- `lib/aws/` — S3, Rekognition/Bedrock, SNS
- `lib/store.ts` — JSON store (swap for DynamoDB/RDS later)
- `infra/cloudformation.yaml` — AWS starter stack
