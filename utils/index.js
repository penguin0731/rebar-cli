/**
 * 睡眠函数
 * @param {number} time 睡眠时间
 */
exports.sleep = function (time = 1000) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resolve();
    }, time);
  });
};
