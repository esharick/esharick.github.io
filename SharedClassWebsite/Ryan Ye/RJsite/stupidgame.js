/*
todo:
calibrate movement of player around the board
Grid (later replaced with map using same/similar logic or just generated)
enemies
dash

maybe:
bullets
hp/enemy hp
*/

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


const swooshSound = new Sound("./audio/wing.wav");
var hurtSound = [];
var damageSound = [];
const heal1 = new Sound("./audio/heal1.mp3");
const heal2 = new Sound("./audio/heal2.mp3");
const gameoversound = new Sound("./audio/gameover.mp3");
var healtimer = 0;

var playerImage = new Image();
playerImage.src = "./hero.png";

var petImage = new Image();
petImage.src = "./pet.png";

var monsterImage = new Image();
monsterImage.src = "./monster.webp";

var floor = new Image();
floor.src = "./floor.jpg";


class GameArea {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);

        this.restore();
    }

    restore() {

        this.frameCount = 0;

        this.enemy_gen_cooldown = 0;
        this.enemy_gen_rate = 40;
        this.enemy_cap = 30;



        this.player = new Player(0, 0, 60, 60, 'blue', 100);

        this.pet = new Pet(300, 300, 60, 60, 'green', this.player);

        this.enemies = [];

        //this.object = new Obstacle(400, 400, 20, 20, 'black');
        this.grid = new Grid(100, 'gray');

        this.points = 0;
        healtimer = 0;
        

        paused = false;
        gameover = false;



        FPS = 30;
        CanvasX = 0;
        CanvasY = 0;
        OffsetX = -640;
        OffsetY = -360;

        this.player_dash_cooldown = FPS*3;
        this.dash_cooldown_counter = this.player_dash_cooldown;

        hurtSound = [];
        for (let i = 0; i < this.enemy_cap; i++) {
            hurtSound.push(new Sound("./audio/hurt.mp3"));
        }
        damageSound = [];
        for (let i = 0; i < this.enemy_cap; i++) {
            damageSound.push(new Sound("./audio/damage.mp3"));
        }

        console.log("GA constructor successful");
    }

    start() {
        
        gameInterval = setInterval(this.update, 1000 / FPS);
        console.log("GA start successful");

        window.addEventListener('mousemove', (e) => {
            this.mousePosition = { x: e.pageX, y: e.pageY };
        });

        window.addEventListener('mousedown', (e) => {
            if (this.dash_cooldown_counter > this.player_dash_cooldown &&!gameover &&!paused) {
                this.player.dash_counter = FPS * 0.4;
                this.dash_cooldown_counter = 0;
                swooshSound.play();
            }
           // console.log(this.dash_cooldown_counter);
        });

        window.addEventListener('keydown', (event) => {
            // Check if the pressed key has a specific keycode
            if (event.keyCode === 80 && !gameover) { // Example: Check if the spacebar (keycode 32) is pressed
                if (paused) this.unpauseGame();
                else this.pauseGame();
                // Add your logic here for when the key is pressed
            }

            if (event.keyCode === 82) {
                this.gameOver();
            }

            if (event.keyCode === 83 && gameover) {
                gameover = false;
                paused = false;
                this.restore();
                this.update();
                this.unpauseGame();
            }

        });
       
    }

    update() {

        this.frameCount += 1;
    //    this.frameCount %= FPS;



        gameArea.context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);



        let pfollowRatio = 0.025;
        let mouseX = gameArea.mousePosition.x - gameArea.canvas.offsetLeft - gameArea.player.width / 2;
        let mouseY = gameArea.mousePosition.y - gameArea.canvas.offsetTop - gameArea.player.height / 2;

        let cfollowRatio = pfollowRatio * 3;

        //CanvasX = (CanvasX * (1-cfollowRatio) + (cfollowRatio) * this.player.x);
        //CanvasY = (CanvasY * (1-cfollowRatio) + (cfollowRatio) * this.player.y);

        CanvasX = gameArea.player.x;
        CanvasY = gameArea.player.y;

        //CanvasX = (CanvasX + this.player.x)/2;
        //CanvasY = (CanvasY + this.player.y)/2;

        let Ofollowratio = 0.75;


        OffsetX = OffsetX * Ofollowratio + (1 - Ofollowratio) * (CanvasX - (640 - (mouseX - 640) / 3));
        OffsetY = OffsetY * Ofollowratio + (1 - Ofollowratio) * (CanvasY - (360 - (mouseY - 360) / 3));

        //OffsetX = (OffsetX + TOffsetX) / 2;
        //OffsetY = (OffsetY + TOffsetY) / 2;



        gameArea.grid.update(OffsetX, OffsetY);

        // Draw the player
        gameArea.player.update(mouseX, mouseY, pfollowRatio);

        gameArea.dash_cooldown_counter+=1;

        gameArea.pet.update();

        this.healtimer += 1;

        console.log(healtimer);

        if (gameArea.pet.colloding_with_player()) {
            gameArea.player.update_Health(0.5);
            let randomsound = Math.random();
            if (healtimer > 30 && gameArea.player.health<gameArea.player.max_health) {
                if (randomsound < .5) { heal1.play(); }
                else { heal2.play(); }
                healtimer = 0;
            }
        }

        gameArea.generate_enemies();

        for (let i of gameArea.enemies) {
            i.update();
        }

        for (let i = gameArea.enemies.length - 1; i >= 0; i--) {
            if (gameArea.enemies[i].colloding_with_player() == true) {
                if (gameArea.player.dash_counter > 0) {
                    gameArea.enemies.splice(i, 1);
                    gameArea.points++;
                    hurtSound[i].play()

                    
                }
                else {
                    gameArea.player.update_Health(-1);
                    damageSound[i].play();
                }
            }
        }

        gameArea.draw_healthbar();
        gameArea.draw_dashbar();
        gameArea.draw_points();

        //gameArea.object.update();

        gameArea.check_gameOver();




    }

    check_gameOver() {
        if (gameArea.player.health < 0) {
            this.gameOver();
        }
    }

    draw_points() {
        gameArea.context.font = "15px Arial";
        gameArea.context.fillStyle = "black";
        gameArea.context.textAlign = "center";
        gameArea.context.textBaseline = "middle";

        // Get the center coordinates of the canvas
        var centerX = gameArea.canvas.width-100;
        var centerY = 50;

        gameArea.context.fillStyle = 'white';

        gameArea.context.fillText("Enemies Slain: "+gameArea.points, centerX, centerY);
    }

    draw_healthbar() {
        let healthPercentage = gameArea.player.health / gameArea.player.max_health;

        let healthBarWidth = 300;
        let healthBarHeight = 20;

        let fillColor = (healthPercentage > 0.5) ? "green" : "red";

        gameArea.context.fillStyle = "gray";
        gameArea.context.fillRect(0, 10, healthBarWidth, healthBarHeight);
        gameArea.context.fillStyle = fillColor;
        gameArea.context.fillRect(0, 10, healthBarWidth * healthPercentage, healthBarHeight);
    }

    draw_dashbar() {
        let dashPercentage = gameArea.dash_cooldown_counter / gameArea.player_dash_cooldown;

        if (dashPercentage > 1) dashPercentage = 1;

      //  console.log(dashPercentage);


        let dashBarWidth = 300;
        let dashBarHeight = 20;


        if (dashPercentage == 1) {
            gameArea.context.fillStyle = "orange";
            gameArea.context.fillRect(495, 5, dashBarWidth+10, dashBarHeight+10);
        }


        gameArea.context.fillStyle = "gray";
        gameArea.context.fillRect(500, 10, dashBarWidth, dashBarHeight);
        gameArea.context.fillStyle = "blue";
        gameArea.context.fillRect(500, 10, dashBarWidth * dashPercentage, dashBarHeight);
    }

    generate_enemies() {
        gameArea.enemy_gen_cooldown++;

        if (this.enemy_gen_cooldown > this.enemy_gen_rate && gameArea.enemies.length < this.enemy_cap) {
            gameArea.enemy_gen_cooldown = 0;
            let angle = Math.random() * 2 * 3.1415926;
            let generation_dist = 800;
            let x_displacement = generation_dist * Math.cos(angle);
            let y_displacement = generation_dist * Math.sin(angle);

            let enemy_x = x_displacement - OffsetX;
            let enemy_y = y_displacement - OffsetY;

            let enemy_speed = Math.random() * 4 + 3 + gameArea.points/15;

            gameArea.enemies.push(new Enemy(enemy_x, enemy_y, 45, 45, 'red', gameArea.player, enemy_speed));


            
        }
        
        
    }

    

    reset() {
        clearInterval(gameInterval);
    }

    pauseGame() {
        this.reset();
        paused = true;
        gameArea.context.fillStyle = 'white';
        gameArea.context.fillRect(100, 100, 25, 70);
        gameArea.context.fillRect(140, 100, 25, 70);

    }

    gameOver() {
        this.reset();
        paused = true; gameover = true;
        gameArea.context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);
        gameArea.grid.update(OffsetX, OffsetY);

        gameArea.context.font = "40px Arial";
        gameArea.context.fillStyle = "red";
        gameArea.context.textAlign = "center";
        gameArea.context.textBaseline = "middle";

        // Get the center coordinates of the canvas
        var centerX = gameArea.canvas.width / 2;
        var centerY = gameArea.canvas.height / 2;

        gameArea.context.fillText("Game Over. Press \'S\' to start. Slain: " + gameArea.points, centerX, centerY);

        gameoversound.play()

    }

    unpauseGame() {
        gameInterval = setInterval(this.update, 1000 / FPS);
        paused = false;
    }
}


