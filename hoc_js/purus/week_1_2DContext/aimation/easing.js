// Kiểu cũ
// function easeInOutQuint(t, b, c, d) {
//   t /= d / 2;
//   if (t < 1) return c / 2 * t * t * t * t * t + b;
//   t -= 2;
//   return c / 2 * (t * t * t * t * t + 2) + b;
// }

// Kiểu mới
function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

// 1. Linear y = x, thanh loading, đồng hồ đếm, UI đơn giản
function linear(t) {
  return t;
}

// 2. Ease In Quad y = x^2, nhân vật bắt đầu chạy, tên lửa bắn ra, hiệu ứng tăng tốc
function easeInQuad(t) {
  return t * t;
}

// 3. Ease Out Quad y = 1 - (1 - x)^2, cửa mở, Camera dừng lại, popup UI
function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

// 4. Ease In Out Quad y = x < 0.5 ? 2x^2 : 1 - (-2x + 2)^2 / 2, nhân vật chạy rồi dừng, hiệu ứng tăng tốc rồi giảm tốc, Camera di chuyển, UI xuất hiện rồi biến mất
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// 5. Ease In Cubic y = x^3, gia tốc chậm rồi nhanh, hiệu ứng tăng tốc mạnh, nhân vật bắt đầu chạy rất chậm rồi tăng tốc nhanh
function easeInCubic(t) {
  return t * t * t;
}

// 6. Quart y = x^4, bắt đầu cực kì chậm
function easeInQuart(t) {
  return t * t * t * t;
}

// 7. Quint y = x^5, Dash, hiệu ứng siêu tốc
function easeInQuint(t) {
  return t * t * t * t * t;
}

// 8. Sine y = 1 - cos(x * PI / 2), hiệu ứng mượt mà, Camera di chuyển, UI xuất hiện dần dần
function easeInSine(t) {
  return 1 - Math.cos((t * Math.PI) / 2);
}

// 9. Expo y = 2^(10 * (x - 1)), warp, teleport, sci-fi effect
function easeInExpo(t) {
  return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
}

// 10. Back, Menu
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// 11. Elastic, hiệu ứng đàn hồi, vật thể rơi xuống rồi bật lên, Coin, Chest
function easeOutElastic(t) {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

// 12. Bounce, hiệu ứng nảy, vật thể rơi xuống rồi nảy lên, Coin, Chest
function easeOutBounce(t) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
}
