//Game variables and methods
$(function(){
    /*时间计数变量用于测试*/  var test = 0;
    var c = GLOBAL.ctx, 
        starsNumber = 20,
        backgroundImage = new Image(),
        starsObject = new GLOBAL.StarsArray(starsNumber),
        tailObject = new GLOBAL.Tail(),
        timeObject = new GLOBAL.Timer(10),
        backgroundImageSource = 'images/bg.jpg';

    function init(){
      GLOBAL.canvas.width = null || GLOBAL.width; //获取手机分辨率后设置
      GLOBAL.canvas.height = null || GLOBAL.height; 
      backgroundImage.src = backgroundImageSource;
      GLOBAL.canvas.addEventListener('mousemove', function(e){
          var p = new GLOBAL.Position(e.pageX, e.pageY);
          tailObject.add(p);
          starsHit(p);
        }, false);

      //测试时间对象暂停功能
      GLOBAL.canvas.addEventListener('click', function(e){
          timeObject.isPause() ?  timeObject.start() : timeObject.pause();
        }, false);
    }

    function gameloop(){
      c.clearRect(0, 0, GLOBAL.width, GLOBAL.height);
      c.drawImage(backgroundImage, 0, 0);
      starsDraw();
      tailDraw();
      timeDraw();
      test++;
    }

    function starsHit(ep){
      var s = starsObject.stars();
      for(var i = 0; i < s.length; i++){ 
        if(GLOBAL.Position.hit(ep, s[i].pos, s[i].width, s[i].height)){
          starsObject.remove(s[i]);
        }
      }
    }

    //GameObjectsDraw
    /*starsDraw*/
    function starsDraw(){
      starsObject.changeStatus();
      starsObject.draw();

      if(test == 300){      //测试星星数量设置函数
        starsObject.number(100);
      }else if(test == 500){
        starsObject.number(20);
      }
    }

    /*tailDraw*/
    function tailDraw(){
      tailObject.draw();

      if(test >= 100 && test % 2 === 0) //测试尾巴自动缩回
        tailObject.del();
    }

    /*timeDraw*/
    function timeDraw(){
      c.fillStyle = 'white';
      c.font = '30px Arial';
      c.fillText(timeObject.now(), 10, 40);
    }

    (function main(){
        init();
        timeObject.start(); //开始计时
        setInterval(gameloop, GLOBAL.interval);
    })();
});
