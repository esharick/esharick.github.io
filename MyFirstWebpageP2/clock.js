const canvas = document.getElementById("clockCanvas");
const ctx = canvas.getContext("2d");

let radius = canvas.height / 2;
ctx.translate(radius, radius);
radius *= 0.9; 
drawClock();

function drawClock() {
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
}



