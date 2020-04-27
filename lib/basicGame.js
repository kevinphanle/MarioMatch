function initialize() {

    startBtn.style.display = 'none';
    moveCount = 5;
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

    timer = setInterval(checkGemStatus, 10);
    // hereWeGo.play();
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

    c.font = 'bold 20px sans-serif';
    c.textAlign = 'center';
    c.fillText("Moves Left : " + moveCount, 150, 50);
    c.fillText("Score: " + score, 400, 50);

}


function checkGemStatus() {
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

    if (moves.length === 0 && moveCount === 0) {
        clearInterval(timer);
        timer = null;
        bgm.pause();
        bgm.currentTime = 0;
        setTimeout('gameOver()', 500);
    }
}
