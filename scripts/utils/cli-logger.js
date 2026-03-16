const colors = require("./terminal-colors");

const logger = {
  info: (message) => {
    console.log(colors.info(message));
  },
  success: (message) => {
    console.log(colors.success(message));
  },
  warning: (message) => {
    console.warn(colors.warning(message));
  },
  error: (message) => {
    console.error(colors.error(message));
  },
};

module.exports = logger;
