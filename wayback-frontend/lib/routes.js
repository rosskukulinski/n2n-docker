var express = require('express');
var queue = require('./queue');
var router = express.Router();
var queue = require('./queue');
var async = require('async');
var db = require('./db');

module.exports = router;
var pkginfo = require('pkginfo')(module);

router.get('/version', function getVersion (req, res) {
  res.send(module.exports.version);
});

router.get('/healthz', function healthz (req, res) {
  // TODO: Wire up to whether Rethinkdb is up and running
  res.send();
});

router.get('/', function(req, res) {
  var captures;
  var queueLength;
  async.parallel([
    function getCaptures(callback) {
      db.getCaptures({}, function (err, cap) {
        captures = cap;
        return callback(err);
      });
    },
    function getQueueLen(callback) {
      queue.requestQueueCount(function (err, count) {
        queueLength = count;
        return callback(err);
      })
    }
  ], function(err) {
    if (err) {
      res.statusCode = 500;
      return res.end('Oops');
    }
    res.render('index', {
      queueLength: queueLength,
      captures: captures
    });
  })
});

router.post('/', function(req, res) {
  console.log('request to send some data', req.body);

  if (req.body.url) {
    queue.queue(req.body.url);
  }

  if (req.accepts('html')) {
    var captures;
    var queueLength;
    async.parallel([
      function getCaptures(callback) {
        db.getCaptures({}, function (err, cap) {
          captures = cap;
          return callback(err);
        });
      },
      function getQueueLen(callback) {
        queue.requestQueueCount(function (err, count) {
          queueLength = count;
          return callback(err);
        })
      }
    ], function(err) {
      if (err) {
        res.statusCode = 500;
        return res.end('Oops');
      }
      res.render('index', {
        queueLength: queueLength,
        captures: captures,
        request: 'Your request to index `' + req.body.url + '` has been submitted'
      });
    });
  }
  else {
    return res.json({
      url: req.body.url
    });
  }
});
