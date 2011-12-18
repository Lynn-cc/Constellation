/**
* the main logic of the game
*/
myth.game = function(type) {
	
	// 测试火向模式>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	type = "fire";
	
	var FULL_TIME = 10;
	var gs = new GameSystem();
		variables = myth.base.vars,
		classes = myth.base.classes,
  	    cvs = variables.canvas(),
		itv = variables.interval(),
		gameInterval = null,
		isPause = false,
		isTimeout = false;
		passTime = 0;
	
	//  let's begin
	startGame(gameloop);
	/**
	* gameloop 
	*/
	function gameloop(){
		gs.render(type);
		passTime += itv / 1000;
		if(isTimeout){
			stopGame();
			myth.menu('gameover', {score: gs.getScores()});
		}
	}
	
	/** gameControl */
  function startGame(gameloop){
    isPause = false;
    gameInterval = setInterval(gameloop, itv);
    cvs.addEventListener('mousemove', mousemoveHandler, false);
    //测试时间对象暂停功能
    cvs.addEventListener('click', clickHandler, false);
  }

  function stopGame(){
    clearInterval(gameInterval);
    cvs.removeEventListener('mousemove', mousemoveHandler, false);
	cvs.removeEventListener('click', clickHandler, false);
  }
  
  function pauseGame(){
	  clearInterval(gameInterval);
	  cvs.removeEventListener('mousemove', mousemoveHandler, false);
  }
  
  /**
  * Handlers
  */
  function mousemoveHandler(e){
	  var p = new classes.Position(e.offsetX || e.pageX, e.offsetY || e.pageY);
	  gs.starsHit(p);
  }

  function clickHandler(e){
	  if (!isPause) {  
		pauseGame();
		myth.menu('pause', {callback: startGame});
	  }
  }
}