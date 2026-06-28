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
"use strict";

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

function main() {
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    console.log("WebGL not supported");
    return;
  }

  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );

  var program = createProgram(gl, vertexShader, fragmentShader);

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  var positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // three 2d points
  var positions = [0, 0, 0, 0.5, 0.7, 0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  var colorUniformLocation = gl.getUniformLocation(program, "u_color");
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  var resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution",
  );

  // var positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  //   // draw
  // var primitiveType = gl.TRIANGLES;
  // var offset = 0;
  // var count = 6;
  // gl.uniform4f(colorUniformLocation, 1, 0, 0, 1);
  // gl.drawArrays(primitiveType, offset, count);

  //draw 50 random rectangles in random colors
  for (var ii = 0; ii < 50; ++ii) {
    setRectangle(
      gl,
      randomInt(300),
      randomInt(300),
      randomInt(300),
      randomInt(300),
    );

    // Set a random color.
    gl.uniform4f(
      colorUniformLocation,
      Math.random(),
      Math.random(),
      Math.random(),
      1,
    );

    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function randomInt(range) {
    return Math.floor(Math.random() * range);
  }

  function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
      gl.STATIC_DRAW,
    );
  }

  // gl.bufferData(
  //   gl.ARRAY_BUFFER,
  //   new Float32Array([100, 100, 300, 100, 200, 300]),
  //   gl.STATIC_DRAW,
  // );
  // gl.uniform4f(colorUniformLocation, 0, 1, 0, 1);
  // gl.drawArrays(gl.LINE_LOOP, 0, 3);
}

main();
