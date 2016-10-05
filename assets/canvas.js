var loadcount = 0;
var loadtotal = 0;
var preloaded = false;
var shot = {down: false, downTime: 0, upTime: 0, power: 0};
var socket = io();

var velocitySwitch = false;


socket.emit('gameEvent', "I_AM_SERVER");
socket.on('gameEvent', function(status) {
    velocitySwitch = status.data;
});

function loadImages(imagefiles) {
    loadcount = 0;
    loadtotal = imagefiles.length;
    preloaded = false;

    var loadedimages = [];
    for (var i=0; i<imagefiles.length; i++) {
        var image = new Image();

        image.onload = function () {
            loadcount++;
            if (loadcount == loadtotal) {
                preloaded = true;
            }
        };

        image.src = imagefiles[i];
        loadedimages[i] = image;
    }

    return loadedimages;
}

function draw() {
    var canvas = document.getElementById('myCanvas');
    document.addEventListener( "keydown", keydown, true);
    document.addEventListener( "keyup", keyup, true);
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var dim = setupDimensions(canvasWidth, canvasHeight);

    var circle = {'x': canvasWidth / 2, 'y': canvasHeight / 2, 'xVel': 5, 'yVel': 5, 'diameter': 30};
    var yellowBall = {'x': 140, 'y': 200, 'xVel': 5, 'yVel': 5, 'diameter': 30, power: 0};

    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback) {
            return setTimeout(callback, 1);
        };

    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var images = loadImages(["redBall.png", "wood.jpg", "yellowBall.png"]);
        var woodPattern;
        animate();
    } else {
        alert("Canvas-unsupported. Try using Chrome?");
        return false;
    }

    function keydown(event) {
        if (event.keyCode == 32 && shot.down == false) {
			shot.down = true;
			shot.downTime = new Date().getTime();
		}
    }

    function keyup(event) {
        if (event.keyCode == 32) {
			shot.upTime = new Date().getTime();
			shot.power = shot.upTime - shot.downTime;
			shot.down = false;
			yellowBall.x += shot.power;
		}
    }

    function animate() {
        console.log(velocitySwitch);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawTable();

        ctx.drawImage(images[2], yellowBall.x, yellowBall.y, circle.diameter, circle.diameter);

        ctx.drawImage(images[0], circle.x, circle.y, circle.diameter, circle.diameter);
        circle.x += circle.xVel * velocitySwitch;
        circle.y += circle.yVel * velocitySwitch;

        if (circle.x > dim.rightCushion - circle.diameter|| circle.x < dim.leftCushion) {
            circle.xVel *= -1
        }
        if (circle.y > dim.bottomCushion - circle.diameter|| circle.y < dim.topCushion) {
            circle.yVel *= -1
        }
        requestAnimationFrame(animate);

        function drawTable() {
            drawWood();
            drawPockets();
            drawFelt();
            drawHoles();
            drawCushions();

            function drawWood() {
                woodPattern = ctx.createPattern(images[1], "repeat");
                ctx.fillStyle = woodPattern;
                ctx.fillRect(dim.buffer, dim.buffer, canvasWidth - 2 * dim.buffer, canvasHeight - 2 * dim.buffer);
            }

            function drawFelt() {
                ctx.fillStyle = "#006600";
                ctx.fillRect(dim.feltFromEdge, dim.feltFromEdge, canvasWidth - 2 * dim.feltFromEdge, canvasHeight - 2 * dim.feltFromEdge);
            }

            function drawCushions() {
                ctx.fillStyle = '#004900';

                // Top Left
                ctx.beginPath();
                ctx.moveTo(dim.buffer + dim.pocketSize, dim.feltFromEdge);
                ctx.lineTo((canvasWidth / 2) - dim.holeSize, dim.feltFromEdge);
                ctx.lineTo((canvasWidth / 2) - dim.holeSize - dim.centreCushionDiagonalOffset, dim.feltFromEdge + dim.cushionThickness);
                ctx.lineTo(dim.buffer + dim.pocketSize + dim.cornerCushionDiagonalOffset, dim.feltFromEdge + dim.cushionThickness);
                ctx.closePath();
                ctx.fill();

                //Top Right
                ctx.beginPath();
                ctx.moveTo(canvasWidth - dim.buffer - dim.pocketSize, dim.feltFromEdge);
                ctx.lineTo((canvasWidth / 2) + dim.holeSize, dim.feltFromEdge);
                ctx.lineTo((canvasWidth / 2) + dim.holeSize + dim.centreCushionDiagonalOffset, dim.feltFromEdge + dim.cushionThickness);
                ctx.lineTo(canvasWidth - dim.buffer - dim.pocketSize - dim.cornerCushionDiagonalOffset, dim.feltFromEdge + dim.cushionThickness);
                ctx.closePath();
                ctx.fill();

                //Left
                ctx.beginPath();
                ctx.moveTo(dim.feltFromEdge, dim.buffer + dim.pocketSize);
                ctx.lineTo(dim.feltFromEdge + dim.cornerCushionDiagonalOffset, dim.buffer + dim.pocketSize + dim.cornerCushionDiagonalOffset);
                ctx.lineTo(dim.feltFromEdge + dim.cornerCushionDiagonalOffset, canvasHeight - dim.buffer - dim.pocketSize - dim.cornerCushionDiagonalOffset);
                ctx.lineTo(dim.feltFromEdge, canvasHeight - dim.buffer - dim.pocketSize);
                ctx.closePath();
                ctx.fill();

                //Right
                ctx.beginPath();
                ctx.moveTo(canvasWidth - dim.feltFromEdge, dim.buffer + dim.pocketSize);
                ctx.lineTo(canvasWidth - dim.feltFromEdge - dim.cornerCushionDiagonalOffset, dim.buffer + dim.pocketSize + dim.cornerCushionDiagonalOffset);
                ctx.lineTo(canvasWidth - dim.feltFromEdge - dim.cornerCushionDiagonalOffset, canvasHeight - dim.buffer - dim.pocketSize - dim.cornerCushionDiagonalOffset);
                ctx.lineTo(canvasWidth - dim.feltFromEdge, canvasHeight - dim.buffer - dim.pocketSize);
                ctx.closePath();
                ctx.fill();

                // Bottom Left
                ctx.beginPath();
                ctx.moveTo(dim.buffer + dim.pocketSize, canvasHeight - dim.feltFromEdge);
                ctx.lineTo((canvasWidth / 2) - dim.holeSize, canvasHeight - dim.feltFromEdge);
                ctx.lineTo((canvasWidth / 2) - dim.holeSize - dim.centreCushionDiagonalOffset, canvasHeight - dim.feltFromEdge - dim.cushionThickness);
                ctx.lineTo(dim.buffer + dim.pocketSize + dim.cornerCushionDiagonalOffset, canvasHeight - dim.feltFromEdge - dim.cushionThickness);
                ctx.closePath();
                ctx.fill();

                //Bottom Right
                ctx.beginPath();
                ctx.moveTo(canvasWidth - dim.buffer - dim.pocketSize, canvasHeight - dim.feltFromEdge);
                ctx.lineTo((canvasWidth / 2) + dim.holeSize, canvasHeight - dim.feltFromEdge);
                ctx.lineTo((canvasWidth / 2) + dim.holeSize + dim.centreCushionDiagonalOffset, canvasHeight - dim.feltFromEdge - dim.cushionThickness);
                ctx.lineTo(canvasWidth - dim.buffer - dim.pocketSize - dim.cornerCushionDiagonalOffset, canvasHeight - dim.feltFromEdge - dim.cushionThickness);
                ctx.closePath();
                ctx.fill();

            }

            function drawPockets() {
                ctx.fillStyle="#7C8E94";
                // Top Left
                ctx.fillRect(dim.buffer, dim.buffer, dim.pocketSize, dim.pocketSize);

                // Top middle
                ctx.fillRect(canvasWidth / 2 - dim.pocketSize / 2, dim.buffer, dim.pocketSize, dim.pocketSize);

                // Bottom middle
                ctx.fillRect(canvasWidth / 2 - dim.pocketSize / 2, canvasHeight - dim.buffer - dim.pocketSize, dim.pocketSize, dim.pocketSize);

                // Bottom Left
                ctx.fillRect(dim.buffer, canvasHeight - dim.buffer - dim.pocketSize, dim.pocketSize, dim.pocketSize);

                // Bottom Right
                ctx.fillRect(canvasWidth - dim.buffer - dim.pocketSize, canvasHeight - dim.buffer - dim.pocketSize, dim.pocketSize, dim.pocketSize);

                // Top Right
                ctx.fillRect(canvasWidth - dim.buffer - dim.pocketSize, dim.buffer, dim.pocketSize, dim.pocketSize);
            }

            function drawHoles() {
                ctx.fillStyle="#000000";

                // Top Left
                ctx.beginPath();
                ctx.arc(dim.feltFromEdge, dim.feltFromEdge, dim.holeSize, 0, 2*Math.PI);
                ctx.fill();

                // Top Right
                ctx.beginPath();
                ctx.arc(canvasWidth - dim.feltFromEdge, dim.feltFromEdge, dim.holeSize, 0, 2*Math.PI);
                ctx.fill();

                // Top Middle
                ctx.beginPath();
                ctx.arc(canvasWidth / 2, dim.feltFromEdge - dim.middleHoleAdjustment, dim.holeSize, 0, 2*Math.PI);
                ctx.fill();

                // Bottom Middle
                ctx.beginPath();
                ctx.arc(canvasWidth / 2, canvasHeight - dim.buffer - dim.woodWidth + dim.middleHoleAdjustment, dim.holeSize, 0, 2*Math.PI);
                ctx.fill();

                // Bottom Right
                ctx.beginPath();
                ctx.arc(canvasWidth - dim.feltFromEdge, canvasHeight - dim.buffer - dim.woodWidth, dim.holeSize, 0, 2*Math.PI);
                ctx.fill();

                // Bottom Left
                ctx.beginPath();
                ctx.arc(dim.feltFromEdge, canvasHeight - dim.buffer - dim.woodWidth, dim.holeSize, 0, 2*Math.PI);
                ctx.fill();
            }
        }
    }
}

