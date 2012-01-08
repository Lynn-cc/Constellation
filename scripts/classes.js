myth.base.classes = new function() {
  var self = this,
      variables = myth.base.vars,
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
  function random(n, opt_m, opt_decimals) {
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
      if (x != undefined)
        x_ = x;
      return x_;
    };
    this.y = function(y) {
      if (y != undefined)
        y_ = y;
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
  Position.hit = function(p1, o, origin) {
    var p2 = o.pos,
        w = o.width(),
        h = o.height();

    return (!origin  && p1.x() >= p2.x() - w / 2 && p1.x() <= p2.x() + w / 2 &&
      p1.y() >= p2.y() - h / 2 && p1.y() <= p2.y() + h / 2) ||
    (origin && p1.x() >= p2.x() && p1.x() <= p2.x() + w && 
      p1.y() >= p2.y() && p1.y() <= p2.y() + h); 
  };

  self.Position = Position;


  /**
  * Star Class
  * @param {number} maxlife of the star, units: second
  * @param {String} the game type
  */
  function Star(maxlife, type) {
    //问题：私有变量后缀掉了吧。。
    var displayFlag = true,
        rteAngle_ = 0,
        status_ = true, 
        type_ = 0,
        srcx_ = 0,
        srcy_ = 0,
        zoom_ = random(this.MINZOOM, this.MAXZOOM, 2),
        life_ = random(2, maxlife, 2),
        angle_ = random(0, Math.PI * 2, 2),
        width_ = this.WIDTH * zoom_,
        height_ = this.HEIGHT * zoom_,
    pos_ = new Position(random(width_, screenWidth - width_),
      random(height_, screenHeight - height_));


    //问题：
    //大写的是const变量的哇，这个为什么被life这个参数赋值，这是不对的吧。
    //你可以在外面用Star.prototype.FULL_LIFE = 固定值。。。
    //否则，你就用上面私有变量的方法赋值
    var FULL_LIFE = life_;

    /**
    * @initilize
    */
    type_ = (function() {
        var n = random(0, 1000);
        if (n >= 1000 - 13) {
          return n % 12 + 1;
        } else {
          return 0;
        }
    })();

    srcx_ = myth.base.vars.srcpos().stars(type_).x;
    srcy_ = myth.base.vars.srcpos().stars(type_).y;

    this.type = function() { return type_; };
    this.status = function(s) { 
      if (s != undefined)
        status_ = s;
      return status_; 
    };
    this.width = function() { return width_; };
    this.height = function() { return height_; };
    this.angle = function() { return angle_; };
    this.srcx = function() { return srcx_; };
    this.srcy = function() { return srcy_; };
    this.pos = pos_;
    //问题：
    //值类型用function来返回，例如上面的type，status之类的
    //引用类型才直接返回，例如上面的pos\
    //life已经帮你改了，你自己改你的fulllife
    this.life = function(l) {
      if (l != undefined)
        life_ = l;
      return life_;
    };
    this.fullLife = FULL_LIFE;


    //问题：
    //这两个方法表示没看懂，3个draw了，有那么大区别？你还在改的吧？
    //貌似你的angle，用的是参数，私有变量是angle_，是不是写错了..帮你改了
    //你再按照prototype.draw函数的方式，把全部改一下，然后移到外面去。
    /** draw the star when it is creating*/
    this.drawBegin = function() {
      c.save();
      c.translate(this.pos.x(), this.pos.y());
      c.rotate(angle_ + rteAngle_);
      c.drawImage(this.image, this.srcx(), this.srcy(), this.WIDTH, this.HEIGHT,
        -this.width() / 2, -this.height() / 2, this.width(), this.height());
      c.restore();
      rteAngle_ += Math.PI / 10;
    };

    /** draw the star when it is killing*/
    this.drawEnd = function() {
      c.save();
      c.translate(this.pos.x(), this.pos.y());
      c.rotate(angle_);
      if (displayFlag) {
        c.drawImage(this.image, this.srcx(), this.srcy(), this.WIDTH, this.HEIGHT,
          -this.width() / 2, -this.height() / 2, this.width(), this.height());
        displayFlag = false;
      }
      else {
        displayFlag = true;
      }
      c.restore();
    };
  }
  /**
  * Star Class's const variables / prototype variables and methods
  * @const {Number} DEFAULT_LIFE: the default life time.(units: second)
  * @const {Number} WIDTH/HEIGHT: the origin size of the picture
  */

  Star.prototype = {
    DEFAULT_LIFE: 2,
    WIDTH: myth.base.vars.srcpos().stars(0).width,
    HEIGHT: myth.base.vars.srcpos().stars(0).height,
    MINZOOM : 0.5,
    MAXZOOM : 0.8,
    image: new Image(),
    draw: function() {
      c.save();
      c.translate(this.pos.x(), this.pos.y());
      c.rotate(this.angle());
      c.drawImage(this.image, this.srcx(), this.srcy(), this.WIDTH, this.HEIGHT,
        -this.width() / 2, -this.height() / 2, this.width(), this.height());
      c.restore();
    },
    /** 
    * star's life decrease when it can do
    * @return {boolean} if the star is die, return false; otherwise return true
    */
    nextlife: function() {
      if (this.life() > 0) {
        this.life(this.life() - variables.interval() / 1000);
        return true;
      } else {
        return false;
      }
    },
    /** 
    * change status to false
    * @return {boolean} if changed successfully
    */
    changeStatus: function() {
      this.status(false);
    }
  };
  Star.prototype.image.src = myth.base.vars.src();



  /** 
  * StarsGroup Class 
  * @param {Number} n: the number of the stars to be initilized
  * @param {String} type: the game type
  */
  self.Stars = function StarsGroup(n, type) {
    //问题：这是我的问题，名字没取好，换过来了，lifeTime 换成 maxlife
    //另外这个type是游戏类型，要在每个游戏类型里面产生相应星象的星座星星。
    //现在暂时还没用这个参数的，要用在star类里面用
    var maxlife_ = 4, 
        array_ = [], 
        i = 0, 
        j = 0,
        swap = [],
        type_ = type;

    /** @initilize */
    array_.length = n || 20;
    for (i = 0; i < n; ++i) {
      array_[i] = new Star(maxlife_, type_);
    }

    /** draw all the stars */
    this.draw = function() {
      for (i = 0; i < array_.length; ++i) {
        if (array_[i]) {
          if (array_[i].status() && !array_[i].nextlife()) {
            array_[i] = null;
          } else {
            //问题：
            //这里的三种画法，其实都只在调用star类的方法
            //无关starsGroup的东西，甚至还更改star的私有变量值
            //所以其实你可以直接在star的draw里面进行这样的判断
            //外面统一给draw方法就可以了。
            //同理，其实我写的create方法，也可以在star自己的
            //构造函数里面随机，而不用在starsGroup类里面随机
            //所以我把create修改了。而这个方法你自己修改。
            if (array_[i].life() > array_[i].fullLife - 1) {
              array_[i].drawBegin();
            }
            else if (array_[i].life() < 1) {
              array_[i].drawEnd();  
            }
            else {
              array_[i].draw(); 
            }
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

    /**
    * count the lost stars number
    * @return {number}
    */
    this.lostNumber = function() {
      //问题：
      //你声明变量的时候，没有用var，已经给你添加上了，这个错误很严重！
      var num = 0;
      for (i = 0; i < array_.length; ++i) {
        if (array_[i] === null) {
          ++num;
        }
      }
      return num;
    };
  };

  /**
  * Path Class
  */
  self.Path = function Path(style) {
    var points_ = [],
        style_ = style;

    this.points = points_;

    this.style = function() {
      return style_;
    };
  };

  self.Path.prototype = {
    draw: function() {
      if (this.points.length > 1) {
        c.save();
        c.lineWidth = 4;
        c.shadowBlur = 8;
        this.setStyle();
        c.beginPath();
        c.moveTo(this.points[0].x(), this.points[0].y());
        for (var i = 1; i < this.points.length; ++i) {
          c.lineTo(this.points[i].x(), this.points[i].y());
          c.stroke();
        }
        c.restore();
      }
    },
    add: function(p) {
      this.points[this.points.length] = p;
    },
    setStyle: function() {
      switch (this.style()) {
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
        break;
      }
    }
  };



  /**
  * Score class
  * @param {String} the game type
  */
  self.ProgressBar = function ProgressBar(type) {
    var type_ = type,
        image_ = new Image(),
        pos_ = new Position(15, 15),
        o_ = variables.srcpos()[type + 'Progress'],
        color_ = "";

    image_.src = variables.src();

    function setStyle() {
      switch (type_) {
       case 'fire':
        c.fillStyle = '#f60606';
        color_ = "rgba(170, 16, 24, 0.5)";
        break;
       case 'water':
        c.fillStyle = '#03afce';
        color_ = "rgba(7, 132, 160, 0.5)";
        break;
       case 'earth':
        c.fillStyle = '#913f2a';
        color_ = "rgba(101, 91, 82, 0.5)";
        break;
       case 'wind':
        c.fillStyle = '#22ec01';
        color_ = "rgba(4, 134, 31, 0.5)";
        break;
       default:
        break;
      }
    }
    
    //问题：
    //建议用一个统一的draw搞定，外面调用的时候
    //直接一起画出来。参数也合并一下
    this.drawNumber = function(number) {
      c.save();
      c.drawImage(image_, o_.x, o_.y, o_.width, o_.height, pos_.x(), pos_.y(), o_.width, o_.height);
      c.textAlign = 'center';
      c.font = '35px Arial';
      setStyle();
      c.fillText(number + '', 110, 55);
      c.restore();
    };

    this.drawProgressBar = function (progress){
      var beginX = 41,
          beginY = 20,
          rectWidth = 126,
          rectHeight = 44,
          radius = rectHeight / 2,
          leftCenter = new Position(beginX, beginY + radius),
          rightCenter = new Position(beginX + rectWidth, beginY + radius),
          beginProgressX = 20,
          beginProgressY = 20,
          progressWidth = rectWidth + 2 * radius,
          progressHeight = rectHeight;

      c.save();
      c.beginPath();
      c.moveTo(beginX, beginY);
      c.lineTo(beginX + rectWidth, beginY);
      c.arc(rightCenter.x(), rightCenter.y(), radius, Math.PI * 3 / 2, Math.PI / 2, false);
      c.lineTo(beginX, beginY + rectHeight);
      c.arc(leftCenter.x(), leftCenter.y(), radius, Math.PI / 2, Math.PI * 3 / 2, false);
      c.clip();
      c.fillStyle = color_;
      c.fillRect(beginProgressX, beginProgressY, progressWidth * progress, progressHeight);
      c.restore();
    };
  };



  /**
  * Obstacle class
  */
  function Obstacle (type) {
    var life_ = 0,
        image_ = new Image(),
        pos_ = null,
        o_ = null,
        width_ = 0,
        height_ = 0,
        status_ = true,
        //问题：
    //参数需要赋值给私有变量，而不是直接使用
    //已经帮你添加上了
    type_ = type;

    switch(type_) {
     case "water":
      o_ = variables.srcpos()['cloud'];
      break;
     case "fire":
      o_ = variables.srcpos()['cloud'];//暂时用云作为障碍物
      break;
     case "earth":
      o_ = variables.srcpos()['cloudBlack'];
      break;
     case "wind":
      o_ = variables.srcpos()['cloud'];//暂时用云作为障碍物
      break;
     default:
      break;
    }
    width_ = o_.width;
    height_ = o_.height;
    //问题：
    //pos这样随机出来，画的云可能大半部分漏在屏幕外面。
    //所以你可以让屏幕长宽减去图像的本身长宽作为随机范围
    pos_ = new Position(random(0, screenWidth), random(0, screenHeight));
    life_ = random(2, 6);

    this.pos = pos_;
    this.width = function() { return width_; };
    this.height = function() { return height_; };
    this.status = function() { return status_; };
    //    this.type = function() { return type_; };
    this.srcx = function() { return o_.x; };
    this.srcy = function() { return o_.y; };
    this.life = function(l) {
      if (l != undefined)
        life_ = l;
      return life_;
    };
  }
  Obstacle.prototype = {
    image: new Image(),
    draw: function() {
      c.save();
      c.translate(this.pos.x(), this.pos.y());
      c.drawImage(this.image, this.srcx(), this.srcy(), this.width(), this.height(), 
        -this.width() / 2, -this.height() / 2, this.width(), this.height());
      c.restore();
    },
    nextlife: function() {
      if (this.life() > 0) {
        this.life(this.life() - variables.interval() / 1000);
        return true;
      } else {
        return false;
      }
    }
  };
  Obstacle.prototype.image.src = variables.src();



  /**
  * ObstacleGroup class
  */
  self.Obstacles = function ObstacleGroup(type) {
    var array_ = [],
        n_ = 0,
        type_ = type;

    var ran = random(1, 10);
    //问题：
    //else if 建议写到上一行后括号一个空格之后
    //if\for\while这些的条件的括号前后要空格：if (condition) {}
    //另外这个算法是可以简化的:
    //if (ran < 4 ) n_ = 3;      //0, 1, 2, 3
    //else if (ran < 7) n_ = 5;  //4, 5, 6
    //else if (ran < 9) n_ = 7;  //7, 8
    //else n_ = 9;               //9 
    if(ran >= 1 && ran <= 4){
      n_ = 3; 
    }
    else if (ran >= 5 && ran <= 7){
      n_ = 5;
    }
    else if (ran >= 8 && ran <= 9){
      n_ = 7;
    }
    else{
      n_ = 9;
    }
    for (i = 0; i < n_; i++) {
      array_[i] = new Obstacle(type_);
    }

    //问题：
    //建议统一用draw，也比较简洁
    this.drawObstacles = function() {
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

    this.remainNumber = function() {
      j = 0;
      for (i = 0; i < array_.length; ++i) {
        if (array_[i] && array_[i].status()) {
          ++j;
        }
      }
      return j;
    };

    this.isHit = function(p) {
      for (i = 0; i < array_.length; ++i) {
        if (array_[i] && array_[i].status() && Position.hit(p, array_[i], false)){
          return {
            pos: array_[i].pos,
            clear: function() {
              array_[i] = null;
            }
          };
        }
      }
      return false;
    };
  };
};
