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

const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
const colorLocation = gl.getUniformLocation(program, "u_color");
const matrixLocation = gl.getUniformLocation(program, "u_matrix");

// Trước
// const projectionMatrix = projection(
//   gl.canvas.clientWidth,
//   gl.canvas.clientHeight,
// );
// const translationMatrix = translation(50, 200);
// const rotationMatrix = rotation(Math.PI * 0);
// const scaleMatrix = scaling(0.5, 0.5);

// let matrix = m3.multiply(projectionMatrix, translationMatrix);
// matrix = m3.multiply(matrix, rotationMatrix);
// matrix = m3.multiply(matrix, scaleMatrix);

const positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

setGeometry(gl);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

gl.uniform4fv(colorLocation, [Math.random(), Math.random(), Math.random(), 1]);

// sau: rút gọn 
var matrix = projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
matrix = translate(matrix, 50, 200);
matrix = rotate(matrix, Math.PI * 0);
matrix = scale(matrix, 0.5, 0.5);

gl.uniformMatrix3fv(matrixLocation, false, matrix);

gl.drawArrays(gl.TRIANGLES, 0, 18);

function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column
      0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,

      // top rung
      30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,

      // middle rung
      30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
    ]),
    gl.STATIC_DRAW,
  );
}
