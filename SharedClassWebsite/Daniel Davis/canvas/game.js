const img = document.getElementById("bg");

function processAndPositionCanvasForGame(img) {
  const displayedWidth = img.offsetWidth;
  const displayedHeight = img.offsetHeight;
  const scaleX = displayedWidth / img.naturalWidth;
  const scaleY = displayedHeight / img.naturalHeight;

  findTransparentArea(img, function (minX, minY, maxX, maxY) {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) {
      console.error("Game canvas not found!");
      return;
    }

    // Adjusts canvas size and position based on the transparent area of the image
    canvas.width = (maxX - minX) * scaleX;
    canvas.height = (maxY - minY) * scaleY;
    canvas.style.position = "absolute";
    canvas.style.left = `${img.offsetLeft + minX * scaleX}px`;
    canvas.style.top = `${img.offsetTop + minY * scaleY}px`;

    // Start the game
    startSnakeGame(canvas);
  });
}

function findTransparentArea(img, callback) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  let minX = canvas.width,
    minY = canvas.height,
    maxX = 0,
    maxY = 0;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const alpha = pixels[y * (canvas.width * 4) + x * 4 + 3];
      if (alpha === 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  callback(minX, minY, maxX, maxY);
}

if (img.complete) {
  processAndPositionCanvasForGame(img);
} else {
  img.onload = () => processAndPositionCanvasForGame(img);
}

// This part is for the snake game.
function startSnakeGame(canvas) {
  if (!canvas) return; // Guard clause

  const ctx = canvas.getContext("2d");
  const box = 20;
  const gridSize = Math.min(canvas.width / box, canvas.height / box);
  let snake = [{ x: 10 * box, y: 10 * box }];
  let food = { x: 0, y: 0 };
  let direction = "right";
  let inputQueue = [];

  function generateFood() {
    food.x = Math.floor(Math.random() * gridSize) * box;
    food.y = Math.floor(Math.random() * gridSize) * box;
  }

  generateFood();

  function draw() {
    processInput();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake and food.
    snake.forEach((segment) => ctx.fillRect(segment.x, segment.y, box, box));
    ctx.fillStyle = "green";

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
      case "right":
        head.x += box;
        break;
      case "left":
        head.x -= box;
        break;
      case "up":
        head.y -= box;
        break;
      case "down":
        head.y += box;
        break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      generateFood();
    } else {
      snake.pop();
    }

    if (
      snake[0].x < 0 ||
      snake[0].x >= canvas.width ||
      snake[0].y < 0 ||
      snake[0].y >= canvas.height ||
      snake
        .slice(1)
        .some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      clearInterval(game);
      alert("Game Over! Your score: " + (snake.length - 1));
    }
  }

  function processInput() {
    if (inputQueue.length > 0) {
      const keyPressed = inputQueue.shift();
      const dirMap = { 37: "left", 38: "up", 39: "right", 40: "down" };
      const oppositeDir = {
        left: "right",
        right: "left",
        up: "down",
        down: "up",
      };
      const newDirection = dirMap[keyPressed];
      if (direction !== oppositeDir[newDirection]) {
        direction = newDirection;
      }
    }
  }

  function changeDirection(e) {
    const validKeys = [37, 38, 39, 40];
    if (validKeys.includes(e.keyCode) && !inputQueue.includes(e.keyCode)) {
      inputQueue.push(e.keyCode);
    }
  }

  document.addEventListener("keydown", changeDirection);

  let game = setInterval(draw, 100);
}

window.addEventListener("resize", function () {
  if (img.complete) {
    processAndPositionCanvasForGame(img);
  }
});
