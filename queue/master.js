const net = require('net');

const ipaddr = "localhost";
const port = 5200;

const Health_Check = 1;
const Do_Job = 2;
const Graceful_Close = 3;


function Processor(quest) {
    this.Callback = (data) => {};
    this.SetCallback = (callback) => {
        this.Callback = callback;
    };
    this.Quest = quest;
}

processors = [];

let server = net.createServer(function (socket) {
    console.log(socket.address().address + " connected");
    socket.setEncoding('utf8');

    let p = new Processor((image, question, callback) => {
        p.SetCallback(callback);
        socket.write(String(Do_Job));
        socket.write(image + '\n' + question);
    });

    socket.on('data', function(data) {
        p.Callback(data);
        p.SetCallback((data) => {});
    });

    socket.on('close', function () {
		console.log(socket.address().address + " disconnected");
	});

    processors.push(p);
});

server.on('error', function (err) {
	console.log('err: ', err.code);
});

server.listen(port, ipaddr, function() {
    console.log(`Example app listening on port ${port}`);
});

module.exports = processors;