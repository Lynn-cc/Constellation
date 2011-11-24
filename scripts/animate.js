//Game variables and methods
$(function(){
    /*测试1*/  var test = 0;
    var c = GLOBAL.ctx, 
        starsNumber = 20,
        backgroundImage = new Image(),
        starsObject = new GLOBAL.StarsArray(starsNumber),
        tailObject = new GLOBAL.Tail();
        backgroundImageSource = 'images/bg.jpg';

    function init(){
      GLOBAL.canvas.width = null || GLOBAL.width; //获取手机分辨率后设置
      GLOBAL.canvas.height = null || GLOBAL.height; 
      backgroundImage.src = backgroundImageSource;
      GLOBAL.canvas.addEventListener('mousemove', function(e){
          tailObject.add(new GLOBAL.Position(e.clientX, e.clientY));
        }, false);
    }

    function gameloop(){
      c.clearRect(0, 0, GLOBAL.width, GLOBAL.height);
      c.drawImage(backgroundImage, 0, 0);
      starsDraw();
      tailDraw();
    }

    //GameObjectsDraw
    /*starsDraw*/
    function starsDraw(){
      var that = starsObject;
      that.changeStatus();
      that.draw();

      /*测试1*/
      if(test == 300){
        that.number(100);
      }else if(test == 400){
        that.number(20);
      }
      test++;
    }

    function tailDraw(){
      tailObject.draw();

      if(test >= 100 && test % 3 === 0) //测试2
        tailObject.del();
    }

    (function main(){
        init();
        setInterval(gameloop, GLOBAL.interval);
    })();
});
