async function loadShader(url) {
  const response = await fetch(url);
  return await response.text();
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

async function createProgramFromFiles(gl, vertexPath, fragmentPath) {
  const vertexSource = await loadShader(vertexPath);
  const fragmentSource = await loadShader(fragmentPath);

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);

  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  return createProgram(gl, vertexShader, fragmentShader);
}
