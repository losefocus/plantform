// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
// var baseUrl = 'http://test1.iot.v/';
// var baseUrl = 'http://192.168.0.232/';
var baseUrl = `http://localhost:9999/`
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 9991,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    host: '0.0.0.0',
    //host: 'localhost',
    assetsPublicPath: '/',
    proxyTable: {
      '/auth': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/auth': '/auth'
        }
      },
      '/tenant': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/tenant': '/tenant'
        }
      },
      '/admin': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/admin': '/admin',
        }
      },
      '/project': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/project': '/project'
        }
      },
      '/file': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/file': '/file'
        }
      },
      '/zuul': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/zuul': '/zuul'
        }
      },
      '/device': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/device': '/device'
        }
      },
      '/product': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/product': '/product'
        }
      },
      '/notification': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/notification': '/notification'
        }
      },
      '/certificate': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/certificate': '/certificate'
        }
      },
    },
    cssSourceMap: false
  }
}
