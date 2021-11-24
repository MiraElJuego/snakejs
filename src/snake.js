console.log("snake.js");

let snakeGame = document.getElementById("snake");

let context = snakeGame.getContext("2d");

const CANVAS_WIDTH = snakeGame.clientWidth;
const CANVAS_HEIGHT = snakeGame.clientHeight;
const BLOCK_WIDTH = CANVAS_WIDTH / 60;
const BLOCK_HEIGHT = CANVAS_HEIGHT / 60;

let snake = {
  posX: 0,
  posY: 0,
  color: "red",
};

console.log(CANVAS_WIDTH, CANVAS_HEIGHT);

function drawGrid(context) {
  for (let x = BLOCK_WIDTH; x < CANVAS_WIDTH; x += BLOCK_WIDTH) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, CANVAS_WIDTH);
    context.stroke();
  }

  for (let y = BLOCK_HEIGHT; y < CANVAS_HEIGHT; y += BLOCK_HEIGHT) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(CANVAS_HEIGHT, y);
    context.stroke();
  }
}

function drawSnake(context, snake) {
  context.beginPath();
  context.fillStyle = snake.color;
  context.fillRect(snake.posX, snake.posY, BLOCK_WIDTH, BLOCK_HEIGHT);
  context.stroke();
}

let keydownCallback = (event) => {
  switch (event.code) {
    case "ArrowUp":
      snake.posY -= BLOCK_HEIGHT;
      break;
    case "ArrowDown":
      snake.posY += BLOCK_HEIGHT;
      break;
    case "ArrowLeft":
      snake.posX -= BLOCK_WIDTH;
      break;
    case "ArrowRight":
      snake.posX += BLOCK_WIDTH;
      break;
    default:
      return;
  }

  console.log(snake);
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawGrid(context);
  drawSnake(context, snake);
};

drawGrid(context);
drawSnake(context, snake);

document.addEventListener("keydown", function (event) {
  keydownCallback(event);
});
