require('dotenv').config();
const express = require('express');
const multer = require('multer');
const multipart = multer();
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const basePath = path.resolve(__dirname, '..', '..');
const webpackConfig = require(path.join(basePath, 'webpack.config.js'));
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const port = process.env.SERVER_MODE === 'dev' ? process.env.DEV_PORT : process.env.PROD_PORT;
const devServerEnabled = process.env.SERVER_MODE === 'dev' ? true : false;
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./.scratch');

function allStorage() {
  let values = {},
    keys = localStorage._keys, // Object.keys(localStorage),
    i = keys.length;
  while (i--) {
    values[keys[i]] = localStorage.getItem(keys[i]);
  }
  return values;
}
// localStorage.setItem('myFirstKey', 'myFirstValue');
// console.log(localStorage.getItem('myFirstKey'));

if (devServerEnabled) {
  webpackConfig.entry.app.unshift('webpack-hot-middleware/client?reload=true&timeout=1000');
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  const compiler = webpack(webpackConfig);
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
    }),
  );
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.join(basePath, 'public')));

app.post('/api/add', multipart.any(), function (req, res) {
  const firstValue = parseInt(req.body.firstValue);
  const secondValue = parseInt(req.body.secondValue);
  const sum = firstValue + secondValue;
  res.json({ sum: sum, firstValue: firstValue, secondValue: secondValue });
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('init', allStorage());
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(port, () => {
  console.log('Server started on port:' + port);
});
