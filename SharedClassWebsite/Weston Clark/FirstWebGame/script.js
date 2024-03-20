//Component Class built in class
//Used for rects, images, background image, and text
function component(x, y, width, height, color, vx=0, vy=0, type="rect") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.type = type;
    this.text = "";
    if (this.type === "image" || this.type==="bgimage") {
        this.image = new Image();
        this.image.src = color; //color will represent the path to the image file
    }
    this.setText = function (text) {
        this.text = text;
        this.x = (SCREEN_WIDTH/2)-(gameArea.context.measureText(text).width/2);
    }
    this.update = function () {
        //movement
        this.x += this.vx;
        this.y += this.vy;
        //redraws itself
        let ctx = gameArea.context;
        if (type === "rect") {
            ctx.fillStyle = this.color;
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
    this.collideWith = function (e) {
        if (this.x < e.x && this.x+this.width>e.x+e.width
            && this.y<e.y && this.y+this.height>e.y+e.height) {
            return true;
        }
        return false;
    }
}
//Sound Class we built in class
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
    loop() {
        this.sound.setAttribute("loop", "true");
    }
}
class Power {
    constructor(type){
        this.type=type;
        let x = 0+Math.floor(Math.random()*(SCREEN_WIDTH-60)+30);
        let y = 0+Math.floor(Math.random()*(SCREEN_HEIGHT-90)+30);
        let tempColor = "";
        //Pipe Power Up grows paddle of whoever hit ball 
        if(type===0){
            tempColor = "../images/sprites/pipe-green.png";
        }
        //Bird Power Up shoots the ball.component.vx up really high
        else if(type===1){
            tempColor = "../images/sprites/bluebird-midflap.png";
        }
        //Pipe Power Down shrinks paddle of whoever hit ball
        else if(type===2){
            tempColor = "../images/sprites/pipe-red.png";
        }
        //Yellow Bird Power speeds up ball
        else if(type===3){
            tempColor = "../images/sprites/yellowbird-upflap.png";
        }
        this.component = new component(x, y, 30, 30, tempColor,0,0, type="image");
    }
    update() {
        this.component.update();
        if(this.collides(ball.component)){
            return this.collisionEffect(this.type);
        }
        return false;
    }
    collides(ball) {
        if (this.component.x < ball.x + ball.width &&
            this.component.x + this.component.width > ball.x &&
            this.component.y < ball.y + ball.height &&
            this.component.y + this.component.height > ball.y) {
            return true;
        }
        return false;
    }
    collisionEffect(type) {
        if(type===0){
            paddles.paddleOne.width+=20;
            return true;
        }
        else if(type===1){
            ball.component.vx *= 10;
            return true;
        }
        else if(type===2){
            paddles.paddleTwo.width-=20;
            return true;
        }
        else if(type===3){
            ball.component.vy*=2.5;
            return true;
        }
        else {
            return false;
        }
    }
}

