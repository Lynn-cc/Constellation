//Game variables and methods
$(function(){
    var c = GLOBAL.ctx, 
        starsNumber = 20,
        backgroundImage = new Image(),
        starsObject = new GLOBAL.StarsArray(starsNumber),
        //tailObject = new GLOBAL.Tail(),
        timeObject = new GLOBAL.Timer(10),
        backgroundImageSource = 'images/bg.jpg',
        gameInterval = null,
        isTimeout = false,
        score = 0;

    /**
    * @initialize
    */
    function init(){
      GLOBAL.canvas.width = null || GLOBAL.width; //获取手机分辨率后设置
      GLOBAL.canvas.height = null || GLOBAL.height; 
      backgroundImage.src = backgroundImageSource;
    }

    /**
    * GameObjectsDraw
    */
    /** starsDraw */
    function starsDraw(){
      starsObject.lifeDecrease();
      starsObject.draw();
    }

    /** tailDraw */
    function tailDraw(){
      tailObject.draw();

      if(test >= 100 && test % 2 === 0) //测试尾巴自动缩回
        tailObject.del();
    }

    /** timeDraw */
    function timeDraw(){
      c.fillStyle = 'white';
      c.font = '14px Arial';
      if(timeObject.now() !== 0)
        c.fillText('时间:' + timeObject.now().toString(), GLOBAL.canvas.width -50, 20);
      else{
        c.fillText('时间:' + timeObject.now().toString(), GLOBAL.canvas.width -50, 20);
        isTimeout = true;
      }
    }

    /** scoreDraw */
    function scoreDraw(){
      c.fillStyle = 'yellow';
      c.font = '14px Arial';
      c.fillText('积分:' + score.toString(), 10, 20); 
    }

    /**
    * Handlers
    */
    function mousemoveHandler(e){
      var p = new GLOBAL.Position(e.pageX, e.pageY);
      //tailObject.add(p);
      starsHit(p);
    }

    /** stars hit handler */
    function starsHit(ep){
      var s = starsObject.stars();
      for(var i = 0; i < s.length; i++){ 
        if(GLOBAL.Position.hit(ep, s[i].pos, s[i].width, s[i].height) &&
          starsObject.changeStatus(s[i])){
          score++;
        }
      }
    }

    function clickHandler(e){
      if(timeObject.isPause()){  
        timeObject.start(); 
        startGame();
      }else{
        timeObject.pause();
        stopGame();
      }
    }

    /** gameControl */
    function startGame(){
      timeObject.start(); //开始计时
      gameInterval = setInterval(gameloop, GLOBAL.interval);
      GLOBAL.canvas.addEventListener('mousemove', mousemoveHandler, false);
      //测试时间对象暂停功能
      GLOBAL.canvas.addEventListener('click', clickHandler, false);
    }

    function stopGame(){
      clearInterval(gameInterval);
      GLOBAL.canvas.removeEventListener('mousemove', mousemoveHandler, false);
    }

    /**
    * gameloop 
    */
    function gameloop(){
      c.clearRect(0, 0, GLOBAL.width, GLOBAL.height);
      c.drawImage(backgroundImage, 0, 0);
      starsDraw();
      //tailDraw();
      timeDraw();
      scoreDraw();
      if(isTimeout){
        stopGame();
        GLOBAL.canvas.removeEventListener('click', clickHandler, false);
      }
    }

    (function main(){
        init();
        startGame();
    })();
});
