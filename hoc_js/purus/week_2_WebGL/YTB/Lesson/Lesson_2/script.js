const canvas = document.querySelector("canvas");
const webgl = canvas.getContext("webgl");

webgl.clearColor(0.6, 0.6, 0.6, 1.0);
webgl.clear(webgl.COLOR_BUFFER_BIT);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `
  attribute vec4 position;

  uniform vec2 pos;
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
  uniform vec3 colour;
  void main() {
    gl_FragColor = vec4(colour, 1.0);
  }
`,
);
webgl.compileShader(fragmentShader);

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);
webgl.useProgram(program);

const posLocation = webgl.getUniformLocation(program, "pos");
const colourLocation = webgl.getUniformLocation(program, "colour");

webgl.uniform3f(colourLocation, 1.0, 0.0, 0.0);
webgl.uniform2f(posLocation, -0.5, 0.0);
webgl.drawArrays(webgl.POINTS, 0, 1);

webgl.uniform3f(colourLocation, 0.0, 1.0, 0.0);
webgl.uniform2f(posLocation, 0.5, 0.0);
webgl.drawArrays(webgl.POINTS, 0, 1);

webgl.uniform3f(colourLocation, 0.0, 0.0, 1.0);
webgl.uniform2f(posLocation, 0.0, -0.5);
webgl.drawArrays(webgl.POINTS, 0, 1);
