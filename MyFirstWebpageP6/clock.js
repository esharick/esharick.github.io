const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let radius = canvas.height / 2;
ctx.translate(radius, radius);
radius *= 0.9;
setInterval(drawClock, 1000/60); //call drawClock() every 1 second

function drawClock() {
    drawFace();
    drawNumbers();
    drawHashes();
    drawTime();
    drawKnob();
}

function drawTime() {
    const now = new Date(); //current time
    let hour = now.getHours() % 12;
    let minute = now.getMinutes();
    let second = now.getSeconds();
    let milli = now.getMilliseconds();

    let ang = (Math.PI / 6 * hour) + (Math.PI / 6 * minute / 60) +
        (Math.PI / 6 * second / 3600);
    let length = radius * 0.5;
    let width = radius * 0.05;
    drawHand(ang, length, width); //hour hand

    //draw the minute hand
    ang = (Math.PI / 30 * minute) + (Math.PI / 30 * second / 60);
    length = radius * 0.75;
    width = radius * 0.045;
    drawHand(ang, length, width);
    
    //draw the second hand
    ang = (Math.PI / 30 * second) + (Math.PI / 30 * milli / 1000);
    width = radius * 0.02;
    drawHand(ang, length, width, "red");
}

function drawHashes() {
    ctx.strokeStyle = "#333";
    for (let i = 0; i < 60; i++) {
        ctx.lineWidth = (i % 5 == 0) ? 0.02 * radius : 0.01 * radius;
        let ang = Math.PI / 30 * i;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.rotate(ang);
        ctx.moveTo(0, -radius * 0.72);
        ctx.lineTo(0, -radius * 0.76);
        ctx.rotate(-ang);
        ctx.stroke();
    }

}

function drawHand(ang, length, width, color="#333") { 
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(ang);
    ctx.lineTo(0, -length);
    ctx.rotate(-ang);
    ctx.stroke(); //draw the path
}

function drawFace() {
    const grad = ctx.createRadialGradient(
        0, 0, radius * 0.95, 0, 0, radius * 1.05)
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, "white");
    grad.addColorStop(1, '#333');
    //use gradient as the style the border of the arc

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.strokeStyle = grad;
    ctx.lineWidth = radius * 0.1;
    ctx.stroke();
}
 
function drawKnob() {    
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
    ctx.fillStyle = "#333";
    ctx.fill();
}

function drawNumbers() {
    //draw numbers
    ctx.font = radius * 0.15 + "px arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#333";
    ctx.beginPath();
    for (let i = 1; i < 13; i++) {
        
        let ang = Math.PI / 6 * i; 
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(i.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
    }
} 


