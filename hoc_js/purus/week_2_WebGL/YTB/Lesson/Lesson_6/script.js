const canvas = document.querySelector("canvas");
const webgl = canvas.getContext("webgl");

webgl.clearColor(0.6, 0.6, 0.6, 1.0);
webgl.clear(webgl.COLOR_BUFFER_BIT);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `
  attribute vec2 pos;
  uniform mat4 shiftx;
  uniform mat4 shifty;
  uniform mat4 shiftz;
  uniform mat4 id;
  void main() {
    gl_Position = id * shiftz * shifty * shiftx * vec4(pos, 0.0, 1.0);
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

const points = new Float32Array([
  -0.5, 0.0, 0.5, 0.0, 0.0, 0.5,

  0.5, 0.0, -0.5, 0.0, 0.0, -0.5,
]);

const buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, points, webgl.STATIC_DRAW);

const posAttribLocation = webgl.getAttribLocation(program, "pos");
webgl.enableVertexAttribArray(posAttribLocation);
webgl.vertexAttribPointer(posAttribLocation, 2, webgl.FLOAT, false, 0, 0);

const uniformShiftXLocation = webgl.getUniformLocation(program, "shiftx");
const uniformShiftYLocation = webgl.getUniformLocation(program, "shifty");
const uniformShiftZLocation = webgl.getUniformLocation(program, "shiftz");
const uniformIdentityLocation = webgl.getUniformLocation(program, "id");

let theta = 1;
let x_matrix = rotx(theta);
let y_matrix = roty(theta);
let z_matrix = rotz(theta);
let identity_matrix = identity();

function draw() {
  webgl.clear(webgl.COLOR_BUFFER_BIT);
  webgl.uniformMatrix4fv(uniformShiftXLocation, false, x_matrix);
  webgl.uniformMatrix4fv(uniformShiftYLocation, false, y_matrix);
  webgl.uniformMatrix4fv(uniformShiftZLocation, false, z_matrix);
  webgl.uniformMatrix4fv(uniformIdentityLocation, false, identity_matrix);
  webgl.drawArrays(webgl.TRIANGLES, 0, 6);

  theta += 0.01;
  x_matrix = rotx(theta);
  y_matrix = roty(theta);
  z_matrix = rotz(theta);
  identity_matrix = identity();

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

function identity() {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}