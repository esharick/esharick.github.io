//Cookie functions
function setCookie(cname, cvalue, exdays = 400) { //max number of days to expire is 400
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 1000 * 60 * 60 * 24));
    document.cookie = cname + "=" + cvalue + "; expires=" + d.toUTCString() + "; path=/;";
} 

function getCookie(cname) {
    let cookieVals = document.cookie.split(";");
    let name = cname + "="; //substring we are searching for
    for (let i = 0; i < cookieVals.length; i++) {
        let c = cookieVals[i];
        //manually remove white space if exists
        while (c.charAt(0) === ' ')
            c = c.substring(1);

        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


//JavaScript Classes
class Sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play() {
        this.sound.currentTime = 0; //reset sound for overlapping sounds
        this.sound.play();
    }

    stop() {
        this.sound.pause();
    }
}

//JavaScript Objects
const gameArea = {
    canvas: document.createElement("canvas"),

    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.canvas.style.backgroundColor = "gray";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.getElementById("clockCanvas"));
        document.body.insertBefore(document.createElement("br"), document.getElementById("clockCanvas"));
        this.frameCount = 0;

        //event listeners - key/mouse listeners
        window.addEventListener('keydown', function (e) {
            if (e.code === "KeyP") {
                if (!paused) pauseGame();
                else unpauseGame();
                return;
            }


            if(["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Space"].includes(e.code))
                e.preventDefault(); //prevents arrow keys from scrolling

            //record the key the user pressed
            gameArea.keys = (gameArea.keys || {});
            gameArea.keys[e.code] = true;
        });

        window.addEventListener('keyup', function (e) {
            if(gameArea.keys)
                gameArea.keys[e.code] = false;
        });

        //mouse events
        window.addEventListener('mousemove', function (e) {
            gameArea.mouseX = e.pageX - gameArea.canvas.offsetLeft;
            gameArea.mouseY = e.pageY - gameArea.canvas.offsetTop;
        });

        window.addEventListener('mousedown', function (e) {
            if (!paused)
                startGame();
            else
                gameArea.checkMenuButtonClick(e.pageX - gameArea.canvas.offsetLeft,
                    e.pageY - gameArea.canvas.offsetTop);
                                                //correct for scrolling
        });

        //touch/tap events
        window.addEventListener('touchmove', function (e) {
            gameArea.touchX = e.touches[0].screenX;
            gameArea.touchY = e.touches[0].screenY;
        });
    },

    update: function () {
        this.frameCount += 1;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (gameArea.keys && gameArea.keys["Space"]) {
            updatePlayerSpeed(playerPiece.vx, jumpSpeed);
            flapSound.play();
        }
        //check for key presses
        //if (gameArea.keys && gameArea.keys["ArrowRight"]) {
        //    updatePlayerSpeed(1, playerPiece.vy);
        //} else if (gameArea.keys && gameArea.keys["ArrowLeft"]) {
        //    updatePlayerSpeed(-1, playerPiece.vy);
        //}
        //else
        //    updatePlayerSpeed(0, playerPiece.vy);

        //if (gameArea.keys && gameArea.keys["ArrowUp"]) {
        //    updatePlayerSpeed(playerPiece.vx, -1);
        //} else if (gameArea.keys && gameArea.keys["ArrowDown"]) {
        //    updatePlayerSpeed(playerPiece.vx, 1);
        //}
        //else
        //    updatePlayerSpeed(playerPiece.vx, 0);


    },

    //add 2 pipes to the end of canvas
    spawnPipes: function () {
        let pipeWidth = this.canvas.width / 20;
        let difficulty = 2.3; //1 easy, 5 hardest
        let speed = difficulty;
        let pipeGap = playerPiece.height * (6.5 - difficulty);
        let minHeight = .10 * this.canvas.height;
        let maxHeight = .60 * this.canvas.height;
        let topPipeHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
        let botPipeHeight = this.canvas.height - (topPipeHeight + pipeGap);

        obstacles.push(new component(this.canvas.width, topPipeHeight-maxHeight, pipeWidth, maxHeight,
            "./sprites/pipe-green-flip.png", -speed, "image"));
        obstacles.push(new component(this.canvas.width, this.canvas.height - botPipeHeight,
            pipeWidth, maxHeight, "./sprites/pipe-green.png", -speed, "image"));
    },

    reset: function () {
        obstacles.length = 0; //reset the obstacle array
        this.frameCount = 0;
        score = 0;
        scored = false;
        playerPiece.x = 100;
        playerPiece.y = 150;
        playerPiece.vy = 0;
        clearInterval(gameInterval);
    },

    paused: function () {
        let ctx = this.context;
        let marginX = 50, marginY = 50;
        let menuWidth = this.canvas.width - 2 * marginX;
        let menuHeight = this.canvas.height - 2 * marginY;
        ctx.fillStyle = 'gray';
        ctx.globalAlpha = 0.5; //transparent menu
        ctx.fillRect(marginX, marginY, menuWidth, menuHeight);
        ctx.font = "25px consolas";
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 1.0;
        ctx.fillText("Paused", menuWidth / 2, menuHeight / 2);
        ctx.font = "14px consolas";
        ctx.fillText("Select Character:", marginX + 10, menuHeight / 2 + 30);

        //draw buttons
        for (let i = 0; i < birdImages.length; i++) {
            let x = marginX + 100 * i + 70;
            let y = marginY + 100;
            if (colorSelected === i)
                ctx.fillStyle = "yellow";
            else
                ctx.fillStyle = "black";
            ctx.fillRect(x, y, 40, 40);
            ctx.drawImage(birdImages[i], x+5, y+5, 30, 30);
        }
    },

    checkMenuButtonClick: function (mx, my) {
        let marginX = 50, marginY = 50;
        let change = false;
        for (let i = 0; i < birdImages.length; i++) {
            if (i === colorSelected) continue;
            let x = marginX + 100 * i + 70;
            let y = marginY + 100;
            if (x < mx && mx < x + 40 && y < my && my < y + 40) {
                colorSelected = i;
                localStorage.setItem("colorSelected", "" + i);
                playerPiece.image = birdImages[colorSelected];
                change = true;
            }
        }
        if (change) //redraw buttons
        {
            let ctx = this.context;
            for (let i = 0; i < birdImages.length; i++) {
                let x = marginX + 100 * i + 70;
                let y = marginY + 100;
                if (colorSelected === i)
                    ctx.fillStyle = "yellow";
                else
                    ctx.fillStyle = "black";
                ctx.fillRect(x, y, 40, 40);
                ctx.drawImage(birdImages[i], x + 5, y + 5, 30, 30);
            }
        }
    }
}

