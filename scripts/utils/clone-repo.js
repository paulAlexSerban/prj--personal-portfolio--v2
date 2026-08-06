const logger = require("./cli-logger");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const dotendv = require("dotenv");

dotendv.config();
const { CONTENT_REPO_TOKEN, GITHUB_TOKEN, CONTENT_REPO_GIT_URL, CONTENT_REPO_DIRECTORY } =
  process.env;
// Prefer CONTENT_REPO_TOKEN (CI PAT for cross-repo clone); fall back to GITHUB_TOKEN for local .env
const AUTH_TOKEN = CONTENT_REPO_TOKEN || GITHUB_TOKEN;

function cleanRepoDir(targetDir) {
  try {
    fs.rmSync(targetDir, { recursive: true, force: true });
    logger.success(`Cleaned existing directory: ${targetDir}`);
  } catch (error) {
    logger.error(
      "Failed to clean directory:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
}

function clonePrivateRepo(repoUrl, targetDir, token) {
  // Insert token into URL
  const authenticatedUrl = repoUrl.replace(
    "https://github.com/",
    `https://${token}@github.com/`,
  );
  try {
    execSync(`git clone ${authenticatedUrl} ${targetDir}`, {
      stdio: "inherit",
    });
    logger.success(`Successfully cloned repository to ${targetDir}`);
  } catch (error) {
    logger.error(
      `Failed to clone repository: ${error instanceof Error ? error.message : error}`,
    );
    throw error;
  }
}

function main() {
  if (!AUTH_TOKEN) {
    logger.error(
      "CONTENT_REPO_TOKEN (or GITHUB_TOKEN fallback) is not set in environment variables.",
    );
    process.exit(1);
  }
  if (!CONTENT_REPO_GIT_URL) {
    logger.error("CONTENT_REPO_GIT_URL is not set in environment variables.");
    process.exit(1);
  }
  if (!CONTENT_REPO_DIRECTORY) {
    logger.error("CONTENT_REPO_DIRECTORY is not set in environment variables.");
    process.exit(1);
  }
  const TARGET_DIR = path.resolve(CONTENT_REPO_DIRECTORY);
  cleanRepoDir(TARGET_DIR);
  clonePrivateRepo(CONTENT_REPO_GIT_URL, TARGET_DIR, AUTH_TOKEN);
  // Remove the .git directory to avoid issues with nested git repositories
  // and to prevent accidental commits to the content repository from the main repository
  fs.rmSync(path.join(TARGET_DIR, ".git"), { recursive: true, force: true });
}

module.exports = main;