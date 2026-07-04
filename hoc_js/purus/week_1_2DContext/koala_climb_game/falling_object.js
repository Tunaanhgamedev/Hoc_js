class FallingObject extends GameObject {
  constructor(context, lane, y, type = 'leaf') {
    const size = 32;
    const POLE_X_COORDS = [200, 400, 600];
    const laneCenterX = POLE_X_COORDS[lane];
    const x = laneCenterX - size / 2;
    super(context, x, y, size, size, 0, 0);
    this.lane = lane;
    this.type = type;
    this.collected = false;
    this.pulseTimer = Math.random() * Math.PI * 2; // offset animation
  }

  update(dt, speed) {
    this.y += speed * dt;
    this.pulseTimer += dt * 5;
  }

  draw() {
    if (this.collected) return;

    this.context.save();
    
    // Add a subtle bounce/pulse effect
    const pulse = Math.sin(this.pulseTimer) * 3;
    const sizeOffset = Math.sin(this.pulseTimer * 0.5) * 2;
    const drawX = this.x - sizeOffset / 2;
    const drawY = this.y + pulse - sizeOffset / 2;
    const drawSize = this.width + sizeOffset;
    
    const cx = drawX + drawSize / 2;
    const cy = drawY + drawSize / 2;

    if (this.type === 'leaf') {
      // Draw Eucalyptus Leaf (Green teardrop shape rotated)
      this.context.translate(cx, cy);
      this.context.rotate(Math.PI / 4 + Math.sin(this.pulseTimer) * 0.1);
      
      this.context.fillStyle = '#10b981'; // Emerald green
      this.context.strokeStyle = '#059669';
      this.context.lineWidth = 1.5;
      
      this.context.beginPath();
      // Draw leaf shape
      this.context.moveTo(0, -drawSize / 2);
      this.context.quadraticCurveTo(drawSize / 2, -drawSize / 4, 0, drawSize / 2);
      this.context.quadraticCurveTo(-drawSize / 2, -drawSize / 4, 0, -drawSize / 2);
      this.context.fill();
      this.context.stroke();
      
      // Draw leaf vein
      this.context.beginPath();
      this.context.moveTo(0, -drawSize / 2);
      this.context.lineTo(0, drawSize / 2);
      this.context.strokeStyle = '#34d399';
      this.context.stroke();
    } else if (this.type === 'star') {
      // Draw Yellow Star
      this.context.fillStyle = '#facc15';
      this.context.strokeStyle = '#eab308';
      this.context.lineWidth = 1.5;
      this.context.shadowBlur = 12;
      this.context.shadowColor = '#facc15';
      
      this.context.beginPath();
      const points = 5;
      const outerRadius = drawSize / 2;
      const innerRadius = drawSize / 4;
      let rot = (Math.PI / 2) * 3;
      let xPos = cx;
      let yPos = cy;
      const step = Math.PI / points;

      this.context.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < points; i++) {
        xPos = cx + Math.cos(rot) * outerRadius;
        yPos = cy + Math.sin(rot) * outerRadius;
        this.context.lineTo(xPos, yPos);
        rot += step;

        xPos = cx + Math.cos(rot) * innerRadius;
        yPos = cy + Math.sin(rot) * innerRadius;
        this.context.lineTo(xPos, yPos);
        rot += step;
      }
      this.context.closePath();
      this.context.fill();
      this.context.stroke();
    } else if (this.type === 'shield_item') {
      // Draw Blue Shield Item
      this.context.fillStyle = '#38bdf8';
      this.context.strokeStyle = '#0284c7';
      this.context.lineWidth = 1.5;
      this.context.shadowBlur = 12;
      this.context.shadowColor = '#38bdf8';
      
      this.context.beginPath();
      this.context.arc(cx, cy, drawSize / 2, 0, Math.PI * 2);
      this.context.fillStyle = 'rgba(56, 189, 248, 0.4)';
      this.context.fill();
      this.context.stroke();
      
      this.context.fillStyle = '#ffffff';
      this.context.beginPath();
      this.context.moveTo(cx, cy - drawSize / 4);
      this.context.lineTo(cx + drawSize / 4, cy - drawSize / 4);
      this.context.lineTo(cx + drawSize / 4, cy);
      this.context.quadraticCurveTo(cx + drawSize / 4, cy + drawSize / 4, cx, cy + drawSize * 0.35);
      this.context.quadraticCurveTo(cx - drawSize / 4, cy + drawSize / 4, cx - drawSize / 4, cy);
      this.context.lineTo(cx - drawSize / 4, cy - drawSize / 4);
      this.context.closePath();
      this.context.fill();
    } else if (this.type === 'boost_item') {
      // Draw Lightning Bolt Boost Item
      this.context.fillStyle = '#fbbf24';
      this.context.strokeStyle = '#d97706';
      this.context.lineWidth = 1.5;
      this.context.shadowBlur = 12;
      this.context.shadowColor = '#fbbf24';
      
      this.context.beginPath();
      this.context.arc(cx, cy, drawSize / 2, 0, Math.PI * 2);
      this.context.fillStyle = 'rgba(251, 191, 36, 0.3)';
      this.context.fill();
      this.context.stroke();

      this.context.fillStyle = '#ffffff';
      this.context.beginPath();
      this.context.moveTo(cx + 3, cy - drawSize / 3);
      this.context.lineTo(cx - 6, cy + 1);
      this.context.lineTo(cx - 1, cy + 1);
      this.context.lineTo(cx - 3, cy + drawSize / 3);
      this.context.lineTo(cx + 6, cy - 1);
      this.context.lineTo(cx + 1, cy - 1);
      this.context.closePath();
      this.context.fill();
    }

    this.context.restore();
  }
}
