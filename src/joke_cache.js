const api = require('chuck-norris-api');

function JokeCache(options, cacheLoops) {
  this.jokeBuffer = [];
  this.currentJoke = 0;
  this.totalJokes = 0;
  this.cacheLoops = cacheLoops;
  this.options = options;
}

JokeCache.prototype.fillBuffer = function() {
  api.getAllJokes(this.options).then(function(jokes) {
    if (jokes.type === 'success') {
      this.jokeBuffer = jokes.value;
      this.totalJokes = this.jokeBuffer.length * this.cacheLoops;
    }
  }.bind(this));
};

JokeCache.prototype.getJoke = function() {
  while (this.jokeBuffer.length === 0);
  const jokeNumberInSet = this.currentJoke % this.jokeBuffer.length;
  const returnJoke = this.jokeBuffer[jokeNumberInSet].joke;
  if (this.currentJoke === this.totalJokes) {
    this.currentJoke = 0;
    this.fillBuffer();
  }
  else {
    this.currentJoke += 1;
  }
  return returnJoke;
};

module.exports = JokeCache;
