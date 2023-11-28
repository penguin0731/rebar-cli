const path = require("path");
const fs = require("fs-extra");
const npminstall = require("npminstall");
const { HOME_DIR, CACHE_FILE_NAME } = require("../utils/constant");
const { getNpmLatestVersion } = require("../utils/npm");

class Template {
  constructor(options) {
    const { templateName, templateVersion } = options;
    // 完整的模板名称（可能包含组织名称）
    this.name = templateName;
    // 版本
    this.version = templateVersion;
    // 组织名称
    this.org = '';
    // 模板名称
    this.pkgName = this.name;
    // 缓存根目录 .rebar-cli
    this.cacheDir = path.resolve(HOME_DIR, CACHE_FILE_NAME);
    // 模板的缓存目录
    this.templatesDir = path.resolve(this.cacheDir, `node_modules/.store`);
    // 如果是组织
    this.ifOrg();
  }

  ifOrg() {
    // 是否属于组织
    this.isOrg = this.name.indexOf("@") === 0 && this.name.includes("/");
    if (this.isOrg) {
      const [org, pkgName] = this.name.split("/");
      this.org = org;
      this.pkgName = pkgName;
    }
  }

  // 获取模板的最新版本号
  async getLatestVersion() {
    this.latestVersion = await getNpmLatestVersion(this.name);
    // 如果传入的是 latest 字面量，则更新为最新版本号
    if (this.version === "latest") {
      this.version = this.latestVersion;
    }
  }

  // 获取指定版本号的模板的缓存目录
  getCacheDir(version = this.version) {
    // 缓存模板的目录格式：[组织名+]包名@版本号
    const templateFileName = `${this.org && this.org + '+'}${this.pkgName}@${version}`;
    return path.resolve(this.templatesDir, templateFileName);
  }

  // 判断模板是否已下载
  async exist() {
    // 获取需要下载的模板版本号
    await this.getLatestVersion();
    const cachePath = this.getCacheDir();
    const result = fs.existsSync(cachePath);
    console.log(`模板缓存目录：${cachePath} ${result ? "存在" : "不存在"}`);
    return result;
  }

  // 下载模板
  async download() {
    await this.getLatestVersion();
    console.log(`当前模板：${this.name}，版本：${this.version}`);
    try {
      await npminstall({
        root: this.cacheDir,
        pkgs: [{ name: this.name, version: this.version }],
      });
    } catch (err) {
      console.log(err);
    }
  }


}

module.exports = Template;
