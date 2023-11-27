const inquirer = require("inquirer");
const chalk = require("chalk");
const downloadGitRepo = require("download-git-repo");
const { getRebarRepo } = require("../utils/api");
const { spinnerStart } = require("../utils/spinner");

class Creator {
  constructor(name, target) {
    this.name = name;
    this.target = target;
  }

  async create() {
    const repo = await this.getRepoInfo();
    if (!repo) {
      return;
    }
    await this.download(repo);
    console.log();
    console.log(`🎉 Successfully created project ${chalk.cyan(this.name)}`);
    console.log(`cd ${chalk.cyan(this.name)}`);
    console.log(
      "Read the README.md and follow the guide to install dependencies and run serve"
    );
    console.log();
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
