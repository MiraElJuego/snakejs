console.log("snake.js");

// Board of the game

let snakeGame = document.getElementById("snake");

let context = snakeGame.getContext("2d");

// Constants

const CANVAS_WIDTH = snakeGame.clientWidth;
const CANVAS_HEIGHT = snakeGame.clientHeight;
const NUMBER_OF_COLUMNS = 60;
const NUMBER_OF_ROWS = 60;
const BLOCK_WIDTH = CANVAS_WIDTH / NUMBER_OF_COLUMNS;
const BLOCK_HEIGHT = CANVAS_HEIGHT / NUMBER_OF_ROWS;
const DIRECTIONS = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
};

// Establish the initial state of the game

let gameInstance;
let currentDirection = DIRECTIONS.RIGHT;
let futureDirection = currentDirection;
let speed = 1000 / 20;
let snake = [
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
  {
    posX: BLOCK_WIDTH,
    posY: BLOCK_HEIGHT,
    color: "red",
  },
];
let snack = createSnack();

console.log(CANVAS_WIDTH, CANVAS_HEIGHT);

// Functions to draw the grid, snack and snake in the game

function drawWalls(context) {
  context.beginPath();
  context.fillStyle = "black";
  context.lineWidth = 2;
  context.rect(BLOCK_WIDTH, BLOCK_HEIGHT, CANVAS_WIDTH - BLOCK_WIDTH * 2, CANVAS_HEIGHT - BLOCK_HEIGHT * 2);
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

function gameLoop() {
  let lastTail = moveSnake(futureDirection, snake);
  currentDirection = futureDirection;

  if (snakeEatSnack(snake, snack)) {
    snake.push(lastTail);
    snack = createSnack(snake);
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

// Actions

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    clearInterval(gameInstance);
  }
  keydownCallback(event);
});

// Draw the initial state of the game

drawWalls(context);
drawSnake(context, snake);
drawSnack(context, snack);

// Start the game loop

snakeGame.addEventListener("click", () => {
  if (gameInstance === undefined) {
    gameInstance = setInterval(gameLoop, speed);
  }
});