class Grid {
    constructor(gridlength, color) {
        this.gridlength = gridlength;
        this.color = color;
    }

    //update(x=0, y=0) {
    //    gameArea.context.fillStyle = this.color;

    //    for (let i = x - x % this.gridlength; i <= x + 1280; i += this.gridlength) {
    //        gameArea.context.fillRect(i - OffsetX, 0, 1, 720)
    //    }
    //    for (let j = y - y % this.gridlength; j <= y + 720; j += this.gridlength) {
    //        gameArea.context.fillRect(0, j-OffsetY, 1280, 1)
    //    }

    //    //add images
    //}
    update(x = 0, y = 0) {
        let width = 250;
        let height = 125;
        for (let i = x - x % width-250; i <= x + 1280; i += width) {
            for (let j = y - y % height-125; j <= y + 720; j += height) {
                gameArea.context.drawImage(floor, i-x, j-y, width, height);
            }
        }


        //add images
    }
}

class Player {
    constructor(x, y, width, height, color, max_health) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.dash_counter = 0;
        this.aftershadow = [];
        this.max_health = max_health;
        this.health = max_health;
    }

    update(mouseX = 640, mouseY = 360, followRatio = 0.01) {

        let max_speed = 300;
        let dash_inteval = 3.5;

        let old_x = this.x; let old_y = this.y;

        
        let new_x = ((mouseX + OffsetX) * followRatio + (1 - followRatio) * this.x); //determines follow ratio
        let new_y = ((mouseY + OffsetY) * followRatio + (1 - followRatio) * this.y);


        let x_dist = old_x - new_x;
        let y_dist = old_y - new_y;

        //if (this.frameCount == 1) {
        //    console.log(x_dist + " " + y_dist);
        //}

        if (this.dash_counter > 0) {
            
            new_x -= x_dist * dash_inteval;
            new_y -= y_dist * dash_inteval;

            this.dash_counter--;
        }

        let speed = Math.sqrt(x_dist * x_dist + y_dist * y_dist);


        if (speed < max_speed) {
            this.x = new_x;
            this.y = new_y;
        }
        else {

            let ratio = max_speed / speed;
            if (this.dash_counter > 0) {
                ratio *= dash_inteval;
            }
            this.x -= ratio * x_dist;
            this.y -= ratio * y_dist;
        }

        this.render();
    }

    render() {

        
        //render shadown
        let temp = [...this.aftershadow];
        this.aftershadow.push([this.x, this.y]);

        let shadow_length = 6;
        let oldCss = 'rgba(0,0,255,1)';

        for (let i = 1; temp.length > 0 && i < shadow_length; i++) {
            //oldCss = 'rgba(0,0,255,' + (.35 * i / shadow_length) + ')';
            let shadow = temp.shift();
            //gameArea.context.fillStyle = oldCss;
            //gameArea.context.fillRect(shadow[0] - OffsetX, shadow[1] - OffsetY, this.width, this.height
            gameArea.context.globalAlpha = .35 * i / shadow_length;
            gameArea.context.drawImage(playerImage, shadow[0] - OffsetX, shadow[1] - OffsetY, this.width, this.height);
            gameArea.context.globalAlpha = 1;

            if (i == shadow_length - 1) this.aftershadow.shift();



        }


        //gameArea.context.fillStyle = this.color;
        //gameArea.context.fillRect(this.x - OffsetX, this.y - OffsetY, this.width, this.height

        gameArea.context.drawImage(playerImage, this.x - OffsetX, this.y - OffsetY, this.width, this.height);

    }

    update_Health(increment) {
        this.health += increment;
        if (this.health > this.max_health) this.health = this.max_health;
    }
}

