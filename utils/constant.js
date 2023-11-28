const HOME_DIR = process.env.HOME; // 用户根目录
const CACHE_FILE_NAME = ".rebar-cli"; // 缓存根目录名称
const DEFAULT_REGISTRY = 'https://registry.npmjs.org/'; // 默认源地址
const CONFIG_FILE_NAME = ".rebarrc" // 配置文件的名称
const DEFAULT_TEMPLATES = [ // 默认模板列表
  {
    name: 'vue3-admin',
    value: '@rebar-cli/vue3-admin-template'
  },
  {
    name: 'vue3-mobile',
    value: '@rebar-cli/vue3-mobile-template'
  }
]

module.exports = {
  HOME_DIR,
  CACHE_FILE_NAME,
  DEFAULT_REGISTRY,
  CONFIG_FILE_NAME,
  DEFAULT_TEMPLATES
};
