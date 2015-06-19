var net = require('net');
net.createServer(function (socket) {
    socket.write('QOTD');
}).listen(17, '127.0.0.1');
