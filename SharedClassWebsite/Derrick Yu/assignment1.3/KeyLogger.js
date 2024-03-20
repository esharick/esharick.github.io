class keyLogger {


    // TODO incorporate keyCode

    constructor(s){

        this.press;
        this.release;
        this.map = {};
        this.pressed = [];
        this.time = [];
        this.c = []
        for(let i=0; i<s.length; i++){
            this.c[i] = s.charAt(i);
            this.map[this.c[i]] = i;
        }

    }



    update(){ // This method should be called last in main loop in order for previous to function
        for(i=0; i<this.c.length; i++){
            if(this.pressed[i]){
                this.time[i]++;
            }else{
                this.time[i]=0;
            }
        }
        this.press = null;
        this.release = null;

    }

    time(n){
        return this.time[this.map[n]];
    }

    pressEvent(n){
        return Boolean(this.press == n);
    }

    releaseEvent(n){
        return this.release == n;
    }

    isPressed(n){
        return this.pressed[this.map[n]];
    }

    getPressed(){
        result = [];
        for(i=0; i<this.c.length; i++){
            if(this.pressed[i]){
                result.push(c[i]);
            }
        }
        return result;
    }

    releaseKey(n){
        if(this.map[n] == null){return;}
        this.pressed[this.map[n]] = false;
        this.time[this.map[n]] = 0;
        this.release = n;
    }

    pressKey(n){
        if(this.map[n] == null){return;}
        this.pressed[this.map[n]] = true;
        this.press = n;
    }

}
