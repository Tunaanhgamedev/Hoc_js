"use strict";

let canvas;
let context;
let img = document.getElementById("myImage");
let sprite = document.getElementById("mySprite");
let frameWidth;
let frameHeight;
let column;
let row;
let numColumns = 5;
let numRows = 2;

window.onload = init;

function init() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  frameWidth = sprite.width / numColumns;
  frameHeight = sprite.height / numRows;

  //   img = new Image();
  //   img.onload = function () {
  //     context.drawImage(img, 10, 10);
  //   };
  //   img.src =
  //     "https://file.hstatic.net/200000945871/file/hinh-anh-con-meo-ngau-bua_90df6a22049a4c54a27b7b3fe3dfcf51.jpg";

  window.requestAnimationFrame(gameLoop);
}

let secondsPassed = 0;
let oldTimeStamp = 0;

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}
function gameLoop(timeStamp) {
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

  clearCanvas();
  context.drawImage(img, 10, 30);
  context.drawImage(img, 500, 30, 100, 200);
  context.drawImage(img, 250, 300, img.width / 2, img.height / 2);

  // làm mịn hình ảnh khi phóng to
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(img, 700, 300, img.width * 3, img.height * 3);

  // cắt hình
  context.drawImage(img, 100, 0, 200, 50, 50, 400, 200, 50);
  context.drawImage(img, 100, 0, 200, 50, 800, 30, 400, 100);
  // cắt hình từ sprite
  //   // xác định kích thước khung hình
  //   let frameWidth = 50;
  //   let frameHeight = 61;

  //   // hàng và cột của khung hình cần vẽ
  //   let row = 1;
  //   let column = 3;

  //   context.drawImage(
  //     sprite,
  //     column * frameWidth,
  //     row * frameHeight,
  //     frameWidth,
  //     frameHeight,
  //     1200,
  //     30,
  //     frameWidth,
  //     frameHeight,
  //   );

  context.drawImage(
    sprite,
    column * frameWidth,
    row * frameHeight,
    frameWidth,
    frameHeight,
    400,
    500,
    frameWidth,
    frameHeight,
  );

  window.requestAnimationFrame(gameLoop);
}

let currentFrame = 0; // khung hình ảnh sprite bắt đầu từ 0

setInterval(function () {
  currentFrame++; // khung mới

  let maxFrame = numColumns * numRows - 1;

  if (currentFrame > maxFrame) {
    currentFrame = 0;
  }

  column = currentFrame % numColumns;
  row = Math.floor(currentFrame / numColumns);
}, 100);
