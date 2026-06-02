/*
Bài toán 1: Di chuyển và Chạm ranh giới (Movement & Boundaries)
Tình huống: Bạn có một màn hình game kích thước 800x600. Nhân vật của bạn đang ở tọa độ (x, y). Bạn muốn nhấn mũi tên sang phải thì nhân vật đi sang phải, nhưng không được đi lọt ra ngoài màn hình.
Tư duy Logic:
1. Trục tọa độ trong game: Gốc tọa độ (0, 0) nằm ở Góc trên cùng bên trái màn hình. Trục X hướng sang phải, trục Y hướng xuống dưới.
2. Di chuyển sang phải nghĩa là cộng thêm vào x một lượng speed.
3. Ranh giới phải màn hình là điểm 800. Tuy nhiên, tọa độ x của nhân vật thường tính từ mép trái của hình ảnh nhân vật. Vậy giới hạn tối đa mà x có thể đạt tới là 800 - chiều_rộng_nhân_vật.
*/

const screenWidth = 800;
const player = {
  x: 100, // Tọa độ ban đầu của nhân vật
  y: 100,
  with: 50, // Chiều rộng của nhân vật
  speed: 5, // Tốc độ di chuyển
};

function moveRight() {
  // 1. Tính toán vị trí mới nếu di chuyển sang phải
  let newX = player.x + player.speed;

  // 2. Kiểm tra ranh giới phải của màn hình
  if (newX > screenWidth - player.with) {
    newX = screenWidth - player.with; // bị chặn lại ở ranh giới
  } else {
    // Nếu chưa vượt ranh giới, cập nhật vị trí mới
    player.x = newX;
  }
}
