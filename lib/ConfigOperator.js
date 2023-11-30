const fs = require("fs-extra");
const path = require("path");
const {
  HOME_DIR,
  CACHE_FILE_NAME,
  CONFIG_FILE_NAME,
  DEFAULT_TEMPLATES,
  DEFAULT_REGISTRY,
} = require("../utils/constant");
const { readJSON, getPrettyJson } = require("../utils");

class ConfigOperator {
  constructor() {
    // 缓存目录
    this.cacheDir = path.resolve(HOME_DIR, CACHE_FILE_NAME);
    // 配置文件路径
    this.filepath = path.resolve(this.cacheDir, CONFIG_FILE_NAME);
    // 默认配置
    this.defaultData = {
      templates: DEFAULT_TEMPLATES,
      root: HOME_DIR,
      cacheFileName: CACHE_FILE_NAME,
      configFileName: CONFIG_FILE_NAME,
      registry: DEFAULT_REGISTRY,
    };
    // 本地配置
    this.localData = {};
    // 完整的配置（合并了默认配置和本地配置）
    this.completeData = {};
    this.check();
  }

  // 检查配置文件
  check() {
    fs.ensureFileSync(this.filepath);
    // 获取本地配置
    this.localData = readJSON(this.filepath);
    // 如果是空则写入默认配置
    if (!this.localData) {
      this.writeFile(this.defaultData);
      this.localData = this.defaultData;
    }
    // 合并默认配置和本地配置，得到完整配置
    this.completeData = Object.assign(this.defaultData, this.localData);
  }

  // 写入配置文件
  writeFile(data) {
    fs.writeFileSync(this.filepath, getPrettyJson(data));
  }

  // key是否有效
  validateKey(key) {
    const keys = Object.keys(this.defaultData);
    if (!keys.includes(key)) {
      console.log(`This key 「${key}」 is not avaliable in the config file.`);
      return false;
    }
    return true;
  }

  get(key) {
    // 从完整配置中获取
    return Reflect.get(this.completeData, key)
  }

  set(key, value) {
    // 将更新的配置写入到本地配置中
    const result = Reflect.set(this.localData, key, value);
    this.completeData = Object.assign(this.defaultData, this.localData);
    this.writeFile(this.localData);
    return result;
  }

  delete(key) {
    // 只删除本地配置中的配置项
    const result = Reflect.deleteProperty(this.localData, key);
    this.completeData = Object.assign(this.defaultData, this.localData);
    this.writeFile(this.localData);
    return result;
  }
}

module.exports = ConfigOperator;
