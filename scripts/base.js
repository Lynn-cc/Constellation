//GLOBAL NAMESPACE
var GLOBAL = {
  'width': 480,
  'height': 320,
  /** interval：gameloop interval */
  'interval': 25,
  'canvas': document.getElementById('main'),
  'ctx': document.getElementById('main').getContext('2d'),

  /** 
  * random method
  * @param {number} 
  * @param {number} 
  * @param {boolean} if return a decimals(Retain a decimal)
  * @return {number} a random number from min(n, m) to max(n, m), (or 0 to n), not include max(n, m);
  */ 
  //to do: how to solute the [0, 1] range problem
  'random': function(n, opt_m, opt_decimals) {
    var m = opt_m || 0;
    if(opt_decimals)
      return (Math.floor((Math.min(n, m) + Math.random() * Math.abs(m - n)) * 10))/10;
    return Math.min(n, m) + Math.floor(Math.random() * Math.abs(m - n));
  },

  
  /** Classes */

  /**
  * Position Class
  * @param {number} x coord
  * @param {number} y coord
  */
  'Position': function(x, y) {
    var x_ = x,
        y_ = y;

    /**
    * @public
    */
    this.x = function(x) {
      if(x != undefined)
        x_ = x;
      return x_;
    };
    this.y = function(y) {
      if(y != undefined)
        y_ = y;
      return y_;
    };
  },

  /**
  * Star Class
  * @param {number} zoom_: zoom multiples of the star picture
  * @param {number} life_: life of the star . units: second
  * @param {number} angle_: angle of the star, from 0 to 2 * pi
  */
  'Star': function(zoom, life, angle) {
    var zoom_ = zoom || 1,
        life_ = life || 3,
        angle_ = angle || 0,
        status_ = true, //status: if the star's life should be decreased
        width_ = this.WIDTH * zoom_,
        height_ = this.HEIGHT * zoom_,
        pos_ = new GLOBAL.Position(0, 0);

    /**
    * @public
    */
    this.zoom = zoom_; 
    this.life = life_;
    this.angle = angle_;
    this.status = status_;
    this.width = width_;
    this.height = height_;
    this.pos = pos_;

    /** draw the star */
    this.draw = function() {
      GLOBAL.ctx.save();
      GLOBAL.ctx.translate(pos_.x(), pos_.y());
      GLOBAL.ctx.rotate(angle_);
      GLOBAL.ctx.drawImage(this['image' + (status_ ? '1' : '2')], -width_/2, -height_/2, width_, height_);
      GLOBAL.ctx.restore();
    };
    /** 
    * star's life decrease when it can do
    * @return {boolean} if the star is die, return false; otherwise return true
    */
    this.nextlife = function() {
      if(!status_) {
        return true;
      } else {
        if(life_ > 0) {
          life_ -= GLOBAL.interval/1000;
          return true;
        } else {
          return false;
        }
      }
    };
    /**
    * change status to false
    */
    this.changeStatus = function() {
      if(status_){
        status_ = false;
        return true;
      } else {
        return false;
      }
    };
  },

  /** 
  * StarsArray Class 
  * @param {number} n: the number of the stars to be initilized
  */
  'StarsArray': function(n) {
    var i = 0, 
        j = 0,
        lifeTime_ = 4, 
        array_ = [], 
        create = null,
        swap = []; 

    /**
    * method to create a new star
    * @private
    * @return {object.<Star>}
    */
    function create_() {
      create = new GLOBAL.Star(
        GLOBAL.random(GLOBAL.Star.MINZOOM, GLOBAL.Star.MAXZOOM, true),
        GLOBAL.random(lifeTime_),
        Math.random() * Math.PI * 2);
      create.pos.x(GLOBAL.random(create.width, GLOBAL.width - create.width));
      create.pos.y(GLOBAL.random(create.height, GLOBAL.height - create.height));
      return create;
    }

    /**
    * @initilize
    */
    array_.length = n;
    for(i = 0; i < n; i++) {
      array_[i] = create_();
    } 

    /**
    * @public
    */
    /** get or set the number of the stars array */
//    this.number = function(n) {
//      if(n != undefined) {
//        array_.length = n;
//      }
//      return array_.length;
//    };

    /** 
    * get the position of some star
    * @return {Position}
    */
    this.pos = function(i) {
      return array_[i].pos;
    };
    /** all the stars' lives decrease */
    this.lifeDecrease = function() {
      for(i = 0; i < array_.length; i++) {
        if(array_[i] && !array_[i].nextlife())
          array_[i] = null;
      }
    };
    /** draw all the stars */
    this.draw = function() {
      for(i = 0; i < array_.length; i++) {
        if(array_[i])
          array_[i].draw();
      }
    };
    /** 
    * change the star's status 
    * @return {boolean} if the star's status has been changed
    */
    this.changeStatus = function(i) {
      if(array_[i])
        return array_[i].changeStatus();
      return false;
    };
    /** 
    * if the p is hit some star
    * @return {number} if p is hit some star, return a the index number; otherwise return -1
    */
    this.isHit = function(p){
      for(i = 0; i < array_.length; i++) {
        if(array_[i] && array_[i].status && GLOBAL.Position.hit(p, array_[i]))
          return i;
      }
      return -1;
    };
    /** 
    * count the successful stars number
    * @return {number}
    */
    this.successNumber = function() {
      j = 0;
      for(i = 0; i < array_.length; i++) {
        if(array_[i] && !array.status)
          j++;
      }
      return j;
    };
    //    /** 
    //    * remove a Star
    //    * @param {object.<Star>} o: the star to be removed
    //    * @return {boolean} if remove the star
    //    */
    //    this.remove = function(o) {
    //      for(i = 0; i < array_.length; i++) {
    //        if(array_[i] === o) {
    //          array_[i] = null;
    //          return true;
    //        }
    //      }
    //      return false;
    //    };
  },

  /**
  * Path Class
  */
  'Path': function() {

    var i = 0,
        point_ = [];

    this.add = function(p){
      point_[point_.length] = p;
    };

    this.draw = function(p){//to do: p is the current mouse position, no in point array, but draw it at the last point
      if(point_.length > 1){
        for(i = 1; i < point_.length; i++){
          GLOBAL.ctx.save();
          GLOBAL.ctx.strokeStyle = 'red';
          GLOBAL.ctx.lineWidth = 3;
          GLOBAL.ctx.beginPath();
          GLOBAL.ctx.moveTo(point_[i - 1].x(), point_[i - 1].y());
          GLOBAL.ctx.lineTo(point_[i].x(), point_[i].y());
          GLOBAL.ctx.stroke();
          GLOBAL.ctx.restore();
        }
      }
    };

    //    var i = 0,
    //        point_ = [],
    //        length_ = 0, //the total path length
    //        tailLength_ = 40, //the tail part length
    //        width_ = 5,
    //        angle_ = Math.atan2(width_/2, tailLength_),
    //        d_ab_ = 0,
    //        d_half_ = 0,
    //        outline_ = [],
    //        p1 = null,
    //        p2 = null;
    //
    //    /**
    //    * outline the path
    //    * variables' meaning: path[i-1]:a, path[i]:b, d_half:b to b1 or b to b2, b1,b2,b in a line and perpendicular to line ab.
    //    */
    //    function outlineCount_(){
    //      outline_ = [];
    //      outline_[0] = new GLOBAL.Position(point_[0].x(), point_[0].y());
    //      outline_[1] = new GLOBAL.Position(point_[0].x(), point_[0].y());
    //      for(i = 1; i < point_.length - 1; i++) {
    //        d_ab_ = GLOBAL.Position.distance(point_[i - 1], point_[i]);
    //        length_ += d_ab_;
    //        if(length_ < tailLength_)
    //          d_half_ = d_ab_ * Math.tan(angle_);
    //        else
    //          d_half_ = width_/2;
    //
    //        p1 = new GLOBAL.Position(point_[i].x() + d_half_ * Math.abs(point_[i].y() - point_[i - 1].y())/d_ab_,
    //          point_[i].y() - d_half_ * Math.abs(point_[i].x() - point_[i - 1].x())/d_ab_);
    //        p2 = new GLOBAL.Position(point_[i].x() - d_half_ * Math.abs(point_[i].y() - point_[i - 1].y())/d_ab_,
    //          point_[i].y() + d_half_ * Math.abs(point_[i].x() - point_[i - 1].x())/d_ab_);
    //        if(Math.sin((point_[i].x() - point_[i-1].x())/GLOBAL.Position.distance(point_[i], point_[i-1])) > 0)
    //          outline_.splice(i, 0, p1, p2);
    //        else 
    //          outline_.splice(i, 0, p2, p1);
    //      }
    //      outline_[outline_.length/2] = new GLOBAL.Position(point_[point_.length - 1].x(), point_[point_.length - 1].y());
    //    }
    //    /**
    //    * @public
    //    * add a new point
    //    */
    //    this.add = function(p) {
    //      //if(point_.length === 0 || GLOBAL.Position.distance(point_[point_.length - 1], p) >= 10)
    //      if(point_.length > 50){
    //        point_.shift();
    //      }
    //      point_[point_.length] = p;
    //    };
    //    /**
    //    * draw the path 
    //    */
    //    this.draw = function() {
    //      if(point_.length > 0){
    //        outlineCount_();
    //        GLOBAL.ctx.save();
    //        GLOBAL.ctx.fillStyle = 'red';
    //        GLOBAL.ctx.lineJoin = 'round';
    //        GLOBAL.ctx.globalCompositeOperation = 'source-over';
    //        GLOBAL.ctx.beginPath();
    //        GLOBAL.ctx.moveTo(outline_[0].x(), outline_[0].y());
    //        for(i = 0; i < outline_.length; i++){
    //          GLOBAL.ctx.lineTo(outline_[i].x(), outline_[i].y());
    //        }
    //        GLOBAL.ctx.closePath();
    //        GLOBAL.ctx.fill();
    //        GLOBAL.ctx.restore();
    //      }
    //    };
    //    //    /** delete the last tail point*/
    //    //    this.del = function() {
    //    //      point_.pop();
    //    //    };
  },

  /*Cloud Class*/
  'Cloud': function() {
    //to do
  },

  /*Obstacle Class*/
  'Obstacle': function() {
    //to do
  },

  /**
  * Timer Class
  * @param {number} the total seconds of the timer
  */
  'Timer': function(t) {
    var duration_ = t * 1000 || 60 * 1000,
        count_ = 0,
        pauselife_ = false; 

    /**
    * @public
    * get the remain seconds curently 
    * @return {String} seconds string
    */
    this.now = function() {
      if(!pauselife_)
        duration_ =  (count_ - (new Date()).getTime()) < 0 ? 0 : (count_ - (new Date()).getTime());
      return Math.ceil(duration_/1000);
    };
    /** start the timer */
    this.start = function() {
      count_ = duration_ + (new Date()).getTime();
      pauselife_ = false;
    };
    /** pause the timer */
    this.pause = function() {
      pauselife_ = true;
    };
    /**
    * @return {boolean} if the timer is pause
    */
    this.isPause = function() {
      return pauselife_;
    };
  }

};


