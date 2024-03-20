// Variables

// Game variables
// Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Background
const backgroundImage = new Image();
backgroundImage.src = 'background.jpg';

// Framerate
const FPS = 60;

// Controls
let mouseX;
let mouseY;
let clicked = false;
let keys = {};

// Physics variables
const G = 5;
const velocityScale = 100;

// Score
let score = 0;

// Fuel
const maxFuel = 100;
let fuel = 100;

// Sound
const rocketSound = new Audio('rocket.wav');
rocketSound.loop = true;



// Objects

// Spaceship
function Spaceship(x, y, size, mass, img) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.mass = mass;

    this.img = new Image();
    this.img.src = img;
    this.img.onload = () => {
        this.scale = size / this.img.height;
    }

    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;

    this.update = function() {
        if(!clicked) {
            return;
        }

        // Gravity
        this.dx = earth.x + earth.size / 2 - (this.x + this.size / 2);
        this.dy = earth.y + earth.size / 2 - (this.y + this.size / 2);
        this.dSquared = this.dx * this.dx + this.dy * this.dy;
        // F = (G * m1 * m2) / r^2
        this.f = (G * this.mass * earth.mass) / this.dSquared;
        // F = m * a
        this.a = this.f / this.mass;
        this.ax += this.a * (this.dx / Math.sqrt(this.dSquared));
        this.ay += this.a * (this.dy / Math.sqrt(this.dSquared));

        // Movement
        if(keys['w']) {
            this.ay -= 0.05;
            fuel -= 1;
        }
        if(keys['a']) {
            this.ax -= 0.05;
            fuel -= 1;
        }
        if(keys['s']) {
            this.ay += 0.05;
            fuel -= 1;
        }
        if(keys['d']) {
            this.ax += 0.05;
            fuel -= 1;
        }

        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;

        // Draw
        ctx.drawImage(this.img, this.x, this.y, this.img.width * this.scale, this.img.height * this.scale);

        // Reset acceleration
        this.ax = 0;
        this.ay = 0;

        // Check if fuel has run out
        if(fuel <= 0) {
            clicked = false;
            fuel = 0;
        }
    }
}
const spaceship = new Spaceship(0, 0, 20, 5, "ufo.png");

// Planet
function Planet(x, y, size, mass, img) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.mass = mass;

    this.img = new Image();
    this.img.src = img;
    this.img.onload = () => {
        this.scale = size / this.img.height;
    }

    this.update = function() {
        ctx.drawImage(this.img, this.x, this.y, this.img.width * this.scale, this.img.height * this.scale);
    }
}
const earth = new Planet(canvas.width / 2, canvas.height / 2, 100, 100, "earth.png");

// Wormhole
function Wormhole(x, y, size, img) {
    this.x = x;
    this.y = y;
    this.size = size;

    this.img = new Image();
    this.img.src = img;
    this.img.onload = () => {
        this.scale = size / this.img.height;
    }

    this.update = function() {
        ctx.drawImage(this.img, this.x, this.y, this.img.width * this.scale, this.img.height * this.scale);
    }
}
let wormhole;



// Functions

