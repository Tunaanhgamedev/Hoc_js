import { Application, Sprite, Texture } from "pixi.js";

// TextureGCSystem: tự động quản lý bộ nhớ của các texture, khi texture không còn được sử dụng nữa thì sẽ tự động giải phóng tài nguyên liên quan đến texture, xóa ở phía texture lẫn trong gpu
const app = new Application();

// Thực ra bạn chả cần phải gọi những lệnh này vì pixi.js đã tự động quản lý bộ nhớ của các texture, nhưng nếu bạn muốn kiểm soát việc giải phóng tài nguyên liên quan đến texture thì có thể gọi những lệnh này
await app.init({
  textureGCActive: true, // Bật TextureGCSystem: tự động quản lý bộ nhớ của các texture
  textureGCMaxIdle: 7200, // Thời gian tối đa mà texture có thể không được sử dụng trước khi bị giải phóng (tính bằng mili giây)
  textureGCCheckCountMax: 1200, // Kiểm tra 20 giây một lần ở tốc độ 60 FPS
});

const texture = Texture.from("/assets/bunny.png");
const sprite = new Sprite(texture);

// Xóa hoàn toàn sprite khỏi bộ nhớ và giải phóng tài nguyên liên quan, xóa ở phía texture lẫn trong gpu
sprite.destroy();

// Giải phóng tài nguyên liên quan đến texture, xóa ở phía texture lẫn trong gpu
texture.unload();

// Sử dụng pool để quản lý bộ nhớ của các texture, khi texture không còn được sử dụng nữa thì sẽ tự động giải phóng tài nguyên liên quan đến texture, xóa ở phía texture lẫn trong gpu
const texturePool = new PIXI.utils.TexturePool();
const texture2 = texturePool.get("/assets/bunny.png"); // get hoặc acquire
const sprite2 = new Sprite(texture2);

// Xóa hoàn toàn sprite khỏi bộ nhớ và giải phóng tài nguyên liên quan, xóa ở phía texture lẫn trong gpu
sprite2.destroy();

// Trả object về pool
texturePool.release(texture2);