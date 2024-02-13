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
    //use gradient as the style of a circle shape

    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
}


