const canvas = document.querySelector("canvas");
const webgl = canvas.getContext("webgl");

webgl.clearColor(0.6, 0.6, 0.6, 1.0);
webgl.clear(webgl.COLOR_BUFFER_BIT);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `
  attribute vec2 pos;
  void main() {
    gl_Position = vec4(pos, 0.0, 1.0);
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
    gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0);
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

webgl.drawArrays(webgl.TRIANGLES, 0, 3);
