/* Ball */
function Ball(positionX, positionY, speedX, speedY) {
	this.position = {x: positionX, y: positionY};
	this.speed = {x: speedX, y: speedY};
}

Ball.prototype.move = function() {
	if (this.position.x >= field.width/2 - Player.prototype.thickness || 
			this.position.x <= -field.width/2 + Player.prototype.thickness) {
		this.speed.x *= -1;
	}
	if (this.position.y >= field.height/2 || 
			this.position.y <= -field.height/2) {
		this.speed.y *= -1;
	}
	
	this.position.x += this.speed.x;
	this.position.y += this.speed.y;
}
Ball.getBall = function(accellerationX, accellerationY) {
	if (accellerationX == undefined) {
		var accellerationX = [-1, 1][ Math.round( Math.random() )];
	}
	if (accellerationY == undefined) {
		var accellerationY = [-1, 1][ Math.round( Math.random() )];
	}
	
	if (accellerationX == 0) {
	}
	
	return new Ball(0,0, 10 * accellerationX, 10 * accellerationY);
}