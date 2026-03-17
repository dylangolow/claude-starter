# Firebase GitHub Actions WIF Setup

Reusable setup for replacing legacy `FIREBASE_TOKEN` auth with Google Workload Identity Federation while keeping Firebase Hosting preview workflows intact.

This is the preferred CI auth path for Firebase preview and production deploys. It avoids user-token churn and works cleanly with GitHub Actions OIDC.

## Recommended Operator Flow

Prefer an agent-led repo-local flow instead of an interactive setup script.

Recommended handoff:

1. Open the target repo root in its own terminal/workspace.
2. Ensure `gcloud` and `gh` are already authenticated on your machine.
3. Ask the agent:

```text
finish setting up firebase wif for this repo
```

The agent should then:

- detect the current repo slug from `git remote`
- inspect the workflow changes already on the branch
- check for existing GitHub variables and secrets
- ask only for the missing project-specific input, typically `PROJECT_ID`
- tell the user when `gcloud auth login` or `gh auth login` is required instead of guessing
- apply the WIF setup with explicit commands
- summarize exactly what changed and what still needs verification

This keeps org/project mutations deliberate and auditable while still avoiding copy-paste setup drift.

## Inputs

Set these shell variables for the repo you are wiring up:

```bash
export PROJECT_ID="your-firebase-project-id"
export PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
export POOL_ID="github"
export PROVIDER_ID="github"
export SA_NAME="github-firebase-deploy"
export SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
export REPO="owner/repo"
export GITHUB_ATTRIBUTE_MAPPING="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner,attribute.ref=assertion.ref"
export GITHUB_ATTRIBUTE_CONDITION="assertion.repository_owner=='owner' && assertion.repository=='owner/repo'"
```

## 1. Create the service account if needed

```bash
gcloud iam service-accounts create "$SA_NAME" \
  --project="$PROJECT_ID" \
  --display-name="GitHub Firebase Deploy"
```

## 2. Enable the required Google APIs

```bash
gcloud services enable iamcredentials.googleapis.com \
  --project="$PROJECT_ID"
```

This is required for GitHub OIDC -> service account impersonation. If this API was just enabled, wait a minute or two before rerunning workflows.

## 3. Grant deploy roles

```bash
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/firebasehosting.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/serviceusage.apiKeysViewer"
```

## 4. Create the workload identity pool

```bash
gcloud iam workload-identity-pools create "$POOL_ID" \
  --project="$PROJECT_ID" \
  --location="global" \
  --display-name="GitHub Actions"
```

## 5. Create or update the GitHub OIDC provider

Create:

```bash
gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_ID" \
  --project="$PROJECT_ID" \
  --location="global" \
  --workload-identity-pool="$POOL_ID" \
  --display-name="GitHub Provider" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="$GITHUB_ATTRIBUTE_MAPPING" \
  --attribute-condition="$GITHUB_ATTRIBUTE_CONDITION"
```

If it already exists, update it instead:

```bash
gcloud iam workload-identity-pools providers update-oidc "$PROVIDER_ID" \
  --project="$PROJECT_ID" \
  --location="global" \
  --workload-identity-pool="$POOL_ID" \
  --attribute-mapping="$GITHUB_ATTRIBUTE_MAPPING" \
  --attribute-condition="$GITHUB_ATTRIBUTE_CONDITION"
```

## 6. Allow the repo to impersonate the service account

```bash
gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --project="$PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/attribute.repository/${REPO}"
```

## 7. Get the provider resource name

```bash
gcloud iam workload-identity-pools providers describe "$PROVIDER_ID" \
  --project="$PROJECT_ID" \
  --location="global" \
  --workload-identity-pool="$POOL_ID" \
  --format="value(name)"
```

Expected shape:

```text
projects/123456789/locations/global/workloadIdentityPools/github/providers/github
```

## 8. Store the GitHub variables

Replace the provider value below with the exact output from step 7.

```bash
gh variable set GCP_WORKLOAD_IDENTITY_PROVIDER \
  --body "projects/123456789/locations/global/workloadIdentityPools/github/providers/github"

gh variable set GCP_SERVICE_ACCOUNT_EMAIL \
  --body "$SA_EMAIL"
```

## 9. Update the workflow auth path

The workflow should:

- keep the existing Firebase preview branch/commit channel behavior
- add `permissions.id-token: write`
- use `google-github-actions/auth`
- use `google-github-actions/setup-gcloud`
- convert the exported credential file into ADC before calling `firebase-tools`

The critical ADC conversion step is:

```bash
gcloud auth login --quiet --cred-file="$GOOGLE_GHA_CREDS_PATH" --update-adc
```

Without that, `firebase-tools` may still fail with:

```text
Failed to authenticate, have you run firebase login?
```

## 10. Rerun the workflow and remove the legacy token

After the WIF path is working:

```bash
gh secret delete FIREBASE_TOKEN
```

## Troubleshooting

- If service account key creation is blocked by org policy, that is expected in many orgs. Use WIF instead of a JSON key.
- If provider creation fails and asks for an attribute condition, include `assertion.repository_owner` and `assertion.repository` in `GITHUB_ATTRIBUTE_CONDITION`.
- If `setup-gcloud` fails with `IAM Service Account Credentials API ... is disabled`, enable `iamcredentials.googleapis.com` and rerun after propagation.
- If the repo is using a custom Firebase preview workflow, keep the existing branch/commit channel logic and replace only the auth layer.