function setupDimensions(canvasWidth, canvasHeight) {
    var buffer = canvasWidth * 0.05;
    var woodWidth = canvasWidth * 0.04;
    var feltFromEdge = buffer + woodWidth;
    var pocketSize = buffer * 1.3;
    var holeSize = pocketSize * 0.3;
    var middleHoleAdjustment = woodWidth * 0.2;
    var cushionThickness = (woodWidth * 0.25);
    var centreCushionDiagonalOffset = pocketSize * 0.1;
    var cornerCushionDiagonalOffset = cushionThickness;
    var topCushion = feltFromEdge + cushionThickness;
    var bottomCushion = canvasHeight - topCushion;
    var leftCushion = topCushion;
    var rightCushion = canvasWidth - topCushion;

    var sizes = {
        buffer: buffer,
        woodWidth: woodWidth,
        feltFromEdge: feltFromEdge,
        pocketSize: pocketSize,
        holeSize: holeSize,
        middleHoleAdjustment: middleHoleAdjustment,
        cushionThickness: cushionThickness,
        centreCushionDiagonalOffset: centreCushionDiagonalOffset,
        cornerCushionDiagonalOffset: cornerCushionDiagonalOffset,
        topCushion: topCushion,
        bottomCushion: bottomCushion,
        leftCushion: leftCushion,
        rightCushion: rightCushion
    };
    return sizes
}
