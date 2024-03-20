//Classes should be defined before usage
class Sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }
    play() {

        this.sound.currentTime = 0; //reset sound
        this.sound.play();
    }
    stop() {
        this.sound.pause();
    }
}

const playerPiece = new component(100, 100, 30, 30, "./images/sprites/redbird-midflap.png", 0, 0.1, type = "image");
const background = new component(0, 0, 480, 270, "./images/sprites/background-day.png", -1, 0, type = "bgimage");
const obstacles = [];
let gameInterval;
const flapSound = new Sound("./images/audio/wing.wav");


const gameArea = {
    canvas: document.createElement("canvas"),
    setup: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.canvas.style.backgroundColor = "gray";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.getElementById("board"));
        document.body.insertBefore(document.createElement("br"), document.getElementById("board"));


        this.spawnPipes();
        this.frameCount = 0;
        this.score = 0;
        this.scoreText = new component(10, 30, "25px", "Consolas", "white", 0, 0, type = "text");
        this.scoreText.text = "Score: " + this.score;

        //for key presses
        window.addEventListener('keydown', function (e) {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(e.code)) {
                e.preventDefault();
            }

            gameArea.keys = (gameArea.keys || {});
            gameArea.keys[e.code] = true;
        });
        window.addEventListener('keyup', function (e) {
            if (gameArea.keys)
                gameArea.keys[e.code] = false;
        });

        //for mouse clicks
        window.addEventListener('mousedown', function (e) {
            startGame();
        });

        //touch event/tap event
        window.addEventListener('touchmove', function (e) {
            gameArea.touchX = e.touches[0].screenX;
            gameArea.touchY = e.touches[0].screenY;
        });
    },

    update: function () {
        this.frameCount += 1;
        //clears the background
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //move player based on events

        if (gameArea.keys && gameArea.keys["Space"]) {
            playerPiece.vy = -2;
            flapSound.play();
        }

        //if (gameArea.keys && gameArea.keys["ArrowLeft"])
        //    movePlayer(-1, playerPiece.vy)
        //else if (gameArea.keys && gameArea.keys["ArrowRight"])
        //    movePlayer(1, playerPiece.vy);
        //else
        //    movePlayer(0, playerPiece.vy);

        //if (gameArea.keys && gameArea.keys["ArrowUp"])
        //    movePlayer(playerPiece.vx, -1);
        //else if (gameArea.keys && gameArea.keys["ArrowDown"])
        //    movePlayer(playerPiece.vx, 1);
        //else
        //    movePlayer(playerPiece.vx, 0);

        ////move with mouse
        //if (gameArea.mouseX && gameArea.mouseY) {
        //    playerPiece.x = gameArea.mouseX;
        //    playerPiece.y = gameArea.mouseY;
        //}
    },

    spawnPipes: function () {
        let pipeWidth = 20;
        let difficulty = 4; // 1 = impossible
        let obstacleSpeed = 1;
        let pipeGap = playerPiece.height * difficulty;
        let minHeight = .10 * this.canvas.height;
        let maxHeight = .50 * this.canvas.height;
        let topPipeHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
        let botPipeHeight = this.canvas.height - topPipeHeight - pipeGap;
        //top 
        obstacles.push(new component(this.canvas.width, this.canvas.height, pipeWidth, topPipeHeight, "./sprites/redbird-midflap.png", -obstacleSpeed, 0.1, type = "image"));
        obstacles.push(new component(this.canvas.width, this.canvas.height - botPipeHeight,
            pipeWidth, botPipeHeight, "./sprites/pipe-green.png", -obstacleSpeed, type="image"));
    },

    reset: function () {  
        clearInterval(gameInterval);
        obstacles.length = 0; //clears the array
        this.spawnPipes();
        this.frameCount = 0;
        this.score = 0;
        this.scoreText.text = "Score: " + this.score;
        playerPiece.x = 100;
        playerPiece.y = 100;
        playerPiece.vy = 0;
    }
}

function component(x, y, width, height, color, vx=0, ay=0, type="rect") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.vx = vx;
    this.vy = 0;
    this.ay = ay;
    this.type = type;
    this.text = "";
    if (this.type === "image" || this.type==="bgimage") {
        this.image = new Image();
        this.image.src = color; //color will represent the path to the image file
    }

    this.update = function () {
        //movement
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;

        //redraws itself
        let ctx = gameArea.context;
        if (type === "rect") {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        else if (this.type === "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (this.type === "image" || this.type === "bgimage") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (this.type === "bgimage") {
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
                if (this.x === -this.width)
                    this.x = 0;
            }
        }
    }

    this.collideWith = function (otherObj) {
        let x2 = this.x + this.width;
        let y2 = this.y + this.height;
        let otherx2 = otherObj.x + otherObj.width;
        let othery2 = otherObj.y + otherObj.height; //bottom
        if (this.x < otherx2 &&
            x2 > otherObj.x &&
            this.y < othery2 &&
            y2 > otherObj.y
        ) {
            stopGame();
        }
    }
}

function startGame() {
    gameArea.reset();
    gameInterval = setInterval(updateGame, 1000 / 60);
}

function stopGame() {
    clearInterval(gameInterval);
    //logic of game over message
}

function updateGame() {
    gameArea.update();
    background.update();
    playerPiece.update();
    if(gameArea.frameCount % 120 == 0)
        gameArea.spawnPipes();
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
        console.log(obstacles);
        playerPiece.collideWith(obstacles[i]); //end game
    }
    //check collision with ground/ceiling
    if (playerPiece.y <= 0 || playerPiece.y + playerPiece.height >= gameArea.canvas.height)
        stopGame();

    //add to score
    if (obstacles[0].x + obstacles[0].width === playerPiece.x) {
        gameArea.score += 1;
        gameArea.scoreText.text = "Score: " + gameArea.score;
    }
    //remove pipes when they go off screen
    else if (obstacles[0].x + obstacles[0].width < 0) {
        obstacles.shift();
        obstacles.shift();
    }
    gameArea.scoreText.update();
}

function movePlayer(vx, vy) {
    playerPiece.vx = vx;
    playerPiece.vy = vy;
}

window.onload = gameArea.setup();