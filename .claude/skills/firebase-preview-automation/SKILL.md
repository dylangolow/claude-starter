---
name: firebase-preview-automation
description: Standard pattern for Firebase Hosting preview deploys in GitHub Actions with branch-stable previews always on, commit previews gated by a PR checkbox, and sticky PR feedback (comment + runtime state block). Use when setting up or fixing preview workflows for frontend apps or static sites on Firebase Hosting.
allowed-tools: Read, Grep, Bash
---

# Firebase Preview Automation

## When to Use

- A repo deploys frontend previews with Firebase Hosting
- The user wants preview links posted automatically on PRs
- The user wants both:
  - a stable branch preview URL
  - a per-commit preview URL for comparing revisions

## Standard Workflow

1. Trigger on `pull_request` with `types: [opened, synchronize, reopened, edited]`.
2. Add a guard to avoid self-trigger loops when the workflow edits the PR body:
   - `github.actor != 'github-actions[bot]'`
3. Parse a PR checkbox to control commit preview deployment:
   - `- [ ] Deploy per-commit Firebase preview` (default unchecked)
4. Build once in GitHub Actions.
5. Compute two channel IDs:
   - branch-stable channel prefixed with `br-`
   - commit channel prefixed with `commit-`
6. Always deploy branch preview. Deploy commit preview only when checkbox is checked.
7. When commit preview is checked, first detect whether the current head SHA already has a successful commit preview (reuse URL and skip redeploy if present).
8. Publish URLs in `GITHUB_STEP_SUMMARY`.
9. Post or update one sticky PR comment with preview links.
10. Update a PR body state block so users can see applied settings immediately after editing the checkbox.
11. Publish a `Branch Preview` commit status whose `target_url` points to the stable branch preview URL.

## PR-Controlled Commit Preview

- Default behavior:
  - branch preview runs on every PR sync/edit
  - commit preview is off until explicitly enabled in PR description
- Checkbox pattern:
  - `- [ ] Deploy per-commit Firebase preview`
  - regex-safe parse should support uppercase/lowercase `x`
- Runtime feedback block in PR body:
  - start marker: `<!-- preview-settings-state:start -->`
  - end marker: `<!-- preview-settings-state:end -->`
  - include:
    - whether commit preview setting is currently applied as enabled/disabled
    - last-applied UTC timestamp
    - workflow run URL

## Explicit Channel Naming

- Match the pattern implemented in `projekt`:
  - branch channel: `br-<branch-fragment>-<branch-hash>`
  - commit channel: `commit-<shortsha>`
- Branch channel rules:
  - sanitize the branch name to lowercase alphanumeric + hyphens
  - collapse repeated hyphens and trim edge hyphens
  - keep a short readable fragment, for example the first `10` chars
  - append a short hash suffix, for example the first `4` chars of `sha1(branch-slug)`
- Commit channel rules:
  - use the first `8` chars of the commit SHA

## Preferred PR Comment Format

- Use one sticky comment updated in place with the marker `<!-- firebase-preview-links -->`
- Title the comment `## Web Preview Ready`
- Put the main actions in a compact two-row table:
  - `Branch Preview` with a direct `Open preview` link
  - `Commit Preview` with a direct `Open preview` link
- Add one compact metadata line linking to:
  - branch
  - commit
  - PR
  - workflow run
- Add a second compact line:
  - `Last updated: <UTC timestamp>`
- Hide lower-signal diagnostics in a collapsible details block:
  - branch channel
  - commit channel
  - full commit SHA
- If commit preview is disabled, render explicit disabled text instead of a broken link.
- If commit preview was reused (already existed for head SHA), note that in metadata.

The comment should feel like a deployment surface, not a raw CI log.

## GitHub Checks Link

- Publish a commit status with:
  - `context: Branch Preview`
  - `target_url: <stable branch preview URL>`
- Use `statuses: write` permission for that status
- Prefer this over `environment.url` or custom check runs when the destination is an external Firebase URL

## Required GitHub Settings

- Variable: `FIREBASE_PROJECT_ID`
- Secret: `FIREBASE_TOKEN`

## Rule

- If a repo already uses Firebase Hosting previews, prefer automated PR comments in CI over manually posting preview links.
