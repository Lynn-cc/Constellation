var MENU = {
  show: function(type) { //to do: pause、gameover or mainMenu
    var currentPage_ = null,
        name = '',
        option = '',
        lastGameType = '';

    function addEvent_(callback) { 
      GLOBAL.canvas.addEventListener('click', function(e) { eventFn(e, callback); }, false); 
    }
    function removeEvent_(callback) {
      GLOBAL.canvas.removeEventListener('click', function(e) { eventFn(e, callback); }, false); 
    }
    function eventFn(e, callback) {
      option = currentPage_.event(new GLOBAL.Position(e.offsetX || e.pageX, e.offsetY || e.pageY));
      if (callback){  
        if (option === 'back') {
          removeEvent_(callback);
          currentPage_ = null;
          callback();
        } else if (option === 'retry') {
          removeEvent_(callback);
          currentPage_ = null;
          startGame(lastGameType);
        }
      } else {
        if (option && MENU[option]) {
          currentPage_ = new MENU[option]();
        } else if (option) {
          removeEvent_();
          currentPage_ = null;
          lastGameType = option;
          startGame(option);  //外部游戏开始入口函数
        }
      }
    }

    /**
    * @initialize
    */
    if(type === 'mainMenu') {
      addEvent_();
      currentPage_ = new MENU.Home();
      return false; //no use
    } else if (type === 'gameover') {
      return {
        show: function(score) {
          currentPage_ = new MENU.Gameover(score);
          addEvent_();
        }
      };
    } else if (type === 'pause') {
      return {
        show: function(callback) {
          currentPage_ = new MENU.Pause();
          addEvent_(callback);
        }
      };
    }

  },

  /**
  * @param o{object}:
  * {pos{object: {x{Number}, y{Number}}, src{String}, width{Number}, height{Number}}}
  * @return {object}:
  * {pos{Position}, image{Image}, width{Number}, height{Number}, contain{Function}}
  */
  Option: function(o) {
    var pos_ = new GLOBAL.Position(o.pos.x, o.pos.y),
        image_ = new Image(),
        w_ = o.width,
        h_ = o.height;

    image_.src = o.src;
    image_.width = w_;
    image_.height = h_;
    return {
      pos: pos_,
      image: image_,
      width: w_,
      height: h_,
      contain: function(p) {
        return GLOBAL.Position.hit(p, this, true);
      }
    };
  },

  Home: function() {
    var objects_ = {
      background: MENU.Option({ pos: {x: 0, y: 0}, src: 'images/background.jpg', width: 960, height: 640}),
      logo: MENU.Option({ pos: {x: 210, y: 30}, src: 'images/logo.png', width: 553, height: 186}),
      start: MENU.Option({ pos: {x: 350, y: 250}, src: 'images/start.png', width: 270, height: 81}),
      help: MENU.Option({ pos: {x: 350, y: 360}, src: 'images/help.png', width: 270, height: 81})
    },
    o = null, //历遍临时变量
    count = 0; //图片加载计数器


    function show_() {
      GLOBAL.ctx.save();
      GLOBAL.ctx.clearRect(0, 0, GLOBAL.width, GLOBAL.height);
      for (o in objects_) {
        GLOBAL.ctx.drawImage(objects_[o].image, objects_[o].pos.x(), objects_[o].pos.y());
      }
      GLOBAL.ctx.restore();
    }

    this.event = function(p) {
      if (objects_.start.contain(p)) {
        return 'Start';
      } else if (objects_.help.contain(p)) {
        return 'Help';
      } else {
        return false;
      }
    };

    for (o in objects_) {
      if (objects_[o].image.complete) {
        show_();
      } else {
        objects_[o].image.onload = function() {
          ++count;
          if (count == 4) show_();
        };
      }
    }
  },

  Start: function() {
    var objects_ = {
      background: MENU.Option({ pos: {x: 0, y: 0}, src: 'images/startBackground.jpg', width: 960, height: 640}),
      wind : MENU.Option({ pos: {x: 280, y: 135}, src: 'images/wind.png', width: 385, height: 95}),
      water : MENU.Option({ pos: {x: 280, y: 245}, src: 'images/water.png', width: 385, height: 95}),
      earth : MENU.Option({ pos: {x: 280, y: 355}, src: 'images/earth.png', width: 285, height: 95}),
      fire : MENU.Option({ pos: {x: 280, y: 465}, src: 'images/fire.png', width: 385, height: 95})
    },
    o = null,
    count = 0;

    function show_() {
      GLOBAL.ctx.save();
      GLOBAL.ctx.clearRect(0, 0, GLOBAL.width, GLOBAL.height);
      for (o in objects_) {
        GLOBAL.ctx.drawImage(objects_[o].image, objects_[o].pos.x(), objects_[o].pos.y());
      }
      GLOBAL.ctx.restore();
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
      } else {
        return false;
      }
    };

    for (o in objects_) {
      if (objects_[o].image.complete) {
        show_();
      } else {
        objects_[o].image.onload = function() {
          ++count;
          if (count == 5) show_();
        };
      }
    }
  },

  Help: function() {
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
    nextPage_ = MENU.Option({ pos: {x: 660, y: 460}, src: 'images/nextPage.png', width: 84, height: 29}),
    prePage_ = MENU.Option({ pos: {x: 200, y: 470}, src: 'images/prePage.png', width: 82, height: 33}),

    objects_ = {
      background: MENU.Option({ pos: {x: 0, y: 0}, src: 'images/helpBackground.jpg', width: 960, height: 640}),
      page: null,
      prePage: prePage_,
      nextPage: nextPage_,
      home: MENU.Option({ pos: {x: 830, y: 155}, src: 'images/helpBack.png', width:20, height:20}) }; 
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
      pagePic_[i] = MENU.Option({
          pos: pageOption_.pos, 
          src: 'images/page' + i + '.png', 
          width: pageOption_.width, 
          height: pageOption_.height
      });
    }
    objects_.prePage = null;
    objects_.page = pagePic_[0];

    function show_() {
      GLOBAL.ctx.save();
      GLOBAL.ctx.clearRect(0, 0, GLOBAL.width, GLOBAL.height);
      for (o in objects_) {
        if (objects_[o])
          GLOBAL.ctx.drawImage(objects_[o].image, objects_[o].pos.x(), objects_[o].pos.y());
      }
      GLOBAL.ctx.restore();
    }

    this.event = function(p) {
      if (objects_.prePage && objects_.prePage.contain(p)) {
        --n;
        changePage_(n);
        show_();
        return false;
      } else if (objects_.nextPage && objects_.nextPage.contain(p)) {
        ++n;
        changePage_(n);
        show_();
        return false;
      } else if (objects_.home.contain(p)) {
        return 'Home';
      } else {
        return false;
      }
    };

    for (o in objects_) {
      if (objects_[o]) {
        if (objects_[o].image.complete) {
          show_();
        } else {
          objects_[o].image.onload = function() {
            ++count;
            if (count == 4) show_();
          };
        }
      }
    }

  },

  Pause: function() {
    var count = 0,
        o = null,
    objects_ = {
      background: MENU.Option({pos: {x: 0, y:0}, src: 'images/pauseBackground.png', width:960, height:640}),
      back: MENU.Option({pos: {x: 380, y: 220}, src: 'images/pauseBack.png', width:208, height:61}),
      retry: MENU.Option({pos: {x: 380, y: 290}, src: 'images/retry.png', width:208, height:62})
    };

    function show_() {
      GLOBAL.ctx.save();
      for (o in objects_) {
        GLOBAL.ctx.drawImage(objects_[o].image, objects_[o].pos.x(), objects_[o].pos.y());
      }
      GLOBAL.ctx.restore();
    }

    this.event = function(p) {
      if (objects_.back.contain(p)) {
        return 'back';
      } else if (objects_.retry.contain(p)) {
        return 'retry';
      } 
    };

    for (o in objects_) {
      if (objects_[o].image.complete) {
        show_();
      } else {
        objects_[o].image.onload = function() {
          ++count;
          if (count === 3) show_();
        };
      }
    }

  },

  Gameover: function(score) {
    var count = 0,
        o = null,
    objects_ = {
      background: MENU.Option({pos: {x: 0, y:0}, src: 'images/pauseBackground.png', width:960, height:640}),
      retry: MENU.Option({pos: {x: 380, y: 290}, src: 'images/again.png', width:208, height:62})
    };

    function show_() {
      GLOBAL.ctx.save();
      for (o in objects_) {
        GLOBAL.ctx.drawImage(objects_[o].image, objects_[o].pos.x(), objects_[o].pos.y());
      }
      GLOBAL.ctx.fillStyle = 'white';
      GLOBAL.ctx.font = '60px Arial';
      GLOBAL.ctx.width = 60;
      GLOBAL.ctx.textAlign = 'center';
      GLOBAL.ctx.fillText(score, 470, 260, 60);
      GLOBAL.ctx.restore();
    }

    this.event = function(p) {
      if (objects_.retry.contain(p)) {
        return 'retry';
      } 
    };

    for (o in objects_) {
      if (objects_[o].image.complete) {
        show_();
      } else {
        objects_[o].image.onload = function() {
          ++count;
          if (count === 2) show_();
        };
      }
    }

  }
};