let gameInterval;
let crazyMode = true;
let playing = false;
let multiplayerMode = false;
let easyMode = false;
let enemyColorSwitched = false;
let ballSpeed = 4;
let enemySpeed = 3;
let speed = 7;
let winThreshHold = 5;
let powers = [];
let playingSrc = "https://static.vecteezy.com/system/resources/thumbnails/005/552/717/small_2x/neon-square-frame-with-shining-effects-on-dark-background-empty-frame-with-neon-effects-illustration-free-vector.jpg";
let pausedSrc = "https://global.discourse-cdn.com/pocketgems/uploads/episodeinteractive/original/4X/e/d/e/edea38361be3f44b231b25ee05a9f61b7154ab14.jpeg";
const bounceSound = new Sound("../images/audio/bounceEffect.mp3");
const wallSound = new Sound("../images/audio/bounceEffect.mp3");
const music = new Sound("../images/audio/pongMusic.mp3");
music.sound.loop = true;
music.play();
const ballSize = 25;
const SCREEN_WIDTH = 480;
const SCREEN_HEIGHT = 480;
const ball = {
    component: new component(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, ballSize, ballSize, "../images/sprites/ball.png", 0, -ballSpeed, type='image'),
    update: function() {
        let collided = paddles.collideWith(this.component);
        if(collided !== 0){
            bounceSound.play();
            this.component.vy*=-1;
            let angleFromPaddle;
            if(collided===1)
                angleFromPaddle = ((paddles.paddleOne.x-(this.component.x+this.component.width)+paddles.paddleOne.width/2)/paddles.paddleOne.width)*-2;
            else
                angleFromPaddle = ((paddles.paddleTwo.x-(this.component.x+this.component.width)+paddles.paddleTwo.width/2)/paddles.paddleTwo.width)*-2;
            this.component.vx=ballSpeed*Math.sin(angleFromPaddle);
        }
        if(this.component.x <= 0 || this.component.x+this.component.width>SCREEN_WIDTH){
            wallSound.play();
            this.component.vx*=-1;
        }
        this.component.update();
    },
    reset: function() {
        this.component.x = SCREEN_WIDTH/2;
        this.component.y = SCREEN_HEIGHT/2;
        this.component.vy = ballSpeed;
        this.component.vx = 0;
    }
}
const background = new component(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, pausedSrc, 0, 0, type = "bgimage");
const paddles = {
    paddleOne: new component(0, 0, 200, 30, 'rgb(85, 127, 212, 0.8)'),
    paddleTwo: new component(0, SCREEN_HEIGHT-30, 200, 30, 'rgb(135, 41, 41)', 3, 0),

    update: function () {
        this.paddleOne.update();
        this.paddleTwo.update();
    },
    collideWith: function(ball){
        if (this.paddleOne.x < ball.x + ball.width &&
            this.paddleOne.x + this.paddleOne.width > ball.x &&
            ball.y < this.paddleOne.height) {
            return 1;
        }
        if (this.paddleTwo.x < ball.x + ball.width &&
            this.paddleTwo.x + this.paddleTwo.width > ball.x &&
            ball.y + ball.height > this.paddleTwo.y) {
            return 2;
        }
        return 0;
    },
    reset: function () {
        this.paddleOne.width = 200;
        this.paddleTwo.width = 200;
        paddles.paddleOne.x=SCREEN_WIDTH/2-paddles.paddleOne.width/2;
    }
}
const gameArea = {
    canvas: document.createElement("canvas"),
    setup: function () {
        this.canvas.width = SCREEN_WIDTH;
        this.canvas.height = SCREEN_HEIGHT;
        this.canvas.style.backgroundColor = "white";
        this.context = this.canvas.getContext("2d");
        this.context.font = "25px Consolas";
        this.canvas.style.position='absolute';
        this.canvas.style.left='10px';
        this.canvas.style.top='250px';
        document.body.append(this.canvas);

        this.frameCount = 0;
        this.message = new component((SCREEN_WIDTH/2)-(this.context.measureText("Click to Start!").width/2), 130, "25px", "Consolas", "white", 0, 0, type = "text");
        this.message.setText("Click to Start!");
        this.score = 0;
        this.scoreText = new component(10, 30, "25px", "Consolas", "white", 0, 0, type = "text");
        this.scoreText.setText("Score: " + this.score);
        this.score2 = 0;
        this.scoreText2 = new component(10, SCREEN_HEIGHT-30, "25px", "Consolas", "white", 0, 0, type = "text");
        this.scoreText2.setText("Score: " + this.score);

        //for key presses
        window.addEventListener('keydown', function (e) {
            if (["ArrowLeft", "ArrowRight", "Space", "KeyA", "KeyD"].includes(e.code)) {
                e.preventDefault();
            }

            gameArea.keys = (gameArea.keys || {});
            gameArea.keys[e.code] = true;
        });
        window.addEventListener('keyup', function (e) {
            if (gameArea.keys)
                gameArea.keys[e.code] = false;
        });
        this.canvas.addEventListener('click', function (e) {
            playing = !playing;
            gameArea.message.setText("Game Paused, Click to Resume!");
            background.image.src = (playing)? playingSrc:pausedSrc;
        });
        //touch event/tap event
        // window.addEventListener('touchmove', function (e) {
        //     gameArea.touchX = e.touches[0].screenX;
        //     gameArea.touchY = e.touches[0].screenY;
        // });
        // window.addEventListener('mousemove', function (e) {
        //     gameArea.touchX = e.touches[0].screenX;
        //     gameArea.touchY = e.touches[0].screenY;
        // });
        startGame();
    },

    update: function () {
        this.frameCount += 1;
        //clears the background
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //move player based on events
        if (gameArea.keys && gameArea.keys["ArrowLeft"]) {
            paddles.paddleOne.vx = -speed;
        }
        if (gameArea.keys && gameArea.keys["ArrowRight"]) {
            paddles.paddleOne.vx = speed;
        }
        if(paddles.paddleOne.x<0){
            paddles.paddleOne.vx=0;
            paddles.paddleOne.x=0;
        }
        if(paddles.paddleOne.x+paddles.paddleOne.width>SCREEN_WIDTH){
            paddles.paddleOne.vx=0;
            paddles.paddleOne.x=SCREEN_WIDTH-paddles.paddleOne.width;
        }

        if(multiplayerMode){
            if(gameArea.keys && gameArea.keys["KeyA"]){
                paddles.paddleTwo.vx = -speed;
            }
            if(gameArea.keys && gameArea.keys["KeyD"]){
                paddles.paddleTwo.vx = speed;
            }
        } else {
            if(easyMode){
                if(paddles.paddleTwo.x<0){
                    paddles.paddleTwo.vx*=-1;
                    paddles.paddleTwo.x=0;
                }
                if(paddles.paddleTwo.x+paddles.paddleTwo.width>SCREEN_WIDTH){
                    paddles.paddleTwo.vx*=-1;
                    paddles.paddleTwo.x=SCREEN_WIDTH-paddles.paddleTwo.width;
                }
            }else{
                if(paddles.paddleTwo.x+paddles.paddleTwo.width/2<ball.component.x+ball.component.width/2)
                    paddles.paddleTwo.vx=enemySpeed;
                else
                    paddles.paddleTwo.vx=-enemySpeed;
            }
        }
        if(paddles.paddleTwo.x<0){
            paddles.paddleTwo.vx=0;
            paddles.paddleTwo.x=0;
        }
        if(paddles.paddleTwo.x+paddles.paddleTwo.width>SCREEN_WIDTH){
            paddles.paddleTwo.vx=0;
            paddles.paddleTwo.x=SCREEN_WIDTH-(paddles.paddleTwo.width+5);
        }
    },

    reset: function () {  
        this.frameCount = 0;
        this.score = 0;
        this.scoreText.setText("Score: " + this.score);
        this.score2 = 0;
        this.scoreText2.setText("Score: " + this.score);
        ball.reset();
    }
}

