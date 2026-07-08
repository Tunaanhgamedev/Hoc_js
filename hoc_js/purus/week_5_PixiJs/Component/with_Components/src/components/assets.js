import { Application, Assets, Texture } from "pixi.js";

(async () => {
  const app = new Application();
  await app.init({ backgroundColor: 0x1099bb });

  // Tải 1 ảnh duy nhất
  const bunnyTexture =
    (await Assets.load) < Texture > "../../public/assets/bunny.png";
  const sprite = new Sprite(bunnyTexture);

  // Tải nhiều nội dung cùng một lúc
  const textures =
    (await Assets.load) <
    Texture >
    ["../../public/assets/bunny.png", "../../public/assets/cat.png"];
  const bunnySprite = new Sprite(textures["../../public/assets/bunny.png"]);
  const catSprite = new Sprite(textures["../../public/assets/cat.png"]);

  // Truy xuất hình ảnh
  (await Assets.load) < Texture > "../../public/assets/bunny.png";
  const bunnyTexture = Assets.get("../../public/assets/bunny.png");
  const sprite = new Sprite(bunnyTexture);

  await Assets.unload("../../public/assets/bunny.png");

  // Nên sử dụng cách truy xuất ảnh này
  Assets.addBundle("fruits", {
    apple: "assets/apple.png",
    banana: "assets/banana.png",
    orange: "assets/orange.png",
  });

  // load
  const textures = await Assets.loadBundle("fruits");
  // Lấy
  textures.apple; // trả về texture của apple
  textures.banana; // trả về texture của banana
})();
