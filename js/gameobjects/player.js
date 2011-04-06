/* Player */
function Player(name, startX, startY) {
	this.name = name;
	
	if (startX > 0) {
		startX -= this.thickness;
	}
	else {
		startX += this.thickness;
	}
	
	this.position = { x: startX, y: startY };
	this.score = 0;
}

Player.prototype.hitTest = function(ball, isHitCallback) {
	if ((this.position.x < 0 && ball.position.x <= this.position.x + this.thickness) || 
			(this.position.x > 0 && ball.position.x >= this.position.x - this.thickness)) {
		if (ball.position.y > this.position.y + this.height/2 ||
			ball.position.y < this.position.y - this.height/2) {
			if(isHitCallback) {
				isHitCallback();
			}
		}
	}
}

Player.prototype.handleKeyCode = function(keyCode) {
	switch (keyCode) {
		case 38:
			if ((this.position.y + this.height/2) + this.speed < field.height/2) {
				this.position.y += this.speed;
			}
		break;
		case 40:
			if ((this.position.y - this.height/2) - this.speed > -field.height/2) {
				this.position.y -= this.speed;
			}
		break;
	}
}

// Default values
Player.prototype.speed = 10;
Player.prototype.width = 50;
Player.prototype.height = 100;
Player.prototype.thickness = 10;