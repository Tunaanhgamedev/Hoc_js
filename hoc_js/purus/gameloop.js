// vòng lặp xấu
// while (running) {
//     draw();
// }

// vòng lặp xấu
// setInterval() để lặp lại với một khoảng thời gian đã đặt cho mỗi khung hình
// setInterval(gameLoop, 16);

// function gameLoop() {
//   draw();
// }

// dùng
// window.requestAnimationFrame(gameLoop); // để lặp lại với tốc độ khung hình tối ưu cho trình duyệt, thường là 60 khung hình mỗi giây

// function gameLoop() {
//     draw();
//     window.requestAnimationFrame(gameLoop);
// }

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
  draw();
  // tiệp tục yêu cầu trình duyệt gọi lại gameLoop trước khi vẽ khung hình tiếp theo
  window.requestAnimationFrame(gameLoop);
}

function draw() {
  let randomColor = Math.random() > 0.5 ? "#ff8080" : "#0099b0";

  context.fillStyle = randomColor;
  context.fillRect(100, 50, 200, 175);
}
