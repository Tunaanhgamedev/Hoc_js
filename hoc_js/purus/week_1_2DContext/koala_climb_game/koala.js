class Koala extends GameObject {
  constructor(context, img, x, y, width, height) {
    super(context, x, y, width, height);
    this.img = img;
    
    // 3 lanes corresponding to the 3 poles at X = 200, 400, 600
    this.lane = 1; // Start in middle lane
    this.state = 'clinging'; // 'clinging', 'jumping', 'shocked'
    
    this.POLE_X_COORDS = [200, 400, 600];
    
    this.x = this.getLaneX(this.lane);
    this.targetX = this.x;
    this.startX = this.x;
    
    this.jumpTimer = 0;
    this.jumpDuration = 0.22;
    this.yOffset = 0;
    this.originalY = y;
    this.shockTimer = 0;
    
    this.shieldActive = false;
    this.shieldTimer = 0;
    this.boostActive = false;
    this.boostTimer = 0;
    
    this.facingLeft = true;
  }

  getLaneX(lane) {
    return this.POLE_X_COORDS[lane] - this.width / 2;
  }

  // Single press: jump immediately, face the direction of movement
  jumpLeft() {
    if (this.state === 'shocked' || this.state === 'jumping') return false;
    if (this.lane === 0) return false;

    this.startX = this.x;
    this.lane--;
    this.targetX = this.getLaneX(this.lane);
    this.state = 'jumping';
    this.jumpTimer = 0;
    this.facingLeft = true; // face left when jumping left
    return true;
  }

  jumpRight() {
    if (this.state === 'shocked' || this.state === 'jumping') return false;
    if (this.lane === 2) return false;

    this.startX = this.x;
    this.lane++;
    this.targetX = this.getLaneX(this.lane);
    this.state = 'jumping';
    this.jumpTimer = 0;
    this.facingLeft = false; // face right when jumping right
    return true;
  }

  triggerShock() {
    this.state = 'shocked';
    this.shockTimer = 0.6;
    this.vy = 180;
  }

  update(dt) {
    if (this.shieldTimer > 0) {
      this.shieldTimer -= dt;
      if (this.shieldTimer <= 0) this.shieldActive = false;
    }
    if (this.boostTimer > 0) {
      this.boostTimer -= dt;
      if (this.boostTimer <= 0) this.boostActive = false;
    }

    if (this.state === 'jumping') {
      this.jumpTimer += dt;
      let t = this.jumpTimer / this.jumpDuration;
      if (t >= 1) {
        t = 1;
        this.x = this.targetX;
        this.yOffset = 0;
        this.state = 'clinging';
      } else {
        this.x = this.startX + (this.targetX - this.startX) * t;
        this.yOffset = -Math.sin(t * Math.PI) * 75;
      }
    } else if (this.state === 'shocked') {
      this.shockTimer -= dt;
      this.y += this.vy * dt;
      this.x = this.targetX + (Math.random() - 0.5) * 12;
      if (this.shockTimer <= 0) {
        this.state = 'clinging';
        this.y = this.originalY;
        this.x = this.targetX;
      }
    } else {
      this.x = this.targetX;
      this.yOffset = 0;
      
      let targetY = this.originalY;
      if (this.boostActive) {
        targetY = this.originalY - 100;
      }
      this.y += (targetY - this.y) * 5 * dt;
    }
  }

  draw() {
    const drawX = this.x;
    const drawY = this.y + this.yOffset;

    this.context.save();
    if (this.facingLeft) {
      // Draw normally
      this.context.drawImage(this.img, drawX, drawY, this.width, this.height);
    } else {
      // Flip horizontally to face right
      this.context.translate(drawX + this.width / 2, drawY + this.height / 2);
      this.context.scale(-1, 1);
      this.context.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
    }
    this.context.restore();

    // Draw shield bubble
    if (this.shieldActive) {
      this.context.save();
      this.context.strokeStyle = 'rgba(56, 189, 248, 0.8)';
      this.context.lineWidth = 3;
      let grad = this.context.createRadialGradient(
        drawX + this.width / 2, drawY + this.height / 2, this.width * 0.3,
        drawX + this.width / 2, drawY + this.height / 2, this.width * 0.7
      );
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.35)');
      this.context.fillStyle = grad;
      this.context.beginPath();
      this.context.arc(drawX + this.width / 2, drawY + this.height / 2, this.width * 0.72, 0, Math.PI * 2);
      this.context.fill();
      this.context.stroke();
      this.context.restore();
    }
    
    // Draw shock sparks
    if (this.state === 'shocked') {
      this.context.save();
      this.context.strokeStyle = '#facc15';
      this.context.lineWidth = 2.5;
      for (let i = 0; i < 5; i++) {
        this.context.beginPath();
        let sx = drawX + Math.random() * this.width;
        let sy = drawY + Math.random() * this.height;
        this.context.moveTo(sx, sy);
        for (let j = 0; j < 3; j++) {
          this.context.lineTo(sx + (Math.random() - 0.5) * 40, sy + (Math.random() - 0.5) * 40);
        }
        this.context.stroke();
      }
      this.context.restore();
    }
  }
}
