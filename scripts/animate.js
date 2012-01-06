//Game entry
myth.game = function(type) {
  var STARS_NUMBER = 10,
      FULL_SCORE = 50,
      FULL_TIME = 10 * 1000,
      FULL_HITNUMBER = 5,
      FULL_STARLOST = 20;

  var variables = myth.base.vars,
      c = variables.ctx(),
      cvs = variables.canvas(),
      screenWidth = variables.width(),
      screenHeight = variables.height(),
      itv = variables.interval(),
      classes = myth.base.classes,
      starsObject = new classes.Stars(STARS_NUMBER),
      pathObject = new classes.Path(type),
      progressObject = new classes.ProgressBar(type),
      obstaclesObject = new classes.Obstacles(type),
      gameBackgroundPage = new myth.menu.pageclasses.GameBackground(),
      gameInterval = null,
      isScoreEnough = false,
      isTimeout = false,
      isHitEnough = false,
      isStarLostOver = false,
      isPause = false,
      score = 0,
      passTime = 0,
      hitNumber = 0,
      lostStarNum = 0;
      
  
  /**
  * 运行水象模式
  */
  function startWaterMode(){
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
      progressObject.drawNumber(passTime/1000);
      progressObject.drawProgressBar(score/FULL_SCORE);
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
      progressObject.drawNumber(score);
      progressObject.drawProgressBar(passTime/FULL_TIME);
      passTime += itv;
      if (starsObject.remainNumber() === 0) {
        starsObject = new classes.Stars(STARS_NUMBER);
        pathObject = new classes.Path(type);
      }
      if (passTime >= FULL_TIME) {
        passTime = FULL_TIME;
        isTimeout = true;
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
    /**
    * Handlers
    */
    function mousemoveHandler(p) {
      var so = starsObject.isHit(p);
      var oo = obstaclesObject.isHit(p);
      
      if (so) {
        pathObject.add(so.pos);
        
        //判断是不是特别的星座星星
        if (so.type !== 0 && pathObject)
          score += 2;
        else
          score++;
        myth.base.vars.sounds.hitsound.play();
      }
      
      if (oo) {
        hitNumber++;
        if (hitNumber >= FULL_HITNUMBER) {
          hitNumber = FULL_HITNUMBER;
          isHitEnough = true; 
        } 
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
      progressObject.drawNumber(score);
      progressObject.drawProgressBar(hitNumber/FULL_HITNUMBER);
      gameBackgroundPage.show();
      if (starsObject.remainNumber() === 0) {
        starsObject = new classes.Stars(STARS_NUMBER);
        pathObject = new classes.Path(type);
      }
      if (obstaclesObject.remainNumber() === 0) {
        obstaclesObject = new classes.Obstacles(type);
      }
      if (isHitEnough) {
        stopGame();
        myth.menu.over({score: score, gametype: type});
      }
    }
    startGame();
  }
  
  /**
  * 运行风象模式
  */
  function startWindMode(){
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
      progressObject.drawNumber(score);
      progressObject.drawProgressBar(lostStarNum/FULL_STARLOST);
      passTime += itv;
      if (starsObject.remainNumber() === 0) {
        lostStarNum += starsObject.lostNumber();
        starsObject = new classes.Stars(STARS_NUMBER);
        pathObject = new classes.Path(type);
      }
      if (lostStarNum >= FULL_STARLOST) {
        lostStarNum = FULL_STARLOST;
        isStarLostOver = true;
      }
      if (isStarLostOver) {
        stopGame();
        myth.menu.over({score: score, gametype: type});
      }
    }
    startGame();
  }
  
  /**
  * 选择模式
  */
  switch (type) {
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
