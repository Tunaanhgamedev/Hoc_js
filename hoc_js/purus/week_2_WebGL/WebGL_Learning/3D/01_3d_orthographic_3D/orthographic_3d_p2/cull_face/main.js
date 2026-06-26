"use strict";

async function main() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl");
  if (!gl) return;

  const program = await createProgramFromFiles(
    gl,
    "shaders/vertex.glsl",
    "shaders/fragment.glsl",
  );

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const colorLocation = gl.getAttribLocation(program, "a_color");
  const matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer to put positions in
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);

  // Create a buffer to put colors in
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);

  function radToDeg(r) {
    return (r * 180) / Math.PI;
  }

  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  const translation = [45, 150, 0];
  const rotation = [degToRad(40), degToRad(25), degToRad(325)];
  const scale = [1, 1, 1];

  drawScene();

  // Setup a ui.
  webglLessonsUI.setupSlider("#x", {
    value: translation[0],
    slide: updatePosition(0),
    max: gl.canvas.width,
  });
  webglLessonsUI.setupSlider("#y", {
    value: translation[1],
    slide: updatePosition(1),
    max: gl.canvas.height,
  });
  webglLessonsUI.setupSlider("#z", {
    value: translation[2],
    slide: updatePosition(2),
    max: gl.canvas.height,
  });
  webglLessonsUI.setupSlider("#angleX", {
    value: radToDeg(rotation[0]),
    slide: updateRotation(0),
    max: 360,
  });
  webglLessonsUI.setupSlider("#angleY", {
    value: radToDeg(rotation[1]),
    slide: updateRotation(1),
    max: 360,
  });
  webglLessonsUI.setupSlider("#angleZ", {
    value: radToDeg(rotation[2]),
    slide: updateRotation(2),
    max: 360,
  });
  webglLessonsUI.setupSlider("#scaleX", {
    value: scale[0],
    slide: updateScale(0),
    min: -5,
    max: 5,
    step: 0.01,
    precision: 2,
  });
  webglLessonsUI.setupSlider("#scaleY", {
    value: scale[1],
    slide: updateScale(1),
    min: -5,
    max: 5,
    step: 0.01,
    precision: 2,
  });
  webglLessonsUI.setupSlider("#scaleZ", {
    value: scale[2],
    slide: updateScale(2),
    min: -5,
    max: 5,
    step: 0.01,
    precision: 2,
  });

  function updatePosition(index) {
    return function (event, ui) {
      translation[index] = ui.value;
      drawScene();
    };
  }

  function updateRotation(index) {
    return function (event, ui) {
      const angleInDegrees = ui.value;
      const angleInRadians = (angleInDegrees * Math.PI) / 180;
      rotation[index] = angleInRadians;
      drawScene();
    };
  }

  function updateScale(index) {
    return function (event, ui) {
      scale[index] = ui.value;
      drawScene();
    };
  }

  // Draw the scene.
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.CULL_FACE);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    // Turn on the color attribute
    gl.enableVertexAttribArray(colorLocation);

    // Bind the color buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    let matrix = m4.projection(
      gl.canvas.clientWidth,
      gl.canvas.clientHeight,
      400,
    );
    matrix = m4.translate(
      matrix,
      translation[0],
      translation[1],
      translation[2],
    );
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    let primitiveType = gl.TRIANGLES;
    let offset = 0;
    let count = 16 * 6;
    gl.drawArrays(primitiveType, offset, count);
  }
}

// Fill the buffer with the values that define a letter 'F'.
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

// Fill the buffer with colors for the 'F'.
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

main();
