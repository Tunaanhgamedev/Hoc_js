// ========== Koala Climb Game ==========
// Inspired by "Panda & Bugs" — koala clings to 3 electricity poles,
// jumps left/right between them to dodge obstacles (bugs/electric hazards)
// and collect leaves/stars.

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 520;

// ---- Image loading & background removal ----
const bgImg = new Image();
bgImg.src = "img/background.jpg";

const poleImg = new Image();
poleImg.src = "img/electricity_pole.png";

const koalaImgRaw = new Image();
koalaImgRaw.src = "img/koala.png"; // Using the user's provided koala.jpg

let koalaImg; // processed transparent version
let imagesLoaded = 0;
const totalImages = 3;

// Remove fake checkerboard background using a boundary flood fill (BFS).
// This only targets checkerboard pixels connected to the borders of the image,
// leaving the bright colors inside the koala's body (like the belly/ears) untouched!
function removeFakeTransparentBg(img) {
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const cctx = c.getContext("2d");
  cctx.drawImage(img, 0, 0);
  
  const width = c.width;
  const height = c.height;
  const imgData = cctx.getImageData(0, 0, width, height);
  const px = imgData.data;
  
  const getIdx = (x, y) => (y * width + x) * 4;
  const visited = new Uint8Array(width * height);
  const queue = [];
  
  // Add all boundary pixels to the queue to start flood fill from the edges
  for (let x = 0; x < width; x++) {
    queue.push({ x, y: 0 }); visited[0 * width + x] = 1;
    queue.push({ x, y: height - 1 }); visited[(height - 1) * width + x] = 1;
  }
  for (let y = 1; y < height - 1; y++) {
    queue.push({ x: 0, y }); visited[y * width + 0] = 1;
    queue.push({ x: width - 1, y }); visited[y * width + (width - 1)] = 1;
  }
  
  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const idx = getIdx(curr.x, curr.y);
    const r = px[idx];
    const g = px[idx + 1];
    const b = px[idx + 2];
    
    // Check if the current pixel matches the white/grey checkerboard pattern
    const isNeutral = Math.abs(r - g) < 22 && Math.abs(g - b) < 22;
    const isBright = r > 212; 
    
    if (isNeutral && isBright) {
      px[idx + 3] = 0; // Make background pixel transparent
      
      // Traverse 4-way neighbors
      const neighbors = [
        { x: curr.x + 1, y: curr.y },
        { x: curr.x - 1, y: curr.y },
        { x: curr.x, y: curr.y + 1 },
        { x: curr.x, y: curr.y - 1 }
      ];
      
      for (const n of neighbors) {
        if (n.x >= 0 && n.x < width && n.y >= 0 && n.y < height) {
          const vIdx = n.y * width + n.x;
          if (!visited[vIdx]) {
            visited[vIdx] = 1;
            queue.push(n);
          }
        }
      }
    }
  }
  
  cctx.putImageData(imgData, 0, 0);
  return c;
}

function onImageLoad() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    // Temp log corner pixels of koalaImgRaw
    const c = document.createElement("canvas");
    c.width = koalaImgRaw.width;
    c.height = koalaImgRaw.height;
    const cctx = c.getContext("2d");
    cctx.drawImage(koalaImgRaw, 0, 0);
    const d = cctx.getImageData(0, 0, 30, 30).data;
    console.log("PIXEL 0,0:", d[0], d[1], d[2]);
    console.log("PIXEL 15,15:", d[(15*30+15)*4], d[(15*30+15)*4+1], d[(15*30+15)*4+2]);

    koalaImg = removeFakeTransparentBg(koalaImgRaw);
    initGame();
  }
}
bgImg.onload = onImageLoad;
poleImg.onload = onImageLoad;
koalaImgRaw.onload = onImageLoad;

// ---- Game state ----
let ui;
let koala;
let gameState = "START"; // START, PLAYING, GAMEOVER

let score = 0;
let lives = 3;
let climbSpeed = 150;
const maxClimbSpeed = 420;
let distanceClimbed = 0;

let poleScrollY = 0;
let bgScrollY = 0;

let obstacles = [];
let collectibles = [];
let particles = [];
let floatingTexts = [];

let lastTime = 0;
let nextObstacleAt = 300;
let nextCollectibleAt = 150;

// Pole layout — 3 poles
const POLE_X = [200, 400, 600];
const POLE_DRAW_W = 850; // Scaled up width to make trunk/crossbar proportional
const POLE_DRAW_H = 850; // Keep 1:1 aspect ratio to avoid distortion

