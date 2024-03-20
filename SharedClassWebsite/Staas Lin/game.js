//general idea
/* Arrow keys => movement
Selection bonuses from level up=> 1, 2, 3
survive 10 minutes to win
*/
//sprites from Nauris Amatnieks on itch.io
//music - boss time by david renda on fesliyan studios

Array.prototype.sample = function(){ //little function from stackoverflow
    return this[Math.floor(Math.random()*this.length)];
  }

class Sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.sound.loop = true;
    }

    play() {
        this.sound.currentTime = 0; //reset sound for overlapping sounds
        this.sound.play();
    }

    stop() {
        this.sound.pause();
    }
}

const gameArea = {
    canvas: document.createElement("canvas"),

    start: function () {
        this.canvas.width = 900;
        this.canvas.height = 650;
        this.canvas.style.backgroundColor = "gray";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.getElementById("clockCanvas"));
        document.body.insertBefore(document.createElement("br"), document.getElementById("clockCanvas"));

        //event listeners - key/mouse listeners
        window.addEventListener('keydown', function (e) {
            if (e.code === "KeyP") {
                if (!paused) pause();
                else unpause();
                return;
            }


            if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Space"].includes(e.code))
                e.preventDefault(); //prevents arrow keys from scrolling

            //record the key the user pressed
            gameArea.keys = (gameArea.keys || {});
            gameArea.keys[e.code] = true;
        });

        window.addEventListener('keyup', function (e) {
            if (gameArea.keys)
                gameArea.keys[e.code] = false;
        });

        //mouse events
        window.addEventListener('mousemove', function (e) {
            gameArea.mouseX = e.pageX - gameArea.canvas.offsetLeft;
            gameArea.mouseY = e.pageY - gameArea.canvas.offsetTop;
        });

        window.addEventListener('mousedown', function (e) {
            if (!isPaused)
                start();
        });

        //touch/tap events
        window.addEventListener('touchmove', function (e) {
            gameArea.touchX = e.touches[0].screenX;
            gameArea.touchY = e.touches[0].screenY;
        });
        this.context.textAlign = "center";
        this.context.font = "26px verdana, sans-serif";
        this.context.fillText("Click, then Tap the Right Arrow (->) To Begin", this.canvas.width/2.0, this.canvas.height/2.0);
    },

    update: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const pat = this.context.createPattern(backgroundimg, 'repeat');
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = pat;
        this.context.fill();
        
        if (gameArea.keys &&( gameArea.keys["ArrowRight"] || gameArea.keys["KeyD"]) && rpress==false){
            rpress=true;
            player1.rightPress();
        }else if(!( gameArea.keys["ArrowRight"] || gameArea.keys["KeyD"]) && rpress){
            rpress=false;
            
            player1.leftPress(); //stopped being pressed
        }
        if (gameArea.keys && ( gameArea.keys["ArrowLeft"] || gameArea.keys["KeyA"]) && lpress == false){
            lpress=true;
            player1.leftPress();
        }else if(!( gameArea.keys["ArrowLeft"] || gameArea.keys["KeyA"]) && lpress){
            lpress=false;
            player1.rightPress();
        }
        if (gameArea.keys && ( gameArea.keys["ArrowUp"] || gameArea.keys["KeyW"])&& upress == false){
            upress=true;
            player1.upPress();
        }else if(!( gameArea.keys["ArrowUp"] || gameArea.keys["KeyW"]) && upress){
            upress=false;
            player1.downPress();
        }
        if (gameArea.keys && ( gameArea.keys["ArrowDown"] || gameArea.keys["KeyS"])&& dpress == false){
            dpress=true;
            player1.downPress();
        }else if(!( gameArea.keys["ArrowDown"] || gameArea.keys["KeyS"]) && dpress){
            dpress=false;
            player1.upPress();
        }
        
    },

    //add 2 pipes to the end of canvas
    

    reset: function () {
        clearInterval(gameInterval);
    },



}
const game = {
    start: function(){
        this.enemyFrameInterval = 30;
        this.enemyn = 1;
        this.foodFrameInterval = 30;
        this.foodn = 1;
    },
    generateEnemies: function(n){
        
        for (let i = 0; i<n; i++){
            let spawnside = [0,1,2,3].sample(); //L, R, T, B
            let x = 0;
            let y = 0;
            let enemytype = Math.random();
            if(spawnside==0){
                x = 0;
                y = Math.random()*gameArea.canvas.height;
            }
            else if(spawnside==1){
                x = gameArea.canvas.width
                y = Math.random()*gameArea.canvas.height
            }
            else if(spawnside==2){
                x = Math.random()*gameArea.canvas.width;
                y = 0;
            }
            else{
                x = Math.random()*gameArea.canvas.width;
                y = gameArea.canvas.height;
            }
            let bonus_atk = Math.random()*enemy_strength;
            let bonus_hp = Math.random()*enemy_strength;
            let bonus_spd = Math.random()*enemy_strength/100;
            if(enemytype>= 0.99){
                enemies.push(enemytype5(x,y,enemyrad, enemyh, bonus_hp, bonus_atk, bonus_spd))
            }
            else if(enemytype>=0.95){
                enemies.push(enemytype4(x,y,enemyrad, enemyh, bonus_hp, bonus_atk, bonus_spd))
            }else if(enemytype>=.8){
                enemies.push(enemytype1(x,y,enemyrad, enemyh, bonus_hp, bonus_atk, bonus_spd))
            }else if(enemytype>=.45){
                enemies.push(enemytype2(x,y,enemyrad, enemyh,  bonus_hp, bonus_atk, bonus_spd))
            }else{
                enemies.push(enemytype3(x,y,enemyrad, enemyh,  bonus_hp, bonus_atk, bonus_spd))
            }
        }
    },
    generateFood: function(n){
        for(let i =0; i<n; i++){
            foods.push(new food(Math.random()*gameArea.canvas.width, Math.random()*gameArea.canvas.height, foodrad, foodrad,Math.ceil(Math.random()*.5) * (Math.round(Math.random()) ? 1 : -1), Math.ceil(Math.random()*.5) * (Math.round(Math.random()) ? 1 : -1)));
        }
    },
    reset: function(){
        bgmusic.play();
        enemies.length=0;
        foods.length = 0;
        timer = 0;
        player1 = new player(gameArea.canvas.width/2.0, gameArea.canvas.height/2.0, playerrad, playerh, 0, 0,100,[], "image");
        rpress=false;
        lpress=false;
        upress=false;
        dpress=false;
        enemy_strength=0;
        gameInterval = 0, isPaused = false, timer = 0; isLevel = false;


        
    },
    update :function(){
        if(this.enemyFrameInterval == 30 && timer>60*60*2){
            this.enemyFrameInterval = 25;
        }else if(this.enemyFrameInterval == 25 && timer>60*60*5){
            this.enemyFrameInterval = 15;
        }else if(this.enemyFrameInterval == 15 && timer > 60*60*7){
            this.enemyFrameInterval = 13;
        }else if(this.enemyFrameInterval != 13 && timer > 60*60*9){
            this.enemyFrameInterval = 10;
        }
        if(timer >= 60*60*10){
            end();
        }
        
        if (timer%this.enemyFrameInterval == 0)
            this.generateEnemies(this.enemyn);
        if (timer%this.foodFrameInterval==0)
            this.generateFood(this.foodn);
        if(timer%1800==0){
            enemy_strength+=1;
        }
        let totalseconds = Math.floor(timer/60);
        let minutes = Math.floor(totalseconds/60);
        let seconds = totalseconds%60;
        if (seconds<10){
            seconds = "0"+seconds;
        }
        if(minutes<10){
            minutes = "0"+minutes;
        }
        gameArea.context.fillStyle = "white";
        gameArea.context.font = "26px verdana, sans-serif"
        gameArea.context.fillText(minutes.toString()+":"+seconds.toString(),gameArea.canvas.width/2.0, 100);
        
    }
}
function food(x,y,w,h, vx,vy){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = vx;
    this.vy = vy;
    this.base_xvel = this.vx;
    this.base_yvel = this.vy;
    this.color = "green";
    this.xp = 10;


    this.update = function(){
        this.x += this.vx; 
        this.y += this.vy;
        this.ctx = gameArea.context;
        drawCircle(this.ctx, this.x, this.y, this.w, this.color,false);
    }

    
}

