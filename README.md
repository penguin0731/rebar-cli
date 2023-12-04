# rebar-cli

## 介绍

rebar-cli 是一个简单的脚手架工具，能够帮助你快速生成前端代码，脚手架内置多个模板，也支持扩展自定义模板，包括但不限于公司沉淀的各平台前端解决方案、插件开发模板、组件库开发模板等。

rebar 有「钢筋」的意思，钢筋在土地工程中起到的是建立楼体的作用，正如脚手架在前端的作用是快速搭建一个雏形的项目。

## 快速上手

### 安装

```shell
npm i rebar-cli -g
```

安装完成后，在命令行中输入 `rebar`或 `rebar -h` 即可查看到帮助信息，证明安装成功。

```shell
Usage: rebar <commad> [option]

Options:
  -v, --version                         output the version number
  -h, --help                            display help for command

Commands:
  create|init [options] <project-name>  Create a project
  config [options]                      Inspect and modify the config
  help [command]                        display help for command
```

### 创建第一个项目

在命令行输入 `rebar create <project-name>`即可创建项目。

```shell
rebar create my-app
```

我们也设置了 create 命令的别名，如：

```shell
rebar init my-app
```

## 配置

通过一下命令可以查看当前脚手架的配置：

```
rebar config
```

### --get, -g \<key>

获取指定配置。

### --set, -s \<key> \<value>

修改指定配置。

### --delete, -d \<key>

删除指定配置。

## 配置字段说明

### templates

模板列表，它是一个对象数组，里面有 name、value 字段，分别表示选项名称以及包名。

#### 示例

```json
{
  "templates": [
    {
      "name": "模板名称选项",
      "value": "包名"
    }
  ]
}
```

### root

配置和缓存存储的目录，默认为用户根目录

#### 示例

```json
{
  "root": "/Users/admin"
}
```

### registry

源地址，默认为 npm 源。

#### 示例

```json
{
  "registry": "https://registry.npmjs.org/"
}
```

