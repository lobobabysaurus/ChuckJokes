#! /usr/bin/env node
const net = require('net');
const udp = require('dgram');

const JokeCache = require('./src/joke_cache');


runServer();

function runServer() {
  const argv = getArgs();
  const port = argv.p;

  const options = {};
  if (argv.f) options.firstName = argv.f;
  if (argv.l) options.lastName = argv.l;
  if (argv.o) options.limitTo = argv.o;
  if (argv.e) options.exclude = argv.e;

  const jokes = new JokeCache(options, argv.c);
  jokes.fillBuffer();

  bindUdpServer(jokes, port);
  bindTcpServer(jokes, port);
}

function getArgs() {
  const yargs_options = {
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

  return require('yargs')
    .usage('Usage: $0 [options]')
    .options(yargs_options)
    .help('h')
    .alias('h', 'help')
    .version(function() {
      return require('./package').version;
    })
    .epilogue('For more information, contact phil@tubbycatgames.com')
    .argv;
}

function bindUdpServer(jokes, port) {
  const udp_socket = udp.createSocket('udp6');
  udp_socket
    .on('message', function (message, remote) {
      const joke = new Buffer(jokes.getJoke() + "\n");
      udp_socket.send(joke, 0, joke.length, remote.port, remote.address);
    })
    .on('listening', successLogger('UDP', port))
    .on('error', errorHandler('UDP'))
    .bind(port);
}

function bindTcpServer(jokes, port) {
  net.createServer(function (tcp_socket) {
    tcp_socket.write(jokes.getJoke() + "\n");
    tcp_socket.destroy();
  }).listen(port, successLogger('TCP', port))
    .on('error', errorHandler('TCP'));
}

function successLogger(type, port) {
  return function() {
    console.log(`Chuck Jokes Server Running on ${type} Port ${port}`);
  }
}

function errorHandler(type) {
  return function(err) {
    if (err.code === 'EACCES' && argv.p < 1024) {
      console.error('Running server on ports below 1024 must be done as root');
    }
    else {
      console.error(`Encountered an error starting the ${type} server: ${err}`);
    }
  }
}
