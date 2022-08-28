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
      '/': {
        target: process.env.VUE_APP_URL, // 動態環境
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
  chainWebpack: (config) => {
    // 去掉debugger console
    config.when(process.env.NODE_ENV !== "development", config => {
      config.optimization.minimizer('terser').tap((args) => {
        // 注释console.*
        args[0].terserOptions.compress.drop_console = true
        // remove debugger
        args[0].terserOptions.compress.drop_debugger = true
        // 移除 console.log
        args[0].terserOptions.compress.pure_funcs = ['console.log']
        // 去掉注释 如果需要看chunk-vendors公共部分插件，可以注释掉就可以看到注释了
        args[0].terserOptions.output = {
          comments: false
        };
        return args
      })
    })
  }
};