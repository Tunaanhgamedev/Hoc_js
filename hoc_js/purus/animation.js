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
let secondsPassed = 0; // thời gian đã trôi qua kể từ lần cập nhật cuối cùng
let oldTimeStamp = 0; // thời điểm của lần cập nhật cuối cùng
let movingSpeed = 50; // tốc độ di chuyển của hình chữ nhật (pixels per second)

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

// function update(secondsPassed) {
//   // Sử dụng thời gian đã trôi qua để tính toán vị trí mới của hình chữ nhật
//   rectX += movingSpeed * secondsPassed;
//   rectY += movingSpeed * secondsPassed;
// }

// giới hạn thời gian đã trôi qua để tránh việc hình chữ nhật di chuyển quá nhanh nếu có sự cố về hiệu suất hoặc khi tab trình duyệt bị ẩn
secondsPassed = Math.min(secondsPassed, 0.1);
let timePassed = 0; // tổng thời gian đã trôi qua kể từ khi bắt đầu hoạt ảnh, được sử dụng để tính toán vị trí của hình chữ nhật dựa trên hàm easing

function update(secondsPassed) {

    timePassed += secondsPassed

    // Sử dụng hàm easing để tính toán vị trí mới của hình chữ nhật
    rectX = easeInOutQuint(timePassed, 50, 500, 1.5);
    rectY = easeLinear(timePassed, 50, 250, 1.5);
}

// hàm easing để tạo hiệu ứng chuyển động mượt mà hơn
function easeInOutQuint (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
}

function easeLinear (t, b, c, d) {
    return c * t / d + b; // vị trí = quãng đường * % hoàn thành(thời gian/tổng thời gian) + điểm bắt đầu
}


// t = Thời gian - Khoảng thời gian đã trôi qua kể từ khi bắt đầu hoạt ảnh. Thường bắt đầu từ 0 và được tăng từ từ bằng cách sử dụng vòng lặp trò chơi hoặc chức năng cập nhật khác.
// b = Giá trị bắt đầu - Điểm bắt đầu của hoạt ảnh. Thông thường đó là một giá trị tĩnh, bạn có thể bắt đầu từ 0 chẳng hạn.
// c = Thay đổi giá trị - Lượng thay đổi cần thiết để đi từ điểm bắt đầu đến điểm kết thúc. Nó cũng thường là một giá trị tĩnh.
// d = Thời lượng - Khoảng thời gian hoạt ảnh sẽ diễn ra. Thường là một giá trị tĩnh.