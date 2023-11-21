var canvasX;
var canvasY;
var bg;
var song;
var death;
var startTime;
var lap;
var speed;
var scl;
var pl;
var highScore;
var scroll = 0;
var paused = false;
var prevSec = -1;
var winningX = 0;
var score = 0;
var Bullets = new Array();
var Monsters = new Array();

function preload() {
  bg = loadImage("assets/sky.jpg");
  death = loadSound("assets/death.mp3");
  song = loadSound("assets/a7x.mp3", themeSongLoaded);
}

function setup() {
  centerCanvas();
  noCursor();
  death.setVolume(0.4);
  frameRate(40);
  pl = new player(canvasX - 30, canvasY / 2, 1);
  startTime = performance.now();
  lap = 1;
}

function themeSongLoaded() {
  song.loop();
}

function draw() {
  if (!song.isLooping()) {
    return;
  }
  // background(map(winningX, 0, canvasX, 100, 254), map(winningX, 0, canvasX, 254, 50), map(winningX, 0, canvasX, 190, 50));
  let crashed = false;
  seconds = Math.floor((performance.now() - startTime) / 1000);
  moveBackground();
  // Calculate lap number
  if (Math.abs(lap * 5 - seconds) == 0 && seconds != prevSec) {
    spawnMonster();
    lap += 1;
    prevSec = seconds;
  }
  pl.show(mouseY); // Show Player
  checkKilled(); // Checks the monsters that each bullet shot
  crashed = moveMonsters(crashed); // Moves monsters and checks the distance of the closest to the edge
  writeScore();
  if (crashed) {
    highScore = score;
    $("#scoreModal").html(highScore);
    modal.style.display = "block";
    reset();
    setTimeout(function () {
      pauseGame();
    }, 1000);
  }
}
// function mousePressed(){
// 	pl.shoot();
// }

function pauseGame() {
  song.pause();
  noLoop();
  paused = true;
}

function resumeGame() {
  song.play();
  startTime = performance.now() - seconds * 1000;
  loop();
  paused = false;
}

function keyPressed() {
  if (keyCode == ESCAPE) {
    if (paused) {
      resumeGame();
    } else {
      pauseGame();
    }
  } else if (keyCode == 83) {
    pl.shoot();
  }
}

function spawnMonster() {
  numOfMonsters = map(lap, 0, 20, 1, 20);
  speed = map(lap, -1, 20, (4 * 1900) / windowWidth, (12 * 1900) / windowWidth);
  if (!isNaN(speed)) {
    speedToShow = Math.round((speed - (4 * 1900) / windowWidth) * 10) / 10;
  } else {
    speedToShow = 1;
  }
  document.getElementById("speed").innerHTML = speedToShow;
  // console.log("monster speed: ", speed);
  for (var i = 0; i < numOfMonsters; i++) {
    Monsters.push(new monster(0, random(50, canvasY - 50), scl, speed));
  }
}

function reset() {
  song.stop();
  scroll = 0;
  paused = false;
  prevSec = -1;
  winningX = 0;
  score = 0;
  document.getElementById("speed").innerHTML = 1;
  Bullets = new Array();
  Monsters = new Array();
  setup();
}

// function updateHighscore(){
// 	let hs = document.getElementById("highscore").innerHTML;
// 	if (hs<score){
// 		document.getElementById("highscore").innerHTML = score;
// 	}
// }

function writeScore() {
  document.getElementById("score").innerHTML = score;
}

function centerCanvas() {
  canvasX = windowWidth - 100;
  canvasY = windowHeight - 250;
  scl = (windowWidth * 0.4) / 1900;
  // console.log(scl);
  let cnv = createCanvas(canvasX, canvasY);
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);
  bg.resize(canvasX, canvasY);
}

function moveBackground() {
  background(0);
  speed =
    Math.round(
      map(lap, 0, 20, (4 * 1900) / windowWidth, (12 * 1900) / windowWidth) * 10
    ) / 10;
  // console.log("BACKGROUND", speed);
  image(bg, scroll, 0);
  image(bg, scroll - bg.width, 0);
  scroll = scroll + speed;
  // console.log("background speed: ", speed-(5*scl));
  if (scroll > bg.width) {
    scroll = 0;
  }
}

function checkKilled() {
  for (let i = 0; i < Bullets.length; i++) {
    let killedOrVanished = false;
    let blt = Bullets[i];
    blt.show();
    if (blt.centerX < 0) {
      killedOrVanished = true;
    } else {
      for (let i = 0; i < Monsters.length; i++) {
        let m = Monsters[i];
        if (m.isKilled(blt)) {
          Monsters.splice(i, 1);
          winningX = 0;
          killedOrVanished = true;
          score += 1;
          death.play();
        }
      }
    }
    if (killedOrVanished) {
      Bullets.splice(i, 1);
    }
  }
}

function moveMonsters(crashed) {
  for (let m of Monsters) {
    m.show();
    m.vibrate();
    touched = m.walk(canvasX);
    if (touched == "left") {
      m.init(0 + m.radXhead / 2, m.centerY);
    } else if (touched == "right") {
      crashed = true;
    }
    let rightSide = m.getRightSide();
    if (winningX < rightSide) {
      winningX = rightSide;
    }
  }
  return crashed;
}
