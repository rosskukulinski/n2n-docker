var http = require('http');
var version = require('./package.json').version;
var redis = require('redis');

var port = process.env.PORT || 3000;
var redisConnected = false;

var rc = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379
});
rc.on('ready', function () {
  console.log('connected to redis');
  redisConnected = true;
});
rc.on('error', function () { });

function handleRequest (request, response) {
  if (request.url === '/healthz') {
    return healthCheck(request, response);
  }
  if (request.url === '/version') {
    return response.end(version + '\n');
  }
  if (!redisConnected) {
    response.statusCode = 500;
    return response.end();
  }
  console.log('Serving request for ', request.url);
  response.end('helloworld\n');
}

function healthCheck (request, response) {
  if (!redisConnected) {
    response.statusCode = 500;
    response.write('Redis not connected\n');
  }
  response.end();
}

var server = http.createServer(handleRequest);

server.listen(port, function () {
  console.log('Server listening on port', port);
});
