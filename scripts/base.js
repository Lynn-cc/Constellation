//myth namespace
var myth = {};
myth.base = {};
myth.init = function() {
  myth.base.vars.canvas().width = myth.base.vars.width();
  myth.base.vars.canvas().height = myth.base.vars.height();
};

myth.base.vars = (function() {
  var width_ = null || 960,  //to do: get the screen resolution of mobile
      height_ = null || 640,
      interval_ = 25,
      canvas_ = document.getElementById('main'),
      ctx_ = document.getElementById('main').getContext('2d'),
      backgroundImage_ = new Image();

  backgroundImage_.src = 'images/background.jpg';   //change pic with different size here

  return {
    width: function() { return width_; },
    height: function() { return height_; },
    interval: function() { return interval_; },
    canvas: function() { return canvas_; },
    ctx: function() { return ctx_; },
    background: function() { return backgroundImage_; }
  };
})();

myth.base.classes = (function() {
  var variables = myth.base.vars,
      c = variables.ctx(),
      interval = variables.interval(),
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
        image_ = new Image();

    /**
    * @initilize
    */
    if (type && type <= 12 && type >= 1) {
      type_ = type;
    } else {
      type_ = 0;
    }
    image_.src = this.srcGroup[type_];

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
      c.drawImage(image_, -width_ / 2, -height_ / 2, width_, height_);
      c.restore();
    };

    /** 
    * star's life decrease when it can do
    * @return {boolean} if the star is die, return false; otherwise return true
    */
    this.nextlife = function() {
      if (life_ > 0) {
        life_ -= interval / 1000;
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
      type_ = 13;
      image_.src = this.srcGroup[type_];
    };
  }
  /**
  * Star Class's const variables
  * @const {Number} DEFAULT_LIFE: the default life time.(units: second)
  * @const {Number} WIDTH/HEIGHT: the origin size of the picture
  */
  Star.prototype.DEFAULT_LIFE = 3;
  Star.prototype.WIDTH = 256;
  Star.prototype.HEIGHT = 256;
  /**
  * Every stars type src
  * 0 refers to the origin star
  * 1-12 refers to the constellation star
  * 13 refers to the win star
  */
  Star.prototype.srcGroup = [];
  for (var i = 0; i < 14; ++i) {
    Star.prototype.srcGroup[i] = 'images/constellation' + i + '.png';
  }

  /**
  * @static {Number} MINZOOM/MAXZOOM: the zoom range
  */
  Star.MINZOOM = 0.1;
  Star.MAXZOOM = 0.3;

  /** 
  * StarsGroup Class 
  * @param {number} n: the number of the stars to be initilized
  */
  function StarsGroup(n) {
    var lifeTime_ = 4, 
        array_ = [], 
        i = 0, 
        j = 0,
        create = null,
        swap = []; 

    /**
    * method to create a new star
    * @private
    * @return {object.<Star>}
    */
    function create_() {
      var constellationStar = (function() {
          var n = random(0, 1, 3);
          if (n > 0.904) {
            return parseInt((n * 1000) % 12 + 1, 10);
          } else {
            return 0;
          }
      })();

      create = new Star(
        random(Star.MINZOOM, Star.MAXZOOM, 2),
        random(lifeTime_),
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
    * @return {Position} if p is hit some star and change status, return the star's position
    */
    this.isHit = function(p) {
      for (i = 0; i < array_.length; ++i) {
        if (array_[i] && array_[i].status() && Position.hit(p, array_[i], false)){
          var t = array_[i].type();
          array_[i].changeStatus();
          return {
            pos: array_[i].pos,
            type: t
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
  function Path() {
    var i = 0,
        points_ = [],
        last_ = new Position(0, 0);

    /** add a point */
    this.add = function(p) {
      points_[points_.length] = p;
    };

    //    /** modify the last point */
    //    this.last = function(p) {
    //      last_ = p;
    //    };

    /** draw the path and the last point is the mouse position */
    this.draw = function() {
      if (points_.length > 1) {
        c.save();
        c.strokeStyle = 'blue';
        c.lineWidth = 3;
        c.shadowBlur = 10;
        c.shadowColor = 'white';
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

  return {
    Stars: StarsGroup,
    Path: Path,
    Position: Position
  };
})();

