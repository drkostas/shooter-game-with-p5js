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
  // Use window.getComputedStyle to get the actual width of the leaderboard
  let leaderboardStyle = window.getComputedStyle(document.getElementById('leaderboard'));
  let leaderboardWidth = leaderboardStyle.width.replace('px', ''); // Remove 'px' to convert to number
  leaderboardWidth = parseFloat(leaderboardWidth); // Convert the width to a number
  
  // Account for the margin of the leaderboard
  let leaderboardMarginRight = leaderboardStyle.marginRight.replace('px', '');
  leaderboardMarginRight = parseFloat(leaderboardMarginRight);

  // Calculate the canvas width by subtracting the leaderboard width and its margin from the window width
  canvasX = windowWidth - leaderboardWidth - leaderboardMarginRight - 10; // Subtract an extra 10px for potential scrollbar
  canvasY = windowHeight - 280; // Height of the window minus the space for header and footer

  // Adjust the scale based on the new width
  scl = (canvasX * 0.4) / 1900; // You might need to adjust the scaling factor

  // Create and position the canvas
  let cnv = createCanvas(canvasX, canvasY);
  let x = (windowWidth - canvasX - leaderboardWidth - leaderboardMarginRight) / 2;
  let y = (windowHeight - canvasY) / 2;
  cnv.position(x, 75); // Position the canvas 75px from the top, as per your CSS
  bg.resize(canvasX, canvasY); // Assuming 'bg' is a p5.js image that needs to be resized
  cnv.parent("game-container"); // Make the canvas a child of the game-container div
}

function moveBackground() {
  background(0);
  speed =``
    Math.round(
      map(lap, 0, 20, (4 * 1900) / windowWidth, (12 * 1900) / windowWidth) * 10
    ) / 10;
  image(bg, scroll, 0);
  image(bg, scroll - bg.width, 0);
  scroll = scroll + speed;
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
