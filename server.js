// Initialize all required Node packages/plugins
var net = require('net');
var assert = require('assert');
var mongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://localhost:27017/NodeMongo";

// Create the server
net.createServer(function (socket) {
    // Connect to the database
    mongoClient.connect(mongoUrl, function(err, db) {
        assert.equal(err, null, "Error Connecting to the Database");
        // Get all Quotes
        var quotesCollection = db.collection('quotes');
        quotesCollection.find().toArray(function(err, quotes) {
            assert.equal(err, null, "Error reading Quotes");
            //Write each quote to the socket output
            quotes.forEach(function(quote) {
                socket.write(quote["quote"] + " -- " + quote["author"] + "\n");
            });
            //Close the db and socket
            db.close();
            socket.destroy();
        });
    });
}).listen(54321, '127.0.0.1');

console.log('QOTD Server Running\n');
