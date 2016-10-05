var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('assets'));

app.get('/server', function (req, res) {
    res.sendfile('assets/canvas.html');
});

app.get('/', function (req, res) {
    res.sendfile('assets/controller.html');
});

io.on('connection', function(socket){
    console.log('A user connected with ID:', socket.conn.id);

    socket.on('gameEvent', function(data){
        console.log("Game Board says:", data);
    });

    socket.on('controllerEvent', function(data){
        console.log("ID:", socket.conn.id, " SAID:\n", data);
        io.emit('gameEvent', {data: data});
    });



    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});

http.listen((process.env.PORT || 3000), function(){
    console.log('listening on localhost:3000');
});
