var Q = require('q');
var fs = require('fs');
var parse = require('./parse');
var express = require('express');
var multiparty = require('multiparty');

require('marko/node-require').install();
var index = require('./index.marko');
var error = require('./error.marko');

function getUploadData (req) {
  var deferred = Q.defer();
  var data = [];

  var form = new multiparty.Form();
  form.on('error', function (err) {
    deferred.reject(err);
  });

  form.on('part', function (part) {
    if (!part.filename) {
      return part.resume();
    }
    part.on('data', function (chunk) {
      data.push(chunk);
    });
  });

  form.on('close', function () {
    deferred.resolve(data);
  });

  form.parse(req);

  return deferred.promise;
}

var app = express();

app.get('/', function (req, res) {
  index.render(null, res);
});

app.post('/', function (req, res, next) {
  getUploadData(req).then(function (data) {
    var ret, err;
    try {
      if (data.length > 0) {
        ret = parse(Buffer.concat(data));
      }
    } catch (e) {
      err = e;
    }
    index.render({ ret: ret, err: err }, res);
  }).catch(next);
});

app.get('/demo.xlsx', function (req, res) {
  fs.createReadStream('./test/fixtures/test.xlsx').pipe(res);
});

app.use(function (err, req, res, next) {
  console.error(err);
  error.render({ err: (err && err.stack) ? err.stack : err }, res);
});

app.use(function (req, res, next) {
  res.status(404).send({ error: 'Page Not Found.' });
});

var server = app.listen(3000, '0.0.0.0', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
