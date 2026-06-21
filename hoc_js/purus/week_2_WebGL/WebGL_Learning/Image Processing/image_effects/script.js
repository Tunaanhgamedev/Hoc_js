"use strict";

function main() {
  var image = new Image();
  image.src = "../img/mr-survivor.jpg";
  image.onload = function () {
    render(image);
  };

  function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  function render(image) {
    var canvas = document.querySelector("canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
      return;
    }

    var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    var fragmentShaderSource = document.querySelector(
      "#fragment-shader-2d",
    ).text;

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );

    var program = createProgram(gl, vertexShader, fragmentShader);
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
    var imageLocation = gl.getUniformLocation(program, "u_image");

    var flipYLocation = gl.getUniformLocation(program, "u_flipY");

    function computeKernelWeight(kernel) {
      var weight = kernel.reduce(function (prev, curr) {
        return prev + curr;
      });
      return weight <= 0 ? 1 : weight;
    }

    var kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
    var kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");

    setRectangle(gl, 0, 0, image.width, image.height);

    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
      ]),
      gl.STATIC_DRAW,
    );

    function createAndSetupTexture(gl) {
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      return texture;
    }

    var originalImageTexture = createAndSetupTexture(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    var textures = [];
    var framebuffers = [];
    for (var ii = 0; ii < 2; ++ii) {
      var texture = createAndSetupTexture(gl);
      textures.push(texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        image.width,
        image.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
      );
      var fbo = gl.createFramebuffer();
      framebuffers.push(fbo);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0,
      );
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(textureSizeLocation, image.width, image.height);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);
    gl.uniform1i(imageLocation, 0);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionLocation,
      size,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(texcoordLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      texcoordLocation,
      size,
      type,
      normalize,
      stride,
      offset,
    );

    var kernels = {
      normal: [0, 0, 0, 0, 1, 0, 0, 0, 0],
      gaussianBlur: [
        0.045, 0.122, 0.045, 0.122, 0.332, 0.122, 0.045, 0.122, 0.045,
      ],
      gaussianBlur2: [1, 2, 1, 2, 4, 2, 1, 2, 1],
      gaussianBlur3: [0, 1, 0, 1, 1, 1, 0, 1, 0],
      unsharpen: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
      sharpness: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      sharpen: [-1, -1, -1, -1, 16, -1, -1, -1, -1],
      edgeDetect: [
        -0.125, -0.125, -0.125, -0.125, 1, -0.125, -0.125, -0.125, -0.125,
      ],
      edgeDetect2: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
      edgeDetect3: [-5, 0, 0, 0, 0, 0, 0, 0, 5],
      edgeDetect4: [-1, -1, -1, 0, 0, 0, 1, 1, 1],
      edgeDetect5: [-1, -1, -1, 2, 2, 2, -1, -1, -1],
      edgeDetect6: [-5, -5, -5, -5, 39, -5, -5, -5, -5],
      sobelHorizontal: [1, 2, 1, 0, 0, 0, -1, -2, -1],
      sobelVertical: [1, 0, -1, 2, 0, -2, 1, 0, -1],
      previtHorizontal: [1, 1, 1, 0, 0, 0, -1, -1, -1],
      previtVertical: [1, 0, -1, 1, 0, -1, 1, 0, -1],
      boxBlur: [0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111],
      triangleBlur: [
        0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625,
      ],
      emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
    };

    var effectsToApply = ["gaussianBlur", "emboss", "unsharpen"];

    gl.uniform1f(flipYLocation, 1);
    gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);
    for (var ii = 0; ii < effectsToApply.length; ++ii) {
      setFramebuffer(framebuffers[ii % 2], image.width, image.height);

      drawWithKernel(effectsToApply[ii]);
      gl.bindTexture(gl.TEXTURE_2D, textures[ii % 2]);
    }

    gl.uniform1f(flipYLocation, -1);

    setFramebuffer(null, canvas.width, canvas.height);
    drawWithKernel("normal");

    function setFramebuffer(fbo, width, height) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.uniform2f(resolutionLocation, width, height);
      gl.viewport(0, 0, width, height);
    }

    function drawWithKernel(name) {
      gl.uniform1fv(kernelLocation, kernels[name]);
      gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]));

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }

  function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
      gl.STATIC_DRAW,
    );
  }
}
main();
