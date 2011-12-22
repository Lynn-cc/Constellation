/**
* GameSystem class
*/
function GameSystem(){
	var STARS_NUMBER = 20,
        FULL_TIME = 10;

  var variables = myth.base.vars,
      c = variables.ctx(),
      screenWidth = variables.width(),
      screenHeight = variables.height(),
      bg = variables.background(),
      classes = myth.base.classes,
      starsObject = new classes.Stars(STARS_NUMBER),
      pathObject = new classes.Path(),
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
	//  render all of the elements
	this.render = function(type){
		c.save();
		c.clearRect(0, 0, screenWidth, screenHeight);
		c.drawImage(bg, 0, 0);
		c.restore();
		
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
			case "earth":
				renderSoil();
				break;
			default:
				alert("未定义游戏模式！");
		}
	}
	/** stars hit handler */
	this.starsHit = function(ep){
		var o = starsObject.isHit(ep);
		if (o) {
			pathObject.add(o.pos);
			//判断是不是特别的星座星星
			if (o.type !== 0)
			  score += 2;
			else
			  score++;
		} 
//	    else {
//	      pathObject.last(ep);
//	    }
	}
	/** get scores */
	this.getScores = function(){
		return score;	
	}
	
	/**
	* private
	*/
	// 实现火向模式
	function renderFire(){
		/**********************************************************************************************************
		for(var e in gameElements){
			var element = gameElements[e];
			element.draw();	
		}
		***********************************************************************************************************/
		
		pathDraw();
		starsDraw();
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
	function renderEarth(){
			
	}
	
	/**
	* private
    * GameObjectsDraw
    */
    /** starsDraw */
    function starsDraw(){
		if (starsObject.remainNumber() === 0) {
			starsObject = new classes.Stars(STARS_NUMBER);
			pathObject = new classes.Path();
		}
		//starsObject.lifeDecrease();
		starsObject.draw();
    }

    /** pathDraw */
    function pathDraw(){
    	pathObject.draw();
    }

    /** timeDraw */
	function timeDraw(){
	  c.save();
	  c.fillStyle = 'white';
	  c.font = '30px Arial';
	  if (passTime >= FULL_TIME) {
		passTime = FULL_TIME;
		isTimeout = true;
	  }
	  c.fillText('时间:' + Math.ceil(FULL_TIME - passTime).toString(), screenWidth -120, 30);
	  c.restore();
	}
  
	/** scoreDraw */
	function scoreDraw(){
	  c.save();
	  c.fillStyle = 'yellow';
	  c.font = '30px Arial';
	  c.fillText('积分:' + score.toString(), 10, 30); 
	  c.restore();
	}
  }