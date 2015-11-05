var net = require('net');
var log = console.log;
var Promise = require('promise');

var statements = [];

log("Starting Chuck Norris joke loading");
var cn = require('./api_readers/chuckNorrisReader.js');
var jokes = cn.loadJokes().then(function (jokes) {
  return Promise.resolve(jokes);
});
statements.push(jokes);

log("Starting database quote loading");
var lq = require('./db_readers/localMongoReader.js');
var quotes = lq.loadDBQuotes().then(function (quotes) {
  return Promise.resolve(quotes);
});
statements.push(quotes);

log("Waiting on statement loading to finish");
var loader = Promise.all(statements);
loader.then(function (statements){
  log("Statement Loading Complete");
  var data = [];
  statements.forEach(function (statment) {
      data = data.concat(statements);
  })
  log("Creating QOTD Server");
  net.createServer(function (socket) {
      socket.write(data[Math.floor(Math.random()*data.length)] + "\n");
      socket.destroy();
  }).listen(54321, '127.0.0.1');
  log('QOTD Server Running\n');
});
