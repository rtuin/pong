/* The actual game. This part renders using WebGL */
function Game (container) {
	this.container = container;
	this.players = [];
	
	// Initate Three.js, the 3d engine
	this.scene = new THREE.Scene();

	this.prepareEvents();
	this.prepareGameObjects();
	this.prepareScene();
	
	this.updateScores();
	
	this.renderer = new THREE.WebGLRenderer(); 
	this.renderer.setSize( container.clientWidth, container.clientHeight );
	
	// Add the renderer to the DOM
	container.appendChild(this.renderer.domElement);
}

Game.prototype.prepareEvents = function() {
	document.addEventListener('keydown', (function(data) {
		for (playerIndex in this.players) {
			this.players[playerIndex].handleKeyCode(data.keyCode, true);
		}
	}).bind(this));
	
	document.addEventListener('keyup', (function(data) {
		for (playerIndex in this.players) {
			this.players[playerIndex].handleKeyCode(data.keyCode, false);
		}
	}).bind(this));
}

// This method prepares the game objects like players, balls, and other settings.
Game.prototype.prepareGameObjects = function() {
	this.players = [new Player('Player', -field.width/2, 0), new Player('Computer', field.width/2, 0)];
}

// This method prepares all the objects that needs to be drawn to the scene
Game.prototype.prepareScene = function() {
	
	this.camera = new THREE.Camera( 45, this.container.clientWidth / this.container.clientHeight, 1, 2000 );
	this.camera.position.y = 0;
	this.camera.position.z = 1000;
	
	this.scene.addLight(new THREE.AmbientLight( 0x202020 ));
	
	// Set a box around the play field
	var materials = [new THREE.MeshLambertMaterial( { color: 0x00cc00, opacity: 0.5 } )];
	var mesh = new THREE.Mesh( new Cube( field.width - 50, 5, 100, 1, 1, 1 ), materials );
	mesh.position.x = 0;
	mesh.position.y = -field.height/2;
	mesh.position.z = 0;
	this.scene.addObject(mesh);
	
	var mesh = new THREE.Mesh( new Cube( field.width - 50, 5, 100, 1, 1, 1 ), materials );
	mesh.position.x = 0;
	mesh.position.y = field.height/2;
	mesh.position.z = 0;
    this.scene.addObject(mesh);

	// Prepare player objects
	this.playerMeshes = []; // for players 0 to 1
	for (playerIndex in this.players) {
		var player = this.players[playerIndex];

		var materials = [new THREE.MeshLambertMaterial( { color: 0x00cc00 } ),
		                 new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true, opacity: 0.5 } )];
		
		var mesh = new THREE.Mesh( new Cube( player.thickness, player.height, player.width, 2, 2, 2 ), materials );
		mesh.position.x = player.position.x;
		mesh.position.y = player.position.y;
		mesh.position.z = 0;
		
        this.scene.addObject(mesh);
        this.playerMeshes.push(mesh);
	}
	
	// Prepare ball objects
	this.resetBalls();
	
}

Game.prototype.updateScene = function() {
	for (ballIndex in this.balls) {
		var ball = this.balls[ballIndex];
		
		// Let the ball do one step
		ball.move();
		
		this.moveComputerPlayer();
		
		// See if any of the balls was behind any of the players...
		// And if so, give all the other players a point.
		for (playerIndex in this.players) {
			this.players[playerIndex].hitTest(ball, function() {
				this.playerFailed(playerIndex);
				this.removeBalls();
				setTimeout(this.resetBalls.bind(this), 2000);
			}.bind(this));
		}
		
		this.ballMeshes[ballIndex].position.x = ball.position.x;
		this.ballMeshes[ballIndex].position.y = ball.position.y;
	}
	
	// Set the player's positions
	for (playerIndex in this.players) {
		var player = this.players[playerIndex];
		
		//Move the player object
		
		if (player.upPressed) {
			if ((player.position.y + player.height/2) + player.speed < field.height/2) {
				player.position.y += player.speed;
			}
		}
		
		if (player.downPressed) {
			if ((player.position.y - player.height/2) - player.speed > -field.height/2) {
				player.position.y -= player.speed;
			}
		}
		
		var playerMesh = this.playerMeshes[playerIndex];
		playerMesh.position.y = player.position.y;
	}
	
//	var timer = new Date().getTime() * 0.0001;
//	 
//	this.camera.position.x = Math.cos( timer ) * 1000;
//	this.camera.position.z = Math.sin( timer ) * -1500;
}

Game.prototype.moveComputerPlayer = function() {
	var player = this.players[1];
	if (this.balls.length == 0) {
		return;
	}
	//This needs some tweaking.
	if (this.players[1].position.y > this.balls[0].position.y) {
		player.handleKeyCode(40, 1);
		player.handleKeyCode(38, 0);
	} 
	else {
		player.handleKeyCode(38, 1);
		player.handleKeyCode(40, 0);
	}
}

Game.prototype.removeBalls = function() {
	this.balls = [];
	for (ballIndex in this.ballMeshes) {
		this.scene.removeObject(this.ballMeshes[ballIndex]);
	}
}

Game.prototype.resetBalls = function() {

	this.balls = [Ball.getBall()];
	this.ballMeshes = [];
	for (ballIndex in this.balls) {
		var ball = this.balls[ballIndex];
		
		var materials = [new THREE.MeshLambertMaterial( { color: 0x00ff00 } )];
		
		var mesh = new THREE.Mesh( new Sphere( 10, 10, 10, 1, 1, 1 ), materials );
		mesh.position.x = ball.position.x;
		mesh.position.y = ball.position.y;
		mesh.position.z = 0;
		
        this.scene.addObject(mesh);
        this.ballMeshes.push(mesh);
	}
}

Game.prototype.playerFailed = function(player) {
	for (playerIndex in this.players) {
		if (playerIndex == player) continue;
		this.players[playerIndex].score++;
	}
	this.updateScores();
}

// This method causes the scene to be re-rendered.
Game.prototype.render = function(callback) {
	
	this.updateScene();
	
	this.renderer.render(this.scene, this.camera);
	if (callback) {
		setTimeout(callback, 33);
	}
}

Game.prototype.updateScores = function () {
	$('#scores').html('');
	for (playerIndex in this.players) {
		var player =  this.players[playerIndex];
		$('#scores').append('<div>' + player.name + '<span>' + player.score + '</span></div>');
	}
}
