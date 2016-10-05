var socket = io();

var down = false;

function mouseUp() {
    down = 0;
    socket.emit('controllerEvent', down);
}
function mouseDown() {
    down = 1;
    socket.emit('controllerEvent', down);
}

// socket.on('message', function(data){document.write(data)});

// while (true) {
//
// }