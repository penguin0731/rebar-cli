const inquirer = require("inquirer");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra"); // fs模块的扩展版
const Creator = require("./Creator");

/**
 * 创建命令
 * @param {string} projectName 项目名称
 * @param {Object} options 创建命令的配置项
 * @param {string} options.force 是否强制覆盖
 * @returns
 */
module.exports = async function create(projectName, options) {
  // 当前命令行执行路径
  const cwd = process.cwd();
  // 是否在当前目录中创建模板
  const inCurrent = projectName === ".";
  // 目录名称（若是在当前目录中创建模板 ? 获取当前目录名称 : 使用命令行传的目录名称）
  // path.relative(a, b) -> a目录到b目录的相对路径
  const name = inCurrent ? path.relative("../", cwd) : projectName;
  // 目录的绝对路径
  const targetDir = path.join(cwd, projectName);
  // 需要创建的目录是否已存在
  const isTargetDirExist = fs.existsSync(targetDir);
  const { force } = options;

  if (isTargetDirExist) {
    if (force) {
      fs.removeSync(targetDir);
    } else {
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite", // key
          message: `Target directory ${chalk.cyan(
            targetDir
          )} already exists. Do you wanna overwrite this directory?`, // 提示信息
        },
      ]);
      if (!overwrite) return;
      fs.removeSync(targetDir);
    }
  }

  const creator = new Creator(name, targetDir);
  creator.create();
};
