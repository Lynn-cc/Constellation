/**
* GameSystem class
*/
function GameSystem(){
	var ctx = GLOBAL.ctx, 
        starsNumber = 20,
        backgroundImage = new Image(),
        starsObject = new GLOBAL.StarsArray(starsNumber),
        pathObject = new GLOBAL.Path(),
        backgroundImageSource = 'images/background.jpg',
        score = 0;
		
	/***********************************************************************************************************
	//	elements container
	var gameElements = [];
	
	//  add new element
	this.add = function(gameElement){
		if(gameElement){
			gameElements.push(gameElement);
		}
	}
	//  remove the element from the container
	this.remove = function(index){
		if (gameElements.length > 1){
            gameElements[index] = gameElements[gameElements.length - 1];
        	gameElements.pop();	
		}
	}
	*************************************************************************************************************/
	
	/**
	* public
	*/
	/**
	* @initialize
	*/
	this.init = function(){
	  backgroundImage.src = backgroundImageSource;
	}
	
	//  render all of the elements
	this.render = function(type){
		ctx.clearRect(0, 0, GLOBAL.width, GLOBAL.height);
		ctx.drawImage(backgroundImage, 0, 0);
		switch(type){
			case "fire":
				renderFire();
				break;
			case "wind":
				renderWind();
				break;
			case "water":
				renderWater();
				break;
			case "soil":
				renderSoil();
				break;
			default:
				alert("未定义游戏模式！");
		}
	}
	// 实现火向模式
	function renderFire(){
		/**********************************************************************************************************
		for(var e in gameElements){
			var element = gameElements[e];
			element.draw();	
		}
		***********************************************************************************************************/
		
		starsDraw();
		pathDraw();
		timeDraw();
		scoreDraw();
	}
	// 实现风向模式
	function renderWind(){
		
	}
	// 实现水向模式
	function renderWater(){
		
	}
	// 实现土向模式
	function renderSoil(){
			
	}
	
	/**
	* private
    * GameObjectsDraw
    */
    /** starsDraw */
    function starsDraw(){
		if(starsObject.remainNumber() === 0){
			starsObject = new GLOBAL.StarsArray(starsNumber);
			pathObject = new GLOBAL.Path();
		}
		starsObject.lifeDecrease();
		starsObject.draw();
    }

    /** pathDraw */
    function pathDraw(){
    	pathObject.draw();
    }

    /** timeDraw */
    function timeDraw(){
		ctx.fillStyle = 'white';
		ctx.font = '14px Arial';
		if(timeObject.now() !== 0)
			ctx.fillText('时间:' + timeObject.now().toString(), GLOBAL.canvas.width -50, 20);
		else{
			ctx.fillText('时间:' + timeObject.now().toString(), GLOBAL.canvas.width -50, 20);
			isTimeout = true;
		}
    }

    /** scoreDraw */
    function scoreDraw(){
		ctx.fillStyle = 'yellow';
		ctx.font = '14px Arial';
		ctx.fillText('积分:' + score.toString(), 10, 20); 
    }
	
	/** stars hit handler */
    function starsHit(ep){
		var b = starsObject.isHit(ep);
		if(b != -1 && starsObject.changeStatus(b)) {
			pathObject.add(starsObject.pos(b));
			score++;
		} else {
			pathObject.last(ep);
		}
    }
	
	/**
    * Handlers
    */
    this.mousemoveHandler = function(e){
		var p = new GLOBAL.Position(e.offsetX || e.pageX, e.offsetY || e.pageY);
		starsHit(p);
    }

    this.clickHandler = function(e){
		if(!timeObject.isPause()){
			timeObject.pause();
			stopGame();
			var p = MENU.show('pause');
			p.show(startGame);
		}
    }
}