GLOBAL.Star.prototype.image1 = new Image();
GLOBAL.Star.prototype.image1.src = 'images/star.png';
GLOBAL.Star.prototype.image2 = new Image();
GLOBAL.Star.prototype.image2.src = 'images/star0.png';

/**
* @const {number}
* MINZOOM/MAXZOOM: the zoom range
* WIDTH/HEIGHT: the origin size of the picture
*/
GLOBAL.Star.MINZOOM = 0.5;
GLOBAL.Star.MAXZOOM = 1;
GLOBAL.Star.prototype.WIDTH = 30;
GLOBAL.Star.prototype.HEIGHT = 30;

GLOBAL.Position.equal = function(p1, p2) {
  if(p1.x() === p2.x() && p1.y() === p2.y())
    return true;
  else
    return false;
};
GLOBAL.Position.distance = function(p1, p2) {
  return Math.sqrt(Math.pow(p1.x() - p2.x(), 2) + Math.pow(p1.y() - p2.y(), 2));
};
//to do: judge the object's picture's data to leave out transparent data
GLOBAL.Position.hit = function(p1, o) { //if the point at Position p1 hit the object with w width and h height at Position p2
  var p2 = o.pos,
      w = o.width,
      h = o.height;
  if(p1.x() >= p2.x() && p1.x() <= p2.x() + w && p1.y() >= p2.y() && p1.y() <= p2.y() + h)
    return true;
  else
    return false;
};
