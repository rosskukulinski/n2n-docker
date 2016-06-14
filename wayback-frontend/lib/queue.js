var Queue = require('bull');

var shotQueue = Queue('webshot request', 6379, '127.0.0.1');

module.exports = function queue(url) {
  console.log('Queing request to process', url);
  shotQueue.add({url: url});
}

var responseQueue = Queue('webshot finished', 6379, '127.0.0.1');

responseQueue.process(10, function onSuccess (job, done) {
  console.log('Screenshot was successful', job.data);
  return done();
});
