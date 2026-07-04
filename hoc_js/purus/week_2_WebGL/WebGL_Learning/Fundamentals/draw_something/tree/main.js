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

const positions1 = [10, 60, 200, 60, 105, 30];

const positions2 = [10, 80, 200, 80, 105, 50];

const positions3 = [10, 100, 200, 100, 105, 70];

const positions4 = [80, 100, 130, 100, 80, 160, 130, 100, 130, 160, 80, 160];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions1), gl.STATIC_DRAW);
gl.drawArrays(gl.TRIANGLES, 0, positions1.length / 2);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions2), gl.STATIC_DRAW);
gl.drawArrays(gl.TRIANGLES, 0, positions2.length / 2);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions3), gl.STATIC_DRAW);
gl.drawArrays(gl.TRIANGLES, 0, positions3.length / 2);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions4), gl.STATIC_DRAW);
gl.drawArrays(gl.TRIANGLES, 0, positions4.length / 2);
