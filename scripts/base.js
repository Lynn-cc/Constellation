//GLOBAL NAMESPACE
var GLOBAL = {
  //GLOBAL Variable and Methods
  'width' : 480,
  'height' : 800,
  'interval' : 5,
  'canvas' : document.getElementById('main'),
  'ctx' : document.getElementById('main').getContext('2d'),

  'random' : function(n, m){
    if(arguments.length == 2)
      return Math.min(n, m) + Math.floor(Math.random() * Math.abs(m - n));
    return Math.floor(Math.random() * n); 
  },
  //待解决的问题
  'each' : function(o, fn){
    for(var i = 0; i < o.length; i++)
      fn(o[i]);
  },

  //Classes
  /*GameObject Class*/
  'GameObject' : function(){
    this.image = null;
  },

  /*Position Class*/
  'Position' : function(x, y){
    var _x = x;
    var _y = y;
    this.x = function(x){
      if(x != undefined)
        _x = x;
      return _x;
    };
    this.y = function(y){
      if(y != undefined)
        _y = y;
      return _y;
    };
  },

  /*Star Class*/
  'Star' : function(){
    var _status = 0,
        _angle = 0;

    this.pos = new GLOBAL.Position(0, 0);
    this.status = function(s){
      if(s != undefined) 
        _status = s * 1000; 
      return _status;
    };
    this.angle = function(a){
      if(a != undefined)
        _angle = a; 
      return _angle;
    };
    this.draw = function(){
      GLOBAL.ctx.save();
      GLOBAL.ctx.rotate(_angle);
      GLOBAL.ctx.drawImage(this.image,
        this.pos.x() * Math.cos(_angle) + this.pos.y() * Math.sin(_angle),
        this.pos.y() * Math.cos(_angle) - this.pos.x() * Math.sin(_angle));
      GLOBAL.ctx.restore();
    };
    this.nextStatus = function(){
      if(_status > 0){
        _status -= GLOBAL.interval;
        return true;
      }else
        return false;
    };
  },

  /*StarsArray Class*/
  'StarsArray' : function(n){
    //private methods
    var i = 0;
    var _statusTime = 3;
    var _array = new Array();
    _array.length = n;

    function _create(){
      var that = new GLOBAL.Star();
      that.status(_statusTime);
      that.angle(Math.random() * Math.PI * 2);
      that.pos.x(GLOBAL.random(GLOBAL.Star.prototype.image.width,
          GLOBAL.width - GLOBAL.Star.prototype.image.width));
      that.pos.y(GLOBAL.random(GLOBAL.Star.prototype.image.height,
        GLOBAL.height - GLOBAL.Star.prototype.image.width));
      return that;
    }
    //initilize
    for(i = 0; i < n; i++){
      _array[i] = _create();
      _array[i].status(GLOBAL.random(_statusTime)); //首次随机时间长度
    } 

    //pulbic methods
    this.stars = function(){
      var swap = new Array();
      for(i = 0; i < _array.length; i++){
        if(_array[i])
          swap[swap.length] = _array[i];
      }
      return swap;
    };
    this.number = function(n){
      if(n != undefined){
        _array.length = n;
      }
      return _array.length;
    };
    this.changeStatus = function(){
      for(i = 0; i < _array.length; i++){
        if(!(_array[i] && _array[i].nextStatus()))
          _array[i] = _create();
      }
      // GLOBAL.each(_array, function(o){
      //     if(!(o && o.nextStatus()))
      //       o = _create(); 
      //     alert(o.status());
      // });
    };
    this.draw = function(){
      for(i = 0; i < _array.length; i++){
        if(_array[i])
          _array[i].draw();
      }
    };
    this.remove = function(o){
      for(i = 0; i < _array.length; i++){
        if(_array[i] === o)
          _array[i] = null;
      }
    };
  },

  /*Tail Class*/
  'Tail' : function(){
    var i = 0;
    var _path = new Array();
    var _maxlength = 50;
    this.add = function(p){
      _path.unshift(p);
      if(_path.length > _maxlength)
        _path.length = _maxlength;
    };
    this.draw = function(){
      for(i = 0; i < _path.length; i++){
        GLOBAL.ctx.drawImage(this.image, _path[i].x(), _path[i].y());
      }
    };
    this.del = function(){
      _path.pop();
    };
  },

  /*Cloud Class*/
  'Cloud' : function(){
    //待定
  },

  /*Timer Class*/
  'Timer' : function(t){
    var _duration = t * 1000 || 60 * 1000;
    var _count = 0;
    var _pauseStatus = false; 

    this.now = function(){
      if(!_pauseStatus){
        _duration =  (_count - (new Date()).getTime()) < 0 ? 0 : (_count - (new Date()).getTime());
      }
      return (Math.ceil(_duration/1000)).toString();
    };
    this.start = function(){
      _count = _duration + (new Date()).getTime();
      _pauseStatus = false;
    };
    this.pause = function(){
      _pauseStatus = true;
    };
    this.isPause = function(){
      return _pauseStatus;
    };
  }

};


GLOBAL.Star.prototype = new GLOBAL.GameObject();
GLOBAL.Star.prototype.image = new Image();
GLOBAL.Star.prototype.image.src = 'images/star.png';
GLOBAL.Star.prototype.image.width = GLOBAL.Star.prototype.width;
GLOBAL.Star.prototype.image.height = GLOBAL.Star.prototype.height;
GLOBAL.Star.prototype.width = 30;
GLOBAL.Star.prototype.height = 30;

GLOBAL.Tail.prototype = new GLOBAL.GameObject();
GLOBAL.Tail.prototype.image = new Image();
GLOBAL.Tail.prototype.image.src = 'images/circle.png';
GLOBAL.Tail.prototype.image.width = 30;
GLOBAL.Tail.prototype.image.height = 30;

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
