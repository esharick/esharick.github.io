//JavaScript Objects
const gameArea = {
    canvas: document.createElement("canvas"),

    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.canvas.style.backgroundColor = "gray";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.getElementById("clockCanvas"));
        //obstacle.vx = -1;

        //event listeners - key/mouse listeners
        window.addEventListener('keydown', function (e) {
            if(["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.code))
                e.preventDefault(); //prevents arrow keys from scrolling

            //record the key the user pressed
            gameArea.keys = (gameArea.keys || {});
            gameArea.keys[e.code] = true;
        });

        window.addEventListener('keyup', function (e) {
            gameArea.keys[e.code] = false;
        });
    },

    update: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //check for key presses
        if (gameArea.keys && gameArea.keys["ArrowRight"]) {
            updatePlayerSpeed(1, playerPiece.vy);
        } else if (gameArea.keys && gameArea.keys["ArrowLeft"]) {
            updatePlayerSpeed(-1, playerPiece.vy);
        }
        else
            updatePlayerSpeed(0, playerPiece.vy);

        if (gameArea.keys && gameArea.keys["ArrowUp"]) {
            updatePlayerSpeed(playerPiece.vx, -1);
        } else if (gameArea.keys && gameArea.keys["ArrowDown"]) {
            updatePlayerSpeed(playerPiece.vx, 1);
        }
        else
            updatePlayerSpeed(playerPiece.vx, 0);

        //mouse events
        window.addEventListener('mousemove', function (e) {
            gameArea.mouseX = e.pageX - gameArea.canvas.offsetLeft;
            gameArea.mouseY = e.pageY - gameArea.canvas.offsetTop;
        });

        //touch/tap events
        window.addEventListener('touchmove', function (e) {
            gameArea.touchX = e.touches[0].screenX;
            gameArea.touchY = e.touches[0].screenY;
        });
    }
}
const playerPiece = new component(0, 0, 20, 20, "blue");
const obstacle = new component(300, 200, 20, 120, "green");

//Constructor function (JS style)
function component(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.vx = 0;
    this.vy = 0;

    this.update = function () {
        //movement, other component logic
        this.x += this.vx;
        this.y += this.vy;

        //movePlayerToMouse();

        //redraw the component
        this.ctx = gameArea.context; 
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.collideWith = function (otherObj) {
        let x2 = this.x + this.width; //right side of player
        let y2 = this.y + this.height; //bottom side of player
        let otherx2 = otherObj.x + otherObj.width; //right side of obstacle
        let othery2 = otherObj.y + otherObj.height; //bottom of the obstacle
        if (this.x < otherx2)
            console.log("Colliding");
        //finish wednesday
    }

}

//Once at start
function startGame() {
    //setup anything related to the game
    gameArea.start();
    setInterval(updateGame, 1000 / 40);
}

//Once per frame
function updateGame() {
    gameArea.update();
    playerPiece.update();
    obstacle.update();
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

window.onload = startGame();