class Tween {
  constructor(source, target, duration) {
    this.source = source;
    this.target = target;
    this.duration = duration;
    this.elapsed = 0;
  }

  update(deltaTime) {
    this.elapsed += deltaTime;

    // đảm bảo elapsed không vượt quá duration
    if (this.elapsed >= this.duration) {
      this.elapsed = this.duration;
    }

    // nội dung của tween
    return (
      this.source + (this.target - this.source) * (this.elapsed / this.duration)
    );
  }
}
