/**
* the main logic of the game
*/

//  the value of setTimeout
var timeoutID;
//  main function
function main(){
	//  new a game system
	var gs = new GameSystem();
	
	//  let's begin
	start(step);
	
	//  cyclical function
	function step(){
		gs.applyChanges(getMousePosition());
		clearCanvas();
		gs.render();
	}
}
//  get the position of mouse
function getMousePosition(){
	var x = window.event.x;
	var y = window.event.y;
	var position = new GLOBAL.Position(x, y);	
	
	return position;
}
//  start game
function start(func) {
    if (GLOBAL.Timer.isPause()){
		GLOBAL.Timer.pause();	
	}

    GLOBAL.Timer.start();

    var loop = function() {
        func();
        if (!GLOBAL.Timer.isPause()){
            timeoutID = setTimeout(loop, GLOBAL.interval);
		}
    }

    loop();
}
//  stop game
function stop() {
    clearTimeout(timeoutID);
    GLOBAL.Timer.pause();
}
//  clear the main canvas
function clearCanvas() {
    if (GLOBAL.ctx != null)
        GLOBAL.ctx.clearRect(0, 0, GLOBAL.width, GLOBAL.height);
}