let canvas;
let context;

const g = 9.81;

window.onload = init;

function init() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  createWorld();
  createCircles();
  createPoints();
  createTriangles();
  // gọi lần đầu
  window.requestAnimationFrame(gameLoop);
}

let timePassed = 0;
let secondsPassed = 0;
let oldTimeStamp = 0;

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(timeStamp) {
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

  // Lặp lại tất cả các đối tượng trò chơi
  for (let i = 0; i < gameObjects.length; i++) {
    gameObjects[i].update(secondsPassed);
  }

  clearCanvas();
  detectCollisions();
  detectEdgeCollisions();

  // Làm tương tự để vẽ
  for (let i = 0; i < gameObjects.length; i++) {
    gameObjects[i].draw();
  }

  window.requestAnimationFrame(gameLoop);
}

class GameObject {
  constructor(context, x, y, vx, vy) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;

    this.mass = 1;
    this.isColliding = false;
  }
}

class Square extends GameObject {
  constructor(context, x, y, vx, vy) {
    super(context, x, y, vx, vy);

    // Đặt chiều rộng và chiều cao mặc định
    this.width = 50;
    this.height = 50;

    this.mass = 1;
  }

  draw() {
    // vẽ hình vuông
    this.context.fillStyle = this.isColliding ? "#ff8080" : "#0099b0";
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }

  update(secondsPassed) {
    // Di chuyển với vận tốc đã đặt
    this.x += this.vx * secondsPassed;
    this.y += this.vy * secondsPassed;
  }
}

class Circle extends GameObject {
  constructor(context, x, y, vx, vy) {
    super(context, x, y, vx, vy);

    // Đặt bán kính mặc định
    this.radius = 25;

    this.mass = 1;
  }

  draw() {
    // vẽ hình tròn
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.fillStyle = this.isColliding ? "#ff8080" : "#0099b0";
    this.context.fill();
  }

  update(secondsPassed) {
    // Di chuyển với vận tốc đã đặt
    this.x += this.vx * secondsPassed;
    this.y += this.vy * secondsPassed;
  }
}

class Point extends Circle {
  constructor(context, x, y, vx, vy) {
    super(context, x, y, vx, vy);

    this.radius = 5;
    this.mass = 0.1;
  }
}

class Triangle extends GameObject {
  constructor(context, x, y, vx, vy) {
    super(context, x, y, vx, vy);

    this.size = 50;
  }

  draw() {
    this.context.beginPath();

    this.context.moveTo(this.x, this.y);
    this.context.lineTo(this.x - this.size / 2, this.y + this.size);
    this.context.lineTo(this.x + this.size / 2, this.y + this.size);
    this.context.closePath();
    this.context.fillStyle = this.isColliding ? "red" : "green";
    this.context.fill();

    // Vẽ vectơ tiêu đề
    this.context.beginPath();
    this.context.moveTo(this.x, this.y);
    this.context.lineTo(this.x + this.vx, this.y + this.vy);
    this.context.stroke();
  }

  update(secondsPassed) {
    // Áp dụng tăng tốc
    this.vy += g * secondsPassed;

    this.x += this.vx * secondsPassed;
    this.y += this.vy * secondsPassed;

    //Tính góc (vy trước vx)
    let radians = Math.atan2(this.vy, this.vx);

    // Chuyển đổi sang độ
    let degrees = (180 * radians) / Math.PI;
  }
}

let gameObjects;

function createWorld() {
  gameObjects = [
    new Square(context, 250, 50, 0, 50),
    new Square(context, 250, 300, 0, -50),
    new Square(context, 150, 0, 50, 50),
    new Square(context, 250, 150, 50, 50),
    new Square(context, 350, 75, -50, 50),
    new Square(context, 300, 300, 50, -50),
  ];
}

