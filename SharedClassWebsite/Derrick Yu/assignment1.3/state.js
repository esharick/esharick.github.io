
class state{

    constructor(fileName, offsetX, offsetY, scale) {
        this.scale = scale;
        this.fileName = fileName;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.image = null;
        this.path = "gameData/sprites/";
    }



    draw(x, y, angle, isForwards){
        push();
        translate(x, y);
        rotate(angle);
        if(!isForwards){
            scale(-1, 1);
        }
        translate(offsetX, offsetY);
        scale(scale);
        image(image,0,0);
        pop();
    }


    

    
}