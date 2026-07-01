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

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

gl.drawArrays(gl.POINTS, 0, 1);
