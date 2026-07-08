import { Sprite } from 'pixi.js';

const sprite = new Sprite(texture);

// Xóa hoàn toàn sprite khỏi bộ nhớ và giải phóng tài nguyên liên quan, xóa ở phía texture lẫn trong gpu
sprite.destroy();