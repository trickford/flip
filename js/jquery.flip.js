(function($) {

	function Flip(text, number, config){
		var defaults = {
			tiles: {
				count: 24,
				margin: 2,
				gap: 1,
				spacing: 2
			}
		}

		// mash config with defaults
		this.config = $.extend(true, {}, defaults, config);

		if(this.config.$container.data("config")){
			this.update = true;
			this.config = this.config.$container.data("config");
		}

		this.config.text = text.toString();
		this.config.number = number.toString();

		if(!this.update){
			this.init();
		}

		this.calc();

		if(!this.update){
			this.createTiles();
		}
		this.updateTiles();

		this.config.$container.data("config", this.config).addClass("flip");

		// return to jQuery chain
		return this;
	}

	// set container sizing
	Flip.prototype.init = function(){
		this.config.width = this.config.$container.width();
		this.config.height = this.config.$container.height();

		this.config.tiles.width = Math.floor(this.config.width / this.config.tiles.count);
		this.config.tiles.halfHeight = Math.floor((this.config.height / 2) - 1);

		this.config.$container.append($("<span>").addClass("dyn"));
		this.config.$dyn = this.config.$container.find(".dyn");
	}

	// figure out where everything goes
	Flip.prototype.calc = function(){
		var emptyLength;
		var lengthCalc;
		var extraSpace;

		this.config.textLength = this.config.text.length;
		this.config.numberLength = this.config.number.length;


		lengthCalc = (this.config.tiles.count - this.config.textLength - this.config.numberLength - this.config.tiles.spacing);
		extraSpace = lengthCalc % 2;

		// count empty tiles, round down to nearest even number
		emptyLength = Math.floor(lengthCalc / 2);

		// determine where to place text, numbers
		this.config.textStart = emptyLength;
		this.config.numberStart = emptyLength + this.config.textLength + this.config.tiles.spacing + extraSpace;
	}

	// style stuff and put it where it goes
	Flip.prototype.createTiles = function(){

		for(var tile = 0; tile < this.config.tiles.count; tile++){

			// tile parent
			var $tile = $("<span>").addClass("tile").css({
				'width': this.config.tiles.width,
				'height': this.config.height,
				'padding-left': this.config.tiles.margin
			});

			// top half of tile
			var $top = $("<span>").addClass("top").css({
				'width': '100%',
				'height': this.config.tiles.halfHeight
			}).append($("<span>").css({
				'font-size': this.config.tiles.halfHeight * 1.6,
				'line-height': this.config.tiles.halfHeight * 2 + "px"
			}));

			// bottom half of tile
			var $bot = $("<span>").addClass("bot").css({
				'width': '100%',
				'height': this.config.tiles.halfHeight,
				'margin-top': this.config.tiles.gap
			}).append($("<span>").css({
				'margin-top': this.config.tiles.halfHeight * -1,
				'font-size': this.config.tiles.halfHeight * 1.6,
				'line-height': this.config.tiles.halfHeight * 2 + "px"
			}));

			// put everything in the DOM
			$tile.append($top).append($bot);
			this.config.$dyn.append($tile);
		}

		// duplicate what we just did for pretty stuff later
		this.config.$flat = this.config.$dyn.clone().removeClass("dyn").addClass("flat");
		this.config.$container.append(this.config.$flat);
	}

	// put your text in the tiles
	Flip.prototype.updateTiles = function(){
		var $dynTiles = this.config.$dyn.find(".tile");
		var $flatTiles = this.config.$flat.find(".tile");
		var textEnd = this.config.textStart + this.config.text.length;
		var numberEnd = this.config.numberStart + this.config.number.length;

		for(var t = 0; t < this.config.tiles.count; t++){
			var $dynTile = $($dynTiles[t]);
			var $flatTile = $($flatTiles[t]);
			var text = false;

			// if tiles needs content, set content and update
			if(t >= this.config.textStart && t < textEnd){
				text = this.config.text.charAt(t - this.config.textStart);
			}

			if(t >= this.config.numberStart && t < numberEnd){
				text = this.config.number.charAt(t - this.config.numberStart);
			}

			// if tile needs updating, update ...duh
			this.updateTile($dynTile, $flatTile, text);
		}
	}

	// update tile with new text
	Flip.prototype.updateTile = function($dynTile, $flatTile, newText){

		var $dynTop = $dynTile.find(".top");
		var $dynTopContent = $dynTile.find(".top span");
		var $flatTopContent = $flatTile.find(".top span");
		var $dynBot = $dynTile.find(".bot");
		var $dynBotContent = $dynTile.find(".bot span");
		var $flatBotContent = $flatTile.find(".bot span");

		if(newText){
			var delay = Math.random() * (250 - 100);
		}else{
			var delay = 100;
		}

		// nest everything
		$dynTop.css({"visibility": "visible"});
		$dynBot.css({"visibility": "hidden"}).transition({
			transform: "rotate3d(1, 0, 0, -90deg)",
			duration: 0
		});
		$dynTop.css({"visibility": "visible"}).transition({
			transform: "rotate3d(1, 0, 0, 90deg)",
			duration: 500,
			delay: delay
		}, function(){
		$flatTopContent.html(newText);
			$dynTop.css({"visibility": "hidden"}).transition({
				transform: "rotate3d(1, 0, 0, 0deg)",
				duration: 0,
				delay: 0,
				"visibility": "visible"
			}, function(){
				$dynTopContent.html(newText);
				$dynBotContent.html(newText);
			});

			$dynBot.css({"visibility": "visible"}).transition({
				transform: "rotate3d(1, 0, 0, 0deg)",
				duration: 500
			}, function(){
				$flatBotContent.html(newText);
			})
		})

		// reset "filled" class
		$dynTile.removeClass("filled");
		if(newText){
			$dynTile.addClass("filled");
		}

	}

	// for the jquery duh
	$.fn.flip = function(text, number, config){
		var defaults = config || {};

		// Delegate .transition() calls to .animate()
		// if the browser can't do CSS transitions.
		if(!$.support.transition){
			$.fn.transition = $.fn.animate;
		}

		// add container to config
		defaults.$container = $(this);

		// instance
		var flip = new Flip(text, number, defaults);

		return this;

	}

})(jQuery);