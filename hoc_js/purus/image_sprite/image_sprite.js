"use strict";

let canvas;
let context;

window.onload = init;

function init() {
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");

    window.requestAnimationFrame(gameLoop);
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    window.requestAnimationFrame(gameLoop);
}