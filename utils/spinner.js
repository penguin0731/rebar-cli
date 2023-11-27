const ora = require("ora");

/**
 * 启动spinner加载状态
 * @param {String} message 加载信息
 * @returns spinner实例
 */
exports.spinnerStart = function (message) {
  const spinner = new ora(message);
  spinner.start();
  return spinner;
};
