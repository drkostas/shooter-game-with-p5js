class bullet {
	constructor(x, y, height, scale, speed){
		this.scale = scale;
		this.speed = speed;
		this.bodyHeight = height;
		this.bodyWidth = 5*this.scale;
		this.init(x, y);
	}

	init(x, y){
		this.centerX = x;
		this.centerY = y;
		this.body();
		// this.bumper();
	}

	body(){
		this.bodyX1 = this.centerX - this.bodyWidth/2;
		this.bodyY1 = this.centerY + this.bodyHeight/2;
		this.bodyX2 = this.centerX + this.bodyWidth/2;
		this.bodyY2 = this.centerY - this.bodyHeight/2;
	}

	// bumper(){
	// 	this.bumperUpX = this.bodyX1;
	// 	this.bumperUpY = this.bodyY1;
	// 	this.bumperDownX = this.bodyX1;
	// 	this.bumperDownY = this.bodyY2;
	// 	this.bumperFrontX = this.gunX - this.gunWidth;
	// 	this.bumperFrontY = this.bumperUpY - (this.bumperUpY - this.bumperDownY)/2;
	// }

	show(){
		this.centerX -= this.speed;
		this.init(this.centerX, this.centerY);
		stroke(198, 41, 41);
		fill(198, 41, 41, 220);
		quad(this.bodyX1,this.bodyY1,this.bodyX1,this.bodyY2,this.bodyX2,this.bodyY2,this.bodyX2,this.bodyY1); // body
		// stroke(210, 80, 48);
		// fill(210, 80, 48, 220);
	 //  	rect(this.gunBaseX,this.gunBaseY,this.gunBaseWidth,this.gunBaseHeight); // gunBase
		// stroke(81, 76, 67);
		// fill(81, 76, 67, 220);
		// ellipse(this.tire1X, this.tireY, this.tireR, this.tireR); // tire1
		// ellipse(this.tire2X, this.tireY, this.tireR, this.tireR); // tire2
		// stroke(160, 48, 48);
		// fill(160, 48, 48, 220);
		// quad(this.gunX,this.gunY,this.gunX,this.gunY-this.gunHeight,this.gunX-this.gunWidth,this.gunY-this.gunHeight,this.gunX-this.gunWidth,this.gunY); // gun
		// stroke(160, 158, 48);
		// fill(160, 158, 48, 220);
	 //  	triangle(this.bumperUpX,this.bumperUpY,this.bumperDownX,this.bumperDownY,this.bumperFrontX,this.bumperFrontY); // body
	 //  	// fill(3, 119, 145, 40);
	  	// quad(this.getLeftSide(),this.getTopSide(),this.getLeftSide(),this.getBottomSide(),this.getRightSide(),this.getBottomSide(),this.getRightSide(),this.getTopSide());
	}
}