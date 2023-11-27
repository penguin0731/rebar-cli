const axios = require("axios");

const request = axios.create({
  timeout: 10 * 1000,
});

request.interceptors.response.use((res) =>
  res.status === 200 ? res.data : null
);

/**
 * 获取仓库信息
 * @returns 仓库信息
 */
function getRebarRepo() {
  return request.get("https://api.github.com/orgs/rebar-cli/repos");
}

module.exports = {
  request,
  getRebarRepo,
};
