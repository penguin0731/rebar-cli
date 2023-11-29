const { getPrettyJson } = require("../utils");
const ConfigOperator = require("./ConfigOperator");

/**
 * 配置config命令
 * @param {Object} options 选项
 * @returns 
 */
module.exports = function config(options) {
  const configOperator = new ConfigOperator();
  const { completeData } = configOperator;

  // 没有任何操作则直接将整个配置返回
  if (!options.get && !options.set && !options.delete) {
    console.log(getPrettyJson(completeData));
  }

  // 读取
  if (options.get) {
    console.log(configOperator.get(options.get));
  }

  // 删除
  if (options.delete) {
    const result = configOperator.delete(options.delete);
    if (!result) return;
    console.log(`You have removed the option: ${options.delete}`);
  }

  // 写入
  if (options.set && options.set.length > 0) {
    const key = options.set[0];
    const value = options.set[1];
    if (!value) {
      console.warn(`Make sure you set a value for the option ${key}`);
    } else {
      let result = false;

      switch (value) {
        // 如果有数字则转化为数字
        case value.match("[0-9]"):
          result = configOperator.set(key, parseInt(value));
          break;
        // 布尔字符串转化为布尔值
        case "true":
          result = configOperator.set(key, true);
          break;
        case "false":
          result = configOperator.set(key, false);
          break;
        // 其余情况正常赋值
        default:
          result = configOperator.set(key, value);
          break;
      }

      if (!result) return;
      console.log(`You have updated the option: ${key} to ${value}`);
    }
  }
};
