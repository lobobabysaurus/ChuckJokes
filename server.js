var net = require('net');
var log = console.log;

var ChuckNorris = require('chuck-norris-api');

log('Loading Jokes');
var chuckJoke = new ChuckNorris();

net.createServer(function (socket) {
    socket.destroy();
}).listen(54321, function() {
  log('Chuck Joke Server Running');
});
