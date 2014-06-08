FRAG = {
	OK          : 'ok',
	ASSISTED    : 'assisted',
	UNJUSTIFIED : 'unjustified',
	WAR_RELATED : 'war related',
};

SKULL = {
	NONE  : 'none',
	RED   : 'red',
	BLACK : 'black',
};

function Fragger(fragMessages) {
	this.frags = [];

	// Could've used Array.map(), if it wasn't for IE 8.
	// Fuck you, IE!
	for (var i = fragMessages.length - 1; i >= 0; i--) {
		this.frags.push(new Frag(fragMessages[i]));
	}
}

Fragger.prototype.fragsForSkull = {
	red: {
		1  : 3,  // day
		7  : 5,  // week
		30 : 10, // month
	},

	black: {
		1  : 6,  // day
		7  : 10, // week
		30 : 20, // month
	}
};

/* Gets the Frag objects parsed of type `fragType` */
Fragger.prototype.get = function(fragType) {
	var fragsOfType = [];

	// Could've used Array.filter(), if it wasn't for IE 8.
	// Fuck you, IE!
	for (var i = this.frags.length - 1; i >= 0; i--) {
		if (this.frags[i].type == fragType) {
			fragsOfType.push(this.frags[i]);
		}
	}

	return fragsOfType;
};

/* Returns statistics such as minimum level, average level, maximum level and
 * amount of frags of type `fragType`.
 */
Fragger.prototype.stats = function(fragType) {
	var fragsOfType = this.get(fragType);
	var minLvl = Infinity,
	    maxLvl = 0,
	    sumLvl = 0,
	    fragLvl;

	for (var i = fragsOfType.length - 1; i >= 0; i--) {
		fragLvl = fragsOfType[i].level;

		sumLvl += fragLvl;
		minLvl = Math.min(minLvl, fragLvl);
		maxLvl = Math.max(maxLvl, fragLvl);
	};

	return {
		type: fragType,
		count: fragsOfType.length,
		minLvl: minLvl,
		avgLvl: Math.round(sumLvl / fragsOfType.length),
		maxLvl: maxLvl,
	}
};

/* Gets the amount of unjustified frags the character could still take before
 * getting the skull of type `skullType`.
 */
Fragger.prototype.fragsLeftBeforeSkull = function(skullType) {
	var unjustifiedFrags = this.get(FRAG.UNJUSTIFIED);
	var fragsLeft = Infinity;
	var now = Date.now();

	for (var daysSpan in this.fragsForSkull[skullType]) {
		var fragCount = 0;

		for (var i = unjustifiedFrags.length - 1; i >= 0; i--) {
			if (now - unjustifiedFrags[i].date < daysSpan * 24 * 60 * 60 * 1000) {
				fragCount++;
			}
		}

		fragsLeft = Math.min(fragsLeft, this.fragsForSkull[skullType][daysSpan] - fragCount - 1);
	}

	return fragsLeft;
};

/* Gets the current skull the character should have */
 */
Fragger.prototype.getSkull = function() {
	var unjustifiedFrags = this.get(FRAG.UNJUSTIFIED);
	var now = Date.now();

	if (this.fragsLeftBeforeSkull(SKULL.BLACK) < 0) {
		return SKULL.BLACK;
	} else if (this.fragsLeftBeforeSkull(SKULL.RED) < 0) {
		return SKULL.RED;
	}

	return SKULL.NONE;
};