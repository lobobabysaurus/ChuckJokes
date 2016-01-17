#! /usr/bin/env node
var net = require('net');
var udp = require('dgram');
var JokeCache = require('./src/joke_cache');

var yargs_options = {
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
  'c': {
    alias: 'cache',
    describe: 'Times to loop through all jokes before cache refresh',
    default: 4
  },
  'p': {
    alias: 'port',
    describe: 'Port server will run on',
    default: 17
  }
};

var argv = require('yargs')
            .usage('Usage: $0 [options]')
            .options(yargs_options)
            .help('h')
            .alias('h', 'help')
            .version(function() {
              return require('./package').version;
            })
            .epilogue('For more information, contact Phil.R.Simmons@gmail.com')
            .argv;

var options = {};
if (argv.f) options.firstName = argv.f;
if (argv.l) options.lastName = argv.l;
if (argv.o) options.limitTo = argv.o;
if (argv.e) options.exclude = argv.e;
var port = argv.p;

var jokeCache = new JokeCache(options, argv.c);
jokeCache.fillBuffer();

// Setup a server for udp on port 17
var udp_socket = udp.createSocket('udp6');
udp_socket
  .on('message', function (message, remote) {
    var joke = new Buffer(jokeCache.getJoke()+"\n");
    udp_socket.send(joke, 0, joke.length, remote.port, remote.address);
  })
  .on('listening', function() { successMessage('UDP') })
  .on('error', function(error) {
    if (!error.code === 'EACCES' && argv.p < 1024) {
      console.error('There has been an issue while starting the UDP server');
    }
  })
  .bind(port);

//Setup a server for tcp on port 17
net.createServer(function (tcp_socket) {
  tcp_socket.write(jokeCache.getJoke() + "\n");
  tcp_socket.destroy();
}).listen(argv.p, function() {
  successMessage('TCP');
}).on('error', function(err) {
  if (err.code === 'EACCES' && argv.p < 1024) {
    console.error('Running server on ports below 1024 must be done as root');
  }
  else {
    console.error('There has been an error starting the server');
  }
});

/**
 * Message to display on successful connection
 *
 * @param type String UDP or TCP
 * @returns String message saying the protocol and port the server is using
 */
function successMessage(type) {
  console.log("Chuck Jokes Server Running on " + type + " Port " + port);
}
