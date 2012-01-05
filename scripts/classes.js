myth.base.classes = (function() {
    var variables = myth.base.vars,
        c = variables.ctx(),
        screenWidth = variables.width(),
        screenHeight = variables.height(),
			  STATUS = {
					LIVE: "live",
					CHOOSED: "choosed",
					LOST: "lost"
				};

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
    Star.prototype.DEFAULT_LIFE = 2;
    Star.prototype.WIDTH = myth.base.vars.srcpos().stars(0).width;
    Star.prototype.HEIGHT = myth.base.vars.srcpos().stars(0).height;

    /**
    * @static {Number} MINZOOM/MAXZOOM: the zoom range
    */
    Star.MINZOOM = 0.5;
    Star.MAXZOOM = 0.8;

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
			
			/**
			* count the lost stars number
			* @return {number}
			*/
			this.lostNumber = function() {
				num = 0;
				for (i = 0; i < array_.length; ++i) {
					if (array_[i] === null) {
						++num;	
					}
				}
				return num;
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
          c.restore();
        }
      };
    }

    /**
    * Score class
    */
    function ProgressBar(type) {
      var type_ = type,
          image_ = new Image(),
          pos_ = new Position(15, 15),
          o_ = variables.srcpos()[type + 'Progress'];
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

      this.drawNumber = function(number) {
        c.save();
        c.drawImage(image_, o_.x, o_.y, o_.width, o_.height, pos_.x(), pos_.y(), o_.width, o_.height);
        c.textAlign = 'center';
        c.font = '35px Arial';
        setStyle();
        c.fillText(number + '', 110, 55);
        c.restore();
      };
			
			/**
			* 绘制进度条
			*/
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
			}

    }
		
		/**
    * Obstacle class
    */
    function Obstacle (type) {
      var life_ = 0,
					image_ = new Image(),
          pos_ = new Position(random(0, 960), random(0, 640)),
          o_ = variables.srcpos()['cloud'];
					status_ = true;
							
			life_ = random(2, 6);
      image_.src = variables.src();

			this.status = function() { return status_; };
      this.draw = function() {
        c.save();
				c.drawImage(image_, o_.x, o_.y, o_.width, o_.height, pos_.x(), pos_.y(), o_.width, o_.height);
        c.restore();
      };
			
			this.nextlife = function() {
        if (life_ > 0) {
          life_ -= variables.interval() / 1000;
          return true;
        } else {
          return false;
        }
      };
    }
		
		/**
		* ObstacleGroup class
		*/
		function ObstacleGroup (n, type){
			var array_ = [],
				  n_ = n,
					type_ = type;
				
			var ran = random(1, 10);
			if(ran >= 1 && ran <= 4){
				n_ = 2;	
			}
			else if (ran >= 5 && ran <= 7){
				n_ = 4;
			}
			else if (ran >= 8 && ran <= 9){
				n_ = 6;
			}
			else{
				n_ = 8;
			}
			for (i = 0; i < n_; i++) {
					array_[i] = new Obstacle(type_);
			}
			
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
		}

    return {
      Stars: StarsGroup,
      Path: Path,
      Position: Position,
      ProgressBar: ProgressBar,
			Obstacles: ObstacleGroup
    };
})();