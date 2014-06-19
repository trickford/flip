(function($) {

	function Flip(config){

		var self = this;
		var defaults = {}

		// mash config with defaults
		self.config = $.extend(true, {}, defaults, config);

		// return to jQuery chain
		return this;

	}

	Flip.prototype.init = function(){
		var self = this;
	}

	$.fn.flip = function(config){
		var flip = new Flip(config);
		return this;
	}

})(jQuery);