function startGame() {
    gameArea.reset();
    gameInterval = setInterval(gameLoop, 1000 / 60);
}

function stopGame() {
    clearInterval(gameInterval);
    //logic of game over message
}

function gameLoop(){
    if(playing){
        updateGame();
    } else {
        gameArea.update();
        background.update();
        gameArea.message.update();
    }
}

function updateGame() {
    gameArea.update();
    background.update();
    paddles.update();
    ball.update();
    spawnPower();
    for (let i = 0; i < powers.length; i++) {
        if(powers[i].update())
            powers.splice(i, 1);
    }
    if(ball.component.y+ball.component.height < paddles.paddleOne.height){
        gameArea.score2++;
        ball.reset();
        paddles.reset();
        gameArea.scoreText2.setText("Score: "+gameArea.score2);
        gameArea.scoreText2.update();
        powers =[];
    } else if(ball.component.y>SCREEN_HEIGHT-paddles.paddleTwo.height){
        gameArea.score++;
        ball.reset()
        paddles.reset();
        gameArea.scoreText.setText("Score: "+gameArea.score);
        gameArea.scoreText.update();
        powers =[];
    }
    gameArea.scoreText.update();
    gameArea.scoreText2.update();
    if(gameArea.score>=winThreshHold || gameArea.score2>=winThreshHold) {
        gameArea.message.setText((gameArea.score>=winThreshHold)? "Cool Guy Wins!!!":"Uh Oh Stinky Wins, Womp^2");
        gameArea.reset();
        playing=false;
        background.image.src = pausedSrc;
    }
}
function spawnPower() {
    let type = Math.floor(Math.random()*4);
    if(powers.length<5 && crazyMode)
        powers.push(new Power(type));
}
window.onload = gameArea.setup();

