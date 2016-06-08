var dns = require('dns');
dnscache = require('dnscache')({
  enable: true,
  ttl: 300,
  cachesize: 1000
});

var restify = require('restify');
var routes = require('./lib/routes');

var port = process.env.PORT || 3000;

var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.gzipResponse());

server.get('/', routes.capture);
server.get('/version', routes.getVersion);
server.get('/healthz', routes.healthz);

server.listen(port, function () {
  console.log('Listening for HTTP requests on ', server.url);
});
