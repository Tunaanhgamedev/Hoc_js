"use strict";
let canvas;
let context;

window.onload = init;
function init() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  window.requestAnimationFrame(gameLoop);
}

function draw() {
  // xóa khung hình trước khi vẽ khung hình mới
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#ff8080";
  context.fillRect(rectX, rectY, 150, 100);
}

let rectX = 0;
let rectY = 0;
let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 50;

// Xử lý tốc độ di chuyển của hình chữ nhật dựa trên thời gian đã trôi qua để đảm bảo chuyển động mượt mà trên các thiết bị khác nhau
function gameLoop(timeStamp) {
  // Tính toán bao nhiêu thời gian đã trôi qua
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

  // cập nhật vị trí của hình chữ nhật
  update(secondsPassed);
  draw();

  window.requestAnimationFrame(gameLoop);
}

function update(secondsPassed) {
  // Sử dụng thời gian đã trôi qua để tính toán vị trí mới của hình chữ nhật
  rectX += movingSpeed * secondsPassed;
  rectY += movingSpeed * secondsPassed;
}
