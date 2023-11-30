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
exports.readJSON = function (path) {
  try {
    return fs.readJSONSync(path);
  } catch (err) {
    // 如果解析异常则直接返回空
    return null;
  }
};

/**
 * 将json对象转换成带缩进的json字符
 * @param {Object} data json对象
 * @returns 格式化后的json字符串
 */
exports.getPrettyJson = function (data) {
  return JSON.stringify(data, null, 2);
};

/**
 *  文件是否存在/可读写
 * @param {String} path 文件路径
 * @returns Boolean
 */
exports.isFileExist = function (path) {
  try {
    fs.accessSync(path);
    return true;
  } catch (err) {
    return false;
  }
};
