const fs = require("fs-extra");
const path = require("path");
const {
  HOME_DIR,
  CACHE_FILE_NAME,
  CONFIG_FILE_NAME,
  DEFAULT_TEMPLATES,
} = require("../utils/constant");
const { jsonFileToObject } = require("../utils");

class ConfigOperator {
  constructor() {
    // 缓存目录
    this.cacheDir = path.resolve(HOME_DIR, CACHE_FILE_NAME);
    // 配置文件名称
    this.configFile = path.resolve(this.cacheDir, CONFIG_FILE_NAME);
    // 配置文件内容
    this.configData = {};
  }

  // 检查配置文件
  check() {
    fs.ensureFileSync(this.configFile);
    // 获取配置文件内容
    const data = jsonFileToObject(this.configFile);
    // 如果是空则写入默认模板列表
    if (!data.templates || (Array.isArray(data.templates) && data.templates.length === 0)) {
      data.templates = DEFAULT_TEMPLATES;
      fs.writeFileSync(this.configFile, JSON.stringify(data));
    }
    // 同步配置文件内容
    this.configData = data;
  }
}

module.exports = ConfigOperator;
