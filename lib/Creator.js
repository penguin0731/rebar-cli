const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const ejs = require("ejs");

const { spinnerStart } = require("../utils/spinner");

const Template = require("./Template.js");
const ConfigOperator = require("./ConfigOperator.js");

class Creator {
  constructor(name, targetDir) {
    this.name = name;
    this.targetDir = targetDir;
    this.configOperator = new ConfigOperator();
    this.configOperator.check();
  }

  async create() {
    const { templates: choices } = this.configOperator.configData;
    const { templateName } = await inquirer.prompt([
      {
        type: "list",
        message: "Check a template: ",
        name: "templateName",
        choices,
      },
    ]);
    this.tempIns = new Template({
      // templateName: "@rebar-cli/templates",
      // templateName: "test-rebar-templates",
      templateName,
      templateVersion: "latest",
    });
    await this.downloadTemplate();
    this.installTemplate();
    await this.renderTemplate();

    // console.log();
    // console.log(`🎉 Successfully created project ${chalk.cyan(this.name)}`);
    // console.log(`cd ${chalk.cyan(this.name)}`);
    // console.log(
    //   "Read the README.md and follow the guide to install dependencies and run serve"
    // );
    // console.log();
  }

  // 下载模板
  async downloadTemplate() {
    // 查看模板是否已经下载
    let isExist = await this.tempIns.exist();
    // 已下载则跳过
    if (isExist) return;
    // 未下载则进行下载
    await this.tempIns.download();
    // 重新判断
    isExist = await this.tempIns.exist();
    if (isExist) {
      console.log("模板下载成功");
    }
  }

  // 安装模板
  installTemplate() {
    const targetDir = this.targetDir;
    let templateDir = path.resolve(this.tempIns.getCacheDir(), "node_modules");
    // 来自组织的包需要加一层org路径
    if (this.tempIns.isOrg) {
      templateDir = path.resolve(templateDir, this.tempIns.org);
    }
    // 完整的目录
    // homeDir/.rebar-cli/node_modules/.store/[@org]+pkgName@version/node_modules/[@org]/pkgName
    templateDir = path.resolve(templateDir, `${this.tempIns.pkgName}/template`);
    console.log(`目标目录：${targetDir}`);
    console.log(`模板目录：${templateDir}`);
    const spinner = spinnerStart("模板安装中...");
    try {
      // 确保目录是否存在，若不存在则自动创建
      fs.ensureDirSync(targetDir);
      fs.ensureDirSync(templateDir);
      // 复制文件或目录
      fs.copySync(templateDir, targetDir);
      spinner.succeed("模板安装成功！");
    } catch (err) {
      spinner.fail(JSON.stringify(err));
    }
  }

  // 渲染模板
  async renderTemplate() {
    const pkgjson = path.resolve(this.targetDir, "package.json");
    const data = await ejs.renderFile(pkgjson, { projectName: this.name });
    fs.writeFileSync(pkgjson, data);
  }
}

module.exports = Creator;
