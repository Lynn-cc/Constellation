//myth namespace
var myth = {};
myth.base = {};
myth.init = function() {
  myth.base.vars.canvas().width = myth.base.vars.width();
  myth.base.vars.canvas().height = myth.base.vars.height();
//  myth.base.vars.canvas().addEventListener('click', myth.base.event.clickEvent.handler, false);
  myth.base.vars.canvas().addEventListener('mousemove', myth.base.event.hoverEvent.handler, false);
  myth.base.vars.canvas().addEventListener('touchmove', myth.base.event.hoverEvent.handler, false);
  myth.base.vars.canvas().addEventListener('touchend', myth.base.event.clickEvent.handler, false);
  myth.base.vars.sounds.bgsound.play();
};

myth.base.vars = (function() {
    var width_ = null || 960,  //to do: get the screen resolution of mobile
        height_ = null || 640,
        interval_ = 1000 / 25,
        canvas_ = document.getElementById('main'),
        ctx_ = document.getElementById('main').getContext('2d'),
        backgroundMusic_ = new Audio('./sounds/bgsound.mp3'),
        hitsound_ = new Audio('./sounds/hit.wav'),
        src_ = 'images/pic.png';
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
      backGame: {x: 1400, y:150, width: 208, height: 61},
      retry: {x: 1680, y: 150, width: 208, height: 62},
      again: {x: 1400, y: 250, width: 207, height: 61},
      prePage: {x: 1680, y: 250, width: 69, height: 23},
      nextPage: {x: 1820, y: 250, width: 70, height: 22},
      back: {x: 1920, y: 0, width: 48, height: 47},
      home: {x: 1920, y: 60, width: 47, height: 49},
      pause: {x: 1920, y: 120, width: 45, height: 47},
      on: {x: 1920, y: 180, width: 61, height: 51},
      off: {x: 1920, y: 240, width: 61, height: 51},
      water: {x: 0, y: 400, width: 307, height: 80},
      fire: {x: 420, y: 400, width: 314, height: 81},
      earth: {x: 840, y: 400, width:313, height: 80},
      wind: {x: 1260, y: 400, width: 311, height: 80},
      start: {x: 1680, y: 300, width: 270, height: 81},
      help: {x: 1680, y: 400, width: 270, height: 81},
      helpBackground: {x: 980, y: 800, width: 779, height: 447},
      pauseShade: {x: 980, y: 1260, width: 516, height: 234},
      overShade: {x: 1540, y: 1260, width: 512, height: 289},
      windScore: {x: 1990, y: 120, width: 200, height:54},
      fireScore: {x: 1990, y: 0, width: 202, height:53},
      waterScore: {x: 1990, y: 180, width: 210, height:55},
      earthScore: {x: 1990, y: 60, width: 205, height:56},
      helpPage1: {x: 0, y: 800, width: 375, height: 180},
      helpPage2: {x: 0, y: 1000, width: 375, height: 180},
      helpPage3: {x: 0, y: 1200, width: 375, height: 180}
    };

    backgroundMusic_.loop = true;
    backgroundMusic_.preload = true;

    return {
      width: function() { return width_; },
      height: function() { return height_; },
      interval: function() { return interval_; },
      canvas: function() { return canvas_; },
      ctx: function() { return ctx_; },
      sounds: { bgsound: backgroundMusic_, hitsound: hitsound_ },
      srcpos: function() { return srcPos_; },
      src: function() { return src_; }
    };
})();

