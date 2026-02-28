---
name: firebase-preview-automation
description: Standard pattern for Firebase Hosting preview deploys in GitHub Actions with both branch-stable and commit-specific preview URLs, plus a single sticky PR comment that surfaces preview links like a deployment card. Use when setting up or fixing preview workflows for frontend apps or static sites on Firebase Hosting.
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

1. Build once in GitHub Actions.
2. Compute two channel IDs:
   - branch-stable channel prefixed with `br-`
   - commit channel prefixed with `commit-`
3. Deploy both channels with `firebase hosting:channel:deploy`.
4. Publish both URLs in `GITHUB_STEP_SUMMARY`.
5. Post or update one sticky PR comment with both preview links.

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
- Hide lower-signal diagnostics in a collapsible details block:
  - branch channel
  - commit channel
  - full commit SHA

The comment should feel like a deployment surface, not a raw CI log.

## Required GitHub Settings

- Variable: `FIREBASE_PROJECT_ID`
- Secret: `FIREBASE_TOKEN`

## Rule

- If a repo already uses Firebase Hosting previews, prefer automated PR comments in CI over manually posting preview links.
