console.log("snake.js");

let snakeGame = document.getElementById("snake");

let context = snakeGame.getContext("2d");

const CANVAS_WIDTH = snakeGame.clientWidth;
const CANVAS_HEIGHT = snakeGame.clientHeight;
const BLOCK_WIDTH = CANVAS_WIDTH / 60;
const BLOCK_HEIGHT = CANVAS_HEIGHT / 60;
const DIRECTIONS = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
};

let gameInstance;
let currentDirection = DIRECTIONS.RIGHT;
let futureDirection = currentDirection;
let speed = 1000 / 5;
let snake = [
  {
    posX: BLOCK_WIDTH * 2,
    posY: 0,
    color: "red",
  },
  {
    posX: BLOCK_WIDTH,
    posY: 0,
    color: "red",
  },
  {
    posX: 0,
    posY: 0,
    color: "red",
  },
];

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
  for (let index = 0; index < snake.length; index++) {
    context.beginPath();
    context.fillStyle = snake[index].color;
    context.fillRect(snake[index].posX, snake[index].posY, BLOCK_WIDTH, BLOCK_HEIGHT);
    context.stroke();
  }
}

function moveSnake(direction, snake) {
  let newHead = {
    posX: snake[0].posX,
    posY: snake[0].posY,
    color: snake[0].color,
  };

  switch (direction) {
    case DIRECTIONS.UP:
      newHead.posY -= BLOCK_HEIGHT;
      break;
    case DIRECTIONS.DOWN:
      newHead.posY += BLOCK_HEIGHT;
      break;
    case DIRECTIONS.LEFT:
      newHead.posX -= BLOCK_WIDTH;
      break;
    case DIRECTIONS.RIGHT:
      newHead.posX += BLOCK_WIDTH;
      break;
  }

  snake.unshift(newHead);
  snake.pop();
}

let keydownCallback = (event) => {
  if (event.code === "ArrowUp" && currentDirection !== DIRECTIONS.DOWN) {
    futureDirection = DIRECTIONS.UP;
  } else if (event.code === "ArrowDown" && currentDirection !== DIRECTIONS.UP) {
    futureDirection = DIRECTIONS.DOWN;
  } else if (event.code === "ArrowLeft" && currentDirection !== DIRECTIONS.RIGHT) {
    futureDirection = DIRECTIONS.LEFT;
  } else if (event.code === "ArrowRight" && currentDirection !== DIRECTIONS.LEFT) {
    futureDirection = DIRECTIONS.RIGHT;
  } else {
    return;
  }
};

function gameLoop() {
  moveSnake(futureDirection, snake);
  currentDirection = futureDirection;
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawGrid(context);
  drawSnake(context, snake);
}

drawGrid(context);
drawSnake(context, snake);

document.addEventListener("keydown", function (event) {
  keydownCallback(event);
});

snakeGame.addEventListener("click", () => {
  if (gameInstance === undefined) {
    gameInstance = setInterval(gameLoop, speed);
  }
});
