class Box{
    constructor(x, y, width, height, type){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }

    colliding(other){// check if bounding boxes are intersecting
        return Boolean(this.x+this.width>other.x) && 
               Boolean(this.x<other.x+other.width) && 
               Boolean(this.y+this.height>other.y) && 
               Boolean(this.y<other.y+other.height);
    }

    collidingPoint(x, y){
        return x>x && y>y && x<x+width && y<y+width;
    }

    setBox(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
}