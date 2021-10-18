const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: '',
  devServer: {
    open: true,
    https: false,
    //以上的ip和埠號是我們本機的;下面為需要跨域的
    proxy: {    //配置跨域
      '/api': {
        // target: 'https://test.hichat.tools/', //這裡後台的地址模擬的，應該填寫真實的後台api
        target: 'https://pre.hichat.tools/', // pre環境
        ws: false,     // 如果要代理 websockets
        changOrigin: true,  //允許跨域
      },
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '_api': resolve('src/api'),
        '_util': resolve('src/libs/utils'),
      }
    }
  },
};