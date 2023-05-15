const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const BALL_RADIUS = 5;
const BRICK_WIDTH = 50;
const BRICK_HEIGHT = 20;
const NUM_BRICKS = 40;
const MAX_LIVES = 3;
const SCORE_PER_BRICK = 10;

// Define game variables
let canvas;
let ctx;
let paddle;
let ball;
let bricks;
let powerUps;
let score;
let lives;
let gameStarted;
let gamePaused;

// Define game classes
class Paddle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 5;
  }
  
  moveLeft() {
    this.x -= this.speed;
    if (this.x < 0) {
      this.x = 0;
    }
  }
  
  moveRight() {
    this.x += this.speed;
    if (this.x + this.width > canvas.width) {
      this.x = canvas.width - this.width;
    }
  }
  
  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
}

class Ball {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = 5;
    this.dx = this.speed;
    this.dy = -this.speed;
  }
  
  move() {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x < this.radius || this.x > canvas.width - this.radius) {
      this.dx = -this.dx;
    }
    if (this.y < this.radius) {
      this.dy = -this.dy;
    }
    if (this.y > canvas.height - this.radius) {
      this.reset();
      lives--;
      if (lives < 0) {
        endGame();
      }
    }
  }
  
  collideWithPaddle() {
    if (this.y + this.radius > paddle.y && 
        this.x > paddle.x && 
        this.x < paddle.x + paddle.width) {
            this.dy = -this.speed;
    return true;
  } else {
    return false;
            
  }
  this.dy=-this.dy;
}

collideWithBrick(brick) {
let ballTop = this.y - this.radius;
let ballBottom = this.y + this.radius;
let ballLeft = this.x - this.radius;
let ballRight = this.x + this.radius;
let brickTop = brick.y;
let brickBottom = brick.y + brick.height;
let brickLeft = brick.x;
let brickRight = brick.x + brick.width;
if (ballBottom >= brickTop && ballTop <= brickBottom && ballRight >= brickLeft && ballLeft <= brickRight) {
    if (Math.abs(ballRight - brickLeft) < Math.abs(ballLeft - brickRight)) {
      this.dx = -this.dx;
    } else {
      this.dy = -this.dy;
    }
    return true;
  } else {
    return false;
  }
}

  reset() {
  this.x = canvas.width/2;
  this.y = paddle.y - this.radius;
  this.dx = this.speed;
  this.dy = -this.speed;
  gameStarted = false;
  }

  draw() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
  }
}
  
  
  class Brick {
  constructor(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = "#0095DD";
  this.isDestroyed = false;
  }
  
  draw() {
  if (!this.isDestroyed) {
  ctx.beginPath();
  ctx.rect(this.x, this.y, this.width, this.height);
  ctx.fillStyle = this.color;
  ctx.fill();
  ctx.closePath();
  }
  }
  }
  
  // Define game functions
  function initGame() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  paddle = new Paddle(canvas.width/2 - PADDLE_WIDTH/2, canvas.height - 50, PADDLE_WIDTH, PADDLE_HEIGHT);
  ball = new Ball(canvas.width/2, paddle.y - BALL_RADIUS, BALL_RADIUS);
  bricks = [];
  powerUps = [];
  score = 0;
  lives = MAX_LIVES;
  gameStarted = false;
  gamePaused = false;
  
  for (let i = 0; i < NUM_BRICKS; i++) {
  let x = (i % 10) * (BRICK_WIDTH + 10) + 40;
  let y = Math.floor(i / 10) * (BRICK_HEIGHT + 10) + 30;
  bricks.push(new Brick(x, y, BRICK_WIDTH, BRICK_HEIGHT));
  }
  
  drawGame();
  }
  
  function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw paddle
  paddle.draw();
  
  // Draw ball
  ball.draw();
  
  // Draw bricks
  for (let brick of bricks) {
  brick.draw();
  }
  
  // Draw score and lives
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
  ctx.fillText("Lives: " + lives, canvas.width - 80, 20);
  
  if (!gameStarted) {
  ctx.font = "30px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Click to start", canvas.width/2 - 120, canvas.height/2);
}

if (gamePaused) {
ctx.font = "30px Arial";
ctx.fillStyle = "#0095DD";
ctx.fillText("Paused", canvas.width/2 - 60, canvas.height/2);
}

if (powerUps.length > 0) {
for (let i = 0; i < powerUps.length; i++) {
if (!powerUps[i].isDestroyed) {
powerUps[i].draw();
}
}
}

// Check for game over
if (lives === 0) {
gameOver();
}

// Check for level complete
let bricksLeft = 0;
for (let brick of bricks) {
if (!brick.isDestroyed) {
bricksLeft++;
}
}
if (bricksLeft === 0) {
levelComplete();
}

// Move ball
if (gameStarted && !gamePaused) {
ball.move();// Check for collisions
if (ball.collideWithPaddle(paddle)) {
  let dx = ball.x - (paddle.x + paddle.width/2);
  ball.dx = dx / (paddle.width/2) * ball.speed;
}

for (let i = 0; i < bricks.length; i++) {
  if (!bricks[i].isDestroyed && ball.collideWithBrick(bricks[i])) {
    bricks[i].isDestroyed = true;
    score += BRICK_POINTS;
    if (Math.random() < POWER_UP_PROBABILITY) {
      let powerUp = new PowerUp(bricks[i].x + bricks[i].width/2, bricks[i].y + bricks[i].height/2, POWER_UP_SIZE);
      powerUps.push(powerUp);
    }
  }
}

for (let i = 0; i < powerUps.length; i++) {
  if (!powerUps[i].isDestroyed && powerUps[i].collideWithPaddle(paddle)) {
    powerUps[i].applyPowerUp();
    powerUps[i].isDestroyed = true;
  }
}}

requestAnimationFrame(drawGame);
}

function gameOver() {
alert("Game over!");
document.location.reload();
}

function levelComplete() {
alert("You win!");
document.location.reload();
}

function togglePause() {
gamePaused = !gamePaused;
}

// Handle user input
document.addEventListener("keydown", function(event) {
if (event.keyCode === 37) {
paddle.moveLeft();
} else if (event.keyCode === 39) {
paddle.moveRight();
} else if (event.keyCode === 32) {
gameStarted = true;
} else if (event.keyCode === 80) {
togglePause();
}
});

document.addEventListener("keyup", function(event) {
if (event.keyCode === 37 || event.keyCode === 39) {
paddle.stop();
}
});

document.addEventListener("mousemove", function(event) {
let mouseX = event.clientX - canvas.offsetLeft;
if (mouseX > paddle.width/2 && mouseX < canvas.width - paddle.width/2) {
paddle.x = mouseX - paddle.width/2;
}
});

// Start the game
initGame();