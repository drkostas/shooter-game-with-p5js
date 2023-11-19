class player {
	constructor(x, y, scale){
		this.scale = scale;
		this.bodyHeight = 20*this.scale;
		this.bodyWidth = 60*this.scale;
		this.gunBaseHeight = -this.bodyWidth/4;
		this.gunBaseWidth = this.bodyWidth/3;
		this.tireR = this.bodyWidth/6;
		this.gunHeight = this.bodyHeight/3;
		this.gunWidth = this.bodyWidth;
		this.init(x, y);
	}

	init(x, y){
		this.centerX = x;
		this.centerY = y;
		this.body();
		this.tires();
		this.gunBase();
		this.gun();
		this.bumper();
	}

	body(){
		this.bodyX1 = this.centerX - this.bodyWidth/2;
		this.bodyY1 = this.centerY + this.bodyHeight/2;
		this.bodyX2 = this.centerX + this.bodyWidth/2;
		this.bodyY2 = this.centerY - this.bodyHeight/2;
	}

	tires(){
		this.tire1X = this.bodyX1 + this.tireR*2;
		this.tire2X = this.bodyX2 - this.tireR*2;
		this.tireY = this.bodyY1;
	}

	bumper(){
		this.bumperUpX = this.bodyX1;
		this.bumperUpY = this.bodyY1;
		this.bumperDownX = this.bodyX1;
		this.bumperDownY = this.bodyY2;
		this.bumperFrontX = this.gunX - this.gunWidth;
		this.bumperFrontY = this.bumperUpY - (this.bumperUpY - this.bumperDownY)/2;
	}

	gunBase(){
		this.gunBaseX = this.bodyX1 + this.gunBaseWidth;
		this.gunBaseY = this.bodyY2;
	}

	gun(){
		this.gunX = this.gunBaseX + this.gunBaseWidth;
		this.gunY = this.gunBaseY + this.gunBaseHeight;
	}

	shoot(){
		Bullets.push(new bullet(this.bumperFrontX, this.gunY, this.gunHeight, this.scale, 5/scl));
		// console.log("bullet speed: ", 5/scl);
	}

	show(y){
		if (y>=canvasY+23) {
			y = canvasY+23;
		}
		else if (y<=33){
			y = 33;
		}
		this.init(this.centerX, y);
		stroke(72, 160, 48);
		fill(72, 160, 48, 220);		
		quad(this.bodyX1,this.bodyY1,this.bodyX1,this.bodyY2,this.bodyX2,this.bodyY2,this.bodyX2,this.bodyY1); // body
		stroke(210, 80, 48);
		fill(210, 80, 48, 220);
	  	rect(this.gunBaseX,this.gunBaseY,this.gunBaseWidth,this.gunBaseHeight); // gunBase
		stroke(81, 76, 67);
		fill(81, 76, 67, 220);
		ellipse(this.tire1X, this.tireY, this.tireR, this.tireR); // tire1
		ellipse(this.tire2X, this.tireY, this.tireR, this.tireR); // tire2
		stroke(160, 48, 48);
		fill(160, 48, 48, 220);
		quad(this.gunX,this.gunY,this.gunX,this.gunY-this.gunHeight,this.gunX-this.gunWidth,this.gunY-this.gunHeight,this.gunX-this.gunWidth,this.gunY); // gun
		stroke(160, 158, 48);
		fill(160, 158, 48, 220);
	  	triangle(this.bumperUpX,this.bumperUpY,this.bumperDownX,this.bumperDownY,this.bumperFrontX,this.bumperFrontY); // body
	  	// fill(3, 119, 145, 40);
	  	// quad(this.getLeftSide(),this.getTopSide(),this.getLeftSide(),this.getBottomSide(),this.getRightSide(),this.getBottomSide(),this.getRightSide(),this.getTopSide());
	}
}