var net = require('net');
var log = console.log;
var Promise = require('promise');

var statements = [];

log("Starting database quote loading");
var lq = require('./db_readers/localMongoReader.js');
var quotes = lq.loadDBQuotes().then(function (quotes) {
  return Promise.resolve(quotes);
});

quotes.then(function (quoteSet){
  log("Statement Loading Complete");
  log("Creating QOTD Server");
  net.createServer(function (socket) {
      socket.write(quoteSet[Math.floor(Math.random() * quoteSet.length)] + "\n");
      socket.destroy();
  }).listen(54321, '127.0.0.1');
  log('QOTD Server Running\n');
});
