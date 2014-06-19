(function($) {

	function Flip(config){
		var defaults = {
			tiles: {
				count: 30,
				margin: 2,
				spacing: 2
			}
		}

		// mash config with defaults
		this.config = $.extend(true, {}, defaults, config);

		this.init();
		this.calc();
		this.createTiles();
		this.fillTiles();

		this.config.$container.data("config", this.config).addClass("flip");

		// return to jQuery chain
		return this;
	}

	// figure out the stuff
	Flip.prototype.init = function(){
		this.config.width = this.config.$container.width();
		this.config.height = this.config.$container.height();

		this.config.tiles.width = Math.floor(this.config.width / this.config.tiles.count);
		this.config.tiles.halfHeight = Math.floor((this.config.height / 2) - 1);

		this.config.$container.append($("<span>").addClass("dyn"));
	}

	Flip.prototype.calc = function(){
		var emptyLength;

		this.config.number = this.config.number.toString()
		this.config.textLength = this.config.text.length;
		this.config.numberLength = this.config.number.length;

		// count empty tiles, round down to nearest even number
		emptyLength = Math.floor((this.config.tiles.count - this.config.textLength - this.config.numberLength - this.config.tiles.spacing) / 2);

		// determine where to place text, numbers
		this.config.textStart = emptyLength;
		this.config.numberStart = emptyLength + this.config.textLength + this.config.tiles.spacing;
	}

	Flip.prototype.createTiles = function(){
		this.config.$dyn = this.config.$container.find(".dyn");

		for(var tile = 0; tile < this.config.tiles.count; tile++){

			var $tile = $("<span>").addClass("tile").css({
				'width': this.config.tiles.width,
				'height': this.config.height,
				'padding-left': this.config.tiles.margin
			});
			var $top = $("<span>").addClass("top").css({
				'width': '100%',
				'height': this.config.tiles.halfHeight
			}).append($("<span>").css({
				'font-size': this.config.tiles.halfHeight * 1.6,
				'line-height': this.config.tiles.halfHeight * 2 + "px"
			}));

			var $bot = $("<span>").addClass("bot").css({
				'width': '100%',
				'height': this.config.tiles.halfHeight,
				'margin-top': this.config.tiles.spacing
			}).append($("<span>").css({
				'margin-top': this.config.tiles.halfHeight * -1,
				'font-size': this.config.tiles.halfHeight * 1.6,
				'line-height': this.config.tiles.halfHeight * 2 + "px"
			}));

			$tile.append($top).append($bot);

			this.config.$dyn.append($tile);

		}
		this.config.$container.append(this.config.$dyn.html());
	}

	Flip.prototype.fillTiles = function(){
		var $tiles = this.config.$dyn.find(".tile");

		for(var t = this.config.textStart; t < (this.config.textStart + this.config.textLength); t++){
			var $tile = $($tiles[t]);
			var $top = $tile.find(".top span");
			var $bot = $tile.find(".bot span");
			var text = this.config.text.charAt(t - this.config.textStart);

			$top.html(text);
			$bot.html(text);
			$tile.addClass("filled");
		}

		for(var n = this.config.numberStart; n < (this.config.numberStart + this.config.numberLength); n++){
			var $tile = $($tiles[n]);
			var $top = $tile.find(".top span");
			var $bot = $tile.find(".bot span");
			var text = this.config.number.charAt(n - this.config.numberStart);

			$top.html(text);
			$bot.html(text);
			$tile.addClass("filled");
		}
	}

	// for the jquery duh
	$.fn.flip = function(config){

		// add container to config
		config.$container = $(this);

		// instance
		var flip = new Flip(config);

		return this;

	}

})(jQuery);