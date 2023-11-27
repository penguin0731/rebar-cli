const npminstall = require("npminstall");

module.exports = function download() {
  npminstall({
    root: process.cwd()
  })
}