let canvas;
let gameWorld;

window.onload = () => {
  "use strict";

  canvas = document.getElementById("canvas");
  canvas.width = 800;
  canvas.height = 520;

  gameWorld = new Game(canvas);
  window.gameWorld = gameWorld;
  window.requestAnimationFrame((timeStamp) => gameWorld.gameLoop(timeStamp));
};

const BACKGROUND_COLOR = "#0f172a";
const FLOOR_COLOR = "#1e293b";
const CATCHER_WIDTH = 110;
const CATCHER_HEIGHT = 28;
const START_LIVES = 3;
const FALL_SPEED = 180;
const OBSTACLE_SPEED = 220;

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.ui = new GameUI(canvas);

    this.score = 0;
    this.lives = START_LIVES;
    this.run = false;
    this.gameOver = false;
    this.oldTimeStamp = 0;
    this.spawnTimer = 0;
    this.spawnTime = 1.1;
    this.gameTime = 0;
    this.images = {
      heart: new Image(),
      bomb: new Image(),
    };
    this.images.heart.src = "img/heart.png";
    this.images.bomb.src = "img/bomb.png";

    this.fallingObjects = [];
    this.obstacles = [];

    this.createActors();
    this.listenForPlayerInput();
    this.draw();
    this.showStart();
  }

  createActors() {
    this.catcher = new Catcher(
      this.context,
      this.width / 2 - CATCHER_WIDTH / 2,
      this.height - 64,
      CATCHER_WIDTH,
      CATCHER_HEIGHT,
    );
  }

  listenForPlayerInput() {
    window.addEventListener("keydown", (event) => {
      if (event.code === "ArrowLeft") {
        this.catcher.moveLeft = true;
      } else if (event.code === "ArrowRight") {
        this.catcher.moveRight = true;
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.code === "ArrowLeft") {
        this.catcher.moveLeft = false;
      } else if (event.code === "ArrowRight") {
        this.catcher.moveRight = false;
      }
    });

    // this.canvas.addEventListener("mousemove", (event) => {
    //   if (!this.run || this.gameOver) {
    //     return;
    //   }

    //   this.catcher.moveToCenter(this.canvasX(event.clientX), this.width);
    // });

    this.canvas.addEventListener("touchmove", (event) => {
      if (!this.run || this.gameOver) {
        return;
      }

      let touch = event.targetTouches[0];
      this.catcher.moveToCenter(this.canvasX(touch.clientX), this.width);
    });
  }

  gameLoop(timeStamp) {
    let secondsPassed = (timeStamp - this.oldTimeStamp) / 1000 || 0;
    secondsPassed = Math.min(secondsPassed, 0.05);
    this.oldTimeStamp = timeStamp;

    if (this.run) {
      this.update(secondsPassed);
    }

    this.draw();
    window.requestAnimationFrame((nextTimeStamp) =>
      this.gameLoop(nextTimeStamp),
    );
  }

  update(secondsPassed) {
    this.catcher.update(secondsPassed, this.width);
    this.gameTime += secondsPassed;
    this.catcher.speed = Math.min(850, 520 + this.gameTime * 2);

    // TODO: Spawn falling objects and obstacles.
    // Hint: call this.spawnItems(secondsPassed).
    this.spawnItems(secondsPassed);

    // TODO: Update falling objects and obstacles.
    // Hint: loop over this.fallingObjects and this.obstacles.
    for (let i = 0; i < this.fallingObjects.length; i++) {
      this.fallingObjects[i].update(secondsPassed);
    }

    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].update(secondsPassed);
    }

    // TODO: Check if catcher touches a falling object.
    // If yes, increase score and remove that object.

    // TODO: Check if catcher touches an obstacle.
    // If yes, lose a life and remove that obstacle.

    // TODO: Remove items that leave the screen.
    // If a falling object reaches the bottom, lose a life.
    for (let i = this.fallingObjects.length - 1; i >= 0; i--) {
      const object = this.fallingObjects[i];

      if (object.isTouching(this.catcher)) {
        if (object instanceof Heart) {
          this.lives++;
        } else if (object instanceof Bomb) {
          this.showGameOver();
          return;
        } else {
          this.score++;
        }
        this.fallingObjects.splice(i, 1);
      }
    }
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];

      if (obstacle.isTouching(this.catcher)) {
        this.lives--;

        this.obstacles.splice(i, 1);

        if (this.lives <= 0) {
          this.showGameOver();
          return;
        }
      }
    }

    // TODO: If lives is 0, set gameOver and show restart UI.
  }

  spawnItems(secondsPassed) {
    this.spawnTimer += secondsPassed;

    if (this.spawnTimer < this.spawnTime) {
      return;
    }

    this.spawnTimer = 0;

    // TODO: Randomly create either a FallingObject or an Obstacle.
    // Helpful values:
    // let x = Math.random() * (this.width - 40);
    // let shouldSpawnObstacle = Math.random() < 0.3;
    //
    // Falling object example:
    // this.fallingObjects.push(new FallingObject(this.context, x, -32, 32, FALL_SPEED));
    //
    // Obstacle example:
    // this.obstacles.push(new Obstacle(this.context, x, -36, 44, 28, OBSTACLE_SPEED));

    let x = Math.random() * (this.width - 40);
    let level = Math.floor(this.score / 5);
    if (Math.random() < 0.3) {
      this.obstacles.push(
        new Obstacle(this.context, x, -36, 44, 28, OBSTACLE_SPEED + level * 20),
      );
    }

    let randomItem = Math.random();
    if (randomItem < 0.15) {
      this.fallingObjects.push(
        new Heart(this.context, x, -32, this.images.heart),
      );
    } else if (randomItem < 0.3) {
      this.fallingObjects.push(
        new Bomb(this.context, x, -32, this.images.bomb),
      );
    } else {
      this.fallingObjects.push(
        new FallingObject(this.context, x, -32, 32, FALL_SPEED + level * 30),
      );
    }
  }

  start() {
    this.run = true;
    this.gameOver = false;
    this.oldTimeStamp = performance.now();
    this.ui.hideMessage();
  }

  restart() {
    this.score = 0;
    this.lives = START_LIVES;
    this.run = true;
    this.gameOver = false;
    this.spawnTimer = 0;
    this.fallingObjects = [];
    this.obstacles = [];
    this.createActors();
    this.oldTimeStamp = performance.now();
    this.ui.hideMessage();
  }

  showStart() {
    this.ui.showMessage(
      "Catch Objects",
      "Start",
      () => this.start(),
      "bấm nút <> để di chuyển",
    );
  }

  showGameOver() {
    this.run = false;
    this.gameOver = true;
    this.ui.showMessage("Game Over", "Restart", () => this.restart(), "gà thí");
  }

  draw() {
    this.clear();
    this.drawBackground();
    this.fallingObjects.forEach((fallingObject) => fallingObject.draw());
    this.obstacles.forEach((obstacle) => obstacle.draw());
    this.catcher.draw();
    this.ui.updateGameInfo(this.score, this.lives);
  }

  drawBackground() {
    this.context.fillStyle = BACKGROUND_COLOR;
    this.context.fillRect(0, 0, this.width, this.height);

    this.context.fillStyle = "rgba(125, 211, 252, 0.08)";
    for (let x = 0; x < this.width; x += 42) {
      this.context.fillRect(x, 0, 1, this.height);
    }

    this.context.fillStyle = FLOOR_COLOR;
    this.context.fillRect(0, this.height - 36, this.width, 36);
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  canvasX(clientX) {
    let rect = this.canvas.getBoundingClientRect();
    let scaleX = this.canvas.width / rect.width;
    return (clientX - rect.left) * scaleX;
  }
}
