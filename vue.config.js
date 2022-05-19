const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: '',
  devServer: {
    open: true,
    https: false,
    // 以上的ip和埠号是我们本机的;下面为需要跨域的
    proxy: {    //配置跨域
<<<<<<< HEAD
      '/api': {
        target: 'https://test.hichat.tools/', // test環境
        // target: 'https://pre.hichat.tools/', // pre環境
=======
      '/': {
        target: process.env.VUE_APP_URL, // 動態環境
>>>>>>> feat/hichat-web
        ws: false,     // 如果要代理 websockets
        changOrigin: true,  // 允许跨域
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