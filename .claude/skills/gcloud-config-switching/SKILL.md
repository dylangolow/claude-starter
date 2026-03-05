---
name: gcloud-config-switching
description: Configure multi-project GCP workflows with named gcloud configurations and direnv-based repo auto-switching. Use when developers frequently switch accounts/projects across repos.
allowed-tools: Read, Grep, Bash
---

# Gcloud Config Switching

## When to Use

- The user keeps re-authenticating or manually flipping `gcloud` account/project.
- Different repos target different Firebase/GCP projects.
- The user wants local, repo-aware switching without storing passwords.

## Core Rules

- Never store human passwords in `.env` or repo files.
- Do not automate login with email/password.
- Use named `gcloud` configurations and short-lived auth sessions.
- Keep `.envrc` local-only (ignore via `.git/info/exclude` or equivalent).

## Standard Workflow

1. Discover per-repo project IDs from:
   - `.firebaserc`
   - `.env.example` / `.env.local`
   - deploy scripts and CI workflows
2. Create or update one named config per project/account:
   - `gcloud config configurations create <name>`
   - `gcloud config set core/account <email>`
   - `gcloud config set core/project <project-id>`
3. For each repo, add `.envrc`:
   - `export CLOUDSDK_ACTIVE_CONFIG_NAME=<config-name>`
4. Approve with `direnv allow` once per repo.
5. Verify:
   - `direnv exec <repo> gcloud config get-value core/project`
   - `direnv exec <repo> gcloud config get-value core/account`

## Recommended Commands

```bash
# List auth/accounts/configs
gcloud auth list
gcloud config configurations list

# Create/update a config
gcloud config configurations create cfg-gem-landing --no-activate
gcloud config configurations activate cfg-gem-landing
gcloud config set core/account dylan@gemifi.co
gcloud config set core/project gem-landing

# Per-repo .envrc
cat > .envrc <<'EOT'
export CLOUDSDK_ACTIVE_CONFIG_NAME=cfg-gem-landing
EOT
direnv allow

# Verify in that repo
direnv exec . gcloud config get-value core/project
```

## Troubleshooting

- `direnv: command not found`: install `direnv` and add `eval "$(direnv hook zsh)"` to shell rc.
- Project permission warning: config is valid, but chosen account lacks access; update account or IAM.
- Repo looks dirty from `.envrc`: add `.envrc` to `.git/info/exclude` for local-only use.

## Automation Note

For CI and bots, prefer service account impersonation or WIF over user credentials.
