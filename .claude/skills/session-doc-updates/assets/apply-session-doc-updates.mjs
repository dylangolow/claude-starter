import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";

const sectionHeading = "## Session Context Updates";
const defaultSourcePath = "context/session-doc-updates.md";

function printUsage() {
  console.log(
    "Usage: node scripts/apply-session-doc-updates.mjs [--source <path>] [--stage]",
  );
}

function parseArgs(argv) {
  const options = {
    sourcePath: defaultSourcePath,
    stage: false,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") {
      continue;
    }
    if (arg === "--source") {
      const value = argv[i + 1];
      if (!value) {
        throw new Error("Missing value for --source");
      }
      options.sourcePath = value;
      i += 1;
      continue;
    }
    if (arg === "--stage") {
      options.stage = true;
      continue;
    }
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function parseBlocks(sourceText) {
  const lines = sourceText.replaceAll("\r\n", "\n").split("\n");
  const blocks = [];
  const headerPattern = /^##\s+\[(docs\/[^\]]+)\]\s*$/;
  let targetPath = null;
  let contentLines = [];

  function pushCurrent() {
    if (!targetPath) {
      return;
    }
    const content = contentLines.join("\n").trim();
    if (content.length > 0) {
      blocks.push({
        targetPath,
        content,
      });
    }
  }

  for (const line of lines) {
    const match = line.match(headerPattern);
    if (match) {
      pushCurrent();
      targetPath = match[1].trim();
      contentLines = [];
      continue;
    }
    if (targetPath) {
      contentLines.push(line);
    }
  }

  pushCurrent();
  return blocks;
}

function isAllowedTargetPath(targetPath) {
  if (targetPath.includes("..")) {
    return false;
  }
  if (targetPath === "docs/plans/IMPLEMENTATION.md") {
    return true;
  }
  if (targetPath.startsWith("docs/specs/") && targetPath.endsWith(".md")) {
    return true;
  }
  if (targetPath.startsWith("docs/knowledge/") && targetPath.endsWith(".md")) {
    return true;
  }
  return false;
}

function isInDocsTree(absolutePath) {
  const docsRoot = resolve("docs");
  return (
    absolutePath === docsRoot || absolutePath.startsWith(`${docsRoot}${sep}`)
  );
}

function ensureSessionSection(existingText) {
  const normalized = existingText.replaceAll("\r\n", "\n");
  if (normalized.includes(sectionHeading)) {
    return normalized.endsWith("\n") ? normalized : `${normalized}\n`;
  }
  if (normalized.trim().length === 0) {
    return `${sectionHeading}\n`;
  }
  const withFinalNewline = normalized.endsWith("\n")
    ? normalized
    : `${normalized}\n`;
  return `${withFinalNewline}\n${sectionHeading}\n`;
}

function buildEntry({ sourcePath, targetPath, content }) {
  const hashInput = `${sourcePath}\n${targetPath}\n${content.trim()}`;
  const digest = createHash("sha256")
    .update(hashInput)
    .digest("hex")
    .slice(0, 12);
  const timestamp = new Date().toISOString();
  const marker = `<!-- session-doc-update:${digest} -->`;
  const entry = `${marker}\n### ${timestamp}\n${content.trim()}\n`;
  return { digest, marker, entry };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const sourceAbsolutePath = resolve(options.sourcePath);

  if (!existsSync(sourceAbsolutePath)) {
    console.log(
      `[session-docs] No source file at ${options.sourcePath}. Skipping.`,
    );
    return;
  }

  const sourceText = readFileSync(sourceAbsolutePath, "utf8");
  const blocks = parseBlocks(sourceText);
  if (blocks.length === 0) {
    console.log(
      `[session-docs] No update blocks found in ${options.sourcePath}. Skipping.`,
    );
    return;
  }

  const invalidTargets = blocks
    .map((block) => block.targetPath)
    .filter((targetPath) => !isAllowedTargetPath(targetPath));

  if (invalidTargets.length > 0) {
    throw new Error(
      `[session-docs] Invalid target path(s): ${invalidTargets.join(
        ", ",
      )}. Allowed targets: docs/plans/IMPLEMENTATION.md, docs/specs/*.md, docs/knowledge/*.md`,
    );
  }

  const changedPaths = [];
  let dryRunCount = 0;

  for (const block of blocks) {
    const targetAbsolutePath = resolve(block.targetPath);
    if (!isInDocsTree(targetAbsolutePath)) {
      throw new Error(
        `[session-docs] Target is outside docs tree: ${block.targetPath}`,
      );
    }

    const existingText = existsSync(targetAbsolutePath)
      ? readFileSync(targetAbsolutePath, "utf8")
      : "";

    const prepared = ensureSessionSection(existingText);
    const { marker, entry } = buildEntry({
      sourcePath: options.sourcePath,
      targetPath: block.targetPath,
      content: block.content,
    });

    if (prepared.includes(marker)) {
      console.log(
        `[session-docs] Duplicate update for ${block.targetPath}. Skipping.`,
      );
      continue;
    }

    const nextText = `${prepared}\n${entry}`;
    if (options.dryRun) {
      console.log(`[session-docs] Would update ${block.targetPath}`);
      dryRunCount += 1;
      continue;
    }

    mkdirSync(dirname(targetAbsolutePath), { recursive: true });
    writeFileSync(targetAbsolutePath, nextText);
    changedPaths.push(block.targetPath);
    console.log(`[session-docs] Updated ${block.targetPath}`);
  }

  if (options.stage && changedPaths.length > 0 && !options.dryRun) {
    const add = spawnSync("git", ["add", ...changedPaths], {
      stdio: "inherit",
    });
    if (add.status !== 0) {
      throw new Error("[session-docs] Failed to stage updated docs files.");
    }
  }

  if (options.dryRun) {
    if (dryRunCount === 0) {
      console.log("[session-docs] Dry run complete. No docs updates.");
      return;
    }
    console.log(
      `[session-docs] Dry run complete. ${dryRunCount} docs file(s) would be updated.`,
    );
    return;
  }

  if (changedPaths.length === 0) {
    console.log("[session-docs] No docs files changed.");
  }
}

try {
  main();
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("[session-docs] Unknown error");
  }
  process.exit(1);
}
