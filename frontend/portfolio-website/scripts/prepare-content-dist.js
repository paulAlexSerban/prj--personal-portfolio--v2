const { cpSync, existsSync, mkdirSync, readdirSync } = require("fs");
const { resolve } = require("path");

const CONTENT_TEST_DIR = resolve(__dirname, "..", "content", "test");
const CONTENT_DIST_DIR = resolve(__dirname, "..", "content", "dist");

function hasContent(directoryPath) {
    return existsSync(directoryPath) && readdirSync(directoryPath).length > 0;
}

function main() {
    if (!hasContent(CONTENT_DIST_DIR)) {
        if (!existsSync(CONTENT_TEST_DIR)) {
            throw new Error("Cannot prepare content/dist: content/test does not exist.");
        }

        mkdirSync(CONTENT_DIST_DIR, { recursive: true });
        cpSync(CONTENT_TEST_DIR, CONTENT_DIST_DIR, { recursive: true });
        console.log("[ info ] content/dist missing or empty. Copied seed data from content/test.");
        return;
    }

    console.log("[ info ] content/dist already populated. No content copy required.");
}

main();
