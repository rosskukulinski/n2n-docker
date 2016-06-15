var Queue = require('bull');
var db = require('./db');

var shotQueue = Queue('webshot request', 6379, '127.0.0.1');

var api = module.exports = {};

api.queue = function queue(url) {
  console.log('Queing request to process', url);
  shotQueue.add({url: url});
}

var responseQueue = Queue('webshot finished', 6379, '127.0.0.1');

responseQueue.process(10, function onSuccess (job, done) {
  console.log('Screenshot was successful', job.data);
  db.writeCapture(job.data, function(err) {
    if (err) {
      console.log('Error inserting job data into db', err, job.data);
    }
    else {
      console.log('Job data inserted into db', job.data);
    }
    return done();
  });
});

api.requestQueueCount = function requestQueueCount (callback) {
  shotQueue.count().then(function(results) {
    console.log(results);
    return callback(null, results);
  }).catch(function(err) {
    console.error(err);
    return callback(err);
  })
}
