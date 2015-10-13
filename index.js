var parse = require('./parse');
var express = require('express');
var multiparty = require('multiparty');

require('marko/node-require').install();
var index = require('./index.marko');

var app = express();

app.get('/', function (req, res) {
  index.render({ ret: {} }, res);
});

app.post('/', function (req, res, next) {
  var ret = {};
  var form = new multiparty.Form();
  form.on('error', function (err) {
    next(err);
  });
  form.on('part', function (part) {
    if (!part.filename) {
      next();
      return;
    }
    var data = [];
    part.on('data', function (chunk) {
      data.push(chunk);
    });
    part.on('end', function () {
      ret = parse(Buffer.concat(data));
    });
    part.on('error', function (err) {
      next(err);
    });
  });
  form.on('close', function () {
    index.render({ ret: ret }, res);
  });
  form.parse(req);
});

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send({ error: err });
});

app.use(function (req, res, next) {
  res.status(404).send({ error: 'Page Not Found.' });
});

var server = app.listen(3000, '0.0.0.0', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
