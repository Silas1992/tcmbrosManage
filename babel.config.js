const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
module.exports = {
  'presets': [
    '@vue/cli-plugin-babel/preset',
    
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ]
  ],
  
}
 
new CompressionWebpackPlugin({
  algorithm: 'gzip',
  test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
  threshold: 10240,
  minRatio: 0.8
})
