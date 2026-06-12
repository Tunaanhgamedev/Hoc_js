var positionBuffer = [0, 0, 0, 0, 0, 0.5, 0, 0, 0.7, 0, 0, 0];

var attributes = {};
var gl_Position;

drawArrays(..., offset, count) {
    var stride = 4;
    var size = 4;
    for(var i = 0; i < count; ++i) {
        const start = offset + i * stride;
        attributes.a_position = positionBuffer.slice(start, start + size);
        runVertexShader();
        ...
        doSomethingWith_gl_Position();
}
