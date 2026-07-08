import { Application, Assets, Texture, Sprite } from "pixi.js";

(async () => {
  const app = new Application();
  await app.init({ backgroundColor: 0x1099bb });

  document.getElementById("pixi-container").appendChild(app.canvas);

  // Tải 1 ảnh duy nhất
  const bunnyTexture = await Assets.load("/assets/bunny.png");

  const sprite = new Sprite(bunnyTexture);

  app.stage.addChild(sprite);

  sprite.anchor.set(0.5);

  sprite.x = app.screen.width / 2;
  sprite.y = app.screen.height / 2;

  // Tải nhiều nội dung cùng một lúc
  const textures =
    await Assets.load(["/assets/bunny.png", "/assets/cat.png"]);
  const bunnySprite = new Sprite(textures["/assets/bunny.png"]);
  const catSprite = new Sprite(textures["/assets/cat.png"]);

  app.stage.addChild(bunnySprite);
  app.stage.addChild(catSprite);

  bunnySprite.anchor.set(0.5);
  catSprite.anchor.set(0.5);

  bunnySprite.x = app.screen.width / 2 - 100;
  catSprite.x = app.screen.width / 2 + 100;
  bunnySprite.y = app.screen.height / 2;
  catSprite.y = app.screen.height / 2;

  catSprite.scale.set(0.05);

  // Truy xuất hình ảnh
  //   (await Assets.load) < Texture > ("/assets/bunny.png");
  //   const bunnyTexture = Assets.get("/assets/bunny.png");
  //   const sprite = new Sprite(bunnyTexture);

  //   await Assets.unload("/assets/bunny.png");

  // Nên sử dụng cách truy xuất ảnh này
  //   Assets.addBundle("fruits", {
  //     apple: "assets/apple.png",
  //     banana: "assets/banana.png",
  //     orange: "assets/orange.png",
  //   });

  //   // load
  //   const textures = await Assets.loadBundle("fruits");
  //   // Lấy
  //   textures.apple; // trả về texture của apple
  //   textures.banana; // trả về texture của banana
})();
