//GLOBAL NAMESPACE
var GLOBAL = {
  'width' : 480,
  'height' : 320,
  /** interval：gameloop interval */
  'interval' : 25,
  'canvas' : document.getElementById('main'),
  'ctx' : document.getElementById('main').getContext('2d'),

  /** 
  * random method
  * @param {number} 
  * @param {number} 
  * @return {number} a random number from min(n, m) to max(n, m), (or 0 to n), not include max(n, m);
  */ 
  'random' : function(n, opt_m){
    var m = opt_m || 0;
    return Math.min(n, m) + Math.floor(Math.random() * Math.abs(m - n));
  },

  /** Classes */

  /**
  * Position Class
  * @param {number} x coord
  * @param {number} y coord
  */
  'Position' : function(x, y){
    var x_ = x,
        y_ = y;

    /**
    * @public
    */
    this.x = function(x){
      if(x != undefined)
        x_ = x;
      return x_;
    };
    this.y = function(y){
      if(y != undefined)
        y_ = y;
      return y_;
    };
  },

  /**
  * Star Class
  * @param {number} size_: star size 1：small、2：middle、3：large
  * @param {number} status_: life of the star . units:second
  * @param {number} angle_: angle of the star, from 0 to 2 * pi
  */
  'Star' : function(size, status, angle){
    var size_ = size || 1,
        status_ = status || 3,
        angle_ = angle || 0,
        width_ = 10,
        height_ = 10;

    /**
    * @initilize 
    */
    switch(size_){
     case '1':
      width_ = 10;
      height_ = 10;
      break;
     case '2':
      width_ = 20;
      height_ = 20;
      break;
     case '3':
      width_ = 30;
      height_ = 30;
      break;
     default:
      break;
    }

    /**
    * @public
    */
    this.size = size_; 
    this.width = width_;
    this.height = height_;
    this.pos = new GLOBAL.Position(0, 0);
    this.status = status_;
    this.angle = angle_;

    /** draw the star */
    this.draw = function(){
      GLOBAL.ctx.save();
      GLOBAL.ctx.rotate(angle_);
      GLOBAL.ctx.drawImage(this['image' + size_],
        this.pos.x() * Math.cos(angle_) + this.pos.y() * Math.sin(angle_),
        this.pos.y() * Math.cos(angle_) - this.pos.x() * Math.sin(angle_));
      GLOBAL.ctx.restore();
    };
    /** 
    * life status decrease
    * @return {boolean} if the star is die
    */
    this.nextStatus = function(){
      if(status_ > 0){
        status_ -= GLOBAL.interval/1000;
        return true;
      }else
        return false;
    };
  },

  /** 
  * StarsArray Class 
  * @param {number} n:the number of the stars to be initilized
  */
  'StarsArray' : function(n){
    var i = 0, 
        statusTime_ = 3, 
        array_ = [], 
        create = null,
        swap = []; 

    /**
    * method to create a new star
    * @private
    * @return {object.<Star>}
    */
    function create_(){
      create = new GLOBAL.Star(GLOBAL.random(GLOBAL.Star.MINSIZE, GLOBAL.Star.MAXSIZE + 1),
        GLOBAL.random(statusTime_),
        Math.random() * Math.PI * 2);
      create.pos.x(GLOBAL.random(create.width,
          GLOBAL.width - create.width));
      create.pos.y(GLOBAL.random(create.height,
          GLOBAL.height - create.height));
      return create;
    }

    /**
    * @initilize
    */
    array_.length = n;
    for(i = 0; i < n; i++){
      array_[i] = create_();
    } 

    /**
    * @public
    * get the stars array
    */
    this.stars = function(){
      swap = [];
      for(i = 0; i < array_.length; i++){
        if(array_[i])
          swap[swap.length] = array_[i];
      }
      return swap;
    };
    /** get or set the number of the stars array*/
    this.number = function(n){
      if(n != undefined){
        array_.length = n;
      }
      return array_.length;
    };
    /** all the stars' lives decrease*/
    this.changeStatus = function(){
      for(i = 0; i < array_.length; i++){
        if(!(array_[i] && array_[i].nextStatus()))
          array_[i] = create_();
      }
    };
    /** draw all the stars*/
    this.draw = function(){
      for(i = 0; i < array_.length; i++){
        if(array_[i])
          array_[i].draw();
      }
    };
    /** 
    * remove a Star
    * @param {object.<Star>} o:the star to be removed
    * @return {boolean} if remove the star
    */
    this.remove = function(o){
      for(i = 0; i < array_.length; i++){
        if(array_[i] === o){
          array_[i] = null;
          return true;
        }
      }
      return false;
    };
  },

  /**
  * Tail Class
  */
  'Tail' : function(){
    var i = 0,
        path_ = [],
        maxlength_ = 50;

    /**
    * @public
    * add a new point of the tail 
    */
    this.add = function(p){
      path_.unshift(p);
      if(path_.length > maxlength_)
        path_.length = maxlength_;
    };
    /** draw the tail */
    this.draw = function(){
      for(i = 0; i < path_.length; i++){
        GLOBAL.ctx.drawImage(this.image, path_[i].x(), path_[i].y());
      }
    };
    /** delete the last tail point*/
    this.del = function(){
      path_.pop();
    };
  },

  /*Cloud Class*/
  'Cloud' : function(){
    //to do
  },

  /*Obstacle Class*/
  'Obstacle' : function(){
    //to do
  },

  /**
  * Timer Class
  * @param {number} the total seconds of the timer
  */
  'Timer' : function(t){
    var duration_ = t * 1000 || 60 * 1000,
        count_ = 0,
        pauseStatus_ = false; 

    /**
    * @public
    * get the remain seconds curently 
    * @return {String} seconds string
    */
    this.now = function(){
      if(!pauseStatus_)
        duration_ =  (count_ - (new Date()).getTime()) < 0 ? 0 : (count_ - (new Date()).getTime());
      return Math.ceil(duration_/1000);
    };
    /** start the timer */
    this.start = function(){
      count_ = duration_ + (new Date()).getTime();
      pauseStatus_ = false;
    };
    /** pause the timer */
    this.pause = function(){
      pauseStatus_ = true;
    };
    /**
    * @return {boolean} if the timer is pause
    */
    this.isPause = function(){
      return pauseStatus_;
    };
  }

};


GLOBAL.Star.prototype.image1 = new Image();
GLOBAL.Star.prototype.image2 = new Image();
GLOBAL.Star.prototype.image3 = new Image();
GLOBAL.Star.prototype.image1.src = 'images/star1.png';
GLOBAL.Star.prototype.image2.src = 'images/star2.png';
GLOBAL.Star.prototype.image3.src = 'images/star3.png';
/**
* @const {number}
*/
GLOBAL.Star.MINSIZE = 1;
GLOBAL.Star.MAXSIZE = 3;

GLOBAL.Tail.prototype.image = new Image();
GLOBAL.Tail.prototype.image.src = 'images/circle.png';
GLOBAL.Tail.prototype.width = 30;
GLOBAL.Tail.prototype.height = 30;

GLOBAL.Position.equal = function(p1, p2){
  if(p1.x() === p2.x() && p1.y() === p2.y())
    return true;
  else
    return false;
};

GLOBAL.Position.hit = function(p1, p2, w, h){ //if the point at Position p1 hit the object with w width and h height at Position p2
  if(p1.x() >= p2.x() && p1.x() <= p2.x() + w && p1.y() >= p2.y() && p1.y() <= p2.y() + h)
    return true;
  else
    return false;
};
