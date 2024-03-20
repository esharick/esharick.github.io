class animation {
    constructor() {
        this.states = [];
        this.path = "";
        this.pointer = 0;
        this.next = 0;
    }

    copy(){
        let result = new animation();
        result.states = this.states;
        result.pointer = this.pointer;
        result.path = this.path;
        result.next = this.next;
        return result;
    }


    addStates(stuff){
        const stuffSplit = stuff.split(" ");
        for(let i=0; i<stuffSplit.length; i++){
            if(stuffSplit[i] == null || stuffSplit[i].length < 5){
                continue;
            }
            this.addState(stuffSplit[i]);
        }
    }
    
    addState(cond){// condition format: "filename,offsetX,offsetY,scale"
        const conds = cond.split(",");
        this.states.push(new state(conds[0], Number.parseFloat(conds[1]), Number.parseFloat(conds[2]), Number.parseFloat(conds[3])));
    }

    getState(){
        return this.states[this.pointer];
    }

    Next(){
        this.pointer++;
        if(this.pointer==this.states.length){
            this.pointer = 0;
            return this.next;
        }else{
            return 0; // default animation
        }
    }

}
