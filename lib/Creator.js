const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const ejs = require("ejs");

const { spinnerStart } = require("../utils/spinner");

const Template = require("./Template.js");
const ConfigOperator = require("./ConfigOperator.js");
const { readJSON, isFileExist } = require("../utils/index.js");

class Creator {
  constructor(name, targetDir) {
    // 项目名称
    this.name = name;
    // 目标目录
    this.targetDir = targetDir;
    // 模板根目录
    this.templateRoot = "";
    this.configOperator = new ConfigOperator();
  }

  async create() {
    const { templates: choices } = this.configOperator.completeData;
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

    console.log();
    console.log(`🎉 Successfully created project ${chalk.cyan(this.name)}`);
    console.log(`cd ${chalk.cyan(this.name)}`);
    console.log(
      "Read the README.md and follow the guide to install dependencies and run serve"
    );
    console.log();
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
    let dir = path.resolve(this.tempIns.getCacheDir(), "node_modules");
    // 来自组织的包需要加一层org路径
    if (this.tempIns.isOrg) {
      dir = path.resolve(dir, this.tempIns.org);
    }
    // 完整的模板根目录
    // homeDir/.rebar-cli/node_modules/.store/[@org]+pkgName@version/node_modules/[@org]/pkgName
    this.templateRoot = path.resolve(dir, `${this.tempIns.pkgName}`);
    // 进入到模板目录
    const templateDir = path.resolve(this.templateRoot, "template");
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
  renderTemplate() {
    return new Promise((resolve) => {
      const defaultRenderFiles = [
        "package.json",
        "index.html",
        "public/index.html",
      ];
      const extraRenderFilesPath = path.resolve(
        this.templateRoot,
        "renderFiles.json"
      );
      const data = readJSON(extraRenderFilesPath);
      let extraRenderFiles =
        data && Array.isArray(data.files) ? data.files : [];
      const renderFiles = new Set([...defaultRenderFiles, ...extraRenderFiles]);
      console.log(renderFiles);
      renderFiles.forEach(async (file) => {
        const renderFilePath = path.resolve(this.targetDir, file);
        console.log(renderFilePath);
        const boolean = isFileExist(renderFilePath);
        console.log(boolean);
        if (!boolean) return;
        const data = await ejs.renderFile(renderFilePath, {
          projectName: this.name,
        });
        fs.writeFileSync(renderFilePath, data);
        resolve();
      });
    });
  }
}

module.exports = Creator;
