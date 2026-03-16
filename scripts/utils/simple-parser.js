/**
 * Parse command-line arguments into a structured object
 * @param {string[]} args - Raw arguments from process.argv.slice(2)
 * @returns {{options: Object, positional: string[], errors: string[]}}
 */
function parseArgs(args) {
  const result = {
    options: {},
    positional: [],
    errors: [],
  };

  let i = 0;
  let endOfOptions = false;

  while (i < args.length) {
    const arg = args[i];

    // Handle end-of-options marker
    if (arg === "--" && !endOfOptions) {
      endOfOptions = true;
      i++;
      continue;
    }

    // After --, everything is positional
    if (endOfOptions || !arg.startsWith("-")) {
      result.positional.push(arg);
      i++;
      continue;
    }

    // Long option with equals: --key=value
    if (arg.startsWith("--") && arg.includes("=")) {
      const [key, ...valueParts] = arg.slice(2).split("=");
      result.options[key] = valueParts.join("="); // Handle values with = in them
      i++;
      continue;
    }

    // Long option: --key or --key value
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];

      // Boolean flag if next arg is missing or is another option
      if (!nextArg || nextArg.startsWith("-")) {
        result.options[key] = true;
        i++;
      } else {
        result.options[key] = nextArg;
        i += 2;
      }
      continue;
    }

    // Short option(s): -a or -abc or -o value
    if (arg.startsWith("-")) {
      const flags = arg.slice(1);

      // Handle combined short flags: -abc means -a -b -c
      if (flags.length > 1 && !args[i + 1]?.startsWith("-")) {
        // Check if last flag might take a value
        const lastFlag = flags[flags.length - 1];
        const nextArg = args[i + 1];

        // If next arg exists and doesn't start with -, last flag gets value
        if (nextArg && !nextArg.startsWith("-")) {
          // Set all but last as boolean
          for (let j = 0; j < flags.length - 1; j++) {
            result.options[flags[j]] = true;
          }
          result.options[lastFlag] = nextArg;
          i += 2;
        } else {
          // All flags are boolean
          for (const flag of flags) {
            result.options[flag] = true;
          }
          i++;
        }
      } else {
        // Single short flag
        const flag = flags[0];
        const nextArg = args[i + 1];

        if (!nextArg || nextArg.startsWith("-")) {
          result.options[flag] = true;
          i++;
        } else {
          result.options[flag] = nextArg;
          i += 2;
        }
      }
      continue;
    }

    i++;
  }

  return result;
}

module.exports = { parseArgs };