const easy = document.getElementById('Easy');
easy.addEventListener('click', function(e){
    paddles.reset();
    powers = [];
    crazyMode=false;
    multiplayerMode = false;
    easyMode=true;
    ballSpeed = 3;
    ball.component.vy = -ballSpeed;
    enemySpeed = 3;
    paddles.paddleTwo.vx = enemySpeed;
    speed=5;
    if(!enemyColorSwitched)
        paddles.paddleTwo.color = "#069C56";
    winThreshHold = 3;
    let ballSize = 25;
    ball.component.width = ballSize;
    ball.component.height = ballSize;
    ball.reset();
    playing=false;
    gameArea.message.setText("Easy Mode: Click to Start!");
    gameArea.message.update();
    gameArea.reset();
});
const medium = document.getElementById('Medium');
medium.addEventListener('click', function(e){
    paddles.reset();
    powers = [];
    crazyMode=false;
    multiplayerMode = false;
    easyMode=false;
    ballSpeed = 5;
    ball.component.vy = ballSpeed;
    enemySpeed = 2;
    paddles.paddleTwo.vx = enemySpeed;
    speed=7;
    if(!enemyColorSwitched)
        paddles.paddleTwo.color = "#FF681E";
    winThreshHold = 5;
    let ballSize = 22;
    ball.component.width = ballSize;
    ball.component.height = ballSize;
    ball.reset();
    playing=false;
    gameArea.message.setText("Medium Mode: Click to Start!");
    gameArea.message.update();
    gameArea.reset();
});
const hard = document.getElementById('Hard');
hard.addEventListener('click', function(e){
    paddles.reset();
    powers = [];
    crazyMode=false;
    multiplayerMode = false;
    easyMode=false;
    ballSpeed = 10;
    ball.component.vy = -ballSpeed;
    enemySpeed = 4;
    paddles.paddleTwo.vx = enemySpeed;
    speed=9;
    if(!enemyColorSwitched)
        paddles.paddleTwo.color = "#D3212C";
    winThreshHold = 7;
    let ballSize = 15;
    ball.component.width = ballSize;
    ball.component.height = ballSize;
    ball.reset();
    playing=false;
    gameArea.message.setText("Hard Mode: Click to Start!");
    gameArea.message.update();
    gameArea.reset();
});
const reset = document.getElementById('Reset');
reset.addEventListener('click', function(e){
    ball.reset();
    paddles.reset();
    gameArea.reset();
    playing=false;
    gameArea.message.setText("Click to Start!");
    gameArea.message.update();
});
const multiplayer = document.getElementById('Multiplayer');
multiplayer.addEventListener('click', function(e){
    easyMode=false;
    powers = [];
    paddles.reset();
    winThreshHold = 5;
    ballSpeed = 7;
    ball.component.vy = ballSpeed;
    speed=7;
    enemySpeed = 0;
    paddles.paddleTwo.vx = enemySpeed;
    if(!enemyColorSwitched)
        paddles.paddleTwo.color = "#FF980E";
    let ballSize = 25;
    ball.component.width = ballSize;
    ball.component.height = ballSize;
    ball.reset();
    playing=false;
    multiplayerMode = true;
    gameArea.message.setText("Multiplayer Mode: Click to Start!");
    gameArea.message.update();
    gameArea.reset();
});
const crazy = document.getElementById("Crazy");
crazy.addEventListener('click', function(e){
    easyMode=false;
    paddles.reset();
    crazyMode=true;
    winThreshHold = 7;
    ballSpeed = 5;
    ball.component.vy = ballSpeed;
    enemySpeed = 3;
    paddles.paddleTwo.vx = enemySpeed;
    speed=7;
    if(!enemyColorSwitched)
        paddles.paddleTwo.color = "#FF980E";
    let ballSize = 25;
    ball.component.width = ballSize;
    ball.component.height = ballSize;
    ball.reset();
    playing=false;
    gameArea.message.setText((multiplayerMode)? "Crazy Multiplayer Mode: Click to Start!":"Crazy Mode: Click to Start!");
    gameArea.message.update();
    gameArea.reset();
});

const playerColor = document.getElementById('Player');
playerColor.addEventListener('change', function(e){
    paddles.paddleOne.color = e.target.value;
});
const enemyColor = document.getElementById('Enemy');
enemyColor.addEventListener('change', function(e){
    paddles.paddleTwo.color = e.target.value;
    enemyColorSwitched=true;
});

