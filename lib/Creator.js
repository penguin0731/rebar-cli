const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const ejs = require("ejs");
const downloadGitRepo = require("download-git-repo");
const { getRebarRepo } = require("../utils/api");
const { spinnerStart } = require("../utils/spinner");
const download = require("../utils/download");
const Templator = require("./Templator.js");

class Creator {
  constructor(name, targetDir) {
    this.name = name;
    this.targetDir = targetDir;
  }

  async create() {
    this.tempIns = new Templator({
      // templateName: "@rebar-cli/templates",
      templateName: "test-rebar-templates",
      templateVersion: "latest",
    });
    await this.downloadTemplate();
    this.installTemplate();
    await this.renderTemplate();

    // const repo = await this.getRepoInfo();
    // if (!repo) {
    //   return;
    // }
    // await this.download(repo);
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
    templateDir = path.resolve(
      templateDir,
      `${this.tempIns.pkgName}/template`
    );
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

  async getRepoInfo() {
    try {
      const spinner = spinnerStart("Fetching templates...");
      const repoList = await getRebarRepo();
      spinner.succeed();
      // console.clear();
      const repos = repoList.map((item) => item.name);
      const { repo } = await inquirer.prompt([
        {
          name: "repo",
          type: "list",
          message: "Please pick a template:",
          choices: repos,
        },
      ]);
      return repo;
    } catch (error) {
      spinner.fail("Fetching failed.");
    }
  }

  download(repo) {
    return new Promise((resolve) => {
      const repository = `rebar-cli/${repo}`;
      const destination = this.target;
      const spinner = spinnerStart("Downloading template, please wait.");
      const timer = setTimeout(() => {
        spinner.fail("Download timeout.");
        process.exit();
      }, 10 * 1000);
      downloadGitRepo(repository, destination, (err) => {
        if (err) {
          spinner.fail("Download failed.");
          process.exit();
        }
        clearTimeout(timer);
        spinner.succeed("Download succeed!");
        resolve();
      });
    });
  }
}

module.exports = Creator;
