var field = { width: 1100, height: 800};
var game = null;

(function() {
	var drawingContext;
	
	$(document).ready(function() {
		var renderTarget = document.getElementById('gamefield');
		
		game = new Game(renderTarget);
		renderGame();
	});
	
	function renderGame() {
		game.render(renderGame);
	}
	
})();