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
const translationLocation = gl.getUniformLocation(program, "u_translation");
const colorLocation = gl.getUniformLocation(program, "u_color");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
setGeometry(gl);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);

gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const size = 2;
const type = gl.FLOAT;
const normalize = false;
const stride = 0;
const offset = 0;
gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

// gl.uniform2f(translationLocation, 0, 0);
gl.uniform2f(translationLocation, 30, 30);

gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

const primitiveType = gl.TRIANGLES;
const count = 18;
gl.drawArrays(primitiveType, offset, count);

function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      //left column
      0, 0, 30, 0, 0, 150,

      0, 150, 30, 0, 30, 150,

      //top rung
      30, 0, 100, 0, 30, 30,

      30, 30, 100, 0, 100, 30,

      //middle rung
      30, 60, 67, 60, 30, 90,

      30, 90, 67, 60, 67, 90,
    ]),
    gl.STATIC_DRAW,
  );
}
