class chunk {


    constructor(x, y, width, height, xIndex, yIndex){
        this.box = new Box(x, y, width, height, 'b');
        this.xIndex = xIndex;
        this.yIndex = yIndex;
        this.ob = [];
        this.te = [];
        this.pl = [];
        this.xIndex; this.yIndex;
    }

    absToIndex(x, y){
        let X = Math.trunc(x/this.box.width);
        let Y = Math.trunc(y/this.box.height);
        if(X<0){X=0;}
        if(Y<0){Y=0;}
        return [X, Y];
    }
}