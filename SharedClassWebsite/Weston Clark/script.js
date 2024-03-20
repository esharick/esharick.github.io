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
    if(!shrunk){
        bgText.classList.add('textBox');
        welcome.style.backgroundPositionY = '-120vh';
    }
    else {
        bgText.classList.remove('textBox');
        welcome.style.backgroundPositionY = '0';
    }
    shrunk=!shrunk;
}