var canvasX = 1928;
var canvasY = 800;
var bg;
let scroll = 0; 
var song;
var death;
var startTime;
var lap;
var speed;
var prevSec = -1;
var scl = 0.4;
var winningX = 0;
var score = 0;
var pl = new player(canvasX-30, canvasY/2, 1);
var Bullets = new Array;
var Monsters =  new Array();

function preload() {
  	bg = loadImage("assets/sky.jpg");
	song = loadSound("assets/theme.mp3");
	death = loadSound("assets/death.mp3");
}

function setup() {
	centerCanvas();
	song.loop();
	spawnMonster();
	startTime = performance.now();
	lap = 1;
}


function draw(){
	// background(map(winningX, 0, canvasX, 100, 254), map(winningX, 0, canvasX, 254, 50), map(winningX, 0, canvasX, 190, 50));
	let crashed = false;	
	seconds = (Math.floor((performance.now() - startTime)/1000));
	moveBackground();
	// Calculate lap number
	if (Math.abs(lap*5-seconds)==0 && seconds!=prevSec){
		spawnMonster(lap);
		lap += 1;
		prevSec = seconds;
	}
	pl.show(mouseY); // Show Player
	checkKilled(); // Checks the monsters that each bullet shot
	crashed = moveMonsters(crashed); // Moves monsters and checks the distance of the closest to the edge
	if(crashed){
		reset();
	}
	writeScore();
}
function mousePressed(){
	pl.shoot();
}

function spawnMonster(){
	numOfMonsters = map(lap, 0, 20, 1, 12);
	speed = map(lap, 0, 20, 4, 10);
	for (var i = 0; i < numOfMonsters; i++) {
		Monsters.push(new monster(0, random(50,canvasY-50), scl, speed));
	}
}

function reset(){
	song.stop();
	prevSec = -1;
	scl = 0.3;
	winningX = 0;
	updateHighscore();
	score = 0;
	pl = new player(canvasX-30, canvasY/2, 1);
	Bullets = new Array;
	Monsters =  new Array();
	setup();
}

function updateHighscore(){
	let hs = document.getElementById("highscore").innerHTML;
	if (hs<score){
		document.getElementById("highscore").innerHTML = score;
	}
}

function writeScore(){
	document.getElementById("score").innerHTML = score;
}

function centerCanvas(){
	let cnv = createCanvas(canvasX, canvasY);
	let x = (windowWidth - width) / 2;
	let y = (windowHeight - height) / 2;
	cnv.position(x, y);
	bg.resize(canvasX, canvasY);
}

function moveBackground(){
	background(0);
	speed = map(lap, 0, 20, 4, 10);
	image(bg, scroll, 0);
  	image(bg, scroll-bg.width, 0);
	scroll = scroll + speed*scl;
	if (scroll>bg.width) {
		scroll=0;		
	}
}

function checkKilled(){
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
}

function moveMonsters(crashed){
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
	return crashed;
}