//GLOBAL NAMESPACE
var GLOBAL = {
  //GLOBAL Variable and Methods
  'width' : 480,
  'height' : 320,
  'interval' : 10,
  'canvas' : document.getElementById('main'),
  'ctx' : document.getElementById('main').getContext('2d'),

  'random' : function(n, m){
    if(arguments.length == 2)
      return Math.min(n, m) + Math.floor(Math.random() * Math.abs(m - n));
    return Math.floor(Math.random() * n); 
  },

  //Classes
  /*GameObject Class*/
  'GameObject' : function(){
    this.image = null;
  },

  /*Position Class*/
  'Position' : function(x, y){
    var x_ = x,
        y_ = y;

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

  /*Star Class*/
  'Star' : function(size){
    var status_ = 0,
        angle_ = 0,
        size_ = size || 1,
        width_ = 10,
        height_ = 10;

    //initilize
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

    //public
    this.pos = new GLOBAL.Position(0, 0);
    this.status = function(s){
      if(s != undefined) 
        status_ = s * 1000; 
      return status_;
    };
    this.angle = function(a){
      if(a != undefined)
        angle_ = a; 
      return angle_;
    };
    this.size = size_; 
    this.width = width_;
    this.height = height_;
    this.draw = function(){
      GLOBAL.ctx.save();
      GLOBAL.ctx.rotate(angle_);
      GLOBAL.ctx.drawImage(this['image' + size_],
        this.pos.x() * Math.cos(angle_) + this.pos.y() * Math.sin(angle_),
        this.pos.y() * Math.cos(angle_) - this.pos.x() * Math.sin(angle_));
      GLOBAL.ctx.restore();
    };
    this.nextStatus = function(){
      if(status_ > 0){
        status_ -= GLOBAL.interval;
        return true;
      }else
        return false;
    };
  },

  /*StarsArray Class*/
  'StarsArray' : function(n){
    var i = 0,
        statusTime_ = 3,
        array_ = [],
        create = null,
        swap = [];

    function create_(){
      create = new GLOBAL.Star(GLOBAL.random(1, 4));
      create.status(statusTime_);
      create.angle(Math.random() * Math.PI * 2);
      create.pos.x(GLOBAL.random(create.width,
          GLOBAL.width - create.width));
      create.pos.y(GLOBAL.random(create.height,
          GLOBAL.height - create.height));
      return create;
    }

    //initilize
    array_.length = n;
    for(i = 0; i < n; i++){
      array_[i] = create_();
      array_[i].status(GLOBAL.random(statusTime_)); //首次随机时间长度
    } 

    //pulbic
    this.stars = function(){
      swap = [];
      for(i = 0; i < array_.length; i++){
        if(array_[i])
          swap[swap.length] = array_[i];
      }
      return swap;
    };
    this.number = function(n){
      if(n != undefined){
        array_.length = n;
      }
      return array_.length;
    };
    this.changeStatus = function(){
      for(i = 0; i < array_.length; i++){
        if(!(array_[i] && array_[i].nextStatus()))
          array_[i] = create_();
      }
    };
    this.draw = function(){
      for(i = 0; i < array_.length; i++){
        if(array_[i])
          array_[i].draw();
      }
    };
    this.remove = function(o){
      for(i = 0; i < array_.length; i++){
        if(array_[i] === o)
          array_[i] = null;
      }
    };
  },

  /*Tail Class*/
  'Tail' : function(){
    var i = 0,
        path_ = [],
        maxlength_ = 50;

    this.add = function(p){
      path_.unshift(p);
      if(path_.length > maxlength_)
        path_.length = maxlength_;
    };
    this.draw = function(){
      for(i = 0; i < path_.length; i++){
        GLOBAL.ctx.drawImage(this.image, path_[i].x(), path_[i].y());
      }
    };
    this.del = function(){
      path_.pop();
    };
  },

  /*Cloud Class*/
  'Cloud' : function(){
    //待定
  },

  /*Obstacle Class*/
  'Obstacle' : function(){
    //待定
  },

  /*Timer Class*/
  'Timer' : function(t){
    var duration_ = t * 1000 || 60 * 1000,
        count_ = 0,
        pauseStatus_ = false; 

    this.now = function(){
      if(!pauseStatus_)
        duration_ =  (count_ - (new Date()).getTime()) < 0 ? 0 : (count_ - (new Date()).getTime());
      return (Math.ceil(duration_/1000)).toString();
    };
    this.start = function(){
      count_ = duration_ + (new Date()).getTime();
      pauseStatus_ = false;
    };
    this.pause = function(){
      pauseStatus_ = true;
    };
    this.isPause = function(){
      return pauseStatus_;
    };
  }

};


GLOBAL.Star.prototype = new GLOBAL.GameObject();
GLOBAL.Star.prototype.image1 = new Image();
GLOBAL.Star.prototype.image2 = new Image();
GLOBAL.Star.prototype.image3 = new Image();
GLOBAL.Star.prototype.image1.src = 'images/star1.png';
GLOBAL.Star.prototype.image2.src = 'images/star2.png';
GLOBAL.Star.prototype.image3.src = 'images/star3.png';

GLOBAL.Tail.prototype = new GLOBAL.GameObject();
GLOBAL.Tail.prototype.image = new Image();
GLOBAL.Tail.prototype.image.src = 'images/circle.png';
GLOBAL.Tail.prototype.width = 30;
GLOBAL.Tail.prototype.height = 30;
GLOBAL.Tail.prototype.image.width = GLOBAL.Tail.prototype.width;
GLOBAL.Tail.prototype.image.height = GLOBAL.Tail.prototype.height;

GLOBAL.Position.equal = function(p1, p2){
  if(p1.x() === p2.x() && p1.y() === p2.y())
    return true;
  else
    return false;
};

GLOBAL.Position.hit = function(p1, p2, w, h){ //p1与宽w高h的p2物体碰撞检测
  if(p1.x() >= p2.x() && p1.x() <= p2.x() + w && p1.y() >= p2.y() && p1.y() <= p2.y() + h)
    return true;
  else
    return false;
};
