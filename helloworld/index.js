var http = require('http');
var version = require('./package.json').version;
var port = process.env.PORT || 3000;

function handleRequest (request, response) {
  if (request.url === '/healthz') {
    return healthCheck(request, response);
  }
  if (request.url === '/version') {
    return response.end(version + '\n');
  }
  console.log('Serving request for ', request.url);
  response.end('helloworld\n');
}

function healthCheck (request, response) {
  response.end();
}

var server = http.createServer(handleRequest);

server.listen(port, function () {
  console.log('Server listening on port', port);
});
