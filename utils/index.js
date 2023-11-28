const fs = require("fs-extra");

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

/**
 * 解析json格式文件
 * @param {String} path
 * @returns
 */
exports.jsonFileToObject = function (path) {
  const buffer = fs.readFileSync(path);
  try {
    const data = JSON.parse(buffer.toString());
    return data;
  } catch (err) {
    // 如果解析异常则直接返回空对象
    return {};
  }
};
