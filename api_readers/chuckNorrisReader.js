var http = require('http');
var Promise = require('promise');

exports.loadJokes = function() {
    /**
     * Load all jokes from the international Chuck Norris database and return it in a promise
     */
    return getJokeCount()
        .then(getJokeArray)
        .then(function (value){
            return Promise.resolve(value);
        });
};

function getJokeCount (){
    /**
     * Get the number of Chuck Norris stored on the international Chuck Norris database
     */
    return new Promise(function (resolve, reject) {
        http.get("http://api.icndb.com/jokes/count", function (countRes) {
            countRes.setEncoding('utf8');
            var countData = "";
            countRes.on('data', function (countChunk) {
                countData += countChunk;
            });
            countRes.on('end', function () {
                var count = JSON.parse(countData);
                resolve(count.value);
            });
        }).on('error', function (e) {
            reject('problem with count: e.message');
        });
    });
}

function getJokeArray(jokeCount){
    /**
     * Get an array of all Chuck Norris jokes from the international Chuck Norris database wrapped in a promise
     */
    return new Promise(function (resolve, reject) {
        var jokeHolder = [];
        for (var i = 1; i <= jokeCount; i++) {
            http.get("http://api.icndb.com/jokes/" + i,
                function (jokeRes) {
                    jokeRes.setEncoding('utf8');
                    var jokeData = "";
                    jokeRes.on('data', function (jokeChunk) {
                        jokeData += jokeChunk;
                    });
                    jokeRes.on('end', function () {
                        try {
                            var joke = JSON.parse(jokeData);
                            jokeHolder.push(joke.value.joke);
                            if (joke.value.id === jokeCount) {
                                resolve(jokeHolder);
                            }
                        } catch (e) {
                            console.error(e.message);
                        }
                    });
                }
            ).on('error', function (e) {
                console.error('problem with joke: ' + e.message);
            });
        }
    });
}