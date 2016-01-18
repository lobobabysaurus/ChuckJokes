var chuckJoke = require('chuck-norris-api');

function JokeCache(options, cacheLoops) {
  this.jokeBuffer = [];
  this.currentJoke = 0;
  this.totalJokes = 0;
  this.cacheLoops = cacheLoops;
  this.options = options;
}

JokeCache.prototype.fillBuffer = function() {
  chuckJoke.getAllJokes(this.options).then(function(jokeSet) {
    if (jokeSet.type === 'success') {
      this.jokeBuffer = jokeSet.value;
      this.totalJokes = this.jokeBuffer.length * this.cacheLoops;
    }
  }.bind(this));
};

JokeCache.prototype.getJoke = function() {
  while (this.jokeBuffer.length === 0);
  var jokeNumberInSet = this.currentJoke % this.jokeBuffer.length;
  var returnJoke = this.jokeBuffer[jokeNumberInSet].joke;
  if (this.currentJoke === this.totalJokes) {
    this.jokeBuffer = [];
    this.currentJoke = 0;
    this.fillBuffer();
  }
  else {
    this.currentJoke += 1;
  }
  return returnJoke;
};

module.exports = JokeCache;
