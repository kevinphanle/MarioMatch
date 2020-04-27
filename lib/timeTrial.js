
function initialize() {

    // timeCount = 60 * 1000; // 1 minute
    timeCount = 30 * 1000; // 30 seconds
    score = 0;

    // Create Gems
    for (let x = 0; x < 10; x++) {
        gems[x] = [];
        for (let y = 0; y < 10; y++){
            gems[x][y] = new Gem(x, y);
        }
    }

    // Set Colors
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
            while (true) {
                var colorNum = getRandomNum(7);
                if (checkColor(x, y, colorNum)) {
                    gems[x][y].color = colorNum;
                    break;
                }
            }
        }
    }

    canvas.onmousedown = myMouseDown;
    canvas.onmouseup = myMouseUp;

    timer = setInterval(checkGemStatus, 25);
    bgm.play();

    draw();
}

function checkColor(x, y, c) {
    var flag = true;
    if (x > 1) {
        var c0 = gems[x - 2][y].color;
        var c1 = gems[x - 1][y].color;
        if (c0 === c1 && c1 === c) {
            flag = false;
        }
    }
    if (y > 1) {
        var c0 = gems[x][y - 2].color;
        var c1 = gems[x][y - 1].color;
        if (c0 === c1 && c1 === c) {
            flag = false;
        }
    }

    return flag;


}

function draw() {

    // Clear the canvas
    c.clearRect(0, 0, 600, 700);

    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
            c.drawImage(gemList[gems[x][y].color], x * 60, gems[x][y].getY(), 50, 50);
        }
    }

    let sec = Math.floor(timeCount / 1000);
    let millisec = timeCount % 1000;

    if (sec < 0) {
        sec = '00';
    } else if (sec < 10) {
        sec = '0' + sec;
    }

    if (millisec < 0) {
        millisec = '00';
    }

    c.font = 'bold 20px sans-serif';
    c.textAlign = 'center';
    c.fillText("Time Left : " + sec + ":" + millisec, 150, 50);
    c.fillText("Score: " + score, 400, 50);

}


function checkGemStatus() {

    // decrement time count
    timeCount -= 25;

    if (bgm.playbackRate === 1 && timeCount < 5000) {
        bgm.pause();
        bgm.playbackRate = 1.5;
        bgm.play();
    }

    if (moves.length > 0) {
        for (var i = 0; i < moves.length; i++) {
            moves[i].update();
        }

        moves = moves.filter(
            function (gem) {
                return gem.gapCount !== 0;
            }
        )

        if (moves.length === 0) {
            setRemoveFlag();
            fall();
        }
    }

    draw();

    // game over
    if (moves.length === 0 && timeCount <= 0) {
        clearInterval(timer);
        timer = null;
        bgm.pause();
        bgm.currentTime = 0;
        setTimeout('gameOver()', 500);
    }
}
