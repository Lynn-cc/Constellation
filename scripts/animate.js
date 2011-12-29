//Game entry
myth.game = function(type) {
  var STARS_NUMBER = 20,
      FULL_TIME = 10 * 1000;

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
    c.fillText('时间:' + ((FULL_TIME - passTime)/1000).toString(), screenWidth -120, 30);
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
    scoreObject.draw(score);
    starsObject.draw();
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
};

