console.log("snake.js");

// Board of the game

let snakeGame = document.getElementById("snake");
let score = document.getElementById("score");

let context = snakeGame.getContext("2d");

// Constants

const CANVAS_WIDTH = snakeGame.clientWidth;
const CANVAS_HEIGHT = snakeGame.clientHeight;
const NUMBER_OF_COLUMNS = 30;
const NUMBER_OF_ROWS = 30;
const BLOCK_WIDTH = CANVAS_WIDTH / NUMBER_OF_COLUMNS;
const BLOCK_HEIGHT = CANVAS_HEIGHT / NUMBER_OF_ROWS;
const BOARD_MAX_WIDTH = CANVAS_WIDTH - BLOCK_WIDTH * 2;
const BOARD_MAX_HEIGHT = CANVAS_HEIGHT - BLOCK_HEIGHT * 2;
const FPS = 15;
const DIRECTIONS = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
};

// Establish the initial state of the game

let points;
let gameInstance;
let currentDirection;
let futureDirection;
let speed;
let snake = [];
let snack;

// Functions to draw the grid, snack and snake in the game

function drawWalls(context) {
  context.beginPath();
  context.fillStyle = "black";
  context.lineWidth = 2;
  context.rect(BLOCK_WIDTH, BLOCK_HEIGHT, BOARD_MAX_WIDTH, BOARD_MAX_HEIGHT);
  context.stroke();

  //drawGrid(context);
}

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

function drawObject(context, object) {
  context.beginPath();
  context.fillStyle = object.color;
  context.fillRect(object.posX, object.posY, BLOCK_WIDTH, BLOCK_HEIGHT);
  context.stroke();
}

function drawSnake(context, snake) {
  for (let index = 0; index < snake.length; index++) {
    drawObject(context, snake[index]);
  }
}

function drawSnack(context, snack) {
  snack.color = "blue";
  drawObject(context, snack);
}

function drawInstructions() {
  context.font = "40px Arial";
  context.textAlign = "center";
  context.fillStyle = "black";
  context.fillText("¡Click to start!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3);
  context.fillText("Use the arrow keys to move the snake", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
}

// Functions to logic of the game

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
  return snake.pop();
}

function snakeEatSnack(snake, snack) {
  const snakePositionX = Math.trunc(Math.round(snake[0].posX));
  const snakePositionY = Math.trunc(Math.round(snake[0].posY));
  const snackPositionX = Math.trunc(Math.round(snack.posX));
  const snackPositionY = Math.trunc(Math.round(snack.posY));
  // console.log({ snakePositionX, snakePositionY, snackPositionX, snackPositionY });
  return snakePositionX === snackPositionX && snakePositionY === snackPositionY;
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

function updateScore() {
  score.innerHTML = points;
}

function incrementScore() {
  points++;
  updateScore();
}

function gameLoop() {
  let lastTail = moveSnake(futureDirection, snake);
  currentDirection = futureDirection;

  if (snakeEatSnack(snake, snack)) {
    snake.push(lastTail);
    snack = createSnack(snake);
    incrementScore();
  }

  if (occurrenceCollision(snake)) {
    gameOver();
    return;
  }

  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawWalls(context);
  drawSnake(context, snake);
  drawSnack(context, snack);
}

function createSnack(snake = []) {
  while (true) {
    let snack = {
      posX: Math.max(Math.floor(Math.random() * NUMBER_OF_COLUMNS - 1), 1) * BLOCK_WIDTH,
      posY: Math.max(Math.floor(Math.random() * NUMBER_OF_ROWS - 1), 1) * BLOCK_HEIGHT,
    };
    let collision = false;

    if (snake.some((block) => block.posX === snack.posX && block.posY === snack.posY)) {
      collision = true;
    }

    if (collision) {
      continue;
    }
    return snack;
  }
}

function initializeGame() {
  points = 0;
  gameInstance;
  currentDirection = DIRECTIONS.RIGHT;
  futureDirection = currentDirection;
  speed = 1000 / FPS;
  snake = [
    {
      posX: BLOCK_WIDTH * 2,
      posY: BLOCK_HEIGHT,
      color: "red",
    },
    {
      posX: BLOCK_WIDTH,
      posY: BLOCK_HEIGHT,
      color: "red",
    },
  ];
  snack = createSnack();
  updateScore();
  gameInstance = setInterval(gameLoop, speed);
}

function gameOver() {
  clearInterval(gameInstance);
  gameInstance = undefined;
  drawInstructions();
  alert("Game Over your score: " + points);
}

// Colision detection

function occurrenceCollision(snake = []) {
  let head = snake[0];
  const headPositionX = Math.trunc(Math.round(head.posX));
  const headPositionY = Math.trunc(Math.round(head.posY));
  const wallTop = Math.trunc(Math.round(BLOCK_WIDTH));
  const wallLeft = Math.trunc(Math.round(BLOCK_HEIGHT));
  const wallBottom = Math.trunc(Math.round(BOARD_MAX_WIDTH));
  const wallRight = Math.trunc(Math.round(BOARD_MAX_HEIGHT));

  if (headPositionX < wallTop || headPositionY < wallLeft || headPositionX > wallBottom || headPositionY > wallRight) {
    return true;
  }

  return snakeCollision(snake);
}

function snakeCollision(snake = []) {
  if (snake.length < 4) return false;
  const head = snake[0];
  for (var i = 1; i < snake.length; i++) {
    if (head.posX === snake[i].posX && head.posY === snake[i].posY) {
      return true;
    }
  }
}

// Actions

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    clearInterval(gameInstance);
  }
  keydownCallback(event);
});

// Draw the initial state of the game

drawWalls(context);
drawInstructions();

// Start the game loop

snakeGame.addEventListener("click", () => {
  if (gameInstance === undefined) {
    initializeGame();
  }
});