myth.base.classes = (function() {
    var variables = myth.base.vars,
        c = variables.ctx(),
        screenWidth = variables.width(),
        screenHeight = variables.height();

    /** 
    * private random method
    * @param {number} 
    * @param {number} 
    * @param {number} how many decimal to remain
    * @return {number} a random number from min(n, m) to max(n, m), (or 0 to n), not include max(n, m);
    */ 
    function random(n, opt_m, opt_decimals) {  //to do: how to solute the [0, 1] range problem
      var m = opt_m || 0,
          rand, swap, times;
      if (n > m) {
        swap = n;
        n = m;
        m = swap;
      }
      rand = n + Math.random() * (m - n);
      if (opt_decimals > 0) {
        times = Math.pow(10, opt_decimals);
        return Math.floor(rand * times) / times;
      }
      return Math.floor(rand);
    }

    /**
    * Position Class
    * @param {number} x coord
    * @param {number} y coord
    */
    function Position(x, y) {
      var x_ = x,
          y_ = y;

      this.x = function(x) {
        if (x != undefined) x_ = x;
        return x_;
      };
      this.y = function(y) {
        if (y != undefined) y_ = y;
        return y_;
      };
      this.reset = function(x, y) {
        if (arguments.length === 2) {
          x_ = x;
          y_ = y;
        }
        return this;
      };
    }
    /** static method */
    Position.equals = function(p1, p2) {
      return p1.x() === p2.x() && p1.y() === p2.y();
    };
    Position.distance = function(p1, p2) {
      return Math.sqrt(Math.pow(p1.x() - p2.x(), 2) + Math.pow(p1.y() - p2.y(), 2));
    };

    /** if the point at Position p1 hit the object with w width and h height at Position p2 
    * if not origin :            if origin:
    *  ---------             ----------
    *  |       |             |`      |
    *  |   .   |             |       |
    *  |       |             |       |
    *  ---------             ----------
    *  the point refers to the position the box refers to the object scope
    */
    Position.hit = function(p1, o, origin) {   //to do: judge the object's picture's data to leave out transparent data
      var p2 = o.pos,
          w = o.width(),
          h = o.height();

      return (!origin  && p1.x() >= p2.x() - w / 2 && p1.x() <= p2.x() + w / 2 &&
        p1.y() >= p2.y() - h / 2 && p1.y() <= p2.y() + h / 2) ||
      (origin && p1.x() >= p2.x() && p1.x() <= p2.x() + w && 
        p1.y() >= p2.y() && p1.y() <= p2.y() + h); 
    };


    /**
    * Star Class
    * @param {number} zoom_: zoom multiples of the star picture
    * @param {number} life_: life of the star . units: second
    * @param {number} angle_: angle of the star, from 0 to 2 * pi
    */
    function Star(zoom, life, angle, type) {
      var zoom_ = zoom || this.MINZOOM,
          life_ = life || this.DEFAULT_LIFE,
          angle_ = angle || 0,
          status_ = true, 
          width_ = this.WIDTH * zoom_,
          height_ = this.HEIGHT * zoom_,
          pos_ = new Position(0, 0),
          type_ = 0,
          image_ = new Image(),
          srcx_ = 0,
          srcy_ = 0;

      /**
      * @initilize
      */
      if (type && type <= 12 && type >= 1) {
        type_ = type;
      } else {
        type_ = 0;
      }
      image_.src = myth.base.vars.src();
      srcx_ = myth.base.vars.srcpos().stars(type_).x;
      srcy_ = myth.base.vars.srcpos().stars(type_).y;

      this.type = function() { return type_; };
      this.status = function() { return status_; };
      this.width = function() { return width_; };
      this.height = function() { return height_; };
      this.pos = pos_;

      /** draw the star */
      this.draw = function() {
        c.save();
        c.translate(pos_.x(), pos_.y());
        c.rotate(angle_);
        c.drawImage(image_, srcx_, srcy_, this.WIDTH, this.HEIGHT, -width_ / 2, -height_ / 2, width_, height_);
        c.restore();
      };

      /** 
      * star's life decrease when it can do
      * @return {boolean} if the star is die, return false; otherwise return true
      */
      this.nextlife = function() {
        if (life_ > 0) {
          life_ -= variables.interval() / 1000;
          return true;
        } else {
          return false;
        }
      };

      /** 
      * change status to false
      * @return {boolean} if changed successfully
      */
      this.changeStatus = function() {
        status_ = false;
      };
    }
    /**
    * Star Class's const variables
    * @const {Number} DEFAULT_LIFE: the default life time.(units: second)
    * @const {Number} WIDTH/HEIGHT: the origin size of the picture
    */
    Star.prototype.DEFAULT_LIFE = 3;
    Star.prototype.WIDTH = myth.base.vars.srcpos().stars(0).width;
    Star.prototype.HEIGHT = myth.base.vars.srcpos().stars(0).height;

    /**
    * @static {Number} MINZOOM/MAXZOOM: the zoom range
    */
    Star.MINZOOM = 0.3;
    Star.MAXZOOM = 0.5;

    /** 
    * StarsGroup Class 
    * @param {number} n: the number of the stars to be initilized
    */
    function StarsGroup(n, type) {
      var lifeTime_ = 3, 
          array_ = [], 
          i = 0, 
          j = 0,
          create = null,
          swap = [],
          type_ = type; //to do: every type has three random pic

      /**
      * method to create a new star
      * @private
      * @return {object.<Star>}
      */
      function create_() {
        var constellationStar = (function() {
            var n = random(0, 1000);
            if (n > 976) {
              return n % 12 + 1;
            } else {
              return 0;
            }
        })();

        create = new Star(
          random(Star.MINZOOM, Star.MAXZOOM, 2),
          random(1, lifeTime_, 2),
          random(0, Math.PI * 2, 2),
          constellationStar);
        create.pos.reset(random(create.width(), screenWidth - create.width()),
          random(create.height(), screenHeight - create.height()));
        return create;
      }

      /** @initilize */
      array_.length = n || 20;
      for (i = 0; i < n; ++i) {
        array_[i] = create_();
      } 

      /** draw all the stars */
      this.draw = function() {
        for (i = 0; i < array_.length; ++i) {
          if (array_[i]) {
            if (array_[i].status() && !array_[i].nextlife()) {
              array_[i] = null;
            } else {
              array_[i].draw();
            }
          }
        }
      };

      /** 
      * if the p is hit some star, change the status
      * @return {Object} if some star is being hit,
      *                  return some attributes and methods,
      *                  else return false
      */
      this.isHit = function(p) {
        for (i = 0; i < array_.length; ++i) {
          if (array_[i] && array_[i].status() && Position.hit(p, array_[i], false)){
            var t = array_[i].type();
            array_[i].changeStatus();
            return {
              pos: array_[i].pos,
              type: t,
              clear: function() {
                array_[i] = null;
              }
            };
          }
        }
        return false;
      };

      /** 
      * count the remain stars number
      * @return {number}
      */
      this.remainNumber = function() {
        j = 0;
        for (i = 0; i < array_.length; ++i) {
          if (array_[i] && array_[i].status()) {
            ++j;
          }
        }
        return j;
      };
    }

    /**
    * Path Class
    */
    function Path(style) {
      var i = 0,
          points_ = [],
          last_ = new Position(0, 0),
          style_ = style;

      function setStyle() {
        switch (style_) {
         case 'wind':
          c.strokeStyle = '#fff';
          c.shadowColor = '#3c6';
          break;
         case 'fire':
          c.strokeStyle = '#fff';
          c.shadowColor = '#933';
          break;
         case 'earth':
          c.strokeStyle = '#fff';
          c.shadowColor = '#966';
          break;
         case 'water':
          c.strokeStyle = '#fff';
          c.shadowColor = '#39c';
          break;
         default:
          c.strokeStyle = '#fff';
          c.shadowColor = style_.color;
          break;
        }

      }


      /** add a point */
      this.add = function(p) {
        points_[points_.length] = p;
      };

      /** draw the path and the last point is the mouse position */
      this.draw = function() {
        if (points_.length > 1) {
          c.save();
          c.lineWidth = 4;
          c.shadowBlur = 8;
          setStyle();
          c.beginPath();
          c.moveTo(points_[0].x(), points_[0].y());
          for (i = 1; i < points_.length; ++i) {
            c.lineTo(points_[i].x(), points_[i].y());
            c.stroke();
          }
          //        暂时去掉最后跟踪鼠标的连线
          //        c.lineTo(last_.x(), last_.y());
          //        c.stroke();
          c.restore();
        }
      };
    }

    /**
    * Score class
    */
    function Score(type) {
      var type_ = type,
          image_ = new Image(),
          pos_ = new Position(15, 15),
          o_ = variables.srcpos()[type + 'Score'];

      image_.src = variables.src();

      function setStyle() {
        switch (type_) {
         case 'fire':
          c.fillStyle = '#f60606';
          break;
         case 'water':
          c.fillStyle = '#03afce';
          break;
         case 'earth':
          c.fillStyle = '#913f2a';
          break;
         case 'wind':
          c.fillStyle = '#22ec01';
          break;
         default:
          break;
        }
      }

      this.draw = function(score) {
        c.save();
        c.drawImage(image_, o_.x, o_.y, o_.width, o_.height, pos_.x(), pos_.y(), o_.width, o_.height);
        c.textAlign = 'center';
        c.font = '30px Arial';
        setStyle();
        c.fillText(score + '', 100, 50);
        c.restore();
      };

    }

    return {
      Stars: StarsGroup,
      Path: Path,
      Position: Position,
      Score: Score
    };
})();


myth.base.event = {
  clickEvent: (function() {
      var pageObject_ = null,
          option_ = '',
          param_ = null;

      function changeHandler(o, opt_param) {
        pageObject_ = o;
        param_ = opt_param;
      }

      function handler(e) {
        e.preventDefault();
        option_ = pageObject_.event(new myth.base.classes.Position(e.offsetX || e.clientX, e.offsetY || e.clientY));
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
      var fn_ = null;
      function handler(e) {
        e.preventDefault();
        if (fn_)
          fn_(new myth.base.classes.Position(e.offsetX || e.clientX, e.offsetY || e.clientY));
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


