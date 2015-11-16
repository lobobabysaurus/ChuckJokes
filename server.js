var net = require('net');
var log = console.log;

var argv = require('yargs').argv;
var ChuckNorris = require('chuck-norris-api');

var chuckJoke = new ChuckNorris();

var port = argv.port || 17
net.createServer(function (socket) {
  chuckJoke.getRandom(argv).then(function (data) {
    socket.write(data.value.joke);
    socket.destroy();
  });
}).listen(port, function() {
  log('Chuck Joke Server Running');
});
