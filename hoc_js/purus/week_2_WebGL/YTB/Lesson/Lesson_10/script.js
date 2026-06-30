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

  uniform mat4 shiftx;
  uniform mat4 shifty;
  uniform mat4 shiftz;
  uniform mat4 scale;
  uniform mat4 translate;
  uniform mat4 projection;
  void main() {
    gl_Position = projection * translate * shiftz * shifty * shiftx * scale * vec4(pos, 1.0);
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
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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
  -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5,
  -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
]);

const indices = new Uint16Array([
  // // Front
  // 0, 1, 2, 0, 2, 3,
  // // Back
  // 4, 5, 6, 4, 6, 7,
  // // Top
  // 3, 2, 6, 3, 6, 7,
  // // Bottom
  // 0, 1, 5, 0, 5, 4,
  // // Right
  // 1, 5, 6, 1, 6, 2,
  // // Left
  // 0, 4, 7, 0, 7, 3,
  0, 1, 1, 2, 2, 3, 3, 0, // Front face
  4, 5, 5, 6, 6, 7, 7, 4, // Back face
  0, 4, 1, 5, 2, 6, 3, 7, // Side edges
]);

// Create position buffer
const buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, points, webgl.STATIC_DRAW);

const posAttribLocation = webgl.getAttribLocation(program, "pos");
webgl.enableVertexAttribArray(posAttribLocation);
webgl.vertexAttribPointer(posAttribLocation, 3, webgl.FLOAT, false, 0, 0);

const indexBuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, indices, webgl.STATIC_DRAW);

const uniformShiftXLocation = webgl.getUniformLocation(program, "shiftx");
const uniformShiftYLocation = webgl.getUniformLocation(program, "shifty");
const uniformShiftZLocation = webgl.getUniformLocation(program, "shiftz");
const uniformScaleLocation = webgl.getUniformLocation(program, "scale");
const uniformTranslateLocation = webgl.getUniformLocation(program, "translate");
const uniformProjectionLocation = webgl.getUniformLocation(
  program,
  "projection",
);

let theta = 1;
let x_matrix = rotx(theta);
let y_matrix = roty(theta);
let z_matrix = rotz(theta);
let scale_matrix = scale(0.5, 0.5, 0.5);
let camera = translate(0.0, 0.0, -3.0);
let projection = perspective(
  Math.PI / 4,
  canvas.width / canvas.height,
  0.1,
  10.0,
);

function draw() {
  webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

  webgl.uniformMatrix4fv(uniformShiftXLocation, false, x_matrix);
  webgl.uniformMatrix4fv(uniformShiftYLocation, false, y_matrix);
  webgl.uniformMatrix4fv(uniformShiftZLocation, false, z_matrix);
  webgl.uniformMatrix4fv(uniformScaleLocation, false, scale_matrix);
  webgl.uniformMatrix4fv(uniformTranslateLocation, false, camera);
  webgl.uniformMatrix4fv(uniformProjectionLocation, false, projection);
  // webgl.drawArrays(webgl.TRIANGLES, 0, 36);
  webgl.drawElements(webgl.LINES, indices.length, webgl.UNSIGNED_SHORT, 0);

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

function perspective(fovy, aspect, near, far) {
  let f = 1.0 / Math.tan(fovy / 2);
  let nf = 1 / (near - far);
  return new Float32Array([
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (far + near) * nf,
    -1,
    0,
    0,
    2 * far * near * nf,
    0,
  ]);
}
