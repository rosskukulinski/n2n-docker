var express = require('express');
var queue = require('./queue');
var router = express.Router();
var queue = require('./queue');
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
  res.render('index', {
    content: 'express-hbs example'
  });
});

router.post('/', function(req, res) {
  console.log('request to send some data', req.body);

  if (req.body.url) {
    queue(req.body.url);
  }

  if (req.accepts('html')) {
    res.render('index', {
      request: 'Your request to index `' + req.body.url + '` has been submitted',
    });
  }
  else {
    return res.json({
      url: req.body.url
    });
  }
});
