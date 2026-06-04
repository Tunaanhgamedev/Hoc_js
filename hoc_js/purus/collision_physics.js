"use strict";
let canvas;
let context;

window.onload = init;

function init() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  // gọi lần đầu
  window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
  update();
  draw();
  // tiệp tục yêu cầu trình duyệt gọi lại gameLoop trước khi vẽ khung hình tiếp theo
  window.requestAnimationFrame(gameLoop);
}

function update() {
  // cập nhật logic trò chơi, xử lý va chạm, v.v.
}

function draw() {}

