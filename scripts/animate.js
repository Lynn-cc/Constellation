//Game entry
myth.game = function(type) {
  var STARS_NUMBER = 10,
			FULL_SCORE = 200,
      FULL_TIME = 60 * 1000;

  var variables = myth.base.vars,
      c = variables.ctx(),
      cvs = variables.canvas(),
      screenWidth = variables.width(),
      screenHeight = variables.height(),
      itv = variables.interval(),
      classes = myth.base.classes,
      starsObject = new classes.Stars(STARS_NUMBER),
      pathObject = new classes.Path(type),
      scoreObject = new classes.Score(type),
			obstaclesObject = new classes.Obstacles(0, type),
      gameBackgroundPage = new myth.menu.pageclasses.GameBackground(),
      gameInterval = null,
			isScoreEnough = false,
      isTimeout = false,
      isPause = false,
      score = 0,
      passTime = 0;
	
	/**
	* 运行水象模式
	*/
	function startWaterMode(){
		/**
		* GameObjectsDraw
		*/
	
		/** timeDraw */
		function timeDraw(){
			c.save();
			c.fillStyle = 'white';
			c.font = '30px Arial';
			c.fillText('Time:' + Math.floor(passTime/1000).toString(), screenWidth -120, 30);
			c.restore();
		}
	
		/**
		* Handlers
		*/
		function mousemoveHandler(p) {
			var o = starsObject.isHit(p);
			if (o) {
				pathObject.add(o.pos);
	
				//判断是不是特别的星座星星
				if (o.type !== 0 && pathObject)
					score += 2;
				else
					score++;
				if (score >= FULL_SCORE) {
						score = FULL_SCORE;
						isScoreEnough = true;
				}
				myth.base.vars.sounds.hitsound.play();
			}
		}
	
	
		/** gameControl */
		function startGame() {
			isPause = false;
			gameInterval = setInterval(gameloop, itv);
			myth.base.event.hoverEvent.changeHandler(mousemoveHandler);
			myth.base.event.clickEvent.changeHandler(gameBackgroundPage, {
					start: startGame,
					stop: stopGame,
					gametype: type
			});
		}
	
		function stopGame() {
			isPause = true;
			clearInterval(gameInterval);
			myth.base.event.hoverEvent.changeHandler(null);
		}
	
		/**
		* gameloop 
		*/
		function gameloop() {
			c.clearRect(0, 0, screenWidth, screenHeight);
			pathObject.draw();
			starsObject.draw();
			obstaclesObject.drawObstacles();
			scoreObject.draw(score);
			drawProgressBar(score/FULL_SCORE, "rgba(7, 132, 160, 0.5)");
			timeDraw();
			gameBackgroundPage.show();
			passTime += itv;
			if (starsObject.remainNumber() === 0) {
				starsObject = new classes.Stars(STARS_NUMBER);
				pathObject = new classes.Path(type);
			}
			if (obstaclesObject.remainNumber() === 0) {
				obstaclesObject = new classes.Obstacles(0, type);
			}
			if (isScoreEnough) {
				stopGame();
				myth.menu.over({score: passTime/1000, gametype: type});
			}
		}
		startGame();
	}
	
	/**
	* 运行火象模式
	*/
	function startFireMode(){
		/**
		* GameObjectsDraw
		*/
	
		/** timeDraw */
		function timeDraw(){
			c.save();
			c.fillStyle = 'white';
			c.font = '30px Arial';
			if (passTime >= FULL_TIME) {
				passTime = FULL_TIME;
				isTimeout = true;
			}
			c.fillText('Time:' + Math.floor(((FULL_TIME - passTime)/1000)).toString(), screenWidth -120, 30);
			c.restore();
		}
	
		/**
		* Handlers
		*/
		function mousemoveHandler(p) {
			var o = starsObject.isHit(p);
			if (o) {
				pathObject.add(o.pos);
	
				//判断是不是特别的星座星星
				if (o.type !== 0 && pathObject)
					score += 2;
				else
					score++;
				myth.base.vars.sounds.hitsound.play();
			}
		}
	
	
		/** gameControl */
		function startGame() {
			isPause = false;
			gameInterval = setInterval(gameloop, itv);
			myth.base.event.hoverEvent.changeHandler(mousemoveHandler);
			myth.base.event.clickEvent.changeHandler(gameBackgroundPage, {
					start: startGame,
					stop: stopGame,
					gametype: type
			});
		}
	
		function stopGame() {
			isPause = true;
			clearInterval(gameInterval);
			myth.base.event.hoverEvent.changeHandler(null);
		}
	
		/**
		* gameloop 
		*/
		function gameloop() {
			c.clearRect(0, 0, screenWidth, screenHeight);
			gameBackgroundPage.show();
			pathObject.draw();
			starsObject.draw();
			scoreObject.draw(score);
			drawProgressBar(passTime/FULL_TIME, "rgba(170, 16, 24, 0.5)");
			timeDraw();
			passTime += itv;
			if (starsObject.remainNumber() === 0) {
				starsObject = new classes.Stars(STARS_NUMBER);
				pathObject = new classes.Path(type);
			}
			if (isTimeout) {
				stopGame();
				myth.menu.over({score: score, gametype: type});
			}
		}
		startGame();
	}
	
	/**
	* 运行土象模式
	*/
	function startEarthMode(){
		
	}
	
	/**
	* 运行风象模式
	*/
	function startWindMode(){
		
	}
	
	/**
	* 绘制进度条
	*/
	function drawProgressBar(progress, color){
		c.save();
		
		c.beginPath();
		c.moveTo(41, 20);
		c.lineTo(41 + 126, 20);
		c.arc(41 + 126, 20 + 44/2, 44 / 2, Math.PI * 3 / 2, Math.PI / 2, false);
		c.lineTo(41, 20 + 44);
		c.arc(41, 20 + 44/2, 44 / 2, Math.PI / 2, Math.PI * 3 / 2, false);
		c.clip();
		c.fillStyle = color;
		c.fillRect(20, 20, 170 * progress, 44);
		
		c.restore();
	}
	
	/**
	* 选择模式
	*/
	switch(type){
		case "water":
			startWaterMode();
			break;
		case "fire":
			startFireMode();
			break;
		case "earth":
			startEarthMode();
			break;
		case "wind":
			startWindMode();
			break;
		default:
			alert("未定义模式");
			break;	
	}
};