class Pet {
    constructor(x, y, width, height, color, player) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.player = player;
    }
    update() {

        let max_speed = 100, followRatio=0.1;

        let old_x = this.x; let old_y = this.y;

        let new_x = ((this.player.x) * followRatio + (1 - followRatio) * this.x); //determines follow ratio
        let new_y = ((this.player.y) * followRatio + (1 - followRatio) * this.y);


        let x_dist = old_x - new_x;
        let y_dist = old_y - new_y;


        let speed = Math.sqrt(x_dist * x_dist + y_dist * y_dist);


        if (speed < max_speed) {
            this.x = new_x;
            this.y = new_y;
        }
        else {

            let ratio = max_speed / speed;
            this.x -= ratio * x_dist;
            this.y -= ratio * y_dist;
        }

        this.render();

    }
    render() {

        gameArea.context.drawImage(petImage, this.x - OffsetX, this.y - OffsetY, this.width, this.height);


        //gameArea.context.fillStyle = this.color;
        //gameArea.context.fillRect(this.x - OffsetX, this.y - OffsetY, this.width, this.height);
    }

    colloding_with_player() {
        //put something like an attack buff
        return (
            this.x < this.player.x + this.player.width &&
            this.x + this.width > this.player.x &&
            this.y < this.player.y + this.player.height &&
            this.y + this.height > this.player.y
        );
    }
}

