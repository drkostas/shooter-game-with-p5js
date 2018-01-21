var canvasX = 800;
var canvasY = 800;
var bg;
var song;
var death;
var startTime;
var lap;
var prevSec = -1;
var scl = 0.3;
var winningX = 0;
var score = 0;
var pl = new player(770, 400, 1);
var Bullets = new Array;
var Monsters =  new Array();

function preload() {
  	bg = loadImage("assets/sky.jpg");
	song = loadSound("assets/theme.mp3");
	death = loadSound("assets/death.mp3");
}

function setup() {
	let cnv = createCanvas(canvasX, canvasY);
	let x = (windowWidth - width) / 2;
	let y = (windowHeight - height) / 2;
	cnv.position(x, y);
	song.loop();
	spawnMonster();
	startTime = performance.now();
	lap = 1;
}


function draw(){
	seconds = (Math.floor((performance.now() - startTime)/1000));
	// console.log(Math.abs(lap*5-seconds));
	if (Math.abs(lap*5-seconds)==0 && seconds!=prevSec){
		spawnMonster(lap);
		lap += 1;
		prevSec = seconds;
	}
	let crashed = false;
	// background(map(winningX, 0, 800, 100, 254), map(winningX, 0, 800, 254, 50), map(winningX, 0, 800, 190, 50));
	background(bg);
	pl.show(mouseY);
	for (let i = 0; i < Bullets.length; i++) {
		let killedOrVanished = false;
		let blt = Bullets[i];
		blt.show();
		if(blt.centerX<0){
			killedOrVanished= true; 
		}
		else{
			for (let i = 0; i < Monsters.length; i++) {
				let m = Monsters[i];
				if (m.isKilled(blt)){			
					Monsters.splice(i,1);
					winningX = 0;
					killedOrVanished = true;
					score += 1;
					death.play();
				}
			}
		}
		if (killedOrVanished){
			Bullets.splice(i,1);
		}
	}
	for (let m of Monsters) {
		m.show();
	  	m.vibrate();
	  	touched = m.walk(canvasX);
	  	if (touched == "left"){
	  		m.init(0 + m.radXhead/2, m.centerY);
	  	}
	  	else if(touched == "right"){
	  		crashed = true;
	  	}
	  	let rightSide = m.getRightSide();
	  	if (winningX < rightSide){
			winningX = rightSide;
		}
	}
	if(crashed){
		reset();
	}
	writeScore();
}
function mousePressed(){
	pl.shoot();
	// deleteOrCreateMonster();
}

function spawnMonster(){
	numOfMonsters = map(lap, 0, 20, 1, 6);
	speed = map(lap, 0, 20, 3, 6);
	// console.log("num=", numOfMonsters);
	// console.log("speed=", speed);
	for (var i = 0; i < numOfMonsters; i++) {
		Monsters.push(new monster(0, random(50,750), scl, speed));
	}
}

function reset(){
	song.stop();
	canvasX = 800;
	canvasY = 800;
	prevSec = -1;
	scl = 0.3;
	winningX = 0;
	score = 0;
	pl = new player(770, 400, 1);
	Bullets = new Array;
	Monsters =  new Array();
	setup();
}

function writeScore(){
	document.getElementById("score").innerHTML = score;
}