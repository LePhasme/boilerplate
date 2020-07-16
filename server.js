require('dotenv').config()
const express = require('express')
const multer = require('multer')
const multipart = multer()
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require(path.join(__dirname, 'webpack.config.js'))
const app = express()
const port = (process.env.SERVER_MODE === 'dev' ? process.env.DEV_PORT : process.env.PROD_PORT)
const devServerEnabled = (process.env.SERVER_MODE === 'dev' ? true : false)

if (devServerEnabled) {
  webpackConfig.entry.app.unshift('webpack-hot-middleware/client?reload=true&timeout=1000')
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  const compiler = webpack(webpackConfig)
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath
  }))
  app.use(webpackHotMiddleware(compiler))
}

app.use(express.static(path.join(__dirname, 'public')))

app.post('/api/add', multipart.any(), function(req, res) {
  const firstValue = parseInt(req.body.firstValue)
  const secondValue = parseInt(req.body.secondValue)
  const sum = firstValue + secondValue
  res.json({ sum: sum, firstValue: firstValue, secondValue: secondValue })
})

app.listen(port, () => {
  console.log('Server started on port:' + port)
})
