const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ground = 50;
const width = 50;
const height = 100;
let x = 50;
let y = canvas.height - ground - height;
let velocity = 0;
let gravity = 0.5;
let inair = false;
const gokuImage = new Image();
gokuImage.src = 'C:/Users/sidka/Downloads/APP DEVELOPMENT 2023-24/Assignment 1.3/sprites/goku.jpg';
gokuImage.onload = startGame;
const backgroundImage = new Image();
backgroundImage.src = 'C:/Users/sidka/Downloads/APP DEVELOPMENT 2023-24/Assignment 1.3/sprites/terreria.jpg';
backgroundImage.onload = startGame;
const obstacleImage = new Image();
obstacleImage.src = 'C:/Users/sidka/Downloads/APP DEVELOPMENT 2023-24/Assignment 1.3/sprites/steven.jpg';
obstacleImage.onload = startGame;
const obstacleWidth = 50;
const obstacleHeight = 50;
const obstacleSpeed = 5;
let obstacles = [];

function drawPlayer() {
    ctx.drawImage(gokuImage, x, y, width, height);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawGround() {
  //  ctx.fillStyle = 'green';
    //ctx.fillRect(0, canvas.height - ground, canvas.width, ground);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawObstacles() {
    obstacles.forEach(function (obstacle) {
        ctx.drawImage(obstacleImage, obstacle.x, canvas.height - ground - obstacleHeight, obstacleWidth, obstacleHeight);
    });
}

function jump() {
    if (!inair) {
        velocity = -10;
        inair = true;
    }
}

function update() {
    y += velocity;
    velocity += gravity;

    if (y + height >= canvas.height - ground) {
        y = canvas.height - ground - height;
        velocity = 0;
        inair = false;
    }
}

function updateObstacles() {
    obstacles.forEach(function (obstacle) {
        obstacle.x -= obstacleSpeed;
    });

    if (Math.random() < 0.02) {
        obstacles.push({ x: canvas.width, y: 0 });
    }
}

function checkCollision() {
    obstacles.forEach(function (obstacle) {
        if (x < obstacle.x + obstacleWidth &&
            x + width > obstacle.x &&
            y < canvas.height - ground - obstacleHeight + obstacleHeight &&
            y + height > canvas.height - ground - obstacleHeight) {
            document.location.reload();
        }
    });
}

function startGame() {
    clearCanvas();

    drawGround();
    drawPlayer();
    drawObstacles();

    update();
    updateObstacles();
    checkCollision();

    requestAnimationFrame(startGame);
}

document.addEventListener('keydown', function (event) {
    if (event.key === ' ') {
        jump();
    }
});