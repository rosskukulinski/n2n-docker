var gfs = require('./gfs');
var url = require('url');
var shot = require('./shot');

module.exports = function captureAndUpload (requestedUrl, callback) {
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

  var fileName = parsed.hostname +  parsed.path + '_' + now.getTime() + '.png';

  console.log('attempting to upload', fileName);
  gfs.upload(fileName, screenStream, function (err, results) {
    if (err) {
      return callback(err);
    }
    results.createdAt = now;
    console.log('results', results);
    return callback(null, results);
  });
}
