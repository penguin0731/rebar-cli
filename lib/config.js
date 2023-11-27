

module.exports = function config(options) {
  const config = {};

  // 没有任何操作则直接将整个配置返回
  if (!options.get && !options.set && !options.delete) {
    console.log(JSON.stringify(config));
  }

  // 读取
  if (options.get) {
    console.log(config[options.get]);
  }

  // 删除
  if (options.delete) {
    console.log(`You have removed the option: ${options.delete}`);
  }

  // 写入
  if (options.set && options.set.length > 0) {
    const key = options.set[0];
    const value = options.set[1];
    if (!value) {
      console.warn(
        `Make sure you define a value for the option ${key}`
      );
    } else {
      if (value.match("[0-9]")) {
        config[key] = parseInt(value);
      }
      if (value === "true") {
        config[key] = true;
      }
      if (value === "false") {
        config[key] = false;
      }

      console.log(`You have updated the option: ${key} to ${value}`);
    }
  }
};
