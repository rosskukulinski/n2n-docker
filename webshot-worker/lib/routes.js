var api = module.exports = {};
var pkginfo = require('pkginfo')(module);
var shot = require('./shot');

api.getVersion = function getVersion (req, res) {
  res.end(module.exports.version);
};

api.healthz = function healthz (req, res) {
  res.end();
};

api.capture = function capture (req, res) {
  console.log('request to capture website: ', req.query.url);
  var screenStream = shot.getCaptureStream(req.query.url);

  screenStream.pipe(res);
}
