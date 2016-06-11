var api = module.exports = {};
var pkginfo = require('pkginfo')(module);
var shot = require('./shot');
var validUrl = require('valid-url');
var RErrors = require('restify-errors');

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
  var screenStream = shot.getCaptureStream(req.query.url);

  screenStream.pipe(res);
}
