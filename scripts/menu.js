myth.menu = {};
myth.menu.pageclasses = (function() {
    var variables = myth.base.vars,
        cvs = variables.canvas(),
        c = variables.ctx(),
        screenWidth = variables.width(),
        screenHeight = variables.height(),
        classes = myth.base.classes,
        soundsButton = new SoundsControl(),
        homeButton = Option({ pos: {x: 790, y: 580}, src: 'images/home.png', width:48, height:47});

    /**
    * @param o{object}:
    * {pos{object: {x{Number}, y{Number}}, src{String}, width{Number}, height{Number}}}
    * @return {object}:
    * {pos{Position}, image{Image}, width{Number}, height{Number}, contain{Function}}
    */
    function Option(o) {
      var pos_ = new classes.Position(o.pos.x, o.pos.y),
          image_ = new Image(),
          w_ = o.width,
          h_ = o.height;

      image_.src = o.src;
      image_.width = w_;
      image_.height = h_;
      return {
        pos: pos_,
        image: image_,
        width: function () { return w_; },
        height: function () { return h_; },
        contain: function(p) {
          return classes.Position.hit(p, this, true);
        }
      };
    }

    function SoundsControl() {
      var onOption_ = Option({ pos: {x: 870, y: 580}, src: 'images/on.png', width: 73, height: 74}),
          offOption_ = Option({ pos: {x: 870, y: 580}, src: 'images/off.png', width: 73, height: 74}),
          soundsObjects_ = myth.base.vars.sounds,
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
        background: Option({ pos: {x: 0, y: 0}, src: 'images/background.jpg', width: 960, height: 640}),
        logo: Option({ pos: {x: 210, y: 30}, src: 'images/logo.png', width: 553, height: 186}),
        start: Option({ pos: {x: 350, y: 250}, src: 'images/start.png', width: 270, height: 81}),
        help: Option({ pos: {x: 350, y: 360}, src: 'images/help.png', width: 270, height: 81}),
        sound: soundsButton.option()
      },
      o = null, //历遍临时变量
      count = 0; //图片加载计数器


      function draw_() {
        c.save();
        c.clearRect(0, 0, screenWidth, screenHeight);
        for (o in objects_) {
          c.drawImage(objects_[o].image, objects_[o].pos.x(), objects_[o].pos.y());
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
        //        draw_();
        for (o in objects_) {
          if (objects_[o].image.complete) {
            ++count;
            if (count == 5) draw_();
          } else {
            objects_[o].image.onload = function() {
              ++count;
              if (count == 5) draw_();
            };
          }
        }
      };
    }

    function Start() {
      var objects_ = {
        background: Option({ pos: {x: 0, y: 0}, src: 'images/startBackground.jpg', width: 960, height: 640}),
        wind : Option({ pos: {x: 280, y: 135}, src: 'images/wind.png', width: 385, height: 95}),
        water : Option({ pos: {x: 280, y: 245}, src: 'images/water.png', width: 385, height: 95}),
        earth : Option({ pos: {x: 280, y: 355}, src: 'images/earth.png', width: 285, height: 95}),
        fire : Option({ pos: {x: 280, y: 465}, src: 'images/fire.png', width: 385, height: 95}),
        home: homeButton,
        sound: soundsButton.option()
      },
      o = null,
      count = 0;

      function draw_() {
        c.save();
        c.clearRect(0, 0, screenWidth, screenHeight);
        for (o in objects_) {
          c.drawImage(objects_[o].image, objects_[o].pos.x(), objects_[o].pos.y());
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
        //        draw_();
        for (o in objects_) {
          if (objects_[o].image.complete) {
            count++;
            if (count == 7) draw_();
          } else {
            objects_[o].image.onload = function() {
              ++count;
              if (count == 7) draw_();
            };
          }
        }
      };
    }

    function Help() {
      var pageNumber_ = 3, //总页数
          n = 0,
          o = null,
          count = 0,
      pageOption_ = {
        pos : {x: 310, y: 235},
        width : 375,
        height : 180
      },
      pagePic_ = [],

      //方便动态增加到object
      nextPage_ = Option({ pos: {x: 660, y: 460}, src: 'images/nextPage.png', width: 84, height: 29}),
      prePage_ = Option({ pos: {x: 200, y: 470}, src: 'images/prePage.png', width: 82, height: 33}),

      objects_ = {
        background: Option({ pos: {x: 0, y: 0}, src: 'images/helpBackground.jpg', width: 960, height: 640}),
        page: null,
        prePage: prePage_,
        nextPage: nextPage_,
        home: homeButton,
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
            c.drawImage(objects_[o].image, objects_[o].pos.x(), objects_[o].pos.y());
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
        //        draw_();
        for (o in objects_) {
          if (objects_[o]) {
            if (objects_[o].image.complete) {
              count++;
              if (count == 6) draw_();
            } else {
              objects_[o].image.onload = function() {
                ++count;
                if (count == 6) draw_();
              };
            }
          } else {
            count++;
          }
        }
      };

    }

    function Pause() {
      var count = 0,
          o = null,
      objects_ = {
        background: Option({pos: {x: 0, y:0}, src: 'images/pauseBackground.png', width:960, height:640}),
        back: Option({pos: {x: 380, y: 220}, src: 'images/pauseBack.png', width:208, height:61}),
        retry: Option({pos: {x: 380, y: 290}, src: 'images/retry.png', width:208, height:62}),
        home: homeButton,
        sound: soundsButton.option()
      };

      function draw_() {
        c.save();
        for (o in objects_) {
          c.drawImage(objects_[o].image, objects_[o].pos.x(), objects_[o].pos.y());
        }
        c.restore();
      }

      this.event = function(p) {
        if (objects_.back.contain(p)) {
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
        //        draw_();
        for (o in objects_) {
          if (objects_[o].image.complete) {
            ++count;
            if (count == 5) draw_();
          } else {
            objects_[o].image.onload = function() {
              ++count;
              if (count === 5) draw_();
            };
          }
        }
      };
    }

    function Gameover(score) {
      var count = 0,
          o = null,
      objects_ = {
        background: Option({pos: {x: 0, y:0}, src: 'images/pauseBackground.png', width:960, height:640}),
        retry: Option({pos: {x: 380, y: 290}, src: 'images/again.png', width:208, height:62}),
        home: homeButton,
        sound: soundsButton.option()
      };

      function draw_() {
        c.save();
        for (o in objects_) {
          c.drawImage(objects_[o].image, objects_[o].pos.x(), objects_[o].pos.y());
        }
        c.fillStyle = 'white';
        c.font = '60px Arial';
        c.width = 60;
        c.textAlign = 'center';
        c.fillText(score, 470, 260, 60);
        c.restore();
      }

      this.event = function(p) {
        if (objects_.retry.contain(p)) {
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
        //        draw_();
        for (o in objects_) {
          if (objects_[o].image.complete) {
            count++;
            if (count == 4) draw_();
          } else {
            objects_[o].image.onload = function() {
              ++count;
              if (count === 4) draw_();
            };
          }
        }
      };
    }

    function GameBackground() {
      var count = 0,
          o = null,
      objects_ = {
        background: Option({pos: {x: 0, y:0}, src: 'images/background.jpg', width:960, height:640}),
        pause: Option({pos: {x: 790, y: 580}, src: 'images/pause.png', width:48, height:47}),
        sound: soundsButton.option()
      };

      function draw_() {
        c.save();
        c.clearRect(0, 0, screenWidth, screenHeight);
        for (o in objects_) {
          c.drawImage(objects_[o].image, objects_[o].pos.x(), objects_[o].pos.y());
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
        if (count == 3) 
          draw_();
        else {
          for (o in objects_) {
            if (objects_[o].image.complete) {
              count++;
              if (count == 3) draw_();
            } else {
              objects_[o].image.onload = function() {
                ++count;
                if (count === 3) draw_();
              };
            }
          }
        }
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

myth.menu.show = function(type, opt_param) {
  var pageclasses = myth.menu.pageclasses,
      option_ = '',
      page_ = null;

  if (type === 'Gameover') 
    page_ = new pageclasses.Gameover(opt_param.score);

  page_.show();
  myth.base.event.changeHandler(page_, opt_param);
};


myth.menu.main = function() { 
  var pageclasses = myth.menu.pageclasses,
      page_ = null,
      option_ = '';

  page_ = new pageclasses.Home();
  page_.show();
  myth.base.event.changeHandler(page_);
};