const redBirdImage = new Image();
redBirdImage.src = "./sprites/redbird-midflap.png";
const blueBirdImage = new Image();
blueBirdImage.src = "./sprites/bluebird-midflap.png";
const yellowBirdImage = new Image();
yellowBirdImage.src = "./sprites/yellowbird-midflap.png";
let colorSelected = localStorage.getItem("colorSelected");
if (colorSelected === null) {
    //default to red bird
    colorSelected = 0;
} else {
    //localstorage is stored as string
    colorSelected = parseInt(colorSelected);
}
const birdImages = [redBirdImage, blueBirdImage, yellowBirdImage];

const playerPiece = new component(100, 150, 20, 20, "./sprites/bluebird-midflap.png", 0, "image");
playerPiece.image = birdImages[colorSelected];

const scoreText = new component(30, 30, "25px", "consolas", "white", 0, "text");
const highScoreText = new component(250, 30, "25px", "consolas", "white", 0, "text");
const background = new component(0, 0, 480, 270, "./sprites/background-night.png", -0.2, "bckimage");
playerPiece.ay = 0.20;
const jumpSpeed = -2.7;
const obstacles = [];
const FPS = 40;
let gameInterval, score = 0, scored = false, paused = false;
let highScore = getCookie("highScore");
if (highScore === "")
    highScore = 0;

const flapSound = new Sound("./audio/swoosh.wav");
const crashSound = new Sound("./audio/hit.wav");


