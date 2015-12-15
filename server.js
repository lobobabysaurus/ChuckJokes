#! /usr/bin/env node
var net = require('net');
var udp = require('dgram');

var argv = require('yargs')
            .usage('Usage: $0 -f [string] -l [string] -o [string] -e [string] -p [num]')
            .options({
              'f': {
                alias: 'first',
                describe: 'First name to replace Chuck\'s in jokes',
                string: true
              },
              'l': {
                alias: 'last',
                describe: 'Last name to replace Chuck\'s in jokes',
                string: true
              },
              'o': {
                alias: 'only',
                describe: 'Comma separated list of categories to limit jokes',
                string: true
              },
              'e': {
                alias: 'exclude',
                describe: 'Comma separated list of categories to exclude jokes',
                string: true
              },
              'p': {
                alias: 'port',
                describe: 'Port server will run on',
                default: 17
              }
            })
            .help('h')
            .alias('h', 'help')
            .version(function() {
              return require('./package').version;
            })
            .epilogue('For more information, contact Phil.R.Simmons@gmail.com')
            .argv;
var ChuckNorris = require('chuck-norris-api');

var chuckJoke = new ChuckNorris();

var options = {};
if (argv.f) options.firstName = argv.f;
if (argv.l) options.lastName = argv.l;
if (argv.o) options.limitTo = argv.o;
if (argv.e) options.exclude = argv.e;
var port = argv.p;

/**
 * Message to display on successful connection
 *
 * @param type String UDP or TCP
 * @returns String message saying the protocol and port the server is using
 */
function successMessage(type) {
  console.log("Chuck Jokes Server Running on " + type + " Port " + port);
}

//Setup a server for tcp on port 17
net.createServer( function (tcp_socket) {
    chuckJoke.getRandom(options).then(function (data) {
      tcp_socket.write(data.value.joke + "\n");
      tcp_socket.destroy();
    })
  })
  .listen(port, '::', function() { successMessage('TCP')})
  .on('error', function(error) {
    if (error.code === 'EACCES' && argv.p < 1024) {
      console.error('Running server on ports below 1024 must be done as root');
    }
    else {
      console.error('There has been an issue while starting the TCP server');
    }
  });

// Setup a server for udp on port 17
var udp_socket = udp.createSocket('udp6');
udp_socket
  .on('message', function (message, remote) {
    chuckJoke.getRandom(options).then(function (data) {
      var joke = new Buffer(data.value.joke+"\n");
      udp_socket.send(joke, 0, joke.length, remote.port, remote.address);
    });
  })
  .on('listening', function() { successMessage('UDP') })
  .on('error', function(error) {
    if (!error.code === 'EACCES' && argv.p < 1024) {
      console.error('There has been an issue while starting the UDP server');
    }
  })
  .bind(port);
