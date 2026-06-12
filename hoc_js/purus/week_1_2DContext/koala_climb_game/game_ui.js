class GameUI {
  constructor(canvas) {
    this.stage = canvas.parentElement;

    this.hud = document.createElement("div");
    this.hud.className = "game-hud";

    this.livesText = document.createElement("div");
    this.livesText.className = "game-stat";

    this.scoreText = document.createElement("div");
    this.scoreText.className = "game-stat";

    this.hud.appendChild(this.livesText);
    this.hud.appendChild(this.scoreText);

    this.panel = document.createElement("div");
    this.panel.className = "game-panel hidden";

    this.title = document.createElement("h1");
    this.title.className = "game-title";

    this.button = document.createElement("button");
    this.button.className = "game-button";
    this.button.type = "button";

    this.des = document.createElement("h4");
    this.des.className = "game-des";

    this.panel.appendChild(this.title);
    this.panel.appendChild(this.button);

    this.stage.appendChild(this.hud);
    this.stage.appendChild(this.panel);
    this.panel.appendChild(this.des);
  }

  updateGameInfo(score, lives) {
    this.livesText.textContent = `Lives ${lives}`;
    this.scoreText.textContent = `Score ${score}`;
  }

  showMessage(text, buttonText, onClick, des) {
    this.title.textContent = text;
    this.button.textContent = buttonText;
    this.button.onclick = onClick;
    this.des.textContent = des;
    this.panel.classList.remove("hidden");
  }

  hideMessage() {
    this.panel.classList.add("hidden");
    this.button.onclick = null;
  }
}
