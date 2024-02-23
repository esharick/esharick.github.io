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
            startGame();
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
    }
}
const playerPiece = new component(100, 150, 20, 20, "./sprites/bluebird-midflap.png", 0, "image");
const scoreText = new component(30, 30, "25px", "consolas", "white", 0, "text");
const background = new component(0, 0, 480, 270, "./sprites/background-night.png", -0.2, "bckimage");
playerPiece.ay = 0.20;
const jumpSpeed = -2.7;
const obstacles = [];
const FPS = 40;
let gameInterval, score = 0, scored = false;
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
                this.ctx.translate(this.x, this.y);
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
        let x2 = this.x + this.width; //right side of player
        let y2 = this.y + this.height; //bottom side of player
        let otherx2 = otherObj.x + otherObj.width; //right side of obstacle
        let othery2 = otherObj.y + otherObj.height; //bottom of the obstacle
        if (this.x < otherx2 && x2 > otherObj.x &&
            this.y < othery2 && y2 > otherObj.y)
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
    }

    //UI components
    scoreText.text = "Score: " + score;
    scoreText.update();
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