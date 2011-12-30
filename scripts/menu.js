myth.menu = {};
myth.menu.pageclasses = (function() {
    var variables = myth.base.vars,
        classes = myth.base.classes,
        cvs = variables.canvas(),
        c = variables.ctx(),
        srcpos = variables.srcpos(),
        screenWidth = variables.width(),
        screenHeight = variables.height(),
        soundsButton = new SoundsControl(),
        backObject = Option(srcpos.back, {x: 793, y: 582}),
        homeObject = Option(srcpos.home, {x: 793, y: 582});

    /**
    * @param o{object}:
    * {pos{object: {x{Number}, y{Number}}, src{String}, width{Number}, height{Number}}}
    * @return {object}:
    * {pos{Position}, image{Image}, width{Number}, height{Number}, contain{Function}}
    */
    function Option(o, dp) {
      var dpos_ = new classes.Position(dp.x, dp.y),
          spos_ = new classes.Position(o.x, o.y),
          w_ = o.width,
          h_ = o.height,
          image_ = new Image();

      image_.src = variables.src();
      image_.width = w_;
      image_.height = h_;
      return {
        dpos: dpos_,
        spos: spos_,
        image: image_,
        width: function () { return w_; },
        height: function () { return h_; },
        contain: function(p) {
          return classes.Position.hit(p, {
              pos: this.dpos, 
              width: this.width,
              height: this.height
            }, true);
        }
      };
    }

    function SoundsControl() {
      var onOption_ = Option(srcpos.on, {x: 876, y: 582}),
          offOption_ = Option(srcpos.off, {x: 876, y: 582}),
          soundsObjects_ = variables.sounds,
          current_ = onOption_;

      function setsounds(value) {
        for (s in soundsObjects_) {
          soundsObjects_[s].volume = value;
        }
      }

      this.event = function() {
        current_ === onOption_ ? (current_ = offOption_) : (current_ = onOption_);
        setsounds(current_ === onOption_ ? 1 : 0);
      };

      this.option = function() {
        return current_;
      };
    }

    //Pages Classes: Home/Start/Help/Pause/Gameover
    function Home() {
      var objects_ = {
        logo: Option(srcpos.logo1, {x: 219, y: 18}),
        start: Option(srcpos.start, {x: 349, y: 245}),
        help: Option(srcpos.help, {x: 349, y: 340}),
        sound: soundsButton.option()
      },
      o = null; //历遍临时变量


      function draw_() {
        c.save();
        c.clearRect(0, 0, screenWidth, screenHeight);
        for (o in objects_) {
          c.drawImage(objects_[o].image,
            objects_[o].spos.x(), objects_[o].spos.y(), objects_[o].width(), objects_[o].height(),
            objects_[o].dpos.x(), objects_[o].dpos.y(), objects_[o].width(), objects_[o].height());
        }
        c.restore();
      }

      this.event = function(p) {
        if (objects_.start.contain(p)) {
          return 'Start';
        } else if (objects_.help.contain(p)) {
          return 'Help';
        } else if (objects_.sound.contain(p)) {
          soundsButton.event();
          objects_.sound = soundsButton.option();
          draw_();
          return false;
        } else {
          return false;
        }
      };

      this.show = function() {
        draw_();
      };
    }

    function Start() {
      var objects_ = {
        logo: Option(srcpos.logo2, {x: 280, y: 35}),
        wind: Option(srcpos.wind, {x: 323, y: 501}),
        water: Option(srcpos.water, {x: 323, y: 210}),
        earth: Option(srcpos.earth, {x: 323, y: 404}),
        fire: Option(srcpos.fire, {x: 323, y: 307}),
        sound: soundsButton.option(),
        back: backObject
      },
      o = null;

      function draw_() {
        c.save();
        c.clearRect(0, 0, screenWidth, screenHeight);
        for (o in objects_) {
          c.drawImage(objects_[o].image,
            objects_[o].spos.x(), objects_[o].spos.y(), objects_[o].width(), objects_[o].height(),
            objects_[o].dpos.x(), objects_[o].dpos.y(), objects_[o].width(), objects_[o].height());
        }
        c.restore();
      }

      this.event = function(p) {
        if (objects_.wind.contain(p)) {
          return 'wind';
        } else if (objects_.water.contain(p)) {
          return 'water';
        } else if (objects_.earth.contain(p)) {
          return 'earth';
        } else if (objects_.fire.contain(p)) {
          return 'fire';
        } else if (objects_.back.contain(p)) {
          return 'Home';
        } else if (objects_.sound.contain(p)) {
          soundsButton.event();
          objects_.sound = soundsButton.option();
          draw_();
          return false;
        } else {
          return false;
        }
      };

      this.show = function() {
        draw_();
      };
    }

    function Help() {
      var pageNumber_ = 5, //总页数
          n = 1,
          o = null,
          pageObjects_ = [],
          nextPage_ = Option(srcpos.nextPage, {x: 678, y: 478}),
          prePage_ = Option(srcpos.prePage, {x: 210, y: 478}),

      objects_ = {
        logo:Option(srcpos.logo3, {x: 333, y: 22}),
        helpBackground:Option(srcpos.helpBackground, {x: 121, y: 136}),
        prePage: prePage_,
        nextPage: nextPage_,
        back: backObject,
        sound: soundsButton.option()
      }; 

      function changePage_(m) {
        if (n === 1) {
          objects_.prePage = null;
        } else if (n === 2) {
          objects_.prePage = prePage_;
        }
        if (n == pageNumber_ - 1) {
          objects_.nextPage = nextPage_;
        } else if (n == pageNumber_) {
          objects_.nextPage = null;
        }
      }

      /**
      * @initialize
      */
      objects_.prePage = null;
      for (var i = 1; i <= 5; i++) pageObjects_[i] = {};
      pageObjects_[1].headline = '游戏玩法说明';
      pageObjects_[1].content = '滑动手指将出现的星星连接起来得分，不同模式下有不同的玩法';
      pageObjects_[2].headline = '水象模式';
      pageObjects_[2].content = '以最短的时间，连接一定数量的星星，以时间排行，游戏中有水雾模糊视线';
      pageObjects_[3].headline = '火象模式';
      pageObjects_[3].content = '在一分钟之内，连接尽可能多的星星，以积分排行';
      pageObjects_[4].headline = '土象模式';
      pageObjects_[4].content = '不限时间，但别碰到障碍物，碰到三次则失败，以积分排行';
      pageObjects_[5].headline = '风象模式';
      pageObjects_[5].content = '不限时间，尽量连到所有星星，落掉5个星星则失败，以积分排行';

      function drawPage_(i) {
        c.save();
        c.textAlign = 'center';
        c.fillStyle = '#694f31';
        c.font = '40px Arial';
        c.fillText(pageObjects_[i].headline, 495, 285, 200);
        c.font = '25px Arial';
        c.fillText(pageObjects_[i].content, 495, 340, 200);
        c.restore();
      }


      function draw_() {
        c.save();
        c.clearRect(0, 0, screenWidth, screenHeight);
        for (o in objects_) {
          if (objects_[o])
          c.drawImage(objects_[o].image,
            objects_[o].spos.x(), objects_[o].spos.y(), objects_[o].width(), objects_[o].height(),
            objects_[o].dpos.x(), objects_[o].dpos.y(), objects_[o].width(), objects_[o].height());
        }
        drawPage_(n);
        c.restore();
      }

      this.event = function(p) {
        if (objects_.prePage && objects_.prePage.contain(p)) {
          --n;
          changePage_(n);
          draw_();
          return false;
        } else if (objects_.nextPage && objects_.nextPage.contain(p)) {
          ++n;
          changePage_(n);
          draw_();
          return false;
        } else if (objects_.back.contain(p)) {
          return 'Home';
        } else if (objects_.sound.contain(p)) {
          soundsButton.event();
          objects_.sound = soundsButton.option();
          draw_();
          return false;
        } else {
          return false;
        }
      };

      this.show = function() {
        draw_();
      };

    }

    function Pause() {
      var o = null,
      objects_ = {
        shade: Option(srcpos.pauseShade, {x: 236, y:200}),
        backGame: Option(srcpos.backGame, {x: 310, y: 270}),
        retry: Option(srcpos.retry, {x: 450, y: 270}),
        home: homeObject,
        sound: soundsButton.option()
      };

      function draw_() {
        c.save();
        for (o in objects_) {
          c.drawImage(objects_[o].image,
            objects_[o].spos.x(), objects_[o].spos.y(), objects_[o].width(), objects_[o].height(),
            objects_[o].dpos.x(), objects_[o].dpos.y(), objects_[o].width(), objects_[o].height());
        }
        c.restore();
      }

      this.event = function(p) {
        if (objects_.backGame.contain(p)) {
          return 'back';
        } else if (objects_.retry.contain(p)) {
          return 'retry';
        } else if (objects_.home.contain(p)) {
          return 'Home';
        } else if (objects_.sound.contain(p)) {
          soundsButton.event();
          objects_.sound = soundsButton.option();
          draw_();
          return false;
        } else {
          return false;
        }
      };

      this.show = function() {
        draw_();
      };
    }

    function Gameover(score) {
      var o = null,
      objects_ = {
        sound: soundsButton.option(),
        shade: Option(srcpos.overShade, {x: 236, y: 175}),
        again: Option(srcpos.again, {x: 380, y: 290}),
        home: homeObject
      };

      function draw_() {
        c.save();
        c.clearRect(objects_.home.dpos.x(), objects_.home.dpos.y(), objects_.home.width(), objects_.home.height());
        for (o in objects_) {
          c.drawImage(objects_[o].image,
            objects_[o].spos.x(), objects_[o].spos.y(), objects_[o].width(), objects_[o].height(),
            objects_[o].dpos.x(), objects_[o].dpos.y(), objects_[o].width(), objects_[o].height());
        }
        c.fillStyle = 'white';
        c.font = '60px Arial';
        c.width = 60;
        c.textAlign = 'center';
        c.fillText(score, 470, 260, 60);
        c.restore();
      }

      this.event = function(p) {
        if (objects_.again.contain(p)) {
          return 'retry';
        } else if (objects_.home.contain(p)) {
          return 'Home';
        } else if (objects_.sound.contain(p)) {
          soundsButton.event();
          objects_.sound = soundsButton.option();
          draw_();
          return false;
        } else {
          return false;
        }
      };

      this.show = function() {
        draw_();
      };
    }

    function GameBackground() {
      var o = null,
      objects_ = {
        pause: Option(srcpos.pause, {x: 793, y: 582}),
        sound: soundsButton.option()
      };

      function draw_() {
        c.save();
        for (o in objects_) {
          c.drawImage(objects_[o].image,
            objects_[o].spos.x(), objects_[o].spos.y(), objects_[o].width(), objects_[o].height(),
            objects_[o].dpos.x(), objects_[o].dpos.y(), objects_[o].width(), objects_[o].height());
        }
        c.restore();
      }

      this.event = function(p) {
        if (objects_.pause.contain(p)) {
          return 'Pause';
        } else if (objects_.sound.contain(p)) {
          soundsButton.event();
          objects_.sound = soundsButton.option();
          draw_();
          return false;
        } else {
          return false;
        }
      };

      this.show = function() {
        draw_();
      };
    }

    return {
      Home: Home,
      Start: Start,
      Help: Help,
      Pause: Pause,
      Gameover: Gameover,
      GameBackground: GameBackground
    };

})();

myth.menu.over = function(opt_param) {
  var pageclasses = myth.menu.pageclasses,
      option_ = '',
      page_ = null;

  page_ = new pageclasses.Gameover(opt_param.score);
  page_.show();
  myth.base.event.clickEvent.changeHandler(page_, opt_param);
};

myth.menu.main = function() { 
  var page_ = null,
      option_ = '';

  page_ = new myth.menu.pageclasses.Home();
  page_.show();
  myth.base.event.clickEvent.changeHandler(page_);
};