class Obstacle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    update() {
        gameArea.context.fillStyle = this.color;


        gameArea.context.fillRect(this.x - OffsetX, this.y - OffsetY, this.width, this.height);


    }
}

class Enemy {
    constructor(x, y, width, height, color, player, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.player = player;
        this.speed = speed;
    }
    update() {

        let max_speed = this.speed;

        let old_x = this.x; let old_y = this.y;


        let x_dist = this.x - this.player.x, y_dist = this.y - this.player.y;

        let dist = Math.sqrt(x_dist * x_dist + y_dist * y_dist);


        let ratio = max_speed / dist;

        if (dist < max_speed) {
            this.x = this.player.x;
            this.y = this.player.y;
        }
        else {
            this.x -= ratio * x_dist;
            this.y -= ratio * y_dist;
        }

        this.render();

    }
    render() {

        gameArea.context.drawImage(monsterImage, this.x - OffsetX, this.y - OffsetY, this.width, this.height);

        //gameArea.context.fillStyle = this.color;
        //gameArea.context.fillRect(this.x - OffsetX, this.y - OffsetY, this.width, this.height);
    }

    colloding_with_player() {
        return (
            this.x < this.player.x + this.player.width &&
            this.x + this.width > this.player.x &&
            this.y < this.player.y + this.player.height &&
            this.y + this.height > this.player.y
        );
    }
}


/*

given xdist and ydist
dist = sqrt(xdist*xdist+ydist*ydist)
ratio = speed/dist
x-xdist*ratio
y-ydist*ratio

this way theres no need for trigonometry

*/

// JavaScript Objects
var gameArea = new GameArea();
gameArea.player = new Player(0, 0, 60, 60, 'blue', 100);

gameArea.pet = new Pet(300, 300, 60, 60, 'green', gameArea.player);

gameArea.enemies = [];

//gameArea.object = new Obstacle(400, 400, 20, 20, 'black');
gameArea.grid = new Grid(100, 'gray');
var paused = false, gameover=false;
var gameInterval;
var FPS = 30;
var CanvasX=0;
var CanvasY = 0;
var OffsetX = -640;
var OffsetY = -360;

// Once at start
function startGame() {
    gameArea.start();
}

window.onload = startGame;