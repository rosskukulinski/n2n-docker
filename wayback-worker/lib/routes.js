var api = module.exports = {};
var pkginfo = require('pkginfo')(module);
var shot = require('./shot');
var validUrl = require('valid-url');
var RErrors = require('restify-errors');
var gfs = require('./gfs');
var url = require('url');

api.getVersion = function getVersion (req, res, next) {
  res.end(module.exports.version);
  return next();
};

api.healthz = function healthz (req, res, next) {
  res.end();
  return next();
};

api.capture = function capture (req, res, next) {
  console.log('request to capture website: ', req.query.url);
  if (!req.query.url || !validUrl.isUri(req.query.url)) {
    return next(new RErrors.BadRequestError('Invalid URL: ' + req.query.url));
  }
  captureAndUpload(req.query.url, function (err, results) {
    res.json(results);
    return next();
  });
}

function captureAndUpload (requestedUrl, callback) {
  var screenStream = shot.getCaptureStream(requestedUrl);
  screenStream.on('error', function onErr (err) {
    console.log('screenStream error', err);
    return callback(err);
  });
  screenStream.on('end', function onEnd () {
    console.log('screenStream end');
  })
  var now = new Date();

  var parsed = url.parse(requestedUrl);

  var fileName = parsed.hostname +  parsed.path + '_' + now.getTime() + '.png';

  gfs.upload(fileName, screenStream, function (err, results) {
    if (err) {
      return callback(err);
    }
    results.createdAt = now;
    console.log('results', results);
    return callback(null, results);
  });
}
