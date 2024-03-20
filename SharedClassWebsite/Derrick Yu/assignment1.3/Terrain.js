class Terrain{

    updateBox(){
        this.box = new Box(x, y, this.box.width, this.box.height, 'b');
    }

    constructor(box, x, y, conds, accuracy, type) {
        this.box = box;
        this.x = x;
        this.y = y;
        this.conds = conds;
        this.type = type;
        this.accuracy = accuracy;
        this.stickFactor = 1;
        this.ani = null;
    }
    copy(){
        return new Terrain(this.box, this.x, this.y, this.conds, this.accuracy, this.type);
    }


    cond_angle(index, point){
        const slope = this.cond_dydx(index, point);
        let angle  = 0;
        if(slope >= 1000){
            angle = 1.5708;
        }else{
            angle = Math.atan(slope);
        }
        if(this.conds[index].type == 3){
            if(!this.conds[index].greater){
                if(angle>0){
                    angle-=3.14159;
                }else{
                    angle+=3.14159;
                }
            }
        }else if(this.conds[index].type == 4){//TODO debug this is returning screwed up angles
            if(!this.conds[index].greater && point[1]>this.conds[index].param[1] || this.conds[index].greater && point[1]<this.conds[index].param[1]+this.y){
                if(angle>0){
                    angle-=3.14159;
                }else{
                    angle+=3.14159;
                }
            }
        }else if(this.conds[index].type == 2 && this.conds[index].greater){
            angle -= 3.14159;
        }else if(this.conds[index].type == 1 && !this.conds[index].greater){
            angle -= 3.14159;
        }
        return angle;
    }

    cond_dydx(index, point){
        const cond = this.conds[index];
        const X = point[0]-this.x;
        const Y = point[1]-this.y;

        if(cond.type == 1){
            return 0;
        }else if(cond.type == 2){
            return 1000;

        }else if(cond.type == 3){//[3]: slope
            return cond.param[2];

        }else if(cond.type == 4){//[1]: x origin, [2]: y origin, [3]: radius, [4]: height
            // x^2/a^2 + y^2/b^2 = 1
            return (-cond.param[3]*cond.param[3]*(X-cond.param[0]))/(cond.param[2]*cond.param[2]*(Y-cond.param[1]));
        }
        return 0;
    }

    /**
     * Returns a boolean[] where the last element is whether it collides and the other elements are info about which conds were passed precisely
     * @param point
     * @return 
     */
    checkAllConds(point){ //somewhat expensive method
        let collisions = [];
        collisions[this.conds.length] =true;
        for(let i=0; i<this.conds.length; i++){
            if(this.cond_collision(i, point)){
                collisions[i] = true;
            }else{
                collisions[this.conds.length] = false;
                collisions[i] = false;
            }
        }
        return collisions;
    }

    getCollisionData(point1){
        const point2 = [point1[2], point1[3]];
        return this.getCollisionData2P(point1, point2);
    }

    /**
     * 
     * @param point1 start point
     * @param point2 end point
     * @return returns data in the form 
     * 
     * Returns
     * {push Vx, push Vy, slope angle, cond passed} 
     */
    getCollisionData2P(point1, point2){ //TODO fix and debug
        let result = [0,0,0,-1];
        const second = this.checkAllConds(point2);
        if(!second[second.length-1]){ // reject if not true
            //if end point not colliding, don't bother
            return result;
        }
 
        let stopper = 0;
        while(stopper<15){
            let numPassed = 0;
            const first = this.checkAllConds(point1);
            for(let i=0; i<first.length-1; i++){
                if(first[i] != second[i]){
                    result[3] = i; //this is the changed condition
                    numPassed++;
                }
            }
            if(numPassed <= 1){
                break;
            }
            point1[0] = (point1[0]+point2[0])/2;
            point1[1] = (point1[1]+point2[1])/2;
            stopper++;
        }

        if(result[3] == -1){ // both points are colliding
            result[3] = -2;
            return result; 
        }
        const newPoint = this.findCollisionPoint(point1, point2, result[3]);
        result[0] = newPoint[0] - point2[0];
        result[1] = newPoint[1] - point2[1];
        result[2] = this.cond_angle(result[3], newPoint);
        
        return result;
    }

    getPassedCond(point1, point2){
        const first = this.checkAllConds(point1);
        const second = this.checkAllConds(point2);
        for(let i=0; i<first.length; i++){
            if(first[i] != second[i]){
                return i;
            }
        }
        return -1;
    }

    isColliding(point){ //somewhat expensive method
        for(let i=0; i<this.conds.length; i++){
            if(!this.cond_collision(i, point)){
                return false;
            }
        }
        return true;
    }


    /**
     * Finds exact point of collision through "binary search"
     * Precondition: point1 not colliding & point2 colliding
     * @param point1
     * @param point2
     * @param cond
     * @param accuracy
     * @return postiion of collision with condition
     */
    findCollisionPoint(point1, point2, cond){

        let incX = point2[0] - point1[0]; // b-a    b is colliding point     a is not colliding
        let incY = point2[1] - point1[1];
        let current = [point1[0],point1[1]];

        while(Math.abs(incX)>this.accuracy || Math.abs(incY)>this.accuracy){// repeats until increments are within appropriate accuracy
            incX/=2;
            incY/=2;
            if(this.cond_collision(cond, current)){
                current[0]-=incX;
                current[1]-=incY;
            }else{
                current[0]+=incX;
                current[1]+=incY;
            }
        }
        if(this.cond_collision(cond, current)){ // ensures point is not colliding
            current[0]-=incX;
            current[1]-=incY;
        }
        return current;
    }

    /**
     * Precondition, point2 is colliding and other is not
     * @param point1
     * @param point2
     * @return
     */
    passedConds(point1, point2){ // returns the indexes of all conds passed
        const c2 = this.checkAllConds(point2);
        let passed = new Array[4];
        let count = 0;
        for(let i=0; i<c2.length&&count<4; i++){
            if(c2[i]){
                passed[count] = i;
                count++;
            }
        }
        return passed;
    }

    
    cond_collisionXY(index, x, y){
        const point = [x,y];
        return this.cond_collision(index, point);
    }

    cond_collision(index, point){
        const X = point[0]-this.x;
        const Y = point[1]-this.y;

        return this.cond_collision_relative(index, X, Y);
    }

    cond_collision_relative(index, X, Y){
        const cond = this.conds[index];
        let result = false;

        switch(cond.type){
            case 1:
                result = Boolean(Y>cond.param[0]);
                break;
            case 2:
                result = Boolean(X>cond.param[0]);
                break;
            case 3:
                // (y-y1) = m(x-x1)  y = mx - mx1 + y1
                // y = mx+b
                result = Boolean(Y > (X-cond.param[0])*cond.param[2]+cond.param[1]);
                break;
            case 4:
                // x^2/a^2 + y^2/b^2 = 1
                const X2 = X-cond.param[0];
                const Y2 = Y-cond.param[1];
                result = Boolean((X2*X2/(cond.param[2]*cond.param[2]) + Y2*Y2/(cond.param[3]*cond.param[3]))>1);
                break;
        }
        if(!cond.greater){
            result = !result;
        }
        return result;
    }


    createAnimation(){
        this.ani = new animation();
        this.ani.path = "gameData/terrain/";
    }

}