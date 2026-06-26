"use strict";

const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource,
);

const program = createProgram(gl, vertexShader, fragmentShader);

const positionLocation = gl.getAttribLocation(program, "a_position");
const colorLocation = gl.getAttribLocation(program, "a_color");
const matrixLocation = gl.getUniformLocation(program, "u_matrix");

// Tạo buffer để lưu trữ vị trí
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
setGeometry(gl);

// Tạo buffer để lưu trữ màu sắc
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);
setColors(gl);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//gl.clear(gl.COLOR_BUFFER_BIT);
// gl.enable(gl.CULL_FACE);
gl.useProgram(program);
gl.enableVertexAttribArray(positionLocation);
gl.enableVertexAttribArray(colorLocation);

// gl.uniform4fv(colorLocation, [Math.random(), Math.random(), Math.random(), 1]);

let matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
matrix = m4.translate(matrix, 50, 200, 0);
matrix = m4.xRotate(matrix, (Math.PI * 40) / 180);
matrix = m4.yRotate(matrix, (Math.PI * 25) / 180);
matrix = m4.zRotate(matrix, (Math.PI * 325) / 180);
matrix = m4.scale(matrix, 1, 1, 1);

gl.uniformMatrix4fv(matrixLocation, false, matrix);

let primitiveType = gl.TRIANGLES;
let offset = 0;
let count = 16 * 6;
gl.drawArrays(primitiveType, offset, count);

function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column front
      0, 0, 0, 30, 0, 0, 0, 150, 0, 0, 150, 0, 30, 0, 0, 30, 150, 0,

      // top rung front
      30, 0, 0, 100, 0, 0, 30, 30, 0, 30, 30, 0, 100, 0, 0, 100, 30, 0,

      // middle rung front
      30, 60, 0, 67, 60, 0, 30, 90, 0, 30, 90, 0, 67, 60, 0, 67, 90, 0,

      // left column back
      0, 0, 30, 30, 0, 30, 0, 150, 30, 0, 150, 30, 30, 0, 30, 30, 150, 30,

      // top rung back
      30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30, 30, 100, 0, 30, 100, 30, 30,

      // middle rung back
      30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30, 67, 60, 30, 67, 90, 30,

      // top
      0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30, 0, 0, 30,

      // top rung right
      100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0, 30,

      // under top rung
      30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0,

      // between top rung and middle
      30, 30, 0, 30, 30, 30, 30, 60, 30, 30, 30, 0, 30, 60, 30, 30, 60, 0,

      // top of middle rung
      30, 60, 0, 30, 60, 30, 67, 60, 30, 30, 60, 0, 67, 60, 30, 67, 60, 0,

      // right of middle rung
      67, 60, 0, 67, 60, 30, 67, 90, 30, 67, 60, 0, 67, 90, 30, 67, 90, 0,

      // bottom of middle rung.
      30, 90, 0, 30, 90, 30, 67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0,

      // right of bottom
      30, 90, 0, 30, 90, 30, 30, 150, 30, 30, 90, 0, 30, 150, 30, 30, 150, 0,

      // bottom
      0, 150, 0, 0, 150, 30, 30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150, 0,

      // left side
      0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0,
    ]),
    gl.STATIC_DRAW,
  );
}

function setColors(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array([
      // left column front
      200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200,
      70, 120,

      // top rung front
      200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200,
      70, 120,

      // middle rung front
      200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200,
      70, 120,

      // left column back
      80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70,
      200,

      // top rung back
      80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70,
      200,

      // middle rung back
      80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70,
      200,

      // top
      70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70,
      200, 210,

      // top rung right
      200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200,
      200, 70,

      // under top rung
      210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210,
      100, 70,

      // between top rung and middle
      210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70, 210,
      160, 70,

      // top of middle rung
      70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 70,
      180, 210,

      // right of middle rung
      100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100,
      70, 210,

      // bottom of middle rung.
      76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76,
      210, 100,

      // right of bottom
      140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140,
      210, 80,

      // bottom
      90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90,
      130, 110,

      // left side
      160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220,
      160, 160, 220,
    ]),
    gl.STATIC_DRAW,
  );
}
