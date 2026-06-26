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