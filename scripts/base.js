//GLOBAL NAMESPACE
var GLOBAL = {
  //Variable and Methods
  'width' : 480,
  'height' : 800,
  'interval' : 5,
  'canvas' : document.getElementById('main'),
  'ctx' : document.getElementById('main').getContext('2d'),

  'random' : function(n, m){
    if(arguments.length == 2)
      return Math.min(n, m) + Math.floor(Math.random() * Math.abs(m - n));
    return Math.floor(Math.random()*n); 
  },

  //Classes
  /*GameObject Class*/
  'GameObject' : function(){
    this.x = 0;
    this.y = 0;
    this.image = null;
  },

  /*Star Class*/
  'Star' : function(){
    var _status = 0;
    var _angle = 0;
    this.status = function(s){
      if(s != undefined) 
        _status = s; 
      return _status;
    };
    this.angle = function(a){
      if(a != undefined)
        _angle = a; 
      return _angle;
    };
    this.draw = function(){
      GLOBAL.ctx.save();
      GLOBAL.ctx.rotate(this.angle());
      GLOBAL.ctx.drawImage(this.image,
        this.x * Math.cos(this.angle()) + this.y * Math.sin(this.angle()),
        this.y * Math.cos(this.angle()) - this.x * Math.sin(this.angle()));
      GLOBAL.ctx.restore();
    };
    this.nextStatus = function(){
      if(this.status() > 0){
        this.status(this.status() - GLOBAL.interval/1000);
        return true;
      }
      else
        return false;
    };
  },

  /*StarsArray Class*/
  'StarsArray' : function(n){
    //private methods
    var i = 0;
    var _number = n;
    var _array = new Array();
    var _statusTime = 3;
    function _create(){
      var that = new GLOBAL.Star();
      that.status(_statusTime);
      that.angle(Math.random() * Math.PI * 2);
      that.x = GLOBAL.random(GLOBAL.Star.prototype.image.width,
        GLOBAL.width - GLOBAL.Star.prototype.image.width);
      that.y = GLOBAL.random(GLOBAL.Star.prototype.image.height,
        GLOBAL.height - GLOBAL.Star.prototype.image.width);
      return that;
    }
    //initilize
    for(i = 0; i < n; i++){
      _array[i] = _create();
      _array[i].status(GLOBAL.random(_statusTime)); //首次随机时间长度
    } 

    //pulbic methods
    this.stars = _array;
    this.number = function(n){
      if(n != undefined){
        _number = n;
        _array.length = _number;
      }
      return _number;
    };
    this.changeStatus = function(){
      if(this.stars){
        for(i = 0; i < this.stars.length; i++){
          if(this.stars[i] && this.stars[i].nextStatus())
            continue;
          else
            this.stars[i] = _create();
        }
      }
    };
    this.draw = function(){
      if(this.stars){
        for(i = 0; i < this.stars.length; i++){
          this.stars[i].draw();
        }
      }
    };
  }

};

GLOBAL.Star.prototype = new GLOBAL.GameObject();
GLOBAL.Star.prototype.image = new Image();
GLOBAL.Star.prototype.image.src = 'images/star.png';
GLOBAL.Star.prototype.image.width = 30;
GLOBAL.Star.prototype.image.height = 30;

