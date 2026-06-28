const canvas = document.querySelector("canvas");
const webgl = canvas.getContext("webgl");

webgl.clearColor(0.6, 0.6, 0.6, 1.0);
webgl.clear(webgl.COLOR_BUFFER_BIT);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `
  attribute vec2 pos;
  uniform mat4 shiftz;
  uniform mat4 scale;
  uniform mat4 translate;
  void main() {
    gl_Position = translate * scale * shiftz * vec4(pos, 0.0, 1.0);
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

const uniformShiftZLocation = webgl.getUniformLocation(program, "shiftz");
const uniformScaleLocation = webgl.getUniformLocation(program, "scale");
const uniformTranslateLocation = webgl.getUniformLocation(program, "translate");

let theta = 1;
let z_matrix = rotz(theta);
let scale_matrix = scale(0.5, 0.5, 1.0);
let move = translate(0.0, 0.0, 0.0);

function draw() {
  webgl.clear(webgl.COLOR_BUFFER_BIT);
  webgl.uniformMatrix4fv(uniformShiftZLocation, false, z_matrix);
  webgl.uniformMatrix4fv(uniformScaleLocation, false, scale_matrix);
  webgl.uniformMatrix4fv(uniformTranslateLocation, false, move);
  webgl.drawArrays(webgl.TRIANGLES, 0, 6);

  theta += 0.01;

  z_matrix = rotz(theta);

  requestAnimationFrame(draw);
}

draw();

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
