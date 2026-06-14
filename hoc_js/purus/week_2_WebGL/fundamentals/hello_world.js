// attribute vec4 a_position;
// void main() {
//   gl_Position = a_position;
// }

// var positionBuffer = [0, 0, 0, 0, 0, 0.5, 0, 0, 0.7, 0, 0, 0];

// var attributes = {};
// var gl_Position;

// drawArrays(..., offset, count) {
//     var stride = 4;
//     var size = 4;
//     for(var i = 0; i < count; ++i) {
//         const start = offset + i * stride;
//         attributes.a_position = positionBuffer.slice(start, start + size);
//         runVertexShader();
//         ...
//         doSomethingWith_gl_Position();
//     }
// }

var canvas = document.querySelector("#canvas");
var gl = canvas.getContext("webgl");
if (!gl) {
  console.log("WebGL not supported");
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

var program = createProgram(gl, vertexShader, fragmentShader);

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

var positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// three 2d points
var positions = [0, 0, 0, 0.5, 0.7, 0];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
