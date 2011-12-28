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
        backgroundObject = Option(srcpos.background, {x: 0, y: 0}),
        backObject = Option(srcpos.back, {x: 790, y: 580}),
        homeObject = Option(srcpos.home, {x: 790, y: 580});

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
      var onOption_ = Option(srcpos.on, {x: 870, y: 580}),
          offOption_ = Option(srcpos.off, {x: 870, y: 580}),
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
        background: backgroundObject,
        logo: Option(srcpos.logo1, {x: 210, y: 30}),
        start: Option(srcpos.start, {x: 341, y: 240}),
        help: Option(srcpos.help, {x: 341, y: 360}),
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
        background: backgroundObject,
        logo: Option(srcpos.logo2, {x: 265, y: 35}),
        wind: Option(srcpos.wind, {x: 300, y: 200}),
        water: Option(srcpos.water, {x: 300, y: 300}),
        earth: Option(srcpos.earth, {x: 300, y: 400}),
        fire: Option(srcpos.fire, {x: 300, y: 500}),
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
      var pageNumber_ = 3, //总页数
          n = 0,
          o = null,
          //      pageOption_ = { pos : {x: 310, y: 235}, width : 375, height : 180 },
      pagePic_ = [],

      //方便动态增加到object
      nextPage_ = Option(srcpos.nextPage, {x: 660, y: 460}),
      prePage_ = Option(srcpos.prePage, {x: 200, y: 470}),

      objects_ = {
        background: backgroundObject, 
        //        page: null,
        prePage: prePage_,
        nextPage: nextPage_,
        back: backObject,
        sound: soundsButton.option()
      }; 

      function changePage_(m) {
        if (n === 0) {
          objects_.prePage = null;
        } else if (n === 1) {
          objects_.prePage = prePage_;
        }
        if (n == pageNumber_ - 2) {
          objects_.nextPage = nextPage_;
        } else if (n == pageNumber_ - 1) {
          objects_.nextPage = null;
        }
        objects_.page = pagePic_[m];
      }

      /**
      * @initialize
      */
      for (var i = 0; i < pageNumber_; i++) {
        pagePic_[i] = Option({
            pos: pageOption_.pos, 
            src: 'images/page' + i + '.png', 
            width: pageOption_.width, 
            height: pageOption_.height
        });
      }
      objects_.prePage = null;
      objects_.page = pagePic_[0];


      function draw_() {
        c.save();
        c.clearRect(0, 0, screenWidth, screenHeight);
        for (o in objects_) {
          if (objects_[o])
          c.drawImage(objects_[o].image,
            objects_[o].spos.x(), objects_[o].spos.y(), objects_[o].width(), objects_[o].height(),
            objects_[o].dpos.x(), objects_[o].dpos.y(), objects_[o].width(), objects_[o].height());
        }
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
        background: backgroundObject,
        shade: Option(srcpos.pauseShade, {x: 200, y:190}),
        backGame: Option(srcpos.backGame, {x: 380, y: 220}),
        retry: Option(srcpos.retry, {x: 380, y: 290}),
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
        background: backgroundObject,
        sound: soundsButton.option(),
        shade: Option(srcpos.overShade, {x: 210, y: 170}),
        again: Option(srcpos.again, {x: 380, y: 290}),
        home: homeObject
      };

      function draw_() {
        c.save();
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
        background: backgroundObject,
        pause: Option(srcpos.pause, {x: 790, y: 580}),
        sound: soundsButton.option()
      };

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
