// Cách chạy

// ==========================================
// Vertex shader
// ==========================================
// Tạo bộ đệm
var buf = gl.createBuffer();
// Đưa dữ liệu vào bộ đệm
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, someData, gl.STATIC_DRAW);
// Tra cứu vị trí của thuộc tính
var positionLoc = gl.getAttribLocation(someShaderProgram, "a_position");

// Bật tính năng lấy dữ liệu ra khỏi bộ đệm cho thuộc tính này
gl.enableVertexAttribArray(positionLoc);
 
var numComponents = 3;  // (x, y, z)
var type = gl.FLOAT;    // Giá trị dấu phẩy động 32bit
var normalize = false;  // Giữ nguyên các giá trị
var offset = 0;         // Bắt đầu từ đầu bộ đệm
var stride = 0;         // có bao nhiêu byte để di chuyển đến đỉnh tiếp theo
                        // 0 = sử dụng sải chân chính xác cho type và numComponents
 
gl.vertexAttribPointer(positionLoc, numComponents, type, normalize, stride, offset);

// Vị trí của một biến đồng nhất
var offsetLoc = gl.getUniformLocation(someProgram, "u_offset");
gl.uniform4fv(offsetLoc, [1, 0, 0, 0]);  // Bù đắp nó sang nửa bên phải màn hình

gl.uniform1f (floatUniformLoc, v);                 // for float
gl.uniform1fv(floatUniformLoc, [v]);               // for float or float array
gl.uniform2f (vec2UniformLoc,  v0, v1);            // for vec2
gl.uniform2fv(vec2UniformLoc,  [v0, v1]);          // for vec2 or vec2 array
gl.uniform3f (vec3UniformLoc,  v0, v1, v2);        // for vec3
gl.uniform3fv(vec3UniformLoc,  [v0, v1, v2]);      // for vec3 or vec3 array
gl.uniform4f (vec4UniformLoc,  v0, v1, v2, v4);    // for vec4
gl.uniform4fv(vec4UniformLoc,  [v0, v1, v2, v4]);  // for vec4 or vec4 array
 
gl.uniformMatrix2fv(mat2UniformLoc, false, [  4x element array ])  // for mat2 or mat2 array
gl.uniformMatrix3fv(mat3UniformLoc, false, [  9x element array ])  // for mat3 or mat3 array
gl.uniformMatrix4fv(mat4UniformLoc, false, [ 16x element array ])  // for mat4 or mat4 array
 
gl.uniform1i (intUniformLoc,   v);                 // for int
gl.uniform1iv(intUniformLoc, [v]);                 // for int or int array
gl.uniform2i (ivec2UniformLoc, v0, v1);            // for ivec2
gl.uniform2iv(ivec2UniformLoc, [v0, v1]);          // for ivec2 or ivec2 array
gl.uniform3i (ivec3UniformLoc, v0, v1, v2);        // for ivec3
gl.uniform3iv(ivec3UniformLoc, [v0, v1, v2]);      // for ivec3 or ivec3 array
gl.uniform4i (ivec4UniformLoc, v0, v1, v2, v4);    // for ivec4
gl.uniform4iv(ivec4UniformLoc, [v0, v1, v2, v4]);  // for ivec4 or ivec4 array
 
gl.uniform1i (sampler2DUniformLoc,   v);           // for sampler2D (textures)
gl.uniform1iv(sampler2DUniformLoc, [v]);           // for sampler2D or sampler2D array
 
gl.uniform1i (samplerCubeUniformLoc,   v);         // for samplerCube (textures)
gl.uniform1iv(samplerCubeUniformLoc, [v]);         // for samplerCube or samplerCube array

// Cách đặt một mảng đồng nhất
// in shader
uniform vec2 u_someVec2[3];
 
// in JavaScript at init time
var someVec2Loc = gl.getUniformLocation(someProgram, "u_someVec2");
 
// at render time
gl.uniform2fv(someVec2Loc, [1, 2, 3, 4, 5, 6]);  // set the entire array of u_someVec2

// Thiết lập các phần tử riêng biệt của mảng đồng nhất
// in JavaScript at init time
var someVec2Element0Loc = gl.getUniformLocation(someProgram, "u_someVec2[0]");
var someVec2Element1Loc = gl.getUniformLocation(someProgram, "u_someVec2[1]");
var someVec2Element2Loc = gl.getUniformLocation(someProgram, "u_someVec2[2]");
 
// at render time
gl.uniform2fv(someVec2Element0Loc, [1, 2]);  // set element 0
gl.uniform2fv(someVec2Element1Loc, [3, 4]);  // set element 1
gl.uniform2fv(someVec2Element2Loc, [5, 6]);  // set element 2

// Tạo cấu trúc dữ liệu cho một đối tượng
struct SomeStruct {
  bool active;
  vec2 someVec2;
};
uniform SomeStruct u_someThing;
// Bạn phải tra cứu từng trường riêng lẻ
var someThingActiveLoc = gl.getUniformLocation(someProgram, "u_someThing.active");
var someThingSomeVec2Loc = gl.getUniformLocation(someProgram, "u_someThing.someVec2");

// ==========================================
// Fragment shader
// ==========================================

// Tạo và đưa dữ liệu vào kết cấu
var tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
var level = 0;
var width = 2;
var height = 1;
var data = new Uint8Array([
   255, 0, 0, 255,   // a red pixel
   0, 255, 0, 255,   // a green pixel
]);
gl.texImage2D(gl.TEXTURE_2D, level, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);

// Thiết lập bộ lọc kết cấu
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

//  Tra cứu vị trí của đồng nhất kết cấu
var someSamplerLoc = gl.getUniformLocation(someProgram, "u_texture");

// Liên kết kết cấu với một đơn vị kết cấu
var unit = 5;  // Chọn một số đơn vị kết cấu
gl.activeTexture(gl.TEXTURE0 + unit);
gl.bindTexture(gl.TEXTURE_2D, tex);
// Cho shader biết đơn vị kết cấu nào được liên kết với u_texture
gl.uniform1i(someSamplerLoc, unit);

// ==========================================
// GLSL
// ==========================================