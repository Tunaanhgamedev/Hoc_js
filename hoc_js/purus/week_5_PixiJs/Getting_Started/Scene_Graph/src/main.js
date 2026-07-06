import {
  Application,
  Assets,
  Container,
  Sprite,
  Graphics,
  Text,
  Texture,
} from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ resizeTo: window });
  document.getElementById("pixi-container").appendChild(app.canvas);

  const label = new Text({
    text: "Scene Graph:\n\napp.stage\n  ┗ A\n     ┗ B\n     ┗ C\n  ┗ D",
    style: { fill: "#ffffff" },
    position: { x: 0, y: 0 },
  });

  app.stage.addChild(label);

  const letters = [];

  function addLetter(letter, parent, color, pos) {
    const bg = new Sprite(Texture.WHITE);

    bg.width = 100;
    bg.height = 100;
    bg.tint = color;

    const text = new Text({
      text: letter,
      style: { fill: "#ffffff" },
    });

    text.anchor.set(0.5);
    text.position = { x: 50, y: 50 };

    const container = new Container();

    container.position = pos;
    container.visible = false;
    container.addChild(bg, text);
    parent.addChild(container);

    letters.push(container);

    return container;
  }

  // Define 4 letters
  const a = addLetter("A", app.stage, 0xff0000, { x: 100, y: 100 });
  const b = addLetter("B", a, 0x00ff00, { x: 20, y: 20 });
  const c = addLetter("C", b, 0x0000ff, { x: 20, y: 40 });
  const d = addLetter("D", app.stage, 0xff8800, { x: 140, y: 100 });

  let elapsed = 0;

  app.ticker.add((ticker) => {
    elapsed += ticker.deltaTime / 60.0;
    if (elapsed >= letters.length) {
      elapsed = 0.0;
    }
    for (let i = 0; i < letters.length; i++) {
      letters[i].visible = elapsed >= i;
    }
  });

  const container = new Container({
    x: app.screen.width / 2,
    y: app.screen.height / 2,
  });
  app.stage.addChild(container);

  // Load the bunny texture
  const texture = await Assets.load("/assets/bunny.png");
  const rectangle = new Graphics();
  rectangle
    .beginFill("red", 0.25)
    .drawRect(-50, -50, 100, 100)
    .endFill()
    .stroke({ color: "blue", width: 4 });

  container.addChild(rectangle);

  const sprites = [];
  const rects = [];
  let parent = container;

  for (let i = 0; i < 4; i++) {
    const wrapper = new Container();
    const sprite = Sprite.from(texture);
    const rect = new Graphics(rectangle);

    sprite.anchor.set(0.5);
    wrapper.addChild(sprite);
    parent.addChild(wrapper);
    sprites.push(wrapper);

    rect.pivot.set(0, 0);
    wrapper.addChild(rect);
    parent.addChild(wrapper);
    rects.push(rect);

    parent = wrapper;
  }

  // Listen for animate update
  app.ticker.add((time) => {
    elapsed += time.deltaTime / 60;
    const amount = Math.sin(elapsed);
    const scale = 1.0 + 0.25 * amount;
    const alpha = 0.75 + 0.25 * amount;
    const angle = 40 * amount;
    const x = 75 * amount;

    for (let i = 0; i < sprites.length; i++) {
      const sprite = sprites[i];

      sprite.scale.set(scale);
      sprite.alpha = alpha;
      sprite.angle = angle;
      sprite.x = x;
    }

    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];

      rect.scale.set(scale);
      rect.alpha = alpha;
      rect.angle = angle;
      rect.x = x;
    }
  });
  // Get the global position of an object, relative to the top-left of the screen
  // let globalPos = obj.toGlobal(new Point(0, 0));

  // const myGameWorld = new Container({
  //   isRenderGroup: true,
  // });

  // const myHud = new Container({
  //   isRenderGroup: true,
  // });

  // scene.addChild(myGameWorld, myHud);
  // renderer.render(scene); // this action will actually convert the scene to a render group under the hood

  const redGuy = new PIXI.Sprite("red guy");
  redGuy.tint = 0xff0000;

  const blueGuy = new PIXI.Sprite("blue guy");
  blueGuy.tint = 0x0000ff;

  stage.addChild(redGuy, blueGuy);
})();