function createCircles() {
  gameObjects.push(
    new Circle(context, 650, 50, 0, 50),
    new Circle(context, 750, 300, 0, -50),
    new Circle(context, 550, 0, 50, 50),
    new Circle(context, 650, 150, 50, 50),
    new Circle(context, 750, 100, -50, 50),
    new Circle(context, 700, 300, 50, -50),
  );
}

function createPoints() {
  gameObjects.push(
    new Point(context, 200, 200, 20, 50),
    new Point(context, 700, 300, 20, -50),
    new Point(context, 500, 100, 50, 50),
    new Point(context, 600, 150, 50, 50),
    new Point(context, 800, 100, -50, 50),
    new Point(context, 750, 300, 50, -50),
    new Point(context, 750, 200, 50, -50),
    new Point(context, 700, 200, 50, -50),
    new Point(context, 750, 120, 50, -50),
    new Point(context, 600, 300, 50, -50),
    new Point(context, 700, 100, 50, -50),
    new Point(context, 750, 30, 50, -50),
    new Point(context, 750, 300, 50, -50),
    new Point(context, 550, 400, 50, -50),
    new Point(context, 500, 100, 50, -50),
    new Point(context, 601, 60, 50, -50),
    new Point(context, 620, 500, 50, -50),
    new Point(context, 500, 50, 50, -50),
    new Point(context, 250, 100, 50, -50),
    new Point(context, 50, 90, 50, -50),
    new Point(context, 570, 70, 50, -50),
    new Point(context, 650, 100, 50, -50),
    new Point(context, 675, 125, 50, -50),
    new Point(context, 750, 125, 50, -50),
    new Point(context, 775, 50, 50, -50),
    new Point(context, 750, 50, 50, -50),
  );
}

function createTriangles() {
  gameObjects.push(
    new Triangle(context, 50, 500, 0, 50),
    new Triangle(context, 200, 500, 0, -50),
    new Triangle(context, 150, 400, 50, 50),
    new Triangle(context, 350, 200, 50, 50),
    new Triangle(context, 300, 250, -50, 50),
    new Triangle(context, 400, 100, 50, -50),
  );
}

function detectCollisions() {
  let obj1;
  let obj2;

  // dat lai trang thai ban dau cho tat ca cac doi tuong
  for (let i = 0; i < gameObjects.length; i++) {
    gameObjects[i].isColliding = false;
  }

  // bat dau so sanh tung doi tuong voi nhau
  for (let i = 0; i < gameObjects.length; i++) {
    obj1 = gameObjects[i];
    for (let j = i + 1; j < gameObjects.length; j++) {
      obj2 = gameObjects[j];

      // vector va cham
      let vCollision = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };
      // khoang cach cua vecto va cham
      let distance = Math.sqrt(
        (obj2.x - obj1.x) * (obj2.x - obj1.x) +
          (obj2.y - obj1.y) * (obj2.y - obj1.y),
      );
      // don vi vector va cham
      let vCollisionNorm = {
        x: vCollision.x / distance,
        y: vCollision.y / distance,
      };
      // toc do tuong doi sau va cham
      let vRelativeVelocity = { x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy };
      // toc do tuong doi sau va cham tren phuong vector va cham
      let speed =
        vRelativeVelocity.x * vCollisionNorm.x +
        vRelativeVelocity.y * vCollisionNorm.y;
      // Tính toán tốc độ va chạm được phát hiện
      // let speed =
      //   vRelativeVelocity.x * vecCollisionNorm.x +
      //   vRelativeVelocity.y * vecCollisionNorm.y;

      // // Áp dụng bồi thường cho tốc độ
      // speed *= Math.min(obj1.restitution, obj2.restitution);
      // xung luc
      let impulse = (2 * speed) / (obj1.mass + obj2.mass);

      // so sanh 2 doi tuong co giao nhau hay khong
      if (obj1 instanceof Square && obj2 instanceof Square) {
        // rectIntersect
        if (
          rectIntersect(
            obj1.x,
            obj1.y,
            obj1.width,
            obj1.height,
            obj2.x,
            obj2.y,
            obj2.width,
            obj2.height,
          )
        ) {
          obj1.isColliding = true;
          obj2.isColliding = true;
        }
      }

      if (obj1 instanceof Circle && obj2 instanceof Circle) {
        if (
          circleIntersect(
            obj1.x,
            obj1.y,
            obj1.radius,
            obj2.x,
            obj2.y,
            obj2.radius,
          )
        ) {
          if (speed < 0) {
            break;
          }
          obj1.isColliding = true;
          obj2.isColliding = true;

          // khoi luong cua doi tuong
          obj1.vx -= impulse * obj2.mass * vCollisionNorm.x;
          obj1.vy -= impulse * obj2.mass * vCollisionNorm.y;
          obj2.vx += impulse * obj1.mass * vCollisionNorm.x;
          obj2.vy += impulse * obj1.mass * vCollisionNorm.y;
          // obj1.vx -= speed * vCollisionNorm.x;
          // obj1.vy -= speed * vCollisionNorm.y;
          // obj2.vx += speed * vCollisionNorm.x;
          // obj2.vy += speed * vCollisionNorm.y;
        }
      }
    }
  }
}

