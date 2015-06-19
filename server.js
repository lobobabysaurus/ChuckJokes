var net = require('net');
net.createServer(function (socket) {
    socket.write('I\'m a feminine Eminem.  A slim shady lady.  --Bo Burnham\n');
    socket.destroy();
}).listen(17, '127.0.0.1');
console.log('QOTD Server Running\n');
