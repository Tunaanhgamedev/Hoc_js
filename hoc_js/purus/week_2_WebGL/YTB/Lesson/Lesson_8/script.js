const canvas = document.querySelector("canvas");
const webgl = canvas.getContext("webgl");

webgl.clearColor(0.6, 0.6, 0.6, 1.0);
webgl.clear(webgl.COLOR_BUFFER_BIT);
webgl.enable(webgl.DEPTH_TEST);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `
  attribute vec3 pos;
  attribute vec3 color;

  uniform mat4 shiftx;
  uniform mat4 shifty;
  uniform mat4 shiftz;
  uniform mat4 scale;
  uniform mat4 translate;

  varying vec3 vColor;
  void main() {
    gl_Position = translate * shiftz * shifty * shiftx * scale * vec4(pos, 1.0);
    gl_PointSize = 10.0;

    vColor = color;
  }
`,
);
webgl.compileShader(vertexShader);

const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(
  fragmentShader,
  `
  precision mediump float;

  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`,
);
webgl.compileShader(fragmentShader);

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);
webgl.useProgram(program);

const points = new Float32Array([
  // Front (z = 0.5)
  -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5,

  -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,

  // Back (z = -0.5)
  0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5,

  0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5,

  // Left (x = -0.5)
  -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5,

  -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,

  // Right (x = 0.5)
  0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5,

  0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5,

  // Bottom (y = -0.5)
  -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5,

  -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,

  // Top (y = 0.5)
  -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5,

  -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
]);

const color = new Float32Array([
  // Front (z = 0.5)
  1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

  1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

  // Back (z = -0.5)
  0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

  0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

  // Left (x = -0.5)
  0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

  0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

  // Right (x = 0.5)
  1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0,

  1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0,

  // Bottom (y = -0.5)
  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,

  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,

  // Top (y = 0.5)
  0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

  0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
]);

// Create position buffer
const buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, points, webgl.STATIC_DRAW);

const posAttribLocation = webgl.getAttribLocation(program, "pos");
webgl.enableVertexAttribArray(posAttribLocation);
webgl.vertexAttribPointer(posAttribLocation, 3, webgl.FLOAT, false, 0, 0);

// Create color buffer
const colorBuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, color, webgl.STATIC_DRAW);

const colorAttribLocation = webgl.getAttribLocation(program, "color");
webgl.enableVertexAttribArray(colorAttribLocation);
webgl.vertexAttribPointer(colorAttribLocation, 3, webgl.FLOAT, false, 0, 0);

const uniformShiftXLocation = webgl.getUniformLocation(program, "shiftx");
const uniformShiftYLocation = webgl.getUniformLocation(program, "shifty");
const uniformShiftZLocation = webgl.getUniformLocation(program, "shiftz");
const uniformScaleLocation = webgl.getUniformLocation(program, "scale");
const uniformTranslateLocation = webgl.getUniformLocation(program, "translate");

let theta = 1;
let x_matrix = rotx(theta);
let y_matrix = roty(theta);
let z_matrix = rotz(theta);
let scale_matrix = scale(0.5, 0.5, 0.5);
let move = translate(0.0, 0.0, 0.0);

function draw() {
  webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

  webgl.uniformMatrix4fv(uniformShiftXLocation, false, x_matrix);
  webgl.uniformMatrix4fv(uniformShiftYLocation, false, y_matrix);
  webgl.uniformMatrix4fv(uniformShiftZLocation, false, z_matrix);
  webgl.uniformMatrix4fv(uniformScaleLocation, false, scale_matrix);
  webgl.uniformMatrix4fv(uniformTranslateLocation, false, move);
  webgl.drawArrays(webgl.TRIANGLES, 0, 36);

  theta += 0.01;

  x_matrix = rotx(theta);
  y_matrix = roty(theta);
  // z_matrix = rotz(theta);

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

function translate(tx, ty, tz) {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]);
}

function scale(sx, sy, sz) {
  return new Float32Array([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]);
}
