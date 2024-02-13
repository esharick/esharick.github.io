const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let radius = canvas.height / 2;
ctx.translate(radius, radius);
radius *= 0.9;
drawFace();
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

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
    ctx.fillStyle = "#333";
    ctx.fill();

    //draw numbers
    ctx.font = radius * 0.15 + "px arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
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


