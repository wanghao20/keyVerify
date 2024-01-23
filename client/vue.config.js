const path = require('path')
const name = 'Ec'

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/Ec/' : '/', // (打包环境)
    lintOnSave: process.env.NODE_ENV === 'development',// (开发环境)
    pwa: {
        name: name
    },
    publicPath: "./", // 构建好的文件输出到哪里

    outputDir: "dist", // where to put static assets (js/css/img/font/...) // 是否在保存时使用‘eslint-loader’进行检查 // 有效值: true | false | 'error' // 当设置为‘error’时，检查出的错误会触发编译失败

    lintOnSave: true, // 使用带有浏览器内编译器的完整构建版本 // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only

    runtimeCompiler: false, // babel-loader默认会跳过`node_modules`依赖. // 通过这个选项可以显示转译一个依赖
    // 是否为生产环境构建生成sourceMap?
    productionSourceMap: false,
    devServer: {
        open: process.platform === "darwin",

        disableHostCheck: false,

        host: "127.0.0.1",

        port: 8000,

        https: false,

        hotOnly: false, // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy

        proxy: null // string | Object

        // before: app => {}
    },
    // CSS 相关选项yarn start
    
    css: {
        // 将组件内部的css提取到一个单独的css文件（只用在生产环境）

        // 也可以是传递给 extract-text-webpack-plugin 的选项对象

        extract: true, // 允许生成 CSS source maps?
        sourceMap: false, // pass custom options to pre-processor loaders. e.g. to pass options to // sass-loader, use { sass: { ... } }

        loaderOptions: {}, // Enable CSS modules for all css / pre-processor files. // This option does not affect *.vue files.

    }, 
    configureWebpack: {
        devtool: 'source-map'
    },
    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'scss', 
        patterns: [
          path.resolve(__dirname, 'src/styles/_variables.scss'),
          path.resolve(__dirname, 'src/styles/_mixins.scss')
       
        ]
      },
      i18n: {
        locale: 'en',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableInSFC: true
      }
    },
    chainWebpack(config) {
        // 在webpack的名称字段中提供应用程序的标题，以便
        // 可以在index.html中对其进行访问以注入正确的标题。
        config.set('name', name)
    }
}
