var net = require('net');
var log = console.log;

var ChuckNorris = require('../chuck-norris-api');

log('Loading Jokes');
var chuckJoke = new ChuckNorris();

log('Chuck Joke Server Running\n');
net.createServer(function (socket) {
    socket.destroy();
    log('Chuck Joke Server Running\n');
}).listen(54321, '127.0.0.1');
