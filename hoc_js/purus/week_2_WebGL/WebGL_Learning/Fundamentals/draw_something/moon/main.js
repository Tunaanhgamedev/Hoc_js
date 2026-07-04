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

function createCircle(cx, cy, radius, segments) {
  const vertices = [];

  for (let i = 0; i < segments; i++) {
    const angle1 = (i * Math.PI * 2) / segments;
    const angle2 = ((i + 1) * Math.PI * 2) / segments;

    vertices.push(cx, cy);

    vertices.push(
      cx + Math.cos(angle1) * radius,
      cy + Math.sin(angle1) * radius,
    );

    vertices.push(
      cx + Math.cos(angle2) * radius,
      cy + Math.sin(angle2) * radius,
    );
  }

  return vertices;
}

const moon = createCircle(250, 200, 80, 100);

const cut = createCircle(
  275, // lệch tâm
  195, // hơi lệch lên
  72, // bán kính nhỏ hơn
  100,
);

gl.uniform4f(colorLocation, 1, 1, 0.3, 1);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(moon), gl.STATIC_DRAW);
gl.drawArrays(gl.TRIANGLES, 0, moon.length / 2);

gl.uniform4f(colorLocation, 1, 1, 1, 1);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cut), gl.STATIC_DRAW);
gl.drawArrays(gl.TRIANGLES, 0, cut.length / 2);
