var canvas = document.getElementById("mariomatch"),
    c = canvas.getContext("2d"),
    gems = [],
    moves = []
let gemList = [cloud, fireball, flower, mushroomGreen, feather, questionBlock, star];
let timer;
let startBtn = document.getElementById("startBtn");
let timeBtn = document.getElementById('timeBtn');
let moveCount = 0;
let timeCount = 0;
let score = 0;
let coinSound = document.getElementById('coinSound');
let bgm = document.getElementById('bgm');
let badSound = document.getElementById('badSound');
let hereWeGo = document.getElementById('hereWeGo');
let pressStart = document.getElementById('pressStart');
let volumeImg = document.getElementById('volumeImg');
let modal = document.getElementById("myModal");
let modalBtn = document.getElementById("modalBtn");
let closeModal = document.getElementsByClassName("close")[0];
let muteBtn = document.getElementById('mute');
let gameover = document.getElementById('gameover');
let marioBg = document.getElementById('mario');
let fronticons = document.getElementById('front-icons')


modalBtn.onclick = function () {
    modal.style.display = 'block';
}

closeModal.onclick = function () {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }


muteBtn.addEventListener('click', function (e) {
    if (bgm.muted) {
        bgm.muted = false;
        muteBtn.style.backgroundColor = '#42B132';
        volumeImg.src = './lib/images/volume.png';
    } else {
        bgm.muted = true;
        muteBtn.style.backgroundColor = '#E71E07';
        volumeImg.src = './lib/images/mute.png';
    }
})

function setJS(filename) {
    let elm = document.createElement('script');
    elm.type = 'text/javascript';
    elm.src = "./lib/" + filename;
    document.body.appendChild(elm);

    setTimeout(function () {
        startBtn.style.display = 'none';
        timeBtn.style.display = 'none';
        fronticons.style.display = 'none';
        initialize();
    }, 200)
}

function setBgImg() {
    c.drawImage(marioBg, 200, 100, 200, 200);
}

function Gem(x, y) {
    this.x1 = x;
    this.y1 = y;
    this.x2 = x;
    this.y2 = y;
    this.gapCount = 0;

    this.getY = function () {
        return (this.y1 + (this.y2 - this.y1) * (this.gapCount) / 20) * 60 + 100;
    }

    this.moveGem = function (x2, y2, color) {
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
        this.gapCount = 20;
        moves.push(this);
    }

    this.update = function () {
        this.gapCount--;
        if (this.gapCount <= 0) {
            this.moving = false;
        }
    }
}

function getRandomNum(n) {
    return Math.floor(Math.random() * n);
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


function myMouseDown(e) {
    mouseDownX = e.offsetX;
    mouseDownY = e.offsetY
}

function myMouseUp(e) {
    var gemX1 = Math.floor(mouseDownX / 60);
    var gemY1 = Math.floor((mouseDownY - 100) / 60);

    var gemX2 = gemX1;
    var gemY2 = gemY1;
    var mouseUpX = e.offsetX;
    var mouseUpY = e.offsetY;

    if (Math.abs(mouseUpX - mouseDownX) === 0 && Math.abs(mouseUpY - mouseDownY) === 0) {
        return;
    } else if (Math.abs(mouseUpX - mouseDownX) > Math.abs(mouseUpY - mouseDownY)) {
        gemX2 += (mouseUpX - mouseDownX > 0) ? 1 : -1;
    } else {
        gemY2 += (mouseUpY - mouseDownY > 0) ? 1 : -1;
    }

    if (gems[gemX1][gemY1].moving || gems[gemX2][gemY2].moving || timer === null) {
        return;
    }

    // Swtich Colors
    var gemColor1 = gems[gemX1][gemY1].color;
    var gemColor2 = gems[gemX2][gemY2].color;
    if (gemColor1 === gemColor2) {
        badSound.play();
    } else {
        gems[gemX1][gemY1].moveGem(gemX2, gemY2, gemColor2);
        gems[gemX2][gemY2].moveGem(gemX1, gemY1, gemColor1);
    }

    moveCount--;
    draw();

}


function gameOver() {
    c.clearRect(0, 0, 600, 700);
    startBtn.style.display = "inline";
    timeBtn.style.display = "inline";
    c.font = 'bold 40px Arial';
    c.fillText('Game Over', 300, 150);
    c.fillText('Score: ' + score, 300, 250);
    gameover.play();
}

function setRemoveFlag() {
    for (let x = 0; x < 10; x++) {
        var c0 = gems[x][0].color;
        var count = 1;

        for (var y = 1; y < 10; y++) {
            var c1 = gems[x][y].color;
            if (c0 === c1) {
                count++;
                if (count >= 3) {
                    gems[x][y - 2].remove = true;
                    gems[x][y - 1].remove = true;
                    gems[x][y].remove = true;
                } 
            } else {
                c0 = c1;
                count = 1;
            }
        }
    }

    for (let y = 0; y < 10; y++) {
        var c0 = gems[0][y].color;
        var count = 1;

        for (var x = 1; x < 10; x++) {
            var c1 = gems[x][y].color;
            if (c0 === c1) {
                count++;
                if (count >= 3) {
                    gems[x - 2][y].remove = true;
                    gems[x - 1][y].remove = true;
                    gems[x][y].remove = true;
                } 
            } else {
                c0 = c1;
                count = 1;
            }
        }
    }


}

function fall() {
    for (var x = 0; x < 10; x++) {
        for (var y = 9, z = 9; y >= 0; y-- , z--) {
            while (z >= 0) {
                if (gems[x][z].remove) {
                    z--;
                } else {
                    break;
                }
            }

            if (y !== z) {
                var colorNum = (z >= 0) ? gems[x][z].color : getRandomNum(7);
                gems[x][y].moveGem(x, z, colorNum);
            }
        }
    }

    // Update remove flag and add score & play sound
    let soundFlag = true
    for (var x = 0; x < 10; x++) {
        for (var y = 0; y < 10; y++) {
            if (gems[x][y].remove) {
                gems[x][y].remove = false;
                score += 100;
                if (soundFlag) {
                    coinSound.pause();
                    coinSound.currentTime = 0;
                    coinSound.play();
                    coinSoundFlag = false;
                }
            }
        }
    }
}