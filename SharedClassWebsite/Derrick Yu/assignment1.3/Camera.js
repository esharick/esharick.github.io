class Camera {

    constructor(x, y, width, height, speed){
        this.box = new Box(x, y, width, height, 'b');
        this.tBox = new Box(x-3000, y-2000, width+6000, height+4000, 'b');
        this.center = [x+width/2, y+height/2];
        this.offset = [-x, -y];
        this.cameraSpeed = speed;
        this.x = x;
        this.y = y;
    }

    update(){
        let xPull = (this.x-this.center[0])/this.box.width;
        let yPull = (this.y-this.center[1])/this.box.height;
        if(xPull>3){
            xPull=3;
        }else if(xPull<-3){
            xPull=-3;
        }else if(Math.abs(xPull)<0.08){
            xPull = 0;
        }

        if(yPull>3){
            yPull=3;
        }else if(yPull<-3){
            yPull=-3;
        }else if(Math.abs(yPull)<0.1){
            yPull = 0;
        }

        xPull*=this.cameraSpeed;
        yPull*=this.cameraSpeed;
        this.box.x+=xPull;
        this.box.y+=yPull;
        this.tBox.x+=xPull;
        this.tBox.y+=yPull;
        this.center[0] += xPull;
        this.center[1] += yPull;
        this.offset[0] -= xPull;
        this.offset[1] -= yPull;
    }

    teleport(x, y){
        this.box.x-=this.box.width/2;
        this.box.y-=this.box.height/2;
        this.center[0] = x;
        this.center[1] = y;
        this.offset[0] = -x+box.width/2;
        this.offset[1] = -y+box.height/2;
    }


}
