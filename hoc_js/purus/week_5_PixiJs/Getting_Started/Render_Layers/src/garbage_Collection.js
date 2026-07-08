import { Sprite, Texture } from "pixi.js";

const texture = Texture.from("/assets/bunny.png");
const sprite = new Sprite(texture);

// Xóa hoàn toàn sprite khỏi bộ nhớ và giải phóng tài nguyên liên quan, xóa ở phía texture lẫn trong gpu
sprite.destroy();

// Giải phóng tài nguyên liên quan đến texture, xóa ở phía texture lẫn trong gpu
texture.unload();
