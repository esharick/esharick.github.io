const playerPiece = new component(0, 0, 40, 40, "red");
const obstacle = new component(300, 200, 20, 120, "green");

const gameArea = {
    canvas: document.createElement("canvas"),
    setup: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.canvas.style.backgroundColor = "gray";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas,
            document.getElementById("clockCanvas"));

        //for key presses
        window.addEventListener('keydown', function (e) {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
                e.preventDefault();
            }

            gameArea.keys = (gameArea.keys || {});
            gameArea.keys[e.code] = true;
        });
        window.addEventListener('keyup', function (e) {
            gameArea.keys[e.code] = false;
        });

        //for mouse clicks
        window.addEventListener('mousemove', function (e)
        {
            gameArea.mouseX = e.pageX - gameArea.canvas.offsetLeft;
            gameArea.mouseY = e.pageY - gameArea.canvas.offsetTop;
        });

        //touch event/tap event
        window.addEventListener('touchmove', function (e) {
            gameArea.touchX = e.touches[0].screenX;
            gameArea.touchY = e.touches[0].screenY;
        });
    },

    update: function () {
        //clears the background
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //move player based on events
        if (gameArea.keys && gameArea.keys["ArrowLeft"])
            movePlayer(-1, playerPiece.vy)
        else if (gameArea.keys && gameArea.keys["ArrowRight"])
            movePlayer(1, playerPiece.vy);
        else
            movePlayer(0, playerPiece.vy);

        if (gameArea.keys && gameArea.keys["ArrowUp"])
            movePlayer(playerPiece.vx, -1);
        else if (gameArea.keys && gameArea.keys["ArrowDown"])
            movePlayer(playerPiece.vx, 1);
        else
            movePlayer(playerPiece.vx, 0);

        ////move with mouse
        if (gameArea.mouseX && gameArea.mouseY) {
            playerPiece.x = gameArea.mouseX;
            playerPiece.y = gameArea.mouseY;
        }



        //score, UI components
    },
}

function component(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.vx = 0;
    this.vy = 0;

    this.update = function () {
        //movement
        this.x += this.vx;
        this.y += this.vy;

        //redraws itself
        let ctx = gameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
            console.log("Colliding");
        }
    }

}

function startGame() {
    gameArea.setup();
    setInterval(updateGame, 1000 / 60);
}

function updateGame() {
    gameArea.update();
    playerPiece.update();
    obstacle.update();
    playerPiece.collideWith(obstacle);
}

function movePlayer(vx, vy) {
    playerPiece.vx = vx;
    playerPiece.vy = vy;
}

window.onload = startGame();


