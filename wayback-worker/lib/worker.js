var gfs = require('./gfs');
var url = require('url');
var shot = require('./shot');

module.exports = function captureAndUpload (requestedUrl, callback) {
  requestedUrl = requestedUrl.toLowerCase();
  if (requestedUrl.indexOf('http://') !== 0 && requestedUrl.indexOf('https://') !== 0) {
    requestedUrl = 'http://'+requestedUrl;
  }
  console.log('worker request for ', requestedUrl);
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
  console.log(parsed);
  var fileName = parsed.hostname +  parsed.path + '_' + now.getTime() + '.png';

  console.log('attempting to upload', fileName);
  gfs.upload(fileName, screenStream, function (err, results) {
    if (err) {
      return callback(err);
    }
    results.createdAt = now;
    results.domain = parsed.hostname;
    results.href = parsed.href;
    results.path = parsed.path;
    results.requestedUrl = requestedUrl;
    console.log('results', results);
    return callback(null, results);
  });
}
