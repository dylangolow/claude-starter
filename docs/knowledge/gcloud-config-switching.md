# GCP Config Switching (No Passwords)

Use named `gcloud` configurations plus `direnv` to avoid constant account/project toggling.

## Why this works

- One config per project/account pair.
- Repo-level `.envrc` selects the right config automatically.
- No password storage required.

## One-time setup

```bash
# example configs
gcloud config configurations create cfg-gem-landing --no-activate
gcloud config configurations activate cfg-gem-landing
gcloud config set core/account dylan@gemifi.co
gcloud config set core/project gem-landing
```

Repeat for each project.

## Repo setup pattern

```bash
cat > .envrc <<'EOF2'
export CLOUDSDK_ACTIVE_CONFIG_NAME=cfg-gem-landing
EOF2

direnv allow
```

## Suggested local hygiene

- Keep `.envrc` local-only:
  - add to `.git/info/exclude`
- Verify after setup:

```bash
direnv exec . gcloud config get-value core/account
direnv exec . gcloud config get-value core/project
```

## Security guidance

- Do not store Google passwords in `.env`.
- For automation, use service account impersonation or workload identity federation.
