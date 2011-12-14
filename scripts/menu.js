var MENU = {
  show: function() {
    var currentPage_ = null,
        addEvent_ = function() { GLOBAL.canvas.addEventListener('click', eventFn, false); },
        removeEvent_ = function() { GLOBAL.canvas.removeEventListener('click', eventFn, false); },
    eventFn = function(e) {
   //   var s = '';
   //   for(var x in e){
   //     s += x + ':' + e[x] + '\n';
   //   }
   //   alert(s);
      var name,
          page = currentPage_.event(new GLOBAL.Position(e.offsetX || e.pageX, e.offsetY || e.pageY));
 //     alert(page);
      if (page && MENU[page]) {
        currentPage_ = new MENU[page];
        currentPage_.show();
      } else if (page) {
        removeEvent_();
        startGame(page);  //外部游戏开始入口函数
      }
    };

    /**
    * @initialize
    */
    (function() {
        addEvent_();
        currentPage_ = new MENU.home();
        currentPage_.show();
    })();

  },
  /**
  * @param o{object}:
  * {pos{object: {x{Number}, y{Number}}, src{String}, width{Number}, height{Number}}}
  * @return {object}:
  * {pos{Position}, image{Image}, width{Number}, height{Number}, contain{Function}}
  */
  option: function(o) {
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

  home: function() {
    var objects_ = {
      background: MENU.option({ pos: {x: 0, y: 0}, src: 'images/background.jpg', width: 960, height: 640}),
      logo: MENU.option({ pos: {x: 210, y: 30}, src: 'images/logo.png', width: 553, height: 186}),
      start: MENU.option({ pos: {x: 350, y: 430}, src: 'images/start.png', width: 270, height: 81}),
      help: MENU.option({ pos: {x: 350, y: 250}, src: 'images/help.png', width: 270, height: 81})
    };

    this.show = function() {
      GLOBAL.ctx.clearRect(0, 0, GLOBAL.width, GLOBAL.height);
      for (var o in objects_) {
        GLOBAL.ctx.drawImage(objects_[o].image, objects_[o].pos.x(), objects_[o].pos.y());
      }
    };
    this.event = function(p) {
      if (objects_.start.contain(p)) {
        return 'start';
      } else if (objects_.help.contain(p)) {
        return 'help';
      } else {
        return false;
      }
    };
  },

  start: function() {
    var objects_ = {
      background: MENU.option({ pos: {x: 0, y: 0}, src: 'images/startBackground.jpg', width: 960, height: 640}),
      wind : MENU.option({ pos: {x: 280, y: 135}, src: 'images/wind.png', width: 385, height: 95}),
      water : MENU.option({ pos: {x: 280, y: 245}, src: 'images/water.png', width: 385, height: 95}),
      earth : MENU.option({ pos: {x: 280, y: 355}, src: 'images/earth.png', width: 285, height: 95}),
      fire : MENU.option({ pos: {x: 280, y: 465}, src: 'images/fire.png', width: 385, height: 95})
    };

    this.show = function() {
      GLOBAL.ctx.clearRect(0, 0, GLOBAL.width, GLOBAL.height);
      for (var o in objects_) {
        GLOBAL.ctx.drawImage(objects_[o].image, objects_[o].pos.x(), objects_[o].pos.y());
      }
    };
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
  },

  help: function() {
    var pageNumber_ = 3, //总页数
        n_ = 0,
        img_ = [], //当前页数
    pages_ = {
      pos : new GLOBAL.Position(310, 235),
      width : 375,
      height : 180,
      pic : img_ //所有页图片
    },

    //方便动态增加到object
    nextPage_ = MENU.option({ pos: {x: 660, y: 460}, src: 'images/nextPage', width: 84, height: 29}),
    prePage_ = MENU.option({ pos: {x: 200, y: 470}, src: 'images/prePage', width: 82, height: 33}),

    objects_ = {
      background : MENU.option({ pos: {x: 0, y: 0}, src: 'images/helpBackground.jpg', width: 960, height: 640}),
      page : { pos: pages_.pos, image: pages_.pic[n_], width: pages_.width, height: pages_.height}
      //      back : MENU[o]ption({ pos: {x: 0, y: 0}, src: '', width: 0, height: 0})
    };

    var next_ = function() {
      if (n < pageNumber_ - 1) {
        ++n;
        if (n == pageNumber_ - 1) {
          objects_.nextPage = null;
        } else if (n == 2) {
          objects_.prePage = prePage_;
        }
      }
    };

    var pre_ = function() {
      if (n > 1) {
        --n;
        if (n == 1) {
          objects_.prePage = null;
        } else if (n == pageNumber_ - 2) {
          objects_.nextPage = nextPage_;
        }
      }
    };


    /**
    * @initialize
    */
    for (var i = 0; i < pageNumber_; i++) {
      img_[i] = new Image();
      img_[i].src = 'images/page' + i;
    }

    objects_.nextPage = nextPage_;

    this.show = function() {
      GLOBAL.ctx.clearRect(0, 0, GLOBAL.width, GLOBAL.height);
      for (var o in objects_) {
        if (o)
          GLOBAL.ctx.drawImage(objects_[o].image, objects_[o].pos.x(), objects_[o].pos.y());
      }
    };

    this.event = function(p) {
      if (prePage_.contain(p)) {
        pre_();
        return false;
      } else if (nextPage_.contain(p)) {
        next_();
        return false;
      } else {
        return false;
      }
    };
  }
};
