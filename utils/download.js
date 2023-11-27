const npminstall = require("npminstall");
const path = require("path");
const { HOME_DIR, CACHE_FILE_NAME } = require("./constant");

module.exports = async function download(name, version) {
  const cacheDirectory = path.resolve(HOME_DIR, CACHE_FILE_NAME);
  const cachePkgDir = path.resolve(cacheDirectory, 'node_modules');
  console.log('cacheDirectory: ', cacheDirectory);
  console.log('cachePkgDir: ', cachePkgDir);
  try {
    await npminstall({
      root: cacheDirectory,
      pkgs: [{ name, version }],
      storeDir: cachePkgDir
    });
    return [true, null];
  } catch (err) {
    return [false, err];
  }
};
