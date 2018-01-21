class monster {
	constructor(x, y, scale, speed){
		this.scale = scale;
		this.speed = speed;
		this.radXhead = 100 * this.scale;
		this.radYhead = 50 * this.scale;
		this.radeye = 20 * this.scale;
		this.radXmouth = 10 * this.scale;
		this.radYmouth = 10 * this.scale;
		this.radXhand = 70 * this.scale;
		this.radYhand = 5 * this.scale;
		this.init(x + this.radXhead/2, y);
	}

	init(x, y){
		this.centerX = x;
		this.centerY = y;
		this.head();
		this.eye();
		this.mouth();
		this.neck();
		this.hand();
		this.body();
		this.legs();
	}

	head(){
		this.headX = this.centerX;
		this.headY = this.centerY;
	}

	eye(){
		this.eyeX = this.headX + this.radXhead/2 - 10 * this.scale;
		this.eyeY = this.headY - this.radYhead/5;
	}

	mouth(){
		this.mouthX = this.headX + this.radXhead/2 - 12 * this.scale;
		this.mouthY = this.headY + this.radYhead/5;
	}

	neck(){
		this.neckX1 = this.centerX;
		this.neckY1 = this.centerY + this.radYhead/2;
		this.neckX2 = this.centerX;
		this.neckY2 = this.neckY1 + 15 * this.scale;
	}

	hand(){
		this.handX = this.centerX - 5 * this.scale;
		this.handY = this.neckY2;
	}

	body(){
		this.bodyX1 = this.centerX;
		this.bodyY1 = this.handY + this.radYhand;
		this.bodyX2 = this.centerX - 25 * this.scale;
		this.bodyY2 = this.handY + 70 * this.scale;
		this.bodyX3 = this.centerX + 15 * this.scale;
		this.bodyY3 = this.handY + 95 * this.scale;	
	}

	legs(){
		this.leg1x1 = this.bodyX3 - 15 * this.scale;
		this.leg1y1 = this.bodyY3 - 10 * this.scale;
		this.leg1x2 = this.leg1x1 - 20 * this.scale;
		this.leg1y2 = this.leg1y1 + 20 * this.scale;

		this.leg2x1 = this.leg1x1 - 11.5 * this.scale;
		this.leg2y1 = this.leg1y1 - 7 * this.scale;
		this.leg2x2 = this.leg2x1 - 20 * this.scale;
		this.leg2y2 = this.leg2y1 + 20 * this.scale;
	}

	getLeftSide(){
		return this.headX - this.radXhead/2;
	}

	getRightSide(){
		return this.handX + this.radXhand;
	}

	getTopSide(){
		return this.headY - this.radYhead/2;;
	}

	getBottomSide(){
		return this.leg1y2;
	}

	intersecting(x, y){
		return ((x>=this.getLeftSide() && x<=this.getRightSide()) && (y>=this.getTopSide() && y<=this.getBottomSide()));
	}

	isKilled(blt){
		return (this.intersecting(blt.bodyX1, blt.bodyY1) && this.intersecting(blt.bodyX1, blt.bodyY2));
	}

	walk(canvasLength){
		let touched = "no";
		this.init(this.centerX + speed, this.centerY);
		let right = this.getRightSide();
		let left = this.getLeftSide();
		if (right > canvasLength) {
			touched = "right";
		}
		else if (left < 0) {
			touched = "left";
		}
		return touched;
	}

	vibrate(){
		let movementX = random(-10, 5);
		let movementY = random(-40*this.scale, 40*this.scale);
		this.centerX += movementX;
		if ((this.centerY + movementY<=canvasY-50*this.scale) && (this.centerY + movementY>=50*this.scale)) {
			this.centerY += movementY;			
		}
		this.init(this.centerX, this.centerY);
	}


	show(){
		stroke(255,164,99);
	  	line(this.neckX1, this.neckY1, this.neckX2, this.neckY2); // neck
	  	line(this.leg1x1, this.leg1y1, this.leg1x2, this.leg1y2); // leg1
	  	line(this.leg2x1, this.leg2y1, this.leg2x2, this.leg2y2); // leg2
		noStroke();
		fill(255,164,99, 255);		
		ellipse(this.headX, this.headY, this.radXhead, this.radYhead); // head
		fill(80,165,255, 255);
		ellipse(this.eyeX, this.eyeY, this.radeye, this.radeye); // eye
		fill(0,0,0, 255);
		ellipse(this.mouthX, this.mouthY, this.radXmouth, this.radYmouth); // mouth
		fill(255,164,99, 255);
	  	rect(this.handX,this.handY, this.radXhand, this.radYhand, 90); // hands
	  	fill(3, 119, 145, 255);
	  	triangle(this.bodyX1,this.bodyY1,this.bodyX2,this.bodyY2,this.bodyX3,this.bodyY3); // body
	  	// fill(50, 50, 50, 70);
	  	// quad(this.getLeftSide(),this.getTopSide(),this.getLeftSide(),this.getBottomSide(),this.getRightSide(),this.getBottomSide(),this.getRightSide(),this.getTopSide());
	}
}