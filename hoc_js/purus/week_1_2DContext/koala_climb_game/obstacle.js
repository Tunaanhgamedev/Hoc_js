class Obstacle extends GameObject {
  constructor(context, lane, y, type = 'crossbar') {
    let x, width, height;
    const POLE_X_COORDS = [200, 400, 600];
    const laneCenterX = POLE_X_COORDS[lane];
    
    if (type === 'crossbar') {
      width = 92;
      height = 22;
      x = laneCenterX - width / 2;
    } else if (type === 'electric') {
      width = 50;
      height = 50;
      x = laneCenterX - width / 2;
    } else { // 'bird'
      width = 44;
      height = 32;
      x = laneCenterX - width / 2;
    }

    super(context, x, y, width, height, 0, 0);
    this.lane = lane;
    this.type = type;
    this.animTimer = Math.random() * 10;
  }

  update(dt, speed) {
    this.y += speed * dt;
    this.animTimer += dt;
  }

  draw() {
    this.context.save();

    if (this.type === 'crossbar') {
      // Draw metallic crossbar centered on the pole
      this.context.fillStyle = '#64748b'; // Slate grey steel
      this.context.strokeStyle = '#475569';
      this.context.lineWidth = 2;
      this.context.beginPath();
      this.context.fillRect(this.x, this.y, this.width, this.height);
      this.context.strokeRect(this.x, this.y, this.width, this.height);

      // Draw hazard yellow/black stripes
      const stripeSpacing = 14;
      this.context.save();
      // Clip to the bar
      this.context.beginPath();
      this.context.rect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
      this.context.clip();
      
      this.context.fillStyle = '#eab308'; // Yellow base
      this.context.fillRect(this.x, this.y, this.width, this.height);
      
      this.context.strokeStyle = '#1e293b'; // Dark stripes
      this.context.lineWidth = 5;
      for (let sx = this.x - this.height; sx < this.x + this.width + this.height; sx += stripeSpacing) {
        this.context.beginPath();
        this.context.moveTo(sx, this.y);
        this.context.lineTo(sx + this.height, this.y + this.height);
        this.context.stroke();
      }
      this.context.restore();

      // Draw two glass insulators on the tips (left and right of the crossbar)
      this.context.fillStyle = '#06b6d4'; // Cyan glass
      this.context.strokeStyle = '#0891b2';
      this.context.lineWidth = 1.5;
      
      const insulatorWidth = 8;
      const insulatorHeight = 8;
      
      // Left insulator
      const leftTipX = this.x + 6;
      this.context.fillStyle = '#475569'; // pin
      this.context.fillRect(leftTipX + 3, this.y - 4, 2, 4);
      this.context.fillStyle = '#06b6d4'; // cup
      this.context.fillRect(leftTipX, this.y - 12, insulatorWidth, insulatorHeight);
      this.context.strokeRect(leftTipX, this.y - 12, insulatorWidth, insulatorHeight);
      
      // Right insulator
      const rightTipX = this.x + this.width - 14;
      this.context.fillStyle = '#475569'; // pin
      this.context.fillRect(rightTipX + 3, this.y - 4, 2, 4);
      this.context.fillStyle = '#06b6d4'; // cup
      this.context.fillRect(rightTipX, this.y - 12, insulatorWidth, insulatorHeight);
      this.context.strokeRect(rightTipX, this.y - 12, insulatorWidth, insulatorHeight);

    } else if (this.type === 'electric') {
      // Draw Transformer Box centered on the pole
      const bx = this.x;
      const by = this.y;
      const w = this.width;
      const h = this.height;

      // Draw grey box
      this.context.fillStyle = '#334155';
      this.context.strokeStyle = '#1e293b';
      this.context.lineWidth = 2.5;
      this.context.fillRect(bx, by, w, h);
      this.context.strokeRect(bx, by, w, h);

      // Draw warning yellow triangle
      const tx = bx + w / 2;
      const ty = by + h / 2 - 4;
      this.context.fillStyle = '#eab308';
      this.context.beginPath();
      this.context.moveTo(tx, ty - 10);
      this.context.lineTo(tx + 10, ty + 10);
      this.context.lineTo(tx - 10, ty + 10);
      this.context.closePath();
      this.context.fill();
      
      // Lightning bolt icon inside
      this.context.fillStyle = '#000000';
      this.context.beginPath();
      this.context.moveTo(tx + 1, ty - 5);
      this.context.lineTo(tx - 3, ty + 2);
      this.context.lineTo(tx - 1, ty + 2);
      this.context.lineTo(tx - 2, ty + 7);
      this.context.lineTo(tx + 3, ty);
      this.context.lineTo(tx + 1, ty);
      this.context.closePath();
      this.context.fill();

      // Draw flashing electric spark arcs (cyan/yellow)
      if (Math.floor(this.animTimer * 10) % 3 !== 0) {
        this.context.strokeStyle = (Math.random() > 0.5) ? '#38bdf8' : '#facc15';
        this.context.lineWidth = 2;
        this.context.shadowBlur = 10;
        this.context.shadowColor = this.context.strokeStyle;

        this.context.beginPath();
        let startX = bx + w / 2;
        let startY = by + h / 2;
        this.context.moveTo(startX, startY);
        
        let cx = startX;
        let cy = startY;
        for (let i = 0; i < 4; i++) {
          cx += (Math.random() - 0.5) * 35;
          cy += (Math.random() - 0.5) * 35;
          this.context.lineTo(cx, cy);
        }
        this.context.stroke();
      }

    } else if (this.type === 'bird') {
      // Draw Flapping Bird centered in lane
      const bx = this.x + this.width / 2;
      const by = this.y + this.height / 2;
      const flap = Math.sin(this.animTimer * 15);

      this.context.fillStyle = '#80a5eb'; // Silhouette color
      this.context.strokeStyle = '#779bef';
      this.context.lineWidth = 1;

      // Head and Body
      this.context.beginPath();
      this.context.arc(bx, by, 6, 0, Math.PI * 2); // Body
      this.context.fill();

      // Draw head facing right/left depending on some simple state (let's say right)
      this.context.beginPath();
      this.context.arc(bx + 7, by - 3, 3.5, 0, Math.PI * 2); // Head
      this.context.fill();

      // Beak
      this.context.fillStyle = '#f97316';
      this.context.beginPath();
      this.context.moveTo(bx + 10, by - 5);
      this.context.lineTo(bx + 14, by - 3);
      this.context.lineTo(bx + 10, by - 1);
      this.context.fill();

      // Wings (flapping up/down)
      this.context.fillStyle = '#e6e9ed';
      this.context.beginPath();
      this.context.moveTo(bx, by - 2);
      this.context.lineTo(bx - 3, by - 14 * flap);
      this.context.lineTo(bx - 10, by - 10 * flap);
      this.context.lineTo(bx - 3, by + 2);
      this.context.closePath();
      this.context.fill();

      this.context.beginPath();
      this.context.moveTo(bx, by - 2);
      this.context.lineTo(bx + 3, by - 14 * flap);
      this.context.lineTo(bx + 10, by - 10 * flap);
      this.context.lineTo(bx + 3, by + 2);
      this.context.closePath();
      this.context.fill();

      // Tail feathers
      this.context.strokeStyle = '#1e293b';
      this.context.lineWidth = 3;
      this.context.beginPath();
      this.context.moveTo(bx, by + 4);
      this.context.lineTo(bx - 7, by + 10);
      this.context.stroke();
    }

    this.context.restore();
  }
}
