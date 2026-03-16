/**
 * Minimal ANSI color support without dependencies
 */

// ANSI escape codes
const CODES = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",

  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",

  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
};

/**
 * Check if colors should be enabled
 */
function shouldUseColor(stream = process.stdout) {
  // Explicit disable via NO_COLOR environment variable (https://no-color.org/)
  if ("NO_COLOR" in process.env) {
    return false;
  }

  // Check if output is a TTY
  if (!stream.isTTY) {
    return false;
  }

  // Windows Terminal, ConEmu, and modern terminals support colors
  return true;
}

/**
 * Apply ANSI code to text if colors are enabled
 */
function colorize(text, code, stream = process.stdout) {
  if (!shouldUseColor(stream)) {
    return text;
  }
  return `${code}${text}${CODES.reset}`;
}

// Export color functions
const colors = {
  red: (text) => colorize(text, CODES.red),
  green: (text) => colorize(text, CODES.green),
  yellow: (text) => colorize(text, CODES.yellow),
  blue: (text) => colorize(text, CODES.blue),
  cyan: (text) => colorize(text, CODES.cyan),
  magenta: (text) => colorize(text, CODES.magenta),
  bold: (text) => colorize(text, CODES.bold),
  dim: (text) => colorize(text, CODES.dim),

  error: (text) => colorize(`❌ ${text}`, CODES.red, process.stderr),
  success: (text) => colorize(`✅ ${text}`, CODES.green),
  warning: (text) => colorize(`⚠️ ${text}`, CODES.yellow, process.stderr),
  info: (text) => colorize(`ℹ️ ${text}`, CODES.cyan),
};

/**
 * Example usage in CLI
 */
function exampleUsage() {
  console.log(colors.success("Operation completed successfully"));
  console.error(colors.error("Something went wrong"));
  console.error(colors.warning("This is a warning"));
  console.log(colors.info("Processing file..."));
  console.log(
    `${colors.bold("Important:")} ${colors.cyan("Read the documentation")}`,
  );
}

if (require.main === module) {
  exampleUsage();
}

module.exports = colors;
