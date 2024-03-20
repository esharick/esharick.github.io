class Physics {



    constructor(){
        this.te = [];
        this.ob = [];
        this.current;
        this.current_te;
        this.current_ob;
        this.standingOn;
        this.tolerance = 0.7;
        this.C = [];
        this.startChunk = [];
        this.endChunk = [];
    }

    createChunks(xSize, ySize, chunkSize, te, ob){
        
        for(let i=0; i<xSize; i++){
            this.C[i] = [];
            for(let j=0; j<ySize; j++){
                this.C[i][j] = new chunk(chunkSize*i, chunkSize*j, chunkSize, chunkSize, i, j);
            }
        }


        if(te != null){
            for(let k=0; k<te.length; k++){
                const temp = te[k].box;
                const startChunk = this.C[0][0].absToIndex(temp.x+temp.width/2, temp.y+temp.height/2);
                this.C[startChunk[0]][startChunk[1]].te.push(te[k]);
            }
        }

        if(ob != null){
            for(let k=0; k<ob.length; k++){
                const temp = ob[k].box;
                console.log(temp);
                const startChunk = this.C[0][0].absToIndex(temp.x+temp.width/2, temp.y+temp.height/2);

                if(ob[k].trigger == 1){
                    ob[k].param = [startChunk[0], startChunk[1]];
                }
                this.C[startChunk[0]][startChunk[1]].ob.push(ob[k]);
            }
        }

    }



    loadChunks(Box){
        let load = [];
        const startChunk = this.C[0][0].absToIndex(Box.x, Box.y);
        const endChunk = this.C[0][0].absToIndex(Box.x+Box.width, Box.y+Box.height);
        for(i=startChunk[0]; i<endChunk[0]; i++){
            for(let j=0; j<this.C[0].length; j++){
                load.push(this.C[i][j]);
            }
        }
        return load;
    }

    cleanChunks(Box){
        const startChunk = this.C[0][0].absToIndex(Box.x, Box.y);
        const endChunk = this.C[0][0].absToIndex(Box.x+Box.width, Box.y+Box.height);
        for(let i=startChunk[0]; i<endChunk[0]; i++){
            for(let j=0; j<this.C[0].length; j++){
                for(let k= this.C[i][j].ob.length-1; k>=0; k--){
                    if(this.C[i][j].ob[k].trigger == -1){
                        //this.C[i][j].ob[k].ani = null;
                        //this.C[i][j].ob[k] = null;
                        this.C[i][j].ob.splice(k,1);
                    }
                }
            }
        }
    }
    
    loadTerrian(Box){
        let load = this.loadChunks(Box);
        this.te = [];
        for(let i=0; i<load.length; i++){
            this.te = this.te.concat(load[i].te);
        }
    }

    loadObjects(Box){
        this.cleanChunks(Box);
        const load = this.loadChunks(Box);
        this.ob = [];
        for(let i=0; i<load.length; i++){
            this.ob = this.ob.concat(load[i].ob);
        }
    }

    setCharacter(p){
        this.current = p;
    }

    pruneTerrain(Box){
        for(let i=this.te.length-1; i>=0; i--){
            if(!this.te[i].box.colliding(Box) || this.te[i].conds.length == 0){
                this.te.splice(i,1);
            }
        }

        
    }

    pruneObjects(Box){
        for(let i=this.ob.length-1; i>=0; i--){
            if(!this.ob[i].box.colliding(Box)){
                this.ob.splice(i,1);
            }
        }
    }

    angleDifference(angle1, angle2){ // for angles between -pi and pi
        let result = angle2 - angle1;
        if(result > 3.14159){
            result -= 6.28318;
        }else if(result < -3.14159){
            result += 6.28318;
        }
        return result;
    }
    distance(point1, point2){
        return Math.sqrt(Math.pow(point2[0]-point1[0], 2)+Math.pow(point2[1]-point1[1], 2));
    }

    /**
     * Pushes the current player using specified pusher against current Terrain
     * @param point
     */
    push(point){
        let currentPush = [];
        switch(point){
            case 0:
                currentPush = this.current_te.getCollisionData(this.current.leftCeilingPusher()); break;
            case 1:
                currentPush = this.current_te.getCollisionData(this.current.rightCeilingPusher()); break;
            case 2:
                currentPush = this.current_te.getCollisionData(this.current.leftUpWallPusher()); break;
            case 3:
                currentPush = this.current_te.getCollisionData(this.current.rightUpWallPusher()); break;
            case 4:
                currentPush = this.current_te.getCollisionData(this.current.leftDownWallPusher()); break;
            case 5:
                currentPush = this.current_te.getCollisionData(this.current.rightDownWallPusher()); break;
            case 6:
                currentPush = this.current_te.getCollisionData(this.current.leftFloorPusher()); break;
            case 7:
                currentPush = this.current_te.getCollisionData(this.current.rightFloorPusher()); break;
            case 8:
                currentPush = this.current_te.getCollisionData(this.current.leftTopPusher()); break;
            case 9:
                currentPush = this.current_te.getCollisionData(this.current.rightTopPusher()); break;
        }
        if(currentPush[3] >= 0){
            if(Math.abs(currentPush[0])>this.tolerance){
                this.current.incX(currentPush[0]);
            }
            if(Math.abs(currentPush[1])>this.tolerance){
                this.current.incY(currentPush[1]);
            }
            

        }
        return currentPush;
    }

    RUN_CHARACTER_OBJECT(p){
        this.setCharacter(p);
        this.cleanChunks(this.current.box);
        this.loadObjects(this.current.tbox); // Box may have to be larger
        this.pruneObjects(this.current.hitBox);
        for(i of this.ob){
            if(i.trigger == 10 && this.current.Vy>=-0.1 && this.current.height == 80){
                this.current.Vy = -this.current.Vy - 60;
                this.current.ringCount += 10;
                i.isTriggered = true;
                sound_monitor.play();
            }else if(i.trigger == 1){
                i.isTriggered = true;
                this.current.ringCount++;
                sound_ring.play();
            }
        }
    }

    RUN_TERRAIN_OBJECT(p){ //TODO not even used
        this.setCharacter(p);
        this.loadObjects(this.current.tbox); // Box may have to be larger
        this.pruneObjects(this.current.box);


        while(this.te.length != 0){
            this.current_ob = this.ob[0];
            this.ob.shift();
            if(this.current_ob.trigger <100){
                this.current_ob.isTriggered = true;
                if(this.current_ob.trigger == 1 && !this.current_ob.isTriggered){
                    this.current.ringCount ++;
                }
                if(this.current_ob.trigger == 10 && !this.current_ob.isTriggered){
                    this.current.ringCount += 10;
                    this.current.Vy = -this.current.Vy - 3;
                }
            }
        }
    }

    RUN_CHARACTER_TERRAIN(p){ // may need some tweaking for the NPC's because it was designed for the player
        /*
         * This method needs a complete rework for the new angle engine
         * preconditions: before display, new x and y values, new angles
         * set, load, prune
         * push to new location using pusher
         * now the things that still needed to be updated:
         *      the player's angle needs to change and speed
         *      air or ground
         * now change the speed based on gravity and player speed
         */
        // preconditions
        // player's x and y has been incremented
        //the player may be colliding with current Terrain
        // player is in the air or on the ground
        // if air push all pushers except top pushers
            // if any pushers push it is an inelastic (momentum losing) collision
            // vx and vy are updated accordingly
            // gravity is applied (Vy change)
            // angle is incremented towards 0
            // if pusher pushes and angle is non vertical and non ceiling, mode is set to ground
                // ground protocol is then run again?
        // if ground 
            // velocity magnitude is changed based on angle
            // should Vy be incremented directly?
            // check ground sensors to determine which base to use
            // ceiling, then ground pushers
            // then push top pushers and bottom wall pushers
            // wall and ceiling pushers are inelastic (velocity changing)
            // if angle difference is too large mode = air and increment by max amount
                  //else update the angle to match the current cond
            // if vertical or ceiling angle, player must be a certain speed or else mode = air
                // player will be locked in air mode for a few frames (pending)
        // postconditions
        // the player is no longer colliding
        // angle has been adjusted, vx, vy, x, y.

        this.setCharacter(p);
        this.loadTerrian(this.current.tbox); // Box may have to be larger
        this.pruneTerrain(this.current.box);
        
        this.current.incY(this.current.Vy);

        if(Math.abs(this.current.Vx)>this.tolerance){
            this.current.incX(this.current.Vx);
        }

        // this ensures the angle is from -pi to pi
        this.current.angle %= 6.283185;
        if(this.current.angle>3.141592){
            this.current.angle-=6.283185;
        }

        if(this.current.height == 140 && this.current.getSpeed()>35){ // a bit of advantage to ball state
            this.current.setSpeed(this.current.getSpeed()-0.3);
        }
        if(this.current.getSpeed()>55){
            this.current.setSpeed(this.current.getSpeed()-0.24);
        }
        if(this.current.getSpeed()>100){
            this.current.setSpeed(100);
        }

        let pushDat = null;
        if(this.current.physics == 0){
            if(this.current.Vy<45){
                this.current.Vy += this.current.gravity; // HARD CODED GRAVITY CONSTANT
            }
            if(this.current.angle > 0.1){
                this.current.angle-=0.05;
            }else if(this.current.angle < -0.1){
                this.current.angle+=0.05;
            }else{
                this.current.angle = 0;
            }
            while(this.te.length != 0){
                this.current_te = this.te[0];
                this.te.shift();
                if(this.current_te.type == 't' && (this.current.Vy<0 || this.current_te.isColliding(this.current.point[4]) || this.current_te.isColliding(this.current.point[5]))){
                    continue;
                }
                for(i=0; i<8; i++){
                    pushDat = this.push(i);
                    if(pushDat[3]>=0){
                        if(this.current_te.type == 't' &&  i<6){
                            continue;
                        }
                        const diff = Math.cos(this.angleDifference(this.current.getDirection(), pushDat[2]));
                        this.current.setDirectionAbs(pushDat[2]);
                        this.current.multSpeed(diff);
                        if((pushDat[2]<1.3 && pushDat[2]>-1.3)){
                            this.current.incY(1.5);
                            this.current.point[this.current.base][0] = this.current.point[i][0];
                            this.current.point[this.current.base][1] = this.current.point[i][1];
                            this.current.angle = pushDat[2];
                            this.current.physics = 1;
                            this.current.width = 70;
                            this.current.height = 140;
                            this.current.updateHitbox();
                            this.te = []; // this will break out of the outer loop
                            break;
                        }
    
                    }
                }

                const left = this.current_te.isColliding(this.current.leftGroundPusher()) && !this.current_te.isColliding(this.current.point[6]);
                const right = this.current_te.isColliding(this.current.rightGroundPusher()) && !this.current_te.isColliding(this.current.point[7]);

                if(left || right){
                    this.current.physics = 1;
                    if(left && right){
                        if(this.current.Vx>1 && this.current.base == 6){
                            current.base = 7;
                        }else if(this.current.Vx<-1 && this.current.base == 7){
                            this.current.base = 7;
                        }
                    }else if(left){
                        this.current.base = 7;
                    }else{
                        this.current.base = 7;
                    }
                }
            }


        }else if(this.current.physics == 1){
            this.current.numJumps = 1;
            if(this.current.lockControl>0){
                this.current.lockControl--;
                this.current.Vy+=0.2;
            }
            if(this.current.height == 80){
                this.current.setSpeed(this.current.getSpeed()-0.062);
            }
            if(this.current.getSpeed()>0.08){
                this.current.setSpeed(this.current.getSpeed()*0.994);
                this.current.setSpeed(this.current.getSpeed()-0.20); // HARD CODED FRICTION CONSTANT
            }else{
                
                this.current.setDirectionAbs(this.current.angle);
                if(this.current.isForwardsVar){
                    this.current.setSpeed(0.01);
                }else{
                    this.current.setSpeed(-0.01);
                }
            }
            if(Math.abs(this.current.angle)>0.2){ // this is where gravity is applied
                this.current.incSpeed(this.current.gravity*0.35*Math.sin(this.current.angle), this.current.angle);

                
                if(Math.abs(this.current.angle)>0.7 && this.current.getSpeed()<6 || Math.abs(this.current.angle)>1.5){
                    if(this.current.lockControl<=0){
                        this.current.lockControl--;
                        if(this.current.lockControl<-30){
                            this.current.lockControl = 30;
                            this.current.physics = 0;
                        }
                    }
                }
            }

            let air = true;
            while(this.te.length != 0){
                this.current_te = this.te[0];
                this.te.shift();
                const left = this.current_te.isColliding(this.current.leftGroundPusher());
                const right = this.current_te.isColliding(this.current.rightGroundPusher());
                if(left || right){
                    air = false;
                    this.current.physics = 1;
                    if(this.current.isForwardsVar){
                        this.current.base = 7;
                    }else{
                        this.current.base = 6;
                    }
                }else if(air){
                    this.current.physics = 0;
                }
                for(i=0; i<4; i++){ // pushing everything else
                    pushDat = this.push(i);
                    if(pushDat[3]>=0){ // hitting wall inelastic collision
                        const diff = Math.sin(this.angleDifference(this.current.getDirection(), pushDat[2]));
                        this.current.incSpeed(diff*this.current.getSpeed(), pushDat[2]+1.57079);
                        this.current.updateHitbox();
                    }
                }
                this.push(this.current.base-2);
                if(pushDat[3]>=0){ // hitting wall inelastic collision
                    const diff = Math.sin(this.angleDifference(this.current.getDirection(), pushDat[2]));
                    this.current.incSpeed(diff*this.current.getSpeed(), pushDat[2]+1.57079);
                    this.current.updateHitbox();
                }
                this.push(this.current.base);
                this.push(8); this.push(9);
                pushDat = this.current_te.getCollisionData(this.current.groundAngle());
                if(pushDat[3]>=0){
                    const diff = this.angleDifference(pushDat[2], this.current.angle);
                    if(Math.abs(diff)<0.5){ // HARD CODED VALUE WARNING ---- what does this even accomplish? oh it's the sticky thing
                        this.standingOn = this.current_te;
                        //TODO create a seperate type int for inequalities. sticky, normal, and non-stickS
                        //this.current.angle = current.angle + (pushDat[2]-current.angle);


                        if(this.current_te.conds[pushDat[3]].type==4){
                            this.current.angle = this.current.angle + (pushDat[2]-this.current.angle)/2;
                        }else{
                            if(Math.abs(diff)>0.2){
                                this.current.angle = this.current.angle + (pushDat[2]-this.current.angle)/2;
                            }else{
                                if(this.current.getSpeed()>6){
                                    this.current.angle = this.current.angle + (pushDat[2]-this.current.angle)/5;
                                }else{
                                    this.current.angle = this.current.angle + (pushDat[2]-this.current.angle)/9;
                                }
                            }
                        }

                        if(diff>0.1 && this.current.Vx<0 || diff<-0.1 && this.current.Vx>0){
                            this.current.incY(diff*this.current_te.stickFactor*16);
                            this.current.angle = this.current.angle + (pushDat[2]-this.current.angle)/2;
                        }
                        if(this.current.isForwards()){ // such yummy spaghetti
                            this.current.base = 7;
                        }else{
                            this.current.base = 6;
                        }

                        this.current.setDirection(pushDat[2]);
                    }else{
                        if(this.current_te.isColliding(this.current.point[15]) || this.current_te.isColliding(this.current.point[14]))
                        this.current.physics = 0;
                    }
                }
            }

        }



        this.current.updateHitbox();
        return this.current;
    }

    addPlayer(p){
        const temp = p.Box;
        const startChunk = this.C[0][0].absToIndex(temp.x, temp.y);
        this.C[startChunk[0]][startChunk[1]].pl.push(p);
    }
    addTerrain(t){
        const temp = t.getBox();
        const startChunk = C[0][0].absToIndex(temp.x, temp.y);
        this.C[startChunk[0]][startChunk[1]].te.push(t);
    }

    REASSIGN_CHARACTER(){
        const temp = this.current.Box;
        const startChunk = this.C[0][0].absToIndex(temp.x, temp.y);
        this.C[startChunk[0]][startChunk[1]].pl.push(current);
    }
}
