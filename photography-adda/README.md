# Photography Adda - Phase 2 (Automated Fill Starting)
This repository contains the Phase-2 bootstrapped code for Photography Adda.
Jarvis has generated API, Worker, Album Engine, Desktop client skeletons and CI/CD workflow stubs.

## What I added
- API: presign endpoints, multipart presign helpers, Stripe webhook stub
- Worker: SQS poller, simple image processing placeholders (blur/phash)
- Album engine stub: queueing and job creation endpoint
- Desktop electron placeholder for pairing + UI
- Terraform skeleton and GitHub Actions stubs for ECR/ECS and infra deploys
- .env.example includes keys to set locally or in GitHub Secrets

## Next (required) - configure secrets in GitHub
Add the following secrets in your repository (Settings → Secrets & variables → Actions):
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_ACCOUNT (your aws account id)
- AWS_REGION (e.g. ap-south-1)
- ECR_REPO (name of ECR repo to push images)
- UPLOAD_BUCKET (S3 bucket name)
- SQS_URL
- STRIPE_SECRET

## How deployment will work (overview)
1. Push to `api/` → GitHub Actions builds Docker image and pushes to ECR → triggers ECS service update.
2. Push to `worker-ai/` → Actions builds worker image and updates worker service.
3. Push to `infra/` → Actions runs `terraform plan`. Manual approval step required for `apply`.
4. After infra is ready and secrets set, CI will deploy containers and services automatically.

## To start Jarvis full fill
After you commit these Phase-2 files to your repo, reply here:
**"Jarvis, Phase2 uploaded — start full fill."**
and I will continue filling code for:
- Full presign multipart flow and client examples
- Worker image processing modules (closed-eyes, face cluster)
- Album layout engine (spread generator + PDF)
- Desktop pairing endpoints and automatic installer builds
- Stripe webhook and payment-to-release pipeline


## Phase-3: Jarvis Full Fill Started
Jarvis has started generating Phase-3 components. Review files and set GitHub Secrets before enabling CI deploys.
