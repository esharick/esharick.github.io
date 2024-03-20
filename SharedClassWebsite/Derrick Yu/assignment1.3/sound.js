class Sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = "gameData/sound/"+src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        this.startTime = 0;
        document.body.appendChild(this.sound);
    }

    play() {
        if(this.startTime != null){
            this.sound.currentTime = this.startTime; //reset sound
        }
        this.sound.play();
    }

    stop() {
        this.sound.pause();
    }
}