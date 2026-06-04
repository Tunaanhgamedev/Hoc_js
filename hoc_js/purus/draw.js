"use strict";
    let canvas;
    let context;

    window.onload = init;
    function init() {
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');

        draw();
    }
    function draw() {
        // random color
        let randomColor = Math.random() > 0.5 ? '#ff8080' : '#0099b0';

        context.fillStyle = randomColor;
        //context.fillRect(100, 50, 200, 175);

        // Draw a circle
        // context.beginPath();
        // context.arc(200, 100, 50, 0, 2 * Math.PI);
        // context.fill();

        // draw a basic line
        // context.beginPath();
        // context.moveTo(50, 50);
        // context.lineTo(250, 150);
        // context.stroke();

        // draw a triangle
        // context.beginPath();
        // context.moveTo(200, 100);
        // context.lineTo(250, 150);
        // context.lineTo(250, 50);
        // context.fill();

        // context.beginPath();
        // context.arc(500, 300, 100, 0, 2 * Math.PI);
        // context.strokeStyle = '#0099b0';
        // context.stroke(); // viền
        // //context.fill(); trong viền 

        // context.beginPath();
        // context.moveTo(500, 300);
        // context.lineTo(600, 400);
        // context.lineTo(600, 200);
        // context.stroke();

        // context.strokeStyle = '#ff8080';
        // context.strokeRect(500, 200, -200, 300);

        // let path = new Path2D('M 104.22331,133.37668 C -1.5072094,-35.219492 103.13006,33.890796 103.13006,33.890796 c 0,0 101.73939,-69.935966 1.09325,99.485884 z');

        // context.beginPath();
        // context.strokeStyle = '#0099b0';
        // context.fillStyle = '#ff8080';
        // context.stroke(path);
        // context.fill(path);

        // Chữ
        context.fillStyle = 'black';
        context.fillText("Tuna", 500, 300);
        context.font = '40px Arial, sans-serif';
        context.textAlign = 'right';
        context.textBaseline = 'bottom';
    }