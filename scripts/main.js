/**
* the main logic of the game
*/
function startGame(type) {
	
	// 测试火向模式>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	type = "fire";
	
	var gs = new GameSystem();
		gameInterval = null,
		timeObject = new GLOBAL.Timer(10),
		isTimeout = false;
	
	gs.init();
	//  let's begin
	start(gameloop);
	/**
	* gameloop 
	*/
	function gameloop(){
		gs.render(type);
		if(isTimeout){
			stop();
			var p = MENU.show('gameover');
			p.show(gs.score);
		}
	}
	
	/** gameControl */
    function start(gameloop){
		timeObject.start(); //开始计时
		gameInterval = setInterval(gameloop, GLOBAL.interval);
		GLOBAL.canvas.addEventListener('mousemove', gs.mousemoveHandler, false);
		//测试时间对象暂停功能
		//GLOBAL.canvas.addEventListener('click', clickHandler, false);
    }

    function stop(){
		clearInterval(gameInterval);
		GLOBAL.canvas.removeEventListener('mousemove', gs.mousemoveHandler, false);
		//GLOBAL.canvas.removeEventListener('click', clickHandler, false);
    }
}