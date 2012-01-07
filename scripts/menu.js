myth.menu = {};
myth.menu.pageclasses = new function() {
  var self = this,
      variables = myth.base.vars,
      classes = myth.base.classes,
      cvs = variables.canvas(),
      c = variables.ctx(),
      srcpos = variables.srcpos(),
      screenWidth = variables.width(),
      screenHeight = variables.height(),
      soundsButton = new SoundsControl(),
      backObject = new Option(srcpos.back, {x: 793, y: 582}),
      homeObject = new Option(srcpos.home, {x: 793, y: 582});


  /**
  * shadeDraw method
  * when Pause and Over page, to draw a translucent background
  */
  function shadeDraw() {
    c.save();
    c.fillStyle = '#999';
    c.globalAlpha = 0.4;
    c.fillRect(0, 0, screenWidth, screenHeight);
    c.restore();
  }

  /**
  * @param o{object}:
  * {pos{object: {x{Number}, y{Number}}, src{String}, width{Number}, height{Number}}}
  * @return {object}:
  * {pos{Position}, image{Image}, width{Number}, height{Number}, contain{Function}}
  */
  function Option(o, dp) {
    var dpos_ = new classes.Position(dp.x, dp.y),
        spos_ = new classes.Position(o.x, o.y),
        w_ = o.width,
        h_ = o.height;

    this.dpos = dpos_;
    this.spos = spos_;
    this.width = function () { return w_; };
    this.height = function () { return h_; };
    this.contain = function(p) {
        return classes.Position.hit(p, {
            pos: this.dpos, 
            width: this.width,
            height: this.height
          }, true);
      };
  }
  Option.prototype.image = new Image();
  Option.prototype.image.src = variables.src();


  function SoundsControl() {
    var onOption_ = new Option(srcpos.on, {x: 876, y: 582}),
        offOption_ = new Option(srcpos.off, {x: 876, y: 582}),
        soundsObjects_ = variables.sounds,
        current_ = onOption_;

    function setsounds_(value) {
      for (s in soundsObjects_) {
        soundsObjects_[s].muted = value;
      }
    }

    this.event = function() {
      current_ === onOption_ ? (current_ = offOption_) : (current_ = onOption_);
      setsounds_(current_ === onOption_ ? false : true);
    };

    this.option = function() {
      return current_;
    };
  }

  //Pages Classes: Home/Start/Help/Pause/Gameover
  self.Home = function Home() {
    var objects_ = {
      logo: new Option(srcpos.logo1, {x: 219, y: 18}),
      start: new Option(srcpos.start, {x: 349, y: 245}),
      help: new Option(srcpos.help, {x: 349, y: 340}),
      sound: soundsButton.option()
    };

    this.show = function() {
      c.save();
      c.clearRect(0, 0, screenWidth, screenHeight);
      for (var o in objects_) {
        c.drawImage(objects_[o].image,
          objects_[o].spos.x(), objects_[o].spos.y(), objects_[o].width(), objects_[o].height(),
          objects_[o].dpos.x(), objects_[o].dpos.y(), objects_[o].width(), objects_[o].height());
      }
      c.restore();
    };

    this.event = function(p) {
      if (objects_.start.contain(p)) {
        return 'Start';
      } else if (objects_.help.contain(p)) {
        return 'Help';
      } else if (objects_.sound.contain(p)) {
        soundsButton.event();
        objects_.sound = soundsButton.option();
        this.show();
        return false;
      } else {
        return false;
      }
    };

  };

  self.Start = function Start() {
    var objects_ = {
      logo: new Option(srcpos.logo2, {x: 280, y: 35}),
      wind: new Option(srcpos.wind, {x: 323, y: 501}),
      water: new Option(srcpos.water, {x: 323, y: 210}),
      earth: new Option(srcpos.earth, {x: 323, y: 404}),
      fire: new Option(srcpos.fire, {x: 323, y: 307}),
      sound: soundsButton.option(),
      back: backObject
    };

    this.show = function() {
      c.save();
      c.clearRect(0, 0, screenWidth, screenHeight);
      for (var o in objects_) {
        c.drawImage(objects_[o].image,
          objects_[o].spos.x(), objects_[o].spos.y(), objects_[o].width(), objects_[o].height(),
          objects_[o].dpos.x(), objects_[o].dpos.y(), objects_[o].width(), objects_[o].height());
      }
      c.restore();
    };

    this.event = function(p) {
      if (objects_.wind.contain(p)) {
        return 'wind';
      } else if (objects_.water.contain(p)) {
        return 'water';
      } else if (objects_.earth.contain(p)) {
        return 'earth';
      } else if (objects_.fire.contain(p)) {
        return 'fire';
      } else if (objects_.back.contain(p)) {
        return 'Home';
      } else if (objects_.sound.contain(p)) {
        soundsButton.event();
        objects_.sound = soundsButton.option();
        this.show();
        return false;
      } else {
        return false;
      }
    };

  };

  self.Help = function Help() {
    var pageNumber_ = 5,
        n = 1,
        pageObjects_ = [],
        nextPage_ = new Option(srcpos.nextPage, {x: 678, y: 478}),
        prePage_ = new Option(srcpos.prePage, {x: 210, y: 478}),
    objects_ = {
      logo: new Option(srcpos.logo3, {x: 333, y: 22}),
      helpBackground: new Option(srcpos.helpBackground, {x: 121, y: 136}),
      prePage: prePage_,
      nextPage: nextPage_,
      back: backObject,
      sound: soundsButton.option()
    }; 

    function changePage_(m) {
      if (n === 1) {
        objects_.prePage = null;
      } else if (n === 2) {
        objects_.prePage = prePage_;
      }
      if (n == pageNumber_ - 1) {
        objects_.nextPage = nextPage_;
      } else if (n == pageNumber_) {
        objects_.nextPage = null;
      }
    }

    /**
    * @initialize
    */
    objects_.prePage = null;
    for (var i = 1; i <= 5; i++) pageObjects_[i] = {};
    pageObjects_[1].headline = '游戏玩法说明';
    pageObjects_[1].content = '滑动手指将出现的星星连接起来得分，不同模式下有不同的玩法';
    pageObjects_[2].headline = '水象模式';
    pageObjects_[2].content = '以最短的时间，连接一定数量的星星，以时间排行，游戏中有水雾模糊视线';
    pageObjects_[3].headline = '火象模式';
    pageObjects_[3].content = '在一分钟之内，连接尽可能多的星星，以积分排行';
    pageObjects_[4].headline = '土象模式';
    pageObjects_[4].content = '不限时间，但别碰到障碍物，碰到三次则失败，以积分排行';
    pageObjects_[5].headline = '风象模式';
    pageObjects_[5].content = '不限时间，尽量连到所有星星，落掉5个星星则失败，以积分排行';

    function drawPage_(i) {
      var j = 0,
          rowlength = 13,
          origin = pageObjects_[i].content,
          row = '',
          lineheight = 30;

      c.save();
      //draw headline
      c.textAlign = 'center';
      c.fillStyle = '#694f31';
      c.font = '40px Arial';
      c.fillText(pageObjects_[i].headline, 495, 285, 200);
      //draw content
      c.font = '25px Arial';
      c.textAlign = 'left';
      do {
        row = origin.substr(j * rowlength, rowlength);
        c.fillText(row, 330, 340 + j * lineheight, 200);
        ++j;
      } while ((j + 1) * rowlength < origin.length);

      row = origin.substr(j * rowlength);
      c.fillText(row, 330, 340 + j * lineheight, 200);
      c.restore();
    }


    this.show = function() {
      c.save();
      c.clearRect(0, 0, screenWidth, screenHeight);
      for (var o in objects_) {
        if (objects_[o])
        c.drawImage(objects_[o].image,
          objects_[o].spos.x(), objects_[o].spos.y(), objects_[o].width(), objects_[o].height(),
          objects_[o].dpos.x(), objects_[o].dpos.y(), objects_[o].width(), objects_[o].height());
      }
      drawPage_(n);
      c.restore();
    };

    this.event = function(p) {
      if (objects_.prePage && objects_.prePage.contain(p)) {
        --n;
        changePage_(n);
        this.show();
        return false;
      } else if (objects_.nextPage && objects_.nextPage.contain(p)) {
        ++n;
        changePage_(n);
        this.show();
        return false;
      } else if (objects_.back.contain(p)) {
        return 'Home';
      } else if (objects_.sound.contain(p)) {
        soundsButton.event();
        objects_.sound = soundsButton.option();
        this.show();
        return false;
      } else {
        return false;
      }
    };

  };

  self.Pause = function Pause() {
    var objects_ = {
      shade: new Option(srcpos.pauseShade, {x: 236, y:200}),
      backGame: new Option(srcpos.backGame, {x: 281, y: 281}),
      retry: new Option(srcpos.retry, {x: 520, y: 281}),
      home: homeObject,
      sound: soundsButton.option()
    };

    this.show = function() {
      c.save();
      c.clearRect(objects_.home.dpos.x(), objects_.home.dpos.y(), 
        objects_.home.width(), objects_.home.height());
      shadeDraw();
      for (var o in objects_) {
        c.drawImage(objects_[o].image,
          objects_[o].spos.x(), objects_[o].spos.y(), objects_[o].width(), objects_[o].height(),
          objects_[o].dpos.x(), objects_[o].dpos.y(), objects_[o].width(), objects_[o].height());
      }
      c.restore();
    };

    this.event = function(p) {
      if (objects_.backGame.contain(p)) {
        return 'back';
      } else if (objects_.retry.contain(p)) {
        return 'retry';
      } else if (objects_.home.contain(p)) {
        return 'Home';
      } else if (objects_.sound.contain(p)) {
        soundsButton.event();
        objects_.sound = soundsButton.option();
        this.show();
        return false;
      } else {
        return false;
      }
    };
  };

  self.Gameover = function Gameover(score, type) {
    var objects_ = {
      sound: soundsButton.option(),
      shade: new Option(srcpos.overShade, {x: 236, y: 175}),
      scorebg: new Option(srcpos[type + 'Over'], {x: 360, y: 236}),
      again: new Option(srcpos.again, {x: 404, y: 332}),
      home: homeObject
    };

    this.show = function() {
      c.save();
      c.clearRect(objects_.home.dpos.x(), objects_.home.dpos.y(),
        objects_.home.width(), objects_.home.height());
      shadeDraw();
      for (var o in objects_) {
        c.drawImage(objects_[o].image,
          objects_[o].spos.x(), objects_[o].spos.y(), objects_[o].width(), objects_[o].height(),
          objects_[o].dpos.x(), objects_[o].dpos.y(), objects_[o].width(), objects_[o].height());
      }
      c.fillStyle = 'white';
      c.font = '60px Arial';
      c.width = 60;
      c.textAlign = 'center';
      c.fillText(score, 495, 290, 60);
      c.restore();
    };

    this.event = function(p) {
      if (objects_.again.contain(p)) {
        return 'retry';
      } else if (objects_.home.contain(p)) {
        return 'Home';
      } else if (objects_.sound.contain(p)) {
        soundsButton.event();
        objects_.sound = soundsButton.option();
        this.show();
        return false;
      } else {
        return false;
      }
    };

  };

  self.GameBackground = function GameBackground() {
    var objects_ = {
      pause: new Option(srcpos.pause, {x: 793, y: 582}),
      sound: soundsButton.option()
    };

    this.show = function() {
      c.save();
      for (var o in objects_) {
        c.drawImage(objects_[o].image,
          objects_[o].spos.x(), objects_[o].spos.y(), objects_[o].width(), objects_[o].height(),
          objects_[o].dpos.x(), objects_[o].dpos.y(), objects_[o].width(), objects_[o].height());
      }
      c.restore();
    };

    this.event = function(p) {
      if (objects_.pause.contain(p)) {
        return 'Pause';
      } else if (objects_.sound.contain(p)) {
        soundsButton.event();
        objects_.sound = soundsButton.option();
        this.show();
        return false;
      } else {
        return false;
      }
    };
  };

};

myth.menu.over = function(opt_param) {
  var page_ = new myth.menu.pageclasses.Gameover(opt_param.score, opt_param.gametype);
  page_.show();
  myth.base.event.clickEvent.changeHandler(page_, opt_param);
};

myth.menu.main = function() { 
  var page_ = new myth.menu.pageclasses.Home();
  page_.show();
  myth.base.event.clickEvent.changeHandler(page_);
};
