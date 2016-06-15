var dns = require('dns');
dnscache = require('dnscache')({
  enable: true,
  ttl: 300,
  cachesize: 1000
});
var db = require('./lib/db');

process.title = 'frontend';

var routes = require('./lib/routes');
var port = process.env.PORT || 3001;

var express = require('express');
var hbs = require('express-hbs');
var logger = require('morgan');
var bodyParser = require('body-parser');


var app = express();
app.use(logger('dev'));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(function (error, request, response, next) {
    response.status(error.status || 500);
    response.json({ error: error.message });
});

app.use(routes);

db.init(function (err) {
  if (err) {
    console.error('Problem setting up rethinkdb, exiting');
    process.exit(1);
  }
  console.log('Connected to rethinkdb');
  var server = app.listen(port, function () {
      var host = server.address().address;
      var port = server.address().port;
      console.log('App is listening on http://%s:%s', host, port);
  });
})
