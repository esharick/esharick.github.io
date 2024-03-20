class Character {

    //make final later TODO


    //direction is the direction the player is travelling in
    //playerDirection is direction the sprite is facing and the direction inputs will influence the velocity
    // point guide
    /*
     *   0        1
     * 2     10     3
     * 
     *   12      13
     * 4     11     5
     * 
     *   6        7
     *   8        9
     */

    constructor(x, y, width, height){ // very temporary
        this.jumpV=20; this.runSpeed=30; this.gravity=1.4; this.acceleration=0.42; // angle starts due east at 0 and increments anticlockwise in radians
        this.unitWidth, this.unitHeight;
        this.point = [];
        for(let i=0; i<16; i++){
            this.point[i] = [];
        }
        this.box; this.tbox; this.hitBox;
        this.base;
        this.lockAir = 0; this.lockControl; this.lockCeiling; //These are timers
        this.standingOn;
        this.physics = 0; // 1 for ground 0 for air 2 for air-ground collision
        this.PP=new Physics();
        this.currentAni=0; this.ringCount = 0; this.numJumps=1;
        this.isForwardsVar = true; // THIS THING IS TOTALLY SEPERATE FROM THE METHOD
        this.ani = [];

        this.width = width;
        this.height = height;
        this.Vx = 0;
        this.Vy = 0;
        this.base = 7;

        this.point[7][0] = x;
        this.point[7][1] = y;
        this.base = 7;
        this.box = new Box(0,0,10,10, 'b');
        this.tbox = new Box(0,0,10,10);
        this.hitBox = new Box(0,0,10,10);
        this.updateHitbox();
    }

    aniDirection(){
        if(this.isForwards() != this.isForwardsVar && this.getSpeed()>0.5){
            this.isForwardsVar = !this.isForwardsVar;
        }
        return this.isForwardsVar;
    }



    getAni(){
        return this.ani[this.currentAni];
    }




    copy(){
        let result =  new Character(this.x, this.y, this.width, this.height);
        result.Vx = this.vx;
        result.Vy = this.vy;
        result.angle = this.angle;
        result.unitWidth = this.unitWidth;
        result.unitHeight = this.unitHeight;
        result.point = this.point;
        result.box = this.box;
        result.tbox = this.tbox;
        result.base = this.base;
        result.physics = this.physics;
        return result;
    }












    incX(num){
        this.point[this.base][0] += num;
    }
    incY(num){
        this.point[this.base][1] += num;
    }
    setX(num){
        this.point[this.base][0] = num;
    }    
    setY(num){
        this.point[this.base][1] = num;
    }
    getX(){
        return this.point[0][0];
    }
    getY(){
        return this.point[0][1];
    }

    updateHitboxCheap(X, Y){

        for(i=0; i<this.point.length; i++){
            this.point[i][0]+=X;
            this.point[i][1]+=Y;
        }
    }



    updateHitbox(){ // update based on angle, position and current base
        const unitWidth= [this.width*Math.cos(this.angle), this.width*Math.sin(this.angle)];
        const unitHeight = [this.height*Math.sin(-this.angle), this.height*Math.cos(this.angle)]; //working
        if(this.base == 7){
            for(let i=0; i<2; i++){
                this.point[0][i] = this.point[this.base][i]-unitWidth[i]-unitHeight[i];
                this.point[1][i] = this.point[this.base][i]-unitHeight[i];
                this.point[6][i] = this.point[this.base][i]-unitWidth[i];
            }
        }else if(this.base == 6){
            for(let i=0; i<2; i++){
                this.point[0][i] = this.point[this.base][i]-unitHeight[i];
                this.point[1][i] = this.point[this.base][i]+unitWidth[i]-unitHeight[i];
                this.point[7][i] = this.point[this.base][i]+unitWidth[i];
            }
        }
        for(let i=0; i<2; i++){
            this.point[2][i] = this.point[0][i]-unitWidth[i]*0.1+0.3*unitHeight[i];
            this.point[3][i] = this.point[2][i]+unitWidth[i]*1.2;
            this.point[4][i] = this.point[2][i]+0.5*unitHeight[i];
            this.point[5][i] = this.point[3][i]+0.5*unitHeight[i];

            this.point[8][i] = this.point[6][i]+unitHeight[i]*0.05;
            this.point[9][i] = this.point[7][i]+unitHeight[i]*0.05;
            this.point[10][i] = this.point[2][i]+unitWidth[i]*0.6;
            this.point[11][i] = this.point[4][i]+unitWidth[i]*0.6;
            this.point[12][i] = this.point[0][i]+unitHeight[i]/2;
            this.point[13][i] = this.point[1][i]+unitHeight[i]/2;
            this.point[14][i] = this.point[6][i]-unitHeight[i]*0.1-unitWidth[i]*0.07;
            this.point[15][i] = this.point[7][i]-unitHeight[i]*0.1+unitWidth[i]*0.07;
        }
        //needed for hitbox update
        const center = [this.point[0][0]+unitWidth[0]/2+unitHeight[0]/2, this.point[0][1]+unitWidth[1]/2+unitHeight[1]/2];
        const diff = this.height-this.width;
        const W = this.width+diff*Math.abs(Math.sin(this.angle));
        const H = this.width+diff*Math.abs(Math.cos(this.angle));

        this.box.setBox(center[0]-W/2-30, center[1]-H/2-30, W+60, H+60);
        this.tbox.setBox(this.point[0][0]-3500,this.point[0][1]-2500, 7000, 5000);
        this.hitBox.setBox(center[0]-W/2, center[1]-H/2, W, H);
    }






    getSpeed(){
        return Math.sqrt(this.Vy*this.Vy+this.Vx*this.Vx);
    }
    setSpeed(n){
        const dir = this.getDirection();
        this.Vx = n*Math.cos(dir);
        this.Vy = n*Math.sin(dir);
    }
    incSpeed(n, angle){
        this.Vx+=n*Math.cos(angle);
        this.Vy+=n*Math.sin(angle);
    }
    multSpeed(n){
        this.Vx*=n;
        this.Vy*=n;
    }
    getDirection(){
        if(this.Vx==0){
            this.Vx=0.00001;
        }
        if(this.Vy==0){
            this.Vy=0.00001;
        }
        let angle = Math.atan(this.Vy/this.Vx);
        if(this.Vx<0){
            if(angle>0){
                angle-=3.14159;
            }else{
                angle+=3.14159;
            }
        }
        return angle;
    }

    isForwards(){
        if(this.physics == 1){
            return Math.abs(this.PP.angleDifference(this.getDirection(),this.angle))<1.4;
        }else{
            if(this.Vx>0){
                return true;
            }else{
                return false;
            }
        }

    }
    setDirection(angle){
        if(this.isForwards()){
            this.setDirectionAbs(angle);
        }else{
            this.setDirectionAbs(angle+3.14159);
        }
    }
    setDirectionAbs(angle){
        const speed = this.getSpeed();
        this.Vx = speed*Math.cos(angle);
        this.Vy = speed*Math.sin(angle);
    }

    goBackward(){
        if(this.physics == 0){
            if(this.Vx<-this.runSpeed){
                return;
            }
            this.Vx-=this.acceleration*0.8;
            if(this.Vx>0){
                this.Vx-=this.acceleration*0.5;
            }
            return;
        }
        if(this.getSpeed()>this.runSpeed && !this.isForwards() || this.lockControl>0){
            return;
        }
        if(this.height == 80){
            this.incSpeed(-this.acceleration*0.5, this.angle);
            return;
        }
        if(this.isForwards()){
            if(this.getSpeed()<8){
                this.setSpeed(0);
            }
            this.incSpeed(-this.acceleration*2, this.angle);
            return;
        }
        if(this.getSpeed() == 0){
            this.incSpeed(-this.acceleration, this.angle);
        }
        this.incSpeed(-this.acceleration, this.angle);

    }
    goForward(){
        if(this.physics == 0){
            if(this.Vx>this.runSpeed*0.8){
                return;
            }
            this.Vx+=this.acceleration*0.8;
            if(this.Vx<0){
                //Vx+=acceleration*0.5;
            }
            return;
        }
        if(this.getSpeed()>this.runSpeed && this.isForwards() || this.lockControl>0){
            return;
        }
        if(this.height == 80){
            this.incSpeed(this.acceleration*0.03, this.angle);
            return;
        }
        if(!this.isForwards()){
            if(this.getSpeed()<8){
                this.setSpeed(0);
            }
            this.incSpeed(this.acceleration*2, this.angle);
            return;
        }
        this.incSpeed(this.acceleration, this.angle);
        if(this.getSpeed()<0.1*this.runSpeed){
            this.incSpeed(this.acceleration*0.5, this.angle);
        }
    }
    jump(){
        this.numJumps--;
        if(this.numJumps<0){
            return;
        }
        this.lockAir = 25;
        if(this.physics == 0){
            this.Vy=-this.jumpV;
        }else{
            this.incSpeed(this.jumpV, this.angle-1.57079);
            this.incX(this.Vx);
            this.incY(this.Vy);
            this.updateHitbox();
            sound_jump.play();
        }
        this.physics = 0;
    }



    pos(){
        return this.point[0];
    }

    leftCeilingPusher(){
        return [this.point[12][0], this.point[12][1], this.point[0][0], this.point[0][1]];
    }
    rightCeilingPusher(){
        return [this.point[13][0], this.point[13][1], this.point[1][0], this.point[1][1]];
    }
    leftFloorPusher(){
        return [this.point[12][0], this.point[12][1], this.point[6][0], this.point[6][1]];
    }
    rightFloorPusher(){
        return [this.point[13][0], this.point[13][1], this.point[7][0], this.point[7][1]];
    }
    leftUpWallPusher(){
        return [this.point[10][0], this.point[10][1], this.point[2][0], this.point[2][1]];
    }
    rightUpWallPusher(){
        return [this.point[10][0], this.point[10][1], this.point[3][0], this.point[3][1]];
    }
    leftDownWallPusher(){
        return [this.point[11][0], this.point[11][1], this.point[4][0], this.point[4][1]];
    }
    rightDownWallPusher(){
        return [this.point[11][0], this.point[11][1], this.point[5][0], this.point[5][1]];
    }
    leftGroundPusher(){
        return [this.point[8][0], this.point[8][1], this.point[6][0], this.point[6][1]];
    }
    rightGroundPusher(){
        return [this.point[9][0], this.point[9][1], this.point[7][0], this.point[7][1]];
    }
    leftTopPusher(){
        return [this.point[1][0], this.point[1][1], this.point[0][0], this.point[0][1]];
    }
    rightTopPusher(){
        return [this.point[0][0], this.point[0][1], this.point[1][0], this.point[1][1]];
    }
    leftBase(){
        return this.point[6];
    }
    rightBase(){
        return this.point[7];
    }
    groundAngle(){
        return [this.point[this.base][0], this.point[this.base][1], this.point[this.base+2][0], this.point[this.base+2][1]];
    }
}
