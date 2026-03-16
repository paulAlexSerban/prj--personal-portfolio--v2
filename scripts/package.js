const fs = require("fs");
const path = require("path");
const logger = require("./utils/cli-logger");

const PACKAGE_DIR = path.join(__dirname, "..", "package");

const setupPackageDir = () => {
  logger.info("Setting up package directory...");
  fs.mkdirSync(PACKAGE_DIR, { recursive: true });
};

const packageProject = (project) => {
  logger.info(`Packaging project: ${project.name}`);
  const prjPackageDir = path.join(PACKAGE_DIR, project.name);

  fs.rmSync(prjPackageDir, { recursive: true, force: true });
  fs.mkdirSync(prjPackageDir, { recursive: true });
  fs.cpSync(path.join(project.sourcePath, project.outputDir), prjPackageDir, {
    recursive: true,
  });

  logger.success(`Project ${project.name} packaged successfully!`);
};

const PROJECTS = [
  {
    name: "portfolio-website",
    sourcePath: path.join(__dirname, "..", "frontend", "portfolio-website"),
    outputDir: "out",
  },
];

const main = () => {
  setupPackageDir();
  PROJECTS.forEach((project) => {
    packageProject(project);
  });
};

main();