// ---- Audio ----
let audioCtx = null;
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}
function playTone(freqs, dur, type = "sine", vol = 0.15) {
  if (!audioCtx) return;
  try {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freqs[0], audioCtx.currentTime);
    if (freqs[1]) o.frequency.exponentialRampToValueAtTime(freqs[1], audioCtx.currentTime + dur);
    g.gain.setValueAtTime(vol, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur);
  } catch (e) {}
}
const sfx = {
  jump:    () => playTone([200, 520], 0.1, "triangle", 0.18),
  collect: () => playTone([523, 1047], 0.15, "sine", 0.13),
  shield:  () => playTone([300, 600], 0.25, "sine", 0.16),
  boost:   () => playTone([200, 1400], 0.5, "sawtooth", 0.08),
  shock:   () => playTone([120, 70], 0.4, "sawtooth", 0.22),
  over:    () => playTone([330, 80], 0.7, "sawtooth", 0.18),
};

// ---- Helpers ----
function spawnParticles(x, y, color, count = 8, speed = 100) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = 30 + Math.random() * speed;
    particles.push({ x, y, vx: Math.cos(a)*v, vy: Math.sin(a)*v, color, size: 2+Math.random()*3, life: 0.35+Math.random()*0.35 });
  }
}
function spawnText(x, y, text, color = "#fff") {
  floatingTexts.push({ x, y, text, color, life: 1 });
}
function getHigh() { return parseInt(localStorage.getItem("koala_hs") || "0", 10); }
function setHigh(s) { const h = getHigh(); if (s > h) { localStorage.setItem("koala_hs", s); return s; } return h; }

// ---- Init ----
function initGame() {
  ui = new GameUI(canvas);
  ui.showMessage(
    "Koala Cột Điện",
    "Chơi Ngay",
    startGame,
    "Nhấn ← → hoặc A/D hoặc CLICK cột điện để nhảy qua lại tránh chướng ngại vật!"
  );
  drawStartScreen();

  window.addEventListener("keydown", (e) => {
    initAudio();
    if (gameState === "PLAYING") {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        if (koala.jumpLeft()) { sfx.jump(); spawnParticles(koala.x+koala.width/2, koala.y+koala.height, '#e2e8f0', 5, 50); }
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        if (koala.jumpRight()) { sfx.jump(); spawnParticles(koala.x+koala.width/2, koala.y+koala.height, '#e2e8f0', 5, 50); }
      }
    }
  });

  canvas.addEventListener("mousedown", (e) => handleClick(e.clientX));
  canvas.addEventListener("touchstart", (e) => { e.preventDefault(); if (e.touches[0]) handleClick(e.touches[0].clientX); });

  requestAnimationFrame(gameLoop);
}

function handleClick(clientX) {
  initAudio();
  if (gameState !== "PLAYING") return;
  const rect = canvas.getBoundingClientRect();
  const cx = (clientX - rect.left) * (canvas.width / rect.width);
  let target = cx < 266 ? 0 : cx < 533 ? 1 : 2;
  let jumped = false;
  if (target < koala.lane) jumped = koala.jumpLeft();
  else if (target > koala.lane) jumped = koala.jumpRight();
  if (jumped) { sfx.jump(); spawnParticles(koala.x+koala.width/2, koala.y+koala.height, "#e2e8f0", 5, 50); }
}

function drawStartScreen() {
  ctx.save();
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  // Draw 3 poles fully using the original pole image
  ctx.drawImage(poleImg, 200 - POLE_DRAW_W / 2, 0, POLE_DRAW_W, canvas.height);
  ctx.drawImage(poleImg, 400 - POLE_DRAW_W / 2, 0, POLE_DRAW_W, canvas.height);
  ctx.drawImage(poleImg, 600 - POLE_DRAW_W / 2, 0, POLE_DRAW_W, canvas.height);
  // Draw koala on middle pole
  ctx.drawImage(koalaImg, 400 - 35, 330, 70, 70);
  ctx.restore();
}

function startGame() {
  initAudio();
  gameState = "PLAYING";
  score = 0; lives = 3; climbSpeed = 150;
  distanceClimbed = 0; poleScrollY = 0; bgScrollY = 0;
  obstacles = []; collectibles = []; particles = []; floatingTexts = [];
  nextObstacleAt = 300; nextCollectibleAt = 150;
  koala = new Koala(ctx, koalaImg, 0, 340, 70, 70);
  ui.hideMessage();
  ui.updateGameInfo(score, lives);
  lastTime = performance.now();
}

// ---- Game loop ----
function gameLoop(ts) {
  if (lastTime === 0) lastTime = ts;
  let dt = (ts - lastTime) / 1000;
  if (dt > 0.1) dt = 0.1;
  lastTime = ts;
  if (gameState === "PLAYING") update(dt);
  if (gameState === "PLAYING" || gameState === "GAMEOVER") draw();
  requestAnimationFrame(gameLoop);
}