// Setup
function setup() {
    resizeCanvas();
    drawBackground();

    // Create random wormhole position
    const minDistance = earth.size + spaceship.size * 2;
    let validPosition = false;
    while(!validPosition) {
        const wormholeX = Math.random() * canvas.width;
        const wormholeY = Math.random() * canvas.height;
        const dx = wormholeX - (earth.x + earth.size / 2);
        const dy = wormholeY - (earth.y + earth.size / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if(distance >= minDistance) {
            validPosition = true;
            wormhole = new Wormhole(wormholeX, wormholeY, 50, 'wormhole.png');
        }
    }

    // Event listeners

    // Resize Canvas
    window.addEventListener('resize', resizeCanvas);

    // Mouse position
    window.addEventListener('mousedown', function(e) {
        // mouseX = e.pageX - canvas.offsetLeft;
        // mouseY = e.pageY - canvas.offsetTop;

        // Create random starting position
        const minDistance = earth.size / 2 + spaceship.size / 2;
        const maxDistance = Math.min(canvas.width, canvas.height) / 2;
        let validPosition = false;
        while(!validPosition) {
            mouseX = Math.random() * canvas.width;
            mouseY = Math.random() * canvas.width;

            const dx = mouseX - (earth.x + earth.size / 2);
            const dy = mouseY - (earth.y + earth.size / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if(distance >= minDistance && distance <= maxDistance) {
                validPosition = true;
            }
        }

        // Calculate distance to center of canvas
        const dx = mouseX - canvas.width / 2;
        const dy = mouseY - canvas.height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Set initial velocity for circular orbit
        const speed = Math.sqrt(G * earth.mass / distance);
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        spaceship.vx = speed * Math.cos(angle);
        spaceship.vy = speed * Math.sin(angle);

        // Update spaceship position to the center of the mouse click
        spaceship.x = mouseX - (spaceship.img.width * spaceship.scale) / 2;
        spaceship.y = mouseY - (spaceship.img.height * spaceship.scale) / 2;
        clicked = true;
        fuel = 100;
    });

    // Key presses and releases
    window.addEventListener('keydown', function(event) {
        keys[event.key] = true;

        // Play rocket sound
        if(event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd') {
            if (!rocketSound.playing) {
                rocketSound.currentTime = 0;
                rocketSound.play();
            }
        }
    });

    window.addEventListener('keyup', function(event) {
        delete keys[event.key];

        // Stop rocket sound
        if (!keys['w'] && !keys['a'] && !keys['s'] && !keys['d']) {
            rocketSound.pause();
        }
    });
}

// Resize canvas to full screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Update earth's position
    earth.x = canvas.width / 2  - earth.size / 2;
    earth.y = canvas.height / 2 - earth.size / 2;
}

// Draw background
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Draw score
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Draw fuel bar
function drawFuelBar() {
    const barWidth = 200;
    const barHeight = 20;
    const barX = canvas.width - barWidth - 10;
    const barY = 10;

    ctx.fillStyle = 'gray';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    ctx.fillStyle = 'green';
    ctx.fillRect(barX, barY, (fuel / maxFuel) * barWidth, barHeight);

    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Fuel: ${fuel}`, barX - 70, barY + 15);
}

// Collisions
function checkEdgeCollisions() {
    if(spaceship.x < 0 || spaceship.x + spaceship.size > canvas.width || spaceship.y < 0 || spaceship.y + spaceship.size > canvas.height) {
        clicked = false;
        fuel = 0;
        rocketSound.pause();
    }
}

function checkObjectCollisions() {
    const dx = (spaceship.x + spaceship.size / 2) - (earth.x + earth.size / 2);
    const dy = (spaceship.y + spaceship.size / 2) - (earth.y + earth.size / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    if(distance < earth.size / 2 + spaceship.size / 2) {
        clicked = false;
        fuel = 0;
        rocketSound.pause();
    }
}

function checkWormholeCollision() {
    const dx = (spaceship.x + spaceship.size / 2) - (wormhole.x + wormhole.size / 2);
    const dy = (spaceship.y + spaceship.size / 2) - (wormhole.y + wormhole.size / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    const collisionDistance = spaceship.size / 3 + wormhole.size / 3;

    if(distance < collisionDistance) {
        clicked = false;
        rocketSound.pause();
        score++;

        // Regenerate wormhole position
        let validPosition = false;
        while(!validPosition) {
            const wormholeX = Math.random() * canvas.width;
            const wormholeY = Math.random() * canvas.height;
            const dx = wormholeX - (earth.x + earth.size / 2);
            const dy = wormholeY - (earth.y + earth.size / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if(distance >= earth.size + spaceship.size * 2) {
                validPosition = true;
                wormhole.x = wormholeX;
                wormhole.y = wormholeY;
            }
        }
    }
}

// Main game loop
function gameLoop() {
    drawBackground();
    drawScore();
    drawFuelBar();

    earth.update();
    wormhole.update();
    spaceship.update();

    checkEdgeCollisions();
    checkObjectCollisions();
    checkWormholeCollision();
}

setup();
setInterval(gameLoop, 1000 / FPS);