const { name } = require('./package');

module.exports = {
  publicPath: '/module-blog/',
  devServer: {
    port: 9001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  // 自定义webpack配置
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把子应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },

  chainWebpack: config => {
    config.module
      .rule('text')
      .test(/\.txt$/)
      .use('text-loader')
      .loader('text-loader')
      .end();
  },
};
