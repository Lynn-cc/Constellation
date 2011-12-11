var MENU = {
	show: function() {

	},
	option: function(o) {
		var pos_ = new GLOBAL.Position(o.pos[0], o.pos[1]),
			image_ = new image(),
			w_ = o.width,
			h_ = o.height;

		image_.src = o.src;
		image_.width = w;
		image_.height = h;
		return {
			pos: pos_,
			image: image_,
			width: w_,
			height: h_,
			contain: function(p) {
				return GLOBAL.Position.hit(p, this, true);
			}
		};
	},
	home: function() {
		var logo_ = MENU.option({
				pos: [0, 0],
				src: '',
				width: 0,
				height: 0}),

		start_ = MENU.option({
				pos: [0, 0],
				src: '',
				width: 0,
				height: 0}),

		help_ = MENU.option({
				pos: [0, 0],
				src: '',
				width: 0,
				height: 0});
		this.show = function() {};
		this.event = function(p) {
			if(start_.contain())
				return;
			if(help_.contain())
				return;
		};
	},
	start: function() {
		var wind_ = MENU.option([0, 0], '', 0, 0),
			water_= MENU.option([0, 0], '', 0, 0),
			earth_= MENU.option([0, 0], '', 0, 0),
			fire_ = MENU.option([0, 0], '', 0, 0);
		this.show = function() {};
		this.event = function(p) {
			if(wind_.contain())
				return;
			if(water_.contain())
				return;
			if(earth_.contain())
				return;
			if(fire_.contain())
				return;
		};
	},
	help: function() {
		var images_ = [],
			bg_ = new image(),
			prePage_ = MENU.option([0, 0], '', 0, 0),
			nextPage_ = MENU.option([0, 0], '', 0, 0),
			back_ = MENU.option([0, 0], '', 0, 0);

		this.show = function() {};
		this.nextPage = function() {};
		this.prePage = function() {};
		this.event = function(p) {
			if(prePage_.contain())
				return;
			if(nextPage_.contain())
				return;
			if(back_.contain())
				return;
		};
	}
};
