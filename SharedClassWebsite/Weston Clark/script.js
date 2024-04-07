const btn = document.getElementById('btn');
const bgText = document.getElementById('bg-text');
const welcome = document.getElementById('welcome');
const navMenu = document.getElementById('nav-menu');
let shrunk = false;
let ticking = false;

btn.addEventListener('click', function(e){
    shrink();
});

function shrink() {
    shrunk=!shrunk;
    if(!shrunk){
        bgText.style.width = '80%';
        welcome.style.backgroundPositionY = '0';
    }
    else {
        bgText.style.width = '20%';
        welcome.style.backgroundPositionY = '-120vh';
    }
}