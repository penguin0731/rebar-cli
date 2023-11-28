const axios = require("axios");

const request = axios.create({
  timeout: 10 * 1000,
});

request.interceptors.response.use((res) =>
  res.status === 200 ? res.data : null
);

module.exports = {
  request
};
