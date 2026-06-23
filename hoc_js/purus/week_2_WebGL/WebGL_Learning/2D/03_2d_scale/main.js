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
const translationLocation = gl.getUniformLocation(program, "u_translation");
const rotationLocation = gl.getUniformLocation(program, "u_rotation");
const scaleLocation = gl.getUniformLocation(program, "u_scale");

let angleInRad = (Math.PI * 0) / 180; // Convert degrees to radians
let sin = Math.sin(angleInRad);
let cos = Math.cos(angleInRad);

const positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

setGeometry(gl);

const translation = [50, 50];
const rotation = [sin, cos];
const scale = [2, 2];

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const size = 2; // 2 components per iteration
const type = gl.FLOAT; // the data is 32bit floats
const normalize = false; // don't normalize the data
const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
const offset = 0; // start at the beginning of the buffer
gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
gl.uniform4fv(colorLocation, [Math.random(), Math.random(), Math.random(), 1]);
gl.uniform2fv(translationLocation, translation);
gl.uniform2fv(rotationLocation, rotation);
gl.uniform2fv(scaleLocation, scale);

const primitiveType = gl.TRIANGLES;
gl.drawArrays(primitiveType, 0, 18);

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