// Phat hiện va chạm giữa hai hình chữ nhật
function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
  // kiem tra x va y cua hai hinh chu nhat co giao nhau hay khong
  if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
    return false;
  }
  return true;
}


// va cham hinh tron
function circleIntersect(x1, y1, r1, x2, y2, r2) {
  // khoang cach giua 2 duong tron
  let squareDistance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);

  // Khi khoang cach nho hon hoac bang tong ban kinh cua 2 duong tron thi chung se giao nhau
  return squareDistance <= (r1 + r2) * (r1 + r2);
}

// Đặt một khoản bồi thường, giá trị thấp hơn sẽ mất nhiều năng lượng hơn khi va chạm
const restitution = 0.9;

function detectEdgeCollisions() {
  let obj;
  for (let i = 0; i < gameObjects.length; i++) {
    obj = gameObjects[i];
    if (obj instanceof Circle) {
      // Kiểm tra trái và phải
      if (obj.x < obj.radius) {
        obj.vx = Math.abs(obj.vx) * restitution;
        obj.x = obj.radius;
      } else if (obj.x > canvas.width - obj.radius) {
        obj.vx = -Math.abs(obj.vx) * restitution;
        obj.x = canvas.width - obj.radius;
      }

      // tren va duoi
      if (obj.y < obj.radius) {
        obj.vy = Math.abs(obj.vy) * restitution;
        obj.y = obj.radius;
      } else if (obj.y > canvas.height - obj.radius) {
        obj.vy = -Math.abs(obj.vy) * restitution;
        obj.y = canvas.height - obj.radius;
      }
    }

    if (obj instanceof Square) {
      // Kiểm tra trái và phải
      if (obj.x < 0) {
        obj.vx = Math.abs(obj.vx) * restitution;
        obj.x = 0;
      } else if (obj.x > canvas.width - obj.width) {
        obj.vx = -Math.abs(obj.vx) * restitution;
        obj.x = canvas.width - obj.width;
      }

      // tren va duoi
      if (obj.y < 0) {
        obj.vy = Math.abs(obj.vy) * restitution;
        obj.y = 0;
      } else if (obj.y > canvas.height - obj.height) {
        obj.vy = -Math.abs(obj.vy) * restitution;
        obj.y = canvas.height - obj.height;
      }
    }
  }
}

// He so phuc hoi
// Các vật thể có COR bằng 0 sẽ hấp thụ tất cả năng lượng khi va chạm, giống như một túi cát đập xuống sàn.
// Các vật thể có COR là 1 sẽ có độ đàn hồi hoàn hảo, giống như một quả bóng nảy siêu nảy.
// Các vật thể có COR > 1 hoàn toàn hư cấu và sẽ bổ sung thêm năng lượng sau mỗi lần va chạm.
