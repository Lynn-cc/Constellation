//myth namespace
var myth = {};
myth.base = {};
myth.init = function() {
  var v = myth.base.vars,
      cvs =v.canvas(),
      evt = myth.base.event,
      s = v.sounds.bgsound;

  document.getElementsByTagName('body')[0].style.cssText = '-webkit-transform: scale(' + v.scaleX() + ', ' + v.scaleY() + ');';
  cvs.width = v.width();
  cvs.height = v.height();
  cvs.onclick = evt.clickEvent.handler;
  cvs.onmousedown = cvs.ontouchstart = function(e) {
    cvs.onmousemove = cvs.ontouchmove = evt.hoverEvent.handler;
  };

  s.play(); 
};

myth.base.vars = (function() {
        var h = document.getElementsByTagName('html')[0],
            screenW = parseInt(getComputedStyle(h, null)['width'], 10),
            screenH = parseInt(getComputedStyle(h, null)['height'], 10);
        
    var interval_ = 1000 / 25,
        canvas_ = document.getElementById('main'),
        ctx_ = document.getElementById('main').getContext('2d'),
        width_ = 960,
        height_ = 640,
        scaleX_ = screenW / width_,
        scaleY_ = screenH / height_,
        backgroundMusic_ = new Audio('./sounds/bgsound.mp3'),
        hitsound_ = new Audio('./sounds/hit.wav'),
        src_ = './images/pic.png';

  backgroundMusic_.loop = true;
  backgroundMusic_.preload = 'metadata';

    var srcPos_ = {
      stars: function(i) {
        return {
          x: i * 140,
          y: 0,
          width: 134, 
          height: 131
        }; 
      },
      logo1: {x: 0, y: 150, width: 553, height: 186},
      logo2: {x: 560, y: 150, width: 401, height: 136},
      logo3: {x: 980, y: 150, width: 300, height: 103},
      backGame: {x: 1400, y:140, width: 208, height: 61},
      retry: {x: 1680, y: 140, width: 208, height: 62},
      again: {x: 1400, y: 250, width: 207, height: 61},
      prePage: {x: 1680, y: 250, width: 69, height: 23},
      nextPage: {x: 1820, y: 250, width: 70, height: 22},
      back: {x: 1920, y: 0, width: 48, height: 47},
      home: {x: 1920, y: 60, width: 47, height: 49},
      pause: {x: 1920, y: 120, width: 45, height: 47},
      on: {x: 1920, y: 180, width: 61, height: 51},
      off: {x: 1920, y: 240, width: 61, height: 51},
      water: {x: 0, y: 400, width: 304, height: 80},
      fire: {x: 420, y: 400, width: 304, height: 80},
      earth: {x: 800, y: 400, width:304, height: 80},
      wind: {x: 1120, y: 400, width: 304, height: 80},
      start: {x: 1680, y: 300, width: 270, height: 81},
      help: {x: 1680, y: 400, width: 270, height: 81},
      helpBackground: {x: 980, y: 800, width: 779, height: 447},
      pauseShade: {x: 980, y: 1260, width: 516, height: 234},
      overShade: {x: 1540, y: 1260, width: 512, height: 289},
      windProgress: {x: 1990, y: 120, width: 210, height:55},
      fireProgress: {x: 1990, y: 0, width: 210, height:55},
      waterProgress: {x: 1990, y: 180, width: 210, height:55},
      earthProgress: {x: 1990, y: 60, width: 210, height:55},
      windOver: {x: 1120, y: 600, width: 302, height:60},
      fireOver: {x: 420, y: 600, width: 302, height:60},
      waterOver: {x: 0, y: 600, width: 302, height:60},
      earthOver: {x: 800, y: 600, width: 302, height:56},
      helpPage1: {x: 0, y: 800, width: 375, height: 180},
      helpPage2: {x: 0, y: 1000, width: 375, height: 180},
      helpPage3: {x: 0, y: 1200, width: 375, height: 180},
      cloud: {x: 1990, y: 240, width: 185, height: 105},
      cloudBlack: {x: 1990, y: 345, width: 185, height: 105}
    };

    return {
      width: function() { return width_; },
      height: function() { return height_; },
      scaleX: function() { return scaleX_; },
      scaleY: function() { return scaleY_; },
      interval: function() { return interval_; },
      canvas: function() { return canvas_; },
      ctx: function() { return ctx_; },
      sounds: { bgsound: backgroundMusic_, hitsound: hitsound_ },
      srcpos: function() { return srcPos_; },
      src: function() { return src_; }
    };
})();

myth.base.event = {
  clickEvent: (function() {
      var pageObject_ = null,
          option_ = '',
          param_ = null,
          pos_ = null,
          scaleX_ = myth.base.vars.scaleX(),
          scaleY_ = myth.base.vars.scaleY();

      function changeHandler(o, opt_param) {
        pageObject_ = o;
        param_ = opt_param;
      }

      function handler(e) {
        e.preventDefault();
        pos_ = new myth.base.classes.Position(0, 0);
        if (e.touches) {
          option_ = pageObject_.event(pos_.reset(e.touches[0].clientX / scaleX_ , e.touches[0].clientY / scaleY_));
        } else {
          option_ = pageObject_.event(pos_.reset(e.clientX / scaleX_, e.clientY / scaleY_));
        }
//        document.getElementById('pos').innerHTML = pos_.x() + '   ' + pos_.y();
        if (option_) {
          if (myth.menu.pageclasses[option_]) {
            if (option_ === 'Pause') param_.stop();
            if (option_ === 'Home') param_ = null;
            pageObject_ = new myth.menu.pageclasses[option_];
            pageObject_.show();
          } else if (['wind', 'fire', 'water', 'earth'].join('').search(option_) != -1) {
            pageObject_ = null;
            myth.game(option_);
          } else if (option_ === 'back') {
            param_.start();
          } else if (option_ === 'retry') {
            option = param_.gametype;
            myth.game(option);
          }
        }
      }

      return {
        handler:handler,
        changeHandler:changeHandler
      };
  })(),

  hoverEvent: (function() {
      var fn_ = null,
          pos_ = null,
          scaleX_ = myth.base.vars.scaleX(),
          scaleY_ = myth.base.vars.scaleY();
      function handler(e) {
        pos_ = new myth.base.classes.Position(0, 0);
        e.preventDefault();
        if (fn_) {
          if (e.touches) {
            pos_.reset(e.touches[0].clientX / scaleX_, e.touches[0].clientY / scaleY_);
          } else {
            pos_.reset(e.clientX / scaleX_, e.clientY / scaleY_);
          }
          fn_(pos_);
        }
      }
      function changeHandler(fn) {
        fn_ = fn;
      }

      return {
        handler:handler,
        changeHandler:changeHandler
      };
  })()
};
