const path = require('path')

const TerserWebpackPlugin = require('terser-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const keys = require('lodash.keys')
const os = require('os')
const webpack = require('webpack')

const createThemeColorReplacerPlugin = require('./plugins/theme.plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const envConfig = require('./src/config/env.config')

const isOnline = !['local'].includes(process.env.mode)
const isProduction = ['prod'].includes(process.env.mode)

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.6/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.3.0/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js'
  ]
}

const productionGzipExtensions = ['js', 'css', 'json', 'txt', 'html', 'ico', 'svg']

// vue.config.js
const vueConfig = {
  configureWebpack: config => {
    // webpack plugins
    config.plugins.push(
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      createThemeColorReplacerPlugin()
    )

    if (isOnline) {
      config.plugins.push(
        // 开启压缩
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        }),
        new TerserWebpackPlugin({
          sourceMap: false,
          parallel: false,
          terserOptions: {
            compress: {
              drop_debugger: isProduction,
              drop_console: isProduction,
              pure_funcs: [] // 移除console
            },
            beautify: false,
            comments: false,
            keep_classnames: false,
            output: {
              comments: false,
            }
          }
        })
      )

      config.performance = {
        hints: 'warning',
        // 入口起点的最大体积 整数类型（以字节为单位 500k）.
        maxEntrypointSize: 500 * 1024,
        // 生成文件的最大体积 整数类型（以字节为单位 300k）.
        maxAssetSize: 300 * 1024,
        // 只给出 js 文件的性能提示.
        assetFilter: function(assetFilename) {
          return assetFilename.endsWith('.js')
        }
      }
    }

    // if prod, add externals
    config.externals = isOnline ? assetsCDN.externals : {}
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    config.plugin('define').tap(args => {
      keys(envConfig[process.env.mode]).forEach(key => {
        args[0]['process.env'][key] = JSON.stringify(envConfig[process.env.mode][key])
      })
      return args
    })

    if (isOnline) {
      // 删除预加载
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')

      config.output.filename('[name].[hash].js').end()

      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
    }
  },

  css: {
    sourceMap: false,
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            // less vars，customize ant design theme

            // 'primary-color': '#F5222D',
            // 'link-color': '#F5222D',
            'border-radius-base': '2px'
          },
          // DO NOT REMOVE THIS LINE
          javascriptEnabled: true
        }
      }
    }
  },

  devServer: {
    // development server port 3000
    port: 3000,
    proxy: {
      '/api2': {
        target: envConfig[process.env.mode].BASE_API_2, // 请求本地需要后台项目
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '/api2': '' // 默认所有请求都加了 api 前缀, 需要去掉
        }
      },
      '/api': {
        target: envConfig[process.env.mode].BASE_API, // 请求本地需要后台项目
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '/api': '' // 默认所有请求都加了 api 前缀, 需要去掉
        }
      }
    }
  },
  parallel: os.cpus().length > 1,
  // 如果你不需要生产环境的 source map, 可以将其设置为 false 以加速生产环境构建.
  productionSourceMap: false,
  lintOnSave: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: ['vue-plyr']
}

module.exports = vueConfig