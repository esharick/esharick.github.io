
const GHZ = document.createElement("audio");
GHZ.src = "gameData/sound/Green Hill Zone Act 1.mp3";
GHZ.setAttribute("preload", "auto");
GHZ.setAttribute("controls", "none");
GHZ.style.display = "none";
document.body.appendChild(GHZ);
GHZ.volume = 0.4;




let p1 = new Character(1870, 3300, 70, 140);


var sketchProc = function (processingInstance) {
   with (processingInstance) {
      size(1400, 800);
      frameRate(60);


   const ani_te = [];
   let physics = new Physics();
   const keys = new keyLogger("1234567890wasdjkuirtyeq");

   sound_ring = new Sound("Ring.mp3");
   sound_ring.startTime = 0.40;

   sound_monitor = new Sound("Monitor Break.wav");

   sound_death = new Sound("Death Sound.mp3");

   sound_skid = new Sound("Skid.mp3");
    sound_skid.startTime = null;

    sound_jump = new Sound("Jump.mp3");
    sound_jump.sound.volume = 0.25;

    sound_spin = new Sound("Spin.mp3");
    sound_spin.sound.volume = 0.4;

   mousePressed = function(){
    GHZ.play();
   }


   
   ///////////setup/////////////

   let cam = new Camera(500,500,1536, 864, 120);
   let camCenter = [0,0];
   let camMomentum = [0,0];
   let frame = 0;
   let second = 0;
   
   let initial_te = [];
   initial_te.push(new Terrain(new Box(0.0,2000.0,30.0,2000.0),0.0,2000.0,[new Inequality(2,false,[0.0]),],1,'n'));
initial_te.push(new Terrain(new Box(0.0,3640.0,300.0,100.0),0.0,3640.0,[new Inequality(2,true,[0.0]),new Inequality(2,false,[240.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[70.0,15.0,0.1]),],1,'n'));
initial_te.push(new Terrain(new Box(0.0,3640.0,1000.0,100.0),0.0,3640.0,[new Inequality(2,true,[240.0]),new Inequality(2,false,[530.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[200.0,30.0,-0.1]),],1,'n'));
initial_te.push(new Terrain(new Box(0.0,3640.0,1100.0,100.0),0.0,3640.0,[new Inequality(2,true,[530.0]),new Inequality(2,false,[1000.0]),new Inequality(1,true,[5.0]),],1,'n'));
initial_te.push(new Terrain(new Box(1000.0,3640.0,300.0,100.0),1000.0,3640.0,[new Inequality(2,true,[0.0]),new Inequality(2,false,[240.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[70.0,15.0,0.1]),],1,'n'));
initial_te.push(new Terrain(new Box(1000.0,3640.0,1000.0,140.0),1000.0,3640.0,[new Inequality(2,true,[240.0]),new Inequality(2,false,[530.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[200.0,30.0,-0.1]),],1,'n'));
initial_te.push(new Terrain(new Box(1000.0,3640.0,1100.0,140.0),1000.0,3640.0,[new Inequality(2,true,[530.0]),new Inequality(2,false,[1080.0]),new Inequality(1,true,[5.0]),],1,'n'));
initial_te.push(new Terrain(new Box(2055.0,3260.0,800.0,100.0),2055.0,3260.0,[new Inequality(2,true,[10.0]),new Inequality(2,false,[740.0]),new Inequality(1,true,[20.0]),],1,'t'));
initial_te.push(new Terrain(new Box(2080.0,3640.0,400.0,140.0),2080.0,3640.0,[new Inequality(2,true,[0.0]),new Inequality(2,false,[340.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[70.0,15.0,0.11]),],1,'n'));
initial_te.push(new Terrain(new Box(2180.0,3640.0,1000.0,140.0),2180.0,3640.0,[new Inequality(2,true,[240.0]),new Inequality(2,false,[785.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[200.0,48.0,-0.1]),],1,'n'));
initial_te.push(new Terrain(new Box(2960.0,3640.0,500.0,140.0),2960.0,3640.0,[new Inequality(2,true,[5.0]),new Inequality(2,false,[190.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[10.0,10.0,0.18]),],1,'n'));
initial_te.push(new Terrain(new Box(3144.0,3640.0,200.0,140.0),3144.0,3640.0,[new Inequality(2,true,[5.0]),new Inequality(2,false,[140.0]),new Inequality(3,true,[100.0,20.0,-0.25]),],1,'n'));
initial_te.push(new Terrain(new Box(3140.0,3340.0,1000.0,600.0),3140.0,3340.0,[new Inequality(2,true,[140.0]),new Inequality(2,false,[580.0]),new Inequality(3,true,[100.0,330.0,-0.5]),],1,'n'));
initial_te.push(new Terrain(new Box(3720.0,3380.0,200.0,200.0),3720.0,3380.0,[new Inequality(2,true,[0.0]),new Inequality(2,false,[180.0]),new Inequality(3,true,[0.0,50.0,-0.12]),],1,'n'));
initial_te.push(new Terrain(new Box(3900.0,3380.0,250.0,100.0),3900.0,3380.0,[new Inequality(2,true,[0.0]),new Inequality(2,false,[230.0]),new Inequality(1,true,[28.0]),],1,'n'));
initial_te.push(new Terrain(new Box(4820.0,3400.0,350.0,140.0),4820.0,3400.0,[new Inequality(2,true,[45.0]),new Inequality(2,false,[320.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[160.0,15.0,0.12]),],1,'n'));
initial_te.push(new Terrain(new Box(4900.0,3408.0,1000.0,140.0),4900.0,3408.0,[new Inequality(2,true,[240.0]),new Inequality(2,false,[530.0]),new Inequality(1,true,[5.0]),new Inequality(3,true,[200.0,34.0,-0.12]),],1,'n'));
initial_te.push(new Terrain(new Box(5350.0,3400.0,350.0,140.0),5350.0,3400.0,[new Inequality(2,true,[45.0]),new Inequality(2,false,[320.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[160.0,15.0,0.12]),],1,'n'));
initial_te.push(new Terrain(new Box(5420.0,3400.0,1000.0,140.0),5420.0,3400.0,[new Inequality(2,true,[250.0]),new Inequality(2,false,[530.0]),new Inequality(1,true,[5.0]),new Inequality(3,true,[200.0,34.0,-0.12]),],1,'n'));
initial_te.push(new Terrain(new Box(6200.0,3380.0,300.0,200.0),6200.0,3380.0,[new Inequality(2,true,[50.0]),new Inequality(2,false,[190.0]),new Inequality(3,true,[0.0,75.0,0.45]),],1,'n'));
initial_te.push(new Terrain(new Box(5800.0,3310.0,1000.0,200.0),5800.0,3310.0,[new Inequality(2,true,[150.0]),new Inequality(2,false,[450.0]),new Inequality(3,true,[100.0,84.0,0.25]),],1,'n'));
initial_te.push(new Terrain(new Box(6250.0,3320.0,600.0,600.0),6250.0,3320.0,[new Inequality(2,true,[140.0]),new Inequality(2,false,[500.0]),new Inequality(3,true,[92.0,204.0,0.32]),],1,'n'));
initial_te.push(new Terrain(new Box(6750.0,3630.0,300.0,100.0),6750.0,3630.0,[new Inequality(2,true,[0.0]),new Inequality(2,false,[200.0]),new Inequality(1,true,[18.0]),],1,'n'));
initial_te.push(new Terrain(new Box(6950.0,3390.0,500.0,400.0),6950.0,3390.0,[new Inequality(2,true,[0.0]),new Inequality(2,false,[400.0]),new Inequality(1,true,[18.0]),new Inequality(4,true,[-10.0,-10.0,273.0,265.0]),],1,'n'));
initial_te.push(new Terrain(new Box(7220.0,3380.0,1050.0,500.0),7220.0,3380.0,[new Inequality(2,true,[0.0]),new Inequality(2,false,[1040.0]),new Inequality(1,true,[28.0]),],1,'n'));
initial_te.push(new Terrain(new Box(8250.0,3250.0,300.0,500.0),8250.0,3250.0,[new Inequality(2,true,[16.0]),new Inequality(2,false,[260.0]),new Inequality(1,true,[28.0]),],1,'n'));
initial_te.push(new Terrain(new Box(8511.0,3150.0,500.0,500.0),8511.0,3150.0,[new Inequality(2,true,[2.0]),new Inequality(2,false,[483.0]),new Inequality(1,true,[12.0]),],1,'n'));
initial_te.push(new Terrain(new Box(8995.0,2969.0,1000.0,500.0),8995.0,2969.0,[new Inequality(2,true,[2.0]),new Inequality(2,false,[971.0]),new Inequality(1,true,[3.0]),],1,'n'));
initial_te.push(new Terrain(new Box(9967.0,2968.0,2000.0,500.0),9967.0,2968.0,[new Inequality(2,true,[704.0]),new Inequality(2,false,[1702.0]),new Inequality(1,true,[12.0]),],1,'n'));
initial_te.push(new Terrain(new Box(10975.0,2671.0,2000.0,500.0),10975.0,2671.0,[new Inequality(2,true,[704.0]),new Inequality(2,false,[1958.0]),new Inequality(1,true,[12.0]),],1,'n'));
initial_te.push(new Terrain(new Box(12746.0,2442.0,1000.0,600.0),12746.0,2442.0,[new Inequality(2,true,[24.0]),new Inequality(2,false,[743.0]),new Inequality(3,true,[100.0,321.0,-0.5]),],1,'n'));
initial_te.push(new Terrain(new Box(12788.0,2429.0,1200.0,500.0),12788.0,2429.0,[new Inequality(2,true,[704.0]),new Inequality(2,false,[1071.0]),new Inequality(1,true,[12.0]),],1,'n'));
initial_te.push(new Terrain(new Box(14587.0,2003.0,400.0,140.0),14587.0,2003.0,[new Inequality(2,true,[0.0]),new Inequality(2,false,[340.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[70.0,15.0,0.11]),],1,'t'));
initial_te.push(new Terrain(new Box(14587.0,2003.0,1000.0,140.0),14587.0,2003.0,[new Inequality(2,true,[240.0]),new Inequality(2,false,[755.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[200.0,48.0,-0.1]),],1,'t'));
initial_te.push(new Terrain(new Box(14587.0,2428.0,1000.0,140.0),14587.0,2428.0,[new Inequality(2,true,[230.0]),new Inequality(2,false,[555.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[200.0,148.0,-0.24]),],1,'t'));
initial_te.push(new Terrain(new Box(14587.0,2428.0,1000.0,140.0),14587.0,2428.0,[new Inequality(2,true,[230.0]),new Inequality(2,false,[555.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[200.0,148.0,-0.24]),],1,'t'));
initial_te.push(new Terrain(new Box(14587.0,2428.0,1300.0,140.0),14587.0,2428.0,[new Inequality(2,true,[555.0]),new Inequality(2,false,[955.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[200.0,258.0,-0.53]),],1,'t'));
initial_te.push(new Terrain(new Box(11938.0,3393.0,1900.0,500.0),11938.0,3393.0,[new Inequality(2,true,[704.0]),new Inequality(2,false,[1828.0]),new Inequality(1,true,[12.0]),],1,'n'));
initial_te.push(new Terrain(new Box(13880.0,3335.0,1000.0,200.0),13880.0,3335.0,[new Inequality(2,true,[90.0]),new Inequality(2,false,[590.0]),new Inequality(3,true,[0.0,75.0,0.45]),],1,'n'));
initial_te.push(new Terrain(new Box(13620.0,3300.0,1000.0,200.0),13620.0,3300.0,[new Inequality(2,true,[150.0]),new Inequality(2,false,[360.0]),new Inequality(3,true,[100.0,84.0,0.25]),],1,'n'));
initial_te.push(new Terrain(new Box(14270.0,3560.0,1000.0,200.0),14270.0,3560.0,[new Inequality(2,true,[150.0]),new Inequality(2,false,[660.0]),new Inequality(1,true,[100.0]),],1,'n'));
initial_te.push(new Terrain(new Box(14860.0,3650.0,400.0,140.0),14860.0,3650.0,[new Inequality(2,true,[0.0]),new Inequality(2,false,[340.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[70.0,15.0,0.11]),],1,'n'));
initial_te.push(new Terrain(new Box(14860.0,3650.0,1000.0,140.0),14860.0,3650.0,[new Inequality(2,true,[240.0]),new Inequality(2,false,[885.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[200.0,48.0,-0.1]),],1,'n'));
initial_te.push(new Terrain(new Box(16150.0,3400.0,200.0,140.0),16150.0,3400.0,[new Inequality(2,true,[5.0]),new Inequality(2,false,[140.0]),new Inequality(3,true,[100.0,20.0,-0.25]),],1,'n'));
initial_te.push(new Terrain(new Box(15590.0,3350.0,1000.0,600.0),15590.0,3350.0,[new Inequality(2,true,[140.0]),new Inequality(2,false,[580.0]),new Inequality(3,true,[100.0,330.0,-0.5]),],1,'n'));
initial_te.push(new Terrain(new Box(16290.0,3395.0,1000.0,140.0),16290.0,3395.0,[new Inequality(2,true,[0.0]),new Inequality(2,false,[770.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[700.0,48.0,0.11]),],1,'n'));
initial_te.push(new Terrain(new Box(16790.0,3395.0,1200.0,140.0),16790.0,3395.0,[new Inequality(2,true,[240.0]),new Inequality(2,false,[1085.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[200.0,48.0,-0.1]),],1,'n'));
initial_te.push(new Terrain(new Box(17820.0,3275.0,500.0,140.0),17820.0,3275.0,[new Inequality(2,true,[40.0]),new Inequality(2,false,[485.0]),new Inequality(1,true,[10.0]),],1,'n'));
initial_te.push(new Terrain(new Box(18070.0,3155.0,1000.0,140.0),18070.0,3155.0,[new Inequality(2,true,[40.0]),new Inequality(2,false,[785.0]),new Inequality(1,true,[10.0]),],1,'n'));
initial_te.push(new Terrain(new Box(18620.0,2945.0,700.0,140.0),18620.0,2945.0,[new Inequality(2,true,[100.0]),new Inequality(2,false,[640.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[370.0,75.0,0.11]),],1,'n'));
initial_te.push(new Terrain(new Box(18800.0,2975.0,1200.0,140.0),18800.0,2975.0,[new Inequality(2,true,[240.0]),new Inequality(2,false,[1135.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[200.0,48.0,-0.1]),],1,'n'));
initial_te.push(new Terrain(new Box(19300.0,2675.0,800.0,100.0),19300.0,2675.0,[new Inequality(2,true,[0.0]),new Inequality(2,false,[540.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[370.0,25.0,0.1]),],1,'t'));
initial_te.push(new Terrain(new Box(19500.0,2675.0,1000.0,100.0),19500.0,2675.0,[new Inequality(2,true,[240.0]),new Inequality(2,false,[730.0]),new Inequality(1,true,[10.0]),new Inequality(3,true,[200.0,40.0,-0.1]),],1,'t'));
initial_te.push(new Terrain(new Box(19700.0,2675.0,1100.0,100.0),19700.0,2675.0,[new Inequality(2,true,[530.0]),new Inequality(2,false,[1000.0]),new Inequality(1,true,[5.0]),],1,'t'));
initial_te.push(new Terrain(new Box(20680.0,2305.0,1500.0,400.0),20680.0,2305.0,[new Inequality(2,true,[0.0]),new Inequality(2,false,[1200.0]),new Inequality(1,true,[18.0]),new Inequality(4,true,[-10.0,-10.0,553.0,385.0]),],1,'n'));
initial_te.push(new Terrain(new Box(20620.0,1910.0,1500.0,500.0),20620.0,1910.0,[new Inequality(2,true,[310.0]),new Inequality(2,false,[1000.0]),new Inequality(1,true,[20.0]),new Inequality(1,false,[400.0]),new Inequality(4,true,[300.0,400.0,300.0,300.0]),],1,'n'));
initial_te.push(new Terrain(new Box(16270.0,2420.0,1100.0,100.0),16270.0,2420.0,[new Inequality(2,true,[30.0]),new Inequality(2,false,[800.0]),new Inequality(1,true,[20.0]),],1,'n'));
initial_te.push(new Terrain(new Box(16990.0,2300.0,500.0,100.0),16990.0,2300.0,[new Inequality(2,true,[30.0]),new Inequality(2,false,[300.0]),new Inequality(1,true,[20.0]),],1,'n'));
initial_te.push(new Terrain(new Box(17230.0,2175.0,600.0,100.0),17230.0,2175.0,[new Inequality(2,true,[30.0]),new Inequality(2,false,[450.0]),new Inequality(1,true,[20.0]),],1,'n'));
initial_te.push(new Terrain(new Box(17530.0,2100.0,1000.0,200.0),17530.0,2100.0,[new Inequality(2,true,[150.0]),new Inequality(2,false,[360.0]),new Inequality(3,true,[100.0,84.0,0.25]),],1,'n'));
initial_te.push(new Terrain(new Box(17810.0,2140.0,1000.0,200.0),17810.0,2140.0,[new Inequality(2,true,[90.0]),new Inequality(2,false,[420.0]),new Inequality(3,true,[0.0,75.0,0.45]),],1,'n'));
initial_te.push(new Terrain(new Box(18080.0,2300.0,1000.0,200.0),18080.0,2300.0,[new Inequality(2,true,[150.0]),new Inequality(2,false,[360.0]),new Inequality(3,true,[100.0,84.0,0.25]),],1,'n'));
initial_te.push(new Terrain(new Box(18380.0,2430.0,500.0,100.0),18380.0,2430.0,[new Inequality(2,true,[30.0]),new Inequality(2,false,[300.0]),new Inequality(1,true,[20.0]),],1,'n'));
initial_te.push(new Terrain(new Box(18530.0,2350.0,1000.0,200.0),18530.0,2350.0,[new Inequality(2,true,[150.0]),new Inequality(2,false,[360.0]),new Inequality(3,true,[100.0,84.0,0.25]),],1,'n'));
initial_te.push(new Terrain(new Box(18810.0,2390.0,1000.0,200.0),18810.0,2390.0,[new Inequality(2,true,[90.0]),new Inequality(2,false,[490.0]),new Inequality(3,true,[0.0,75.0,0.47]),],1,'t'));
initial_te.push(new Terrain(new Box(18810.0,2390.0,1000.0,200.0),18810.0,2390.0,[new Inequality(2,true,[90.0]),new Inequality(2,false,[490.0]),new Inequality(3,true,[0.0,75.0,0.47]),],1,'t'));
initial_te.push(new Terrain(new Box(2020.0,860.0,340.0,280.0),2020.0,860.0,[new Inequality(4,false,[170.0,160.0,170.0,100.0]),],1,'n'));
   



   loadStates = function(ani){
      for(i=0; i<ani.states.length; i++){
          if(ani.path != ""){
              ani.states[i].path = ani.path;
          }
          ani.states[i] = LoadImage(ani.states[i]);
      }
      return ani;
   }

   LoadImage = function(state){
      state.image = loadImage(state.path+state.fileName);
      return state;
   }

   drawState = function(state, x, y, isForwards){
      pushMatrix();
      if(!isForwards){
          scale(-1, 1);
      }
      scale(state.scale);
      image(state.image, (x+state.offsetX)/state.scale, (y+state.offsetY)/state.scale);
      popMatrix();
   }

   drawStateAngle = function(state, x, y, angle, isForwards){
      pushMatrix();
      translate(x, y);
      rotate(angle);
      if(!isForwards){
          scale(-1, 1);
      }
      translate(state.offsetX, state.offsetY);
      scale(state.scale);
      image(state.image,0,0);
      popMatrix();
  }

   
   let tempT = new Terrain(0, 0, 10000, 10000);
   tempT.createAnimation();
   tempT.ani.addStates(
      "bg-s-4.png,0,0,3.8 "+
      "bg-s-3.png,0,0,3.8 "+
      "bg-s-2.png,0,0,3.8 "+
      "bg-s-1.png,0,0,3.8 "
   );
   tempT.ani = loadStates(tempT.ani);
   ani_te.push(tempT);


   tempT = new Terrain(0, 0, 10000, 10000);
   tempT.createAnimation();
   tempT.ani.addStates(
      "bg-w-4.png,0,0,3.8   "+
      "bg-w-3.png,0,0,3.8   "+
      "bg-w-2.png,0,0,3.8   "+
      "bg-w-1.png,0,0,3.8   "
   );
   tempT.ani = loadStates(tempT.ani);
   ani_te.push(tempT);


   const stringParam = [
      "bg-m-1.png,0,0,3.8 ", "bg-c-1.png,0,0,3.8 ", "bg-c-2.png,0,0,3.8 ", "bg-c-3.png,0,0,3.8 ", "GHZ.png,-91.2,-1003.2,3.8"
   ];
   for (let i = 0; i < stringParam.length; i++) {
      tempT = new Terrain(0, 0, 10000, 10000);
      tempT.createAnimation();
      tempT.ani.addState(stringParam[i]);
      tempT.ani = loadStates(tempT.ani);
      ani_te.push(tempT);
   }




   // player animation time. yay.
   a = new animation();


   a.addState(
       "s_0-1.png,-50,-50,3.8"
       );
   a = loadStates(a);
   p1.ani.push(a);


   a = new animation();
   a.addStates(
       "s_20-1.png,-60,-40,3.8  "+
       "s_20-2.png,-60,-40,3.8  "+
       "s_20-3.png,-60,-40,3.8  "+
       "s_20-4.png,-120,-90,3.8  "+
       "s_20-5.png,-120,-90,3.8  "+
       "s_20-6.png,-120,-90,3.8  "
       );
   a = loadStates(a);
   p1.ani.push(a);


   a = new animation();
   a.addStates(
       "s_40-1.png,-60,-50,3.8  "+
       "s_40-2.png,-60,-50,3.8  "+
       "s_40-3.png,-60,-50,3.8  "+
       "s_40-4.png,-60,-50,3.8  "+
       "s_40-40.png,-60,-50,3.8  "
       );
   a = loadStates(a);
   p1.ani.push(a);


   a = new animation();
   a.addStates(
       "s_100-0.png,-65,-35,3.8  "+
       "s_100-1.png,-65,-35,3.8  "+
       "s_100-2.png,-65,-35,3.8  "+
       "s_100-3.png,-65,-35,3.8  "
       );
   a = loadStates(a);
   p1.ani.push(a);


   a = new animation();
   a.addStates(
       "s_106-0.png,-50,-40,3.8  "+
       "s_106-1.png,-50,-40,3.8  "+
       "s_106-2.png,-50,-40,3.8  "
       );
   a = loadStates(a);
   p1.ani.push(a);
   a = new animation();
   a.addStates(
       "s_106-3.png,-50,-40,3.8  "
       );
   a = loadStates(a);
   p1.ani.push(a);
   a = new animation();
   a.addStates(
       "s_6-1.png,-35,-40,3.8  "
       );
   a = loadStates(a);
   p1.ani.push(a);
   a = new animation();
   a.addStates(
       "s_7990-0.png,-80,-50,3.8  "
       );
   a = loadStates(a);
   p1.ani.push(a);



   const initial_ob = [];

   tempO = new gameObject(new Box(1100, 3180, 60, 60, null), null, null, 1);
   tempO.createAnimation();
   tempO.ani.addStates(
       "ring-1.png,0,0,3.8 "+
       "ring-2.png,0,0,3.8 "+
       "ring-3.png,0,0,3.8 "+
       "ring-4.png,0,0,3.8 "+
       "ring-5.png,0,0,3.8 "+
       "ring-6.png,0,0,3.8 "+
       "ring-7.png,0,0,3.8 "+
       "ring-8.png,0,0,3.8 "+
       "blank.png,0,0,1"
   );
   tempO.ani = loadStates(tempO.ani);


   initial_ob.push(tempO.copy());
   tempO.box.x += 100;
   initial_ob.push(tempO.copy());
   tempO.box.x += 100;
   initial_ob.push(tempO.copy());
   tempO.box.x = 4300;
   tempO.box.y = 3000;
   initial_ob.push(tempO.copy());
   tempO.box.x += 100;
   initial_ob.push(tempO.copy());
   tempO.box.x += 100;
   initial_ob.push(tempO.copy());
   tempO.box.x += 100;
   initial_ob.push(tempO.copy());
   tempO.box.x += 100;
   initial_ob.push(tempO.copy());
   tempO.box.x = 6300;
   tempO.box.y = 3400;
   initial_ob.push(tempO.copy());
   tempO.box.x += 115;
   tempO.box.y += 60;
   initial_ob.push(tempO.copy());
   tempO.box.x += 115;
   tempO.box.y += 50;
   initial_ob.push(tempO.copy());
   tempO.box.x += 135;
   tempO.box.y += 40;
   initial_ob.push(tempO.copy());
   tempO.box.x += 135;
   tempO.box.y += 20;
   initial_ob.push(tempO.copy());
   tempO.box.x += 145;
   tempO.box.y -= 10;
   initial_ob.push(tempO.copy());
   tempO.box.x += 145;
   tempO.box.y -= 80;
   initial_ob.push(tempO.copy());


   tempO = new gameObject(new Box(2120,3160,120,120,null), null, null, 10);
   tempO.createAnimation();
   tempO.ani.addStates(
       "tv-ring.png,0,0,3.8 "+
       "tv-ring.png,0,0,3.8 "+
       "tv-static-1.png,0,0,3.8 "+
       "tv-broken.png,0,0,3.8 "
   );
   tempO.ani = loadStates(tempO.ani);
   initial_ob.push(tempO);

   tempO = new gameObject(new Box(2020,860,120,120,null), null, null, 0);
   tempO.createAnimation();
   tempO.ani.addState(
       "trollface.png,0,0,1"
   );
   tempO.ani = loadStates(tempO.ani);
   initial_ob.push(tempO);
   console.log(initial_ob);

   physics.createChunks(120, 20, 500, initial_te, initial_ob);


      draw = function () {

         header();
         mainGame();
         trailer();

      }

      mainGame = function(){
         if(p1.getY() > 4000) {
            p1.setX(880);
            p1.setY(2500);
            p1.Vx=0;
            p1.Vy=0;
            p1.ringCount = 0;
            sound_death.play();
            physics.createChunks(120, 20, 500, initial_te, initial_ob);
         }

         physics.loadTerrian(cam.tBox);
         physics.pruneTerrain(cam.box);
         const e = physics.te;
         physics.loadObjects(cam.tBox);
         physics.pruneObjects(cam.tBox);
         const e2 = physics.ob;
         updateObjectAnimation(e2);
         physics.loadTerrian(cam.tBox);
         physics.RUN_CHARACTER_OBJECT(p1);
         p1 = physics.RUN_CHARACTER_TERRAIN(p1);
         if(physics.standingOn != null){
               standingOn = physics.standingOn;
         }

         background(240);

         drawBackground();

         noStroke();
         fill(0,0,0,90);
         rect(40,20,280,70);
         fill(255);
         textSize(50);
         text("Rings   "+p1.ringCount,50,70);

         for(let i=0; i<e2.length; i++){
            let o = e2[i];
            if(o.ani==null){continue;}
            drawState(o.ani.getState(), o.box.x+cam.offset[0], o.box.y+cam.offset[1], true);
        }


         updateAnimation();

         let animationAngle = p1.angle;
         if(Math.abs(p1.angle)<0.3){
             animationAngle = 0;
         }
         drawStateAngle(p1.getAni().getState(), p1.point[10][0]+cam.offset[0], p1.point[10][1]+cam.offset[1], animationAngle, p1.aniDirection());

         parseInputs();

         camCenter[1] = 0;
         if(p1.isForwards && p1.isForwards() && camCenter[0]<850){
             camCenter[0]+=15;
         }
         if(!p1.isForwards && !p1.isForwards() && camCenter[0]>-850){
             camCenter[0]-=15;
         }
         if(Math.abs(p1.Vx*30-camMomentum[0])>150){
             if(camMomentum[0]<p1.Vx*28){
                 camMomentum[0]+=18;
             }else{
                 camMomentum[0]-=18;
             }
         }
 
         if(p1.getSpeed()>p1.runSpeed*1.2){
             if(camMomentum[1]<p1.Vy*18){
                 camMomentum[1]+=18;
             }else{
                 camMomentum[1]-=18;
             }
         }else{
             if(Math.abs(p1.Vy*30-camMomentum[1])>150){
                 if(camMomentum[1]<p1.Vy*28){
                     camMomentum[1]+=18;
                 }else{
                     camMomentum[1]-=18;
                 }
             }
         }

         cam.x = camMomentum[0]+p1.getX();
         cam.y = camMomentum[1]+p1.getY()-20;
         if(Math.abs(camCenter[0])>200){
             if(camCenter[0]>0){
                 cam.x+=200;
             }else{
                 cam.x-=200;
             }
             
         }else{
             cam.x+=camCenter[0];
         }
 
 
 
 
         if(p1.getY()>3400){
             cam.y = 3400;
         }
         cam.update();
    }

    trailer = function(){
         keys.update();
    }

    header = function(){
        frame++;
        if(frame%60 == 0){
            second++;
        }
        if(frame>12000){
            frame = 0;
        }
    }

      keyPressed = function(){
         keys.pressKey(key);
      }

      keyReleased = function(){
         keys.releaseKey(key);
      }

      parseInputs = function(){
         if(keys.pressEvent('r')){
             p1 = new character(3500, 4000, 70, 140); 
         }
         if(keys.isPressed('w') || keys.pressEvent('j') || keys.pressEvent('k')){
             p1.jump();
             p1.width = 75;
             p1.height = 80;
         }
         if(keys.isPressed('w') || keys.isPressed('j') || keys.isPressed('k')){
             if(p1.lockAir>0){
                 p1.lockAir--;
                 p1.Vy-=p1.jumpV*0.045;
             }
         }
         if(keys.isPressed('a')){
             p1.goBackward();
         }
         if(keys.isPressed('d')){
             p1.goForward();
         }
         if(keys.isPressed('s')){
             if(p1.physics==1 && p1.getSpeed()>3 && p1.height != 80){
                sound_spin.play();
             }
             p1.width = 75;
             p1.height = 80;
         }
     }

     updateObjectAnimation = function(ob){
        for(let i=0; i<ob.length; i++){
            let o = ob[i];
            if(o.trigger == 1){
                if(o.isTriggered){
                    o.trigger = 2;
                    o.ani.pointer = 4;
                }else if(frame%8 == 0){
                    o.ani.Next();
                    if(o.ani.pointer==4){
                        o.ani.pointer=0;
                    }
                }
            }
            if(o.trigger == 2 && frame%8 == 0){
                o.ani.Next();
                if(o.ani.pointer == 8){
                    o.trigger = -1;
                }
            }
            if(o.trigger == 19){

            }
            if(o.trigger == 10){
                if(o.isTriggered){
                    o.trigger = 19;
                    o.ani.pointer = 3;
                }else{
                    o.ani.Next();
                    if(o.ani.pointer == 3){
                        o.ani.pointer = 0;
                    }
                }
            }
        }
    }

     updateAnimation = function(){
        //background stuff
        for(let i=0; i<2; i++){
            if(frame%4==0){
                ani_te[i].ani.Next();
            }
        }

        // player animation stuff

        if(p1.currentAni == 1){
            if(p1.getSpeed()>15 && frame%6==0){
                p1.getAni().Next();
            }else if(p1.getSpeed()>7 && frame%8==0){
                p1.getAni().Next();
            }else if(frame%10==0){
                p1.getAni().Next();
            }
        }
        if(p1.currentAni == 3){
            if(frame%4==0){
                p1.currentAni = p1.getAni().Next();
            }
        }
        if(p1.currentAni == 2 && frame%4==0){
            p1.getAni().Next();
        }
        if(p1.currentAni == 4 && frame%10==0){
            p1.getAni().Next();
        }



        if(p1.height==80){
            p1.currentAni = 2;
        }
        if(p1.physics == 0){
            return;
        }
        
        p1.currentAni = 0;
        
        if(keys.isPressed('a') || keys.isPressed('d')){
            p1.currentAni = 1;
            if(keys.isPressed('a')){
                p1.isForwardsVar = false;
                if(p1.isForwards() && p1.physics == 1 && p1.getSpeed()>8){
                    p1.currentAni = 4;
                    if(p1.getSpeed()>14 && p1.height != 80){
                        sound_skid.play();
                    }
                }
            }else{
                p1.isForwardsVar = true;
                if(!p1.isForwards() && p1.physics == 1 && p1.getSpeed()>8){
                    p1.currentAni = 4;
                    if(p1.getSpeed()>14 && p1.height != 80){
                        sound_skid.play();
                    }
                }
            }
        }
        if(p1.getSpeed()>0.5 && p1.currentAni != 4){
            p1.currentAni = 1;
        }
        if(p1.getSpeed()>19 && p1.currentAni == 1){
            p1.currentAni = 3;
        }
        if(p1.currentAni == 4 && p1.getSpeed()<12){
            p1.currentAni = 5;
        }
        if(p1.height==80){
            p1.currentAni = 2;
            if(p1.physics == 1 && p1.getSpeed()<2 && Math.abs(p1.angle)<0.5){
                if(keys.isPressed('s')){
                    p1.currentAni = 6;
                }else{
                    p1.width = 70;
                    p1.height = 140;
                }
            }
        }
    }

      drawBackground = function(){

         drawState(ani_te[2].ani.getState(), cam.offset[0]/10, 243.2+cam.offset[1]/50, true); //48
         drawState(ani_te[3].ani.getState(), cam.offset[0]/9, 182.4+cam.offset[1]/50, true); //16
         drawState(ani_te[4].ani.getState(), cam.offset[0]/8, 121.6+cam.offset[1]/50, true); //16
         drawState(ani_te[5].ani.getState(), cam.offset[0]/7, 0+cam.offset[1]/50, true); //24
         drawState(ani_te[0].ani.getState(), cam.offset[0]/6, 577.6+cam.offset[1]/50, true);
         drawState(ani_te[1].ani.getState(), cam.offset[0]/6.5, 425.6+cam.offset[1]/50, true); //40
         drawState(ani_te[6].ani.getState(), cam.offset[0], cam.offset[1], true);
     }


   }
};



var canvas = document.getElementById("mycanvas");
// Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
var processingInstance = new Processing(canvas, sketchProc); 