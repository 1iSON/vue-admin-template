const urlList = [
  'https://lms.xspace.link:30443', // 0
  'https://ums.xspace.org.cn' // 1
]

const index = 0;
const baseUrl = urlList[index];
const config = {
  // 登录
  login: `${baseUrl}/lmuser/login`,
  // 模型文件管理 - 列表
  queryByPageDetail: `${baseUrl}/scene/queryByPageDetail`,

}
// export default config
module.exports = {
  config,
  baseUrl,
}