function enemy(x,y,w,h,vx,vy, hp=20, type="circle", img_y){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = vx;
    this.vy = vy;
    this.type = type;
    if(this.type == "image"){
        this.type = new Image();
    }
    this.last_facing = 1;
    this.hurt_time = -99;
    this.move_frame = 0;
    this.hurt_frame = 0;
    this.idle_frame = 0;
    this.frame_change = 5;
    this.base_xvel = 1;
    this.base_yvel = 1;
    this.imgy = img_y;
    this.color = "yellow";
    this.hp = hp;
    this.hp_max = hp;
    this.hp_buffer = 20;
    this.xp = 30;
    this.attack = 5;
    this.behavior = "attack";
    this.is_bouncing = false;
    this.time_bounce = -99;

    this.update = function(){
        this.x += this.vx;
        this.y +=this.vy;
        this.ctx = gameArea.context;
        if(this.is_hurt && timer-this.hurt_time > 10){
            this.is_hurt = false;
        }
        if(this.last_facing > 0 && this.vx <0){
            this.last_facing = -1;
        }else if(this.last_facing <0 && this.vx >0){
            this.last_facing = 1;
        }
        if(this.type == "circle"){
            drawCircle(this.ctx, this.x,this.y,this.w,this.color, false);
        }else{
            if(!this.is_hurt){
                if(this.vx !=0){
                    if(this.last_facing>0){
                        this.ctx.drawImage(moveR,gridmoveR(this.move_frame, this.imgy)[0],gridmoveR(this.move_frame, this.imgy)[1],spr_size,spr_height,this.x-this.w, this.y-this.h,this.w*2,this.h*2 );
                    }else {
                        this.ctx.drawImage(moveL,gridmoveL(this.move_frame, this.imgy)[0],gridmoveL(this.move_frame, this.imgy)[1],spr_size,spr_height,this.x-this.w, this.y-this.h,this.w*2,this.h*2 );
                    }
                    if(timer%this.frame_change==0){
                        this.move_frame+=1;
                        if(this.move_frame > move_frames-1){
                            this.move_frame = 0;
                        }
                    }
                }else{
                    if(this.last_facing>0){
                        this.ctx.drawImage(idleR,grididleR(this.idle_frame, this.imgy)[0],grididleR(this.idle_frame, this.imgy)[1],spr_size,spr_height,this.x-this.w, this.y-this.h,this.w*2,this.h*2 );
                    }else {
                        this.ctx.drawImage(idleL,grididleL(this.idle_frame, this.imgy)[0],grididleL(this.idle_frame, this.imgy)[1],spr_size,spr_height,this.x-this.w, this.y-this.h,this.w*2,this.h*2 );
                    }
                    if(timer%this.frame_change==0){

                        this.idle_frame+=1;

                        if(this.idle_frame > idle_frames-1){
                            this.idle_frame = 0;
                        }
                    }
                }
            }else{
                if(this.last_facing>0){
                    this.ctx.drawImage(hurtR,gridhurtR(this.hurt_frame, this.imgy)[0],gridhurtR(this.hurt_frame, this.imgy)[1],spr_size,spr_height,this.x-this.w, this.y-this.h,this.w*2,this.h*2 );
                }else {
                    this.ctx.drawImage(hurtL,gridhurtL(this.hurt_frame, this.imgy)[0],gridhurtL(this.hurt_frame , this.imgy)[1],spr_size,spr_height,this.x-this.w, this.y-this.h,this.w*2,this.h*2 );
                }
                if(timer%this.frame_change==0){

                    this.hurt_frame+=1;
                    if(this.hurt_frame > hit_frames-1){
                        this.hurt_frame = 0;
                    }
                }
            }
        }
        
        this.ctx.fillText(this.hp.toString(),this.x, this.y-this.hp_buffers);
        if(this.is_bouncing && timer-this.time_bounce>=30){
            this.redirect(player1);
            this.is_bouncing = false;
        }else if(!this.is_bouncing){
            this.redirect(player1);
        }

    }

    this.redirect = function(target){
        let x_displace = target.x-this.x;
        let y_displace = target.y - this.y;
        let total_factor = Math.abs(x_displace)+Math.abs(y_displace);
        let x_p = x_displace/total_factor;
        let y_p = y_displace/total_factor;
        if(this.behavior=="attack"){
            this.vx = x_p*this.base_xvel;
            this.vy = y_p*this.base_yvel;   
        }else{
            this.vx = -1*x_p*this.base_xvel;
            this.vy = -1*y_p*this.base_yvel;
        }
    }
    this.bounce = function(other){
        pass;
    }
    this.hurt = function(other){
        this.is_hurt = true;
        this.hp += -1*other.attack;
        this.hurt_time = timer;
    }
    this.collision = function(other){ // inspired by github example online, physics a bit janky
        let angle1 = Math.atan2(this.vx, this.vy);
        let angle2 = Math.atan2(other.vx, other.vy);
        let phi = Math.atan2(other.y- this.y, other.x-this.x);
        // let m1 = this.hp;
        // let m2 = other.hp;
        let m1 = 1000;
        let m2 = 1000;
        let v1 = Math.sqrt(Math.pow(this.vx,2)+Math.pow(this.vy, 2));
        let v2 = Math.sqrt(Math.pow(other.vx, 2) + Math.pow(other.vy, 2));

        // this.vx = (v1 * Math.cos(angle1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(angle2 - phi)) / (m1+m2) * Math.cos(phi) + v1*Math.sin(angle1-phi) * Math.cos(phi+Math.PI/2);
        // this.vy = (v1 * Math.cos(angle1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(angle2 - phi)) / (m1+m2) * Math.sin(phi) + v1*Math.sin(angle1-phi) * Math.sin(phi+Math.PI/2);
        // other.vx = (v2 * Math.cos(angle2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(angle1 - phi)) / (m1+m2) * Math.cos(phi) + v2*Math.sin(angle2-phi) * Math.cos(phi+Math.PI/2);
        // other.vy = (v2 * Math.cos(angle2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(angle1 - phi)) / (m1+m2) * Math.sin(phi) + v2*Math.sin(angle2-phi) * Math.sin(phi+Math.PI/2);
        
        this.vx = (v1 * Math.cos(angle1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(angle2 - phi)) / (m1+m2) * Math.cos(phi) + v1*Math.sin(angle1-phi) * Math.cos(phi+Math.PI/2);
        this.vy = (v1 * Math.cos(angle1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(angle2 - phi)) / (m1+m2) * Math.sin(phi) + v1*Math.sin(angle1-phi) * Math.sin(phi+Math.PI/2);
        other.vx = (v2 * Math.cos(angle2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(angle1 - phi)) / (m1+m2) * Math.cos(phi) + v2*Math.sin(angle2-phi) * Math.cos(phi+Math.PI/2);
        other.vy = (v2 * Math.cos(angle2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(angle1 - phi)) / (m1+m2) * Math.sin(phi) + v2*Math.sin(angle2-phi) * Math.sin(phi+Math.PI/2);
        
        this.is_bouncing =true;
        this.time_bounce = timer;
        other.is_bouncing=true;
        other.time_bounce = timer;
        other.is_immune = true;
        other.time_immune = timer;
    }   

}
function player(x, y, w, h, vx, vy, hp=100, buffs, type = "circle"){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = vx;
    this.vy = vy;
    this.base_xvel = 2;
    this.base_yvel = 2;
    this.type = type;
    if(this.type == "image"){
        this.type = new Image();
    }
    this.color = "blue";
    this.hp = hp;
    this.hp_max = hp;
    this.hp_buffer = 0;
    this.healing = 0.1;
    this.attack = 50;
    this.last_facing = 1;//-1 for left,+1 for right, initially facing right
    this.move_frame = 0;
    this.idle_frame = 0;
    this.hurt_frame = 0;
    this.frame_change = 5;
    this.is_hurt = false;
    this.time_to_heal = 10;
    this.time_hurt = -99;
    this.xp = 0; // 3 levels
    this.xp_max = 60;
    this.level = 0;
    this.xp_bonus = 0;
    this.is_bouncing = false
    this.time_bounce = -99;
    this.is_immune = false;
    this.time_immune = -99;
    this.immune_t = 8;
    this.buffs = [];
    this.options =
     ["Speed+", "Health Max+", "Attack+", "XP from kills+", "Passive Heal+", "Restore Health", "Immunity Dura+"];
    this.lvlchoice = [];
    
    this.update = function(){
        this.x += this.vx;
        this.y +=this.vy;
        this.ctx = gameArea.context;
        this.color = "blue";

        if(this.last_facing!= 1 && this.vx>0){
            this.last_facing = 1;
        }else if(this.last_facing != -1 && this.vx<0){
            this.last_facing = -1;
        }

        if(this.hp<this.hp_max - this.healing){
            this.hp+=this.healing;
        }
        if(this.xp >= this.xp_max){
            this.levelup();
        }
        if(this.buffs.length>0){ // numbers need balancing
            for(let i = this.buffs.length-1; i>=0;i--){
                b = this.buffs[i];
                if(b=="Speed+"){
                    this.base_xvel += 0.5;
                    this.base_yvel+=0.5;
                }else if(b=="Health Max+"){
                    this.hp_max+=20;
                }else if(b=="Attack+"){
                    this.attack+=25;
                }else if(b=="XP from kills+"){
                    this.xp_bonus += 10;
                }else if(b=="Passive Heal+"){
                    this.healing += 0.06;
                }else if(b=="Restore Health"){
                    this.hp =this.hp_max;
                }else if(b=="Immunity Dura+"){
                    this.immune_t+=0.5;
                }
                else{
                }
                this.buffs.splice(i,1);
            }
        }
        if(this.is_hurt){
            if(timer-this.time_hurt>this.time_to_heal){
                this.is_hurt = false;
                this.color = "blue";
            }
            else
                this.color = "red";
        }
        if(this.is_bouncing && timer-this.time_bounce>20){
            this.is_bouncing=false;
            this.vx = 0;
            this.vy = 0;
            rpress = false; 
            upress = false;
            dpress = false; 
            lpress =false;
        }
        if(this.is_immune && timer-this.time_immune > this.immune_t){
            this.is_immune=false;
        }else if(this.is_immune){
            this.color = "DeepSkyBlue";
        }
        if(this.type == "circle"){
            drawCircle(this.ctx, this.x,this.y,this.w,this.color,false);
            // this.ctx.fillText(this.hp.toString(),this.x, this.y+this.w+this.hp_buffer);
        }else{
            if(!this.is_hurt){
                if(this.vx !=0){
                    if(this.last_facing>0){
                        this.ctx.drawImage(moveR,gridmoveR(this.move_frame, player_y)[0],gridmoveR(this.move_frame, player_y)[1],spr_size,spr_height,this.x-this.w, this.y-this.h,this.w*2,this.h*2 );
                    }else {
                        this.ctx.drawImage(moveL,gridmoveL(this.move_frame, player_y)[0],gridmoveL(this.move_frame, player_y)[1],spr_size,spr_height,this.x-this.w, this.y-this.h,this.w*2,this.h*2 );
                    }
                    if(timer%this.frame_change==0){
                        this.move_frame+=1;
                        if(this.move_frame > move_frames-1){
                            this.move_frame = 0;
                        }
                    }
                }else{
                    if(this.last_facing>0){
                        this.ctx.drawImage(idleR,grididleR(this.idle_frame, player_y)[0],grididleR(this.idle_frame, player_y)[1],spr_size,spr_height,this.x-this.w, this.y-this.h,this.w*2,this.h*2 );
                    }else {
                        this.ctx.drawImage(idleL,grididleL(this.idle_frame, player_y)[0],grididleL(this.idle_frame, player_y)[1],spr_size,spr_height,this.x-this.w, this.y-this.h,this.w*2,this.h*2 );
                    }
                    if(timer%this.frame_change==0){

                        this.idle_frame+=1;

                        if(this.idle_frame > idle_frames-1){
                            this.idle_frame = 0;
                        }
                    }
                }
            }else{
                if(this.last_facing>0){
                    this.ctx.drawImage(hurtR,gridhurtR(this.hurt_frame, player_y)[0],gridhurtR(this.hurt_frame, player_y)[1],spr_size,spr_height,this.x-this.w, this.y-this.h,this.w*2,this.h*2 );
                }else {
                    this.ctx.drawImage(hurtL,gridhurtL(this.hurt_frame, player_y)[0],gridhurtL(this.hurt_frame , player_y)[1],spr_size,spr_height,this.x-this.w, this.y-this.h,this.w*2,this.h*2 );
                }
                if(timer%this.frame_change==0){

                    this.hurt_frame+=1;
                    if(this.hurt_frame > hit_frames-1){
                        this.hurt_frame = 0;
                    }
                }
            }
        }
        this.ctx.fillStyle = "grey";
        this.ctx.fillRect(0, gameArea.canvas.height-20, gameArea.canvas.width, 20);
        this.ctx.fillRect(this.x-this.w, this.y+this.w+this.hp_buffer, this.w*2, 5);
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(0, gameArea.canvas.height-20, (this.xp/this.xp_max)*gameArea.canvas.width, 20);
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(this.x-this.w, this.y+this.w+this.hp_buffer, (this.hp/this.hp_max)*this.w*2, 5);
        // if(rpress){
        //     this.vx=this.base_xvel;
        // }
        // if(lpress){
        //     this.vx = -1*this.base_xvel;
        // }
        // if(upress){
        //     this.vy = -1*this.base_yvel;
        // }
        // if(dpress){
        //     this.vy = this.base_yvel;
        // }
    }
    this.levelup = function(){
        this.xp = this.xp-this.xp_max;
        this.xp_max += 15;
        if(this.level>5){
            this.xp_max += 25;
        }
        if(this.level>10){
            this.xp_max+=35;
        }
        if(this.level>15){
            this.xp_max += 40;
        }
        if(this.level>20){
            this.xp_max +=45;
        } //cumulative stacking of xp needed to lvl
        this.level +=1;
        rpress=false;
        lpress=false;
        upress=false;
        dpress=false;
        this.vx=0;
        this.vy=0;

        //level up screen
        this.lvlchoice = getRandom(this.options, 3);

        levelscreen(this.lvlchoice);
        

    }
    this.collision = function(other){
        let max = this.w+other.w;

        let buffer = 18;
        let distance = Math.sqrt(Math.pow(this.x-other.x, 2)+Math.pow(this.y-other.y,2));

        if (distance <= max - buffer)
            return true
        else
            return false
    
    }
    this.bounce = function(other){
        pass; //bounce 
    }
    this.hurt = function(other){
        if(!this.is_immune){
            this.hp += -1*other.attack;
            //flash red
            this.is_hurt = true;
            this.time_hurt = timer;
        }
    }
    this.kill = function(other){
        this.xp += other.xp+this.xp_bonus;
    }
    this.leftPress = function(){
        if(!this.is_bouncing)
            this.vx -= this.base_xvel;
    }
    this.rightPress = function(){
        if(!this.is_bouncing)
            this.vx += this.base_xvel;
    }
    this.upPress = function(){
        if(!this.is_bouncing)
            this.vy -= this.base_yvel;
    }
    this.downPress = function(){
        if(!this.is_bouncing)
            this.vy += this.base_yvel;
    }
    
}
function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) { //obtained from stackoverflow
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  }
  function getRandom(arr, n) { //stackoverflow (rng elements from array)
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function enemytype1(x,y,w,h, hp_bonus, atk_bonus, speed_bonus){ //speedy tiny dude med attack
    let e = new enemy(x,y,w,h,1.5,1.5,75+hp_bonus, "image",3);
    e.base_xvel=1.5+speed_bonus;
    e.base_yvel=1.5+speed_bonus;
    e.attack = 10+atk_bonus;
    e.color = "purple";
    
    return e;
}
function enemytype2(x,y,w,h, hp_bonus, atk_bonus, speed_bonus){ // sluggish giga bro meh attack
    let e = new enemy(x,y,w,h,0.25,0.25, 300+hp_bonus, "image", 5);
    e.base_xvel=0.25+speed_bonus;
    e.base_yvel=0.25+speed_bonus;
    e.attack = e.attack+atk_bonus;
    e.color = "red";
    return e;
}
function enemytype3(x,y,w,h, hp_bonus, atk_bonus, speed_bonus){ //mid guy stronk attack
    let e = new enemy(x,y,w,h,0.5,0.5, 200+hp_bonus, "image", 1);
    e.base_xvel=0.5+speed_bonus;
    e.base_yvel=0.5+speed_bonus;
    e.attack = 15+atk_bonus;
    e.color = "yellow";
    return e;
}
function enemytype4(x,y,w,h,hp_bonus,atk_bonus,speed_bonus){ //heavy boss
    let e = new enemy(x,y,w,h,0.5,0.5, 1000+hp_bonus, "image", 2);
    e.base_xvel=0.5+speed_bonus;
    e.base_yvel=0.5+speed_bonus;
    e.attack = 1+atk_bonus;
    e.color = "orange";
    e.xp = 80;

    return e;

}
function enemytype5(x,y,w,h,hp_bonus,atk_bonus,speed_bonus){ 
    let e = new enemy(x,y,w,h,3.5,3.5, 1+hp_bonus, "image", 4);
    e.base_xvel=3.5+speed_bonus;
    e.base_yvel=3.5+speed_bonus;
    e.attack = 1+atk_bonus;
    e.color = "lime";
    e.xp = 200;
    e.behavior = "escape";
    return e;
}

function start() {
    game.reset();
    gameArea.reset();
    gameInterval = setInterval(update, 1000/FPS);
    gameArea.canvas.style.backgroundColor="black";
    game.start();

}
function end() {
    let end_text = "";
    if (timer<10*60*60) //player lost
        end_text = "Unfortunately you missed the 10 minute mark!";
    else{
        end_text = "Congrats, You Survived!";
    }
    clearInterval(gameInterval);

    let ctx = gameArea.context;
    let marginX = 50, marginY = 50;
    let menuWidth = gameArea.canvas.width - 2 * marginX;
    let menuHeight = gameArea.canvas.height - 2 * marginY;
    ctx.fillStyle = 'gray';
    ctx.globalAlpha = 0.5; //transparent menu
    ctx.fillRect(marginX, marginY, menuWidth, menuHeight);
    ctx.font = "25px consolas";
    ctx.fillStyle = 'white';
    ctx.globalAlpha = 1.0;
    let totalseconds = Math.floor(timer/60);
    let minutes = Math.floor(totalseconds/60);
    let seconds = totalseconds%60;
    if (seconds<10){
        seconds = "0"+seconds;
    }
    if(minutes<10){
        minutes = "0"+minutes;
    }
    ctx.fillText("You Survived for: "+minutes+":"+seconds+"!", menuWidth/2 +marginX, menuHeight/2 -marginY-50);
    ctx.fillText(end_text, menuWidth / 2+marginX, menuHeight / 2-marginY);
    ctx.fillText("Click to Play Again!", menuWidth/2 + marginX, menuHeight/2 - marginY+30);


}

function levelscreen(items){
    clearInterval(gameInterval);
    lvlInterval = setInterval(lvlupdate, 1000/FPS);
    isLevel = true;

    let ctx = gameArea.context;
    let marginX = 50, marginY = 50;
    let menuWidth = gameArea.canvas.width - 2 * marginX;
    let menuHeight = gameArea.canvas.height - 2 * marginY;
    ctx.fillStyle = 'gray';
    ctx.globalAlpha = 0.5; //transparent menu
    ctx.fillRect(marginX, marginY, menuWidth, menuHeight);
    ctx.font = "25px consolas";
    ctx.fillStyle = 'white';
    ctx.globalAlpha = 1.0;
    ctx.fillText("Type a number (1, 2, 3)", menuWidth / 2+marginX, menuHeight / 2-marginY);


    //draw buttons
    for (let i = 0; i < items.length; i++) {
        let x = marginX + 250 * i + 70;
        let y = marginY + 300;
        ctx.fillStyle = "black";
        ctx.fillRect(x, y, 200, 100);
        ctx.fillStyle="white"
        ctx.fillText(items[i], x+100, y+50);
    }
}
function unlevel(choice){
    clearInterval(lvlInterval);
    gameInterval=setInterval(update,1000/FPS);
    isLevel = false;
    let selection = choice-1;
    let buff = player1.lvlchoice[selection];
    player1.buffs.push(buff);
}

function update() {
    timer += 1// frames
    gameArea.update();

    if(player1.x + player1.w >= gameArea.canvas.width){
        player1.vx = -1*player1.base_xvel;
        player1.is_bouncing =true;
        player1.time_bounce = timer;
    }else if(player1.x-player1.w <= 0){
        player1.vx = player1.base_xvel;
        player1.is_bouncing=true;
        player1.time_bounce = timer;

    }
    if(player1.y + player1.w >= gameArea.canvas.height){
        player1.vy = -1*player1.base_yvel;
        player1.is_bouncing =true;
        player1.time_bounce = timer;

    }else if(player1.y-player1.w <= 0){
        player1.vy = player1.base_yvel;
        player1.is_bouncing=true;
        player1.time_bounce = timer;
    }
    

    for (let i = foods.length-1; i>=0; i--){ // iterate in reverse to avoid splicing issues
        f = foods[i];
        f.update();
        if(player1.collision(f)){
            player1.kill(f);
            foods.splice(i,1);
        }
        
        if(f.x + f.w+5 >= gameArea.canvas.width){
            f.vx = -1*Math.abs(f.base_xvel);

        }else if(f.x-f.w-5 <= 0){
            f.vx = Math.abs(f.base_xvel);

    
        }
        if(f.y + f.w+5 >= gameArea.canvas.height){
            f.vy = -1*Math.abs(f.base_yvel);

    
        }else if(f.y-f.w-5 <= 0){
            f.vy = Math.abs(f.base_yvel);

        }
    }
    for (let i = enemies.length-1; i>=0; i--){ //check collisions, iterate reverse
        e = enemies[i];
        e.update(); 
        if(player1.collision(e)){
            
            player1.hurt(e);
            if (player1.hp<=0){

                end();
                return;
                
            }
            e.hurt(player1);
            if(e.hp<=0){
                player1.kill(e);
                enemies.splice(i,1);
            }else{
                e.collision(player1);
            }
        }
        if(e.x + e.w >= gameArea.canvas.width){
            e.vx = -1*e.base_xvel;
            e.is_bouncing =true;
            e.time_bounce = timer;
        }else if(e.x-e.w <= 0){
            e.vx = e.base_xvel;
            e.is_bouncing=true;
            e.time_bounce = timer;
    
        }
        if(e.y + e.w >= gameArea.canvas.height){
            e.vy = -1*e.base_yvel;
            e.is_bouncing =true;
            e.time_bounce = timer;
    
        }else if(e.y-e.w <= 0){
            e.vy = e.base_yvel;
            e.is_bouncing=true;
            e.time_bounce = timer;
        }
    }

    player1.update();
    game.update();


    //check 
}
function lvlupdate(){
    if(isLevel && gameArea.keys){
        let choice = 0;
        if(gameArea.keys["Digit1"]){
            choice = 1;
            unlevel(choice);
        }else if(gameArea.keys["Digit2"]){
            choice = 2;
            unlevel(choice);
        }else if(gameArea.keys["Digit3"]){
            choice = 3;
            unlevel(choice);
        }   
    }
}
function gridmoveL(x,y){
    return [x*80+32, y*72+30];
}
function gridmoveR(x,y){
    return [x*80 + 20, y*72+30];
}
function grididleL(x,y){
    return [x*80+32, y*72+32];
}
function grididleR(x,y){
    return [x*80 + 20, y*72+32];
}
function gridhurtL(x,y){
    return [x*80+32, y*72+32];
}
function gridhurtR(x,y){
    return [x*80 + 20, y*72+32];
}

//graphics
const idleR = new Image();
idleR.src = "./spr/Slimes/slime_idle1.png";
const idleL = new Image();
idleL.src = "./spr/Slimes/slime_idle1L.png";
const moveL = new Image();
moveL.src = "./spr/Slimes/slime_move.png";
const moveR = new Image();
moveR.src = "./spr/Slimes/slime_moveR.png";
const hurtR = new Image();
hurtR.src = "./spr/Slimes/slime_hitR.png";
const hurtL = new Image();
hurtL.src = "./spr/Slimes/slime_hit.png";
const player_y = 0;
const move_frames = 7;
const idle_frames = 2;
const hit_frames = 2;
const spr_size = 32;
const spr_height = 18;
const backgroundimg = new Image();
backgroundimg.src = "./spr/background.jpg";

const bgmusic = new Sound("./spr/bgmusic.mp3");
//game
const playerrad = 30;
const playerh = 20;
const enemyrad = 30;
const enemyh = 20;
const foodrad = 5;
let player1 = new player(gameArea.canvas.width/2.0, gameArea.canvas.height/2.0, playerrad, playerh, 0, 0,100,[], "image");

const enemies = [];
let enemy_strength = 0; 
const foods = [];
const FPS = 50;
let rpress=false, lpress=false, upress=false, dpress=false; 

let gameInterval = 0, isPaused = false, timer = 0; isLevel = false; lvlInterval = 0;

window.onload = gameArea.start();