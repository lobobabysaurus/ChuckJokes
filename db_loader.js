var assert = require('assert');
var cn = require('./api_readers/chuckNorrisReader.js');
var log = console.log;
var mongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://localhost:27017/NodeQOTDDB";
var Promise = require('promise');

log("Starting Chuck Norris joke loading");
cn.loadJokes().then(function (jokes) {
    return Promise.resolve(jokes);
}).then(function (jokeSet) {
  mongoClient.connect(mongoUrl, function (err, db) {
    assert.equal(err, null, "Error Connecting to the Database");
    jokeSet.forEach(function (joke) {
      var quotesCollection = db.collection('quotes');
      quotesCollection.insertOne({
          quote: joke,
          author: 'Anonymous'
      },
      function(err, result) {
        assert.equal(err, null, "Error writing to the Database");
      });
    });
    db.close();
  });
});
