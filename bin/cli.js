#! /usr/bin/env node

// #! 符号的名称叫 Shebang，用于指定脚本的解释程序
// Node CLI 应用入口文件必须要有这样的文件头
// 如果是 Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 cli.js 实现修改

const pgk = require("../package.json");
const { Command } = require("commander");
const program = new Command();

program.usage("<commad> [option]");

// 注册创建命令
program
  .command("create")
  .alias("init")
  .description("Create a project")
  .argument("<project-name>", "Your project name")
  // 配置创建命令的选项 `-f` 和 `--force`，表示是否强制覆盖
  .option("-f, --force", "Overwrite target directory if it exists")
  .action((projectName, options) => {
    // 执行create.js
    const create = require("../lib/create");
    create(projectName, options);
  });

// 注册配置命令
program
  .command("config")
  .description("Inspect and modify the config")
  .option("-g, --get <key>", "Get value from option")
  .option("-s, --set <keyvalue...>", "Set option value")
  .option("-d, --delete <key>", "Delete option from config")
  .action((value) => {
    const config = require("../lib/config");
    config(value);
  });

// 查看版本命令，配置-v选项而不是默认的-V
program.version(pgk.version, "-v, --version");

// 解析用户执行的命令
program.parse(process.argv);
