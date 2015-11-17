var net = require('net');
var log = console.log;

var argv = require('yargs')
            .usage('Usage: $0 -f [string] -l [string] -o [string] -e [string] -p [num]')
            .options(
              {
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

net.createServer(function (socket) {
  chuckJoke.getRandom(options).then(function (data) {
    socket.write(data.value.joke + "\n");
    socket.destroy();
  });
}).listen(argv.p, function() {
  log('Chuck Joke Server Running');
});
