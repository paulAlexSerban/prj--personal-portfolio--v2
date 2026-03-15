const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const dotendv = require("dotenv");

// Load environment variables from .env file
dotendv.config();

function cleanRepoDir(targetDir) {
  try {
    execSync(`rm -rf ${targetDir}`, { stdio: "inherit" });
    console.log(`Cleaned existing directory: ${targetDir}`);
  } catch (error) {
    console.error(
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
    console.log(`Successfully cloned to ${targetDir}`);
  } catch (error) {
    console.error(
      "Failed to clone repository:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
}

function removeUnnecessaryFiles(targetDir, exceptions) {
  const items = fs.readdirSync(targetDir);

  items.forEach((item) => {
    if (!exceptions.includes(item)) {
      const itemPath = path.join(targetDir, item);
      execSync(`rm -rf ${itemPath}`, { stdio: "inherit" });
      console.log(`Removed: ${itemPath}`);
    }
  });
}

function main() {
  const { GITHUB_TOKEN, CONTENT_REPO_GIT_URL, CONTENT_DIRECTORY } = process.env;

  if (!GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN is not set in environment variables.");
    process.exit(1);
  }

  if (!CONTENT_REPO_GIT_URL) {
    console.error("CONTENT_REPO_GIT_URL is not set in environment variables.");
    process.exit(1);
  }
  const TARGET_DIR = path.resolve(CONTENT_DIRECTORY);

  cleanRepoDir(TARGET_DIR);
  clonePrivateRepo(CONTENT_REPO_GIT_URL, TARGET_DIR, GITHUB_TOKEN);
  removeUnnecessaryFiles(path.join(TARGET_DIR), ["assets", "content"]);
  removeUnnecessaryFiles(path.join(TARGET_DIR, "content"), ["publish"]);
}

main();
