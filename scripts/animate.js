//Game entry
myth.game = function(type) {
  var STARS_NUMBER = 20,
      FULL_TIME = 10;

  var variables = myth.base.vars,
      c = variables.ctx(),
      cvs = variables.canvas(),
      screenWidth = variables.width(),
      screenHeight = variables.height(),
      bg = variables.background(),
      itv = variables.interval(),
      classes = myth.base.classes,
      starsObject = new classes.Stars(STARS_NUMBER),
      pathObject = new classes.Path(type),
      gameBackgroundPage = new myth.menu.pageclasses.GameBackground(),
      gameInterval = null,
      isTimeout = false,
      isPause = false,
      score = 0,
      passTime = 0;

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

  /**
  * Handlers
  */
  function mousemoveHandler(p) {
    var o = starsObject.isHit(p);
    if (o) {
      if (pathObject)
        pathObject.add(o.pos);
      else
        o.clear();

      //判断是不是特别的星座星星
      if (o.type !== 0 && pathObject) {
        score += 2;
        starsObject = new classes.Stars(STARS_NUMBER * 3);
        pathObject = null;
        setTimeout(function() {
            starsObject = new classes.Stars(STARS_NUMBER);
            pathObject = new classes.Path(type);
          }, 1500);
      }
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
    if (pathObject)
      pathObject.draw();
    starsObject.draw();
    timeDraw();
    scoreDraw();
    passTime += itv / 1000;
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
};

