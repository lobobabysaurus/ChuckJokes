var cn = require('./api_readers/chuckNorrisReader.js');
var net = require('net');
var log = console.log;
var Promise = require('promise');

var statements = [];

log("Starting Chuck Norris joke loading");
cn.loadJokes().then(function (jokes) {
  log("Joke Loading Complete");
  log("Creating Joke Server");
  net.createServer(function (socket) {
      socket.write(jokes[Math.floor(Math.random() * jokes.length)] + "\n");
      socket.destroy();
  }).listen(54321, '127.0.0.1');
  log('Chuck Joke Server Running\n');
});
