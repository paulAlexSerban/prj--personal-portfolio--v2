const { parseArgs } = require("./utils/simple-parser");
const logger = require("./utils/cli-logger");
const cloneRepo = require("./utils/clone-repo");
const fs = require("fs");
const { execSync, exec } = require("child_process");

/**
 * Display usage information
 */
function showHelp() {
  const help = `
Usage: file-processor [OPTIONS] <input-file>

Process and transform text files with various options.

Options:
  --help              Show this help message
  --env               Set environment (dev, prod)
  --dataset           Specify dataset (live, test, prev)
  --target-hosting    Set target hosting environment (prod, test)

Examples:
  build.js
  build --env=prod --target-hosting=prod --dataset=live
  build --env=dev --target-hosting=test --dataset=test
  build --env=dev --target-hosting=test --dataset=prev

Environment:
    NODE_ENV: Set to 'production' for production builds, 'development' for development builds.
    TARGET_HOSTING: Set to 'prod' for production hosting, 'test' for test hosting.
    DATASET: Set to 'live' for live dataset, 'test' for test dataset, 'prev' for preview dataset.
`;
  console.log(help.trim());
}

const validate = (options) => {
  const validEnvs = ["dev", "prod"];
  const validTargetHostings = ["prod", "test"];
  const validDatasets = ["live", "test", "prev"];

  if (!validEnvs.includes(options.env)) {
    logger.error(
      `Invalid environment: ${options.env}. Valid options are: ${validEnvs.join(", ")}`,
    );
    process.exit(1);
  }

  if (!validTargetHostings.includes(options["target-hosting"])) {
    logger.error(
      `Invalid target hosting: ${options["target-hosting"]}. Valid options are: ${validTargetHostings.join(", ")}`,
    );
    process.exit(1);
  }

  if (!validDatasets.includes(options.dataset)) {
    logger.error(
      `Invalid dataset: ${options.dataset}. Valid options are: ${validDatasets.join(", ")}`,
    );
    process.exit(1);
  }
};

const TARGET_HOSTING_MAP = {
  prod: "production",
  test: "test",
};
const repo = "content--paulserban.eu";

const copyContent = (sourceDir, targetDir) => {
  fs.cpSync(sourceDir, targetDir, { recursive: true });
};

const cleanContentDist = () => {
  fs.rmSync(`./frontend/portfolio-website/content/dist`, {
    recursive: true,
    force: true,
  });
};

const main = () => {
  const { options } = parseArgs(process.argv.slice(2));

  if (options.help) {
    showHelp();
    return;
  }

  validate(options);

  const DATASET_HANDLERS_MAP = {
    live: () => {
      logger.info("Processing live dataset...");
      logger.info(`Cloning content repository for dataset: ${options.dataset}`);
      cloneRepo();
      copyContent(
        `./frontend/portfolio-website/content/repo/content/publish`,
        `./frontend/portfolio-website/content/dist`,
      );
    },
    test: () => {
      logger.info("Using local test dataset, no cloning needed.");
      copyContent(
        `./frontend/portfolio-website/content/test`,
        `./frontend/portfolio-website/content/dist`,
      );
    },
    prev: () => {
      logger.info("Processing preview dataset...");
      logger.info(`Cloning content repository for dataset: ${options.dataset}`);
      cloneRepo();
      copyContent(
        `./frontend/portfolio-website/content/test`,
        `./frontend/portfolio-website/content/dist`,
      );
      copyContent(
        `./frontend/portfolio-website/content/repo/content/in-progress`,
        `./frontend/portfolio-website/content/dist`,
      );
    },
  };

  const TARGET_HOSTING_HANDLERS_MAP = {
    prod: () => {
      execSync(`npm --prefix ./frontend/portfolio-website run build`, {
        stdio: "inherit",
      });

      execSync(`npm --prefix ./frontend/portfolio-website run sitemap`, {
        stdio: "inherit",
      });

      execSync(`node ./frontend/portfolio-website/seo/indexnow`, {
        stdio: "inherit",
      });

      // Remove the "Host" line from robots.txt, as it is not needed for production hosting and can cause issues with some hosting providers
      fs.writeFileSync(
        "./frontend/portfolio-website/out/temp.txt",
        fs
          .readFileSync("./frontend/portfolio-website/out/robots.txt", "utf-8")
          .split("\n")
          .filter((line) => !line.startsWith("Host"))
          .join("\n"),
      );

      fs.renameSync(
        "./frontend/portfolio-website/out/temp.txt",
        "./frontend/portfolio-website/out/robots.txt",
      );
    },
    test: () => {
      execSync(`npm --prefix ./frontend/portfolio-website run build`, {
        stdio: "inherit",
      });
    },
  };

  cleanContentDist();

  logger.info("Build configuration:");
  logger.info(`Environment: ${options.env}`);
  logger.info(`Target Hosting: ${options["target-hosting"]}`);
  logger.info(`Dataset Source: ${options.dataset}`);

  DATASET_HANDLERS_MAP[options.dataset]();
  TARGET_HOSTING_HANDLERS_MAP[options["target-hosting"]]();
};

main();