function update(dt) {
  let spd = climbSpeed;
  if (koala.boostActive) spd *= 2.5;
  else if (koala.state === "shocked") spd = 0;

  climbSpeed = Math.min(maxClimbSpeed, 150 + score * 0.6);
  koala.update(dt);
  distanceClimbed += spd * dt;
  bgScrollY += spd * dt * 0.15;
  poleScrollY += spd * dt;

  // ---- Spawn obstacles ----
  if (distanceClimbed >= nextObstacleAt) {
    const types = ["crossbar", "electric", "bird"];
    // At higher scores, block 2 lanes leaving 1 safe
    if (score > 200 && Math.random() < 0.4) {
      let safe = Math.floor(Math.random() * 3);
      for (let l = 0; l < 3; l++) if (l !== safe) obstacles.push(new Obstacle(ctx, l, -70, types[Math.floor(Math.random()*types.length)]));
    } else {
      obstacles.push(new Obstacle(ctx, Math.floor(Math.random()*3), -70, types[Math.floor(Math.random()*types.length)]));
    }
    nextObstacleAt = distanceClimbed + 250 + Math.random() * 60;
  }

  // ---- Spawn collectibles ----
  if (distanceClimbed >= nextCollectibleAt) {
    let lane = Math.floor(Math.random() * 3);
    // Avoid obstacle overlap
    const blocked = obstacles.filter(o => o.y < 80 && o.y > -120).map(o => o.lane);
    const free = [0,1,2].filter(l => !blocked.includes(l));
    if (free.length > 0 && blocked.includes(lane)) lane = free[Math.floor(Math.random()*free.length)];

    const r = Math.random();
    let type = r < 0.78 ? "leaf" : r < 0.95 ? "star" : r < 0.98 ? "shield_item" : "boost_item";
    collectibles.push(new FallingObject(ctx, lane, -45, type));
    nextCollectibleAt = distanceClimbed + 100 + Math.random() * 30;
  }

  // ---- Update obstacles ----
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const o = obstacles[i];
    o.update(dt, spd);
    if (koala.isTouching(o) && koala.state !== "shocked") {
      if (koala.boostActive) {
        spawnParticles(o.x+o.width/2, o.y+o.height/2, "#fbbf24", 12, 130);
        sfx.collect(); spawnText(o.x+o.width/2, o.y, "CRASH!", "#fbbf24");
        obstacles.splice(i,1); score += 20; ui.updateGameInfo(score, lives); continue;
      } else if (koala.shieldActive) {
        koala.shieldActive = false; koala.shieldTimer = 0;
        spawnParticles(o.x+o.width/2, o.y+o.height/2, "#38bdf8", 12, 110);
        sfx.shield(); spawnText(o.x+o.width/2, o.y, "SHIELD!", "#38bdf8");
        obstacles.splice(i,1); continue;
      } else {
        lives--;
        koala.triggerShock(); sfx.shock();
        spawnParticles(koala.x+koala.width/2, koala.y+koala.height/2, "#ef4444", 15, 140);
        spawnText(koala.x+koala.width/2, koala.y-15, "-1 LIFE", "#ef4444");
        obstacles.splice(i,1); ui.updateGameInfo(score, lives);
        if (lives <= 0) gameOver();
        continue;
      }
    }
    if (o.y > canvas.height + 80) obstacles.splice(i,1);
  }

  // ---- Update collectibles ----
  for (let i = collectibles.length - 1; i >= 0; i--) {
    const c = collectibles[i];
    c.update(dt, spd);
    if (koala.isTouching(c) && !c.collected && koala.state !== "shocked") {
      c.collected = true;
      if (c.type === "leaf")  { score += 10; sfx.collect(); spawnParticles(c.x+c.width/2, c.y+c.height/2, "#10b981", 6, 70); spawnText(c.x+c.width/2, c.y, "+10", "#34d399"); }
      if (c.type === "star")  { score += 50; sfx.collect(); spawnParticles(c.x+c.width/2, c.y+c.height/2, "#facc15", 10, 100); spawnText(c.x+c.width/2, c.y, "+50 ⭐", "#fbbf24"); }
      if (c.type === "shield_item") { koala.shieldActive = true; koala.shieldTimer = 7; sfx.shield(); spawnParticles(c.x+c.width/2, c.y+c.height/2, "#38bdf8", 10, 80); spawnText(koala.x+koala.width/2, koala.y-25, "SHIELD! 🛡️", "#38bdf8"); }
      if (c.type === "boost_item")  { koala.boostActive = true; koala.boostTimer = 4; sfx.boost(); spawnParticles(c.x+c.width/2, c.y+c.height/2, "#facc15", 12, 120); spawnText(koala.x+koala.width/2, koala.y-25, "BOOST! ⚡", "#fbbf24"); }
      ui.updateGameInfo(score, lives);
      collectibles.splice(i,1); continue;
    }
    if (c.y > canvas.height + 80) collectibles.splice(i,1);
  }

  // ---- Update particles ----
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
    if (p.life <= 0) particles.splice(i,1);
  }
  // ---- Update floating texts ----
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    floatingTexts[i].y -= 40 * dt; floatingTexts[i].life -= dt;
    if (floatingTexts[i].life <= 0) floatingTexts.splice(i,1);
  }

  // Climbing dust
  if (koala.state === "clinging" && Math.random() < 0.1) {
    particles.push({ x: koala.x+koala.width/2+(Math.random()-0.5)*18, y: koala.y+koala.height-5, vx:(Math.random()-0.5)*15, vy:40+Math.random()*30, color:"#cbd5e1", size:1+Math.random()*2, life:0.2+Math.random()*0.2 });
  }
}

