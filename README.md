# Mario Match

Mario Match is a Bejeweled inspired game. Play it [here](https://kevinphanle.github.io/MarioMatch/).

## Technologies

* Javascript
* HTML5 Canvas
* CSS3

## Controls

Users can move gems to try to match 3 in a row in order to gain points while more gems fall onto the board.
Users click and swipe in order to swap tiles, similar to a touchscreen.
There is a button near the top which will open a modal with instructions when clicked. 
<img src="./assets/screenshots/howtoplaymodal.png"/>

## Playing the Game

Upon loading the game, the user will see the following start screen with two options.
<img src="./assets/screenshots/frontpage.png"/>

The user can then choose a regular game, where the motive is to earn as much points as possible within a limited number of moves, or a timed trial, where the user has unlimited moves but is within a time constraint instead.

Background music will begin playing, but the user has the option to mute it by clicking the mute button near the top.

<img src="./assets/screenshots/regulargame.png"/>

<img src="./assets/screenshots/scoretimetrial.png"/>

Here is the fall animation code

```

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
```

Upon finishing one of the games, the user will be presented a game over screen where their final score is displayed.

<img src="./assets/screenshots/gameover.png"/>

