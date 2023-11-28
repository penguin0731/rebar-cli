const { request } = require("./request.js");
const { DEFAULT_REGISTRY } = require("./constant.js");

/**
 * 获取npm包信息
 * @param {String} pkgName 完整包名
 * @param {String} registry 源地址
 * @returns npm包信息
 */
async function getNpmInfo(pkgName, registry = DEFAULT_REGISTRY) {
  try {
    const url = registry + pkgName;
    const res = await request.get(url);
    return res;
  } catch (err) {
    return Promise.reject(new Error(`获取模板信息失败：${err}`))
  }
}

/**
 * 获取npm包的最新版本号
 * @param {String} pkgName 完整包名
 * @param {String} registry 源地址
 * @returns npm包的最新版本号
 */
async function getNpmLatestVersion(pkgName, registry = DEFAULT_REGISTRY){
  const data = await getNpmInfo(pkgName, registry);
  if (data.error) return '';
  const distTags = data['dist-tags'];
  return distTags.latest;
}

module.exports = {
  getNpmInfo,
  getNpmLatestVersion
};
