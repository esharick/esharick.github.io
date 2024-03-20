function addElement() {
    const links = ['https://media.gettyimages.com/id/1354211146/vector/cthulhu-monster-horror-poster.jpg?s=612x612&w=0&k=20&c=9pyQ8efOeOby1W4P9Z66g_Agb7msRUeZYKBoFMYlecM=',
            'https://media.gettyimages.com/id/1071104734/photo/woman-silhouette-at-sunset-on-hill.jpg?s=612x612&w=0&k=20&c=3PrCHcltS4TtxUXHxT9rLXrG154Lpf70BNDQfkysRnQ=',
            'https://media.gettyimages.com/id/490772190/photo/young-business-boy-wearing-jetpack-in-england.jpg?s=612x612&w=0&k=20&c=5Tcb2qGvTrUCwSObhd1q7EL73IOhYcdIHCM8iL-dS5I=',
            'https://media.gettyimages.com/id/1249041775/photo/photo-depicting-the-person-who-focuses-on-the-target.jpg?s=612x612&w=0&k=20&c=8gu2chWSKen1mRvABWhS4NvI9437yaymHXPOmzM8QyA=',
            'https://media.gettyimages.com/id/1297349747/photo/hot-air-balloons-flying-over-the-botan-canyon-in-turkey.jpg?s=612x612&w=0&k=20&c=kt8-RRzCDunpxgKFMBBjZ6jSteetNhhSxHZFvHQ0hNU=',
            '../images/lex.jpg',
            '../images/joey.jpg',
            '../images/raj.jpg',
            '../images/ausy.jpg'];

    const img = document.getElementById('DualImg');
    const nature = document.getElementById('Nature');
    img.style.display='block';
    let index = Math.floor(Math.random()*9);
    let link = links[index];
    img.src = link;
    if(index<=4){
        nature.innerText="Good";
        nature.style.color='green';
    }
    else {
        nature.innerText="Bad";
        nature.style.color='red';
    }
}