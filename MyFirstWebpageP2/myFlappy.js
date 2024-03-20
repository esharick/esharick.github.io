//Set cookie
function setCookie(cname, cvalue, exdays=365*15) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;";
}

//Get cookie
function getCookie(cname) {
    let name = cname + "="; //substring to search for
    let cookieVals = document.cookie.split(';');
    for (let i = 0; i < cookieVals.length; i++) {
        let c = cookieVals[i];
        //remove white spaces 
        while (c.charAt(0) === ' ')
            c = c.substring(1);  
            
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return ""; //no cookie found
}

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

const background = new component(0, 0, 480, 270, "./sprites/background-day.png", -1, 0, type = "bckImage");
const obstacles = [];
let gameInterval;
const flapSound = new Sound("./audio/wing.wav");
let paused = false;
const gameOverMessage = new component(100, 100, 280, 70, "./sprites/gameover.png", 0, 0, type = "image");

//Variables for player selecting color
let colorSelected = localStorage.getItem("colorSelected");
if (colorSelected === null)
    colorSelected = 0; //default color red;
else
    colorSelected = parseInt(colorSelected);

const redBirdImage = new Image();
redBirdImage.src = "./sprites/redbird-midflap.png";
const blueBirdImage = new Image();
blueBirdImage.src = "./sprites/bluebird-midflap.png";
const yellowBirdImage = new Image();
yellowBirdImage.src = "./sprites/yellowbird-midflap.png";

const birds = [redBirdImage, blueBirdImage, yellowBirdImage];
let playerPiece = new component(100, 100, 20, 20, "./sprites/redbird-midflap.png", 0, 0.1, type = "image");
playerPiece.image = birds[colorSelected];


const gameArea = {
    canvas: document.createElement("canvas"),
    setup: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.canvas.style.backgroundColor = "gray";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.getElementById("clockCanvas"));
        document.body.insertBefore(document.createElement("br"), document.getElementById("clockCanvas"));


        this.spawnPipes();
        this.frameCount = 0;
        this.score = 0;
        this.scoreText = new component(10, 30, "25px", "Consolas", "white", 0, 0, type = "text");
        this.scoreText.text = "Score: " + this.score;

        let x = getCookie("highScore");
        if (x === "")
            this.highScore = 0;
        else
            this.highScore = x;
        this.highScoreText = new component(250, 30, "25px", "Consolas", "white", 0, 0, type = "text");
        this.highScoreText.text = "High Score: " + this.highScore;


        //for key presses
        window.addEventListener('keydown', function (e) {
            if (e.code === "KeyP") {
                if (!paused) pauseGame();
                else unpauseGame();
                return;
            }
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
            if (!paused)
                startGame();
            else
                gameArea.checkMenuButtonClick(e.pageX - gameArea.canvas.offsetLeft, e.pageY - gameArea.canvas.offsetTop);
            //gameArea.mouseX = e.pageX - gameArea.canvas.offsetLeft;
            //gameArea.mouseY = e.pageY - gameArea.canvas.offsetTop;
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
        let pipeWidth = 30;
        let difficulty = 4; // 1 = impossible
        let obstacleSpeed = 1;
        let pipeGap = playerPiece.height * difficulty;
        let minHeight = .20 * this.canvas.height;
        let maxHeight = .70 * this.canvas.height;
        let topPipeHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
        let botPipeHeight = this.canvas.height - topPipeHeight - pipeGap;
        //top 
        obstacles.push(new component(this.canvas.width, topPipeHeight - maxHeight, pipeWidth, maxHeight,
            "./sprites/pipe-green-flip.png", -obstacleSpeed, 0, "image"));
        obstacles.push(new component(this.canvas.width, this.canvas.height - botPipeHeight,
            pipeWidth, maxHeight, "./sprites/pipe-green.png", -obstacleSpeed, 0, "image"));
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
    },

    pause: function () {
        let marginX = 50, marginY = 50;
        let ctx = this.context;
        let width = this.canvas.width - marginX * 2;
        let height = this.canvas.height - marginY * 2;
        ctx.fillStyle = 'gray';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(marginX, marginY, width, height);
        ctx.font = "25px consolas";
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 1.0;
        ctx.fillText("Paused", width / 2, height / 2);
        ctx.font = "14px consolas";
        ctx.fillText("Select Character: ", marginX + 10, marginY + 60);

        // Draw buttons
        for (let i = 0; i < birds.length; i++) {
            if (i === colorSelected)
                ctx.fillStyle = 'yellow';
            else
                ctx.fillStyle = 'black';
            ctx.globalAlpha = 0.6;
            let x = marginX + 70 + 100 * i;
            let y = marginY + 100;
            ctx.fillRect(x, y, 40, 40);
            ctx.globalAlpha = 1.0;
            ctx.drawImage(birds[i], x+5, y+5, 30, 30);
        }
    },

    checkMenuButtonClick: function (mx, my) {
        let marginX = 50, marginY = 50;
        for (let i = 0; i < birds.length; i++) {
            if (i === colorSelected) continue;

            let x = marginX + 70 + 100 * i;
            let y = marginY + 100;
            if (mx > x && mx < x + 40 && my > y && my < y + 40) {
                playerPiece.image = birds[i];
                colorSelected = i;
                localStorage.setItem("colorSelected", "" + i);
                //Redraw buttons - transparency breaks - but wouldn't if we separate update and draw and could redraw everything
                //gameArea.pause();
            }

        }
        // Redraw buttons manually
        let ctx = this.context;
        for (let i = 0; i < birds.length; i++) {
            if (i === colorSelected)
                ctx.fillStyle = 'yellow';
            else
                ctx.fillStyle = 'black';
            ctx.globalAlpha = 0.6;
            let x = marginX + 70 + 100 * i;
            let y = marginY + 100;
            ctx.clearRect(x, y, 40, 40);
            ctx.fillRect(x, y, 40, 40);
            ctx.globalAlpha = 1.0;
            ctx.drawImage(birds[i], x + 5, y + 5, 30, 30);
        }
    },
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
    if (this.type === "image" || this.type === "bckImage") {
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
        else if (this.type === "image" || this.type === "bckImage") {
            if (this.vy !== 0) { //rotate player
                ctx.save();
                ctx.translate(this.x + this.width/2, this.y + this.height/2);
                let angle = Math.tanh(this.vy);
                ctx.rotate(angle);
                ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
                ctx.restore();
            } else {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
            if (this.type === "bckImage") {
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
                if (this.x === -this.width)
                    this.x = 0;
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






function startGame() {
    gameArea.reset();
    gameInterval = setInterval(updateGame, 1000 / 60);
}


function pauseGame() {
    paused = true;
    clearInterval(gameInterval);
    gameArea.pause();
}



function unpauseGame() {
    paused = false;
    gameInterval = setInterval(updateGame, 1000 / 60);
}

function stopGame() {
    clearInterval(gameInterval);
    //logic of game over message
    gameOverMessage.update();
}

//next year write as update and draw instead of together 
function updateGame() {
    gameArea.update();
    background.update();
    playerPiece.update();
    //Draw pipes
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
    }
    //Spawn new pipes
    if(gameArea.frameCount % 120 == 0)
        gameArea.spawnPipes();

    //Check collisions with pipes
    for (let i = 0; i < obstacles.length; i++) {
        playerPiece.collideWith(obstacles[i]); //end game
    }
    //check collision with ground/ceiling
    if (playerPiece.y <= 0 || playerPiece.y + playerPiece.height >= gameArea.canvas.height)
        stopGame();

    //add to score
    if (obstacles[0].x + obstacles[0].width === playerPiece.x) {
        gameArea.score += 1;
        gameArea.scoreText.text = "Score: " + gameArea.score;
        if (gameArea.score > gameArea.highScore) {
            gameArea.highScore = gameArea.score;
            gameArea.highScoreText.text = "High Score: " + gameArea.highScore;
            setCookie("highScore", gameArea.highScore);
        }
    }
    //remove pipes when they go off screen
    else if (obstacles[0].x + obstacles[0].width < 0) {
        obstacles.shift();
        obstacles.shift();
    }


    gameArea.scoreText.update();
    gameArea.highScoreText.update();
}

function movePlayer(vx, vy) {
    playerPiece.vx = vx;
    playerPiece.vy = vy;
}

window.onload = gameArea.setup();


