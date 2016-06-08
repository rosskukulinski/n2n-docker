var webshot = require('webshot');


var api = module.exports = {};

api.getCaptureStream = function getCaptureStream (url, options) {
  options = options || {};
  return webshot(url, options);
}
