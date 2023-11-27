const axios = require("axios");

const instance = axios.create({
  timeout: 10 * 1000,
});

instance.interceptors.response.use((res) => res.data);

/**
 * 获取仓库信息
 * @returns 仓库信息
 */
function getRebarRepo() {
  return instance.get("https://api.github.com/orgs/rebar-cli/repos");
}

module.exports = {
  getRebarRepo,
};
