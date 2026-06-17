// How to draw a simple point | 1st program
const canvas = document.querySelector("canvas");
const webgl = canvas.getContext("webgl");

webgl.clearColor(0.6, 0.6, 0.6, 1.0);
webgl.clear(webgl.COLOR_BUFFER_BIT);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `
  attribute vec4 position;
  void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 10.0;
  }
`,
);
webgl.compileShader(vertexShader);

const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(
  fragmentShader,
  `
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

webgl.drawArrays(webgl.POINTS, 0, 1);
