

class gameObject{

    constructor(box, ani, target_te, trigger) {
        this.box = box;
        this.ani = ani;
        this.target_te = target_te;
        this.trigger = trigger;
        this.param = [];
        this.isTriggered = false;
    }
    
    copy(){
        return new gameObject(new Box(this.box.x, this.box.y, this.box.width, this.box.height), this.ani.copy(), this.target_te, this.trigger);
    }

    


    createAnimation(){
        this.ani = new animation();
        this.ani.path = "gameData/objects/";
    }

    
}
