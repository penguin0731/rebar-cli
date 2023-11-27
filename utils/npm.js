const { request } = require("./api.js");
const { DEFAULT_REGISTRY } = require("./constant.js");

async function getNpmInfo(pkgName, registry = DEFAULT_REGISTRY) {
  try {
    const url = registry + pkgName;
    const res = await request.get(url);
    return res;
  } catch (err) {
    return Promise.reject(new Error(`获取模板信息失败：${err}`))
  }
}

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