//Constructor function (JS style)
function component(x, y, width, height, color, vx=0, type="rect") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.vx = vx;
    this.vy = 0;
    this.ay = 0;
    this.type = type;
    this.text = "";
    if (this.type === "image" || this.type === "bckimage") {
        this.image = new Image();
        this.image.src = color; //color parameter will represent the image path
    }


    this.update = function () {
        //movement, other component logic
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;

        //movePlayerToMouse();

        //redraw the component
        this.ctx = gameArea.context; 
        this.ctx.fillStyle = color;
        if (this.type === "rect")
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
        else if (this.type === "text") {
            this.ctx.font = this.width + " " + this.height; //width is font size, height is font family
            this.ctx.fillText(this.text, this.x, this.y);
        }
        else if (this.type === "image" || this.type === "bckimage") {
            if (this.vy !== 0) { //rotate player
                this.ctx.save();
                this.ctx.translate(this.x + this.width/2, this.y + this.height/2);
                let angle = Math.tanh(this.vy);
                this.ctx.rotate(angle);
                this.ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height);
                this.ctx.restore();
            } else {
                this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }

            if (this.type === "bckimage") { 
                this.ctx.drawImage(this.image, this.x+this.width, this.y, this.width, this.height);
                if (this.x <= -this.width)
                    this.x = 0; //resets the scrolling background
            }

        }
    }

    this.collideWith = function (otherObj) {
        let radius = this.width / 2;
        let circleX = this.x + radius;
        let circleY = this.y + radius;

        let closestX = Math.min(Math.max(circleX, otherObj.x), otherObj.x + otherObj.width); //either end; or where the circle x is
        let closestY = Math.min(Math.max(circleY, otherObj.y), otherObj.y + otherObj.height);

        let distanceX = circleX - closestX;
        let distanceY = circleY - closestY;
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        let buffer = 2;
        if (distance <= radius - buffer)
            stopGame();
    }

}


//Once at start
function startGame() {
    //setup anything related to the game
    gameArea.reset();
    gameInterval = setInterval(updateGame, 1000 / FPS);
}

function stopGame() {
    crashSound.play();
    clearInterval(gameInterval);
}

function pauseGame() {
    clearInterval(gameInterval);
    paused = true;
    gameArea.paused(); //draw the menu for the user
}

function unpauseGame() {
    gameInterval = setInterval(updateGame, 1000 / FPS);
    paused = false;
}



//Once per frame
function updateGame() {
    if (gameArea.frameCount % (FPS * 2) == 0) 
        gameArea.spawnPipes();
    gameArea.update();

    background.update();
    playerPiece.update();
    //collions with obstacles
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
        playerPiece.collideWith(obstacles[i]);
    }
    //collisions with ground/ceiling
    if (playerPiece.y + playerPiece.height >= gameArea.canvas.height ||
        playerPiece.y <= 0)
        stopGame();

    if (obstacles[0].x + obstacles[0].width < 0) {
        obstacles.shift(); //remove element from beginning
        obstacles.shift();
        scored = false;
    }
    if (!scored && obstacles[0].x + obstacles[0].width < playerPiece.x) {
        score += 1;
        scored = true;
        if (score > highScore) {
            highScore = score;
            setCookie("highScore", highScore);
        }
    }

    //UI components
    scoreText.text = "Score: " + score;
    scoreText.update();
    highScoreText.text = "High Score: " + highScore;
    highScoreText.update();
}

function updatePlayerSpeed(vx, vy) {
    playerPiece.vx = vx;
    playerPiece.vy = vy;
}

function movePlayerToMouse() {
    if (playerPiece.x < gameArea.mouseX)
        updatePlayerSpeed(1, playerPiece.vy);
    else
        updatePlayerSpeed(-1, playerPiece.vy);

    if (playerPiece.y < gameArea.mouseY)
        updatePlayerSpeed(playerPiece.vx, 1);
    else
        updatePlayerSpeed(playerPiece.vx, -1);

    //playerPiece.x = gameArea.mouseX;
    //playerPiece.y = gameArea.mouseY;
}

window.onload = gameArea.start();