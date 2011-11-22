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
  },

  /*StarsArray Class*/
  'StarsArray' : function(n){
    //private methods
    var _number = n;
    var _array = new Array();
    var _statusTime = 3;
    function _create(){
      var that = new GLOBAL.Star();
      that.status = _statusTime;
      that.angle = Math.random() * Math.PI * 2;
      that.x = GLOBAL.random(GLOBAL.Star.prototype.image.width, GLOBAL.width - GLOBAL.Star.prototype.image.width);
      that.y = GLOBAL.random(GLOBAL.Star.prototype.image.height, GLOBAL.height - GLOBAL.Star.prototype.image.width);
      return that;
    }
    //initilize
    for(var i = 0; i<n; i++){
      _array[i] = _create();
      _array[i].status = GLOBAL.random(_statusTime); //首次随机时间长度
    } 

    //pulbic methods
    this.stars = (function(){
        return _array;
    })();
    this.number = function(n){
      if(n){
        _number = n;
        _array.length = _number;
      }
      return _number;
    };
    this.changeStatus = function(){
      for(var j = 0; j < this.stars.length; j++){
        if(this.stars[j] && this.stars[j].status > 0){
          this.stars[j].status -= GLOBAL['interval']/1000;
        }else{
          this.stars[j] = _create();
        }
      }
    };
    this.draw = function(){
      if(this.stars){
        for(var i = 0; i<this.stars.length; i++){
          GLOBAL.ctx.save();
          GLOBAL.ctx.rotate(this.stars[i].angle);
          GLOBAL.ctx.drawImage(this.stars[i].image,
            this.stars[i].x*Math.cos(this.stars[i].angle) + this.stars[i].y*Math.sin(this.stars[i].angle),
            this.stars[i].y*Math.cos(this.stars[i].angle) - this.stars[i].x*Math.sin(this.stars[i].angle));
          GLOBAL.ctx.restore();
        }
      }
    };

  }

};

GLOBAL.Star.prototype = new GLOBAL.GameObject();
GLOBAL.Star.prototype.image = new Image();
GLOBAL.Star.prototype.status = 0;
GLOBAL.Star.prototype.angle = 0;
GLOBAL.Star.prototype.image.src = 'images/star.png';
GLOBAL.Star.prototype.image.width = 30;
GLOBAL.Star.prototype.image.height = 30;

