const canvas = document.querySelector("canvas");
const webgl = canvas.getContext("webgl");

webgl.clearColor(0.6, 0.6, 0.6, 1.0);
webgl.clear(webgl.COLOR_BUFFER_BIT);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `
  attribute vec2 pos;
  uniform mat4 shift;
  void main() {
    gl_Position = shift * vec4(pos, 0.0, 1.0);
    gl_PointSize = 10.0;
  }
`,
);
webgl.compileShader(vertexShader);

const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(
  fragmentShader,
  `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 0.2, 1.0);
  }
`,
);
webgl.compileShader(fragmentShader);

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);
webgl.useProgram(program);

const points = new Float32Array([-0.5, 0.0, 0.5, 0.0, 0.0, 0.5]);

const buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, points, webgl.STATIC_DRAW);

const posAttribLocation = webgl.getAttribLocation(program, "pos");
webgl.enableVertexAttribArray(posAttribLocation);
webgl.vertexAttribPointer(posAttribLocation, 2, webgl.FLOAT, false, 0, 0);

const uniformShiftLocation = webgl.getUniformLocation(program, "shift");

let theta = 1;
let x_matrix = rotx(theta);

function draw() {
  webgl.clear(webgl.COLOR_BUFFER_BIT);
  webgl.uniformMatrix4fv(uniformShiftLocation, false, x_matrix);
  webgl.drawArrays(webgl.TRIANGLES, 0, 3);

  theta += 0.01;
  x_matrix = rotx(theta);

  requestAnimationFrame(draw);
}

draw();

function rotx(theta) {
  let c = Math.cos(theta);
  let s = Math.sin(theta);
  return new Float32Array([1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1]);
}

function roty(theta) {
  let c = Math.cos(theta);
  let s = Math.sin(theta);
  return new Float32Array([c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1]);
}

function rotz(theta) {
  let c = Math.cos(theta);
  let s = Math.sin(theta);
  return new Float32Array([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}
