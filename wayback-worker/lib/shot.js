var webshot = require('webshot');

var api = module.exports = {};

api.getCaptureStream = function getCaptureStream (url, options) {
  options = options || {
    screenSize: {
      width: 1600,
      height: 1200
    },
    phantomConfig: {
      'ignore-ssl-errors': 'true'
    }
  };
  return webshot(url, options);
}
