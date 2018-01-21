var winningX = 8;
var Monsters =  new Array();
class monster {
	constructor(baseX, baseY){
		this.lineX1 = baseX;
		this.lineY1 = baseY;
		this.lineX2 = baseX;
		this.lineY2 = baseY + 100;
		this.elX = baseX;
		this.elY = baseY-50;
		this.recX = baseX - 35;
		this.recY = baseY + 100;
		this.trX1 = baseX;
		this.trY1 = baseY + 135;
		this.trX2 = baseX - 50;
		this.trY2 = baseY+235;
		this.trX3 = baseX + 50;
		this.trY3 = baseY+335;		
	}

	increase(){
		this.lineX1 +=5;
		this.lineX2 +=5;
		this.elX +=5;
		this.recX +=5;
		this.trX1 +=5;
		this.trX2 +=5;
		this.trX3 +=5;
}
}
function setup() {
	createCanvas(800, 800);
	Monsters.push(new monster(8, 100));
	Monsters.push(new monster(8, 400));
}


function draw(){
	background(map(winningX, 0, 800, 50, 255), 50, 50);
	for (let p of Monsters) {
		stroke(255,164,99);
	  	line(p.lineX1,p.lineY1,p.lineX2,p.lineY2);
		noStroke();
		fill(255,164,99, 190);
		ellipse(p.elX, p.elY, 200, 100);
		fill(80,165,255, 230);
		ellipse(p.elX+90, p.elY-30, 40, 40);
		fill(80,150,60, 100);
	  	rect(p.recX,p.recY,170,35);
	  	fill(17,43,160, 100);
	  	triangle(p.trX1,p.trY1,p.trX2,p.trY2,p.trX3,p.trY3);
	  	vibrate(p);
	  	p.increase();
	}
	// spawnCircles();
}

function mousePressed(){
	isIn = false;
	for (var i = 0; i < Monsters.length; i++) {
		var p = Monsters[i];
		if ((mouseX <= p.elX+100 && mouseX>= p.elX-100) && (mouseY <= p.elY+50 && mouseY>= p.elY-50)){
			Monsters.splice(i,1);
			isIn = true;
		}
	}
	if (!isIn) {
	Monsters.push(new monster(mouseX, mouseY));}
	
}



function vibrate(p){
	var movement = random(-10, 5);
	p.lineX1 +=movement;
	p.lineX2 +=movement;
	p.elX +=movement;
	p.recX +=movement;
	p.trX1 +=movement;
	p.trX2 +=movement;
	p.trX3 +=movement;
	if (p.lineX1 > 800) {
		for (let p of Monsters) {
			var newBaseX = 8;
			p.lineX1 = newBaseX;
			p.lineX2 = newBaseX;
			p.elX = newBaseX;
			p.recX = newBaseX - 35;
			p.trX1 = newBaseX;
			p.trX2 = newBaseX - 50;
			p.trX3 = newBaseX + 50;
			winningX = 0;
		}
	} else if (p.lineX1 < 0) {
		var newBaseX = 8;
		p.lineX1 = newBaseX;
		p.lineX2 = newBaseX;
		p.elX = newBaseX;
		p.recX = newBaseX - 35;
		p.trX1 = newBaseX;
		p.trX2 = newBaseX - 50;
		p.trX3 = newBaseX + 50;
	}
	if (winningX<p.lineX2){
		winningX = p.lineX2;
	}
}

function spawnCircles(){
	fill(map(mouseY, 0, 800, 0, 255), map(mouseX+mouseY, 0, 800, 0, 255), map(mouseX, 0, 1600, 0, 255), 150);
	var x = random(0, 800);
	var y = random(0, 800);
	ellipse(x,y,100,100);
}