function gameOver() {
  gameState = "GAMEOVER"; sfx.over();
  const meters = Math.floor(distanceClimbed / 20);
  const high = setHigh(meters);
  const isNew = meters >= high && meters > 0;
  ui.showMessage(
    isNew ? "Kỷ Lục Mới!" : "Game Over",
    "Chơi Lại", startGame,
    isNew ? `Chúc mừng! Kỷ lục mới: ${meters}m!` : `Leo được: ${meters}m | Kỷ lục: ${high}m`
  );
}

// ---- Draw ----
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Sky background
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // 2. Power line wires (sagging between poles)
  ctx.save();
  ctx.strokeStyle = "rgba(30, 41, 59, 0.5)";
  ctx.lineWidth = 1.2;
  const ws = 280;
  let wy = (poleScrollY % ws) - ws;
  while (wy < canvas.height) {
    // Wire from left edge to pole 0
    ctx.beginPath(); ctx.moveTo(0, wy-8); ctx.quadraticCurveTo(100, wy+18, 200, wy-4); ctx.stroke();
    // Wire between poles 0-1
    ctx.beginPath(); ctx.moveTo(200, wy-4); ctx.quadraticCurveTo(300, wy+18, 400, wy-4); ctx.stroke();
    // Wire between poles 1-2
    ctx.beginPath(); ctx.moveTo(400, wy-4); ctx.quadraticCurveTo(500, wy+18, 600, wy-4); ctx.stroke();
    // Wire from pole 2 to right edge
    ctx.beginPath(); ctx.moveTo(600, wy-4); ctx.quadraticCurveTo(700, wy+18, 800, wy-8); ctx.stroke();
    wy += ws;
  }
  ctx.restore();

  // 3. Draw 3 utility poles using the original pole image (tiled vertically)
  // Fully scales and draws the original 3D-like pole image
  for (let p = 0; p < 3; p++) {
    let py = (poleScrollY % POLE_DRAW_H) - POLE_DRAW_H;
    while (py < canvas.height + 100) {
      ctx.drawImage(poleImg, POLE_X[p] - POLE_DRAW_W / 2, py, POLE_DRAW_W, POLE_DRAW_H);
      py += POLE_DRAW_H;
    }
  }

  // 4. Obstacles
  obstacles.forEach(o => o.draw());

  // 5. Collectibles
  collectibles.forEach(c => c.draw());

  // 6. Particles
  particles.forEach(p => {
    ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill(); ctx.restore();
  });

  // 7. Koala
  koala.draw();

  // 8. Floating texts
  floatingTexts.forEach(ft => {
    ctx.save(); ctx.globalAlpha = ft.life; ctx.fillStyle = ft.color;
    ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif"; ctx.textAlign = "center";
    ctx.fillText(ft.text, ft.x, ft.y); ctx.restore();
  });

  // 9. HUD: distance
  ctx.save();
  ctx.fillStyle = "#0f172a"; ctx.globalAlpha = 0.55;
  ctx.fillRect(130, 10, 130, 26); ctx.globalAlpha = 1;
  ctx.fillStyle = "#e0f2fe"; ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif"; ctx.textAlign = "left";
  ctx.fillText(`Độ cao: ${Math.floor(distanceClimbed/20)}m`, 140, 28);
  ctx.restore();

  // 10. Shield/Boost bars
  if (koala.shieldActive) drawPowerBar(520, 14, koala.shieldTimer / 7, "#38bdf8", "SHIELD");
  if (koala.boostActive)  drawPowerBar(520, 30, koala.boostTimer / 4, "#facc15", "BOOST");
}

function drawPowerBar(x, y, pct, color, label) {
  ctx.save();
  ctx.fillStyle = "rgba(15,23,42,0.5)"; ctx.fillRect(x, y, 120, 8);
  ctx.fillStyle = color; ctx.fillRect(x, y, 120 * Math.max(0, pct), 8);
  ctx.fillStyle = "#e0f2fe"; ctx.font = "bold 10px Arial"; ctx.textAlign = "right";
  ctx.fillText(label, x - 5, y + 8);
  ctx.restore();
}
