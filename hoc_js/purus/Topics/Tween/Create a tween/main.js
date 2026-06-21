"use strict";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let oldTimeStamp = 0;

function gameLoop(timeStamp) {
  let dt = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

  update(dt);
  render(ctx);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// create the circle
const circle = new Circle();
circle.x = 100;
circle.y = 100;
circle.color = "#ff8080";

const tweenX = new Tween(circle.x, 500, 3); // move the circle to x = 500 in 3 seconds
const tweenY = new Tween(circle.y, 250, 3); // move the circle to y = 250 in 3 seconds

function update(dt) {
  circle.x = tweenX.update(dt);
  circle.y = tweenY.update(dt);
}

function render(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circle.render(ctx);
}
