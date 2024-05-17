(self["webpackChunk"] = self["webpackChunk"] || []).push([["-------"],{

/***/ "./node_modules/debug/src/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/debug/src/browser.js ***!
  \*******************************************/
/***/ (function(module, exports, __webpack_require__) {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(/*! ./common */ "./node_modules/debug/src/common.js")(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ "./node_modules/debug/src/common.js":
/*!******************************************!*\
  !*** ./node_modules/debug/src/common.js ***!
  \******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(/*! ms */ "./node_modules/ms/index.js");
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ "./node_modules/ms/index.js":
/*!**********************************!*\
  !*** ./node_modules/ms/index.js ***!
  \**********************************/
/***/ (function(module) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/acyclic.js":
/*!*******************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/acyclic.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   run: function() { return /* binding */ run; },
/* harmony export */   undo: function() { return /* binding */ undo; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/uniqueId.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");
/* harmony import */ var _greedy_fas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./greedy-fas.js */ "./node_modules/dagre-d3-es/src/dagre/greedy-fas.js");





function run(g) {
  var fas = g.graph().acyclicer === 'greedy' ? (0,_greedy_fas_js__WEBPACK_IMPORTED_MODULE_0__.greedyFAS)(g, weightFn(g)) : dfsFAS(g);
  lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](fas, function (e) {
    var label = g.edge(e);
    g.removeEdge(e);
    label.forwardName = e.name;
    label.reversed = true;
    g.setEdge(e.w, e.v, label, lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"]('rev'));
  });

  function weightFn(g) {
    return function (e) {
      return g.edge(e).weight;
    };
  }
}

function dfsFAS(g) {
  var fas = [];
  var stack = {};
  var visited = {};

  function dfs(v) {
    if (lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](visited, v)) {
      return;
    }
    visited[v] = true;
    stack[v] = true;
    lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](g.outEdges(v), function (e) {
      if (lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](stack, e.w)) {
        fas.push(e);
      } else {
        dfs(e.w);
      }
    });
    delete stack[v];
  }

  lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](g.nodes(), dfs);
  return fas;
}

function undo(g) {
  lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](g.edges(), function (e) {
    var label = g.edge(e);
    if (label.reversed) {
      g.removeEdge(e);

      var forwardName = label.forwardName;
      delete label.reversed;
      delete label.forwardName;
      g.setEdge(e.w, e.v, label, forwardName);
    }
  });
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/add-border-segments.js":
/*!*******************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/add-border-segments.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addBorderSegments: function() { return /* binding */ addBorderSegments; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./node_modules/dagre-d3-es/src/dagre/util.js");





function addBorderSegments(g) {
  function dfs(v) {
    var children = g.children(v);
    var node = g.node(v);
    if (children.length) {
      lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](children, dfs);
    }

    if (lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](node, 'minRank')) {
      node.borderLeft = [];
      node.borderRight = [];
      for (var rank = node.minRank, maxRank = node.maxRank + 1; rank < maxRank; ++rank) {
        addBorderNode(g, 'borderLeft', '_bl', v, node, rank);
        addBorderNode(g, 'borderRight', '_br', v, node, rank);
      }
    }
  }

  lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](g.children(), dfs);
}

function addBorderNode(g, prop, prefix, sg, sgNode, rank) {
  var label = { width: 0, height: 0, rank: rank, borderType: prop };
  var prev = sgNode[prop][rank - 1];
  var curr = _util_js__WEBPACK_IMPORTED_MODULE_0__.addDummyNode(g, 'border', label, prefix);
  sgNode[prop][rank] = curr;
  g.setParent(curr, sg);
  if (prev) {
    g.setEdge(prev, curr, { weight: 1 });
  }
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/coordinate-system.js":
/*!*****************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/coordinate-system.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adjust: function() { return /* binding */ adjust; },
/* harmony export */   undo: function() { return /* binding */ undo; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");




function adjust(g) {
  var rankDir = g.graph().rankdir.toLowerCase();
  if (rankDir === 'lr' || rankDir === 'rl') {
    swapWidthHeight(g);
  }
}

function undo(g) {
  var rankDir = g.graph().rankdir.toLowerCase();
  if (rankDir === 'bt' || rankDir === 'rl') {
    reverseY(g);
  }

  if (rankDir === 'lr' || rankDir === 'rl') {
    swapXY(g);
    swapWidthHeight(g);
  }
}

function swapWidthHeight(g) {
  lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](g.nodes(), function (v) {
    swapWidthHeightOne(g.node(v));
  });
  lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](g.edges(), function (e) {
    swapWidthHeightOne(g.edge(e));
  });
}

function swapWidthHeightOne(attrs) {
  var w = attrs.width;
  attrs.width = attrs.height;
  attrs.height = w;
}

function reverseY(g) {
  lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](g.nodes(), function (v) {
    reverseYOne(g.node(v));
  });

  lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](g.edges(), function (e) {
    var edge = g.edge(e);
    lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](edge.points, reverseYOne);
    if (lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](edge, 'y')) {
      reverseYOne(edge);
    }
  });
}

function reverseYOne(attrs) {
  attrs.y = -attrs.y;
}

function swapXY(g) {
  lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](g.nodes(), function (v) {
    swapXYOne(g.node(v));
  });

  lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](g.edges(), function (e) {
    var edge = g.edge(e);
    lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](edge.points, swapXYOne);
    if (lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](edge, 'x')) {
      swapXYOne(edge);
    }
  });
}

function swapXYOne(attrs) {
  var x = attrs.x;
  attrs.x = attrs.y;
  attrs.y = x;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/data/list.js":
/*!*********************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/data/list.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   List: function() { return /* binding */ List; }
/* harmony export */ });
/*
 * Simple doubly linked list implementation derived from Cormen, et al.,
 * "Introduction to Algorithms".
 */



class List {
  constructor() {
    var sentinel = {};
    sentinel._next = sentinel._prev = sentinel;
    this._sentinel = sentinel;
  }
  dequeue() {
    var sentinel = this._sentinel;
    var entry = sentinel._prev;
    if (entry !== sentinel) {
      unlink(entry);
      return entry;
    }
  }
  enqueue(entry) {
    var sentinel = this._sentinel;
    if (entry._prev && entry._next) {
      unlink(entry);
    }
    entry._next = sentinel._next;
    sentinel._next._prev = entry;
    sentinel._next = entry;
    entry._prev = sentinel;
  }
  toString() {
    var strs = [];
    var sentinel = this._sentinel;
    var curr = sentinel._prev;
    while (curr !== sentinel) {
      strs.push(JSON.stringify(curr, filterOutLinks));
      curr = curr._prev;
    }
    return '[' + strs.join(', ') + ']';
  }
}

function unlink(entry) {
  entry._prev._next = entry._next;
  entry._next._prev = entry._prev;
  delete entry._next;
  delete entry._prev;
}

function filterOutLinks(k, v) {
  if (k !== '_next' && k !== '_prev') {
    return v;
  }
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/greedy-fas.js":
/*!**********************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/greedy-fas.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   greedyFAS: function() { return /* binding */ greedyFAS; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/constant.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/flatten.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/map.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/range.js");
/* harmony import */ var _graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../graphlib/index.js */ "./node_modules/dagre-d3-es/src/graphlib/index.js");
/* harmony import */ var _data_list_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data/list.js */ "./node_modules/dagre-d3-es/src/dagre/data/list.js");




/*
 * A greedy heuristic for finding a feedback arc set for a graph. A feedback
 * arc set is a set of edges that can be removed to make a graph acyclic.
 * The algorithm comes from: P. Eades, X. Lin, and W. F. Smyth, "A fast and
 * effective heuristic for the feedback arc set problem." This implementation
 * adjusts that from the paper to allow for weighted edges.
 */


var DEFAULT_WEIGHT_FN = lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](1);

function greedyFAS(g, weightFn) {
  if (g.nodeCount() <= 1) {
    return [];
  }
  var state = buildState(g, weightFn || DEFAULT_WEIGHT_FN);
  var results = doGreedyFAS(state.graph, state.buckets, state.zeroIdx);

  // Expand multi-edges
  return lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](
    lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](results, function (e) {
      return g.outEdges(e.v, e.w);
    })
  );
}

function doGreedyFAS(g, buckets, zeroIdx) {
  var results = [];
  var sources = buckets[buckets.length - 1];
  var sinks = buckets[0];

  var entry;
  while (g.nodeCount()) {
    while ((entry = sinks.dequeue())) {
      removeNode(g, buckets, zeroIdx, entry);
    }
    while ((entry = sources.dequeue())) {
      removeNode(g, buckets, zeroIdx, entry);
    }
    if (g.nodeCount()) {
      for (var i = buckets.length - 2; i > 0; --i) {
        entry = buckets[i].dequeue();
        if (entry) {
          results = results.concat(removeNode(g, buckets, zeroIdx, entry, true));
          break;
        }
      }
    }
  }

  return results;
}

function removeNode(g, buckets, zeroIdx, entry, collectPredecessors) {
  var results = collectPredecessors ? [] : undefined;

  lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](g.inEdges(entry.v), function (edge) {
    var weight = g.edge(edge);
    var uEntry = g.node(edge.v);

    if (collectPredecessors) {
      results.push({ v: edge.v, w: edge.w });
    }

    uEntry.out -= weight;
    assignBucket(buckets, zeroIdx, uEntry);
  });

  lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](g.outEdges(entry.v), function (edge) {
    var weight = g.edge(edge);
    var w = edge.w;
    var wEntry = g.node(w);
    wEntry['in'] -= weight;
    assignBucket(buckets, zeroIdx, wEntry);
  });

  g.removeNode(entry.v);

  return results;
}

function buildState(g, weightFn) {
  var fasGraph = new _graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__.Graph();
  var maxIn = 0;
  var maxOut = 0;

  lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](g.nodes(), function (v) {
    fasGraph.setNode(v, { v: v, in: 0, out: 0 });
  });

  // Aggregate weights on nodes, but also sum the weights across multi-edges
  // into a single edge for the fasGraph.
  lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](g.edges(), function (e) {
    var prevWeight = fasGraph.edge(e.v, e.w) || 0;
    var weight = weightFn(e);
    var edgeWeight = prevWeight + weight;
    fasGraph.setEdge(e.v, e.w, edgeWeight);
    maxOut = Math.max(maxOut, (fasGraph.node(e.v).out += weight));
    maxIn = Math.max(maxIn, (fasGraph.node(e.w)['in'] += weight));
  });

  var buckets = lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](maxOut + maxIn + 3).map(function () {
    return new _data_list_js__WEBPACK_IMPORTED_MODULE_1__.List();
  });
  var zeroIdx = maxIn + 1;

  lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](fasGraph.nodes(), function (v) {
    assignBucket(buckets, zeroIdx, fasGraph.node(v));
  });

  return { graph: fasGraph, buckets: buckets, zeroIdx: zeroIdx };
}

function assignBucket(buckets, zeroIdx, entry) {
  if (!entry.out) {
    buckets[0].enqueue(entry);
  } else if (!entry['in']) {
    buckets[buckets.length - 1].enqueue(entry);
  } else {
    buckets[entry.out - entry['in'] + zeroIdx].enqueue(entry);
  }
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/index.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   acyclic: function() { return /* reexport module object */ _acyclic_js__WEBPACK_IMPORTED_MODULE_0__; },
/* harmony export */   layout: function() { return /* reexport safe */ _layout_js__WEBPACK_IMPORTED_MODULE_1__.layout; },
/* harmony export */   normalize: function() { return /* reexport module object */ _normalize_js__WEBPACK_IMPORTED_MODULE_2__; },
/* harmony export */   rank: function() { return /* reexport safe */ _rank_index_js__WEBPACK_IMPORTED_MODULE_3__.rank; }
/* harmony export */ });
/* harmony import */ var _acyclic_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./acyclic.js */ "./node_modules/dagre-d3-es/src/dagre/acyclic.js");
/* harmony import */ var _layout_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./layout.js */ "./node_modules/dagre-d3-es/src/dagre/layout.js");
/* harmony import */ var _normalize_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./normalize.js */ "./node_modules/dagre-d3-es/src/dagre/normalize.js");
/* harmony import */ var _rank_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rank/index.js */ "./node_modules/dagre-d3-es/src/dagre/rank/index.js");








/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/layout.js":
/*!******************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/layout.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   layout: function() { return /* binding */ layout; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/merge.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/pick.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/defaults.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/max.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/last.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/mapValues.js");
/* harmony import */ var _graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../graphlib/index.js */ "./node_modules/dagre-d3-es/src/graphlib/index.js");
/* harmony import */ var _add_border_segments_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./add-border-segments.js */ "./node_modules/dagre-d3-es/src/dagre/add-border-segments.js");
/* harmony import */ var _coordinate_system_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./coordinate-system.js */ "./node_modules/dagre-d3-es/src/dagre/coordinate-system.js");
/* harmony import */ var _acyclic_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./acyclic.js */ "./node_modules/dagre-d3-es/src/dagre/acyclic.js");
/* harmony import */ var _normalize_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./normalize.js */ "./node_modules/dagre-d3-es/src/dagre/normalize.js");
/* harmony import */ var _rank_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./rank/index.js */ "./node_modules/dagre-d3-es/src/dagre/rank/index.js");
/* harmony import */ var _nesting_graph_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./nesting-graph.js */ "./node_modules/dagre-d3-es/src/dagre/nesting-graph.js");
/* harmony import */ var _order_index_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./order/index.js */ "./node_modules/dagre-d3-es/src/dagre/order/index.js");
/* harmony import */ var _parent_dummy_chains_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parent-dummy-chains.js */ "./node_modules/dagre-d3-es/src/dagre/parent-dummy-chains.js");
/* harmony import */ var _position_index_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./position/index.js */ "./node_modules/dagre-d3-es/src/dagre/position/index.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./util.js */ "./node_modules/dagre-d3-es/src/dagre/util.js");















function layout(g, opts) {
  var time = opts && opts.debugTiming ? _util_js__WEBPACK_IMPORTED_MODULE_10__.time : _util_js__WEBPACK_IMPORTED_MODULE_10__.notime;
  time('layout', function () {
    var layoutGraph = time('  buildLayoutGraph', function () {
      return buildLayoutGraph(g);
    });
    time('  runLayout', function () {
      runLayout(layoutGraph, time);
    });
    time('  updateInputGraph', function () {
      updateInputGraph(g, layoutGraph);
    });
  });
}

function runLayout(g, time) {
  time('    makeSpaceForEdgeLabels', function () {
    makeSpaceForEdgeLabels(g);
  });
  time('    removeSelfEdges', function () {
    removeSelfEdges(g);
  });
  time('    acyclic', function () {
    _acyclic_js__WEBPACK_IMPORTED_MODULE_3__.run(g);
  });
  time('    nestingGraph.run', function () {
    _nesting_graph_js__WEBPACK_IMPORTED_MODULE_6__.run(g);
  });
  time('    rank', function () {
    (0,_rank_index_js__WEBPACK_IMPORTED_MODULE_5__.rank)(_util_js__WEBPACK_IMPORTED_MODULE_10__.asNonCompoundGraph(g));
  });
  time('    injectEdgeLabelProxies', function () {
    injectEdgeLabelProxies(g);
  });
  time('    removeEmptyRanks', function () {
    _util_js__WEBPACK_IMPORTED_MODULE_10__.removeEmptyRanks(g);
  });
  time('    nestingGraph.cleanup', function () {
    _nesting_graph_js__WEBPACK_IMPORTED_MODULE_6__.cleanup(g);
  });
  time('    normalizeRanks', function () {
    _util_js__WEBPACK_IMPORTED_MODULE_10__.normalizeRanks(g);
  });
  time('    assignRankMinMax', function () {
    assignRankMinMax(g);
  });
  time('    removeEdgeLabelProxies', function () {
    removeEdgeLabelProxies(g);
  });
  time('    normalize.run', function () {
    _normalize_js__WEBPACK_IMPORTED_MODULE_4__.run(g);
  });
  time('    parentDummyChains', function () {
    (0,_parent_dummy_chains_js__WEBPACK_IMPORTED_MODULE_8__.parentDummyChains)(g);
  });
  time('    addBorderSegments', function () {
    (0,_add_border_segments_js__WEBPACK_IMPORTED_MODULE_1__.addBorderSegments)(g);
  });
  time('    order', function () {
    (0,_order_index_js__WEBPACK_IMPORTED_MODULE_7__.order)(g);
  });
  time('    insertSelfEdges', function () {
    insertSelfEdges(g);
  });
  time('    adjustCoordinateSystem', function () {
    _coordinate_system_js__WEBPACK_IMPORTED_MODULE_2__.adjust(g);
  });
  time('    position', function () {
    (0,_position_index_js__WEBPACK_IMPORTED_MODULE_9__.position)(g);
  });
  time('    positionSelfEdges', function () {
    positionSelfEdges(g);
  });
  time('    removeBorderNodes', function () {
    removeBorderNodes(g);
  });
  time('    normalize.undo', function () {
    _normalize_js__WEBPACK_IMPORTED_MODULE_4__.undo(g);
  });
  time('    fixupEdgeLabelCoords', function () {
    fixupEdgeLabelCoords(g);
  });
  time('    undoCoordinateSystem', function () {
    _coordinate_system_js__WEBPACK_IMPORTED_MODULE_2__.undo(g);
  });
  time('    translateGraph', function () {
    translateGraph(g);
  });
  time('    assignNodeIntersects', function () {
    assignNodeIntersects(g);
  });
  time('    reversePoints', function () {
    reversePointsForReversedEdges(g);
  });
  time('    acyclic.undo', function () {
    _acyclic_js__WEBPACK_IMPORTED_MODULE_3__.undo(g);
  });
}

/*
 * Copies final layout information from the layout graph back to the input
 * graph. This process only copies whitelisted attributes from the layout graph
 * to the input graph, so it serves as a good place to determine what
 * attributes can influence layout.
 */
function updateInputGraph(inputGraph, layoutGraph) {
  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](inputGraph.nodes(), function (v) {
    var inputLabel = inputGraph.node(v);
    var layoutLabel = layoutGraph.node(v);

    if (inputLabel) {
      inputLabel.x = layoutLabel.x;
      inputLabel.y = layoutLabel.y;

      if (layoutGraph.children(v).length) {
        inputLabel.width = layoutLabel.width;
        inputLabel.height = layoutLabel.height;
      }
    }
  });

  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](inputGraph.edges(), function (e) {
    var inputLabel = inputGraph.edge(e);
    var layoutLabel = layoutGraph.edge(e);

    inputLabel.points = layoutLabel.points;
    if (lodash_es__WEBPACK_IMPORTED_MODULE_12__["default"](layoutLabel, 'x')) {
      inputLabel.x = layoutLabel.x;
      inputLabel.y = layoutLabel.y;
    }
  });

  inputGraph.graph().width = layoutGraph.graph().width;
  inputGraph.graph().height = layoutGraph.graph().height;
}

var graphNumAttrs = ['nodesep', 'edgesep', 'ranksep', 'marginx', 'marginy'];
var graphDefaults = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: 'tb' };
var graphAttrs = ['acyclicer', 'ranker', 'rankdir', 'align'];
var nodeNumAttrs = ['width', 'height'];
var nodeDefaults = { width: 0, height: 0 };
var edgeNumAttrs = ['minlen', 'weight', 'width', 'height', 'labeloffset'];
var edgeDefaults = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: 'r',
};
var edgeAttrs = ['labelpos'];

/*
 * Constructs a new graph from the input graph, which can be used for layout.
 * This process copies only whitelisted attributes from the input graph to the
 * layout graph. Thus this function serves as a good place to determine what
 * attributes can influence layout.
 */
function buildLayoutGraph(inputGraph) {
  var g = new _graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__.Graph({ multigraph: true, compound: true });
  var graph = canonicalize(inputGraph.graph());

  g.setGraph(
    lodash_es__WEBPACK_IMPORTED_MODULE_13__["default"]({}, graphDefaults, selectNumberAttrs(graph, graphNumAttrs), lodash_es__WEBPACK_IMPORTED_MODULE_14__["default"](graph, graphAttrs))
  );

  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](inputGraph.nodes(), function (v) {
    var node = canonicalize(inputGraph.node(v));
    g.setNode(v, lodash_es__WEBPACK_IMPORTED_MODULE_15__["default"](selectNumberAttrs(node, nodeNumAttrs), nodeDefaults));
    g.setParent(v, inputGraph.parent(v));
  });

  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](inputGraph.edges(), function (e) {
    var edge = canonicalize(inputGraph.edge(e));
    g.setEdge(
      e,
      lodash_es__WEBPACK_IMPORTED_MODULE_13__["default"]({}, edgeDefaults, selectNumberAttrs(edge, edgeNumAttrs), lodash_es__WEBPACK_IMPORTED_MODULE_14__["default"](edge, edgeAttrs))
    );
  });

  return g;
}

/*
 * This idea comes from the Gansner paper: to account for edge labels in our
 * layout we split each rank in half by doubling minlen and halving ranksep.
 * Then we can place labels at these mid-points between nodes.
 *
 * We also add some minimal padding to the width to push the label for the edge
 * away from the edge itself a bit.
 */
function makeSpaceForEdgeLabels(g) {
  var graph = g.graph();
  graph.ranksep /= 2;
  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](g.edges(), function (e) {
    var edge = g.edge(e);
    edge.minlen *= 2;
    if (edge.labelpos.toLowerCase() !== 'c') {
      if (graph.rankdir === 'TB' || graph.rankdir === 'BT') {
        edge.width += edge.labeloffset;
      } else {
        edge.height += edge.labeloffset;
      }
    }
  });
}

/*
 * Creates temporary dummy nodes that capture the rank in which each edge's
 * label is going to, if it has one of non-zero width and height. We do this
 * so that we can safely remove empty ranks while preserving balance for the
 * label's position.
 */
function injectEdgeLabelProxies(g) {
  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](g.edges(), function (e) {
    var edge = g.edge(e);
    if (edge.width && edge.height) {
      var v = g.node(e.v);
      var w = g.node(e.w);
      var label = { rank: (w.rank - v.rank) / 2 + v.rank, e: e };
      _util_js__WEBPACK_IMPORTED_MODULE_10__.addDummyNode(g, 'edge-proxy', label, '_ep');
    }
  });
}

function assignRankMinMax(g) {
  var maxRank = 0;
  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](g.nodes(), function (v) {
    var node = g.node(v);
    if (node.borderTop) {
      node.minRank = g.node(node.borderTop).rank;
      node.maxRank = g.node(node.borderBottom).rank;
      // @ts-expect-error
      maxRank = lodash_es__WEBPACK_IMPORTED_MODULE_16__["default"](maxRank, node.maxRank);
    }
  });
  g.graph().maxRank = maxRank;
}

function removeEdgeLabelProxies(g) {
  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](g.nodes(), function (v) {
    var node = g.node(v);
    if (node.dummy === 'edge-proxy') {
      g.edge(node.e).labelRank = node.rank;
      g.removeNode(v);
    }
  });
}

function translateGraph(g) {
  var minX = Number.POSITIVE_INFINITY;
  var maxX = 0;
  var minY = Number.POSITIVE_INFINITY;
  var maxY = 0;
  var graphLabel = g.graph();
  var marginX = graphLabel.marginx || 0;
  var marginY = graphLabel.marginy || 0;

  function getExtremes(attrs) {
    var x = attrs.x;
    var y = attrs.y;
    var w = attrs.width;
    var h = attrs.height;
    minX = Math.min(minX, x - w / 2);
    maxX = Math.max(maxX, x + w / 2);
    minY = Math.min(minY, y - h / 2);
    maxY = Math.max(maxY, y + h / 2);
  }

  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](g.nodes(), function (v) {
    getExtremes(g.node(v));
  });
  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](g.edges(), function (e) {
    var edge = g.edge(e);
    if (lodash_es__WEBPACK_IMPORTED_MODULE_12__["default"](edge, 'x')) {
      getExtremes(edge);
    }
  });

  minX -= marginX;
  minY -= marginY;

  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](g.nodes(), function (v) {
    var node = g.node(v);
    node.x -= minX;
    node.y -= minY;
  });

  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](g.edges(), function (e) {
    var edge = g.edge(e);
    lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](edge.points, function (p) {
      p.x -= minX;
      p.y -= minY;
    });
    if (lodash_es__WEBPACK_IMPORTED_MODULE_12__["default"](edge, 'x')) {
      edge.x -= minX;
    }
    if (lodash_es__WEBPACK_IMPORTED_MODULE_12__["default"](edge, 'y')) {
      edge.y -= minY;
    }
  });

  graphLabel.width = maxX - minX + marginX;
  graphLabel.height = maxY - minY + marginY;
}

function assignNodeIntersects(g) {
  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](g.edges(), function (e) {
    var edge = g.edge(e);
    var nodeV = g.node(e.v);
    var nodeW = g.node(e.w);
    var p1, p2;
    if (!edge.points) {
      edge.points = [];
      p1 = nodeW;
      p2 = nodeV;
    } else {
      p1 = edge.points[0];
      p2 = edge.points[edge.points.length - 1];
    }
    edge.points.unshift(_util_js__WEBPACK_IMPORTED_MODULE_10__.intersectRect(nodeV, p1));
    edge.points.push(_util_js__WEBPACK_IMPORTED_MODULE_10__.intersectRect(nodeW, p2));
  });
}

function fixupEdgeLabelCoords(g) {
  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](g.edges(), function (e) {
    var edge = g.edge(e);
    if (lodash_es__WEBPACK_IMPORTED_MODULE_12__["default"](edge, 'x')) {
      if (edge.labelpos === 'l' || edge.labelpos === 'r') {
        edge.width -= edge.labeloffset;
      }
      switch (edge.labelpos) {
        case 'l':
          edge.x -= edge.width / 2 + edge.labeloffset;
          break;
        case 'r':
          edge.x += edge.width / 2 + edge.labeloffset;
          break;
      }
    }
  });
}

function reversePointsForReversedEdges(g) {
  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](g.edges(), function (e) {
    var edge = g.edge(e);
    if (edge.reversed) {
      edge.points.reverse();
    }
  });
}

function removeBorderNodes(g) {
  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](g.nodes(), function (v) {
    if (g.children(v).length) {
      var node = g.node(v);
      var t = g.node(node.borderTop);
      var b = g.node(node.borderBottom);
      var l = g.node(lodash_es__WEBPACK_IMPORTED_MODULE_17__["default"](node.borderLeft));
      var r = g.node(lodash_es__WEBPACK_IMPORTED_MODULE_17__["default"](node.borderRight));

      node.width = Math.abs(r.x - l.x);
      node.height = Math.abs(b.y - t.y);
      node.x = l.x + node.width / 2;
      node.y = t.y + node.height / 2;
    }
  });

  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](g.nodes(), function (v) {
    if (g.node(v).dummy === 'border') {
      g.removeNode(v);
    }
  });
}

function removeSelfEdges(g) {
  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](g.edges(), function (e) {
    if (e.v === e.w) {
      var node = g.node(e.v);
      if (!node.selfEdges) {
        node.selfEdges = [];
      }
      node.selfEdges.push({ e: e, label: g.edge(e) });
      g.removeEdge(e);
    }
  });
}

function insertSelfEdges(g) {
  var layers = _util_js__WEBPACK_IMPORTED_MODULE_10__.buildLayerMatrix(g);
  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](layers, function (layer) {
    var orderShift = 0;
    lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](layer, function (v, i) {
      var node = g.node(v);
      node.order = i + orderShift;
      lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](node.selfEdges, function (selfEdge) {
        _util_js__WEBPACK_IMPORTED_MODULE_10__.addDummyNode(
          g,
          'selfedge',
          {
            width: selfEdge.label.width,
            height: selfEdge.label.height,
            rank: node.rank,
            order: i + ++orderShift,
            e: selfEdge.e,
            label: selfEdge.label,
          },
          '_se'
        );
      });
      delete node.selfEdges;
    });
  });
}

function positionSelfEdges(g) {
  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](g.nodes(), function (v) {
    var node = g.node(v);
    if (node.dummy === 'selfedge') {
      var selfNode = g.node(node.e.v);
      var x = selfNode.x + selfNode.width / 2;
      var y = selfNode.y;
      var dx = node.x - x;
      var dy = selfNode.height / 2;
      g.setEdge(node.e, node.label);
      g.removeNode(v);
      node.label.points = [
        { x: x + (2 * dx) / 3, y: y - dy },
        { x: x + (5 * dx) / 6, y: y - dy },
        { x: x + dx, y: y },
        { x: x + (5 * dx) / 6, y: y + dy },
        { x: x + (2 * dx) / 3, y: y + dy },
      ];
      node.label.x = node.x;
      node.label.y = node.y;
    }
  });
}

function selectNumberAttrs(obj, attrs) {
  return lodash_es__WEBPACK_IMPORTED_MODULE_18__["default"](lodash_es__WEBPACK_IMPORTED_MODULE_14__["default"](obj, attrs), Number);
}

function canonicalize(attrs) {
  var newAttrs = {};
  lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](attrs, function (v, k) {
    newAttrs[k.toLowerCase()] = v;
  });
  return newAttrs;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/nesting-graph.js":
/*!*************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/nesting-graph.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cleanup: function() { return /* binding */ cleanup; },
/* harmony export */   run: function() { return /* binding */ run; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/max.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/values.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/reduce.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./node_modules/dagre-d3-es/src/dagre/util.js");





/*
 * A nesting graph creates dummy nodes for the tops and bottoms of subgraphs,
 * adds appropriate edges to ensure that all cluster nodes are placed between
 * these boundries, and ensures that the graph is connected.
 *
 * In addition we ensure, through the use of the minlen property, that nodes
 * and subgraph border nodes to not end up on the same rank.
 *
 * Preconditions:
 *
 *    1. Input graph is a DAG
 *    2. Nodes in the input graph has a minlen attribute
 *
 * Postconditions:
 *
 *    1. Input graph is connected.
 *    2. Dummy nodes are added for the tops and bottoms of subgraphs.
 *    3. The minlen attribute for nodes is adjusted to ensure nodes do not
 *       get placed on the same rank as subgraph border nodes.
 *
 * The nesting graph idea comes from Sander, "Layout of Compound Directed
 * Graphs."
 */
function run(g) {
  var root = _util_js__WEBPACK_IMPORTED_MODULE_0__.addDummyNode(g, 'root', {}, '_root');
  var depths = treeDepths(g);
  var height = lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](depths)) - 1; // Note: depths is an Object not an array
  var nodeSep = 2 * height + 1;

  g.graph().nestingRoot = root;

  // Multiply minlen by nodeSep to align nodes on non-border ranks.
  lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](g.edges(), function (e) {
    g.edge(e).minlen *= nodeSep;
  });

  // Calculate a weight that is sufficient to keep subgraphs vertically compact
  var weight = sumWeights(g) + 1;

  // Create border nodes and link them up
  lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](g.children(), function (child) {
    dfs(g, root, nodeSep, weight, height, depths, child);
  });

  // Save the multiplier for node layers for later removal of empty border
  // layers.
  g.graph().nodeRankFactor = nodeSep;
}

function dfs(g, root, nodeSep, weight, height, depths, v) {
  var children = g.children(v);
  if (!children.length) {
    if (v !== root) {
      g.setEdge(root, v, { weight: 0, minlen: nodeSep });
    }
    return;
  }

  var top = _util_js__WEBPACK_IMPORTED_MODULE_0__.addBorderNode(g, '_bt');
  var bottom = _util_js__WEBPACK_IMPORTED_MODULE_0__.addBorderNode(g, '_bb');
  var label = g.node(v);

  g.setParent(top, v);
  label.borderTop = top;
  g.setParent(bottom, v);
  label.borderBottom = bottom;

  lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](children, function (child) {
    dfs(g, root, nodeSep, weight, height, depths, child);

    var childNode = g.node(child);
    var childTop = childNode.borderTop ? childNode.borderTop : child;
    var childBottom = childNode.borderBottom ? childNode.borderBottom : child;
    var thisWeight = childNode.borderTop ? weight : 2 * weight;
    var minlen = childTop !== childBottom ? 1 : height - depths[v] + 1;

    g.setEdge(top, childTop, {
      weight: thisWeight,
      minlen: minlen,
      nestingEdge: true,
    });

    g.setEdge(childBottom, bottom, {
      weight: thisWeight,
      minlen: minlen,
      nestingEdge: true,
    });
  });

  if (!g.parent(v)) {
    g.setEdge(root, top, { weight: 0, minlen: height + depths[v] });
  }
}

function treeDepths(g) {
  var depths = {};
  function dfs(v, depth) {
    var children = g.children(v);
    if (children && children.length) {
      lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](children, function (child) {
        dfs(child, depth + 1);
      });
    }
    depths[v] = depth;
  }
  lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](g.children(), function (v) {
    dfs(v, 1);
  });
  return depths;
}

function sumWeights(g) {
  return lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](
    g.edges(),
    function (acc, e) {
      return acc + g.edge(e).weight;
    },
    0
  );
}

function cleanup(g) {
  var graphLabel = g.graph();
  g.removeNode(graphLabel.nestingRoot);
  delete graphLabel.nestingRoot;
  lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](g.edges(), function (e) {
    var edge = g.edge(e);
    if (edge.nestingEdge) {
      g.removeEdge(e);
    }
  });
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/normalize.js":
/*!*********************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/normalize.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   run: function() { return /* binding */ run; },
/* harmony export */   undo: function() { return /* binding */ undo; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./node_modules/dagre-d3-es/src/dagre/util.js");





/*
 * Breaks any long edges in the graph into short segments that span 1 layer
 * each. This operation is undoable with the denormalize function.
 *
 * Pre-conditions:
 *
 *    1. The input graph is a DAG.
 *    2. Each node in the graph has a "rank" property.
 *
 * Post-condition:
 *
 *    1. All edges in the graph have a length of 1.
 *    2. Dummy nodes are added where edges have been split into segments.
 *    3. The graph is augmented with a "dummyChains" attribute which contains
 *       the first dummy in each chain of dummy nodes produced.
 */
function run(g) {
  g.graph().dummyChains = [];
  lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](g.edges(), function (edge) {
    normalizeEdge(g, edge);
  });
}

function normalizeEdge(g, e) {
  var v = e.v;
  var vRank = g.node(v).rank;
  var w = e.w;
  var wRank = g.node(w).rank;
  var name = e.name;
  var edgeLabel = g.edge(e);
  var labelRank = edgeLabel.labelRank;

  if (wRank === vRank + 1) return;

  g.removeEdge(e);

  var dummy, attrs, i;
  for (i = 0, ++vRank; vRank < wRank; ++i, ++vRank) {
    edgeLabel.points = [];
    attrs = {
      width: 0,
      height: 0,
      edgeLabel: edgeLabel,
      edgeObj: e,
      rank: vRank,
    };
    dummy = _util_js__WEBPACK_IMPORTED_MODULE_0__.addDummyNode(g, 'edge', attrs, '_d');
    if (vRank === labelRank) {
      attrs.width = edgeLabel.width;
      attrs.height = edgeLabel.height;
      // @ts-expect-error
      attrs.dummy = 'edge-label';
      // @ts-expect-error
      attrs.labelpos = edgeLabel.labelpos;
    }
    g.setEdge(v, dummy, { weight: edgeLabel.weight }, name);
    if (i === 0) {
      g.graph().dummyChains.push(dummy);
    }
    v = dummy;
  }

  g.setEdge(v, w, { weight: edgeLabel.weight }, name);
}

function undo(g) {
  lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](g.graph().dummyChains, function (v) {
    var node = g.node(v);
    var origLabel = node.edgeLabel;
    var w;
    g.setEdge(node.edgeObj, origLabel);
    while (node.dummy) {
      w = g.successors(v)[0];
      g.removeNode(v);
      origLabel.points.push({ x: node.x, y: node.y });
      if (node.dummy === 'edge-label') {
        origLabel.x = node.x;
        origLabel.y = node.y;
        origLabel.width = node.width;
        origLabel.height = node.height;
      }
      v = w;
      node = g.node(v);
    }
  });
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/order/add-subgraph-constraints.js":
/*!******************************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/order/add-subgraph-constraints.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addSubgraphConstraints: function() { return /* binding */ addSubgraphConstraints; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");




function addSubgraphConstraints(g, cg, vs) {
  var prev = {},
    rootPrev;

  lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](vs, function (v) {
    var child = g.parent(v),
      parent,
      prevChild;
    while (child) {
      parent = g.parent(child);
      if (parent) {
        prevChild = prev[parent];
        prev[parent] = child;
      } else {
        prevChild = rootPrev;
        rootPrev = child;
      }
      if (prevChild && prevChild !== child) {
        cg.setEdge(prevChild, child);
        return;
      }
      child = parent;
    }
  });

  /*
  function dfs(v) {
    var children = v ? g.children(v) : g.children();
    if (children.length) {
      var min = Number.POSITIVE_INFINITY,
          subgraphs = [];
      _.each(children, function(child) {
        var childMin = dfs(child);
        if (g.children(child).length) {
          subgraphs.push({ v: child, order: childMin });
        }
        min = Math.min(min, childMin);
      });
      _.reduce(_.sortBy(subgraphs, "order"), function(prev, curr) {
        cg.setEdge(prev.v, curr.v);
        return curr;
      });
      return min;
    }
    return g.node(v).order;
  }
  dfs(undefined);
  */
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/order/barycenter.js":
/*!****************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/order/barycenter.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   barycenter: function() { return /* binding */ barycenter; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/map.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/reduce.js");




function barycenter(g, movable) {
  return lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](movable, function (v) {
    var inV = g.inEdges(v);
    if (!inV.length) {
      return { v: v };
    } else {
      var result = lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](
        inV,
        function (acc, e) {
          var edge = g.edge(e),
            nodeU = g.node(e.v);
          return {
            sum: acc.sum + edge.weight * nodeU.order,
            weight: acc.weight + edge.weight,
          };
        },
        { sum: 0, weight: 0 }
      );

      return {
        v: v,
        barycenter: result.sum / result.weight,
        weight: result.weight,
      };
    }
  });
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/order/build-layer-graph.js":
/*!***********************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/order/build-layer-graph.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildLayerGraph: function() { return /* binding */ buildLayerGraph; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/isUndefined.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/uniqueId.js");
/* harmony import */ var _graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../graphlib/index.js */ "./node_modules/dagre-d3-es/src/graphlib/index.js");





/*
 * Constructs a graph that can be used to sort a layer of nodes. The graph will
 * contain all base and subgraph nodes from the request layer in their original
 * hierarchy and any edges that are incident on these nodes and are of the type
 * requested by the "relationship" parameter.
 *
 * Nodes from the requested rank that do not have parents are assigned a root
 * node in the output graph, which is set in the root graph attribute. This
 * makes it easy to walk the hierarchy of movable nodes during ordering.
 *
 * Pre-conditions:
 *
 *    1. Input graph is a DAG
 *    2. Base nodes in the input graph have a rank attribute
 *    3. Subgraph nodes in the input graph has minRank and maxRank attributes
 *    4. Edges have an assigned weight
 *
 * Post-conditions:
 *
 *    1. Output graph has all nodes in the movable rank with preserved
 *       hierarchy.
 *    2. Root nodes in the movable layer are made children of the node
 *       indicated by the root attribute of the graph.
 *    3. Non-movable nodes incident on movable nodes, selected by the
 *       relationship parameter, are included in the graph (without hierarchy).
 *    4. Edges incident on movable nodes, selected by the relationship
 *       parameter, are added to the output graph.
 *    5. The weights for copied edges are aggregated as need, since the output
 *       graph is not a multi-graph.
 */
function buildLayerGraph(g, rank, relationship) {
  var root = createRootNode(g),
    result = new _graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__.Graph({ compound: true })
      .setGraph({ root: root })
      .setDefaultNodeLabel(function (v) {
        return g.node(v);
      });

  lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](g.nodes(), function (v) {
    var node = g.node(v),
      parent = g.parent(v);

    if (node.rank === rank || (node.minRank <= rank && rank <= node.maxRank)) {
      result.setNode(v);
      result.setParent(v, parent || root);

      // This assumes we have only short edges!
      lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](g[relationship](v), function (e) {
        var u = e.v === v ? e.w : e.v,
          edge = result.edge(u, v),
          weight = !lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](edge) ? edge.weight : 0;
        result.setEdge(u, v, { weight: g.edge(e).weight + weight });
      });

      if (lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](node, 'minRank')) {
        result.setNode(v, {
          borderLeft: node.borderLeft[rank],
          borderRight: node.borderRight[rank],
        });
      }
    }
  });

  return result;
}

function createRootNode(g) {
  var v;
  while (g.hasNode((v = lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"]('_root'))));
  return v;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/order/cross-count.js":
/*!*****************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/order/cross-count.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   crossCount: function() { return /* binding */ crossCount; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/zipObject.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/map.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/flatten.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/sortBy.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");




/*
 * A function that takes a layering (an array of layers, each with an array of
 * ordererd nodes) and a graph and returns a weighted crossing count.
 *
 * Pre-conditions:
 *
 *    1. Input graph must be simple (not a multigraph), directed, and include
 *       only simple edges.
 *    2. Edges in the input graph must have assigned weights.
 *
 * Post-conditions:
 *
 *    1. The graph and layering matrix are left unchanged.
 *
 * This algorithm is derived from Barth, et al., "Bilayer Cross Counting."
 */
function crossCount(g, layering) {
  var cc = 0;
  for (var i = 1; i < layering.length; ++i) {
    cc += twoLayerCrossCount(g, layering[i - 1], layering[i]);
  }
  return cc;
}

function twoLayerCrossCount(g, northLayer, southLayer) {
  // Sort all of the edges between the north and south layers by their position
  // in the north layer and then the south. Map these edges to the position of
  // their head in the south layer.
  var southPos = lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](
    southLayer,
    lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](southLayer, function (v, i) {
      return i;
    })
  );
  var southEntries = lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](
    lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](northLayer, function (v) {
      return lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](
        lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](g.outEdges(v), function (e) {
          return { pos: southPos[e.w], weight: g.edge(e).weight };
        }),
        'pos'
      );
    })
  );

  // Build the accumulator tree
  var firstIndex = 1;
  while (firstIndex < southLayer.length) firstIndex <<= 1;
  var treeSize = 2 * firstIndex - 1;
  firstIndex -= 1;
  var tree = lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](new Array(treeSize), function () {
    return 0;
  });

  // Calculate the weighted crossings
  var cc = 0;
  lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](
    // @ts-expect-error
    southEntries.forEach(function (entry) {
      var index = entry.pos + firstIndex;
      tree[index] += entry.weight;
      var weightSum = 0;
      // @ts-expect-error
      while (index > 0) {
        // @ts-expect-error
        if (index % 2) {
          weightSum += tree[index + 1];
        }
        // @ts-expect-error
        index = (index - 1) >> 1;
        tree[index] += entry.weight;
      }
      cc += entry.weight * weightSum;
    })
  );

  return cc;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/order/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/order/index.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   order: function() { return /* binding */ order; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/range.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/cloneDeep.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/map.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var _graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../graphlib/index.js */ "./node_modules/dagre-d3-es/src/graphlib/index.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util.js */ "./node_modules/dagre-d3-es/src/dagre/util.js");
/* harmony import */ var _add_subgraph_constraints_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./add-subgraph-constraints.js */ "./node_modules/dagre-d3-es/src/dagre/order/add-subgraph-constraints.js");
/* harmony import */ var _build_layer_graph_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./build-layer-graph.js */ "./node_modules/dagre-d3-es/src/dagre/order/build-layer-graph.js");
/* harmony import */ var _cross_count_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./cross-count.js */ "./node_modules/dagre-d3-es/src/dagre/order/cross-count.js");
/* harmony import */ var _init_order_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./init-order.js */ "./node_modules/dagre-d3-es/src/dagre/order/init-order.js");
/* harmony import */ var _sort_subgraph_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./sort-subgraph.js */ "./node_modules/dagre-d3-es/src/dagre/order/sort-subgraph.js");











/*
 * Applies heuristics to minimize edge crossings in the graph and sets the best
 * order solution as an order attribute on each node.
 *
 * Pre-conditions:
 *
 *    1. Graph must be DAG
 *    2. Graph nodes must be objects with a "rank" attribute
 *    3. Graph edges must have the "weight" attribute
 *
 * Post-conditions:
 *
 *    1. Graph nodes will have an "order" attribute based on the results of the
 *       algorithm.
 */
function order(g) {
  var maxRank = _util_js__WEBPACK_IMPORTED_MODULE_1__.maxRank(g),
    downLayerGraphs = buildLayerGraphs(g, lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](1, maxRank + 1), 'inEdges'),
    upLayerGraphs = buildLayerGraphs(g, lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](maxRank - 1, -1, -1), 'outEdges');

  var layering = (0,_init_order_js__WEBPACK_IMPORTED_MODULE_5__.initOrder)(g);
  assignOrder(g, layering);

  var bestCC = Number.POSITIVE_INFINITY,
    best;

  for (var i = 0, lastBest = 0; lastBest < 4; ++i, ++lastBest) {
    sweepLayerGraphs(i % 2 ? downLayerGraphs : upLayerGraphs, i % 4 >= 2);

    layering = _util_js__WEBPACK_IMPORTED_MODULE_1__.buildLayerMatrix(g);
    var cc = (0,_cross_count_js__WEBPACK_IMPORTED_MODULE_4__.crossCount)(g, layering);
    if (cc < bestCC) {
      lastBest = 0;
      best = lodash_es__WEBPACK_IMPORTED_MODULE_8__["default"](layering);
      bestCC = cc;
    }
  }

  assignOrder(g, best);
}

function buildLayerGraphs(g, ranks, relationship) {
  return lodash_es__WEBPACK_IMPORTED_MODULE_9__["default"](ranks, function (rank) {
    return (0,_build_layer_graph_js__WEBPACK_IMPORTED_MODULE_3__.buildLayerGraph)(g, rank, relationship);
  });
}

function sweepLayerGraphs(layerGraphs, biasRight) {
  var cg = new _graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__.Graph();
  lodash_es__WEBPACK_IMPORTED_MODULE_10__["default"](layerGraphs, function (lg) {
    var root = lg.graph().root;
    var sorted = (0,_sort_subgraph_js__WEBPACK_IMPORTED_MODULE_6__.sortSubgraph)(lg, root, cg, biasRight);
    lodash_es__WEBPACK_IMPORTED_MODULE_10__["default"](sorted.vs, function (v, i) {
      lg.node(v).order = i;
    });
    (0,_add_subgraph_constraints_js__WEBPACK_IMPORTED_MODULE_2__.addSubgraphConstraints)(lg, cg, sorted.vs);
  });
}

function assignOrder(g, layering) {
  lodash_es__WEBPACK_IMPORTED_MODULE_10__["default"](layering, function (layer) {
    lodash_es__WEBPACK_IMPORTED_MODULE_10__["default"](layer, function (v, i) {
      g.node(v).order = i;
    });
  });
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/order/init-order.js":
/*!****************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/order/init-order.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initOrder: function() { return /* binding */ initOrder; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/filter.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/max.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/map.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/range.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/sortBy.js");




/*
 * Assigns an initial order value for each node by performing a DFS search
 * starting from nodes in the first rank. Nodes are assigned an order in their
 * rank as they are first visited.
 *
 * This approach comes from Gansner, et al., "A Technique for Drawing Directed
 * Graphs."
 *
 * Returns a layering matrix with an array per layer and each layer sorted by
 * the order of its nodes.
 */
function initOrder(g) {
  var visited = {};
  var simpleNodes = lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](g.nodes(), function (v) {
    return !g.children(v).length;
  });
  var maxRank = lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](
    lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](simpleNodes, function (v) {
      return g.node(v).rank;
    })
  );
  var layers = lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](maxRank + 1), function () {
    return [];
  });

  function dfs(v) {
    if (lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](visited, v)) return;
    visited[v] = true;
    var node = g.node(v);
    layers[node.rank].push(v);
    lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](g.successors(v), dfs);
  }

  var orderedVs = lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](simpleNodes, function (v) {
    return g.node(v).rank;
  });
  lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](orderedVs, dfs);

  return layers;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/order/resolve-conflicts.js":
/*!***********************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/order/resolve-conflicts.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   resolveConflicts: function() { return /* binding */ resolveConflicts; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/isUndefined.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/filter.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/map.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/pick.js");




/*
 * Given a list of entries of the form {v, barycenter, weight} and a
 * constraint graph this function will resolve any conflicts between the
 * constraint graph and the barycenters for the entries. If the barycenters for
 * an entry would violate a constraint in the constraint graph then we coalesce
 * the nodes in the conflict into a new node that respects the contraint and
 * aggregates barycenter and weight information.
 *
 * This implementation is based on the description in Forster, "A Fast and
 * Simple Hueristic for Constrained Two-Level Crossing Reduction," thought it
 * differs in some specific details.
 *
 * Pre-conditions:
 *
 *    1. Each entry has the form {v, barycenter, weight}, or if the node has
 *       no barycenter, then {v}.
 *
 * Returns:
 *
 *    A new list of entries of the form {vs, i, barycenter, weight}. The list
 *    `vs` may either be a singleton or it may be an aggregation of nodes
 *    ordered such that they do not violate constraints from the constraint
 *    graph. The property `i` is the lowest original index of any of the
 *    elements in `vs`.
 */
function resolveConflicts(entries, cg) {
  var mappedEntries = {};
  lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](entries, function (entry, i) {
    var tmp = (mappedEntries[entry.v] = {
      indegree: 0,
      in: [],
      out: [],
      vs: [entry.v],
      i: i,
    });
    if (!lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](entry.barycenter)) {
      // @ts-expect-error
      tmp.barycenter = entry.barycenter;
      // @ts-expect-error
      tmp.weight = entry.weight;
    }
  });

  lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](cg.edges(), function (e) {
    var entryV = mappedEntries[e.v];
    var entryW = mappedEntries[e.w];
    if (!lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](entryV) && !lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](entryW)) {
      entryW.indegree++;
      entryV.out.push(mappedEntries[e.w]);
    }
  });

  var sourceSet = lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](mappedEntries, function (entry) {
    // @ts-expect-error
    return !entry.indegree;
  });

  return doResolveConflicts(sourceSet);
}

function doResolveConflicts(sourceSet) {
  var entries = [];

  function handleIn(vEntry) {
    return function (uEntry) {
      if (uEntry.merged) {
        return;
      }
      if (
        lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](uEntry.barycenter) ||
        lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](vEntry.barycenter) ||
        uEntry.barycenter >= vEntry.barycenter
      ) {
        mergeEntries(vEntry, uEntry);
      }
    };
  }

  function handleOut(vEntry) {
    return function (wEntry) {
      wEntry['in'].push(vEntry);
      if (--wEntry.indegree === 0) {
        sourceSet.push(wEntry);
      }
    };
  }

  while (sourceSet.length) {
    var entry = sourceSet.pop();
    entries.push(entry);
    lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](entry['in'].reverse(), handleIn(entry));
    lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](entry.out, handleOut(entry));
  }

  return lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](
    lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](entries, function (entry) {
      return !entry.merged;
    }),
    function (entry) {
      return lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](entry, ['vs', 'i', 'barycenter', 'weight']);
    }
  );
}

function mergeEntries(target, source) {
  var sum = 0;
  var weight = 0;

  if (target.weight) {
    sum += target.barycenter * target.weight;
    weight += target.weight;
  }

  if (source.weight) {
    sum += source.barycenter * source.weight;
    weight += source.weight;
  }

  target.vs = source.vs.concat(target.vs);
  target.barycenter = sum / weight;
  target.weight = weight;
  target.i = Math.min(source.i, target.i);
  source.merged = true;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/order/sort-subgraph.js":
/*!*******************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/order/sort-subgraph.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sortSubgraph: function() { return /* binding */ sortSubgraph; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/filter.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/flatten.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/isUndefined.js");
/* harmony import */ var _barycenter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./barycenter.js */ "./node_modules/dagre-d3-es/src/dagre/order/barycenter.js");
/* harmony import */ var _resolve_conflicts_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./resolve-conflicts.js */ "./node_modules/dagre-d3-es/src/dagre/order/resolve-conflicts.js");
/* harmony import */ var _sort_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sort.js */ "./node_modules/dagre-d3-es/src/dagre/order/sort.js");







function sortSubgraph(g, v, cg, biasRight) {
  var movable = g.children(v);
  var node = g.node(v);
  var bl = node ? node.borderLeft : undefined;
  var br = node ? node.borderRight : undefined;
  var subgraphs = {};

  if (bl) {
    movable = lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](movable, function (w) {
      return w !== bl && w !== br;
    });
  }

  var barycenters = (0,_barycenter_js__WEBPACK_IMPORTED_MODULE_0__.barycenter)(g, movable);
  lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](barycenters, function (entry) {
    if (g.children(entry.v).length) {
      var subgraphResult = sortSubgraph(g, entry.v, cg, biasRight);
      subgraphs[entry.v] = subgraphResult;
      if (lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](subgraphResult, 'barycenter')) {
        mergeBarycenters(entry, subgraphResult);
      }
    }
  });

  var entries = (0,_resolve_conflicts_js__WEBPACK_IMPORTED_MODULE_1__.resolveConflicts)(barycenters, cg);
  expandSubgraphs(entries, subgraphs);

  var result = (0,_sort_js__WEBPACK_IMPORTED_MODULE_2__.sort)(entries, biasRight);

  if (bl) {
    result.vs = lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"]([bl, result.vs, br]);
    if (g.predecessors(bl).length) {
      var blPred = g.node(g.predecessors(bl)[0]),
        brPred = g.node(g.predecessors(br)[0]);
      if (!lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](result, 'barycenter')) {
        result.barycenter = 0;
        result.weight = 0;
      }
      result.barycenter =
        (result.barycenter * result.weight + blPred.order + brPred.order) / (result.weight + 2);
      result.weight += 2;
    }
  }

  return result;
}

function expandSubgraphs(entries, subgraphs) {
  lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](entries, function (entry) {
    entry.vs = lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](
      entry.vs.map(function (v) {
        if (subgraphs[v]) {
          return subgraphs[v].vs;
        }
        return v;
      })
    );
  });
}

function mergeBarycenters(target, other) {
  if (!lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](target.barycenter)) {
    target.barycenter =
      (target.barycenter * target.weight + other.barycenter * other.weight) /
      (target.weight + other.weight);
    target.weight += other.weight;
  } else {
    target.barycenter = other.barycenter;
    target.weight = other.weight;
  }
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/order/sort.js":
/*!**********************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/order/sort.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sort: function() { return /* binding */ sort; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/sortBy.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/flatten.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/last.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util.js */ "./node_modules/dagre-d3-es/src/dagre/util.js");





function sort(entries, biasRight) {
  var parts = _util_js__WEBPACK_IMPORTED_MODULE_0__.partition(entries, function (entry) {
    return lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](entry, 'barycenter');
  });
  var sortable = parts.lhs,
    unsortable = lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](parts.rhs, function (entry) {
      return -entry.i;
    }),
    vs = [],
    sum = 0,
    weight = 0,
    vsIndex = 0;

  sortable.sort(compareWithBias(!!biasRight));

  vsIndex = consumeUnsortable(vs, unsortable, vsIndex);

  lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](sortable, function (entry) {
    vsIndex += entry.vs.length;
    vs.push(entry.vs);
    sum += entry.barycenter * entry.weight;
    weight += entry.weight;
    vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
  });

  var result = { vs: lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](vs) };
  if (weight) {
    result.barycenter = sum / weight;
    result.weight = weight;
  }
  return result;
}

function consumeUnsortable(vs, unsortable, index) {
  var last;
  while (unsortable.length && (last = lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](unsortable)).i <= index) {
    unsortable.pop();
    vs.push(last.vs);
    index++;
  }
  return index;
}

function compareWithBias(bias) {
  return function (entryV, entryW) {
    if (entryV.barycenter < entryW.barycenter) {
      return -1;
    } else if (entryV.barycenter > entryW.barycenter) {
      return 1;
    }

    return !bias ? entryV.i - entryW.i : entryW.i - entryV.i;
  };
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/parent-dummy-chains.js":
/*!*******************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/parent-dummy-chains.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parentDummyChains: function() { return /* binding */ parentDummyChains; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");




function parentDummyChains(g) {
  var postorderNums = postorder(g);

  lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](g.graph().dummyChains, function (v) {
    var node = g.node(v);
    var edgeObj = node.edgeObj;
    var pathData = findPath(g, postorderNums, edgeObj.v, edgeObj.w);
    var path = pathData.path;
    var lca = pathData.lca;
    var pathIdx = 0;
    var pathV = path[pathIdx];
    var ascending = true;

    while (v !== edgeObj.w) {
      node = g.node(v);

      if (ascending) {
        while ((pathV = path[pathIdx]) !== lca && g.node(pathV).maxRank < node.rank) {
          pathIdx++;
        }

        if (pathV === lca) {
          ascending = false;
        }
      }

      if (!ascending) {
        while (
          pathIdx < path.length - 1 &&
          g.node((pathV = path[pathIdx + 1])).minRank <= node.rank
        ) {
          pathIdx++;
        }
        pathV = path[pathIdx];
      }

      g.setParent(v, pathV);
      v = g.successors(v)[0];
    }
  });
}

// Find a path from v to w through the lowest common ancestor (LCA). Return the
// full path and the LCA.
function findPath(g, postorderNums, v, w) {
  var vPath = [];
  var wPath = [];
  var low = Math.min(postorderNums[v].low, postorderNums[w].low);
  var lim = Math.max(postorderNums[v].lim, postorderNums[w].lim);
  var parent;
  var lca;

  // Traverse up from v to find the LCA
  parent = v;
  do {
    parent = g.parent(parent);
    vPath.push(parent);
  } while (parent && (postorderNums[parent].low > low || lim > postorderNums[parent].lim));
  lca = parent;

  // Traverse from w to LCA
  parent = w;
  while ((parent = g.parent(parent)) !== lca) {
    wPath.push(parent);
  }

  return { path: vPath.concat(wPath.reverse()), lca: lca };
}

function postorder(g) {
  var result = {};
  var lim = 0;

  function dfs(v) {
    var low = lim;
    lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](g.children(v), dfs);
    result[v] = { low: low, lim: lim++ };
  }
  lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](g.children(), dfs);

  return result;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/position/bk.js":
/*!***********************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/position/bk.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addConflict: function() { return /* binding */ addConflict; },
/* harmony export */   alignCoordinates: function() { return /* binding */ alignCoordinates; },
/* harmony export */   balance: function() { return /* binding */ balance; },
/* harmony export */   findSmallestWidthAlignment: function() { return /* binding */ findSmallestWidthAlignment; },
/* harmony export */   findType1Conflicts: function() { return /* binding */ findType1Conflicts; },
/* harmony export */   findType2Conflicts: function() { return /* binding */ findType2Conflicts; },
/* harmony export */   hasConflict: function() { return /* binding */ hasConflict; },
/* harmony export */   horizontalCompaction: function() { return /* binding */ horizontalCompaction; },
/* harmony export */   positionX: function() { return /* binding */ positionX; },
/* harmony export */   verticalAlignment: function() { return /* binding */ verticalAlignment; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/last.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/reduce.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/range.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/find.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/sortBy.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/minBy.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/values.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forIn.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/min.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/max.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/mapValues.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/map.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/merge.js");
/* harmony import */ var _graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../graphlib/index.js */ "./node_modules/dagre-d3-es/src/graphlib/index.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util.js */ "./node_modules/dagre-d3-es/src/dagre/util.js");




/*
 * This module provides coordinate assignment based on Brandes and Köpf, "Fast
 * and Simple Horizontal Coordinate Assignment."
 */



/*
 * Marks all edges in the graph with a type-1 conflict with the "type1Conflict"
 * property. A type-1 conflict is one where a non-inner segment crosses an
 * inner segment. An inner segment is an edge with both incident nodes marked
 * with the "dummy" property.
 *
 * This algorithm scans layer by layer, starting with the second, for type-1
 * conflicts between the current layer and the previous layer. For each layer
 * it scans the nodes from left to right until it reaches one that is incident
 * on an inner segment. It then scans predecessors to determine if they have
 * edges that cross that inner segment. At the end a final scan is done for all
 * nodes on the current rank to see if they cross the last visited inner
 * segment.
 *
 * This algorithm (safely) assumes that a dummy node will only be incident on a
 * single node in the layers being scanned.
 */
function findType1Conflicts(g, layering) {
  var conflicts = {};

  function visitLayer(prevLayer, layer) {
    var // last visited node in the previous layer that is incident on an inner
      // segment.
      k0 = 0,
      // Tracks the last node in this layer scanned for crossings with a type-1
      // segment.
      scanPos = 0,
      prevLayerLength = prevLayer.length,
      lastNode = lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](layer);

    lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](layer, function (v, i) {
      var w = findOtherInnerSegmentNode(g, v),
        k1 = w ? g.node(w).order : prevLayerLength;

      if (w || v === lastNode) {
        lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](layer.slice(scanPos, i + 1), function (scanNode) {
          lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](g.predecessors(scanNode), function (u) {
            var uLabel = g.node(u),
              uPos = uLabel.order;
            if ((uPos < k0 || k1 < uPos) && !(uLabel.dummy && g.node(scanNode).dummy)) {
              addConflict(conflicts, u, scanNode);
            }
          });
        });
        // @ts-expect-error
        scanPos = i + 1;
        k0 = k1;
      }
    });

    return layer;
  }

  lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](layering, visitLayer);
  return conflicts;
}

function findType2Conflicts(g, layering) {
  var conflicts = {};

  function scan(south, southPos, southEnd, prevNorthBorder, nextNorthBorder) {
    var v;
    lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](southPos, southEnd), function (i) {
      v = south[i];
      if (g.node(v).dummy) {
        lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](g.predecessors(v), function (u) {
          var uNode = g.node(u);
          if (uNode.dummy && (uNode.order < prevNorthBorder || uNode.order > nextNorthBorder)) {
            addConflict(conflicts, u, v);
          }
        });
      }
    });
  }

  function visitLayer(north, south) {
    var prevNorthPos = -1,
      nextNorthPos,
      southPos = 0;

    lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](south, function (v, southLookahead) {
      if (g.node(v).dummy === 'border') {
        var predecessors = g.predecessors(v);
        if (predecessors.length) {
          nextNorthPos = g.node(predecessors[0]).order;
          scan(south, southPos, southLookahead, prevNorthPos, nextNorthPos);
          // @ts-expect-error
          southPos = southLookahead;
          prevNorthPos = nextNorthPos;
        }
      }
      scan(south, southPos, south.length, nextNorthPos, north.length);
    });

    return south;
  }

  lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](layering, visitLayer);
  return conflicts;
}

function findOtherInnerSegmentNode(g, v) {
  if (g.node(v).dummy) {
    return lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](g.predecessors(v), function (u) {
      return g.node(u).dummy;
    });
  }
}

function addConflict(conflicts, v, w) {
  if (v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }

  var conflictsV = conflicts[v];
  if (!conflictsV) {
    conflicts[v] = conflictsV = {};
  }
  conflictsV[w] = true;
}

function hasConflict(conflicts, v, w) {
  if (v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  return lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](conflicts[v], w);
}

/*
 * Try to align nodes into vertical "blocks" where possible. This algorithm
 * attempts to align a node with one of its median neighbors. If the edge
 * connecting a neighbor is a type-1 conflict then we ignore that possibility.
 * If a previous node has already formed a block with a node after the node
 * we're trying to form a block with, we also ignore that possibility - our
 * blocks would be split in that scenario.
 */
function verticalAlignment(g, layering, conflicts, neighborFn) {
  var root = {},
    align = {},
    pos = {};

  // We cache the position here based on the layering because the graph and
  // layering may be out of sync. The layering matrix is manipulated to
  // generate different extreme alignments.
  lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](layering, function (layer) {
    lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](layer, function (v, order) {
      root[v] = v;
      align[v] = v;
      pos[v] = order;
    });
  });

  lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](layering, function (layer) {
    var prevIdx = -1;
    lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](layer, function (v) {
      var ws = neighborFn(v);
      if (ws.length) {
        ws = lodash_es__WEBPACK_IMPORTED_MODULE_8__["default"](ws, function (w) {
          return pos[w];
        });
        var mp = (ws.length - 1) / 2;
        for (var i = Math.floor(mp), il = Math.ceil(mp); i <= il; ++i) {
          var w = ws[i];
          if (align[v] === v && prevIdx < pos[w] && !hasConflict(conflicts, v, w)) {
            align[w] = v;
            align[v] = root[v] = root[w];
            prevIdx = pos[w];
          }
        }
      }
    });
  });

  return { root: root, align: align };
}

function horizontalCompaction(g, layering, root, align, reverseSep) {
  // This portion of the algorithm differs from BK due to a number of problems.
  // Instead of their algorithm we construct a new block graph and do two
  // sweeps. The first sweep places blocks with the smallest possible
  // coordinates. The second sweep removes unused space by moving blocks to the
  // greatest coordinates without violating separation.
  var xs = {},
    blockG = buildBlockGraph(g, layering, root, reverseSep),
    borderType = reverseSep ? 'borderLeft' : 'borderRight';

  function iterate(setXsFunc, nextNodesFunc) {
    var stack = blockG.nodes();
    var elem = stack.pop();
    var visited = {};
    while (elem) {
      if (visited[elem]) {
        setXsFunc(elem);
      } else {
        visited[elem] = true;
        stack.push(elem);
        stack = stack.concat(nextNodesFunc(elem));
      }

      elem = stack.pop();
    }
  }

  // First pass, assign smallest coordinates
  function pass1(elem) {
    xs[elem] = blockG.inEdges(elem).reduce(function (acc, e) {
      return Math.max(acc, xs[e.v] + blockG.edge(e));
    }, 0);
  }

  // Second pass, assign greatest coordinates
  function pass2(elem) {
    var min = blockG.outEdges(elem).reduce(function (acc, e) {
      return Math.min(acc, xs[e.w] - blockG.edge(e));
    }, Number.POSITIVE_INFINITY);

    var node = g.node(elem);
    if (min !== Number.POSITIVE_INFINITY && node.borderType !== borderType) {
      xs[elem] = Math.max(xs[elem], min);
    }
  }

  iterate(pass1, blockG.predecessors.bind(blockG));
  iterate(pass2, blockG.successors.bind(blockG));

  // Assign x coordinates to all nodes
  lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](align, function (v) {
    xs[v] = xs[root[v]];
  });

  return xs;
}

function buildBlockGraph(g, layering, root, reverseSep) {
  var blockGraph = new _graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__.Graph(),
    graphLabel = g.graph(),
    sepFn = sep(graphLabel.nodesep, graphLabel.edgesep, reverseSep);

  lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](layering, function (layer) {
    var u;
    lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](layer, function (v) {
      var vRoot = root[v];
      blockGraph.setNode(vRoot);
      if (u) {
        var uRoot = root[u],
          prevMax = blockGraph.edge(uRoot, vRoot);
        blockGraph.setEdge(uRoot, vRoot, Math.max(sepFn(g, v, u), prevMax || 0));
      }
      u = v;
    });
  });

  return blockGraph;
}

/*
 * Returns the alignment that has the smallest width of the given alignments.
 */
function findSmallestWidthAlignment(g, xss) {
  return lodash_es__WEBPACK_IMPORTED_MODULE_9__["default"](lodash_es__WEBPACK_IMPORTED_MODULE_10__["default"](xss), function (xs) {
    var max = Number.NEGATIVE_INFINITY;
    var min = Number.POSITIVE_INFINITY;

    lodash_es__WEBPACK_IMPORTED_MODULE_11__["default"](xs, function (x, v) {
      var halfWidth = width(g, v) / 2;

      max = Math.max(x + halfWidth, max);
      min = Math.min(x - halfWidth, min);
    });

    return max - min;
  });
}

/*
 * Align the coordinates of each of the layout alignments such that
 * left-biased alignments have their minimum coordinate at the same point as
 * the minimum coordinate of the smallest width alignment and right-biased
 * alignments have their maximum coordinate at the same point as the maximum
 * coordinate of the smallest width alignment.
 */
function alignCoordinates(xss, alignTo) {
  var alignToVals = lodash_es__WEBPACK_IMPORTED_MODULE_10__["default"](alignTo),
    alignToMin = lodash_es__WEBPACK_IMPORTED_MODULE_12__["default"](alignToVals),
    alignToMax = lodash_es__WEBPACK_IMPORTED_MODULE_13__["default"](alignToVals);

  lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](['u', 'd'], function (vert) {
    lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](['l', 'r'], function (horiz) {
      var alignment = vert + horiz,
        xs = xss[alignment],
        delta;
      if (xs === alignTo) return;

      var xsVals = lodash_es__WEBPACK_IMPORTED_MODULE_10__["default"](xs);
      delta = horiz === 'l' ? alignToMin - lodash_es__WEBPACK_IMPORTED_MODULE_12__["default"](xsVals) : alignToMax - lodash_es__WEBPACK_IMPORTED_MODULE_13__["default"](xsVals);

      if (delta) {
        xss[alignment] = lodash_es__WEBPACK_IMPORTED_MODULE_14__["default"](xs, function (x) {
          return x + delta;
        });
      }
    });
  });
}

function balance(xss, align) {
  return lodash_es__WEBPACK_IMPORTED_MODULE_14__["default"](xss.ul, function (ignore, v) {
    if (align) {
      return xss[align.toLowerCase()][v];
    } else {
      var xs = lodash_es__WEBPACK_IMPORTED_MODULE_8__["default"](lodash_es__WEBPACK_IMPORTED_MODULE_15__["default"](xss, v));
      return (xs[1] + xs[2]) / 2;
    }
  });
}

function positionX(g) {
  var layering = _util_js__WEBPACK_IMPORTED_MODULE_1__.buildLayerMatrix(g);
  var conflicts = lodash_es__WEBPACK_IMPORTED_MODULE_16__["default"](findType1Conflicts(g, layering), findType2Conflicts(g, layering));

  var xss = {};
  var adjustedLayering;
  lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](['u', 'd'], function (vert) {
    adjustedLayering = vert === 'u' ? layering : lodash_es__WEBPACK_IMPORTED_MODULE_10__["default"](layering).reverse();
    lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](['l', 'r'], function (horiz) {
      if (horiz === 'r') {
        adjustedLayering = lodash_es__WEBPACK_IMPORTED_MODULE_15__["default"](adjustedLayering, function (inner) {
          return lodash_es__WEBPACK_IMPORTED_MODULE_10__["default"](inner).reverse();
        });
      }

      var neighborFn = (vert === 'u' ? g.predecessors : g.successors).bind(g);
      var align = verticalAlignment(g, adjustedLayering, conflicts, neighborFn);
      var xs = horizontalCompaction(g, adjustedLayering, align.root, align.align, horiz === 'r');
      if (horiz === 'r') {
        xs = lodash_es__WEBPACK_IMPORTED_MODULE_14__["default"](xs, function (x) {
          return -x;
        });
      }
      xss[vert + horiz] = xs;
    });
  });

  var smallestWidth = findSmallestWidthAlignment(g, xss);
  alignCoordinates(xss, smallestWidth);
  return balance(xss, g.graph().align);
}

function sep(nodeSep, edgeSep, reverseSep) {
  return function (g, v, w) {
    var vLabel = g.node(v);
    var wLabel = g.node(w);
    var sum = 0;
    var delta;

    sum += vLabel.width / 2;
    if (lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](vLabel, 'labelpos')) {
      switch (vLabel.labelpos.toLowerCase()) {
        case 'l':
          delta = -vLabel.width / 2;
          break;
        case 'r':
          delta = vLabel.width / 2;
          break;
      }
    }
    if (delta) {
      sum += reverseSep ? delta : -delta;
    }
    delta = 0;

    sum += (vLabel.dummy ? edgeSep : nodeSep) / 2;
    sum += (wLabel.dummy ? edgeSep : nodeSep) / 2;

    sum += wLabel.width / 2;
    if (lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](wLabel, 'labelpos')) {
      switch (wLabel.labelpos.toLowerCase()) {
        case 'l':
          delta = wLabel.width / 2;
          break;
        case 'r':
          delta = -wLabel.width / 2;
          break;
      }
    }
    if (delta) {
      sum += reverseSep ? delta : -delta;
    }
    delta = 0;

    return sum;
  };
}

function width(g, v) {
  return g.node(v).width;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/position/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/position/index.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   position: function() { return /* binding */ position; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forOwn.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/max.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/map.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util.js */ "./node_modules/dagre-d3-es/src/dagre/util.js");
/* harmony import */ var _bk_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bk.js */ "./node_modules/dagre-d3-es/src/dagre/position/bk.js");






function position(g) {
  g = _util_js__WEBPACK_IMPORTED_MODULE_0__.asNonCompoundGraph(g);

  positionY(g);
  lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"]((0,_bk_js__WEBPACK_IMPORTED_MODULE_1__.positionX)(g), function (x, v) {
    g.node(v).x = x;
  });
}

function positionY(g) {
  var layering = _util_js__WEBPACK_IMPORTED_MODULE_0__.buildLayerMatrix(g);
  var rankSep = g.graph().ranksep;
  var prevY = 0;
  lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](layering, function (layer) {
    var maxHeight = lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](
      lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](layer, function (v) {
        return g.node(v).height;
      })
    );
    lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](layer, function (v) {
      g.node(v).y = prevY + maxHeight / 2;
    });
    prevY += maxHeight + rankSep;
  });
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/rank/feasible-tree.js":
/*!******************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/rank/feasible-tree.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   feasibleTree: function() { return /* binding */ feasibleTree; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/minBy.js");
/* harmony import */ var _graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../graphlib/index.js */ "./node_modules/dagre-d3-es/src/graphlib/index.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ "./node_modules/dagre-d3-es/src/dagre/rank/util.js");






/*
 * Constructs a spanning tree with tight edges and adjusted the input node's
 * ranks to achieve this. A tight edge is one that is has a length that matches
 * its "minlen" attribute.
 *
 * The basic structure for this function is derived from Gansner, et al., "A
 * Technique for Drawing Directed Graphs."
 *
 * Pre-conditions:
 *
 *    1. Graph must be a DAG.
 *    2. Graph must be connected.
 *    3. Graph must have at least one node.
 *    5. Graph nodes must have been previously assigned a "rank" property that
 *       respects the "minlen" property of incident edges.
 *    6. Graph edges must have a "minlen" property.
 *
 * Post-conditions:
 *
 *    - Graph nodes will have their rank adjusted to ensure that all edges are
 *      tight.
 *
 * Returns a tree (undirected graph) that is constructed using only "tight"
 * edges.
 */
function feasibleTree(g) {
  var t = new _graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__.Graph({ directed: false });

  // Choose arbitrary node from which to start our tree
  var start = g.nodes()[0];
  var size = g.nodeCount();
  t.setNode(start, {});

  var edge, delta;
  while (tightTree(t, g) < size) {
    edge = findMinSlackEdge(t, g);
    delta = t.hasNode(edge.v) ? (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.slack)(g, edge) : -(0,_util_js__WEBPACK_IMPORTED_MODULE_1__.slack)(g, edge);
    shiftRanks(t, g, delta);
  }

  return t;
}

/*
 * Finds a maximal tree of tight edges and returns the number of nodes in the
 * tree.
 */
function tightTree(t, g) {
  function dfs(v) {
    lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](g.nodeEdges(v), function (e) {
      var edgeV = e.v,
        w = v === edgeV ? e.w : edgeV;
      if (!t.hasNode(w) && !(0,_util_js__WEBPACK_IMPORTED_MODULE_1__.slack)(g, e)) {
        t.setNode(w, {});
        t.setEdge(v, w, {});
        dfs(w);
      }
    });
  }

  lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](t.nodes(), dfs);
  return t.nodeCount();
}

/*
 * Finds the edge with the smallest slack that is incident on tree and returns
 * it.
 */
function findMinSlackEdge(t, g) {
  return lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](g.edges(), function (e) {
    if (t.hasNode(e.v) !== t.hasNode(e.w)) {
      return (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.slack)(g, e);
    }
  });
}

function shiftRanks(t, g, delta) {
  lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](t.nodes(), function (v) {
    g.node(v).rank += delta;
  });
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/rank/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/rank/index.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   rank: function() { return /* binding */ rank; }
/* harmony export */ });
/* harmony import */ var _feasible_tree_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./feasible-tree.js */ "./node_modules/dagre-d3-es/src/dagre/rank/feasible-tree.js");
/* harmony import */ var _network_simplex_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./network-simplex.js */ "./node_modules/dagre-d3-es/src/dagre/rank/network-simplex.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util.js */ "./node_modules/dagre-d3-es/src/dagre/rank/util.js");






/*
 * Assigns a rank to each node in the input graph that respects the "minlen"
 * constraint specified on edges between nodes.
 *
 * This basic structure is derived from Gansner, et al., "A Technique for
 * Drawing Directed Graphs."
 *
 * Pre-conditions:
 *
 *    1. Graph must be a connected DAG
 *    2. Graph nodes must be objects
 *    3. Graph edges must have "weight" and "minlen" attributes
 *
 * Post-conditions:
 *
 *    1. Graph nodes will have a "rank" attribute based on the results of the
 *       algorithm. Ranks can start at any index (including negative), we'll
 *       fix them up later.
 */
function rank(g) {
  switch (g.graph().ranker) {
    case 'network-simplex':
      networkSimplexRanker(g);
      break;
    case 'tight-tree':
      tightTreeRanker(g);
      break;
    case 'longest-path':
      longestPathRanker(g);
      break;
    default:
      networkSimplexRanker(g);
  }
}

// A fast and simple ranker, but results are far from optimal.
var longestPathRanker = _util_js__WEBPACK_IMPORTED_MODULE_2__.longestPath;

function tightTreeRanker(g) {
  (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.longestPath)(g);
  (0,_feasible_tree_js__WEBPACK_IMPORTED_MODULE_0__.feasibleTree)(g);
}

function networkSimplexRanker(g) {
  (0,_network_simplex_js__WEBPACK_IMPORTED_MODULE_1__.networkSimplex)(g);
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/rank/network-simplex.js":
/*!********************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/rank/network-simplex.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   networkSimplex: function() { return /* binding */ networkSimplex; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/find.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/filter.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/minBy.js");
/* harmony import */ var _graphlib_alg_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../graphlib/alg/index.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/index.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util.js */ "./node_modules/dagre-d3-es/src/dagre/util.js");
/* harmony import */ var _feasible_tree_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./feasible-tree.js */ "./node_modules/dagre-d3-es/src/dagre/rank/feasible-tree.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util.js */ "./node_modules/dagre-d3-es/src/dagre/rank/util.js");








// Expose some internals for testing purposes
networkSimplex.initLowLimValues = initLowLimValues;
networkSimplex.initCutValues = initCutValues;
networkSimplex.calcCutValue = calcCutValue;
networkSimplex.leaveEdge = leaveEdge;
networkSimplex.enterEdge = enterEdge;
networkSimplex.exchangeEdges = exchangeEdges;

/*
 * The network simplex algorithm assigns ranks to each node in the input graph
 * and iteratively improves the ranking to reduce the length of edges.
 *
 * Preconditions:
 *
 *    1. The input graph must be a DAG.
 *    2. All nodes in the graph must have an object value.
 *    3. All edges in the graph must have "minlen" and "weight" attributes.
 *
 * Postconditions:
 *
 *    1. All nodes in the graph will have an assigned "rank" attribute that has
 *       been optimized by the network simplex algorithm. Ranks start at 0.
 *
 *
 * A rough sketch of the algorithm is as follows:
 *
 *    1. Assign initial ranks to each node. We use the longest path algorithm,
 *       which assigns ranks to the lowest position possible. In general this
 *       leads to very wide bottom ranks and unnecessarily long edges.
 *    2. Construct a feasible tight tree. A tight tree is one such that all
 *       edges in the tree have no slack (difference between length of edge
 *       and minlen for the edge). This by itself greatly improves the assigned
 *       rankings by shorting edges.
 *    3. Iteratively find edges that have negative cut values. Generally a
 *       negative cut value indicates that the edge could be removed and a new
 *       tree edge could be added to produce a more compact graph.
 *
 * Much of the algorithms here are derived from Gansner, et al., "A Technique
 * for Drawing Directed Graphs." The structure of the file roughly follows the
 * structure of the overall algorithm.
 */
function networkSimplex(g) {
  g = (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.simplify)(g);
  (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.longestPath)(g);
  var t = (0,_feasible_tree_js__WEBPACK_IMPORTED_MODULE_2__.feasibleTree)(g);
  initLowLimValues(t);
  initCutValues(t, g);

  var e, f;
  while ((e = leaveEdge(t))) {
    f = enterEdge(t, g, e);
    exchangeEdges(t, g, e, f);
  }
}

/*
 * Initializes cut values for all edges in the tree.
 */
function initCutValues(t, g) {
  var vs = _graphlib_alg_index_js__WEBPACK_IMPORTED_MODULE_0__.postorder(t, t.nodes());
  vs = vs.slice(0, vs.length - 1);
  lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](vs, function (v) {
    assignCutValue(t, g, v);
  });
}

function assignCutValue(t, g, child) {
  var childLab = t.node(child);
  var parent = childLab.parent;
  t.edge(child, parent).cutvalue = calcCutValue(t, g, child);
}

/*
 * Given the tight tree, its graph, and a child in the graph calculate and
 * return the cut value for the edge between the child and its parent.
 */
function calcCutValue(t, g, child) {
  var childLab = t.node(child);
  var parent = childLab.parent;
  // True if the child is on the tail end of the edge in the directed graph
  var childIsTail = true;
  // The graph's view of the tree edge we're inspecting
  var graphEdge = g.edge(child, parent);
  // The accumulated cut value for the edge between this node and its parent
  var cutValue = 0;

  if (!graphEdge) {
    childIsTail = false;
    graphEdge = g.edge(parent, child);
  }

  cutValue = graphEdge.weight;

  lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](g.nodeEdges(child), function (e) {
    var isOutEdge = e.v === child,
      other = isOutEdge ? e.w : e.v;

    if (other !== parent) {
      var pointsToHead = isOutEdge === childIsTail,
        otherWeight = g.edge(e).weight;

      cutValue += pointsToHead ? otherWeight : -otherWeight;
      if (isTreeEdge(t, child, other)) {
        var otherCutValue = t.edge(child, other).cutvalue;
        cutValue += pointsToHead ? -otherCutValue : otherCutValue;
      }
    }
  });

  return cutValue;
}

function initLowLimValues(tree, root) {
  if (arguments.length < 2) {
    root = tree.nodes()[0];
  }
  dfsAssignLowLim(tree, {}, 1, root);
}

function dfsAssignLowLim(tree, visited, nextLim, v, parent) {
  var low = nextLim;
  var label = tree.node(v);

  visited[v] = true;
  lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](tree.neighbors(v), function (w) {
    if (!lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](visited, w)) {
      nextLim = dfsAssignLowLim(tree, visited, nextLim, w, v);
    }
  });

  label.low = low;
  label.lim = nextLim++;
  if (parent) {
    label.parent = parent;
  } else {
    // TODO should be able to remove this when we incrementally update low lim
    delete label.parent;
  }

  return nextLim;
}

function leaveEdge(tree) {
  return lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](tree.edges(), function (e) {
    return tree.edge(e).cutvalue < 0;
  });
}

function enterEdge(t, g, edge) {
  var v = edge.v;
  var w = edge.w;

  // For the rest of this function we assume that v is the tail and w is the
  // head, so if we don't have this edge in the graph we should flip it to
  // match the correct orientation.
  if (!g.hasEdge(v, w)) {
    v = edge.w;
    w = edge.v;
  }

  var vLabel = t.node(v);
  var wLabel = t.node(w);
  var tailLabel = vLabel;
  var flip = false;

  // If the root is in the tail of the edge then we need to flip the logic that
  // checks for the head and tail nodes in the candidates function below.
  if (vLabel.lim > wLabel.lim) {
    tailLabel = wLabel;
    flip = true;
  }

  var candidates = lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](g.edges(), function (edge) {
    return (
      flip === isDescendant(t, t.node(edge.v), tailLabel) &&
      flip !== isDescendant(t, t.node(edge.w), tailLabel)
    );
  });

  return lodash_es__WEBPACK_IMPORTED_MODULE_8__["default"](candidates, function (edge) {
    return (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.slack)(g, edge);
  });
}

function exchangeEdges(t, g, e, f) {
  var v = e.v;
  var w = e.w;
  t.removeEdge(v, w);
  t.setEdge(f.v, f.w, {});
  initLowLimValues(t);
  initCutValues(t, g);
  updateRanks(t, g);
}

function updateRanks(t, g) {
  var root = lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](t.nodes(), function (v) {
    return !g.node(v).parent;
  });
  var vs = _graphlib_alg_index_js__WEBPACK_IMPORTED_MODULE_0__.preorder(t, root);
  vs = vs.slice(1);
  lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](vs, function (v) {
    var parent = t.node(v).parent,
      edge = g.edge(v, parent),
      flipped = false;

    if (!edge) {
      edge = g.edge(parent, v);
      flipped = true;
    }

    g.node(v).rank = g.node(parent).rank + (flipped ? edge.minlen : -edge.minlen);
  });
}

/*
 * Returns true if the edge is in the tree.
 */
function isTreeEdge(tree, u, v) {
  return tree.hasEdge(u, v);
}

/*
 * Returns true if the specified node is descendant of the root node per the
 * assigned low and lim attributes in the tree.
 */
function isDescendant(tree, vLabel, rootLabel) {
  return rootLabel.low <= vLabel.lim && vLabel.lim <= rootLabel.lim;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/rank/util.js":
/*!*********************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/rank/util.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   longestPath: function() { return /* binding */ longestPath; },
/* harmony export */   slack: function() { return /* binding */ slack; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/min.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/map.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");




/*
 * Initializes ranks for the input graph using the longest path algorithm. This
 * algorithm scales well and is fast in practice, it yields rather poor
 * solutions. Nodes are pushed to the lowest layer possible, leaving the bottom
 * ranks wide and leaving edges longer than necessary. However, due to its
 * speed, this algorithm is good for getting an initial ranking that can be fed
 * into other algorithms.
 *
 * This algorithm does not normalize layers because it will be used by other
 * algorithms in most cases. If using this algorithm directly, be sure to
 * run normalize at the end.
 *
 * Pre-conditions:
 *
 *    1. Input graph is a DAG.
 *    2. Input graph node labels can be assigned properties.
 *
 * Post-conditions:
 *
 *    1. Each node will be assign an (unnormalized) "rank" property.
 */
function longestPath(g) {
  var visited = {};

  function dfs(v) {
    var label = g.node(v);
    if (lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](visited, v)) {
      return label.rank;
    }
    visited[v] = true;

    var rank = lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](
      lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](g.outEdges(v), function (e) {
        return dfs(e.w) - g.edge(e).minlen;
      })
    );

    if (
      rank === Number.POSITIVE_INFINITY || // return value of _.map([]) for Lodash 3
      rank === undefined || // return value of _.map([]) for Lodash 4
      rank === null
    ) {
      // return value of _.map([null])
      rank = 0;
    }

    return (label.rank = rank);
  }

  lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](g.sources(), dfs);
}

/*
 * Returns the amount of slack for the given edge. The slack is defined as the
 * difference between the length of the edge and its minimum length.
 */
function slack(g, e) {
  return g.node(e.w).rank - g.node(e.v).rank - g.edge(e).minlen;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre/util.js":
/*!****************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre/util.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addBorderNode: function() { return /* binding */ addBorderNode; },
/* harmony export */   addDummyNode: function() { return /* binding */ addDummyNode; },
/* harmony export */   asNonCompoundGraph: function() { return /* binding */ asNonCompoundGraph; },
/* harmony export */   buildLayerMatrix: function() { return /* binding */ buildLayerMatrix; },
/* harmony export */   intersectRect: function() { return /* binding */ intersectRect; },
/* harmony export */   maxRank: function() { return /* binding */ maxRank; },
/* harmony export */   normalizeRanks: function() { return /* binding */ normalizeRanks; },
/* harmony export */   notime: function() { return /* binding */ notime; },
/* harmony export */   partition: function() { return /* binding */ partition; },
/* harmony export */   predecessorWeights: function() { return /* binding */ predecessorWeights; },
/* harmony export */   removeEmptyRanks: function() { return /* binding */ removeEmptyRanks; },
/* harmony export */   simplify: function() { return /* binding */ simplify; },
/* harmony export */   successorWeights: function() { return /* binding */ successorWeights; },
/* harmony export */   time: function() { return /* binding */ time; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/uniqueId.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/map.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/zipObject.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/range.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/isUndefined.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/min.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/max.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/now.js");
/* harmony import */ var _graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../graphlib/index.js */ "./node_modules/dagre-d3-es/src/graphlib/index.js");





/*
 * Adds a dummy node to the graph and return v.
 */
function addDummyNode(g, type, attrs, name) {
  var v;
  do {
    v = lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](name);
  } while (g.hasNode(v));

  attrs.dummy = type;
  g.setNode(v, attrs);
  return v;
}

/*
 * Returns a new graph with only simple edges. Handles aggregation of data
 * associated with multi-edges.
 */
function simplify(g) {
  var simplified = new _graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__.Graph().setGraph(g.graph());
  lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](g.nodes(), function (v) {
    simplified.setNode(v, g.node(v));
  });
  lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](g.edges(), function (e) {
    var simpleLabel = simplified.edge(e.v, e.w) || { weight: 0, minlen: 1 };
    var label = g.edge(e);
    simplified.setEdge(e.v, e.w, {
      weight: simpleLabel.weight + label.weight,
      minlen: Math.max(simpleLabel.minlen, label.minlen),
    });
  });
  return simplified;
}

function asNonCompoundGraph(g) {
  var simplified = new _graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__.Graph({ multigraph: g.isMultigraph() }).setGraph(g.graph());
  lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](g.nodes(), function (v) {
    if (!g.children(v).length) {
      simplified.setNode(v, g.node(v));
    }
  });
  lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](g.edges(), function (e) {
    simplified.setEdge(e, g.edge(e));
  });
  return simplified;
}

function successorWeights(g) {
  var weightMap = lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](g.nodes(), function (v) {
    var sucs = {};
    lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](g.outEdges(v), function (e) {
      sucs[e.w] = (sucs[e.w] || 0) + g.edge(e).weight;
    });
    return sucs;
  });
  return lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](g.nodes(), weightMap);
}

function predecessorWeights(g) {
  var weightMap = lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](g.nodes(), function (v) {
    var preds = {};
    lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](g.inEdges(v), function (e) {
      preds[e.v] = (preds[e.v] || 0) + g.edge(e).weight;
    });
    return preds;
  });
  return lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](g.nodes(), weightMap);
}

/*
 * Finds where a line starting at point ({x, y}) would intersect a rectangle
 * ({x, y, width, height}) if it were pointing at the rectangle's center.
 */
function intersectRect(rect, point) {
  var x = rect.x;
  var y = rect.y;

  // Rectangle intersection algorithm from:
  // http://math.stackexchange.com/questions/108113/find-edge-between-two-boxes
  var dx = point.x - x;
  var dy = point.y - y;
  var w = rect.width / 2;
  var h = rect.height / 2;

  if (!dx && !dy) {
    throw new Error('Not possible to find intersection inside of the rectangle');
  }

  var sx, sy;
  if (Math.abs(dy) * w > Math.abs(dx) * h) {
    // Intersection is top or bottom of rect.
    if (dy < 0) {
      h = -h;
    }
    sx = (h * dx) / dy;
    sy = h;
  } else {
    // Intersection is left or right of rect.
    if (dx < 0) {
      w = -w;
    }
    sx = w;
    sy = (w * dy) / dx;
  }

  return { x: x + sx, y: y + sy };
}

/*
 * Given a DAG with each node assigned "rank" and "order" properties, this
 * function will produce a matrix with the ids of each node.
 */
function buildLayerMatrix(g) {
  var layering = lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](maxRank(g) + 1), function () {
    return [];
  });
  lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](g.nodes(), function (v) {
    var node = g.node(v);
    var rank = node.rank;
    if (!lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](rank)) {
      layering[rank][node.order] = v;
    }
  });
  return layering;
}

/*
 * Adjusts the ranks for all nodes in the graph such that all nodes v have
 * rank(v) >= 0 and at least one node w has rank(w) = 0.
 */
function normalizeRanks(g) {
  var min = lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](
    lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](g.nodes(), function (v) {
      return g.node(v).rank;
    })
  );
  lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](g.nodes(), function (v) {
    var node = g.node(v);
    if (lodash_es__WEBPACK_IMPORTED_MODULE_8__["default"](node, 'rank')) {
      node.rank -= min;
    }
  });
}

function removeEmptyRanks(g) {
  // Ranks may not start at 0, so we need to offset them
  var offset = lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](
    lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](g.nodes(), function (v) {
      return g.node(v).rank;
    })
  );

  var layers = [];
  lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](g.nodes(), function (v) {
    var rank = g.node(v).rank - offset;
    if (!layers[rank]) {
      layers[rank] = [];
    }
    layers[rank].push(v);
  });

  var delta = 0;
  var nodeRankFactor = g.graph().nodeRankFactor;
  lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](layers, function (vs, i) {
    if (lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](vs) && i % nodeRankFactor !== 0) {
      --delta;
    } else if (delta) {
      lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](vs, function (v) {
        g.node(v).rank += delta;
      });
    }
  });
}

function addBorderNode(g, prefix, rank, order) {
  var node = {
    width: 0,
    height: 0,
  };
  if (arguments.length >= 4) {
    node.rank = rank;
    node.order = order;
  }
  return addDummyNode(g, 'border', node, prefix);
}

function maxRank(g) {
  return lodash_es__WEBPACK_IMPORTED_MODULE_9__["default"](
    lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](g.nodes(), function (v) {
      var rank = g.node(v).rank;
      if (!lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](rank)) {
        return rank;
      }
    })
  );
}

/*
 * Partition a collection into two groups: `lhs` and `rhs`. If the supplied
 * function returns true for an entry it goes into `lhs`. Otherwise it goes
 * into `rhs.
 */
function partition(collection, fn) {
  var result = { lhs: [], rhs: [] };
  lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](collection, function (value) {
    if (fn(value)) {
      result.lhs.push(value);
    } else {
      result.rhs.push(value);
    }
  });
  return result;
}

/*
 * Returns a new function that wraps `fn` with a timer. The wrapper logs the
 * time it takes to execute the function.
 */
function time(name, fn) {
  var start = lodash_es__WEBPACK_IMPORTED_MODULE_10__["default"]();
  try {
    return fn();
  } finally {
    console.log(name + ' time: ' + (lodash_es__WEBPACK_IMPORTED_MODULE_10__["default"]() - start) + 'ms');
  }
}

function notime(name, fn) {
  return fn();
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/alg/components.js":
/*!*****************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/alg/components.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: function() { return /* binding */ components; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");




function components(g) {
  var visited = {};
  var cmpts = [];
  var cmpt;

  function dfs(v) {
    if (lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](visited, v)) return;
    visited[v] = true;
    cmpt.push(v);
    lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](g.successors(v), dfs);
    lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](g.predecessors(v), dfs);
  }

  lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](g.nodes(), function (v) {
    cmpt = [];
    dfs(v);
    if (cmpt.length) {
      cmpts.push(cmpt);
    }
  });

  return cmpts;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/alg/dfs.js":
/*!**********************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/alg/dfs.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dfs: function() { return /* binding */ dfs; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/isArray.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");




/*
 * A helper that preforms a pre- or post-order traversal on the input graph
 * and returns the nodes in the order they were visited. If the graph is
 * undirected then this algorithm will navigate using neighbors. If the graph
 * is directed then this algorithm will navigate using successors.
 *
 * Order must be one of "pre" or "post".
 */
function dfs(g, vs, order) {
  if (!lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](vs)) {
    vs = [vs];
  }

  var navigation = (g.isDirected() ? g.successors : g.neighbors).bind(g);

  var acc = [];
  var visited = {};
  lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](vs, function (v) {
    if (!g.hasNode(v)) {
      throw new Error('Graph does not have node: ' + v);
    }

    doDfs(g, v, order === 'post', visited, navigation, acc);
  });
  return acc;
}

function doDfs(g, v, postorder, visited, navigation, acc) {
  if (!lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](visited, v)) {
    visited[v] = true;

    if (!postorder) {
      acc.push(v);
    }
    lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](navigation(v), function (w) {
      doDfs(g, w, postorder, visited, navigation, acc);
    });
    if (postorder) {
      acc.push(v);
    }
  }
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/alg/dijkstra-all.js":
/*!*******************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/alg/dijkstra-all.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dijkstraAll: function() { return /* binding */ dijkstraAll; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/transform.js");
/* harmony import */ var _dijkstra_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dijkstra.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/dijkstra.js");





function dijkstraAll(g, weightFunc, edgeFunc) {
  return lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](
    g.nodes(),
    function (acc, v) {
      acc[v] = (0,_dijkstra_js__WEBPACK_IMPORTED_MODULE_0__.dijkstra)(g, v, weightFunc, edgeFunc);
    },
    {}
  );
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/alg/dijkstra.js":
/*!***************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/alg/dijkstra.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dijkstra: function() { return /* binding */ dijkstra; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/constant.js");
/* harmony import */ var _data_priority_queue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data/priority-queue.js */ "./node_modules/dagre-d3-es/src/graphlib/data/priority-queue.js");





var DEFAULT_WEIGHT_FUNC = lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](1);

function dijkstra(g, source, weightFn, edgeFn) {
  return runDijkstra(
    g,
    String(source),
    weightFn || DEFAULT_WEIGHT_FUNC,
    edgeFn ||
      function (v) {
        return g.outEdges(v);
      }
  );
}

function runDijkstra(g, source, weightFn, edgeFn) {
  var results = {};
  var pq = new _data_priority_queue_js__WEBPACK_IMPORTED_MODULE_0__.PriorityQueue();
  var v, vEntry;

  var updateNeighbors = function (edge) {
    var w = edge.v !== v ? edge.v : edge.w;
    var wEntry = results[w];
    var weight = weightFn(edge);
    var distance = vEntry.distance + weight;

    if (weight < 0) {
      throw new Error(
        'dijkstra does not allow negative edge weights. ' +
          'Bad edge: ' +
          edge +
          ' Weight: ' +
          weight
      );
    }

    if (distance < wEntry.distance) {
      wEntry.distance = distance;
      wEntry.predecessor = v;
      pq.decrease(w, distance);
    }
  };

  g.nodes().forEach(function (v) {
    var distance = v === source ? 0 : Number.POSITIVE_INFINITY;
    results[v] = { distance: distance };
    pq.add(v, distance);
  });

  while (pq.size() > 0) {
    v = pq.removeMin();
    vEntry = results[v];
    if (vEntry.distance === Number.POSITIVE_INFINITY) {
      break;
    }

    edgeFn(v).forEach(updateNeighbors);
  }

  return results;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/alg/find-cycles.js":
/*!******************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/alg/find-cycles.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   findCycles: function() { return /* binding */ findCycles; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/filter.js");
/* harmony import */ var _tarjan_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tarjan.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/tarjan.js");





function findCycles(g) {
  return lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"]((0,_tarjan_js__WEBPACK_IMPORTED_MODULE_0__.tarjan)(g), function (cmpt) {
    return cmpt.length > 1 || (cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]));
  });
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/alg/floyd-warshall.js":
/*!*********************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/alg/floyd-warshall.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   floydWarshall: function() { return /* binding */ floydWarshall; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/constant.js");




var DEFAULT_WEIGHT_FUNC = lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](1);

function floydWarshall(g, weightFn, edgeFn) {
  return runFloydWarshall(
    g,
    weightFn || DEFAULT_WEIGHT_FUNC,
    edgeFn ||
      function (v) {
        return g.outEdges(v);
      }
  );
}

function runFloydWarshall(g, weightFn, edgeFn) {
  var results = {};
  var nodes = g.nodes();

  nodes.forEach(function (v) {
    results[v] = {};
    results[v][v] = { distance: 0 };
    nodes.forEach(function (w) {
      if (v !== w) {
        results[v][w] = { distance: Number.POSITIVE_INFINITY };
      }
    });
    edgeFn(v).forEach(function (edge) {
      var w = edge.v === v ? edge.w : edge.v;
      var d = weightFn(edge);
      results[v][w] = { distance: d, predecessor: v };
    });
  });

  nodes.forEach(function (k) {
    var rowK = results[k];
    nodes.forEach(function (i) {
      var rowI = results[i];
      nodes.forEach(function (j) {
        var ik = rowI[k];
        var kj = rowK[j];
        var ij = rowI[j];
        var altDistance = ik.distance + kj.distance;
        if (altDistance < ij.distance) {
          ij.distance = altDistance;
          ij.predecessor = kj.predecessor;
        }
      });
    });
  });

  return results;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/alg/index.js":
/*!************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/alg/index.js ***!
  \************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: function() { return /* reexport safe */ _components_js__WEBPACK_IMPORTED_MODULE_0__.components; },
/* harmony export */   dijkstra: function() { return /* reexport safe */ _dijkstra_js__WEBPACK_IMPORTED_MODULE_1__.dijkstra; },
/* harmony export */   dijkstraAll: function() { return /* reexport safe */ _dijkstra_all_js__WEBPACK_IMPORTED_MODULE_2__.dijkstraAll; },
/* harmony export */   findCycles: function() { return /* reexport safe */ _find_cycles_js__WEBPACK_IMPORTED_MODULE_3__.findCycles; },
/* harmony export */   floydWarshall: function() { return /* reexport safe */ _floyd_warshall_js__WEBPACK_IMPORTED_MODULE_4__.floydWarshall; },
/* harmony export */   isAcyclic: function() { return /* reexport safe */ _is_acyclic_js__WEBPACK_IMPORTED_MODULE_5__.isAcyclic; },
/* harmony export */   postorder: function() { return /* reexport safe */ _postorder_js__WEBPACK_IMPORTED_MODULE_6__.postorder; },
/* harmony export */   preorder: function() { return /* reexport safe */ _preorder_js__WEBPACK_IMPORTED_MODULE_7__.preorder; },
/* harmony export */   prim: function() { return /* reexport safe */ _prim_js__WEBPACK_IMPORTED_MODULE_8__.prim; },
/* harmony export */   tarjan: function() { return /* reexport safe */ _tarjan_js__WEBPACK_IMPORTED_MODULE_9__.tarjan; },
/* harmony export */   topsort: function() { return /* reexport safe */ _topsort_js__WEBPACK_IMPORTED_MODULE_10__.topsort; }
/* harmony export */ });
/* harmony import */ var _components_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/components.js");
/* harmony import */ var _dijkstra_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dijkstra.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/dijkstra.js");
/* harmony import */ var _dijkstra_all_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dijkstra-all.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/dijkstra-all.js");
/* harmony import */ var _find_cycles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./find-cycles.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/find-cycles.js");
/* harmony import */ var _floyd_warshall_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./floyd-warshall.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/floyd-warshall.js");
/* harmony import */ var _is_acyclic_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./is-acyclic.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/is-acyclic.js");
/* harmony import */ var _postorder_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./postorder.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/postorder.js");
/* harmony import */ var _preorder_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./preorder.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/preorder.js");
/* harmony import */ var _prim_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./prim.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/prim.js");
/* harmony import */ var _tarjan_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./tarjan.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/tarjan.js");
/* harmony import */ var _topsort_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./topsort.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/topsort.js");















/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/alg/is-acyclic.js":
/*!*****************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/alg/is-acyclic.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isAcyclic: function() { return /* binding */ isAcyclic; }
/* harmony export */ });
/* harmony import */ var _topsort_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./topsort.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/topsort.js");




function isAcyclic(g) {
  try {
    (0,_topsort_js__WEBPACK_IMPORTED_MODULE_0__.topsort)(g);
  } catch (e) {
    if (e instanceof _topsort_js__WEBPACK_IMPORTED_MODULE_0__.CycleException) {
      return false;
    }
    throw e;
  }
  return true;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/alg/postorder.js":
/*!****************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/alg/postorder.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   postorder: function() { return /* binding */ postorder; }
/* harmony export */ });
/* harmony import */ var _dfs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dfs.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/dfs.js");




function postorder(g, vs) {
  return (0,_dfs_js__WEBPACK_IMPORTED_MODULE_0__.dfs)(g, vs, 'post');
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/alg/preorder.js":
/*!***************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/alg/preorder.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   preorder: function() { return /* binding */ preorder; }
/* harmony export */ });
/* harmony import */ var _dfs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dfs.js */ "./node_modules/dagre-d3-es/src/graphlib/alg/dfs.js");




function preorder(g, vs) {
  return (0,_dfs_js__WEBPACK_IMPORTED_MODULE_0__.dfs)(g, vs, 'pre');
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/alg/prim.js":
/*!***********************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/alg/prim.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prim: function() { return /* binding */ prim; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");
/* harmony import */ var _data_priority_queue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data/priority-queue.js */ "./node_modules/dagre-d3-es/src/graphlib/data/priority-queue.js");
/* harmony import */ var _graph_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../graph.js */ "./node_modules/dagre-d3-es/src/graphlib/graph.js");






function prim(g, weightFunc) {
  var result = new _graph_js__WEBPACK_IMPORTED_MODULE_1__.Graph();
  var parents = {};
  var pq = new _data_priority_queue_js__WEBPACK_IMPORTED_MODULE_0__.PriorityQueue();
  var v;

  function updateNeighbors(edge) {
    var w = edge.v === v ? edge.w : edge.v;
    var pri = pq.priority(w);
    if (pri !== undefined) {
      var edgeWeight = weightFunc(edge);
      if (edgeWeight < pri) {
        parents[w] = v;
        pq.decrease(w, edgeWeight);
      }
    }
  }

  if (g.nodeCount() === 0) {
    return result;
  }

  lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](g.nodes(), function (v) {
    pq.add(v, Number.POSITIVE_INFINITY);
    result.setNode(v);
  });

  // Start from an arbitrary node
  pq.decrease(g.nodes()[0], 0);

  var init = false;
  while (pq.size() > 0) {
    v = pq.removeMin();
    if (lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](parents, v)) {
      result.setEdge(v, parents[v]);
    } else if (init) {
      throw new Error('Input graph is not connected: ' + g);
    } else {
      init = true;
    }

    g.nodeEdges(v).forEach(updateNeighbors);
  }

  return result;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/alg/tarjan.js":
/*!*************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/alg/tarjan.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tarjan: function() { return /* binding */ tarjan; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");




function tarjan(g) {
  var index = 0;
  var stack = [];
  var visited = {}; // node id -> { onStack, lowlink, index }
  var results = [];

  function dfs(v) {
    var entry = (visited[v] = {
      onStack: true,
      lowlink: index,
      index: index++,
    });
    stack.push(v);

    g.successors(v).forEach(function (w) {
      if (!lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](visited, w)) {
        dfs(w);
        entry.lowlink = Math.min(entry.lowlink, visited[w].lowlink);
      } else if (visited[w].onStack) {
        entry.lowlink = Math.min(entry.lowlink, visited[w].index);
      }
    });

    if (entry.lowlink === entry.index) {
      var cmpt = [];
      var w;
      do {
        w = stack.pop();
        visited[w].onStack = false;
        cmpt.push(w);
      } while (v !== w);
      results.push(cmpt);
    }
  }

  g.nodes().forEach(function (v) {
    if (!lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](visited, v)) {
      dfs(v);
    }
  });

  return results;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/alg/topsort.js":
/*!**************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/alg/topsort.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CycleException: function() { return /* binding */ CycleException; },
/* harmony export */   topsort: function() { return /* binding */ topsort; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/size.js");




topsort.CycleException = CycleException;

function topsort(g) {
  var visited = {};
  var stack = {};
  var results = [];

  function visit(node) {
    if (lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](stack, node)) {
      throw new CycleException();
    }

    if (!lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](visited, node)) {
      stack[node] = true;
      visited[node] = true;
      lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](g.predecessors(node), visit);
      delete stack[node];
      results.push(node);
    }
  }

  lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](g.sinks(), visit);

  if (lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](visited) !== g.nodeCount()) {
    throw new CycleException();
  }

  return results;
}

function CycleException() {}
CycleException.prototype = new Error(); // must be an instance of Error to pass testing


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/data/priority-queue.js":
/*!**********************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/data/priority-queue.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PriorityQueue: function() { return /* binding */ PriorityQueue; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");




/**
 * A min-priority queue data structure. This algorithm is derived from Cormen,
 * et al., "Introduction to Algorithms". The basic idea of a min-priority
 * queue is that you can efficiently (in O(1) time) get the smallest key in
 * the queue. Adding and removing elements takes O(log n) time. A key can
 * have its priority decreased in O(log n) time.
 */
class PriorityQueue {
  constructor() {
    this._arr = [];
    this._keyIndices = {};
  }
  /**
   * Returns the number of elements in the queue. Takes `O(1)` time.
   */
  size() {
    return this._arr.length;
  }
  /**
   * Returns the keys that are in the queue. Takes `O(n)` time.
   */
  keys() {
    return this._arr.map(function (x) {
      return x.key;
    });
  }
  /**
   * Returns `true` if **key** is in the queue and `false` if not.
   */
  has(key) {
    return lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](this._keyIndices, key);
  }
  /**
   * Returns the priority for **key**. If **key** is not present in the queue
   * then this function returns `undefined`. Takes `O(1)` time.
   *
   * @param {Object} key
   */
  priority(key) {
    var index = this._keyIndices[key];
    if (index !== undefined) {
      return this._arr[index].priority;
    }
  }
  /**
   * Returns the key for the minimum element in this queue. If the queue is
   * empty this function throws an Error. Takes `O(1)` time.
   */
  min() {
    if (this.size() === 0) {
      throw new Error('Queue underflow');
    }
    return this._arr[0].key;
  }
  /**
   * Inserts a new key into the priority queue. If the key already exists in
   * the queue this function returns `false`; otherwise it will return `true`.
   * Takes `O(n)` time.
   *
   * @param {Object} key the key to add
   * @param {Number} priority the initial priority for the key
   */
  add(key, priority) {
    var keyIndices = this._keyIndices;
    key = String(key);
    if (!lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](keyIndices, key)) {
      var arr = this._arr;
      var index = arr.length;
      keyIndices[key] = index;
      arr.push({ key: key, priority: priority });
      this._decrease(index);
      return true;
    }
    return false;
  }
  /**
   * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
   */
  removeMin() {
    this._swap(0, this._arr.length - 1);
    var min = this._arr.pop();
    delete this._keyIndices[min.key];
    this._heapify(0);
    return min.key;
  }
  /**
   * Decreases the priority for **key** to **priority**. If the new priority is
   * greater than the previous priority, this function will throw an Error.
   *
   * @param {Object} key the key for which to raise priority
   * @param {Number} priority the new priority for the key
   */
  decrease(key, priority) {
    var index = this._keyIndices[key];
    if (priority > this._arr[index].priority) {
      throw new Error(
        'New priority is greater than current priority. ' +
          'Key: ' +
          key +
          ' Old: ' +
          this._arr[index].priority +
          ' New: ' +
          priority
      );
    }
    this._arr[index].priority = priority;
    this._decrease(index);
  }
  _heapify(i) {
    var arr = this._arr;
    var l = 2 * i;
    var r = l + 1;
    var largest = i;
    if (l < arr.length) {
      largest = arr[l].priority < arr[largest].priority ? l : largest;
      if (r < arr.length) {
        largest = arr[r].priority < arr[largest].priority ? r : largest;
      }
      if (largest !== i) {
        this._swap(i, largest);
        this._heapify(largest);
      }
    }
  }
  _decrease(index) {
    var arr = this._arr;
    var priority = arr[index].priority;
    var parent;
    while (index !== 0) {
      parent = index >> 1;
      if (arr[parent].priority < priority) {
        break;
      }
      this._swap(index, parent);
      index = parent;
    }
  }
  _swap(i, j) {
    var arr = this._arr;
    var keyIndices = this._keyIndices;
    var origArrI = arr[i];
    var origArrJ = arr[j];
    arr[i] = origArrJ;
    arr[j] = origArrI;
    keyIndices[origArrJ.key] = i;
    keyIndices[origArrI.key] = j;
  }
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/graph.js":
/*!********************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/graph.js ***!
  \********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Graph: function() { return /* binding */ Graph; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/has.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/constant.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/isFunction.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/keys.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/filter.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/isEmpty.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/isUndefined.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/union.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/values.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/reduce.js");


var DEFAULT_EDGE_NAME = '\x00';
var GRAPH_NODE = '\x00';
var EDGE_KEY_DELIM = '\x01';

// Implementation notes:
//
//  * Node id query functions should return string ids for the nodes
//  * Edge id query functions should return an "edgeObj", edge object, that is
//    composed of enough information to uniquely identify an edge: {v, w, name}.
//  * Internally we use an "edgeId", a stringified form of the edgeObj, to
//    reference edges. This is because we need a performant way to look these
//    edges up and, object properties, which have string keys, are the closest
//    we're going to get to a performant hashtable in JavaScript.

// Implementation notes:
//
//  * Node id query functions should return string ids for the nodes
//  * Edge id query functions should return an "edgeObj", edge object, that is
//    composed of enough information to uniquely identify an edge: {v, w, name}.
//  * Internally we use an "edgeId", a stringified form of the edgeObj, to
//    reference edges. This is because we need a performant way to look these
//    edges up and, object properties, which have string keys, are the closest
//    we're going to get to a performant hashtable in JavaScript.
class Graph {
  constructor(opts = {}) {
    this._isDirected = lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](opts, 'directed') ? opts.directed : true;
    this._isMultigraph = lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](opts, 'multigraph') ? opts.multigraph : false;
    this._isCompound = lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](opts, 'compound') ? opts.compound : false;

    // Label for the graph itself
    this._label = undefined;

    // Defaults to be set when creating a new node
    this._defaultNodeLabelFn = lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](undefined);

    // Defaults to be set when creating a new edge
    this._defaultEdgeLabelFn = lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](undefined);

    // v -> label
    this._nodes = {};

    if (this._isCompound) {
      // v -> parent
      this._parent = {};

      // v -> children
      this._children = {};
      this._children[GRAPH_NODE] = {};
    }

    // v -> edgeObj
    this._in = {};

    // u -> v -> Number
    this._preds = {};

    // v -> edgeObj
    this._out = {};

    // v -> w -> Number
    this._sucs = {};

    // e -> edgeObj
    this._edgeObjs = {};

    // e -> label
    this._edgeLabels = {};
  }
  /* === Graph functions ========= */
  isDirected() {
    return this._isDirected;
  }
  isMultigraph() {
    return this._isMultigraph;
  }
  isCompound() {
    return this._isCompound;
  }
  setGraph(label) {
    this._label = label;
    return this;
  }
  graph() {
    return this._label;
  }
  /* === Node functions ========== */
  setDefaultNodeLabel(newDefault) {
    if (!lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](newDefault)) {
      newDefault = lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](newDefault);
    }
    this._defaultNodeLabelFn = newDefault;
    return this;
  }
  nodeCount() {
    return this._nodeCount;
  }
  nodes() {
    return lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](this._nodes);
  }
  sources() {
    var self = this;
    return lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](this.nodes(), function (v) {
      return lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](self._in[v]);
    });
  }
  sinks() {
    var self = this;
    return lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](this.nodes(), function (v) {
      return lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](self._out[v]);
    });
  }
  setNodes(vs, value) {
    var args = arguments;
    var self = this;
    lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](vs, function (v) {
      if (args.length > 1) {
        self.setNode(v, value);
      } else {
        self.setNode(v);
      }
    });
    return this;
  }
  setNode(v, value) {
    if (lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](this._nodes, v)) {
      if (arguments.length > 1) {
        this._nodes[v] = value;
      }
      return this;
    }

    // @ts-expect-error
    this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v);
    if (this._isCompound) {
      this._parent[v] = GRAPH_NODE;
      this._children[v] = {};
      this._children[GRAPH_NODE][v] = true;
    }
    this._in[v] = {};
    this._preds[v] = {};
    this._out[v] = {};
    this._sucs[v] = {};
    ++this._nodeCount;
    return this;
  }
  node(v) {
    return this._nodes[v];
  }
  hasNode(v) {
    return lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](this._nodes, v);
  }
  removeNode(v) {
    var self = this;
    if (lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](this._nodes, v)) {
      var removeEdge = function (e) {
        self.removeEdge(self._edgeObjs[e]);
      };
      delete this._nodes[v];
      if (this._isCompound) {
        this._removeFromParentsChildList(v);
        delete this._parent[v];
        lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](this.children(v), function (child) {
          self.setParent(child);
        });
        delete this._children[v];
      }
      lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](this._in[v]), removeEdge);
      delete this._in[v];
      delete this._preds[v];
      lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](this._out[v]), removeEdge);
      delete this._out[v];
      delete this._sucs[v];
      --this._nodeCount;
    }
    return this;
  }
  setParent(v, parent) {
    if (!this._isCompound) {
      throw new Error('Cannot set parent in a non-compound graph');
    }

    if (lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](parent)) {
      parent = GRAPH_NODE;
    } else {
      // Coerce parent to string
      parent += '';
      for (var ancestor = parent; !lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](ancestor); ancestor = this.parent(ancestor)) {
        if (ancestor === v) {
          throw new Error('Setting ' + parent + ' as parent of ' + v + ' would create a cycle');
        }
      }

      this.setNode(parent);
    }

    this.setNode(v);
    this._removeFromParentsChildList(v);
    this._parent[v] = parent;
    this._children[parent][v] = true;
    return this;
  }
  _removeFromParentsChildList(v) {
    delete this._children[this._parent[v]][v];
  }
  parent(v) {
    if (this._isCompound) {
      var parent = this._parent[v];
      if (parent !== GRAPH_NODE) {
        return parent;
      }
    }
  }
  children(v) {
    if (lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](v)) {
      v = GRAPH_NODE;
    }

    if (this._isCompound) {
      var children = this._children[v];
      if (children) {
        return lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](children);
      }
    } else if (v === GRAPH_NODE) {
      return this.nodes();
    } else if (this.hasNode(v)) {
      return [];
    }
  }
  predecessors(v) {
    var predsV = this._preds[v];
    if (predsV) {
      return lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](predsV);
    }
  }
  successors(v) {
    var sucsV = this._sucs[v];
    if (sucsV) {
      return lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](sucsV);
    }
  }
  neighbors(v) {
    var preds = this.predecessors(v);
    if (preds) {
      return lodash_es__WEBPACK_IMPORTED_MODULE_8__["default"](preds, this.successors(v));
    }
  }
  isLeaf(v) {
    var neighbors;
    if (this.isDirected()) {
      neighbors = this.successors(v);
    } else {
      neighbors = this.neighbors(v);
    }
    return neighbors.length === 0;
  }
  filterNodes(filter) {
    // @ts-expect-error
    var copy = new this.constructor({
      directed: this._isDirected,
      multigraph: this._isMultigraph,
      compound: this._isCompound,
    });

    copy.setGraph(this.graph());

    var self = this;
    lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](this._nodes, function (value, v) {
      if (filter(v)) {
        copy.setNode(v, value);
      }
    });

    lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](this._edgeObjs, function (e) {
      // @ts-expect-error
      if (copy.hasNode(e.v) && copy.hasNode(e.w)) {
        copy.setEdge(e, self.edge(e));
      }
    });

    var parents = {};
    function findParent(v) {
      var parent = self.parent(v);
      if (parent === undefined || copy.hasNode(parent)) {
        parents[v] = parent;
        return parent;
      } else if (parent in parents) {
        return parents[parent];
      } else {
        return findParent(parent);
      }
    }

    if (this._isCompound) {
      lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](copy.nodes(), function (v) {
        copy.setParent(v, findParent(v));
      });
    }

    return copy;
  }
  /* === Edge functions ========== */
  setDefaultEdgeLabel(newDefault) {
    if (!lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](newDefault)) {
      newDefault = lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](newDefault);
    }
    this._defaultEdgeLabelFn = newDefault;
    return this;
  }
  edgeCount() {
    return this._edgeCount;
  }
  edges() {
    return lodash_es__WEBPACK_IMPORTED_MODULE_9__["default"](this._edgeObjs);
  }
  setPath(vs, value) {
    var self = this;
    var args = arguments;
    lodash_es__WEBPACK_IMPORTED_MODULE_10__["default"](vs, function (v, w) {
      if (args.length > 1) {
        self.setEdge(v, w, value);
      } else {
        self.setEdge(v, w);
      }
      return w;
    });
    return this;
  }
  /*
   * setEdge(v, w, [value, [name]])
   * setEdge({ v, w, [name] }, [value])
   */
  setEdge() {
    var v, w, name, value;
    var valueSpecified = false;
    var arg0 = arguments[0];

    if (typeof arg0 === 'object' && arg0 !== null && 'v' in arg0) {
      v = arg0.v;
      w = arg0.w;
      name = arg0.name;
      if (arguments.length === 2) {
        value = arguments[1];
        valueSpecified = true;
      }
    } else {
      v = arg0;
      w = arguments[1];
      name = arguments[3];
      if (arguments.length > 2) {
        value = arguments[2];
        valueSpecified = true;
      }
    }

    v = '' + v;
    w = '' + w;
    if (!lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](name)) {
      name = '' + name;
    }

    var e = edgeArgsToId(this._isDirected, v, w, name);
    if (lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](this._edgeLabels, e)) {
      if (valueSpecified) {
        this._edgeLabels[e] = value;
      }
      return this;
    }

    if (!lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](name) && !this._isMultigraph) {
      throw new Error('Cannot set a named edge when isMultigraph = false');
    }

    // It didn't exist, so we need to create it.
    // First ensure the nodes exist.
    this.setNode(v);
    this.setNode(w);

    // @ts-expect-error
    this._edgeLabels[e] = valueSpecified ? value : this._defaultEdgeLabelFn(v, w, name);

    var edgeObj = edgeArgsToObj(this._isDirected, v, w, name);
    // Ensure we add undirected edges in a consistent way.
    v = edgeObj.v;
    w = edgeObj.w;

    Object.freeze(edgeObj);
    this._edgeObjs[e] = edgeObj;
    incrementOrInitEntry(this._preds[w], v);
    incrementOrInitEntry(this._sucs[v], w);
    this._in[w][e] = edgeObj;
    this._out[v][e] = edgeObj;
    this._edgeCount++;
    return this;
  }
  edge(v, w, name) {
    var e =
      arguments.length === 1
        ? edgeObjToId(this._isDirected, arguments[0])
        : edgeArgsToId(this._isDirected, v, w, name);
    return this._edgeLabels[e];
  }
  hasEdge(v, w, name) {
    var e =
      arguments.length === 1
        ? edgeObjToId(this._isDirected, arguments[0])
        : edgeArgsToId(this._isDirected, v, w, name);
    return lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](this._edgeLabels, e);
  }
  removeEdge(v, w, name) {
    var e =
      arguments.length === 1
        ? edgeObjToId(this._isDirected, arguments[0])
        : edgeArgsToId(this._isDirected, v, w, name);
    var edge = this._edgeObjs[e];
    if (edge) {
      v = edge.v;
      w = edge.w;
      delete this._edgeLabels[e];
      delete this._edgeObjs[e];
      decrementOrRemoveEntry(this._preds[w], v);
      decrementOrRemoveEntry(this._sucs[v], w);
      delete this._in[w][e];
      delete this._out[v][e];
      this._edgeCount--;
    }
    return this;
  }
  inEdges(v, u) {
    var inV = this._in[v];
    if (inV) {
      var edges = lodash_es__WEBPACK_IMPORTED_MODULE_9__["default"](inV);
      if (!u) {
        return edges;
      }
      return lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](edges, function (edge) {
        return edge.v === u;
      });
    }
  }
  outEdges(v, w) {
    var outV = this._out[v];
    if (outV) {
      var edges = lodash_es__WEBPACK_IMPORTED_MODULE_9__["default"](outV);
      if (!w) {
        return edges;
      }
      return lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](edges, function (edge) {
        return edge.w === w;
      });
    }
  }
  nodeEdges(v, w) {
    var inEdges = this.inEdges(v, w);
    if (inEdges) {
      return inEdges.concat(this.outEdges(v, w));
    }
  }
}

/* Number of nodes in the graph. Should only be changed by the implementation. */
Graph.prototype._nodeCount = 0;

/* Number of edges in the graph. Should only be changed by the implementation. */
Graph.prototype._edgeCount = 0;

function incrementOrInitEntry(map, k) {
  if (map[k]) {
    map[k]++;
  } else {
    map[k] = 1;
  }
}

function decrementOrRemoveEntry(map, k) {
  if (!--map[k]) {
    delete map[k];
  }
}

function edgeArgsToId(isDirected, v_, w_, name) {
  var v = '' + v_;
  var w = '' + w_;
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM + (lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](name) ? DEFAULT_EDGE_NAME : name);
}

function edgeArgsToObj(isDirected, v_, w_, name) {
  var v = '' + v_;
  var w = '' + w_;
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  var edgeObj = { v: v, w: w };
  if (name) {
    edgeObj.name = name;
  }
  return edgeObj;
}

function edgeObjToId(isDirected, edgeObj) {
  return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/index.js":
/*!********************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/index.js ***!
  \********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Graph: function() { return /* reexport safe */ _graph_js__WEBPACK_IMPORTED_MODULE_0__.Graph; },
/* harmony export */   version: function() { return /* binding */ version; }
/* harmony export */ });
/* harmony import */ var _graph_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./graph.js */ "./node_modules/dagre-d3-es/src/graphlib/graph.js");
// Includes only the "core" of graphlib



const version = '2.1.9-pre';




/***/ }),

/***/ "./node_modules/decode-named-character-reference/index.dom.js":
/*!********************************************************************!*\
  !*** ./node_modules/decode-named-character-reference/index.dom.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decodeNamedCharacterReference: function() { return /* binding */ decodeNamedCharacterReference; }
/* harmony export */ });
/// <reference lib="dom" />

/* eslint-env browser */

const element = document.createElement('i')

/**
 * @param {string} value
 * @returns {string|false}
 */
function decodeNamedCharacterReference(value) {
  const characterReference = '&' + value + ';'
  element.innerHTML = characterReference
  const char = element.textContent

  // Some named character references do not require the closing semicolon
  // (`&not`, for instance), which leads to situations where parsing the assumed
  // named reference of `&notit;` will result in the string `¬it;`.
  // When we encounter a trailing semicolon after parsing, and the character
  // reference to decode was not a semicolon (`&semi;`), we can assume that the
  // matching was not complete.
  // @ts-expect-error: TypeScript is wrong that `textContent` on elements can
  // yield `null`.
  if (char.charCodeAt(char.length - 1) === 59 /* `;` */ && value !== 'semi') {
    return false
  }

  // If the decoded string is equal to the input, the character reference was
  // not valid.
  // @ts-expect-error: TypeScript is wrong that `textContent` on elements can
  // yield `null`.
  return char === characterReference ? false : char
}


/***/ }),

/***/ "./node_modules/dequal/dist/index.mjs":
/*!********************************************!*\
  !*** ./node_modules/dequal/dist/index.mjs ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dequal: function() { return /* binding */ dequal; }
/* harmony export */ });
var has = Object.prototype.hasOwnProperty;

function find(iter, tar, key) {
	for (key of iter.keys()) {
		if (dequal(key, tar)) return key;
	}
}

function dequal(foo, bar) {
	var ctor, len, tmp;
	if (foo === bar) return true;

	if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();

		if (ctor === Array) {
			if ((len=foo.length) === bar.length) {
				while (len-- && dequal(foo[len], bar[len]));
			}
			return len === -1;
		}

		if (ctor === Set) {
			if (foo.size !== bar.size) {
				return false;
			}
			for (len of foo) {
				tmp = len;
				if (tmp && typeof tmp === 'object') {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!bar.has(tmp)) return false;
			}
			return true;
		}

		if (ctor === Map) {
			if (foo.size !== bar.size) {
				return false;
			}
			for (len of foo) {
				tmp = len[0];
				if (tmp && typeof tmp === 'object') {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!dequal(len[1], bar.get(tmp))) {
					return false;
				}
			}
			return true;
		}

		if (ctor === ArrayBuffer) {
			foo = new Uint8Array(foo);
			bar = new Uint8Array(bar);
		} else if (ctor === DataView) {
			if ((len=foo.byteLength) === bar.byteLength) {
				while (len-- && foo.getInt8(len) === bar.getInt8(len));
			}
			return len === -1;
		}

		if (ArrayBuffer.isView(foo)) {
			if ((len=foo.byteLength) === bar.byteLength) {
				while (len-- && foo[len] === bar[len]);
			}
			return len === -1;
		}

		if (!ctor || typeof foo === 'object') {
			len = 0;
			for (ctor in foo) {
				if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
				if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
			}
			return Object.keys(bar).length === len;
		}
	}

	return foo !== foo && bar !== bar;
}


/***/ }),

/***/ "./node_modules/diff/lib/index.mjs":
/*!*****************************************!*\
  !*** ./node_modules/diff/lib/index.mjs ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Diff: function() { return /* binding */ Diff; },
/* harmony export */   applyPatch: function() { return /* binding */ applyPatch; },
/* harmony export */   applyPatches: function() { return /* binding */ applyPatches; },
/* harmony export */   canonicalize: function() { return /* binding */ canonicalize; },
/* harmony export */   convertChangesToDMP: function() { return /* binding */ convertChangesToDMP; },
/* harmony export */   convertChangesToXML: function() { return /* binding */ convertChangesToXML; },
/* harmony export */   createPatch: function() { return /* binding */ createPatch; },
/* harmony export */   createTwoFilesPatch: function() { return /* binding */ createTwoFilesPatch; },
/* harmony export */   diffArrays: function() { return /* binding */ diffArrays; },
/* harmony export */   diffChars: function() { return /* binding */ diffChars; },
/* harmony export */   diffCss: function() { return /* binding */ diffCss; },
/* harmony export */   diffJson: function() { return /* binding */ diffJson; },
/* harmony export */   diffLines: function() { return /* binding */ diffLines; },
/* harmony export */   diffSentences: function() { return /* binding */ diffSentences; },
/* harmony export */   diffTrimmedLines: function() { return /* binding */ diffTrimmedLines; },
/* harmony export */   diffWords: function() { return /* binding */ diffWords; },
/* harmony export */   diffWordsWithSpace: function() { return /* binding */ diffWordsWithSpace; },
/* harmony export */   formatPatch: function() { return /* binding */ formatPatch; },
/* harmony export */   merge: function() { return /* binding */ merge; },
/* harmony export */   parsePatch: function() { return /* binding */ parsePatch; },
/* harmony export */   reversePatch: function() { return /* binding */ reversePatch; },
/* harmony export */   structuredPatch: function() { return /* binding */ structuredPatch; }
/* harmony export */ });
function Diff() {}
Diff.prototype = {
  diff: function diff(oldString, newString) {
    var _options$timeout;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = options.callback;

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    this.options = options;
    var self = this;

    function done(value) {
      if (callback) {
        setTimeout(function () {
          callback(undefined, value);
        }, 0);
        return true;
      } else {
        return value;
      }
    } // Allow subclasses to massage the input prior to running


    oldString = this.castInput(oldString);
    newString = this.castInput(newString);
    oldString = this.removeEmpty(this.tokenize(oldString));
    newString = this.removeEmpty(this.tokenize(newString));
    var newLen = newString.length,
        oldLen = oldString.length;
    var editLength = 1;
    var maxEditLength = newLen + oldLen;

    if (options.maxEditLength) {
      maxEditLength = Math.min(maxEditLength, options.maxEditLength);
    }

    var maxExecutionTime = (_options$timeout = options.timeout) !== null && _options$timeout !== void 0 ? _options$timeout : Infinity;
    var abortAfterTimestamp = Date.now() + maxExecutionTime;
    var bestPath = [{
      oldPos: -1,
      lastComponent: undefined
    }]; // Seed editLength = 0, i.e. the content starts with the same values

    var newPos = this.extractCommon(bestPath[0], newString, oldString, 0);

    if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
      // Identity per the equality and tokenizer
      return done([{
        value: this.join(newString),
        count: newString.length
      }]);
    } // Once we hit the right edge of the edit graph on some diagonal k, we can
    // definitely reach the end of the edit graph in no more than k edits, so
    // there's no point in considering any moves to diagonal k+1 any more (from
    // which we're guaranteed to need at least k+1 more edits).
    // Similarly, once we've reached the bottom of the edit graph, there's no
    // point considering moves to lower diagonals.
    // We record this fact by setting minDiagonalToConsider and
    // maxDiagonalToConsider to some finite value once we've hit the edge of
    // the edit graph.
    // This optimization is not faithful to the original algorithm presented in
    // Myers's paper, which instead pointlessly extends D-paths off the end of
    // the edit graph - see page 7 of Myers's paper which notes this point
    // explicitly and illustrates it with a diagram. This has major performance
    // implications for some common scenarios. For instance, to compute a diff
    // where the new text simply appends d characters on the end of the
    // original text of length n, the true Myers algorithm will take O(n+d^2)
    // time while this optimization needs only O(n+d) time.


    var minDiagonalToConsider = -Infinity,
        maxDiagonalToConsider = Infinity; // Main worker method. checks all permutations of a given edit length for acceptance.

    function execEditLength() {
      for (var diagonalPath = Math.max(minDiagonalToConsider, -editLength); diagonalPath <= Math.min(maxDiagonalToConsider, editLength); diagonalPath += 2) {
        var basePath = void 0;
        var removePath = bestPath[diagonalPath - 1],
            addPath = bestPath[diagonalPath + 1];

        if (removePath) {
          // No one else is going to attempt to use this value, clear it
          bestPath[diagonalPath - 1] = undefined;
        }

        var canAdd = false;

        if (addPath) {
          // what newPos will be after we do an insertion:
          var addPathNewPos = addPath.oldPos - diagonalPath;
          canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
        }

        var canRemove = removePath && removePath.oldPos + 1 < oldLen;

        if (!canAdd && !canRemove) {
          // If this path is a terminal then prune
          bestPath[diagonalPath] = undefined;
          continue;
        } // Select the diagonal that we want to branch from. We select the prior
        // path whose position in the old string is the farthest from the origin
        // and does not pass the bounds of the diff graph
        // TODO: Remove the `+ 1` here to make behavior match Myers algorithm
        //       and prefer to order removals before insertions.


        if (!canRemove || canAdd && removePath.oldPos + 1 < addPath.oldPos) {
          basePath = self.addToPath(addPath, true, undefined, 0);
        } else {
          basePath = self.addToPath(removePath, undefined, true, 1);
        }

        newPos = self.extractCommon(basePath, newString, oldString, diagonalPath);

        if (basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
          // If we have hit the end of both strings, then we are done
          return done(buildValues(self, basePath.lastComponent, newString, oldString, self.useLongestToken));
        } else {
          bestPath[diagonalPath] = basePath;

          if (basePath.oldPos + 1 >= oldLen) {
            maxDiagonalToConsider = Math.min(maxDiagonalToConsider, diagonalPath - 1);
          }

          if (newPos + 1 >= newLen) {
            minDiagonalToConsider = Math.max(minDiagonalToConsider, diagonalPath + 1);
          }
        }
      }

      editLength++;
    } // Performs the length of edit iteration. Is a bit fugly as this has to support the
    // sync and async mode which is never fun. Loops over execEditLength until a value
    // is produced, or until the edit length exceeds options.maxEditLength (if given),
    // in which case it will return undefined.


    if (callback) {
      (function exec() {
        setTimeout(function () {
          if (editLength > maxEditLength || Date.now() > abortAfterTimestamp) {
            return callback();
          }

          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength && Date.now() <= abortAfterTimestamp) {
        var ret = execEditLength();

        if (ret) {
          return ret;
        }
      }
    }
  },
  addToPath: function addToPath(path, added, removed, oldPosInc) {
    var last = path.lastComponent;

    if (last && last.added === added && last.removed === removed) {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: {
          count: last.count + 1,
          added: added,
          removed: removed,
          previousComponent: last.previousComponent
        }
      };
    } else {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: {
          count: 1,
          added: added,
          removed: removed,
          previousComponent: last
        }
      };
    }
  },
  extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
    var newLen = newString.length,
        oldLen = oldString.length,
        oldPos = basePath.oldPos,
        newPos = oldPos - diagonalPath,
        commonCount = 0;

    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
      newPos++;
      oldPos++;
      commonCount++;
    }

    if (commonCount) {
      basePath.lastComponent = {
        count: commonCount,
        previousComponent: basePath.lastComponent
      };
    }

    basePath.oldPos = oldPos;
    return newPos;
  },
  equals: function equals(left, right) {
    if (this.options.comparator) {
      return this.options.comparator(left, right);
    } else {
      return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();
    }
  },
  removeEmpty: function removeEmpty(array) {
    var ret = [];

    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }

    return ret;
  },
  castInput: function castInput(value) {
    return value;
  },
  tokenize: function tokenize(value) {
    return value.split('');
  },
  join: function join(chars) {
    return chars.join('');
  }
};

function buildValues(diff, lastComponent, newString, oldString, useLongestToken) {
  // First we convert our linked list of components in reverse order to an
  // array in the right order:
  var components = [];
  var nextComponent;

  while (lastComponent) {
    components.push(lastComponent);
    nextComponent = lastComponent.previousComponent;
    delete lastComponent.previousComponent;
    lastComponent = nextComponent;
  }

  components.reverse();
  var componentPos = 0,
      componentLen = components.length,
      newPos = 0,
      oldPos = 0;

  for (; componentPos < componentLen; componentPos++) {
    var component = components[componentPos];

    if (!component.removed) {
      if (!component.added && useLongestToken) {
        var value = newString.slice(newPos, newPos + component.count);
        value = value.map(function (value, i) {
          var oldValue = oldString[oldPos + i];
          return oldValue.length > value.length ? oldValue : value;
        });
        component.value = diff.join(value);
      } else {
        component.value = diff.join(newString.slice(newPos, newPos + component.count));
      }

      newPos += component.count; // Common case

      if (!component.added) {
        oldPos += component.count;
      }
    } else {
      component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
      oldPos += component.count; // Reverse add and remove so removes are output first to match common convention
      // The diffing algorithm is tied to add then remove output and this is the simplest
      // route to get the desired output with minimal overhead.

      if (componentPos && components[componentPos - 1].added) {
        var tmp = components[componentPos - 1];
        components[componentPos - 1] = components[componentPos];
        components[componentPos] = tmp;
      }
    }
  } // Special case handle for when one terminal is ignored (i.e. whitespace).
  // For this case we merge the terminal into the prior string and drop the change.
  // This is only available for string mode.


  var finalComponent = components[componentLen - 1];

  if (componentLen > 1 && typeof finalComponent.value === 'string' && (finalComponent.added || finalComponent.removed) && diff.equals('', finalComponent.value)) {
    components[componentLen - 2].value += finalComponent.value;
    components.pop();
  }

  return components;
}

var characterDiff = new Diff();
function diffChars(oldStr, newStr, options) {
  return characterDiff.diff(oldStr, newStr, options);
}

function generateOptions(options, defaults) {
  if (typeof options === 'function') {
    defaults.callback = options;
  } else if (options) {
    for (var name in options) {
      /* istanbul ignore else */
      if (options.hasOwnProperty(name)) {
        defaults[name] = options[name];
      }
    }
  }

  return defaults;
}

//
// Ranges and exceptions:
// Latin-1 Supplement, 0080–00FF
//  - U+00D7  × Multiplication sign
//  - U+00F7  ÷ Division sign
// Latin Extended-A, 0100–017F
// Latin Extended-B, 0180–024F
// IPA Extensions, 0250–02AF
// Spacing Modifier Letters, 02B0–02FF
//  - U+02C7  ˇ &#711;  Caron
//  - U+02D8  ˘ &#728;  Breve
//  - U+02D9  ˙ &#729;  Dot Above
//  - U+02DA  ˚ &#730;  Ring Above
//  - U+02DB  ˛ &#731;  Ogonek
//  - U+02DC  ˜ &#732;  Small Tilde
//  - U+02DD  ˝ &#733;  Double Acute Accent
// Latin Extended Additional, 1E00–1EFF

var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
var reWhitespace = /\S/;
var wordDiff = new Diff();

wordDiff.equals = function (left, right) {
  if (this.options.ignoreCase) {
    left = left.toLowerCase();
    right = right.toLowerCase();
  }

  return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
};

wordDiff.tokenize = function (value) {
  // All whitespace symbols except newline group into one token, each newline - in separate token
  var tokens = value.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/); // Join the boundary splits that we do not consider to be boundaries. This is primarily the extended Latin character set.

  for (var i = 0; i < tokens.length - 1; i++) {
    // If we have an empty string in the next field and we have only word chars before and after, merge
    if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
      tokens[i] += tokens[i + 2];
      tokens.splice(i + 1, 2);
      i--;
    }
  }

  return tokens;
};

function diffWords(oldStr, newStr, options) {
  options = generateOptions(options, {
    ignoreWhitespace: true
  });
  return wordDiff.diff(oldStr, newStr, options);
}
function diffWordsWithSpace(oldStr, newStr, options) {
  return wordDiff.diff(oldStr, newStr, options);
}

var lineDiff = new Diff();

lineDiff.tokenize = function (value) {
  if (this.options.stripTrailingCr) {
    // remove one \r before \n to match GNU diff's --strip-trailing-cr behavior
    value = value.replace(/\r\n/g, '\n');
  }

  var retLines = [],
      linesAndNewlines = value.split(/(\n|\r\n)/); // Ignore the final empty token that occurs if the string ends with a new line

  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  } // Merge the content and line separators into single tokens


  for (var i = 0; i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i];

    if (i % 2 && !this.options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      if (this.options.ignoreWhitespace) {
        line = line.trim();
      }

      retLines.push(line);
    }
  }

  return retLines;
};

function diffLines(oldStr, newStr, callback) {
  return lineDiff.diff(oldStr, newStr, callback);
}
function diffTrimmedLines(oldStr, newStr, callback) {
  var options = generateOptions(callback, {
    ignoreWhitespace: true
  });
  return lineDiff.diff(oldStr, newStr, options);
}

var sentenceDiff = new Diff();

sentenceDiff.tokenize = function (value) {
  return value.split(/(\S.+?[.!?])(?=\s+|$)/);
};

function diffSentences(oldStr, newStr, callback) {
  return sentenceDiff.diff(oldStr, newStr, callback);
}

var cssDiff = new Diff();

cssDiff.tokenize = function (value) {
  return value.split(/([{}:;,]|\s+)/);
};

function diffCss(oldStr, newStr, callback) {
  return cssDiff.diff(oldStr, newStr, callback);
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var objectPrototypeToString = Object.prototype.toString;
var jsonDiff = new Diff(); // Discriminate between two lines of pretty-printed, serialized JSON where one of them has a
// dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:

jsonDiff.useLongestToken = true;
jsonDiff.tokenize = lineDiff.tokenize;

jsonDiff.castInput = function (value) {
  var _this$options = this.options,
      undefinedReplacement = _this$options.undefinedReplacement,
      _this$options$stringi = _this$options.stringifyReplacer,
      stringifyReplacer = _this$options$stringi === void 0 ? function (k, v) {
    return typeof v === 'undefined' ? undefinedReplacement : v;
  } : _this$options$stringi;
  return typeof value === 'string' ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, '  ');
};

jsonDiff.equals = function (left, right) {
  return Diff.prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, '$1'), right.replace(/,([\r\n])/g, '$1'));
};

function diffJson(oldObj, newObj, options) {
  return jsonDiff.diff(oldObj, newObj, options);
} // This function handles the presence of circular references by bailing out when encountering an
// object that is already on the "stack" of items being processed. Accepts an optional replacer

function canonicalize(obj, stack, replacementStack, replacer, key) {
  stack = stack || [];
  replacementStack = replacementStack || [];

  if (replacer) {
    obj = replacer(key, obj);
  }

  var i;

  for (i = 0; i < stack.length; i += 1) {
    if (stack[i] === obj) {
      return replacementStack[i];
    }
  }

  var canonicalizedObj;

  if ('[object Array]' === objectPrototypeToString.call(obj)) {
    stack.push(obj);
    canonicalizedObj = new Array(obj.length);
    replacementStack.push(canonicalizedObj);

    for (i = 0; i < obj.length; i += 1) {
      canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
    }

    stack.pop();
    replacementStack.pop();
    return canonicalizedObj;
  }

  if (obj && obj.toJSON) {
    obj = obj.toJSON();
  }

  if (_typeof(obj) === 'object' && obj !== null) {
    stack.push(obj);
    canonicalizedObj = {};
    replacementStack.push(canonicalizedObj);

    var sortedKeys = [],
        _key;

    for (_key in obj) {
      /* istanbul ignore else */
      if (obj.hasOwnProperty(_key)) {
        sortedKeys.push(_key);
      }
    }

    sortedKeys.sort();

    for (i = 0; i < sortedKeys.length; i += 1) {
      _key = sortedKeys[i];
      canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
    }

    stack.pop();
    replacementStack.pop();
  } else {
    canonicalizedObj = obj;
  }

  return canonicalizedObj;
}

var arrayDiff = new Diff();

arrayDiff.tokenize = function (value) {
  return value.slice();
};

arrayDiff.join = arrayDiff.removeEmpty = function (value) {
  return value;
};

function diffArrays(oldArr, newArr, callback) {
  return arrayDiff.diff(oldArr, newArr, callback);
}

function parsePatch(uniDiff) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var diffstr = uniDiff.split(/\r\n|[\n\v\f\r\x85]/),
      delimiters = uniDiff.match(/\r\n|[\n\v\f\r\x85]/g) || [],
      list = [],
      i = 0;

  function parseIndex() {
    var index = {};
    list.push(index); // Parse diff metadata

    while (i < diffstr.length) {
      var line = diffstr[i]; // File header found, end parsing diff metadata

      if (/^(\-\-\-|\+\+\+|@@)\s/.test(line)) {
        break;
      } // Diff index


      var header = /^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(line);

      if (header) {
        index.index = header[1];
      }

      i++;
    } // Parse file headers if they are defined. Unified diff requires them, but
    // there's no technical issues to have an isolated hunk without file header


    parseFileHeader(index);
    parseFileHeader(index); // Parse hunks

    index.hunks = [];

    while (i < diffstr.length) {
      var _line = diffstr[i];

      if (/^(Index:|diff|\-\-\-|\+\+\+)\s/.test(_line)) {
        break;
      } else if (/^@@/.test(_line)) {
        index.hunks.push(parseHunk());
      } else if (_line && options.strict) {
        // Ignore unexpected content unless in strict mode
        throw new Error('Unknown line ' + (i + 1) + ' ' + JSON.stringify(_line));
      } else {
        i++;
      }
    }
  } // Parses the --- and +++ headers, if none are found, no lines
  // are consumed.


  function parseFileHeader(index) {
    var fileHeader = /^(---|\+\+\+)\s+(.*)$/.exec(diffstr[i]);

    if (fileHeader) {
      var keyPrefix = fileHeader[1] === '---' ? 'old' : 'new';
      var data = fileHeader[2].split('\t', 2);
      var fileName = data[0].replace(/\\\\/g, '\\');

      if (/^".*"$/.test(fileName)) {
        fileName = fileName.substr(1, fileName.length - 2);
      }

      index[keyPrefix + 'FileName'] = fileName;
      index[keyPrefix + 'Header'] = (data[1] || '').trim();
      i++;
    }
  } // Parses a hunk
  // This assumes that we are at the start of a hunk.


  function parseHunk() {
    var chunkHeaderIndex = i,
        chunkHeaderLine = diffstr[i++],
        chunkHeader = chunkHeaderLine.split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    var hunk = {
      oldStart: +chunkHeader[1],
      oldLines: typeof chunkHeader[2] === 'undefined' ? 1 : +chunkHeader[2],
      newStart: +chunkHeader[3],
      newLines: typeof chunkHeader[4] === 'undefined' ? 1 : +chunkHeader[4],
      lines: [],
      linedelimiters: []
    }; // Unified Diff Format quirk: If the chunk size is 0,
    // the first number is one lower than one would expect.
    // https://www.artima.com/weblogs/viewpost.jsp?thread=164293

    if (hunk.oldLines === 0) {
      hunk.oldStart += 1;
    }

    if (hunk.newLines === 0) {
      hunk.newStart += 1;
    }

    var addCount = 0,
        removeCount = 0;

    for (; i < diffstr.length; i++) {
      // Lines starting with '---' could be mistaken for the "remove line" operation
      // But they could be the header for the next file. Therefore prune such cases out.
      if (diffstr[i].indexOf('--- ') === 0 && i + 2 < diffstr.length && diffstr[i + 1].indexOf('+++ ') === 0 && diffstr[i + 2].indexOf('@@') === 0) {
        break;
      }

      var operation = diffstr[i].length == 0 && i != diffstr.length - 1 ? ' ' : diffstr[i][0];

      if (operation === '+' || operation === '-' || operation === ' ' || operation === '\\') {
        hunk.lines.push(diffstr[i]);
        hunk.linedelimiters.push(delimiters[i] || '\n');

        if (operation === '+') {
          addCount++;
        } else if (operation === '-') {
          removeCount++;
        } else if (operation === ' ') {
          addCount++;
          removeCount++;
        }
      } else {
        break;
      }
    } // Handle the empty block count case


    if (!addCount && hunk.newLines === 1) {
      hunk.newLines = 0;
    }

    if (!removeCount && hunk.oldLines === 1) {
      hunk.oldLines = 0;
    } // Perform optional sanity checking


    if (options.strict) {
      if (addCount !== hunk.newLines) {
        throw new Error('Added line count did not match for hunk at line ' + (chunkHeaderIndex + 1));
      }

      if (removeCount !== hunk.oldLines) {
        throw new Error('Removed line count did not match for hunk at line ' + (chunkHeaderIndex + 1));
      }
    }

    return hunk;
  }

  while (i < diffstr.length) {
    parseIndex();
  }

  return list;
}

// Iterator that traverses in the range of [min, max], stepping
// by distance from a given start position. I.e. for [0, 4], with
// start of 2, this will iterate 2, 3, 1, 4, 0.
function distanceIterator (start, minLine, maxLine) {
  var wantForward = true,
      backwardExhausted = false,
      forwardExhausted = false,
      localOffset = 1;
  return function iterator() {
    if (wantForward && !forwardExhausted) {
      if (backwardExhausted) {
        localOffset++;
      } else {
        wantForward = false;
      } // Check if trying to fit beyond text length, and if not, check it fits
      // after offset location (or desired location on first iteration)


      if (start + localOffset <= maxLine) {
        return localOffset;
      }

      forwardExhausted = true;
    }

    if (!backwardExhausted) {
      if (!forwardExhausted) {
        wantForward = true;
      } // Check if trying to fit before text beginning, and if not, check it fits
      // before offset location


      if (minLine <= start - localOffset) {
        return -localOffset++;
      }

      backwardExhausted = true;
      return iterator();
    } // We tried to fit hunk before text beginning and beyond text length, then
    // hunk can't fit on the text. Return undefined

  };
}

function applyPatch(source, uniDiff) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (typeof uniDiff === 'string') {
    uniDiff = parsePatch(uniDiff);
  }

  if (Array.isArray(uniDiff)) {
    if (uniDiff.length > 1) {
      throw new Error('applyPatch only works with a single input.');
    }

    uniDiff = uniDiff[0];
  } // Apply the diff to the input


  var lines = source.split(/\r\n|[\n\v\f\r\x85]/),
      delimiters = source.match(/\r\n|[\n\v\f\r\x85]/g) || [],
      hunks = uniDiff.hunks,
      compareLine = options.compareLine || function (lineNumber, line, operation, patchContent) {
    return line === patchContent;
  },
      errorCount = 0,
      fuzzFactor = options.fuzzFactor || 0,
      minLine = 0,
      offset = 0,
      removeEOFNL,
      addEOFNL;
  /**
   * Checks if the hunk exactly fits on the provided location
   */


  function hunkFits(hunk, toPos) {
    for (var j = 0; j < hunk.lines.length; j++) {
      var line = hunk.lines[j],
          operation = line.length > 0 ? line[0] : ' ',
          content = line.length > 0 ? line.substr(1) : line;

      if (operation === ' ' || operation === '-') {
        // Context sanity check
        if (!compareLine(toPos + 1, lines[toPos], operation, content)) {
          errorCount++;

          if (errorCount > fuzzFactor) {
            return false;
          }
        }

        toPos++;
      }
    }

    return true;
  } // Search best fit offsets for each hunk based on the previous ones


  for (var i = 0; i < hunks.length; i++) {
    var hunk = hunks[i],
        maxLine = lines.length - hunk.oldLines,
        localOffset = 0,
        toPos = offset + hunk.oldStart - 1;
    var iterator = distanceIterator(toPos, minLine, maxLine);

    for (; localOffset !== undefined; localOffset = iterator()) {
      if (hunkFits(hunk, toPos + localOffset)) {
        hunk.offset = offset += localOffset;
        break;
      }
    }

    if (localOffset === undefined) {
      return false;
    } // Set lower text limit to end of the current hunk, so next ones don't try
    // to fit over already patched text


    minLine = hunk.offset + hunk.oldStart + hunk.oldLines;
  } // Apply patch hunks


  var diffOffset = 0;

  for (var _i = 0; _i < hunks.length; _i++) {
    var _hunk = hunks[_i],
        _toPos = _hunk.oldStart + _hunk.offset + diffOffset - 1;

    diffOffset += _hunk.newLines - _hunk.oldLines;

    for (var j = 0; j < _hunk.lines.length; j++) {
      var line = _hunk.lines[j],
          operation = line.length > 0 ? line[0] : ' ',
          content = line.length > 0 ? line.substr(1) : line,
          delimiter = _hunk.linedelimiters && _hunk.linedelimiters[j] || '\n';

      if (operation === ' ') {
        _toPos++;
      } else if (operation === '-') {
        lines.splice(_toPos, 1);
        delimiters.splice(_toPos, 1);
        /* istanbul ignore else */
      } else if (operation === '+') {
        lines.splice(_toPos, 0, content);
        delimiters.splice(_toPos, 0, delimiter);
        _toPos++;
      } else if (operation === '\\') {
        var previousOperation = _hunk.lines[j - 1] ? _hunk.lines[j - 1][0] : null;

        if (previousOperation === '+') {
          removeEOFNL = true;
        } else if (previousOperation === '-') {
          addEOFNL = true;
        }
      }
    }
  } // Handle EOFNL insertion/removal


  if (removeEOFNL) {
    while (!lines[lines.length - 1]) {
      lines.pop();
      delimiters.pop();
    }
  } else if (addEOFNL) {
    lines.push('');
    delimiters.push('\n');
  }

  for (var _k = 0; _k < lines.length - 1; _k++) {
    lines[_k] = lines[_k] + delimiters[_k];
  }

  return lines.join('');
} // Wrapper that supports multiple file patches via callbacks.

function applyPatches(uniDiff, options) {
  if (typeof uniDiff === 'string') {
    uniDiff = parsePatch(uniDiff);
  }

  var currentIndex = 0;

  function processIndex() {
    var index = uniDiff[currentIndex++];

    if (!index) {
      return options.complete();
    }

    options.loadFile(index, function (err, data) {
      if (err) {
        return options.complete(err);
      }

      var updatedContent = applyPatch(data, index, options);
      options.patched(index, updatedContent, function (err) {
        if (err) {
          return options.complete(err);
        }

        processIndex();
      });
    });
  }

  processIndex();
}

function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  if (!options) {
    options = {};
  }

  if (typeof options.context === 'undefined') {
    options.context = 4;
  }

  var diff = diffLines(oldStr, newStr, options);

  if (!diff) {
    return;
  }

  diff.push({
    value: '',
    lines: []
  }); // Append an empty value to make cleanup easier

  function contextLines(lines) {
    return lines.map(function (entry) {
      return ' ' + entry;
    });
  }

  var hunks = [];
  var oldRangeStart = 0,
      newRangeStart = 0,
      curRange = [],
      oldLine = 1,
      newLine = 1;

  var _loop = function _loop(i) {
    var current = diff[i],
        lines = current.lines || current.value.replace(/\n$/, '').split('\n');
    current.lines = lines;

    if (current.added || current.removed) {
      var _curRange;

      // If we have previous context, start with that
      if (!oldRangeStart) {
        var prev = diff[i - 1];
        oldRangeStart = oldLine;
        newRangeStart = newLine;

        if (prev) {
          curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : [];
          oldRangeStart -= curRange.length;
          newRangeStart -= curRange.length;
        }
      } // Output our changes


      (_curRange = curRange).push.apply(_curRange, _toConsumableArray(lines.map(function (entry) {
        return (current.added ? '+' : '-') + entry;
      }))); // Track the updated file position


      if (current.added) {
        newLine += lines.length;
      } else {
        oldLine += lines.length;
      }
    } else {
      // Identical context lines. Track line changes
      if (oldRangeStart) {
        // Close out any changes that have been output (or join overlapping)
        if (lines.length <= options.context * 2 && i < diff.length - 2) {
          var _curRange2;

          // Overlapping
          (_curRange2 = curRange).push.apply(_curRange2, _toConsumableArray(contextLines(lines)));
        } else {
          var _curRange3;

          // end the range and output
          var contextSize = Math.min(lines.length, options.context);

          (_curRange3 = curRange).push.apply(_curRange3, _toConsumableArray(contextLines(lines.slice(0, contextSize))));

          var hunk = {
            oldStart: oldRangeStart,
            oldLines: oldLine - oldRangeStart + contextSize,
            newStart: newRangeStart,
            newLines: newLine - newRangeStart + contextSize,
            lines: curRange
          };

          if (i >= diff.length - 2 && lines.length <= options.context) {
            // EOF is inside this hunk
            var oldEOFNewline = /\n$/.test(oldStr);
            var newEOFNewline = /\n$/.test(newStr);
            var noNlBeforeAdds = lines.length == 0 && curRange.length > hunk.oldLines;

            if (!oldEOFNewline && noNlBeforeAdds && oldStr.length > 0) {
              // special case: old has no eol and no trailing context; no-nl can end up before adds
              // however, if the old file is empty, do not output the no-nl line
              curRange.splice(hunk.oldLines, 0, '\\ No newline at end of file');
            }

            if (!oldEOFNewline && !noNlBeforeAdds || !newEOFNewline) {
              curRange.push('\\ No newline at end of file');
            }
          }

          hunks.push(hunk);
          oldRangeStart = 0;
          newRangeStart = 0;
          curRange = [];
        }
      }

      oldLine += lines.length;
      newLine += lines.length;
    }
  };

  for (var i = 0; i < diff.length; i++) {
    _loop(i);
  }

  return {
    oldFileName: oldFileName,
    newFileName: newFileName,
    oldHeader: oldHeader,
    newHeader: newHeader,
    hunks: hunks
  };
}
function formatPatch(diff) {
  if (Array.isArray(diff)) {
    return diff.map(formatPatch).join('\n');
  }

  var ret = [];

  if (diff.oldFileName == diff.newFileName) {
    ret.push('Index: ' + diff.oldFileName);
  }

  ret.push('===================================================================');
  ret.push('--- ' + diff.oldFileName + (typeof diff.oldHeader === 'undefined' ? '' : '\t' + diff.oldHeader));
  ret.push('+++ ' + diff.newFileName + (typeof diff.newHeader === 'undefined' ? '' : '\t' + diff.newHeader));

  for (var i = 0; i < diff.hunks.length; i++) {
    var hunk = diff.hunks[i]; // Unified Diff Format quirk: If the chunk size is 0,
    // the first number is one lower than one would expect.
    // https://www.artima.com/weblogs/viewpost.jsp?thread=164293

    if (hunk.oldLines === 0) {
      hunk.oldStart -= 1;
    }

    if (hunk.newLines === 0) {
      hunk.newStart -= 1;
    }

    ret.push('@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@');
    ret.push.apply(ret, hunk.lines);
  }

  return ret.join('\n') + '\n';
}
function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  return formatPatch(structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options));
}
function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
  return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
}

function arrayEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  return arrayStartsWith(a, b);
}
function arrayStartsWith(array, start) {
  if (start.length > array.length) {
    return false;
  }

  for (var i = 0; i < start.length; i++) {
    if (start[i] !== array[i]) {
      return false;
    }
  }

  return true;
}

function calcLineCount(hunk) {
  var _calcOldNewLineCount = calcOldNewLineCount(hunk.lines),
      oldLines = _calcOldNewLineCount.oldLines,
      newLines = _calcOldNewLineCount.newLines;

  if (oldLines !== undefined) {
    hunk.oldLines = oldLines;
  } else {
    delete hunk.oldLines;
  }

  if (newLines !== undefined) {
    hunk.newLines = newLines;
  } else {
    delete hunk.newLines;
  }
}
function merge(mine, theirs, base) {
  mine = loadPatch(mine, base);
  theirs = loadPatch(theirs, base);
  var ret = {}; // For index we just let it pass through as it doesn't have any necessary meaning.
  // Leaving sanity checks on this to the API consumer that may know more about the
  // meaning in their own context.

  if (mine.index || theirs.index) {
    ret.index = mine.index || theirs.index;
  }

  if (mine.newFileName || theirs.newFileName) {
    if (!fileNameChanged(mine)) {
      // No header or no change in ours, use theirs (and ours if theirs does not exist)
      ret.oldFileName = theirs.oldFileName || mine.oldFileName;
      ret.newFileName = theirs.newFileName || mine.newFileName;
      ret.oldHeader = theirs.oldHeader || mine.oldHeader;
      ret.newHeader = theirs.newHeader || mine.newHeader;
    } else if (!fileNameChanged(theirs)) {
      // No header or no change in theirs, use ours
      ret.oldFileName = mine.oldFileName;
      ret.newFileName = mine.newFileName;
      ret.oldHeader = mine.oldHeader;
      ret.newHeader = mine.newHeader;
    } else {
      // Both changed... figure it out
      ret.oldFileName = selectField(ret, mine.oldFileName, theirs.oldFileName);
      ret.newFileName = selectField(ret, mine.newFileName, theirs.newFileName);
      ret.oldHeader = selectField(ret, mine.oldHeader, theirs.oldHeader);
      ret.newHeader = selectField(ret, mine.newHeader, theirs.newHeader);
    }
  }

  ret.hunks = [];
  var mineIndex = 0,
      theirsIndex = 0,
      mineOffset = 0,
      theirsOffset = 0;

  while (mineIndex < mine.hunks.length || theirsIndex < theirs.hunks.length) {
    var mineCurrent = mine.hunks[mineIndex] || {
      oldStart: Infinity
    },
        theirsCurrent = theirs.hunks[theirsIndex] || {
      oldStart: Infinity
    };

    if (hunkBefore(mineCurrent, theirsCurrent)) {
      // This patch does not overlap with any of the others, yay.
      ret.hunks.push(cloneHunk(mineCurrent, mineOffset));
      mineIndex++;
      theirsOffset += mineCurrent.newLines - mineCurrent.oldLines;
    } else if (hunkBefore(theirsCurrent, mineCurrent)) {
      // This patch does not overlap with any of the others, yay.
      ret.hunks.push(cloneHunk(theirsCurrent, theirsOffset));
      theirsIndex++;
      mineOffset += theirsCurrent.newLines - theirsCurrent.oldLines;
    } else {
      // Overlap, merge as best we can
      var mergedHunk = {
        oldStart: Math.min(mineCurrent.oldStart, theirsCurrent.oldStart),
        oldLines: 0,
        newStart: Math.min(mineCurrent.newStart + mineOffset, theirsCurrent.oldStart + theirsOffset),
        newLines: 0,
        lines: []
      };
      mergeLines(mergedHunk, mineCurrent.oldStart, mineCurrent.lines, theirsCurrent.oldStart, theirsCurrent.lines);
      theirsIndex++;
      mineIndex++;
      ret.hunks.push(mergedHunk);
    }
  }

  return ret;
}

function loadPatch(param, base) {
  if (typeof param === 'string') {
    if (/^@@/m.test(param) || /^Index:/m.test(param)) {
      return parsePatch(param)[0];
    }

    if (!base) {
      throw new Error('Must provide a base reference or pass in a patch');
    }

    return structuredPatch(undefined, undefined, base, param);
  }

  return param;
}

function fileNameChanged(patch) {
  return patch.newFileName && patch.newFileName !== patch.oldFileName;
}

function selectField(index, mine, theirs) {
  if (mine === theirs) {
    return mine;
  } else {
    index.conflict = true;
    return {
      mine: mine,
      theirs: theirs
    };
  }
}

function hunkBefore(test, check) {
  return test.oldStart < check.oldStart && test.oldStart + test.oldLines < check.oldStart;
}

function cloneHunk(hunk, offset) {
  return {
    oldStart: hunk.oldStart,
    oldLines: hunk.oldLines,
    newStart: hunk.newStart + offset,
    newLines: hunk.newLines,
    lines: hunk.lines
  };
}

function mergeLines(hunk, mineOffset, mineLines, theirOffset, theirLines) {
  // This will generally result in a conflicted hunk, but there are cases where the context
  // is the only overlap where we can successfully merge the content here.
  var mine = {
    offset: mineOffset,
    lines: mineLines,
    index: 0
  },
      their = {
    offset: theirOffset,
    lines: theirLines,
    index: 0
  }; // Handle any leading content

  insertLeading(hunk, mine, their);
  insertLeading(hunk, their, mine); // Now in the overlap content. Scan through and select the best changes from each.

  while (mine.index < mine.lines.length && their.index < their.lines.length) {
    var mineCurrent = mine.lines[mine.index],
        theirCurrent = their.lines[their.index];

    if ((mineCurrent[0] === '-' || mineCurrent[0] === '+') && (theirCurrent[0] === '-' || theirCurrent[0] === '+')) {
      // Both modified ...
      mutualChange(hunk, mine, their);
    } else if (mineCurrent[0] === '+' && theirCurrent[0] === ' ') {
      var _hunk$lines;

      // Mine inserted
      (_hunk$lines = hunk.lines).push.apply(_hunk$lines, _toConsumableArray(collectChange(mine)));
    } else if (theirCurrent[0] === '+' && mineCurrent[0] === ' ') {
      var _hunk$lines2;

      // Theirs inserted
      (_hunk$lines2 = hunk.lines).push.apply(_hunk$lines2, _toConsumableArray(collectChange(their)));
    } else if (mineCurrent[0] === '-' && theirCurrent[0] === ' ') {
      // Mine removed or edited
      removal(hunk, mine, their);
    } else if (theirCurrent[0] === '-' && mineCurrent[0] === ' ') {
      // Their removed or edited
      removal(hunk, their, mine, true);
    } else if (mineCurrent === theirCurrent) {
      // Context identity
      hunk.lines.push(mineCurrent);
      mine.index++;
      their.index++;
    } else {
      // Context mismatch
      conflict(hunk, collectChange(mine), collectChange(their));
    }
  } // Now push anything that may be remaining


  insertTrailing(hunk, mine);
  insertTrailing(hunk, their);
  calcLineCount(hunk);
}

function mutualChange(hunk, mine, their) {
  var myChanges = collectChange(mine),
      theirChanges = collectChange(their);

  if (allRemoves(myChanges) && allRemoves(theirChanges)) {
    // Special case for remove changes that are supersets of one another
    if (arrayStartsWith(myChanges, theirChanges) && skipRemoveSuperset(their, myChanges, myChanges.length - theirChanges.length)) {
      var _hunk$lines3;

      (_hunk$lines3 = hunk.lines).push.apply(_hunk$lines3, _toConsumableArray(myChanges));

      return;
    } else if (arrayStartsWith(theirChanges, myChanges) && skipRemoveSuperset(mine, theirChanges, theirChanges.length - myChanges.length)) {
      var _hunk$lines4;

      (_hunk$lines4 = hunk.lines).push.apply(_hunk$lines4, _toConsumableArray(theirChanges));

      return;
    }
  } else if (arrayEqual(myChanges, theirChanges)) {
    var _hunk$lines5;

    (_hunk$lines5 = hunk.lines).push.apply(_hunk$lines5, _toConsumableArray(myChanges));

    return;
  }

  conflict(hunk, myChanges, theirChanges);
}

function removal(hunk, mine, their, swap) {
  var myChanges = collectChange(mine),
      theirChanges = collectContext(their, myChanges);

  if (theirChanges.merged) {
    var _hunk$lines6;

    (_hunk$lines6 = hunk.lines).push.apply(_hunk$lines6, _toConsumableArray(theirChanges.merged));
  } else {
    conflict(hunk, swap ? theirChanges : myChanges, swap ? myChanges : theirChanges);
  }
}

function conflict(hunk, mine, their) {
  hunk.conflict = true;
  hunk.lines.push({
    conflict: true,
    mine: mine,
    theirs: their
  });
}

function insertLeading(hunk, insert, their) {
  while (insert.offset < their.offset && insert.index < insert.lines.length) {
    var line = insert.lines[insert.index++];
    hunk.lines.push(line);
    insert.offset++;
  }
}

function insertTrailing(hunk, insert) {
  while (insert.index < insert.lines.length) {
    var line = insert.lines[insert.index++];
    hunk.lines.push(line);
  }
}

function collectChange(state) {
  var ret = [],
      operation = state.lines[state.index][0];

  while (state.index < state.lines.length) {
    var line = state.lines[state.index]; // Group additions that are immediately after subtractions and treat them as one "atomic" modify change.

    if (operation === '-' && line[0] === '+') {
      operation = '+';
    }

    if (operation === line[0]) {
      ret.push(line);
      state.index++;
    } else {
      break;
    }
  }

  return ret;
}

function collectContext(state, matchChanges) {
  var changes = [],
      merged = [],
      matchIndex = 0,
      contextChanges = false,
      conflicted = false;

  while (matchIndex < matchChanges.length && state.index < state.lines.length) {
    var change = state.lines[state.index],
        match = matchChanges[matchIndex]; // Once we've hit our add, then we are done

    if (match[0] === '+') {
      break;
    }

    contextChanges = contextChanges || change[0] !== ' ';
    merged.push(match);
    matchIndex++; // Consume any additions in the other block as a conflict to attempt
    // to pull in the remaining context after this

    if (change[0] === '+') {
      conflicted = true;

      while (change[0] === '+') {
        changes.push(change);
        change = state.lines[++state.index];
      }
    }

    if (match.substr(1) === change.substr(1)) {
      changes.push(change);
      state.index++;
    } else {
      conflicted = true;
    }
  }

  if ((matchChanges[matchIndex] || '')[0] === '+' && contextChanges) {
    conflicted = true;
  }

  if (conflicted) {
    return changes;
  }

  while (matchIndex < matchChanges.length) {
    merged.push(matchChanges[matchIndex++]);
  }

  return {
    merged: merged,
    changes: changes
  };
}

function allRemoves(changes) {
  return changes.reduce(function (prev, change) {
    return prev && change[0] === '-';
  }, true);
}

function skipRemoveSuperset(state, removeChanges, delta) {
  for (var i = 0; i < delta; i++) {
    var changeContent = removeChanges[removeChanges.length - delta + i].substr(1);

    if (state.lines[state.index + i] !== ' ' + changeContent) {
      return false;
    }
  }

  state.index += delta;
  return true;
}

function calcOldNewLineCount(lines) {
  var oldLines = 0;
  var newLines = 0;
  lines.forEach(function (line) {
    if (typeof line !== 'string') {
      var myCount = calcOldNewLineCount(line.mine);
      var theirCount = calcOldNewLineCount(line.theirs);

      if (oldLines !== undefined) {
        if (myCount.oldLines === theirCount.oldLines) {
          oldLines += myCount.oldLines;
        } else {
          oldLines = undefined;
        }
      }

      if (newLines !== undefined) {
        if (myCount.newLines === theirCount.newLines) {
          newLines += myCount.newLines;
        } else {
          newLines = undefined;
        }
      }
    } else {
      if (newLines !== undefined && (line[0] === '+' || line[0] === ' ')) {
        newLines++;
      }

      if (oldLines !== undefined && (line[0] === '-' || line[0] === ' ')) {
        oldLines++;
      }
    }
  });
  return {
    oldLines: oldLines,
    newLines: newLines
  };
}

function reversePatch(structuredPatch) {
  if (Array.isArray(structuredPatch)) {
    return structuredPatch.map(reversePatch).reverse();
  }

  return _objectSpread2(_objectSpread2({}, structuredPatch), {}, {
    oldFileName: structuredPatch.newFileName,
    oldHeader: structuredPatch.newHeader,
    newFileName: structuredPatch.oldFileName,
    newHeader: structuredPatch.oldHeader,
    hunks: structuredPatch.hunks.map(function (hunk) {
      return {
        oldLines: hunk.newLines,
        oldStart: hunk.newStart,
        newLines: hunk.oldLines,
        newStart: hunk.oldStart,
        linedelimiters: hunk.linedelimiters,
        lines: hunk.lines.map(function (l) {
          if (l.startsWith('-')) {
            return "+".concat(l.slice(1));
          }

          if (l.startsWith('+')) {
            return "-".concat(l.slice(1));
          }

          return l;
        })
      };
    })
  });
}

// See: http://code.google.com/p/google-diff-match-patch/wiki/API
function convertChangesToDMP(changes) {
  var ret = [],
      change,
      operation;

  for (var i = 0; i < changes.length; i++) {
    change = changes[i];

    if (change.added) {
      operation = 1;
    } else if (change.removed) {
      operation = -1;
    } else {
      operation = 0;
    }

    ret.push([operation, change.value]);
  }

  return ret;
}

function convertChangesToXML(changes) {
  var ret = [];

  for (var i = 0; i < changes.length; i++) {
    var change = changes[i];

    if (change.added) {
      ret.push('<ins>');
    } else if (change.removed) {
      ret.push('<del>');
    }

    ret.push(escapeHTML(change.value));

    if (change.added) {
      ret.push('</ins>');
    } else if (change.removed) {
      ret.push('</del>');
    }
  }

  return ret.join('');
}

function escapeHTML(s) {
  var n = s;
  n = n.replace(/&/g, '&amp;');
  n = n.replace(/</g, '&lt;');
  n = n.replace(/>/g, '&gt;');
  n = n.replace(/"/g, '&quot;');
  return n;
}




/***/ }),

/***/ "./node_modules/kleur/index.mjs":
/*!**************************************!*\
  !*** ./node_modules/kleur/index.mjs ***!
  \**************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


let FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM, isTTY=true;
if (typeof process !== 'undefined') {
	({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
	isTTY = process.stdout && process.stdout.isTTY;
}

const $ = {
	enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== 'dumb' && (
		FORCE_COLOR != null && FORCE_COLOR !== '0' || isTTY
	),

	// modifiers
	reset: init(0, 0),
	bold: init(1, 22),
	dim: init(2, 22),
	italic: init(3, 23),
	underline: init(4, 24),
	inverse: init(7, 27),
	hidden: init(8, 28),
	strikethrough: init(9, 29),

	// colors
	black: init(30, 39),
	red: init(31, 39),
	green: init(32, 39),
	yellow: init(33, 39),
	blue: init(34, 39),
	magenta: init(35, 39),
	cyan: init(36, 39),
	white: init(37, 39),
	gray: init(90, 39),
	grey: init(90, 39),

	// background colors
	bgBlack: init(40, 49),
	bgRed: init(41, 49),
	bgGreen: init(42, 49),
	bgYellow: init(43, 49),
	bgBlue: init(44, 49),
	bgMagenta: init(45, 49),
	bgCyan: init(46, 49),
	bgWhite: init(47, 49)
};

function run(arr, str) {
	let i=0, tmp, beg='', end='';
	for (; i < arr.length; i++) {
		tmp = arr[i];
		beg += tmp.open;
		end += tmp.close;
		if (!!~str.indexOf(tmp.close)) {
			str = str.replace(tmp.rgx, tmp.close + tmp.open);
		}
	}
	return beg + str + end;
}

function chain(has, keys) {
	let ctx = { has, keys };

	ctx.reset = $.reset.bind(ctx);
	ctx.bold = $.bold.bind(ctx);
	ctx.dim = $.dim.bind(ctx);
	ctx.italic = $.italic.bind(ctx);
	ctx.underline = $.underline.bind(ctx);
	ctx.inverse = $.inverse.bind(ctx);
	ctx.hidden = $.hidden.bind(ctx);
	ctx.strikethrough = $.strikethrough.bind(ctx);

	ctx.black = $.black.bind(ctx);
	ctx.red = $.red.bind(ctx);
	ctx.green = $.green.bind(ctx);
	ctx.yellow = $.yellow.bind(ctx);
	ctx.blue = $.blue.bind(ctx);
	ctx.magenta = $.magenta.bind(ctx);
	ctx.cyan = $.cyan.bind(ctx);
	ctx.white = $.white.bind(ctx);
	ctx.gray = $.gray.bind(ctx);
	ctx.grey = $.grey.bind(ctx);

	ctx.bgBlack = $.bgBlack.bind(ctx);
	ctx.bgRed = $.bgRed.bind(ctx);
	ctx.bgGreen = $.bgGreen.bind(ctx);
	ctx.bgYellow = $.bgYellow.bind(ctx);
	ctx.bgBlue = $.bgBlue.bind(ctx);
	ctx.bgMagenta = $.bgMagenta.bind(ctx);
	ctx.bgCyan = $.bgCyan.bind(ctx);
	ctx.bgWhite = $.bgWhite.bind(ctx);

	return ctx;
}

function init(open, close) {
	let blk = {
		open: `\x1b[${open}m`,
		close: `\x1b[${close}m`,
		rgx: new RegExp(`\\x1b\\[${close}m`, 'g')
	};
	return function (txt) {
		if (this !== void 0 && this.has !== void 0) {
			!!~this.has.indexOf(open) || (this.has.push(open),this.keys.push(blk));
			return txt === void 0 ? this : $.enabled ? run(this.keys, txt+'') : txt+'';
		}
		return txt === void 0 ? chain([open], [blk]) : $.enabled ? run([blk], txt+'') : txt+'';
	};
}

/* harmony default export */ __webpack_exports__["default"] = ($);


/***/ }),

/***/ "./node_modules/lodash-es/_SetCache.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_SetCache.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MapCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_MapCache.js */ "./node_modules/lodash-es/_MapCache.js");
/* harmony import */ var _setCacheAdd_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setCacheAdd.js */ "./node_modules/lodash-es/_setCacheAdd.js");
/* harmony import */ var _setCacheHas_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_setCacheHas.js */ "./node_modules/lodash-es/_setCacheHas.js");




/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache_js__WEBPACK_IMPORTED_MODULE_0__["default"];
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd_js__WEBPACK_IMPORTED_MODULE_1__["default"];
SetCache.prototype.has = _setCacheHas_js__WEBPACK_IMPORTED_MODULE_2__["default"];

/* harmony default export */ __webpack_exports__["default"] = (SetCache);


/***/ }),

/***/ "./node_modules/lodash-es/_arrayEach.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_arrayEach.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/* harmony default export */ __webpack_exports__["default"] = (arrayEach);


/***/ }),

/***/ "./node_modules/lodash-es/_arrayFilter.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_arrayFilter.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (arrayFilter);


/***/ }),

/***/ "./node_modules/lodash-es/_arrayIncludes.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_arrayIncludes.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseIndexOf.js */ "./node_modules/lodash-es/_baseIndexOf.js");


/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && (0,_baseIndexOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array, value, 0) > -1;
}

/* harmony default export */ __webpack_exports__["default"] = (arrayIncludes);


/***/ }),

/***/ "./node_modules/lodash-es/_arrayIncludesWith.js":
/*!******************************************************!*\
  !*** ./node_modules/lodash-es/_arrayIncludesWith.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/* harmony default export */ __webpack_exports__["default"] = (arrayIncludesWith);


/***/ }),

/***/ "./node_modules/lodash-es/_arrayMap.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_arrayMap.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (arrayMap);


/***/ }),

/***/ "./node_modules/lodash-es/_arrayPush.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_arrayPush.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/* harmony default export */ __webpack_exports__["default"] = (arrayPush);


/***/ }),

/***/ "./node_modules/lodash-es/_arrayReduce.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_arrayReduce.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/* harmony default export */ __webpack_exports__["default"] = (arrayReduce);


/***/ }),

/***/ "./node_modules/lodash-es/_arraySome.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_arraySome.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/* harmony default export */ __webpack_exports__["default"] = (arraySome);


/***/ }),

/***/ "./node_modules/lodash-es/_asciiSize.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_asciiSize.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseProperty.js */ "./node_modules/lodash-es/_baseProperty.js");


/**
 * Gets the size of an ASCII `string`.
 *
 * @private
 * @param {string} string The string inspect.
 * @returns {number} Returns the string size.
 */
var asciiSize = (0,_baseProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"])('length');

/* harmony default export */ __webpack_exports__["default"] = (asciiSize);


/***/ }),

/***/ "./node_modules/lodash-es/_baseAssign.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseAssign.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _copyObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_copyObject.js */ "./node_modules/lodash-es/_copyObject.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/lodash-es/keys.js");



/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && (0,_copyObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source, (0,_keys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(source), object);
}

/* harmony default export */ __webpack_exports__["default"] = (baseAssign);


/***/ }),

/***/ "./node_modules/lodash-es/_baseAssignIn.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_baseAssignIn.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _copyObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_copyObject.js */ "./node_modules/lodash-es/_copyObject.js");
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keysIn.js */ "./node_modules/lodash-es/keysIn.js");



/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && (0,_copyObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source, (0,_keysIn_js__WEBPACK_IMPORTED_MODULE_1__["default"])(source), object);
}

/* harmony default export */ __webpack_exports__["default"] = (baseAssignIn);


/***/ }),

/***/ "./node_modules/lodash-es/_baseClone.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseClone.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Stack_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./_Stack.js */ "./node_modules/lodash-es/_Stack.js");
/* harmony import */ var _arrayEach_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./_arrayEach.js */ "./node_modules/lodash-es/_arrayEach.js");
/* harmony import */ var _assignValue_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./_assignValue.js */ "./node_modules/lodash-es/_assignValue.js");
/* harmony import */ var _baseAssign_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./_baseAssign.js */ "./node_modules/lodash-es/_baseAssign.js");
/* harmony import */ var _baseAssignIn_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./_baseAssignIn.js */ "./node_modules/lodash-es/_baseAssignIn.js");
/* harmony import */ var _cloneBuffer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_cloneBuffer.js */ "./node_modules/lodash-es/_cloneBuffer.js");
/* harmony import */ var _copyArray_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_copyArray.js */ "./node_modules/lodash-es/_copyArray.js");
/* harmony import */ var _copySymbols_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./_copySymbols.js */ "./node_modules/lodash-es/_copySymbols.js");
/* harmony import */ var _copySymbolsIn_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./_copySymbolsIn.js */ "./node_modules/lodash-es/_copySymbolsIn.js");
/* harmony import */ var _getAllKeys_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./_getAllKeys.js */ "./node_modules/lodash-es/_getAllKeys.js");
/* harmony import */ var _getAllKeysIn_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./_getAllKeysIn.js */ "./node_modules/lodash-es/_getAllKeysIn.js");
/* harmony import */ var _getTag_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_getTag.js */ "./node_modules/lodash-es/_getTag.js");
/* harmony import */ var _initCloneArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_initCloneArray.js */ "./node_modules/lodash-es/_initCloneArray.js");
/* harmony import */ var _initCloneByTag_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./_initCloneByTag.js */ "./node_modules/lodash-es/_initCloneByTag.js");
/* harmony import */ var _initCloneObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./_initCloneObject.js */ "./node_modules/lodash-es/_initCloneObject.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");
/* harmony import */ var _isBuffer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isBuffer.js */ "./node_modules/lodash-es/isBuffer.js");
/* harmony import */ var _isMap_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./isMap.js */ "./node_modules/lodash-es/isMap.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");
/* harmony import */ var _isSet_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./isSet.js */ "./node_modules/lodash-es/isSet.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./keys.js */ "./node_modules/lodash-es/keys.js");
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./keysIn.js */ "./node_modules/lodash-es/keysIn.js");























/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value)) {
    return value;
  }
  var isArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value);
  if (isArr) {
    result = (0,_initCloneArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);
    if (!isDeep) {
      return (0,_copyArray_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value, result);
    }
  } else {
    var tag = (0,_getTag_js__WEBPACK_IMPORTED_MODULE_4__["default"])(value),
        isFunc = tag == funcTag || tag == genTag;

    if ((0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_5__["default"])(value)) {
      return (0,_cloneBuffer_js__WEBPACK_IMPORTED_MODULE_6__["default"])(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : (0,_initCloneObject_js__WEBPACK_IMPORTED_MODULE_7__["default"])(value);
      if (!isDeep) {
        return isFlat
          ? (0,_copySymbolsIn_js__WEBPACK_IMPORTED_MODULE_8__["default"])(value, (0,_baseAssignIn_js__WEBPACK_IMPORTED_MODULE_9__["default"])(result, value))
          : (0,_copySymbols_js__WEBPACK_IMPORTED_MODULE_10__["default"])(value, (0,_baseAssign_js__WEBPACK_IMPORTED_MODULE_11__["default"])(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = (0,_initCloneByTag_js__WEBPACK_IMPORTED_MODULE_12__["default"])(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_13__["default"]);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if ((0,_isSet_js__WEBPACK_IMPORTED_MODULE_14__["default"])(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if ((0,_isMap_js__WEBPACK_IMPORTED_MODULE_15__["default"])(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? _getAllKeysIn_js__WEBPACK_IMPORTED_MODULE_16__["default"] : _getAllKeys_js__WEBPACK_IMPORTED_MODULE_17__["default"])
    : (isFlat ? _keysIn_js__WEBPACK_IMPORTED_MODULE_18__["default"] : _keys_js__WEBPACK_IMPORTED_MODULE_19__["default"]);

  var props = isArr ? undefined : keysFunc(value);
  (0,_arrayEach_js__WEBPACK_IMPORTED_MODULE_20__["default"])(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    (0,_assignValue_js__WEBPACK_IMPORTED_MODULE_21__["default"])(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (baseClone);


/***/ }),

/***/ "./node_modules/lodash-es/_baseEach.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_baseEach.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseForOwn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseForOwn.js */ "./node_modules/lodash-es/_baseForOwn.js");
/* harmony import */ var _createBaseEach_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createBaseEach.js */ "./node_modules/lodash-es/_createBaseEach.js");



/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = (0,_createBaseEach_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_baseForOwn_js__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (baseEach);


/***/ }),

/***/ "./node_modules/lodash-es/_baseExtremum.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_baseExtremum.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isSymbol.js */ "./node_modules/lodash-es/isSymbol.js");


/**
 * The base implementation of methods like `_.max` and `_.min` which accepts a
 * `comparator` to determine the extremum value.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The iteratee invoked per iteration.
 * @param {Function} comparator The comparator used to compare values.
 * @returns {*} Returns the extremum value.
 */
function baseExtremum(array, iteratee, comparator) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index],
        current = iteratee(value);

    if (current != null && (computed === undefined
          ? (current === current && !(0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_0__["default"])(current))
          : comparator(current, computed)
        )) {
      var computed = current,
          result = value;
    }
  }
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (baseExtremum);


/***/ }),

/***/ "./node_modules/lodash-es/_baseFilter.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseFilter.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseEach_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseEach.js */ "./node_modules/lodash-es/_baseEach.js");


/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  (0,_baseEach_js__WEBPACK_IMPORTED_MODULE_0__["default"])(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (baseFilter);


/***/ }),

/***/ "./node_modules/lodash-es/_baseFindIndex.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_baseFindIndex.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/* harmony default export */ __webpack_exports__["default"] = (baseFindIndex);


/***/ }),

/***/ "./node_modules/lodash-es/_baseFlatten.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_baseFlatten.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayPush_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayPush.js */ "./node_modules/lodash-es/_arrayPush.js");
/* harmony import */ var _isFlattenable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isFlattenable.js */ "./node_modules/lodash-es/_isFlattenable.js");



/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = _isFlattenable_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        (0,_arrayPush_js__WEBPACK_IMPORTED_MODULE_1__["default"])(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (baseFlatten);


/***/ }),

/***/ "./node_modules/lodash-es/_baseForOwn.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseForOwn.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseFor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseFor.js */ "./node_modules/lodash-es/_baseFor.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/lodash-es/keys.js");



/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && (0,_baseFor_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, iteratee, _keys_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
}

/* harmony default export */ __webpack_exports__["default"] = (baseForOwn);


/***/ }),

/***/ "./node_modules/lodash-es/_baseGet.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_baseGet.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _castPath_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_castPath.js */ "./node_modules/lodash-es/_castPath.js");
/* harmony import */ var _toKey_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_toKey.js */ "./node_modules/lodash-es/_toKey.js");



/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = (0,_castPath_js__WEBPACK_IMPORTED_MODULE_0__["default"])(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[(0,_toKey_js__WEBPACK_IMPORTED_MODULE_1__["default"])(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/* harmony default export */ __webpack_exports__["default"] = (baseGet);


/***/ }),

/***/ "./node_modules/lodash-es/_baseGetAllKeys.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_baseGetAllKeys.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayPush_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayPush.js */ "./node_modules/lodash-es/_arrayPush.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");



/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object) ? result : (0,_arrayPush_js__WEBPACK_IMPORTED_MODULE_1__["default"])(result, symbolsFunc(object));
}

/* harmony default export */ __webpack_exports__["default"] = (baseGetAllKeys);


/***/ }),

/***/ "./node_modules/lodash-es/_baseGt.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/_baseGt.js ***!
  \*******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * The base implementation of `_.gt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is greater than `other`,
 *  else `false`.
 */
function baseGt(value, other) {
  return value > other;
}

/* harmony default export */ __webpack_exports__["default"] = (baseGt);


/***/ }),

/***/ "./node_modules/lodash-es/_baseHas.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_baseHas.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty.call(object, key);
}

/* harmony default export */ __webpack_exports__["default"] = (baseHas);


/***/ }),

/***/ "./node_modules/lodash-es/_baseHasIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseHasIn.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/* harmony default export */ __webpack_exports__["default"] = (baseHasIn);


/***/ }),

/***/ "./node_modules/lodash-es/_baseIndexOf.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_baseIndexOf.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseFindIndex_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseFindIndex.js */ "./node_modules/lodash-es/_baseFindIndex.js");
/* harmony import */ var _baseIsNaN_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseIsNaN.js */ "./node_modules/lodash-es/_baseIsNaN.js");
/* harmony import */ var _strictIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_strictIndexOf.js */ "./node_modules/lodash-es/_strictIndexOf.js");




/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? (0,_strictIndexOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array, value, fromIndex)
    : (0,_baseFindIndex_js__WEBPACK_IMPORTED_MODULE_1__["default"])(array, _baseIsNaN_js__WEBPACK_IMPORTED_MODULE_2__["default"], fromIndex);
}

/* harmony default export */ __webpack_exports__["default"] = (baseIndexOf);


/***/ }),

/***/ "./node_modules/lodash-es/_baseIsEqual.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsEqual.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseIsEqualDeep_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseIsEqualDeep.js */ "./node_modules/lodash-es/_baseIsEqualDeep.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");



/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!(0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && !(0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(other))) {
    return value !== value && other !== other;
  }
  return (0,_baseIsEqualDeep_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value, other, bitmask, customizer, baseIsEqual, stack);
}

/* harmony default export */ __webpack_exports__["default"] = (baseIsEqual);


/***/ }),

/***/ "./node_modules/lodash-es/_baseIsEqualDeep.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsEqualDeep.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Stack_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_Stack.js */ "./node_modules/lodash-es/_Stack.js");
/* harmony import */ var _equalArrays_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_equalArrays.js */ "./node_modules/lodash-es/_equalArrays.js");
/* harmony import */ var _equalByTag_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_equalByTag.js */ "./node_modules/lodash-es/_equalByTag.js");
/* harmony import */ var _equalObjects_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./_equalObjects.js */ "./node_modules/lodash-es/_equalObjects.js");
/* harmony import */ var _getTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getTag.js */ "./node_modules/lodash-es/_getTag.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");
/* harmony import */ var _isBuffer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isBuffer.js */ "./node_modules/lodash-es/isBuffer.js");
/* harmony import */ var _isTypedArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isTypedArray.js */ "./node_modules/lodash-es/isTypedArray.js");









/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object),
      othIsArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(other),
      objTag = objIsArr ? arrayTag : (0,_getTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object),
      othTag = othIsArr ? arrayTag : (0,_getTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && (0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object)) {
    if (!(0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_3__["default"]);
    return (objIsArr || (0,_isTypedArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(object))
      ? (0,_equalArrays_js__WEBPACK_IMPORTED_MODULE_5__["default"])(object, other, bitmask, customizer, equalFunc, stack)
      : (0,_equalByTag_js__WEBPACK_IMPORTED_MODULE_6__["default"])(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_3__["default"]);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_3__["default"]);
  return (0,_equalObjects_js__WEBPACK_IMPORTED_MODULE_7__["default"])(object, other, bitmask, customizer, equalFunc, stack);
}

/* harmony default export */ __webpack_exports__["default"] = (baseIsEqualDeep);


/***/ }),

/***/ "./node_modules/lodash-es/_baseIsMap.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseIsMap.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getTag.js */ "./node_modules/lodash-es/_getTag.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");



/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_getTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) == mapTag;
}

/* harmony default export */ __webpack_exports__["default"] = (baseIsMap);


/***/ }),

/***/ "./node_modules/lodash-es/_baseIsMatch.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsMatch.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Stack_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Stack.js */ "./node_modules/lodash-es/_Stack.js");
/* harmony import */ var _baseIsEqual_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseIsEqual.js */ "./node_modules/lodash-es/_baseIsEqual.js");



/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_0__["default"];
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? (0,_baseIsEqual_js__WEBPACK_IMPORTED_MODULE_1__["default"])(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

/* harmony default export */ __webpack_exports__["default"] = (baseIsMatch);


/***/ }),

/***/ "./node_modules/lodash-es/_baseIsNaN.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseIsNaN.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/* harmony default export */ __webpack_exports__["default"] = (baseIsNaN);


/***/ }),

/***/ "./node_modules/lodash-es/_baseIsSet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseIsSet.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getTag.js */ "./node_modules/lodash-es/_getTag.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");



/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_getTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) == setTag;
}

/* harmony default export */ __webpack_exports__["default"] = (baseIsSet);


/***/ }),

/***/ "./node_modules/lodash-es/_baseIteratee.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_baseIteratee.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseMatches_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_baseMatches.js */ "./node_modules/lodash-es/_baseMatches.js");
/* harmony import */ var _baseMatchesProperty_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseMatchesProperty.js */ "./node_modules/lodash-es/_baseMatchesProperty.js");
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./identity.js */ "./node_modules/lodash-es/identity.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");
/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./property.js */ "./node_modules/lodash-es/property.js");






/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return _identity_js__WEBPACK_IMPORTED_MODULE_0__["default"];
  }
  if (typeof value == 'object') {
    return (0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)
      ? (0,_baseMatchesProperty_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value[0], value[1])
      : (0,_baseMatches_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value);
  }
  return (0,_property_js__WEBPACK_IMPORTED_MODULE_4__["default"])(value);
}

/* harmony default export */ __webpack_exports__["default"] = (baseIteratee);


/***/ }),

/***/ "./node_modules/lodash-es/_baseLt.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/_baseLt.js ***!
  \*******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * The base implementation of `_.lt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is less than `other`,
 *  else `false`.
 */
function baseLt(value, other) {
  return value < other;
}

/* harmony default export */ __webpack_exports__["default"] = (baseLt);


/***/ }),

/***/ "./node_modules/lodash-es/_baseMap.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_baseMap.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseEach_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseEach.js */ "./node_modules/lodash-es/_baseEach.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArrayLike.js */ "./node_modules/lodash-es/isArrayLike.js");



/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(collection) ? Array(collection.length) : [];

  (0,_baseEach_js__WEBPACK_IMPORTED_MODULE_1__["default"])(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (baseMap);


/***/ }),

/***/ "./node_modules/lodash-es/_baseMatches.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_baseMatches.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseIsMatch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseIsMatch.js */ "./node_modules/lodash-es/_baseIsMatch.js");
/* harmony import */ var _getMatchData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getMatchData.js */ "./node_modules/lodash-es/_getMatchData.js");
/* harmony import */ var _matchesStrictComparable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_matchesStrictComparable.js */ "./node_modules/lodash-es/_matchesStrictComparable.js");




/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = (0,_getMatchData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return (0,_matchesStrictComparable_js__WEBPACK_IMPORTED_MODULE_1__["default"])(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || (0,_baseIsMatch_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object, source, matchData);
  };
}

/* harmony default export */ __webpack_exports__["default"] = (baseMatches);


/***/ }),

/***/ "./node_modules/lodash-es/_baseMatchesProperty.js":
/*!********************************************************!*\
  !*** ./node_modules/lodash-es/_baseMatchesProperty.js ***!
  \********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseIsEqual_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_baseIsEqual.js */ "./node_modules/lodash-es/_baseIsEqual.js");
/* harmony import */ var _get_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./get.js */ "./node_modules/lodash-es/get.js");
/* harmony import */ var _hasIn_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hasIn.js */ "./node_modules/lodash-es/hasIn.js");
/* harmony import */ var _isKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isKey.js */ "./node_modules/lodash-es/_isKey.js");
/* harmony import */ var _isStrictComparable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isStrictComparable.js */ "./node_modules/lodash-es/_isStrictComparable.js");
/* harmony import */ var _matchesStrictComparable_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_matchesStrictComparable.js */ "./node_modules/lodash-es/_matchesStrictComparable.js");
/* harmony import */ var _toKey_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_toKey.js */ "./node_modules/lodash-es/_toKey.js");








/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if ((0,_isKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(path) && (0,_isStrictComparable_js__WEBPACK_IMPORTED_MODULE_1__["default"])(srcValue)) {
    return (0,_matchesStrictComparable_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_toKey_js__WEBPACK_IMPORTED_MODULE_3__["default"])(path), srcValue);
  }
  return function(object) {
    var objValue = (0,_get_js__WEBPACK_IMPORTED_MODULE_4__["default"])(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? (0,_hasIn_js__WEBPACK_IMPORTED_MODULE_5__["default"])(object, path)
      : (0,_baseIsEqual_js__WEBPACK_IMPORTED_MODULE_6__["default"])(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

/* harmony default export */ __webpack_exports__["default"] = (baseMatchesProperty);


/***/ }),

/***/ "./node_modules/lodash-es/_baseOrderBy.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_baseOrderBy.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayMap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_arrayMap.js */ "./node_modules/lodash-es/_arrayMap.js");
/* harmony import */ var _baseGet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseGet.js */ "./node_modules/lodash-es/_baseGet.js");
/* harmony import */ var _baseIteratee_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_baseIteratee.js */ "./node_modules/lodash-es/_baseIteratee.js");
/* harmony import */ var _baseMap_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_baseMap.js */ "./node_modules/lodash-es/_baseMap.js");
/* harmony import */ var _baseSortBy_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./_baseSortBy.js */ "./node_modules/lodash-es/_baseSortBy.js");
/* harmony import */ var _baseUnary_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_baseUnary.js */ "./node_modules/lodash-es/_baseUnary.js");
/* harmony import */ var _compareMultiple_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./_compareMultiple.js */ "./node_modules/lodash-es/_compareMultiple.js");
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./identity.js */ "./node_modules/lodash-es/identity.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");










/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  if (iteratees.length) {
    iteratees = (0,_arrayMap_js__WEBPACK_IMPORTED_MODULE_0__["default"])(iteratees, function(iteratee) {
      if ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(iteratee)) {
        return function(value) {
          return (0,_baseGet_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value, iteratee.length === 1 ? iteratee[0] : iteratee);
        }
      }
      return iteratee;
    });
  } else {
    iteratees = [_identity_js__WEBPACK_IMPORTED_MODULE_3__["default"]];
  }

  var index = -1;
  iteratees = (0,_arrayMap_js__WEBPACK_IMPORTED_MODULE_0__["default"])(iteratees, (0,_baseUnary_js__WEBPACK_IMPORTED_MODULE_4__["default"])(_baseIteratee_js__WEBPACK_IMPORTED_MODULE_5__["default"]));

  var result = (0,_baseMap_js__WEBPACK_IMPORTED_MODULE_6__["default"])(collection, function(value, key, collection) {
    var criteria = (0,_arrayMap_js__WEBPACK_IMPORTED_MODULE_0__["default"])(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return (0,_baseSortBy_js__WEBPACK_IMPORTED_MODULE_7__["default"])(result, function(object, other) {
    return (0,_compareMultiple_js__WEBPACK_IMPORTED_MODULE_8__["default"])(object, other, orders);
  });
}

/* harmony default export */ __webpack_exports__["default"] = (baseOrderBy);


/***/ }),

/***/ "./node_modules/lodash-es/_basePick.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_basePick.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _basePickBy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_basePickBy.js */ "./node_modules/lodash-es/_basePickBy.js");
/* harmony import */ var _hasIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hasIn.js */ "./node_modules/lodash-es/hasIn.js");



/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, paths) {
  return (0,_basePickBy_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, paths, function(value, path) {
    return (0,_hasIn_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, path);
  });
}

/* harmony default export */ __webpack_exports__["default"] = (basePick);


/***/ }),

/***/ "./node_modules/lodash-es/_basePickBy.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_basePickBy.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGet_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseGet.js */ "./node_modules/lodash-es/_baseGet.js");
/* harmony import */ var _baseSet_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseSet.js */ "./node_modules/lodash-es/_baseSet.js");
/* harmony import */ var _castPath_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_castPath.js */ "./node_modules/lodash-es/_castPath.js");




/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};

  while (++index < length) {
    var path = paths[index],
        value = (0,_baseGet_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, path);

    if (predicate(value, path)) {
      (0,_baseSet_js__WEBPACK_IMPORTED_MODULE_1__["default"])(result, (0,_castPath_js__WEBPACK_IMPORTED_MODULE_2__["default"])(path, object), value);
    }
  }
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (basePickBy);


/***/ }),

/***/ "./node_modules/lodash-es/_baseProperty.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_baseProperty.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/* harmony default export */ __webpack_exports__["default"] = (baseProperty);


/***/ }),

/***/ "./node_modules/lodash-es/_basePropertyDeep.js":
/*!*****************************************************!*\
  !*** ./node_modules/lodash-es/_basePropertyDeep.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGet_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseGet.js */ "./node_modules/lodash-es/_baseGet.js");


/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return (0,_baseGet_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, path);
  };
}

/* harmony default export */ __webpack_exports__["default"] = (basePropertyDeep);


/***/ }),

/***/ "./node_modules/lodash-es/_baseRange.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseRange.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeMax = Math.max;

/**
 * The base implementation of `_.range` and `_.rangeRight` which doesn't
 * coerce arguments.
 *
 * @private
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number} step The value to increment or decrement by.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the range of numbers.
 */
function baseRange(start, end, step, fromRight) {
  var index = -1,
      length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (baseRange);


/***/ }),

/***/ "./node_modules/lodash-es/_baseReduce.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseReduce.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * The base implementation of `_.reduce` and `_.reduceRight`, without support
 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} accumulator The initial value.
 * @param {boolean} initAccum Specify using the first or last element of
 *  `collection` as the initial value.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the accumulated value.
 */
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function(value, index, collection) {
    accumulator = initAccum
      ? (initAccum = false, value)
      : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}

/* harmony default export */ __webpack_exports__["default"] = (baseReduce);


/***/ }),

/***/ "./node_modules/lodash-es/_baseSet.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_baseSet.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assignValue_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_assignValue.js */ "./node_modules/lodash-es/_assignValue.js");
/* harmony import */ var _castPath_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_castPath.js */ "./node_modules/lodash-es/_castPath.js");
/* harmony import */ var _isIndex_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_isIndex.js */ "./node_modules/lodash-es/_isIndex.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");
/* harmony import */ var _toKey_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_toKey.js */ "./node_modules/lodash-es/_toKey.js");






/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object)) {
    return object;
  }
  path = (0,_castPath_js__WEBPACK_IMPORTED_MODULE_1__["default"])(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = (0,_toKey_js__WEBPACK_IMPORTED_MODULE_2__["default"])(path[index]),
        newValue = value;

    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return object;
    }

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = (0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(objValue)
          ? objValue
          : ((0,_isIndex_js__WEBPACK_IMPORTED_MODULE_3__["default"])(path[index + 1]) ? [] : {});
      }
    }
    (0,_assignValue_js__WEBPACK_IMPORTED_MODULE_4__["default"])(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

/* harmony default export */ __webpack_exports__["default"] = (baseSet);


/***/ }),

/***/ "./node_modules/lodash-es/_baseSortBy.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseSortBy.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

/* harmony default export */ __webpack_exports__["default"] = (baseSortBy);


/***/ }),

/***/ "./node_modules/lodash-es/_baseToString.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_baseToString.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");
/* harmony import */ var _arrayMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_arrayMap.js */ "./node_modules/lodash-es/_arrayMap.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isSymbol.js */ "./node_modules/lodash-es/isSymbol.js");





/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return (0,_arrayMap_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value, baseToString) + '';
  }
  if ((0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/* harmony default export */ __webpack_exports__["default"] = (baseToString);


/***/ }),

/***/ "./node_modules/lodash-es/_baseTrim.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_baseTrim.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _trimmedEndIndex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_trimmedEndIndex.js */ "./node_modules/lodash-es/_trimmedEndIndex.js");


/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, (0,_trimmedEndIndex_js__WEBPACK_IMPORTED_MODULE_0__["default"])(string) + 1).replace(reTrimStart, '')
    : string;
}

/* harmony default export */ __webpack_exports__["default"] = (baseTrim);


/***/ }),

/***/ "./node_modules/lodash-es/_baseUniq.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_baseUniq.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SetCache_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_SetCache.js */ "./node_modules/lodash-es/_SetCache.js");
/* harmony import */ var _arrayIncludes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_arrayIncludes.js */ "./node_modules/lodash-es/_arrayIncludes.js");
/* harmony import */ var _arrayIncludesWith_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayIncludesWith.js */ "./node_modules/lodash-es/_arrayIncludesWith.js");
/* harmony import */ var _cacheHas_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_cacheHas.js */ "./node_modules/lodash-es/_cacheHas.js");
/* harmony import */ var _createSet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_createSet.js */ "./node_modules/lodash-es/_createSet.js");
/* harmony import */ var _setToArray_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_setToArray.js */ "./node_modules/lodash-es/_setToArray.js");







/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = _arrayIncludes_js__WEBPACK_IMPORTED_MODULE_0__["default"],
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = _arrayIncludesWith_js__WEBPACK_IMPORTED_MODULE_1__["default"];
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : (0,_createSet_js__WEBPACK_IMPORTED_MODULE_2__["default"])(array);
    if (set) {
      return (0,_setToArray_js__WEBPACK_IMPORTED_MODULE_3__["default"])(set);
    }
    isCommon = false;
    includes = _cacheHas_js__WEBPACK_IMPORTED_MODULE_4__["default"];
    seen = new _SetCache_js__WEBPACK_IMPORTED_MODULE_5__["default"];
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (baseUniq);


/***/ }),

/***/ "./node_modules/lodash-es/_baseValues.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseValues.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayMap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_arrayMap.js */ "./node_modules/lodash-es/_arrayMap.js");


/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return (0,_arrayMap_js__WEBPACK_IMPORTED_MODULE_0__["default"])(props, function(key) {
    return object[key];
  });
}

/* harmony default export */ __webpack_exports__["default"] = (baseValues);


/***/ }),

/***/ "./node_modules/lodash-es/_baseZipObject.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_baseZipObject.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
 *
 * @private
 * @param {Array} props The property identifiers.
 * @param {Array} values The property values.
 * @param {Function} assignFunc The function to assign values.
 * @returns {Object} Returns the new object.
 */
function baseZipObject(props, values, assignFunc) {
  var index = -1,
      length = props.length,
      valsLength = values.length,
      result = {};

  while (++index < length) {
    var value = index < valsLength ? values[index] : undefined;
    assignFunc(result, props[index], value);
  }
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (baseZipObject);


/***/ }),

/***/ "./node_modules/lodash-es/_cacheHas.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_cacheHas.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/* harmony default export */ __webpack_exports__["default"] = (cacheHas);


/***/ }),

/***/ "./node_modules/lodash-es/_castFunction.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_castFunction.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./identity.js */ "./node_modules/lodash-es/identity.js");


/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : _identity_js__WEBPACK_IMPORTED_MODULE_0__["default"];
}

/* harmony default export */ __webpack_exports__["default"] = (castFunction);


/***/ }),

/***/ "./node_modules/lodash-es/_castPath.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_castPath.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");
/* harmony import */ var _isKey_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isKey.js */ "./node_modules/lodash-es/_isKey.js");
/* harmony import */ var _stringToPath_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_stringToPath.js */ "./node_modules/lodash-es/_stringToPath.js");
/* harmony import */ var _toString_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./toString.js */ "./node_modules/lodash-es/toString.js");





/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value)) {
    return value;
  }
  return (0,_isKey_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value, object) ? [value] : (0,_stringToPath_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_toString_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value));
}

/* harmony default export */ __webpack_exports__["default"] = (castPath);


/***/ }),

/***/ "./node_modules/lodash-es/_cloneDataView.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_cloneDataView.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cloneArrayBuffer.js */ "./node_modules/lodash-es/_cloneArrayBuffer.js");


/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? (0,_cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/* harmony default export */ __webpack_exports__["default"] = (cloneDataView);


/***/ }),

/***/ "./node_modules/lodash-es/_cloneRegExp.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_cloneRegExp.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (cloneRegExp);


/***/ }),

/***/ "./node_modules/lodash-es/_cloneSymbol.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_cloneSymbol.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");


/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/* harmony default export */ __webpack_exports__["default"] = (cloneSymbol);


/***/ }),

/***/ "./node_modules/lodash-es/_compareAscending.js":
/*!*****************************************************!*\
  !*** ./node_modules/lodash-es/_compareAscending.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isSymbol.js */ "./node_modules/lodash-es/isSymbol.js");


/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = (0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = (0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_0__["default"])(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

/* harmony default export */ __webpack_exports__["default"] = (compareAscending);


/***/ }),

/***/ "./node_modules/lodash-es/_compareMultiple.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_compareMultiple.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _compareAscending_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_compareAscending.js */ "./node_modules/lodash-es/_compareAscending.js");


/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = (0,_compareAscending_js__WEBPACK_IMPORTED_MODULE_0__["default"])(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

/* harmony default export */ __webpack_exports__["default"] = (compareMultiple);


/***/ }),

/***/ "./node_modules/lodash-es/_copySymbols.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_copySymbols.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _copyObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_copyObject.js */ "./node_modules/lodash-es/_copyObject.js");
/* harmony import */ var _getSymbols_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getSymbols.js */ "./node_modules/lodash-es/_getSymbols.js");



/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return (0,_copyObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source, (0,_getSymbols_js__WEBPACK_IMPORTED_MODULE_1__["default"])(source), object);
}

/* harmony default export */ __webpack_exports__["default"] = (copySymbols);


/***/ }),

/***/ "./node_modules/lodash-es/_copySymbolsIn.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_copySymbolsIn.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _copyObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_copyObject.js */ "./node_modules/lodash-es/_copyObject.js");
/* harmony import */ var _getSymbolsIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getSymbolsIn.js */ "./node_modules/lodash-es/_getSymbolsIn.js");



/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return (0,_copyObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source, (0,_getSymbolsIn_js__WEBPACK_IMPORTED_MODULE_1__["default"])(source), object);
}

/* harmony default export */ __webpack_exports__["default"] = (copySymbolsIn);


/***/ }),

/***/ "./node_modules/lodash-es/_createBaseEach.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_createBaseEach.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArrayLike.js */ "./node_modules/lodash-es/isArrayLike.js");


/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/* harmony default export */ __webpack_exports__["default"] = (createBaseEach);


/***/ }),

/***/ "./node_modules/lodash-es/_createFind.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_createFind.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseIteratee_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseIteratee.js */ "./node_modules/lodash-es/_baseIteratee.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArrayLike.js */ "./node_modules/lodash-es/isArrayLike.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keys.js */ "./node_modules/lodash-es/keys.js");




/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(collection)) {
      var iteratee = (0,_baseIteratee_js__WEBPACK_IMPORTED_MODULE_1__["default"])(predicate, 3);
      collection = (0,_keys_js__WEBPACK_IMPORTED_MODULE_2__["default"])(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

/* harmony default export */ __webpack_exports__["default"] = (createFind);


/***/ }),

/***/ "./node_modules/lodash-es/_createRange.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_createRange.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseRange_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseRange.js */ "./node_modules/lodash-es/_baseRange.js");
/* harmony import */ var _isIterateeCall_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isIterateeCall.js */ "./node_modules/lodash-es/_isIterateeCall.js");
/* harmony import */ var _toFinite_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toFinite.js */ "./node_modules/lodash-es/toFinite.js");




/**
 * Creates a `_.range` or `_.rangeRight` function.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new range function.
 */
function createRange(fromRight) {
  return function(start, end, step) {
    if (step && typeof step != 'number' && (0,_isIterateeCall_js__WEBPACK_IMPORTED_MODULE_0__["default"])(start, end, step)) {
      end = step = undefined;
    }
    // Ensure the sign of `-0` is preserved.
    start = (0,_toFinite_js__WEBPACK_IMPORTED_MODULE_1__["default"])(start);
    if (end === undefined) {
      end = start;
      start = 0;
    } else {
      end = (0,_toFinite_js__WEBPACK_IMPORTED_MODULE_1__["default"])(end);
    }
    step = step === undefined ? (start < end ? 1 : -1) : (0,_toFinite_js__WEBPACK_IMPORTED_MODULE_1__["default"])(step);
    return (0,_baseRange_js__WEBPACK_IMPORTED_MODULE_2__["default"])(start, end, step, fromRight);
  };
}

/* harmony default export */ __webpack_exports__["default"] = (createRange);


/***/ }),

/***/ "./node_modules/lodash-es/_createSet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_createSet.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Set_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Set.js */ "./node_modules/lodash-es/_Set.js");
/* harmony import */ var _noop_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./noop.js */ "./node_modules/lodash-es/noop.js");
/* harmony import */ var _setToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setToArray.js */ "./node_modules/lodash-es/_setToArray.js");




/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(_Set_js__WEBPACK_IMPORTED_MODULE_0__["default"] && (1 / (0,_setToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(new _Set_js__WEBPACK_IMPORTED_MODULE_0__["default"]([,-0]))[1]) == INFINITY) ? _noop_js__WEBPACK_IMPORTED_MODULE_2__["default"] : function(values) {
  return new _Set_js__WEBPACK_IMPORTED_MODULE_0__["default"](values);
};

/* harmony default export */ __webpack_exports__["default"] = (createSet);


/***/ }),

/***/ "./node_modules/lodash-es/_equalArrays.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_equalArrays.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SetCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_SetCache.js */ "./node_modules/lodash-es/_SetCache.js");
/* harmony import */ var _arraySome_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arraySome.js */ "./node_modules/lodash-es/_arraySome.js");
/* harmony import */ var _cacheHas_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_cacheHas.js */ "./node_modules/lodash-es/_cacheHas.js");




/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache_js__WEBPACK_IMPORTED_MODULE_0__["default"] : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!(0,_arraySome_js__WEBPACK_IMPORTED_MODULE_1__["default"])(other, function(othValue, othIndex) {
            if (!(0,_cacheHas_js__WEBPACK_IMPORTED_MODULE_2__["default"])(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (equalArrays);


/***/ }),

/***/ "./node_modules/lodash-es/_equalByTag.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_equalByTag.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");
/* harmony import */ var _Uint8Array_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_Uint8Array.js */ "./node_modules/lodash-es/_Uint8Array.js");
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./eq.js */ "./node_modules/lodash-es/eq.js");
/* harmony import */ var _equalArrays_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_equalArrays.js */ "./node_modules/lodash-es/_equalArrays.js");
/* harmony import */ var _mapToArray_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_mapToArray.js */ "./node_modules/lodash-es/_mapToArray.js");
/* harmony import */ var _setToArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_setToArray.js */ "./node_modules/lodash-es/_setToArray.js");







/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array_js__WEBPACK_IMPORTED_MODULE_1__["default"](object), new _Uint8Array_js__WEBPACK_IMPORTED_MODULE_1__["default"](other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return (0,_eq_js__WEBPACK_IMPORTED_MODULE_2__["default"])(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = _mapToArray_js__WEBPACK_IMPORTED_MODULE_3__["default"];

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = _setToArray_js__WEBPACK_IMPORTED_MODULE_4__["default"]);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = (0,_equalArrays_js__WEBPACK_IMPORTED_MODULE_5__["default"])(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/* harmony default export */ __webpack_exports__["default"] = (equalByTag);


/***/ }),

/***/ "./node_modules/lodash-es/_equalObjects.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_equalObjects.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getAllKeys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getAllKeys.js */ "./node_modules/lodash-es/_getAllKeys.js");


/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = (0,_getAllKeys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object),
      objLength = objProps.length,
      othProps = (0,_getAllKeys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (equalObjects);


/***/ }),

/***/ "./node_modules/lodash-es/_flatRest.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_flatRest.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _flatten_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./flatten.js */ "./node_modules/lodash-es/flatten.js");
/* harmony import */ var _overRest_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_overRest.js */ "./node_modules/lodash-es/_overRest.js");
/* harmony import */ var _setToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setToString.js */ "./node_modules/lodash-es/_setToString.js");




/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return (0,_setToString_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_overRest_js__WEBPACK_IMPORTED_MODULE_1__["default"])(func, undefined, _flatten_js__WEBPACK_IMPORTED_MODULE_2__["default"]), func + '');
}

/* harmony default export */ __webpack_exports__["default"] = (flatRest);


/***/ }),

/***/ "./node_modules/lodash-es/_getAllKeys.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_getAllKeys.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGetAllKeys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseGetAllKeys.js */ "./node_modules/lodash-es/_baseGetAllKeys.js");
/* harmony import */ var _getSymbols_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getSymbols.js */ "./node_modules/lodash-es/_getSymbols.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/lodash-es/keys.js");




/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return (0,_baseGetAllKeys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, _keys_js__WEBPACK_IMPORTED_MODULE_1__["default"], _getSymbols_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
}

/* harmony default export */ __webpack_exports__["default"] = (getAllKeys);


/***/ }),

/***/ "./node_modules/lodash-es/_getAllKeysIn.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_getAllKeysIn.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGetAllKeys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseGetAllKeys.js */ "./node_modules/lodash-es/_baseGetAllKeys.js");
/* harmony import */ var _getSymbolsIn_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getSymbolsIn.js */ "./node_modules/lodash-es/_getSymbolsIn.js");
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keysIn.js */ "./node_modules/lodash-es/keysIn.js");




/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return (0,_baseGetAllKeys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, _keysIn_js__WEBPACK_IMPORTED_MODULE_1__["default"], _getSymbolsIn_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
}

/* harmony default export */ __webpack_exports__["default"] = (getAllKeysIn);


/***/ }),

/***/ "./node_modules/lodash-es/_getMatchData.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_getMatchData.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isStrictComparable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isStrictComparable.js */ "./node_modules/lodash-es/_isStrictComparable.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keys.js */ "./node_modules/lodash-es/keys.js");



/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = (0,_keys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, (0,_isStrictComparable_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)];
  }
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (getMatchData);


/***/ }),

/***/ "./node_modules/lodash-es/_getSymbols.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_getSymbols.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayFilter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayFilter.js */ "./node_modules/lodash-es/_arrayFilter.js");
/* harmony import */ var _stubArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stubArray.js */ "./node_modules/lodash-es/stubArray.js");



/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? _stubArray_js__WEBPACK_IMPORTED_MODULE_0__["default"] : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return (0,_arrayFilter_js__WEBPACK_IMPORTED_MODULE_1__["default"])(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/* harmony default export */ __webpack_exports__["default"] = (getSymbols);


/***/ }),

/***/ "./node_modules/lodash-es/_getSymbolsIn.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_getSymbolsIn.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayPush_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayPush.js */ "./node_modules/lodash-es/_arrayPush.js");
/* harmony import */ var _getPrototype_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_getPrototype.js */ "./node_modules/lodash-es/_getPrototype.js");
/* harmony import */ var _getSymbols_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getSymbols.js */ "./node_modules/lodash-es/_getSymbols.js");
/* harmony import */ var _stubArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stubArray.js */ "./node_modules/lodash-es/stubArray.js");





/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? _stubArray_js__WEBPACK_IMPORTED_MODULE_0__["default"] : function(object) {
  var result = [];
  while (object) {
    (0,_arrayPush_js__WEBPACK_IMPORTED_MODULE_1__["default"])(result, (0,_getSymbols_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object));
    object = (0,_getPrototype_js__WEBPACK_IMPORTED_MODULE_3__["default"])(object);
  }
  return result;
};

/* harmony default export */ __webpack_exports__["default"] = (getSymbolsIn);


/***/ }),

/***/ "./node_modules/lodash-es/_hasPath.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_hasPath.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _castPath_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_castPath.js */ "./node_modules/lodash-es/_castPath.js");
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isArguments.js */ "./node_modules/lodash-es/isArguments.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");
/* harmony import */ var _isIndex_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_isIndex.js */ "./node_modules/lodash-es/_isIndex.js");
/* harmony import */ var _isLength_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isLength.js */ "./node_modules/lodash-es/isLength.js");
/* harmony import */ var _toKey_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_toKey.js */ "./node_modules/lodash-es/_toKey.js");







/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = (0,_castPath_js__WEBPACK_IMPORTED_MODULE_0__["default"])(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = (0,_toKey_js__WEBPACK_IMPORTED_MODULE_1__["default"])(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && (0,_isLength_js__WEBPACK_IMPORTED_MODULE_2__["default"])(length) && (0,_isIndex_js__WEBPACK_IMPORTED_MODULE_3__["default"])(key, length) &&
    ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(object) || (0,_isArguments_js__WEBPACK_IMPORTED_MODULE_5__["default"])(object));
}

/* harmony default export */ __webpack_exports__["default"] = (hasPath);


/***/ }),

/***/ "./node_modules/lodash-es/_hasUnicode.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_hasUnicode.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

/* harmony default export */ __webpack_exports__["default"] = (hasUnicode);


/***/ }),

/***/ "./node_modules/lodash-es/_initCloneArray.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_initCloneArray.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (initCloneArray);


/***/ }),

/***/ "./node_modules/lodash-es/_initCloneByTag.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_initCloneByTag.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cloneArrayBuffer.js */ "./node_modules/lodash-es/_cloneArrayBuffer.js");
/* harmony import */ var _cloneDataView_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_cloneDataView.js */ "./node_modules/lodash-es/_cloneDataView.js");
/* harmony import */ var _cloneRegExp_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_cloneRegExp.js */ "./node_modules/lodash-es/_cloneRegExp.js");
/* harmony import */ var _cloneSymbol_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_cloneSymbol.js */ "./node_modules/lodash-es/_cloneSymbol.js");
/* harmony import */ var _cloneTypedArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_cloneTypedArray.js */ "./node_modules/lodash-es/_cloneTypedArray.js");






/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return (0,_cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return (0,_cloneDataView_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return (0,_cloneTypedArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return (0,_cloneRegExp_js__WEBPACK_IMPORTED_MODULE_3__["default"])(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return (0,_cloneSymbol_js__WEBPACK_IMPORTED_MODULE_4__["default"])(object);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (initCloneByTag);


/***/ }),

/***/ "./node_modules/lodash-es/_isFlattenable.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_isFlattenable.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isArguments.js */ "./node_modules/lodash-es/isArguments.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");




/** Built-in value references. */
var spreadableSymbol = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return (0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) || (0,_isArguments_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/* harmony default export */ __webpack_exports__["default"] = (isFlattenable);


/***/ }),

/***/ "./node_modules/lodash-es/_isKey.js":
/*!******************************************!*\
  !*** ./node_modules/lodash-es/_isKey.js ***!
  \******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isSymbol.js */ "./node_modules/lodash-es/isSymbol.js");



/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || (0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/* harmony default export */ __webpack_exports__["default"] = (isKey);


/***/ }),

/***/ "./node_modules/lodash-es/_isStrictComparable.js":
/*!*******************************************************!*\
  !*** ./node_modules/lodash-es/_isStrictComparable.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");


/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value);
}

/* harmony default export */ __webpack_exports__["default"] = (isStrictComparable);


/***/ }),

/***/ "./node_modules/lodash-es/_mapToArray.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_mapToArray.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (mapToArray);


/***/ }),

/***/ "./node_modules/lodash-es/_matchesStrictComparable.js":
/*!************************************************************!*\
  !*** ./node_modules/lodash-es/_matchesStrictComparable.js ***!
  \************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

/* harmony default export */ __webpack_exports__["default"] = (matchesStrictComparable);


/***/ }),

/***/ "./node_modules/lodash-es/_memoizeCapped.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_memoizeCapped.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _memoize_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./memoize.js */ "./node_modules/lodash-es/memoize.js");


/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = (0,_memoize_js__WEBPACK_IMPORTED_MODULE_0__["default"])(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (memoizeCapped);


/***/ }),

/***/ "./node_modules/lodash-es/_setCacheAdd.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_setCacheAdd.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/* harmony default export */ __webpack_exports__["default"] = (setCacheAdd);


/***/ }),

/***/ "./node_modules/lodash-es/_setCacheHas.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_setCacheHas.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

/* harmony default export */ __webpack_exports__["default"] = (setCacheHas);


/***/ }),

/***/ "./node_modules/lodash-es/_setToArray.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_setToArray.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (setToArray);


/***/ }),

/***/ "./node_modules/lodash-es/_strictIndexOf.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_strictIndexOf.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/* harmony default export */ __webpack_exports__["default"] = (strictIndexOf);


/***/ }),

/***/ "./node_modules/lodash-es/_stringSize.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_stringSize.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _asciiSize_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_asciiSize.js */ "./node_modules/lodash-es/_asciiSize.js");
/* harmony import */ var _hasUnicode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_hasUnicode.js */ "./node_modules/lodash-es/_hasUnicode.js");
/* harmony import */ var _unicodeSize_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_unicodeSize.js */ "./node_modules/lodash-es/_unicodeSize.js");




/**
 * Gets the number of symbols in `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the string size.
 */
function stringSize(string) {
  return (0,_hasUnicode_js__WEBPACK_IMPORTED_MODULE_0__["default"])(string)
    ? (0,_unicodeSize_js__WEBPACK_IMPORTED_MODULE_1__["default"])(string)
    : (0,_asciiSize_js__WEBPACK_IMPORTED_MODULE_2__["default"])(string);
}

/* harmony default export */ __webpack_exports__["default"] = (stringSize);


/***/ }),

/***/ "./node_modules/lodash-es/_stringToPath.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_stringToPath.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _memoizeCapped_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_memoizeCapped.js */ "./node_modules/lodash-es/_memoizeCapped.js");


/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = (0,_memoizeCapped_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/* harmony default export */ __webpack_exports__["default"] = (stringToPath);


/***/ }),

/***/ "./node_modules/lodash-es/_toKey.js":
/*!******************************************!*\
  !*** ./node_modules/lodash-es/_toKey.js ***!
  \******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isSymbol.js */ "./node_modules/lodash-es/isSymbol.js");


/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || (0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/* harmony default export */ __webpack_exports__["default"] = (toKey);


/***/ }),

/***/ "./node_modules/lodash-es/_trimmedEndIndex.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_trimmedEndIndex.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

/* harmony default export */ __webpack_exports__["default"] = (trimmedEndIndex);


/***/ }),

/***/ "./node_modules/lodash-es/_unicodeSize.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_unicodeSize.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Gets the size of a Unicode `string`.
 *
 * @private
 * @param {string} string The string inspect.
 * @returns {number} Returns the string size.
 */
function unicodeSize(string) {
  var result = reUnicode.lastIndex = 0;
  while (reUnicode.test(string)) {
    ++result;
  }
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (unicodeSize);


/***/ }),

/***/ "./node_modules/lodash-es/cloneDeep.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/cloneDeep.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseClone_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseClone.js */ "./node_modules/lodash-es/_baseClone.js");


/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return (0,_baseClone_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

/* harmony default export */ __webpack_exports__["default"] = (cloneDeep);


/***/ }),

/***/ "./node_modules/lodash-es/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/defaults.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseRest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseRest.js */ "./node_modules/lodash-es/_baseRest.js");
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eq.js */ "./node_modules/lodash-es/eq.js");
/* harmony import */ var _isIterateeCall_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isIterateeCall.js */ "./node_modules/lodash-es/_isIterateeCall.js");
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keysIn.js */ "./node_modules/lodash-es/keysIn.js");





/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = (0,_baseRest_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function(object, sources) {
  object = Object(object);

  var index = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : undefined;

  if (guard && (0,_isIterateeCall_js__WEBPACK_IMPORTED_MODULE_1__["default"])(sources[0], sources[1], guard)) {
    length = 1;
  }

  while (++index < length) {
    var source = sources[index];
    var props = (0,_keysIn_js__WEBPACK_IMPORTED_MODULE_2__["default"])(source);
    var propsIndex = -1;
    var propsLength = props.length;

    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];

      if (value === undefined ||
          ((0,_eq_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        object[key] = source[key];
      }
    }
  }

  return object;
});

/* harmony default export */ __webpack_exports__["default"] = (defaults);


/***/ }),

/***/ "./node_modules/lodash-es/filter.js":
/*!******************************************!*\
  !*** ./node_modules/lodash-es/filter.js ***!
  \******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayFilter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayFilter.js */ "./node_modules/lodash-es/_arrayFilter.js");
/* harmony import */ var _baseFilter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseFilter.js */ "./node_modules/lodash-es/_baseFilter.js");
/* harmony import */ var _baseIteratee_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_baseIteratee.js */ "./node_modules/lodash-es/_baseIteratee.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");





/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 *
 * // Combining several predicates using `_.overEvery` or `_.overSome`.
 * _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
 * // => objects for ['fred', 'barney']
 */
function filter(collection, predicate) {
  var func = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(collection) ? _arrayFilter_js__WEBPACK_IMPORTED_MODULE_1__["default"] : _baseFilter_js__WEBPACK_IMPORTED_MODULE_2__["default"];
  return func(collection, (0,_baseIteratee_js__WEBPACK_IMPORTED_MODULE_3__["default"])(predicate, 3));
}

/* harmony default export */ __webpack_exports__["default"] = (filter);


/***/ }),

/***/ "./node_modules/lodash-es/find.js":
/*!****************************************!*\
  !*** ./node_modules/lodash-es/find.js ***!
  \****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _createFind_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createFind.js */ "./node_modules/lodash-es/_createFind.js");
/* harmony import */ var _findIndex_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./findIndex.js */ "./node_modules/lodash-es/findIndex.js");



/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = (0,_createFind_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_findIndex_js__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (find);


/***/ }),

/***/ "./node_modules/lodash-es/findIndex.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/findIndex.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseFindIndex_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseFindIndex.js */ "./node_modules/lodash-es/_baseFindIndex.js");
/* harmony import */ var _baseIteratee_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseIteratee.js */ "./node_modules/lodash-es/_baseIteratee.js");
/* harmony import */ var _toInteger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toInteger.js */ "./node_modules/lodash-es/toInteger.js");




/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : (0,_toInteger_js__WEBPACK_IMPORTED_MODULE_0__["default"])(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return (0,_baseFindIndex_js__WEBPACK_IMPORTED_MODULE_1__["default"])(array, (0,_baseIteratee_js__WEBPACK_IMPORTED_MODULE_2__["default"])(predicate, 3), index);
}

/* harmony default export */ __webpack_exports__["default"] = (findIndex);


/***/ }),

/***/ "./node_modules/lodash-es/flatten.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/flatten.js ***!
  \*******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseFlatten_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseFlatten.js */ "./node_modules/lodash-es/_baseFlatten.js");


/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? (0,_baseFlatten_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array, 1) : [];
}

/* harmony default export */ __webpack_exports__["default"] = (flatten);


/***/ }),

/***/ "./node_modules/lodash-es/forEach.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/forEach.js ***!
  \*******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayEach_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayEach.js */ "./node_modules/lodash-es/_arrayEach.js");
/* harmony import */ var _baseEach_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseEach.js */ "./node_modules/lodash-es/_baseEach.js");
/* harmony import */ var _castFunction_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_castFunction.js */ "./node_modules/lodash-es/_castFunction.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");





/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(collection) ? _arrayEach_js__WEBPACK_IMPORTED_MODULE_1__["default"] : _baseEach_js__WEBPACK_IMPORTED_MODULE_2__["default"];
  return func(collection, (0,_castFunction_js__WEBPACK_IMPORTED_MODULE_3__["default"])(iteratee));
}

/* harmony default export */ __webpack_exports__["default"] = (forEach);


/***/ }),

/***/ "./node_modules/lodash-es/forIn.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/forIn.js ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseFor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseFor.js */ "./node_modules/lodash-es/_baseFor.js");
/* harmony import */ var _castFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_castFunction.js */ "./node_modules/lodash-es/_castFunction.js");
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keysIn.js */ "./node_modules/lodash-es/keysIn.js");




/**
 * Iterates over own and inherited enumerable string keyed properties of an
 * object and invokes `iteratee` for each property. The iteratee is invoked
 * with three arguments: (value, key, object). Iteratee functions may exit
 * iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 0.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forInRight
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forIn(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
 */
function forIn(object, iteratee) {
  return object == null
    ? object
    : (0,_baseFor_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, (0,_castFunction_js__WEBPACK_IMPORTED_MODULE_1__["default"])(iteratee), _keysIn_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
}

/* harmony default export */ __webpack_exports__["default"] = (forIn);


/***/ }),

/***/ "./node_modules/lodash-es/forOwn.js":
/*!******************************************!*\
  !*** ./node_modules/lodash-es/forOwn.js ***!
  \******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseForOwn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseForOwn.js */ "./node_modules/lodash-es/_baseForOwn.js");
/* harmony import */ var _castFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_castFunction.js */ "./node_modules/lodash-es/_castFunction.js");



/**
 * Iterates over own enumerable string keyed properties of an object and
 * invokes `iteratee` for each property. The iteratee is invoked with three
 * arguments: (value, key, object). Iteratee functions may exit iteration
 * early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 0.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forOwnRight
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forOwn(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forOwn(object, iteratee) {
  return object && (0,_baseForOwn_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, (0,_castFunction_js__WEBPACK_IMPORTED_MODULE_1__["default"])(iteratee));
}

/* harmony default export */ __webpack_exports__["default"] = (forOwn);


/***/ }),

/***/ "./node_modules/lodash-es/get.js":
/*!***************************************!*\
  !*** ./node_modules/lodash-es/get.js ***!
  \***************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGet_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseGet.js */ "./node_modules/lodash-es/_baseGet.js");


/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : (0,_baseGet_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, path);
  return result === undefined ? defaultValue : result;
}

/* harmony default export */ __webpack_exports__["default"] = (get);


/***/ }),

/***/ "./node_modules/lodash-es/has.js":
/*!***************************************!*\
  !*** ./node_modules/lodash-es/has.js ***!
  \***************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseHas_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseHas.js */ "./node_modules/lodash-es/_baseHas.js");
/* harmony import */ var _hasPath_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_hasPath.js */ "./node_modules/lodash-es/_hasPath.js");



/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && (0,_hasPath_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, path, _baseHas_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
}

/* harmony default export */ __webpack_exports__["default"] = (has);


/***/ }),

/***/ "./node_modules/lodash-es/hasIn.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/hasIn.js ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseHasIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseHasIn.js */ "./node_modules/lodash-es/_baseHasIn.js");
/* harmony import */ var _hasPath_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_hasPath.js */ "./node_modules/lodash-es/_hasPath.js");



/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && (0,_hasPath_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, path, _baseHasIn_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
}

/* harmony default export */ __webpack_exports__["default"] = (hasIn);


/***/ }),

/***/ "./node_modules/lodash-es/isMap.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/isMap.js ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseIsMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseIsMap.js */ "./node_modules/lodash-es/_baseIsMap.js");
/* harmony import */ var _baseUnary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseUnary.js */ "./node_modules/lodash-es/_baseUnary.js");
/* harmony import */ var _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nodeUtil.js */ "./node_modules/lodash-es/_nodeUtil.js");




/* Node.js helper references. */
var nodeIsMap = _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__["default"] && _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__["default"].isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? (0,_baseUnary_js__WEBPACK_IMPORTED_MODULE_1__["default"])(nodeIsMap) : _baseIsMap_js__WEBPACK_IMPORTED_MODULE_2__["default"];

/* harmony default export */ __webpack_exports__["default"] = (isMap);


/***/ }),

/***/ "./node_modules/lodash-es/isSet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/isSet.js ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseIsSet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseIsSet.js */ "./node_modules/lodash-es/_baseIsSet.js");
/* harmony import */ var _baseUnary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseUnary.js */ "./node_modules/lodash-es/_baseUnary.js");
/* harmony import */ var _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nodeUtil.js */ "./node_modules/lodash-es/_nodeUtil.js");




/* Node.js helper references. */
var nodeIsSet = _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__["default"] && _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__["default"].isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? (0,_baseUnary_js__WEBPACK_IMPORTED_MODULE_1__["default"])(nodeIsSet) : _baseIsSet_js__WEBPACK_IMPORTED_MODULE_2__["default"];

/* harmony default export */ __webpack_exports__["default"] = (isSet);


/***/ }),

/***/ "./node_modules/lodash-es/isString.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/isString.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseGetTag.js */ "./node_modules/lodash-es/_baseGetTag.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");




/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!(0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) && (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value) == stringTag);
}

/* harmony default export */ __webpack_exports__["default"] = (isString);


/***/ }),

/***/ "./node_modules/lodash-es/isSymbol.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/isSymbol.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseGetTag.js */ "./node_modules/lodash-es/_baseGetTag.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");



/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    ((0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) == symbolTag);
}

/* harmony default export */ __webpack_exports__["default"] = (isSymbol);


/***/ }),

/***/ "./node_modules/lodash-es/isUndefined.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/isUndefined.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

/* harmony default export */ __webpack_exports__["default"] = (isUndefined);


/***/ }),

/***/ "./node_modules/lodash-es/keys.js":
/*!****************************************!*\
  !*** ./node_modules/lodash-es/keys.js ***!
  \****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayLikeKeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayLikeKeys.js */ "./node_modules/lodash-es/_arrayLikeKeys.js");
/* harmony import */ var _baseKeys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseKeys.js */ "./node_modules/lodash-es/_baseKeys.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArrayLike.js */ "./node_modules/lodash-es/isArrayLike.js");




/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object) ? (0,_arrayLikeKeys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object) : (0,_baseKeys_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object);
}

/* harmony default export */ __webpack_exports__["default"] = (keys);


/***/ }),

/***/ "./node_modules/lodash-es/last.js":
/*!****************************************!*\
  !*** ./node_modules/lodash-es/last.js ***!
  \****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

/* harmony default export */ __webpack_exports__["default"] = (last);


/***/ }),

/***/ "./node_modules/lodash-es/map.js":
/*!***************************************!*\
  !*** ./node_modules/lodash-es/map.js ***!
  \***************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayMap.js */ "./node_modules/lodash-es/_arrayMap.js");
/* harmony import */ var _baseIteratee_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_baseIteratee.js */ "./node_modules/lodash-es/_baseIteratee.js");
/* harmony import */ var _baseMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseMap.js */ "./node_modules/lodash-es/_baseMap.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");





/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(collection) ? _arrayMap_js__WEBPACK_IMPORTED_MODULE_1__["default"] : _baseMap_js__WEBPACK_IMPORTED_MODULE_2__["default"];
  return func(collection, (0,_baseIteratee_js__WEBPACK_IMPORTED_MODULE_3__["default"])(iteratee, 3));
}

/* harmony default export */ __webpack_exports__["default"] = (map);


/***/ }),

/***/ "./node_modules/lodash-es/mapValues.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/mapValues.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseAssignValue_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseAssignValue.js */ "./node_modules/lodash-es/_baseAssignValue.js");
/* harmony import */ var _baseForOwn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseForOwn.js */ "./node_modules/lodash-es/_baseForOwn.js");
/* harmony import */ var _baseIteratee_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseIteratee.js */ "./node_modules/lodash-es/_baseIteratee.js");




/**
 * Creates an object with the same keys as `object` and values generated
 * by running each own enumerable string keyed property of `object` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapKeys
 * @example
 *
 * var users = {
 *   'fred':    { 'user': 'fred',    'age': 40 },
 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
 * };
 *
 * _.mapValues(users, function(o) { return o.age; });
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 *
 * // The `_.property` iteratee shorthand.
 * _.mapValues(users, 'age');
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 */
function mapValues(object, iteratee) {
  var result = {};
  iteratee = (0,_baseIteratee_js__WEBPACK_IMPORTED_MODULE_0__["default"])(iteratee, 3);

  (0,_baseForOwn_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, function(value, key, object) {
    (0,_baseAssignValue_js__WEBPACK_IMPORTED_MODULE_2__["default"])(result, key, iteratee(value, key, object));
  });
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (mapValues);


/***/ }),

/***/ "./node_modules/lodash-es/max.js":
/*!***************************************!*\
  !*** ./node_modules/lodash-es/max.js ***!
  \***************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseExtremum_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseExtremum.js */ "./node_modules/lodash-es/_baseExtremum.js");
/* harmony import */ var _baseGt_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseGt.js */ "./node_modules/lodash-es/_baseGt.js");
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./identity.js */ "./node_modules/lodash-es/identity.js");




/**
 * Computes the maximum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * _.max([4, 2, 8, 6]);
 * // => 8
 *
 * _.max([]);
 * // => undefined
 */
function max(array) {
  return (array && array.length)
    ? (0,_baseExtremum_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array, _identity_js__WEBPACK_IMPORTED_MODULE_1__["default"], _baseGt_js__WEBPACK_IMPORTED_MODULE_2__["default"])
    : undefined;
}

/* harmony default export */ __webpack_exports__["default"] = (max);


/***/ }),

/***/ "./node_modules/lodash-es/min.js":
/*!***************************************!*\
  !*** ./node_modules/lodash-es/min.js ***!
  \***************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseExtremum_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseExtremum.js */ "./node_modules/lodash-es/_baseExtremum.js");
/* harmony import */ var _baseLt_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseLt.js */ "./node_modules/lodash-es/_baseLt.js");
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./identity.js */ "./node_modules/lodash-es/identity.js");




/**
 * Computes the minimum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * _.min([4, 2, 8, 6]);
 * // => 2
 *
 * _.min([]);
 * // => undefined
 */
function min(array) {
  return (array && array.length)
    ? (0,_baseExtremum_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array, _identity_js__WEBPACK_IMPORTED_MODULE_1__["default"], _baseLt_js__WEBPACK_IMPORTED_MODULE_2__["default"])
    : undefined;
}

/* harmony default export */ __webpack_exports__["default"] = (min);


/***/ }),

/***/ "./node_modules/lodash-es/minBy.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/minBy.js ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseExtremum_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseExtremum.js */ "./node_modules/lodash-es/_baseExtremum.js");
/* harmony import */ var _baseIteratee_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseIteratee.js */ "./node_modules/lodash-es/_baseIteratee.js");
/* harmony import */ var _baseLt_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseLt.js */ "./node_modules/lodash-es/_baseLt.js");




/**
 * This method is like `_.min` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * the value is ranked. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * var objects = [{ 'n': 1 }, { 'n': 2 }];
 *
 * _.minBy(objects, function(o) { return o.n; });
 * // => { 'n': 1 }
 *
 * // The `_.property` iteratee shorthand.
 * _.minBy(objects, 'n');
 * // => { 'n': 1 }
 */
function minBy(array, iteratee) {
  return (array && array.length)
    ? (0,_baseExtremum_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array, (0,_baseIteratee_js__WEBPACK_IMPORTED_MODULE_1__["default"])(iteratee, 2), _baseLt_js__WEBPACK_IMPORTED_MODULE_2__["default"])
    : undefined;
}

/* harmony default export */ __webpack_exports__["default"] = (minBy);


/***/ }),

/***/ "./node_modules/lodash-es/noop.js":
/*!****************************************!*\
  !*** ./node_modules/lodash-es/noop.js ***!
  \****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

/* harmony default export */ __webpack_exports__["default"] = (noop);


/***/ }),

/***/ "./node_modules/lodash-es/now.js":
/*!***************************************!*\
  !*** ./node_modules/lodash-es/now.js ***!
  \***************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");


/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Date.now();
};

/* harmony default export */ __webpack_exports__["default"] = (now);


/***/ }),

/***/ "./node_modules/lodash-es/pick.js":
/*!****************************************!*\
  !*** ./node_modules/lodash-es/pick.js ***!
  \****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _basePick_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_basePick.js */ "./node_modules/lodash-es/_basePick.js");
/* harmony import */ var _flatRest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_flatRest.js */ "./node_modules/lodash-es/_flatRest.js");



/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = (0,_flatRest_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function(object, paths) {
  return object == null ? {} : (0,_basePick_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, paths);
});

/* harmony default export */ __webpack_exports__["default"] = (pick);


/***/ }),

/***/ "./node_modules/lodash-es/property.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/property.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseProperty_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseProperty.js */ "./node_modules/lodash-es/_baseProperty.js");
/* harmony import */ var _basePropertyDeep_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_basePropertyDeep.js */ "./node_modules/lodash-es/_basePropertyDeep.js");
/* harmony import */ var _isKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isKey.js */ "./node_modules/lodash-es/_isKey.js");
/* harmony import */ var _toKey_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_toKey.js */ "./node_modules/lodash-es/_toKey.js");





/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return (0,_isKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(path) ? (0,_baseProperty_js__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_toKey_js__WEBPACK_IMPORTED_MODULE_2__["default"])(path)) : (0,_basePropertyDeep_js__WEBPACK_IMPORTED_MODULE_3__["default"])(path);
}

/* harmony default export */ __webpack_exports__["default"] = (property);


/***/ }),

/***/ "./node_modules/lodash-es/range.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/range.js ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _createRange_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createRange.js */ "./node_modules/lodash-es/_createRange.js");


/**
 * Creates an array of numbers (positive and/or negative) progressing from
 * `start` up to, but not including, `end`. A step of `-1` is used if a negative
 * `start` is specified without an `end` or `step`. If `end` is not specified,
 * it's set to `start` with `start` then set to `0`.
 *
 * **Note:** JavaScript follows the IEEE-754 standard for resolving
 * floating-point values which can produce unexpected results.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the range of numbers.
 * @see _.inRange, _.rangeRight
 * @example
 *
 * _.range(4);
 * // => [0, 1, 2, 3]
 *
 * _.range(-4);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * _.range(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * _.range(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.range(0);
 * // => []
 */
var range = (0,_createRange_js__WEBPACK_IMPORTED_MODULE_0__["default"])();

/* harmony default export */ __webpack_exports__["default"] = (range);


/***/ }),

/***/ "./node_modules/lodash-es/reduce.js":
/*!******************************************!*\
  !*** ./node_modules/lodash-es/reduce.js ***!
  \******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayReduce_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayReduce.js */ "./node_modules/lodash-es/_arrayReduce.js");
/* harmony import */ var _baseEach_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_baseEach.js */ "./node_modules/lodash-es/_baseEach.js");
/* harmony import */ var _baseIteratee_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_baseIteratee.js */ "./node_modules/lodash-es/_baseIteratee.js");
/* harmony import */ var _baseReduce_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseReduce.js */ "./node_modules/lodash-es/_baseReduce.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");






/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` thru `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not given, the first element of `collection` is used as the initial
 * value. The iteratee is invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
 * and `sortBy`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduceRight
 * @example
 *
 * _.reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * }, 0);
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 *   return result;
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
 */
function reduce(collection, iteratee, accumulator) {
  var func = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(collection) ? _arrayReduce_js__WEBPACK_IMPORTED_MODULE_1__["default"] : _baseReduce_js__WEBPACK_IMPORTED_MODULE_2__["default"],
      initAccum = arguments.length < 3;

  return func(collection, (0,_baseIteratee_js__WEBPACK_IMPORTED_MODULE_3__["default"])(iteratee, 4), accumulator, initAccum, _baseEach_js__WEBPACK_IMPORTED_MODULE_4__["default"]);
}

/* harmony default export */ __webpack_exports__["default"] = (reduce);


/***/ }),

/***/ "./node_modules/lodash-es/size.js":
/*!****************************************!*\
  !*** ./node_modules/lodash-es/size.js ***!
  \****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseKeys_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_baseKeys.js */ "./node_modules/lodash-es/_baseKeys.js");
/* harmony import */ var _getTag_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_getTag.js */ "./node_modules/lodash-es/_getTag.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArrayLike.js */ "./node_modules/lodash-es/isArrayLike.js");
/* harmony import */ var _isString_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isString.js */ "./node_modules/lodash-es/isString.js");
/* harmony import */ var _stringSize_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_stringSize.js */ "./node_modules/lodash-es/_stringSize.js");






/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/**
 * Gets the size of `collection` by returning its length for array-like
 * values or the number of own enumerable string keyed properties for objects.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @returns {number} Returns the collection size.
 * @example
 *
 * _.size([1, 2, 3]);
 * // => 3
 *
 * _.size({ 'a': 1, 'b': 2 });
 * // => 2
 *
 * _.size('pebbles');
 * // => 7
 */
function size(collection) {
  if (collection == null) {
    return 0;
  }
  if ((0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(collection)) {
    return (0,_isString_js__WEBPACK_IMPORTED_MODULE_1__["default"])(collection) ? (0,_stringSize_js__WEBPACK_IMPORTED_MODULE_2__["default"])(collection) : collection.length;
  }
  var tag = (0,_getTag_js__WEBPACK_IMPORTED_MODULE_3__["default"])(collection);
  if (tag == mapTag || tag == setTag) {
    return collection.size;
  }
  return (0,_baseKeys_js__WEBPACK_IMPORTED_MODULE_4__["default"])(collection).length;
}

/* harmony default export */ __webpack_exports__["default"] = (size);


/***/ }),

/***/ "./node_modules/lodash-es/sortBy.js":
/*!******************************************!*\
  !*** ./node_modules/lodash-es/sortBy.js ***!
  \******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseFlatten_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_baseFlatten.js */ "./node_modules/lodash-es/_baseFlatten.js");
/* harmony import */ var _baseOrderBy_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseOrderBy.js */ "./node_modules/lodash-es/_baseOrderBy.js");
/* harmony import */ var _baseRest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseRest.js */ "./node_modules/lodash-es/_baseRest.js");
/* harmony import */ var _isIterateeCall_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isIterateeCall.js */ "./node_modules/lodash-es/_isIterateeCall.js");





/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Function|Function[])} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 30 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, [function(o) { return o.user; }]);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
 */
var sortBy = (0,_baseRest_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && (0,_isIterateeCall_js__WEBPACK_IMPORTED_MODULE_1__["default"])(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && (0,_isIterateeCall_js__WEBPACK_IMPORTED_MODULE_1__["default"])(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  return (0,_baseOrderBy_js__WEBPACK_IMPORTED_MODULE_2__["default"])(collection, (0,_baseFlatten_js__WEBPACK_IMPORTED_MODULE_3__["default"])(iteratees, 1), []);
});

/* harmony default export */ __webpack_exports__["default"] = (sortBy);


/***/ }),

/***/ "./node_modules/lodash-es/stubArray.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/stubArray.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/* harmony default export */ __webpack_exports__["default"] = (stubArray);


/***/ }),

/***/ "./node_modules/lodash-es/toFinite.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/toFinite.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _toNumber_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toNumber.js */ "./node_modules/lodash-es/toNumber.js");


/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = (0,_toNumber_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/* harmony default export */ __webpack_exports__["default"] = (toFinite);


/***/ }),

/***/ "./node_modules/lodash-es/toInteger.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/toInteger.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _toFinite_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toFinite.js */ "./node_modules/lodash-es/toFinite.js");


/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = (0,_toFinite_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

/* harmony default export */ __webpack_exports__["default"] = (toInteger);


/***/ }),

/***/ "./node_modules/lodash-es/toNumber.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/toNumber.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseTrim_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseTrim.js */ "./node_modules/lodash-es/_baseTrim.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isSymbol.js */ "./node_modules/lodash-es/isSymbol.js");




/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if ((0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value)) {
    return NAN;
  }
  if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = (0,_isObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = (0,_baseTrim_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/* harmony default export */ __webpack_exports__["default"] = (toNumber);


/***/ }),

/***/ "./node_modules/lodash-es/toString.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/toString.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseToString.js */ "./node_modules/lodash-es/_baseToString.js");


/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : (0,_baseToString_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value);
}

/* harmony default export */ __webpack_exports__["default"] = (toString);


/***/ }),

/***/ "./node_modules/lodash-es/transform.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/transform.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayEach_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./_arrayEach.js */ "./node_modules/lodash-es/_arrayEach.js");
/* harmony import */ var _baseCreate_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_baseCreate.js */ "./node_modules/lodash-es/_baseCreate.js");
/* harmony import */ var _baseForOwn_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./_baseForOwn.js */ "./node_modules/lodash-es/_baseForOwn.js");
/* harmony import */ var _baseIteratee_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_baseIteratee.js */ "./node_modules/lodash-es/_baseIteratee.js");
/* harmony import */ var _getPrototype_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./_getPrototype.js */ "./node_modules/lodash-es/_getPrototype.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");
/* harmony import */ var _isBuffer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isBuffer.js */ "./node_modules/lodash-es/isBuffer.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/lodash-es/isFunction.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");
/* harmony import */ var _isTypedArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isTypedArray.js */ "./node_modules/lodash-es/isTypedArray.js");











/**
 * An alternative to `_.reduce`; this method transforms `object` to a new
 * `accumulator` object which is the result of running each of its own
 * enumerable string keyed properties thru `iteratee`, with each invocation
 * potentially mutating the `accumulator` object. If `accumulator` is not
 * provided, a new object with the same `[[Prototype]]` will be used. The
 * iteratee is invoked with four arguments: (accumulator, value, key, object).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 1.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The custom accumulator value.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * _.transform([2, 3, 4], function(result, n) {
 *   result.push(n *= n);
 *   return n % 2 == 0;
 * }, []);
 * // => [4, 9]
 *
 * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] }
 */
function transform(object, iteratee, accumulator) {
  var isArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object),
      isArrLike = isArr || (0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object) || (0,_isTypedArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object);

  iteratee = (0,_baseIteratee_js__WEBPACK_IMPORTED_MODULE_3__["default"])(iteratee, 4);
  if (accumulator == null) {
    var Ctor = object && object.constructor;
    if (isArrLike) {
      accumulator = isArr ? new Ctor : [];
    }
    else if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_4__["default"])(object)) {
      accumulator = (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_5__["default"])(Ctor) ? (0,_baseCreate_js__WEBPACK_IMPORTED_MODULE_6__["default"])((0,_getPrototype_js__WEBPACK_IMPORTED_MODULE_7__["default"])(object)) : {};
    }
    else {
      accumulator = {};
    }
  }
  (isArrLike ? _arrayEach_js__WEBPACK_IMPORTED_MODULE_8__["default"] : _baseForOwn_js__WEBPACK_IMPORTED_MODULE_9__["default"])(object, function(value, index, object) {
    return iteratee(accumulator, value, index, object);
  });
  return accumulator;
}

/* harmony default export */ __webpack_exports__["default"] = (transform);


/***/ }),

/***/ "./node_modules/lodash-es/union.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/union.js ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseFlatten_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseFlatten.js */ "./node_modules/lodash-es/_baseFlatten.js");
/* harmony import */ var _baseRest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseRest.js */ "./node_modules/lodash-es/_baseRest.js");
/* harmony import */ var _baseUniq_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseUniq.js */ "./node_modules/lodash-es/_baseUniq.js");
/* harmony import */ var _isArrayLikeObject_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isArrayLikeObject.js */ "./node_modules/lodash-es/isArrayLikeObject.js");





/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 */
var union = (0,_baseRest_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function(arrays) {
  return (0,_baseUniq_js__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_baseFlatten_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arrays, 1, _isArrayLikeObject_js__WEBPACK_IMPORTED_MODULE_3__["default"], true));
});

/* harmony default export */ __webpack_exports__["default"] = (union);


/***/ }),

/***/ "./node_modules/lodash-es/uniqueId.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/uniqueId.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _toString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toString.js */ "./node_modules/lodash-es/toString.js");


/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return (0,_toString_js__WEBPACK_IMPORTED_MODULE_0__["default"])(prefix) + id;
}

/* harmony default export */ __webpack_exports__["default"] = (uniqueId);


/***/ }),

/***/ "./node_modules/lodash-es/values.js":
/*!******************************************!*\
  !*** ./node_modules/lodash-es/values.js ***!
  \******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseValues_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseValues.js */ "./node_modules/lodash-es/_baseValues.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/lodash-es/keys.js");



/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : (0,_baseValues_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, (0,_keys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object));
}

/* harmony default export */ __webpack_exports__["default"] = (values);


/***/ }),

/***/ "./node_modules/lodash-es/zipObject.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/zipObject.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assignValue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_assignValue.js */ "./node_modules/lodash-es/_assignValue.js");
/* harmony import */ var _baseZipObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseZipObject.js */ "./node_modules/lodash-es/_baseZipObject.js");



/**
 * This method is like `_.fromPairs` except that it accepts two arrays,
 * one of property identifiers and one of corresponding values.
 *
 * @static
 * @memberOf _
 * @since 0.4.0
 * @category Array
 * @param {Array} [props=[]] The property identifiers.
 * @param {Array} [values=[]] The property values.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.zipObject(['a', 'b'], [1, 2]);
 * // => { 'a': 1, 'b': 2 }
 */
function zipObject(props, values) {
  return (0,_baseZipObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(props || [], values || [], _assignValue_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
}

/* harmony default export */ __webpack_exports__["default"] = (zipObject);


/***/ }),

/***/ "./node_modules/mdast-util-from-markdown/dev/lib/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/mdast-util-from-markdown/dev/lib/index.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromMarkdown: function() { return /* binding */ fromMarkdown; }
/* harmony export */ });
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/* harmony import */ var mdast_util_to_string__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! mdast-util-to-string */ "./node_modules/mdast-util-to-string/lib/index.js");
/* harmony import */ var micromark_lib_parse_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark/lib/parse.js */ "./node_modules/micromark/dev/lib/parse.js");
/* harmony import */ var micromark_lib_preprocess_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark/lib/preprocess.js */ "./node_modules/micromark/dev/lib/preprocess.js");
/* harmony import */ var micromark_lib_postprocess_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark/lib/postprocess.js */ "./node_modules/micromark/dev/lib/postprocess.js");
/* harmony import */ var micromark_util_decode_numeric_character_reference__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! micromark-util-decode-numeric-character-reference */ "./node_modules/micromark-util-decode-numeric-character-reference/dev/index.js");
/* harmony import */ var micromark_util_decode_string__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! micromark-util-decode-string */ "./node_modules/micromark-util-decode-string/dev/index.js");
/* harmony import */ var micromark_util_normalize_identifier__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! micromark-util-normalize-identifier */ "./node_modules/micromark-util-normalize-identifier/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var decode_named_character_reference__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! decode-named-character-reference */ "./node_modules/decode-named-character-reference/index.dom.js");
/* harmony import */ var unist_util_stringify_position__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! unist-util-stringify-position */ "./node_modules/unist-util-stringify-position/lib/index.js");
/**
 * @typedef {import('micromark-util-types').Encoding} Encoding
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').ParseOptions} ParseOptions
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Value} Value
 *
 * @typedef {import('unist').Parent} UnistParent
 * @typedef {import('unist').Point} Point
 *
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('mdast').StaticPhrasingContent} StaticPhrasingContent
 * @typedef {import('mdast').Content} Content
 * @typedef {import('mdast').Break} Break
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {import('mdast').Code} Code
 * @typedef {import('mdast').Definition} Definition
 * @typedef {import('mdast').Emphasis} Emphasis
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').HTML} HTML
 * @typedef {import('mdast').Image} Image
 * @typedef {import('mdast').ImageReference} ImageReference
 * @typedef {import('mdast').InlineCode} InlineCode
 * @typedef {import('mdast').Link} Link
 * @typedef {import('mdast').LinkReference} LinkReference
 * @typedef {import('mdast').List} List
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Strong} Strong
 * @typedef {import('mdast').Text} Text
 * @typedef {import('mdast').ThematicBreak} ThematicBreak
 * @typedef {import('mdast').ReferenceType} ReferenceType
 * @typedef {import('../index.js').CompileData} CompileData
 */

/**
 * @typedef {Root | Content} Node
 * @typedef {Extract<Node, UnistParent>} Parent
 *
 * @typedef {Omit<UnistParent, 'type' | 'children'> & {type: 'fragment', children: Array<PhrasingContent>}} Fragment
 */

/**
 * @callback Transform
 *   Extra transform, to change the AST afterwards.
 * @param {Root} tree
 *   Tree to transform.
 * @returns {Root | undefined | null | void}
 *   New tree or nothing (in which case the current tree is used).
 *
 * @callback Handle
 *   Handle a token.
 * @param {CompileContext} this
 *   Context.
 * @param {Token} token
 *   Current token.
 * @returns {void}
 *   Nothing.
 *
 * @typedef {Record<string, Handle>} Handles
 *   Token types mapping to handles
 *
 * @callback OnEnterError
 *   Handle the case where the `right` token is open, but it is closed (by the
 *   `left` token) or because we reached the end of the document.
 * @param {Omit<CompileContext, 'sliceSerialize'>} this
 *   Context.
 * @param {Token | undefined} left
 *   Left token.
 * @param {Token} right
 *   Right token.
 * @returns {void}
 *   Nothing.
 *
 * @callback OnExitError
 *   Handle the case where the `right` token is open but it is closed by
 *   exiting the `left` token.
 * @param {Omit<CompileContext, 'sliceSerialize'>} this
 *   Context.
 * @param {Token} left
 *   Left token.
 * @param {Token} right
 *   Right token.
 * @returns {void}
 *   Nothing.
 *
 * @typedef {[Token, OnEnterError | undefined]} TokenTuple
 *   Open token on the stack, with an optional error handler for when
 *   that token isn’t closed properly.
 */

/**
 * @typedef Config
 *   Configuration.
 *
 *   We have our defaults, but extensions will add more.
 * @property {Array<string>} canContainEols
 *   Token types where line endings are used.
 * @property {Handles} enter
 *   Opening handles.
 * @property {Handles} exit
 *   Closing handles.
 * @property {Array<Transform>} transforms
 *   Tree transforms.
 *
 * @typedef {Partial<Config>} Extension
 *   Change how markdown tokens from micromark are turned into mdast.
 *
 * @typedef CompileContext
 *   mdast compiler context.
 * @property {Array<Node | Fragment>} stack
 *   Stack of nodes.
 * @property {Array<TokenTuple>} tokenStack
 *   Stack of tokens.
 * @property {<Key extends keyof CompileData>(key: Key) => CompileData[Key]} getData
 *   Get data from the key/value store.
 * @property {<Key extends keyof CompileData>(key: Key, value?: CompileData[Key]) => void} setData
 *   Set data into the key/value store.
 * @property {(this: CompileContext) => void} buffer
 *   Capture some of the output data.
 * @property {(this: CompileContext) => string} resume
 *   Stop capturing and access the output data.
 * @property {<Kind extends Node>(this: CompileContext, node: Kind, token: Token, onError?: OnEnterError) => Kind} enter
 *   Enter a token.
 * @property {(this: CompileContext, token: Token, onError?: OnExitError) => Node} exit
 *   Exit a token.
 * @property {TokenizeContext['sliceSerialize']} sliceSerialize
 *   Get the string value of a token.
 * @property {Config} config
 *   Configuration.
 *
 * @typedef FromMarkdownOptions
 *   Configuration for how to build mdast.
 * @property {Array<Extension | Array<Extension>> | null | undefined} [mdastExtensions]
 *   Extensions for this utility to change how tokens are turned into a tree.
 *
 * @typedef {ParseOptions & FromMarkdownOptions} Options
 *   Configuration.
 */

// To do: micromark: create a registry of tokens?
// To do: next major: don’t return given `Node` from `enter`.
// To do: next major: remove setter/getter.















const own = {}.hasOwnProperty

/**
 * @param value
 *   Markdown to parse.
 * @param encoding
 *   Character encoding for when `value` is `Buffer`.
 * @param options
 *   Configuration.
 * @returns
 *   mdast tree.
 */
const fromMarkdown =
  /**
   * @type {(
   *   ((value: Value, encoding: Encoding, options?: Options | null | undefined) => Root) &
   *   ((value: Value, options?: Options | null | undefined) => Root)
   * )}
   */
  (
    /**
     * @param {Value} value
     * @param {Encoding | Options | null | undefined} [encoding]
     * @param {Options | null | undefined} [options]
     * @returns {Root}
     */
    function (value, encoding, options) {
      if (typeof encoding !== 'string') {
        options = encoding
        encoding = undefined
      }

      return compiler(options)(
        (0,micromark_lib_postprocess_js__WEBPACK_IMPORTED_MODULE_1__.postprocess)(
          (0,micromark_lib_parse_js__WEBPACK_IMPORTED_MODULE_2__.parse)(options).document().write((0,micromark_lib_preprocess_js__WEBPACK_IMPORTED_MODULE_3__.preprocess)()(value, encoding, true))
        )
      )
    }
  )

/**
 * Note this compiler only understand complete buffering, not streaming.
 *
 * @param {Options | null | undefined} [options]
 */
function compiler(options) {
  /** @type {Config} */
  const config = {
    transforms: [],
    canContainEols: ['emphasis', 'fragment', 'heading', 'paragraph', 'strong'],
    enter: {
      autolink: opener(link),
      autolinkProtocol: onenterdata,
      autolinkEmail: onenterdata,
      atxHeading: opener(heading),
      blockQuote: opener(blockQuote),
      characterEscape: onenterdata,
      characterReference: onenterdata,
      codeFenced: opener(codeFlow),
      codeFencedFenceInfo: buffer,
      codeFencedFenceMeta: buffer,
      codeIndented: opener(codeFlow, buffer),
      codeText: opener(codeText, buffer),
      codeTextData: onenterdata,
      data: onenterdata,
      codeFlowValue: onenterdata,
      definition: opener(definition),
      definitionDestinationString: buffer,
      definitionLabelString: buffer,
      definitionTitleString: buffer,
      emphasis: opener(emphasis),
      hardBreakEscape: opener(hardBreak),
      hardBreakTrailing: opener(hardBreak),
      htmlFlow: opener(html, buffer),
      htmlFlowData: onenterdata,
      htmlText: opener(html, buffer),
      htmlTextData: onenterdata,
      image: opener(image),
      label: buffer,
      link: opener(link),
      listItem: opener(listItem),
      listItemValue: onenterlistitemvalue,
      listOrdered: opener(list, onenterlistordered),
      listUnordered: opener(list),
      paragraph: opener(paragraph),
      reference: onenterreference,
      referenceString: buffer,
      resourceDestinationString: buffer,
      resourceTitleString: buffer,
      setextHeading: opener(heading),
      strong: opener(strong),
      thematicBreak: opener(thematicBreak)
    },
    exit: {
      atxHeading: closer(),
      atxHeadingSequence: onexitatxheadingsequence,
      autolink: closer(),
      autolinkEmail: onexitautolinkemail,
      autolinkProtocol: onexitautolinkprotocol,
      blockQuote: closer(),
      characterEscapeValue: onexitdata,
      characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
      characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
      characterReferenceValue: onexitcharacterreferencevalue,
      codeFenced: closer(onexitcodefenced),
      codeFencedFence: onexitcodefencedfence,
      codeFencedFenceInfo: onexitcodefencedfenceinfo,
      codeFencedFenceMeta: onexitcodefencedfencemeta,
      codeFlowValue: onexitdata,
      codeIndented: closer(onexitcodeindented),
      codeText: closer(onexitcodetext),
      codeTextData: onexitdata,
      data: onexitdata,
      definition: closer(),
      definitionDestinationString: onexitdefinitiondestinationstring,
      definitionLabelString: onexitdefinitionlabelstring,
      definitionTitleString: onexitdefinitiontitlestring,
      emphasis: closer(),
      hardBreakEscape: closer(onexithardbreak),
      hardBreakTrailing: closer(onexithardbreak),
      htmlFlow: closer(onexithtmlflow),
      htmlFlowData: onexitdata,
      htmlText: closer(onexithtmltext),
      htmlTextData: onexitdata,
      image: closer(onexitimage),
      label: onexitlabel,
      labelText: onexitlabeltext,
      lineEnding: onexitlineending,
      link: closer(onexitlink),
      listItem: closer(),
      listOrdered: closer(),
      listUnordered: closer(),
      paragraph: closer(),
      referenceString: onexitreferencestring,
      resourceDestinationString: onexitresourcedestinationstring,
      resourceTitleString: onexitresourcetitlestring,
      resource: onexitresource,
      setextHeading: closer(onexitsetextheading),
      setextHeadingLineSequence: onexitsetextheadinglinesequence,
      setextHeadingText: onexitsetextheadingtext,
      strong: closer(),
      thematicBreak: closer()
    }
  }

  configure(config, (options || {}).mdastExtensions || [])

  /** @type {CompileData} */
  const data = {}

  return compile

  /**
   * Turn micromark events into an mdast tree.
   *
   * @param {Array<Event>} events
   *   Events.
   * @returns {Root}
   *   mdast tree.
   */
  function compile(events) {
    /** @type {Root} */
    let tree = {type: 'root', children: []}
    /** @type {Omit<CompileContext, 'sliceSerialize'>} */
    const context = {
      stack: [tree],
      tokenStack: [],
      config,
      enter,
      exit,
      buffer,
      resume,
      setData,
      getData
    }
    /** @type {Array<number>} */
    const listStack = []
    let index = -1

    while (++index < events.length) {
      // We preprocess lists to add `listItem` tokens, and to infer whether
      // items the list itself are spread out.
      if (
        events[index][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.listOrdered ||
        events[index][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.listUnordered
      ) {
        if (events[index][0] === 'enter') {
          listStack.push(index)
        } else {
          const tail = listStack.pop()
          ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(typeof tail === 'number', 'expected list ot be open')
          index = prepareList(events, tail, index)
        }
      }
    }

    index = -1

    while (++index < events.length) {
      const handler = config[events[index][0]]

      if (own.call(handler, events[index][1].type)) {
        handler[events[index][1].type].call(
          Object.assign(
            {sliceSerialize: events[index][2].sliceSerialize},
            context
          ),
          events[index][1]
        )
      }
    }

    // Handle tokens still being open.
    if (context.tokenStack.length > 0) {
      const tail = context.tokenStack[context.tokenStack.length - 1]
      const handler = tail[1] || defaultOnError
      handler.call(context, undefined, tail[0])
    }

    // Figure out `root` position.
    tree.position = {
      start: point(
        events.length > 0 ? events[0][1].start : {line: 1, column: 1, offset: 0}
      ),
      end: point(
        events.length > 0
          ? events[events.length - 2][1].end
          : {line: 1, column: 1, offset: 0}
      )
    }

    // Call transforms.
    index = -1
    while (++index < config.transforms.length) {
      tree = config.transforms[index](tree) || tree
    }

    return tree
  }

  /**
   * @param {Array<Event>} events
   * @param {number} start
   * @param {number} length
   * @returns {number}
   */
  function prepareList(events, start, length) {
    let index = start - 1
    let containerBalance = -1
    let listSpread = false
    /** @type {Token | undefined} */
    let listItem
    /** @type {number | undefined} */
    let lineIndex
    /** @type {number | undefined} */
    let firstBlankLineIndex
    /** @type {boolean | undefined} */
    let atMarker

    while (++index <= length) {
      const event = events[index]

      if (
        event[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.listUnordered ||
        event[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.listOrdered ||
        event[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.blockQuote
      ) {
        if (event[0] === 'enter') {
          containerBalance++
        } else {
          containerBalance--
        }

        atMarker = undefined
      } else if (event[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.lineEndingBlank) {
        if (event[0] === 'enter') {
          if (
            listItem &&
            !atMarker &&
            !containerBalance &&
            !firstBlankLineIndex
          ) {
            firstBlankLineIndex = index
          }

          atMarker = undefined
        }
      } else if (
        event[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.linePrefix ||
        event[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.listItemValue ||
        event[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.listItemMarker ||
        event[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.listItemPrefix ||
        event[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.listItemPrefixWhitespace
      ) {
        // Empty.
      } else {
        atMarker = undefined
      }

      if (
        (!containerBalance &&
          event[0] === 'enter' &&
          event[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.listItemPrefix) ||
        (containerBalance === -1 &&
          event[0] === 'exit' &&
          (event[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.listUnordered ||
            event[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.listOrdered))
      ) {
        if (listItem) {
          let tailIndex = index
          lineIndex = undefined

          while (tailIndex--) {
            const tailEvent = events[tailIndex]

            if (
              tailEvent[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.lineEnding ||
              tailEvent[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.lineEndingBlank
            ) {
              if (tailEvent[0] === 'exit') continue

              if (lineIndex) {
                events[lineIndex][1].type = micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.lineEndingBlank
                listSpread = true
              }

              tailEvent[1].type = micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.lineEnding
              lineIndex = tailIndex
            } else if (
              tailEvent[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.linePrefix ||
              tailEvent[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.blockQuotePrefix ||
              tailEvent[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.blockQuotePrefixWhitespace ||
              tailEvent[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.blockQuoteMarker ||
              tailEvent[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.listItemIndent
            ) {
              // Empty
            } else {
              break
            }
          }

          if (
            firstBlankLineIndex &&
            (!lineIndex || firstBlankLineIndex < lineIndex)
          ) {
            listItem._spread = true
          }

          // Fix position.
          listItem.end = Object.assign(
            {},
            lineIndex ? events[lineIndex][1].start : event[1].end
          )

          events.splice(lineIndex || index, 0, ['exit', listItem, event[2]])
          index++
          length++
        }

        // Create a new list item.
        if (event[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.listItemPrefix) {
          listItem = {
            type: 'listItem',
            _spread: false,
            start: Object.assign({}, event[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: undefined
          }
          // @ts-expect-error: `listItem` is most definitely defined, TS...
          events.splice(index, 0, ['enter', listItem, event[2]])
          index++
          length++
          firstBlankLineIndex = undefined
          atMarker = true
        }
      }
    }

    events[start][1]._spread = listSpread
    return length
  }

  /**
   * Set data.
   *
   * @template {keyof CompileData} Key
   *   Field type.
   * @param {Key} key
   *   Key of field.
   * @param {CompileData[Key]} [value]
   *   New value.
   * @returns {void}
   *   Nothing.
   */
  function setData(key, value) {
    data[key] = value
  }

  /**
   * Get data.
   *
   * @template {keyof CompileData} Key
   *   Field type.
   * @param {Key} key
   *   Key of field.
   * @returns {CompileData[Key]}
   *   Value.
   */
  function getData(key) {
    return data[key]
  }

  /**
   * Create an opener handle.
   *
   * @param {(token: Token) => Node} create
   *   Create a node.
   * @param {Handle} [and]
   *   Optional function to also run.
   * @returns {Handle}
   *   Handle.
   */
  function opener(create, and) {
    return open

    /**
     * @this {CompileContext}
     * @param {Token} token
     * @returns {void}
     */
    function open(token) {
      enter.call(this, create(token), token)
      if (and) and.call(this, token)
    }
  }

  /**
   * @this {CompileContext}
   * @returns {void}
   */
  function buffer() {
    this.stack.push({type: 'fragment', children: []})
  }

  /**
   * @template {Node} Kind
   *   Node type.
   * @this {CompileContext}
   *   Context.
   * @param {Kind} node
   *   Node to enter.
   * @param {Token} token
   *   Corresponding token.
   * @param {OnEnterError | undefined} [errorHandler]
   *   Handle the case where this token is open, but it is closed by something else.
   * @returns {Kind}
   *   The given node.
   */
  function enter(node, token, errorHandler) {
    const parent = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(parent, 'expected `parent`')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)('children' in parent, 'expected `parent`')
    // @ts-expect-error: Assume `Node` can exist as a child of `parent`.
    parent.children.push(node)
    this.stack.push(node)
    this.tokenStack.push([token, errorHandler])
    // @ts-expect-error: `end` will be patched later.
    node.position = {start: point(token.start)}
    return node
  }

  /**
   * Create a closer handle.
   *
   * @param {Handle} [and]
   *   Optional function to also run.
   * @returns {Handle}
   *   Handle.
   */
  function closer(and) {
    return close

    /**
     * @this {CompileContext}
     * @param {Token} token
     * @returns {void}
     */
    function close(token) {
      if (and) and.call(this, token)
      exit.call(this, token)
    }
  }

  /**
   * @this {CompileContext}
   *   Context.
   * @param {Token} token
   *   Corresponding token.
   * @param {OnExitError | undefined} [onExitError]
   *   Handle the case where another token is open.
   * @returns {Node}
   *   The closed node.
   */
  function exit(token, onExitError) {
    const node = this.stack.pop()
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected `node`')
    const open = this.tokenStack.pop()

    if (!open) {
      throw new Error(
        'Cannot close `' +
          token.type +
          '` (' +
          (0,unist_util_stringify_position__WEBPACK_IMPORTED_MODULE_5__.stringifyPosition)({start: token.start, end: token.end}) +
          '): it’s not open'
      )
    } else if (open[0].type !== token.type) {
      if (onExitError) {
        onExitError.call(this, token, open[0])
      } else {
        const handler = open[1] || defaultOnError
        handler.call(this, token, open[0])
      }
    }

    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type !== 'fragment', 'unexpected fragment `exit`ed')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.position, 'expected `position` to be defined')
    node.position.end = point(token.end)
    return node
  }

  /**
   * @this {CompileContext}
   * @returns {string}
   */
  function resume() {
    return (0,mdast_util_to_string__WEBPACK_IMPORTED_MODULE_6__.toString)(this.stack.pop())
  }

  //
  // Handlers.
  //

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterlistordered() {
    setData('expectingFirstListItemValue', true)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterlistitemvalue(token) {
    if (getData('expectingFirstListItemValue')) {
      const ancestor = this.stack[this.stack.length - 2]
      ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(ancestor, 'expected nodes on stack')
      ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(ancestor.type === 'list', 'expected list on stack')
      ancestor.start = Number.parseInt(
        this.sliceSerialize(token),
        micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_7__.constants.numericBaseDecimal
      )
      setData('expectingFirstListItemValue')
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfenceinfo() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'code', 'expected code on stack')
    node.lang = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfencemeta() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'code', 'expected code on stack')
    node.meta = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfence() {
    // Exit if this is the closing fence.
    if (getData('flowCodeInside')) return
    this.buffer()
    setData('flowCodeInside', true)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefenced() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'code', 'expected code on stack')

    node.value = data.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, '')
    setData('flowCodeInside')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodeindented() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'code', 'expected code on stack')

    node.value = data.replace(/(\r?\n|\r)$/g, '')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitionlabelstring(token) {
    const label = this.resume()
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'definition', 'expected definition on stack')

    node.label = label
    node.identifier = (0,micromark_util_normalize_identifier__WEBPACK_IMPORTED_MODULE_8__.normalizeIdentifier)(
      this.sliceSerialize(token)
    ).toLowerCase()
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitiontitlestring() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'definition', 'expected definition on stack')

    node.title = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitiondestinationstring() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'definition', 'expected definition on stack')

    node.url = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitatxheadingsequence(token) {
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'heading', 'expected heading on stack')

    if (!node.depth) {
      const depth = this.sliceSerialize(token).length

      ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
        depth === 1 ||
          depth === 2 ||
          depth === 3 ||
          depth === 4 ||
          depth === 5 ||
          depth === 6,
        'expected `depth` between `1` and `6`'
      )

      node.depth = depth
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheadingtext() {
    setData('setextHeadingSlurpLineEnding', true)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheadinglinesequence(token) {
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'heading', 'expected heading on stack')

    node.depth =
      this.sliceSerialize(token).charCodeAt(0) === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_9__.codes.equalsTo ? 1 : 2
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheading() {
    setData('setextHeadingSlurpLineEnding')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onenterdata(token) {
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)('children' in node, 'expected parent on stack')

    let tail = node.children[node.children.length - 1]

    if (!tail || tail.type !== 'text') {
      // Add a new text node.
      tail = text()
      // @ts-expect-error: we’ll add `end` later.
      tail.position = {start: point(token.start)}
      // @ts-expect-error: Assume `parent` accepts `text`.
      node.children.push(tail)
    }

    this.stack.push(tail)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitdata(token) {
    const tail = this.stack.pop()
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(tail, 'expected a `node` to be on the stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)('value' in tail, 'expected a `literal` to be on the stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(tail.position, 'expected `node` to have an open position')
    tail.value += this.sliceSerialize(token)
    tail.position.end = point(token.end)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlineending(token) {
    const context = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(context, 'expected `node`')

    // If we’re at a hard break, include the line ending in there.
    if (getData('atHardBreak')) {
      (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)('children' in context, 'expected `parent`')
      const tail = context.children[context.children.length - 1]
      ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(tail.position, 'expected tail to have a starting position')
      tail.position.end = point(token.end)
      setData('atHardBreak')
      return
    }

    if (
      !getData('setextHeadingSlurpLineEnding') &&
      config.canContainEols.includes(context.type)
    ) {
      onenterdata.call(this, token)
      onexitdata.call(this, token)
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexithardbreak() {
    setData('atHardBreak', true)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexithtmlflow() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'html', 'expected html on stack')

    node.value = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexithtmltext() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'html', 'expected html on stack')

    node.value = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitcodetext() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'inlineCode', 'expected inline code on stack')

    node.value = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlink() {
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'link', 'expected link on stack')

    // Note: there are also `identifier` and `label` fields on this link node!
    // These are used / cleaned here.

    // To do: clean.
    if (getData('inReference')) {
      /** @type {ReferenceType} */
      const referenceType = getData('referenceType') || 'shortcut'

      node.type += 'Reference'
      // @ts-expect-error: mutate.
      node.referenceType = referenceType
      // @ts-expect-error: mutate.
      delete node.url
      delete node.title
    } else {
      // @ts-expect-error: mutate.
      delete node.identifier
      // @ts-expect-error: mutate.
      delete node.label
    }

    setData('referenceType')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitimage() {
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'image', 'expected image on stack')

    // Note: there are also `identifier` and `label` fields on this link node!
    // These are used / cleaned here.

    // To do: clean.
    if (getData('inReference')) {
      /** @type {ReferenceType} */
      const referenceType = getData('referenceType') || 'shortcut'

      node.type += 'Reference'
      // @ts-expect-error: mutate.
      node.referenceType = referenceType
      // @ts-expect-error: mutate.
      delete node.url
      delete node.title
    } else {
      // @ts-expect-error: mutate.
      delete node.identifier
      // @ts-expect-error: mutate.
      delete node.label
    }

    setData('referenceType')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlabeltext(token) {
    const string = this.sliceSerialize(token)
    const ancestor = this.stack[this.stack.length - 2]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(ancestor, 'expected ancestor on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      ancestor.type === 'image' || ancestor.type === 'link',
      'expected image or link on stack'
    )

    // @ts-expect-error: stash this on the node, as it might become a reference
    // later.
    ancestor.label = (0,micromark_util_decode_string__WEBPACK_IMPORTED_MODULE_10__.decodeString)(string)
    // @ts-expect-error: same as above.
    ancestor.identifier = (0,micromark_util_normalize_identifier__WEBPACK_IMPORTED_MODULE_8__.normalizeIdentifier)(string).toLowerCase()
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlabel() {
    const fragment = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(fragment, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(fragment.type === 'fragment', 'expected fragment on stack')
    const value = this.resume()
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      node.type === 'image' || node.type === 'link',
      'expected image or link on stack'
    )

    // Assume a reference.
    setData('inReference', true)

    if (node.type === 'link') {
      /** @type {Array<StaticPhrasingContent>} */
      // @ts-expect-error: Assume static phrasing content.
      const children = fragment.children

      node.children = children
    } else {
      node.alt = value
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitresourcedestinationstring() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      node.type === 'image' || node.type === 'link',
      'expected image or link on stack'
    )
    node.url = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitresourcetitlestring() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      node.type === 'image' || node.type === 'link',
      'expected image or link on stack'
    )
    node.title = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitresource() {
    setData('inReference')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onenterreference() {
    setData('referenceType', 'collapsed')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitreferencestring(token) {
    const label = this.resume()
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      node.type === 'image' || node.type === 'link',
      'expected image reference or link reference on stack'
    )

    // @ts-expect-error: stash this on the node, as it might become a reference
    // later.
    node.label = label
    // @ts-expect-error: same as above.
    node.identifier = (0,micromark_util_normalize_identifier__WEBPACK_IMPORTED_MODULE_8__.normalizeIdentifier)(
      this.sliceSerialize(token)
    ).toLowerCase()
    setData('referenceType', 'full')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitcharacterreferencemarker(token) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      token.type === 'characterReferenceMarkerNumeric' ||
        token.type === 'characterReferenceMarkerHexadecimal'
    )
    setData('characterReferenceType', token.type)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcharacterreferencevalue(token) {
    const data = this.sliceSerialize(token)
    const type = getData('characterReferenceType')
    /** @type {string} */
    let value

    if (type) {
      value = (0,micromark_util_decode_numeric_character_reference__WEBPACK_IMPORTED_MODULE_11__.decodeNumericCharacterReference)(
        data,
        type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.characterReferenceMarkerNumeric
          ? micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_7__.constants.numericBaseDecimal
          : micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_7__.constants.numericBaseHexadecimal
      )
      setData('characterReferenceType')
    } else {
      const result = (0,decode_named_character_reference__WEBPACK_IMPORTED_MODULE_12__.decodeNamedCharacterReference)(data)
      ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(result !== false, 'expected reference to decode')
      value = result
    }

    const tail = this.stack.pop()
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(tail, 'expected `node`')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(tail.position, 'expected `node.position`')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)('value' in tail, 'expected `node.value`')
    tail.value += value
    tail.position.end = point(token.end)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitautolinkprotocol(token) {
    onexitdata.call(this, token)
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'link', 'expected link on stack')

    node.url = this.sliceSerialize(token)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitautolinkemail(token) {
    onexitdata.call(this, token)
    const node = this.stack[this.stack.length - 1]
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node, 'expected node on stack')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'link', 'expected link on stack')

    node.url = 'mailto:' + this.sliceSerialize(token)
  }

  //
  // Creaters.
  //

  /** @returns {Blockquote} */
  function blockQuote() {
    return {type: 'blockquote', children: []}
  }

  /** @returns {Code} */
  function codeFlow() {
    return {type: 'code', lang: null, meta: null, value: ''}
  }

  /** @returns {InlineCode} */
  function codeText() {
    return {type: 'inlineCode', value: ''}
  }

  /** @returns {Definition} */
  function definition() {
    return {
      type: 'definition',
      identifier: '',
      label: null,
      title: null,
      url: ''
    }
  }

  /** @returns {Emphasis} */
  function emphasis() {
    return {type: 'emphasis', children: []}
  }

  /** @returns {Heading} */
  function heading() {
    // @ts-expect-error `depth` will be set later.
    return {type: 'heading', depth: undefined, children: []}
  }

  /** @returns {Break} */
  function hardBreak() {
    return {type: 'break'}
  }

  /** @returns {HTML} */
  function html() {
    return {type: 'html', value: ''}
  }

  /** @returns {Image} */
  function image() {
    return {type: 'image', title: null, url: '', alt: null}
  }

  /** @returns {Link} */
  function link() {
    return {type: 'link', title: null, url: '', children: []}
  }

  /**
   * @param {Token} token
   * @returns {List}
   */
  function list(token) {
    return {
      type: 'list',
      ordered: token.type === 'listOrdered',
      start: null,
      spread: token._spread,
      children: []
    }
  }

  /**
   * @param {Token} token
   * @returns {ListItem}
   */
  function listItem(token) {
    return {
      type: 'listItem',
      spread: token._spread,
      checked: null,
      children: []
    }
  }

  /** @returns {Paragraph} */
  function paragraph() {
    return {type: 'paragraph', children: []}
  }

  /** @returns {Strong} */
  function strong() {
    return {type: 'strong', children: []}
  }

  /** @returns {Text} */
  function text() {
    return {type: 'text', value: ''}
  }

  /** @returns {ThematicBreak} */
  function thematicBreak() {
    return {type: 'thematicBreak'}
  }
}

/**
 * Copy a point-like value.
 *
 * @param {Point} d
 *   Point-like value.
 * @returns {Point}
 *   unist point.
 */
function point(d) {
  return {line: d.line, column: d.column, offset: d.offset}
}

/**
 * @param {Config} combined
 * @param {Array<Extension | Array<Extension>>} extensions
 * @returns {void}
 */
function configure(combined, extensions) {
  let index = -1

  while (++index < extensions.length) {
    const value = extensions[index]

    if (Array.isArray(value)) {
      configure(combined, value)
    } else {
      extension(combined, value)
    }
  }
}

/**
 * @param {Config} combined
 * @param {Extension} extension
 * @returns {void}
 */
function extension(combined, extension) {
  /** @type {keyof Extension} */
  let key

  for (key in extension) {
    if (own.call(extension, key)) {
      if (key === 'canContainEols') {
        const right = extension[key]
        if (right) {
          combined[key].push(...right)
        }
      } else if (key === 'transforms') {
        const right = extension[key]
        if (right) {
          combined[key].push(...right)
        }
      } else if (key === 'enter' || key === 'exit') {
        const right = extension[key]
        if (right) {
          Object.assign(combined[key], right)
        }
      }
    }
  }
}

/** @type {OnEnterError} */
function defaultOnError(left, right) {
  if (left) {
    throw new Error(
      'Cannot close `' +
        left.type +
        '` (' +
        (0,unist_util_stringify_position__WEBPACK_IMPORTED_MODULE_5__.stringifyPosition)({start: left.start, end: left.end}) +
        '): a different token (`' +
        right.type +
        '`, ' +
        (0,unist_util_stringify_position__WEBPACK_IMPORTED_MODULE_5__.stringifyPosition)({start: right.start, end: right.end}) +
        ') is open'
    )
  } else {
    throw new Error(
      'Cannot close document, a token (`' +
        right.type +
        '`, ' +
        (0,unist_util_stringify_position__WEBPACK_IMPORTED_MODULE_5__.stringifyPosition)({start: right.start, end: right.end}) +
        ') is still open'
    )
  }
}


/***/ }),

/***/ "./node_modules/mdast-util-to-string/lib/index.js":
/*!********************************************************!*\
  !*** ./node_modules/mdast-util-to-string/lib/index.js ***!
  \********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toString: function() { return /* binding */ toString; }
/* harmony export */ });
/**
 * @typedef {import('mdast').Root|import('mdast').Content} Node
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [includeImageAlt=true]
 *   Whether to use `alt` for `image`s.
 * @property {boolean | null | undefined} [includeHtml=true]
 *   Whether to use `value` of HTML.
 */

/** @type {Options} */
const emptyOptions = {}

/**
 * Get the text content of a node or list of nodes.
 *
 * Prefers the node’s plain-text fields, otherwise serializes its children,
 * and if the given value is an array, serialize the nodes in it.
 *
 * @param {unknown} value
 *   Thing to serialize, typically `Node`.
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {string}
 *   Serialized `value`.
 */
function toString(value, options) {
  const settings = options || emptyOptions
  const includeImageAlt =
    typeof settings.includeImageAlt === 'boolean'
      ? settings.includeImageAlt
      : true
  const includeHtml =
    typeof settings.includeHtml === 'boolean' ? settings.includeHtml : true

  return one(value, includeImageAlt, includeHtml)
}

/**
 * One node or several nodes.
 *
 * @param {unknown} value
 *   Thing to serialize.
 * @param {boolean} includeImageAlt
 *   Include image `alt`s.
 * @param {boolean} includeHtml
 *   Include HTML.
 * @returns {string}
 *   Serialized node.
 */
function one(value, includeImageAlt, includeHtml) {
  if (node(value)) {
    if ('value' in value) {
      return value.type === 'html' && !includeHtml ? '' : value.value
    }

    if (includeImageAlt && 'alt' in value && value.alt) {
      return value.alt
    }

    if ('children' in value) {
      return all(value.children, includeImageAlt, includeHtml)
    }
  }

  if (Array.isArray(value)) {
    return all(value, includeImageAlt, includeHtml)
  }

  return ''
}

/**
 * Serialize a list of nodes.
 *
 * @param {Array<unknown>} values
 *   Thing to serialize.
 * @param {boolean} includeImageAlt
 *   Include image `alt`s.
 * @param {boolean} includeHtml
 *   Include HTML.
 * @returns {string}
 *   Serialized nodes.
 */
function all(values, includeImageAlt, includeHtml) {
  /** @type {Array<string>} */
  const result = []
  let index = -1

  while (++index < values.length) {
    result[index] = one(values[index], includeImageAlt, includeHtml)
  }

  return result.join('')
}

/**
 * Check if `value` looks like a node.
 *
 * @param {unknown} value
 *   Thing.
 * @returns {value is Node}
 *   Whether `value` is a node.
 */
function node(value) {
  return Boolean(value && typeof value === 'object')
}


/***/ }),

/***/ "./node_modules/mermaid/dist/createText-6b48ae7d.js":
/*!**********************************************************!*\
  !*** ./node_modules/mermaid/dist/createText-6b48ae7d.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: function() { return /* binding */ createText; },
/* harmony export */   c: function() { return /* binding */ computeDimensionOfText; }
/* harmony export */ });
/* harmony import */ var _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mermaid-f47111a7.js */ "./node_modules/mermaid/dist/mermaid-f47111a7.js");
/* harmony import */ var mdast_util_from_markdown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mdast-util-from-markdown */ "./node_modules/mdast-util-from-markdown/dev/lib/index.js");
/* harmony import */ var ts_dedent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ts-dedent */ "./node_modules/ts-dedent/esm/index.js");



function preprocessMarkdown(markdown) {
  const withoutMultipleNewlines = markdown.replace(/\n{2,}/g, "\n");
  const withoutExtraSpaces = (0,ts_dedent__WEBPACK_IMPORTED_MODULE_0__.dedent)(withoutMultipleNewlines);
  return withoutExtraSpaces;
}
function markdownToLines(markdown) {
  const preprocessedMarkdown = preprocessMarkdown(markdown);
  const { children } = (0,mdast_util_from_markdown__WEBPACK_IMPORTED_MODULE_1__.fromMarkdown)(preprocessedMarkdown);
  const lines = [[]];
  let currentLine = 0;
  function processNode(node, parentType = "normal") {
    if (node.type === "text") {
      const textLines = node.value.split("\n");
      textLines.forEach((textLine, index) => {
        if (index !== 0) {
          currentLine++;
          lines.push([]);
        }
        textLine.split(" ").forEach((word) => {
          if (word) {
            lines[currentLine].push({ content: word, type: parentType });
          }
        });
      });
    } else if (node.type === "strong" || node.type === "emphasis") {
      node.children.forEach((contentNode) => {
        processNode(contentNode, node.type);
      });
    }
  }
  children.forEach((treeNode) => {
    if (treeNode.type === "paragraph") {
      treeNode.children.forEach((contentNode) => {
        processNode(contentNode);
      });
    }
  });
  return lines;
}
function markdownToHTML(markdown) {
  const { children } = (0,mdast_util_from_markdown__WEBPACK_IMPORTED_MODULE_1__.fromMarkdown)(markdown);
  function output(node) {
    if (node.type === "text") {
      return node.value.replace(/\n/g, "<br/>");
    } else if (node.type === "strong") {
      return `<strong>${node.children.map(output).join("")}</strong>`;
    } else if (node.type === "emphasis") {
      return `<em>${node.children.map(output).join("")}</em>`;
    } else if (node.type === "paragraph") {
      return `<p>${node.children.map(output).join("")}</p>`;
    }
    return `Unsupported markdown: ${node.type}`;
  }
  return children.map(output).join("");
}
function splitTextToChars(text) {
  if (Intl.Segmenter) {
    return [...new Intl.Segmenter().segment(text)].map((s) => s.segment);
  }
  return [...text];
}
function splitWordToFitWidth(checkFit, word) {
  const characters = splitTextToChars(word.content);
  return splitWordToFitWidthRecursion(checkFit, [], characters, word.type);
}
function splitWordToFitWidthRecursion(checkFit, usedChars, remainingChars, type) {
  if (remainingChars.length === 0) {
    return [
      { content: usedChars.join(""), type },
      { content: "", type }
    ];
  }
  const [nextChar, ...rest] = remainingChars;
  const newWord = [...usedChars, nextChar];
  if (checkFit([{ content: newWord.join(""), type }])) {
    return splitWordToFitWidthRecursion(checkFit, newWord, rest, type);
  }
  if (usedChars.length === 0 && nextChar) {
    usedChars.push(nextChar);
    remainingChars.shift();
  }
  return [
    { content: usedChars.join(""), type },
    { content: remainingChars.join(""), type }
  ];
}
function splitLineToFitWidth(line, checkFit) {
  if (line.some(({ content }) => content.includes("\n"))) {
    throw new Error("splitLineToFitWidth does not support newlines in the line");
  }
  return splitLineToFitWidthRecursion(line, checkFit);
}
function splitLineToFitWidthRecursion(words, checkFit, lines = [], newLine = []) {
  if (words.length === 0) {
    if (newLine.length > 0) {
      lines.push(newLine);
    }
    return lines.length > 0 ? lines : [];
  }
  let joiner = "";
  if (words[0].content === " ") {
    joiner = " ";
    words.shift();
  }
  const nextWord = words.shift() ?? { content: " ", type: "normal" };
  const lineWithNextWord = [...newLine];
  if (joiner !== "") {
    lineWithNextWord.push({ content: joiner, type: "normal" });
  }
  lineWithNextWord.push(nextWord);
  if (checkFit(lineWithNextWord)) {
    return splitLineToFitWidthRecursion(words, checkFit, lines, lineWithNextWord);
  }
  if (newLine.length > 0) {
    lines.push(newLine);
    words.unshift(nextWord);
  } else if (nextWord.content) {
    const [line, rest] = splitWordToFitWidth(checkFit, nextWord);
    lines.push([line]);
    if (rest.content) {
      words.unshift(rest);
    }
  }
  return splitLineToFitWidthRecursion(words, checkFit, lines);
}
function applyStyle(dom, styleFn) {
  if (styleFn) {
    dom.attr("style", styleFn);
  }
}
function addHtmlSpan(element, node, width, classes, addBackground = false) {
  const fo = element.append("foreignObject");
  const div = fo.append("xhtml:div");
  const label = node.label;
  const labelClass = node.isNode ? "nodeLabel" : "edgeLabel";
  div.html(
    `
    <span class="${labelClass} ${classes}" ` + (node.labelStyle ? 'style="' + node.labelStyle + '"' : "") + ">" + label + "</span>"
  );
  applyStyle(div, node.labelStyle);
  div.style("display", "table-cell");
  div.style("white-space", "nowrap");
  div.style("max-width", width + "px");
  div.attr("xmlns", "http://www.w3.org/1999/xhtml");
  if (addBackground) {
    div.attr("class", "labelBkg");
  }
  let bbox = div.node().getBoundingClientRect();
  if (bbox.width === width) {
    div.style("display", "table");
    div.style("white-space", "break-spaces");
    div.style("width", width + "px");
    bbox = div.node().getBoundingClientRect();
  }
  fo.style("width", bbox.width);
  fo.style("height", bbox.height);
  return fo.node();
}
function createTspan(textElement, lineIndex, lineHeight) {
  return textElement.append("tspan").attr("class", "text-outer-tspan").attr("x", 0).attr("y", lineIndex * lineHeight - 0.1 + "em").attr("dy", lineHeight + "em");
}
function computeWidthOfText(parentNode, lineHeight, line) {
  const testElement = parentNode.append("text");
  const testSpan = createTspan(testElement, 1, lineHeight);
  updateTextContentAndStyles(testSpan, line);
  const textLength = testSpan.node().getComputedTextLength();
  testElement.remove();
  return textLength;
}
function computeDimensionOfText(parentNode, lineHeight, text) {
  var _a;
  const testElement = parentNode.append("text");
  const testSpan = createTspan(testElement, 1, lineHeight);
  updateTextContentAndStyles(testSpan, [{ content: text, type: "normal" }]);
  const textDimension = (_a = testSpan.node()) == null ? void 0 : _a.getBoundingClientRect();
  if (textDimension) {
    testElement.remove();
  }
  return textDimension;
}
function createFormattedText(width, g, structuredText, addBackground = false) {
  const lineHeight = 1.1;
  const labelGroup = g.append("g");
  const bkg = labelGroup.insert("rect").attr("class", "background");
  const textElement = labelGroup.append("text").attr("y", "-10.1");
  let lineIndex = 0;
  for (const line of structuredText) {
    const checkWidth = (line2) => computeWidthOfText(labelGroup, lineHeight, line2) <= width;
    const linesUnderWidth = checkWidth(line) ? [line] : splitLineToFitWidth(line, checkWidth);
    for (const preparedLine of linesUnderWidth) {
      const tspan = createTspan(textElement, lineIndex, lineHeight);
      updateTextContentAndStyles(tspan, preparedLine);
      lineIndex++;
    }
  }
  if (addBackground) {
    const bbox = textElement.node().getBBox();
    const padding = 2;
    bkg.attr("x", -padding).attr("y", -padding).attr("width", bbox.width + 2 * padding).attr("height", bbox.height + 2 * padding);
    return labelGroup.node();
  } else {
    return textElement.node();
  }
}
function updateTextContentAndStyles(tspan, wrappedLine) {
  tspan.text("");
  wrappedLine.forEach((word, index) => {
    const innerTspan = tspan.append("tspan").attr("font-style", word.type === "emphasis" ? "italic" : "normal").attr("class", "text-inner-tspan").attr("font-weight", word.type === "strong" ? "bold" : "normal");
    if (index === 0) {
      innerTspan.text(word.content);
    } else {
      innerTspan.text(" " + word.content);
    }
  });
}
const createText = (el, text = "", {
  style = "",
  isTitle = false,
  classes = "",
  useHtmlLabels = true,
  isNode = true,
  width = 200,
  addSvgBackground = false
} = {}) => {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_2__.l.info("createText", text, style, isTitle, classes, useHtmlLabels, isNode, addSvgBackground);
  if (useHtmlLabels) {
    const htmlText = markdownToHTML(text);
    const node = {
      isNode,
      label: (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_2__.M)(htmlText).replace(
        /fa[blrs]?:fa-[\w-]+/g,
        // cspell: disable-line
        (s) => `<i class='${s.replace(":", " ")}'></i>`
      ),
      labelStyle: style.replace("fill:", "color:")
    };
    const vertexNode = addHtmlSpan(el, node, width, classes, addSvgBackground);
    return vertexNode;
  } else {
    const structuredText = markdownToLines(text);
    const svgLabel = createFormattedText(width, el, structuredText, addSvgBackground);
    return svgLabel;
  }
};



/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/attention.js":
/*!*********************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/attention.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attention: function() { return /* binding */ attention; }
/* harmony export */ });
/* harmony import */ var micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-chunked */ "./node_modules/micromark-util-chunked/dev/index.js");
/* harmony import */ var micromark_util_classify_character__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-classify-character */ "./node_modules/micromark-util-classify-character/dev/index.js");
/* harmony import */ var micromark_util_resolve_all__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-resolve-all */ "./node_modules/micromark-util-resolve-all/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */









/** @type {Construct} */
const attention = {
  name: 'attention',
  tokenize: tokenizeAttention,
  resolveAll: resolveAllAttention
}

/**
 * Take all events and resolve attention to emphasis or strong.
 *
 * @type {Resolver}
 */
function resolveAllAttention(events, context) {
  let index = -1
  /** @type {number} */
  let open
  /** @type {Token} */
  let group
  /** @type {Token} */
  let text
  /** @type {Token} */
  let openingSequence
  /** @type {Token} */
  let closingSequence
  /** @type {number} */
  let use
  /** @type {Array<Event>} */
  let nextEvents
  /** @type {number} */
  let offset

  // Walk through all events.
  //
  // Note: performance of this is fine on an mb of normal markdown, but it’s
  // a bottleneck for malicious stuff.
  while (++index < events.length) {
    // Find a token that can close.
    if (
      events[index][0] === 'enter' &&
      events[index][1].type === 'attentionSequence' &&
      events[index][1]._close
    ) {
      open = index

      // Now walk back to find an opener.
      while (open--) {
        // Find a token that can open the closer.
        if (
          events[open][0] === 'exit' &&
          events[open][1].type === 'attentionSequence' &&
          events[open][1]._open &&
          // If the markers are the same:
          context.sliceSerialize(events[open][1]).charCodeAt(0) ===
            context.sliceSerialize(events[index][1]).charCodeAt(0)
        ) {
          // If the opening can close or the closing can open,
          // and the close size *is not* a multiple of three,
          // but the sum of the opening and closing size *is* multiple of three,
          // then don’t match.
          if (
            (events[open][1]._close || events[index][1]._open) &&
            (events[index][1].end.offset - events[index][1].start.offset) % 3 &&
            !(
              (events[open][1].end.offset -
                events[open][1].start.offset +
                events[index][1].end.offset -
                events[index][1].start.offset) %
              3
            )
          ) {
            continue
          }

          // Number of markers to use from the sequence.
          use =
            events[open][1].end.offset - events[open][1].start.offset > 1 &&
            events[index][1].end.offset - events[index][1].start.offset > 1
              ? 2
              : 1

          const start = Object.assign({}, events[open][1].end)
          const end = Object.assign({}, events[index][1].start)
          movePoint(start, -use)
          movePoint(end, use)

          openingSequence = {
            type: use > 1 ? micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.strongSequence : micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.emphasisSequence,
            start,
            end: Object.assign({}, events[open][1].end)
          }
          closingSequence = {
            type: use > 1 ? micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.strongSequence : micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.emphasisSequence,
            start: Object.assign({}, events[index][1].start),
            end
          }
          text = {
            type: use > 1 ? micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.strongText : micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.emphasisText,
            start: Object.assign({}, events[open][1].end),
            end: Object.assign({}, events[index][1].start)
          }
          group = {
            type: use > 1 ? micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.strong : micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.emphasis,
            start: Object.assign({}, openingSequence.start),
            end: Object.assign({}, closingSequence.end)
          }

          events[open][1].end = Object.assign({}, openingSequence.start)
          events[index][1].start = Object.assign({}, closingSequence.end)

          nextEvents = []

          // If there are more markers in the opening, add them before.
          if (events[open][1].end.offset - events[open][1].start.offset) {
            nextEvents = (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.push)(nextEvents, [
              ['enter', events[open][1], context],
              ['exit', events[open][1], context]
            ])
          }

          // Opening.
          nextEvents = (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.push)(nextEvents, [
            ['enter', group, context],
            ['enter', openingSequence, context],
            ['exit', openingSequence, context],
            ['enter', text, context]
          ])

          // Always populated by defaults.
          ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
            context.parser.constructs.insideSpan.null,
            'expected `insideSpan` to be populated'
          )

          // Between.
          nextEvents = (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.push)(
            nextEvents,
            (0,micromark_util_resolve_all__WEBPACK_IMPORTED_MODULE_3__.resolveAll)(
              context.parser.constructs.insideSpan.null,
              events.slice(open + 1, index),
              context
            )
          )

          // Closing.
          nextEvents = (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.push)(nextEvents, [
            ['exit', text, context],
            ['enter', closingSequence, context],
            ['exit', closingSequence, context],
            ['exit', group, context]
          ])

          // If there are more markers in the closing, add them after.
          if (events[index][1].end.offset - events[index][1].start.offset) {
            offset = 2
            nextEvents = (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.push)(nextEvents, [
              ['enter', events[index][1], context],
              ['exit', events[index][1], context]
            ])
          } else {
            offset = 0
          }

          (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.splice)(events, open - 1, index - open + 3, nextEvents)

          index = open + nextEvents.length - offset - 2
          break
        }
      }
    }
  }

  // Remove remaining sequences.
  index = -1

  while (++index < events.length) {
    if (events[index][1].type === 'attentionSequence') {
      events[index][1].type = 'data'
    }
  }

  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeAttention(effects, ok) {
  const attentionMarkers = this.parser.constructs.attentionMarkers.null
  const previous = this.previous
  const before = (0,micromark_util_classify_character__WEBPACK_IMPORTED_MODULE_4__.classifyCharacter)(previous)

  /** @type {NonNullable<Code>} */
  let marker

  return start

  /**
   * Before a sequence.
   *
   * ```markdown
   * > | **
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_5__.codes.asterisk || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_5__.codes.underscore,
      'expected asterisk or underscore'
    )
    marker = code
    effects.enter('attentionSequence')
    return inside(code)
  }

  /**
   * In a sequence.
   *
   * ```markdown
   * > | **
   *     ^^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker) {
      effects.consume(code)
      return inside
    }

    const token = effects.exit('attentionSequence')

    // To do: next major: move this to resolver, just like `markdown-rs`.
    const after = (0,micromark_util_classify_character__WEBPACK_IMPORTED_MODULE_4__.classifyCharacter)(code)

    // Always populated by defaults.
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(attentionMarkers, 'expected `attentionMarkers` to be populated')

    const open =
      !after ||
      (after === micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_6__.constants.characterGroupPunctuation && before) ||
      attentionMarkers.includes(code)
    const close =
      !before ||
      (before === micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_6__.constants.characterGroupPunctuation && after) ||
      attentionMarkers.includes(previous)

    token._open = Boolean(
      marker === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_5__.codes.asterisk ? open : open && (before || !close)
    )
    token._close = Boolean(
      marker === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_5__.codes.asterisk ? close : close && (after || !open)
    )
    return ok(code)
  }
}

/**
 * Move a point a bit.
 *
 * Note: `move` only works inside lines! It’s not possible to move past other
 * chunks (replacement characters, tabs, or line endings).
 *
 * @param {Point} point
 * @param {number} offset
 * @returns {void}
 */
function movePoint(point, offset) {
  point.column += offset
  point.offset += offset
  point._bufferIndex += offset
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/autolink.js":
/*!********************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/autolink.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   autolink: function() { return /* binding */ autolink; }
/* harmony export */ });
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */







/** @type {Construct} */
const autolink = {name: 'autolink', tokenize: tokenizeAutolink}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeAutolink(effects, ok, nok) {
  let size = 0

  return start

  /**
   * Start of an autolink.
   *
   * ```markdown
   * > | a<https://example.com>b
   *      ^
   * > | a<user@example.com>b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.lessThan, 'expected `<`')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.autolink)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.autolinkMarker)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.autolinkMarker)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.autolinkProtocol)
    return open
  }

  /**
   * After `<`, at protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *       ^
   * > | a<user@example.com>b
   *       ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiAlpha)(code)) {
      effects.consume(code)
      return schemeOrEmailAtext
    }

    return emailAtext(code)
  }

  /**
   * At second byte of protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *        ^
   * > | a<user@example.com>b
   *        ^
   * ```
   *
   * @type {State}
   */
  function schemeOrEmailAtext(code) {
    // ASCII alphanumeric and `+`, `-`, and `.`.
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.plusSign ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dash ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dot ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiAlphanumeric)(code)
    ) {
      // Count the previous alphabetical from `open` too.
      size = 1
      return schemeInsideOrEmailAtext(code)
    }

    return emailAtext(code)
  }

  /**
   * In ambiguous protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *        ^
   * > | a<user@example.com>b
   *        ^
   * ```
   *
   * @type {State}
   */
  function schemeInsideOrEmailAtext(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.colon) {
      effects.consume(code)
      size = 0
      return urlInside
    }

    // ASCII alphanumeric and `+`, `-`, and `.`.
    if (
      (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.plusSign ||
        code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dash ||
        code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dot ||
        (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiAlphanumeric)(code)) &&
      size++ < micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__.constants.autolinkSchemeSizeMax
    ) {
      effects.consume(code)
      return schemeInsideOrEmailAtext
    }

    size = 0
    return emailAtext(code)
  }

  /**
   * After protocol, in URL.
   *
   * ```markdown
   * > | a<https://example.com>b
   *             ^
   * ```
   *
   * @type {State}
   */
  function urlInside(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.greaterThan) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.autolinkProtocol)
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.autolinkMarker)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.autolinkMarker)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.autolink)
      return ok
    }

    // ASCII control, space, or `<`.
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.space ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.lessThan ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiControl)(code)
    ) {
      return nok(code)
    }

    effects.consume(code)
    return urlInside
  }

  /**
   * In email atext.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *              ^
   * ```
   *
   * @type {State}
   */
  function emailAtext(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.atSign) {
      effects.consume(code)
      return emailAtSignOrDot
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiAtext)(code)) {
      effects.consume(code)
      return emailAtext
    }

    return nok(code)
  }

  /**
   * In label, after at-sign or dot.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *                 ^       ^
   * ```
   *
   * @type {State}
   */
  function emailAtSignOrDot(code) {
    return (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiAlphanumeric)(code) ? emailLabel(code) : nok(code)
  }

  /**
   * In label, where `.` and `>` are allowed.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *                   ^
   * ```
   *
   * @type {State}
   */
  function emailLabel(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dot) {
      effects.consume(code)
      size = 0
      return emailAtSignOrDot
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.greaterThan) {
      // Exit, then change the token type.
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.autolinkProtocol).type = micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.autolinkEmail
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.autolinkMarker)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.autolinkMarker)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.autolink)
      return ok
    }

    return emailValue(code)
  }

  /**
   * In label, where `.` and `>` are *not* allowed.
   *
   * Though, this is also used in `emailLabel` to parse other values.
   *
   * ```markdown
   * > | a<user.name@ex-ample.com>b
   *                    ^
   * ```
   *
   * @type {State}
   */
  function emailValue(code) {
    // ASCII alphanumeric or `-`.
    if (
      (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dash || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiAlphanumeric)(code)) &&
      size++ < micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__.constants.autolinkDomainSizeMax
    ) {
      const next = code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dash ? emailValue : emailLabel
      effects.consume(code)
      return next
    }

    return nok(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/blank-line.js":
/*!**********************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/blank-line.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   blankLine: function() { return /* binding */ blankLine; }
/* harmony export */ });
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */






/** @type {Construct} */
const blankLine = {tokenize: tokenizeBlankLine, partial: true}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlankLine(effects, ok, nok) {
  return start

  /**
   * Start of blank line.
   *
   * > 👉 **Note**: `␠` represents a space character.
   *
   * ```markdown
   * > | ␠␠␊
   *     ^
   * > | ␊
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    return (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_0__.markdownSpace)(code)
      ? (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_1__.factorySpace)(effects, after, micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.linePrefix)(code)
      : after(code)
  }

  /**
   * At eof/eol, after optional whitespace.
   *
   * > 👉 **Note**: `␠` represents a space character.
   *
   * ```markdown
   * > | ␠␠␊
   *       ^
   * > | ␊
   *     ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_3__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_0__.markdownLineEnding)(code) ? ok(code) : nok(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/block-quote.js":
/*!***********************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/block-quote.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   blockQuote: function() { return /* binding */ blockQuote; }
/* harmony export */ });
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Exiter} Exiter
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */








/** @type {Construct} */
const blockQuote = {
  name: 'blockQuote',
  tokenize: tokenizeBlockQuoteStart,
  continuation: {tokenize: tokenizeBlockQuoteContinuation},
  exit
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlockQuoteStart(effects, ok, nok) {
  const self = this

  return start

  /**
   * Start of block quote.
   *
   * ```markdown
   * > | > a
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.greaterThan) {
      const state = self.containerState

      ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(state, 'expected `containerState` to be defined in container')

      if (!state.open) {
        effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.blockQuote, {_container: true})
        state.open = true
      }

      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.blockQuotePrefix)
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.blockQuoteMarker)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.blockQuoteMarker)
      return after
    }

    return nok(code)
  }

  /**
   * After `>`, before optional whitespace.
   *
   * ```markdown
   * > | > a
   *      ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownSpace)(code)) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.blockQuotePrefixWhitespace)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.blockQuotePrefixWhitespace)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.blockQuotePrefix)
      return ok
    }

    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.blockQuotePrefix)
    return ok(code)
  }
}

/**
 * Start of block quote continuation.
 *
 * ```markdown
 *   | > a
 * > | > b
 *     ^
 * ```
 *
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlockQuoteContinuation(effects, ok, nok) {
  const self = this

  return contStart

  /**
   * Start of block quote continuation.
   *
   * Also used to parse the first block quote opening.
   *
   * ```markdown
   *   | > a
   * > | > b
   *     ^
   * ```
   *
   * @type {State}
   */
  function contStart(code) {
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownSpace)(code)) {
      // Always populated by defaults.
      (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
        self.parser.constructs.disable.null,
        'expected `disable.null` to be populated'
      )

      return (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_4__.factorySpace)(
        effects,
        contBefore,
        micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.linePrefix,
        self.parser.constructs.disable.null.includes('codeIndented')
          ? undefined
          : micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_5__.constants.tabSize
      )(code)
    }

    return contBefore(code)
  }

  /**
   * At `>`, after optional whitespace.
   *
   * Also used to parse the first block quote opening.
   *
   * ```markdown
   *   | > a
   * > | > b
   *     ^
   * ```
   *
   * @type {State}
   */
  function contBefore(code) {
    return effects.attempt(blockQuote, ok, nok)(code)
  }
}

/** @type {Exiter} */
function exit(effects) {
  effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.blockQuote)
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/character-escape.js":
/*!****************************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/character-escape.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   characterEscape: function() { return /* binding */ characterEscape; }
/* harmony export */ });
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */






/** @type {Construct} */
const characterEscape = {
  name: 'characterEscape',
  tokenize: tokenizeCharacterEscape
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCharacterEscape(effects, ok, nok) {
  return start

  /**
   * Start of character escape.
   *
   * ```markdown
   * > | a\*b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.backslash, 'expected `\\`')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterEscape)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.escapeMarker)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.escapeMarker)
    return inside
  }

  /**
   * After `\`, at punctuation.
   *
   * ```markdown
   * > | a\*b
   *       ^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    // ASCII punctuation.
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiPunctuation)(code)) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterEscapeValue)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterEscapeValue)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterEscape)
      return ok
    }

    return nok(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/character-reference.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/character-reference.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   characterReference: function() { return /* binding */ characterReference; }
/* harmony export */ });
/* harmony import */ var decode_named_character_reference__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! decode-named-character-reference */ "./node_modules/decode-named-character-reference/index.dom.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */








/** @type {Construct} */
const characterReference = {
  name: 'characterReference',
  tokenize: tokenizeCharacterReference
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCharacterReference(effects, ok, nok) {
  const self = this
  let size = 0
  /** @type {number} */
  let max
  /** @type {(code: Code) => boolean} */
  let test

  return start

  /**
   * Start of character reference.
   *
   * ```markdown
   * > | a&amp;b
   *      ^
   * > | a&#123;b
   *      ^
   * > | a&#x9;b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.ampersand, 'expected `&`')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterReference)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterReferenceMarker)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterReferenceMarker)
    return open
  }

  /**
   * After `&`, at `#` for numeric references or alphanumeric for named
   * references.
   *
   * ```markdown
   * > | a&amp;b
   *       ^
   * > | a&#123;b
   *       ^
   * > | a&#x9;b
   *       ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.numberSign) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterReferenceMarkerNumeric)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterReferenceMarkerNumeric)
      return numeric
    }

    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterReferenceValue)
    max = micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.characterReferenceNamedSizeMax
    test = micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.asciiAlphanumeric
    return value(code)
  }

  /**
   * After `#`, at `x` for hexadecimals or digit for decimals.
   *
   * ```markdown
   * > | a&#123;b
   *        ^
   * > | a&#x9;b
   *        ^
   * ```
   *
   * @type {State}
   */
  function numeric(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.uppercaseX || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.lowercaseX) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterReferenceMarkerHexadecimal)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterReferenceMarkerHexadecimal)
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterReferenceValue)
      max = micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.characterReferenceHexadecimalSizeMax
      test = micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.asciiHexDigit
      return value
    }

    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterReferenceValue)
    max = micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.characterReferenceDecimalSizeMax
    test = micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.asciiDigit
    return value(code)
  }

  /**
   * After markers (`&#x`, `&#`, or `&`), in value, before `;`.
   *
   * The character reference kind defines what and how many characters are
   * allowed.
   *
   * ```markdown
   * > | a&amp;b
   *       ^^^
   * > | a&#123;b
   *        ^^^
   * > | a&#x9;b
   *         ^
   * ```
   *
   * @type {State}
   */
  function value(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.semicolon && size) {
      const token = effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterReferenceValue)

      if (
        test === micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.asciiAlphanumeric &&
        !(0,decode_named_character_reference__WEBPACK_IMPORTED_MODULE_5__.decodeNamedCharacterReference)(self.sliceSerialize(token))
      ) {
        return nok(code)
      }

      // To do: `markdown-rs` uses a different name:
      // `CharacterReferenceMarkerSemi`.
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterReferenceMarker)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterReferenceMarker)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.characterReference)
      return ok
    }

    if (test(code) && size++ < max) {
      effects.consume(code)
      return value
    }

    return nok(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/code-fenced.js":
/*!***********************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/code-fenced.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   codeFenced: function() { return /* binding */ codeFenced; }
/* harmony export */ });
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */








/** @type {Construct} */
const nonLazyContinuation = {
  tokenize: tokenizeNonLazyContinuation,
  partial: true
}

/** @type {Construct} */
const codeFenced = {
  name: 'codeFenced',
  tokenize: tokenizeCodeFenced,
  concrete: true
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCodeFenced(effects, ok, nok) {
  const self = this
  /** @type {Construct} */
  const closeStart = {tokenize: tokenizeCloseStart, partial: true}
  let initialPrefix = 0
  let sizeOpen = 0
  /** @type {NonNullable<Code>} */
  let marker

  return start

  /**
   * Start of code.
   *
   * ```markdown
   * > | ~~~js
   *     ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: parse whitespace like `markdown-rs`.
    return beforeSequenceOpen(code)
  }

  /**
   * In opening fence, after prefix, at sequence.
   *
   * ```markdown
   * > | ~~~js
   *     ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function beforeSequenceOpen(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.graveAccent || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.tilde,
      'expected `` ` `` or `~`'
    )

    const tail = self.events[self.events.length - 1]
    initialPrefix =
      tail && tail[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.linePrefix
        ? tail[2].sliceSerialize(tail[1], true).length
        : 0

    marker = code
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFenced)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFencedFence)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFencedFenceSequence)
    return sequenceOpen(code)
  }

  /**
   * In opening fence sequence.
   *
   * ```markdown
   * > | ~~~js
   *      ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === marker) {
      sizeOpen++
      effects.consume(code)
      return sequenceOpen
    }

    if (sizeOpen < micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.codeFencedSequenceSizeMin) {
      return nok(code)
    }

    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFencedFenceSequence)
    return (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownSpace)(code)
      ? (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_5__.factorySpace)(effects, infoBefore, micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.whitespace)(code)
      : infoBefore(code)
  }

  /**
   * In opening fence, after the sequence (and optional whitespace), before info.
   *
   * ```markdown
   * > | ~~~js
   *        ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function infoBefore(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code)) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFencedFence)
      return self.interrupt
        ? ok(code)
        : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code)
    }

    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFencedFenceInfo)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.chunkString, {contentType: micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.contentTypeString})
    return info(code)
  }

  /**
   * In info.
   *
   * ```markdown
   * > | ~~~js
   *        ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function info(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code)) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.chunkString)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFencedFenceInfo)
      return infoBefore(code)
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownSpace)(code)) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.chunkString)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFencedFenceInfo)
      return (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_5__.factorySpace)(effects, metaBefore, micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.whitespace)(code)
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.graveAccent && code === marker) {
      return nok(code)
    }

    effects.consume(code)
    return info
  }

  /**
   * In opening fence, after info and whitespace, before meta.
   *
   * ```markdown
   * > | ~~~js eval
   *           ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function metaBefore(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code)) {
      return infoBefore(code)
    }

    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFencedFenceMeta)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.chunkString, {contentType: micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.contentTypeString})
    return meta(code)
  }

  /**
   * In meta.
   *
   * ```markdown
   * > | ~~~js eval
   *           ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function meta(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code)) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.chunkString)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFencedFenceMeta)
      return infoBefore(code)
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.graveAccent && code === marker) {
      return nok(code)
    }

    effects.consume(code)
    return meta
  }

  /**
   * At eol/eof in code, before a non-lazy closing fence or content.
   *
   * ```markdown
   * > | ~~~js
   *          ^
   * > | alert(1)
   *             ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function atNonLazyBreak(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code), 'expected eol')
    return effects.attempt(closeStart, after, contentBefore)(code)
  }

  /**
   * Before code content, not a closing fence, at eol.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *             ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentBefore(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code), 'expected eol')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineEnding)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineEnding)
    return contentStart
  }

  /**
   * Before code content, not a closing fence.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentStart(code) {
    return initialPrefix > 0 && (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownSpace)(code)
      ? (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_5__.factorySpace)(
          effects,
          beforeContentChunk,
          micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.linePrefix,
          initialPrefix + 1
        )(code)
      : beforeContentChunk(code)
  }

  /**
   * Before code content, after optional prefix.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function beforeContentChunk(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code)) {
      return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code)
    }

    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFlowValue)
    return contentChunk(code)
  }

  /**
   * In code content.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^^^^^^^^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentChunk(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code)) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFlowValue)
      return beforeContentChunk(code)
    }

    effects.consume(code)
    return contentChunk
  }

  /**
   * After code.
   *
   * ```markdown
   *   | ~~~js
   *   | alert(1)
   * > | ~~~
   *        ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFenced)
    return ok(code)
  }

  /**
   * @this {TokenizeContext}
   * @type {Tokenizer}
   */
  function tokenizeCloseStart(effects, ok, nok) {
    let size = 0

    return startBefore

    /**
     *
     *
     * @type {State}
     */
    function startBefore(code) {
      ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code), 'expected eol')
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineEnding)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineEnding)
      return start
    }

    /**
     * Before closing fence, at optional whitespace.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function start(code) {
      // Always populated by defaults.
      (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
        self.parser.constructs.disable.null,
        'expected `disable.null` to be populated'
      )

      // To do: `enter` here or in next state?
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFencedFence)
      return (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownSpace)(code)
        ? (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_5__.factorySpace)(
            effects,
            beforeSequenceClose,
            micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.linePrefix,
            self.parser.constructs.disable.null.includes('codeIndented')
              ? undefined
              : micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.tabSize
          )(code)
        : beforeSequenceClose(code)
    }

    /**
     * In closing fence, after optional whitespace, at sequence.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function beforeSequenceClose(code) {
      if (code === marker) {
        effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFencedFenceSequence)
        return sequenceClose(code)
      }

      return nok(code)
    }

    /**
     * In closing fence sequence.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function sequenceClose(code) {
      if (code === marker) {
        size++
        effects.consume(code)
        return sequenceClose
      }

      if (size >= sizeOpen) {
        effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFencedFenceSequence)
        return (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownSpace)(code)
          ? (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_5__.factorySpace)(effects, sequenceCloseAfter, micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.whitespace)(code)
          : sequenceCloseAfter(code)
      }

      return nok(code)
    }

    /**
     * After closing fence sequence, after optional whitespace.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *        ^
     * ```
     *
     * @type {State}
     */
    function sequenceCloseAfter(code) {
      if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code)) {
        effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFencedFence)
        return ok(code)
      }

      return nok(code)
    }
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeNonLazyContinuation(effects, ok, nok) {
  const self = this

  return start

  /**
   *
   *
   * @type {State}
   */
  function start(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof) {
      return nok(code)
    }

    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code), 'expected eol')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineEnding)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineEnding)
    return lineStart
  }

  /**
   *
   *
   * @type {State}
   */
  function lineStart(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/code-indented.js":
/*!*************************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/code-indented.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   codeIndented: function() { return /* binding */ codeIndented; }
/* harmony export */ });
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */








/** @type {Construct} */
const codeIndented = {
  name: 'codeIndented',
  tokenize: tokenizeCodeIndented
}

/** @type {Construct} */
const furtherStart = {tokenize: tokenizeFurtherStart, partial: true}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCodeIndented(effects, ok, nok) {
  const self = this
  return start

  /**
   * Start of code (indented).
   *
   * > **Parsing note**: it is not needed to check if this first line is a
   * > filled line (that it has a non-whitespace character), because blank lines
   * > are parsed already, so we never run into that.
   *
   * ```markdown
   * > |     aaa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: manually check if interrupting like `markdown-rs`.
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_1__.markdownSpace)(code))
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeIndented)
    // To do: use an improved `space_or_tab` function like `markdown-rs`,
    // so that we can drop the next state.
    return (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_3__.factorySpace)(
      effects,
      afterPrefix,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.linePrefix,
      micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__.constants.tabSize + 1
    )(code)
  }

  /**
   * At start, after 1 or 4 spaces.
   *
   * ```markdown
   * > |     aaa
   *         ^
   * ```
   *
   * @type {State}
   */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1]
    return tail &&
      tail[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.linePrefix &&
      tail[2].sliceSerialize(tail[1], true).length >= micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__.constants.tabSize
      ? atBreak(code)
      : nok(code)
  }

  /**
   * At a break.
   *
   * ```markdown
   * > |     aaa
   *         ^  ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_5__.codes.eof) {
      return after(code)
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_1__.markdownLineEnding)(code)) {
      return effects.attempt(furtherStart, atBreak, after)(code)
    }

    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFlowValue)
    return inside(code)
  }

  /**
   * In code content.
   *
   * ```markdown
   * > |     aaa
   *         ^^^^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_5__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_1__.markdownLineEnding)(code)) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeFlowValue)
      return atBreak(code)
    }

    effects.consume(code)
    return inside
  }

  /** @type {State} */
  function after(code) {
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.codeIndented)
    // To do: allow interrupting like `markdown-rs`.
    // Feel free to interrupt.
    // tokenizer.interrupt = false
    return ok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeFurtherStart(effects, ok, nok) {
  const self = this

  return furtherStart

  /**
   * At eol, trying to parse another indent.
   *
   * ```markdown
   * > |     aaa
   *            ^
   *   |     bbb
   * ```
   *
   * @type {State}
   */
  function furtherStart(code) {
    // To do: improve `lazy` / `pierce` handling.
    // If this is a lazy line, it can’t be code.
    if (self.parser.lazy[self.now().line]) {
      return nok(code)
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_1__.markdownLineEnding)(code)) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineEnding)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineEnding)
      return furtherStart
    }

    // To do: the code here in `micromark-js` is a bit different from
    // `markdown-rs` because there it can attempt spaces.
    // We can’t yet.
    //
    // To do: use an improved `space_or_tab` function like `markdown-rs`,
    // so that we can drop the next state.
    return (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_3__.factorySpace)(
      effects,
      afterPrefix,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.linePrefix,
      micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__.constants.tabSize + 1
    )(code)
  }

  /**
   * At start, after 1 or 4 spaces.
   *
   * ```markdown
   * > |     aaa
   *         ^
   * ```
   *
   * @type {State}
   */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1]
    return tail &&
      tail[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.linePrefix &&
      tail[2].sliceSerialize(tail[1], true).length >= micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__.constants.tabSize
      ? ok(code)
      : (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_1__.markdownLineEnding)(code)
      ? furtherStart(code)
      : nok(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/code-text.js":
/*!*********************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/code-text.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   codeText: function() { return /* binding */ codeText; }
/* harmony export */ });
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Previous} Previous
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */






/** @type {Construct} */
const codeText = {
  name: 'codeText',
  tokenize: tokenizeCodeText,
  resolve: resolveCodeText,
  previous
}

// To do: next major: don’t resolve, like `markdown-rs`.
/** @type {Resolver} */
function resolveCodeText(events) {
  let tailExitIndex = events.length - 4
  let headEnterIndex = 3
  /** @type {number} */
  let index
  /** @type {number | undefined} */
  let enter

  // If we start and end with an EOL or a space.
  if (
    (events[headEnterIndex][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding ||
      events[headEnterIndex][1].type === 'space') &&
    (events[tailExitIndex][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding ||
      events[tailExitIndex][1].type === 'space')
  ) {
    index = headEnterIndex

    // And we have data.
    while (++index < tailExitIndex) {
      if (events[index][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.codeTextData) {
        // Then we have padding.
        events[headEnterIndex][1].type = micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.codeTextPadding
        events[tailExitIndex][1].type = micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.codeTextPadding
        headEnterIndex += 2
        tailExitIndex -= 2
        break
      }
    }
  }

  // Merge adjacent spaces and data.
  index = headEnterIndex - 1
  tailExitIndex++

  while (++index <= tailExitIndex) {
    if (enter === undefined) {
      if (
        index !== tailExitIndex &&
        events[index][1].type !== micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding
      ) {
        enter = index
      }
    } else if (
      index === tailExitIndex ||
      events[index][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding
    ) {
      events[enter][1].type = micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.codeTextData

      if (index !== enter + 2) {
        events[enter][1].end = events[index - 1][1].end
        events.splice(enter + 2, index - enter - 2)
        tailExitIndex -= index - enter - 2
        index = enter + 2
      }

      enter = undefined
    }
  }

  return events
}

/**
 * @this {TokenizeContext}
 * @type {Previous}
 */
function previous(code) {
  // If there is a previous code, there will always be a tail.
  return (
    code !== micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.graveAccent ||
    this.events[this.events.length - 1][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.characterEscape
  )
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCodeText(effects, ok, nok) {
  const self = this
  let sizeOpen = 0
  /** @type {number} */
  let size
  /** @type {Token} */
  let token

  return start

  /**
   * Start of code (text).
   *
   * ```markdown
   * > | `a`
   *     ^
   * > | \`a`
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.graveAccent, 'expected `` ` ``')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(previous.call(self, self.previous), 'expected correct previous')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.codeText)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.codeTextSequence)
    return sequenceOpen(code)
  }

  /**
   * In opening sequence.
   *
   * ```markdown
   * > | `a`
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.graveAccent) {
      effects.consume(code)
      sizeOpen++
      return sequenceOpen
    }

    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.codeTextSequence)
    return between(code)
  }

  /**
   * Between something and something else.
   *
   * ```markdown
   * > | `a`
   *      ^^
   * ```
   *
   * @type {State}
   */
  function between(code) {
    // EOF.
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof) {
      return nok(code)
    }

    // To do: next major: don’t do spaces in resolve, but when compiling,
    // like `markdown-rs`.
    // Tabs don’t work, and virtual spaces don’t make sense.
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.space) {
      effects.enter('space')
      effects.consume(code)
      effects.exit('space')
      return between
    }

    // Closing fence? Could also be data.
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.graveAccent) {
      token = effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.codeTextSequence)
      size = 0
      return sequenceClose(code)
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding)
      return between
    }

    // Data.
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.codeTextData)
    return data(code)
  }

  /**
   * In data.
   *
   * ```markdown
   * > | `a`
   *      ^
   * ```
   *
   * @type {State}
   */
  function data(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.space ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.graveAccent ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)
    ) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.codeTextData)
      return between(code)
    }

    effects.consume(code)
    return data
  }

  /**
   * In closing sequence.
   *
   * ```markdown
   * > | `a`
   *       ^
   * ```
   *
   * @type {State}
   */
  function sequenceClose(code) {
    // More.
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.graveAccent) {
      effects.consume(code)
      size++
      return sequenceClose
    }

    // Done!
    if (size === sizeOpen) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.codeTextSequence)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.codeText)
      return ok(code)
    }

    // More or less accents: mark as data.
    token.type = micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.codeTextData
    return data(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/content.js":
/*!*******************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/content.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   content: function() { return /* binding */ content; }
/* harmony export */ });
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_subtokenize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-subtokenize */ "./node_modules/micromark-util-subtokenize/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */









/**
 * No name because it must not be turned off.
 * @type {Construct}
 */
const content = {tokenize: tokenizeContent, resolve: resolveContent}

/** @type {Construct} */
const continuationConstruct = {tokenize: tokenizeContinuation, partial: true}

/**
 * Content is transparent: it’s parsed right now. That way, definitions are also
 * parsed right now: before text in paragraphs (specifically, media) are parsed.
 *
 * @type {Resolver}
 */
function resolveContent(events) {
  ;(0,micromark_util_subtokenize__WEBPACK_IMPORTED_MODULE_1__.subtokenize)(events)
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeContent(effects, ok) {
  /** @type {Token | undefined} */
  let previous

  return chunkStart

  /**
   * Before a content chunk.
   *
   * ```markdown
   * > | abc
   *     ^
   * ```
   *
   * @type {State}
   */
  function chunkStart(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      code !== micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof && !(0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code),
      'expected no eof or eol'
    )

    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.content)
    previous = effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.chunkContent, {
      contentType: micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_5__.constants.contentTypeContent
    })
    return chunkInside(code)
  }

  /**
   * In a content chunk.
   *
   * ```markdown
   * > | abc
   *     ^^^
   * ```
   *
   * @type {State}
   */
  function chunkInside(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof) {
      return contentEnd(code)
    }

    // To do: in `markdown-rs`, each line is parsed on its own, and everything
    // is stitched together resolving.
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)) {
      return effects.check(
        continuationConstruct,
        contentContinue,
        contentEnd
      )(code)
    }

    // Data.
    effects.consume(code)
    return chunkInside
  }

  /**
   *
   *
   * @type {State}
   */
  function contentEnd(code) {
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.chunkContent)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.content)
    return ok(code)
  }

  /**
   *
   *
   * @type {State}
   */
  function contentContinue(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code), 'expected eol')
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.chunkContent)
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(previous, 'expected previous token')
    previous.next = effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.chunkContent, {
      contentType: micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_5__.constants.contentTypeContent,
      previous
    })
    previous = previous.next
    return chunkInside
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeContinuation(effects, ok, nok) {
  const self = this

  return startLookahead

  /**
   *
   *
   * @type {State}
   */
  function startLookahead(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code), 'expected a line ending')
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.chunkContent)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.lineEnding)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.lineEnding)
    return (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_6__.factorySpace)(effects, prefixed, micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.linePrefix)
  }

  /**
   *
   *
   * @type {State}
   */
  function prefixed(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)) {
      return nok(code)
    }

    // Always populated by defaults.
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      self.parser.constructs.disable.null,
      'expected `disable.null` to be populated'
    )

    const tail = self.events[self.events.length - 1]

    if (
      !self.parser.constructs.disable.null.includes('codeIndented') &&
      tail &&
      tail[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.linePrefix &&
      tail[2].sliceSerialize(tail[1], true).length >= micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_5__.constants.tabSize
    ) {
      return ok(code)
    }

    return effects.interrupt(self.parser.constructs.flow, nok, ok)(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/definition.js":
/*!**********************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/definition.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   definition: function() { return /* binding */ definition; }
/* harmony export */ });
/* harmony import */ var micromark_factory_destination__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! micromark-factory-destination */ "./node_modules/micromark-factory-destination/dev/index.js");
/* harmony import */ var micromark_factory_label__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-factory-label */ "./node_modules/micromark-factory-label/dev/index.js");
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_factory_title__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! micromark-factory-title */ "./node_modules/micromark-factory-title/dev/index.js");
/* harmony import */ var micromark_factory_whitespace__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! micromark-factory-whitespace */ "./node_modules/micromark-factory-whitespace/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_normalize_identifier__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-normalize-identifier */ "./node_modules/micromark-util-normalize-identifier/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */












/** @type {Construct} */
const definition = {name: 'definition', tokenize: tokenizeDefinition}

/** @type {Construct} */
const titleBefore = {tokenize: tokenizeTitleBefore, partial: true}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeDefinition(effects, ok, nok) {
  const self = this
  /** @type {string} */
  let identifier

  return start

  /**
   * At start of a definition.
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // Do not interrupt paragraphs (but do follow definitions).
    // To do: do `interrupt` the way `markdown-rs` does.
    // To do: parse whitespace the way `markdown-rs` does.
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definition)
    return before(code)
  }

  /**
   * After optional whitespace, at `[`.
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    // To do: parse whitespace the way `markdown-rs` does.
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.leftSquareBracket, 'expected `[`')
    return micromark_factory_label__WEBPACK_IMPORTED_MODULE_3__.factoryLabel.call(
      self,
      effects,
      labelAfter,
      // Note: we don’t need to reset the way `markdown-rs` does.
      nok,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definitionLabel,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definitionLabelMarker,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definitionLabelString
    )(code)
  }

  /**
   * After label.
   *
   * ```markdown
   * > | [a]: b "c"
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelAfter(code) {
    identifier = (0,micromark_util_normalize_identifier__WEBPACK_IMPORTED_MODULE_4__.normalizeIdentifier)(
      self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)
    )

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.colon) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definitionMarker)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definitionMarker)
      return markerAfter
    }

    return nok(code)
  }

  /**
   * After marker.
   *
   * ```markdown
   * > | [a]: b "c"
   *         ^
   * ```
   *
   * @type {State}
   */
  function markerAfter(code) {
    // Note: whitespace is optional.
    return (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_5__.markdownLineEndingOrSpace)(code)
      ? (0,micromark_factory_whitespace__WEBPACK_IMPORTED_MODULE_6__.factoryWhitespace)(effects, destinationBefore)(code)
      : destinationBefore(code)
  }

  /**
   * Before destination.
   *
   * ```markdown
   * > | [a]: b "c"
   *          ^
   * ```
   *
   * @type {State}
   */
  function destinationBefore(code) {
    return (0,micromark_factory_destination__WEBPACK_IMPORTED_MODULE_7__.factoryDestination)(
      effects,
      destinationAfter,
      // Note: we don’t need to reset the way `markdown-rs` does.
      nok,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definitionDestination,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definitionDestinationLiteral,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definitionDestinationLiteralMarker,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definitionDestinationRaw,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definitionDestinationString
    )(code)
  }

  /**
   * After destination.
   *
   * ```markdown
   * > | [a]: b "c"
   *           ^
   * ```
   *
   * @type {State}
   */
  function destinationAfter(code) {
    return effects.attempt(titleBefore, after, after)(code)
  }

  /**
   * After definition.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_5__.markdownSpace)(code)
      ? (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_8__.factorySpace)(effects, afterWhitespace, micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.whitespace)(code)
      : afterWhitespace(code)
  }

  /**
   * After definition, after optional whitespace.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function afterWhitespace(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_5__.markdownLineEnding)(code)) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definition)

      // Note: we don’t care about uniqueness.
      // It’s likely that that doesn’t happen very frequently.
      // It is more likely that it wastes precious time.
      self.parser.defined.push(identifier)

      // To do: `markdown-rs` interrupt.
      // // You’d be interrupting.
      // tokenizer.interrupt = true
      return ok(code)
    }

    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeTitleBefore(effects, ok, nok) {
  return titleBefore

  /**
   * After destination, at whitespace.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *           ^
   * ```
   *
   * @type {State}
   */
  function titleBefore(code) {
    return (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_5__.markdownLineEndingOrSpace)(code)
      ? (0,micromark_factory_whitespace__WEBPACK_IMPORTED_MODULE_6__.factoryWhitespace)(effects, beforeMarker)(code)
      : nok(code)
  }

  /**
   * At title.
   *
   * ```markdown
   *   | [a]: b
   * > | "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function beforeMarker(code) {
    return (0,micromark_factory_title__WEBPACK_IMPORTED_MODULE_9__.factoryTitle)(
      effects,
      titleAfter,
      nok,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definitionTitle,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definitionTitleMarker,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definitionTitleString
    )(code)
  }

  /**
   * After title.
   *
   * ```markdown
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function titleAfter(code) {
    return (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_5__.markdownSpace)(code)
      ? (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_8__.factorySpace)(
          effects,
          titleAfterOptionalWhitespace,
          micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.whitespace
        )(code)
      : titleAfterOptionalWhitespace(code)
  }

  /**
   * After title, after optional whitespace.
   *
   * ```markdown
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function titleAfterOptionalWhitespace(code) {
    return code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_5__.markdownLineEnding)(code) ? ok(code) : nok(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/hard-break-escape.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/hard-break-escape.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hardBreakEscape: function() { return /* binding */ hardBreakEscape; }
/* harmony export */ });
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */






/** @type {Construct} */
const hardBreakEscape = {
  name: 'hardBreakEscape',
  tokenize: tokenizeHardBreakEscape
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHardBreakEscape(effects, ok, nok) {
  return start

  /**
   * Start of a hard break (escape).
   *
   * ```markdown
   * > | a\
   *      ^
   *   | b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.backslash, 'expected `\\`')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.hardBreakEscape)
    effects.consume(code)
    return after
  }

  /**
   * After `\`, at eol.
   *
   * ```markdown
   * > | a\
   *       ^
   *   | b
   * ```
   *
   *  @type {State}
   */
  function after(code) {
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.hardBreakEscape)
      return ok(code)
    }

    return nok(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/heading-atx.js":
/*!***********************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/heading-atx.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   headingAtx: function() { return /* binding */ headingAtx; }
/* harmony export */ });
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_chunked__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-chunked */ "./node_modules/micromark-util-chunked/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */









/** @type {Construct} */
const headingAtx = {
  name: 'headingAtx',
  tokenize: tokenizeHeadingAtx,
  resolve: resolveHeadingAtx
}

/** @type {Resolver} */
function resolveHeadingAtx(events, context) {
  let contentEnd = events.length - 2
  let contentStart = 3
  /** @type {Token} */
  let content
  /** @type {Token} */
  let text

  // Prefix whitespace, part of the opening.
  if (events[contentStart][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.whitespace) {
    contentStart += 2
  }

  // Suffix whitespace, part of the closing.
  if (
    contentEnd - 2 > contentStart &&
    events[contentEnd][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.whitespace
  ) {
    contentEnd -= 2
  }

  if (
    events[contentEnd][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.atxHeadingSequence &&
    (contentStart === contentEnd - 1 ||
      (contentEnd - 4 > contentStart &&
        events[contentEnd - 2][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.whitespace))
  ) {
    contentEnd -= contentStart + 1 === contentEnd ? 2 : 4
  }

  if (contentEnd > contentStart) {
    content = {
      type: micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.atxHeadingText,
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end
    }
    text = {
      type: micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.chunkText,
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end,
      contentType: micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_2__.constants.contentTypeText
    }

    ;(0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_3__.splice)(events, contentStart, contentEnd - contentStart + 1, [
      ['enter', content, context],
      ['enter', text, context],
      ['exit', text, context],
      ['exit', content, context]
    ])
  }

  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHeadingAtx(effects, ok, nok) {
  let size = 0

  return start

  /**
   * Start of a heading (atx).
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: parse indent like `markdown-rs`.
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.atxHeading)
    return before(code)
  }

  /**
   * After optional whitespace, at `#`.
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.numberSign, 'expected `#`')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.atxHeadingSequence)
    return sequenceOpen(code)
  }

  /**
   * In opening sequence.
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.numberSign &&
      size++ < micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_2__.constants.atxHeadingOpeningFenceSizeMax
    ) {
      effects.consume(code)
      return sequenceOpen
    }

    // Always at least one `#`.
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_5__.markdownLineEndingOrSpace)(code)) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.atxHeadingSequence)
      return atBreak(code)
    }

    return nok(code)
  }

  /**
   * After something, before something else.
   *
   * ```markdown
   * > | ## aa
   *       ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.numberSign) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.atxHeadingSequence)
      return sequenceFurther(code)
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_5__.markdownLineEnding)(code)) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.atxHeading)
      // To do: interrupt like `markdown-rs`.
      // // Feel free to interrupt.
      // tokenizer.interrupt = false
      return ok(code)
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_5__.markdownSpace)(code)) {
      return (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_6__.factorySpace)(effects, atBreak, micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.whitespace)(code)
    }

    // To do: generate `data` tokens, add the `text` token later.
    // Needs edit map, see: `markdown.rs`.
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.atxHeadingText)
    return data(code)
  }

  /**
   * In further sequence (after whitespace).
   *
   * Could be normal “visible” hashes in the heading or a final sequence.
   *
   * ```markdown
   * > | ## aa ##
   *           ^
   * ```
   *
   * @type {State}
   */
  function sequenceFurther(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.numberSign) {
      effects.consume(code)
      return sequenceFurther
    }

    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.atxHeadingSequence)
    return atBreak(code)
  }

  /**
   * In text.
   *
   * ```markdown
   * > | ## aa
   *        ^
   * ```
   *
   * @type {State}
   */
  function data(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.eof ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.numberSign ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_5__.markdownLineEndingOrSpace)(code)
    ) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.atxHeadingText)
      return atBreak(code)
    }

    effects.consume(code)
    return data
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/html-flow.js":
/*!*********************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/html-flow.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   htmlFlow: function() { return /* binding */ htmlFlow; }
/* harmony export */ });
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_html_tag_name__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-util-html-tag-name */ "./node_modules/micromark-util-html-tag-name/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/* harmony import */ var _blank_line_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./blank-line.js */ "./node_modules/micromark-core-commonmark/dev/lib/blank-line.js");
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */









/** @type {Construct} */
const htmlFlow = {
  name: 'htmlFlow',
  tokenize: tokenizeHtmlFlow,
  resolveTo: resolveToHtmlFlow,
  concrete: true
}

/** @type {Construct} */
const blankLineBefore = {tokenize: tokenizeBlankLineBefore, partial: true}
const nonLazyContinuationStart = {
  tokenize: tokenizeNonLazyContinuationStart,
  partial: true
}

/** @type {Resolver} */
function resolveToHtmlFlow(events) {
  let index = events.length

  while (index--) {
    if (
      events[index][0] === 'enter' &&
      events[index][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.htmlFlow
    ) {
      break
    }
  }

  if (index > 1 && events[index - 2][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.linePrefix) {
    // Add the prefix start to the HTML token.
    events[index][1].start = events[index - 2][1].start
    // Add the prefix start to the HTML line token.
    events[index + 1][1].start = events[index - 2][1].start
    // Remove the line prefix.
    events.splice(index - 2, 2)
  }

  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHtmlFlow(effects, ok, nok) {
  const self = this
  /** @type {number} */
  let marker
  /** @type {boolean} */
  let closingTag
  /** @type {string} */
  let buffer
  /** @type {number} */
  let index
  /** @type {Code} */
  let markerB

  return start

  /**
   * Start of HTML (flow).
   *
   * ```markdown
   * > | <x />
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: parse indent like `markdown-rs`.
    return before(code)
  }

  /**
   * At `<`, after optional whitespace.
   *
   * ```markdown
   * > | <x />
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.lessThan, 'expected `<`')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.htmlFlow)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.htmlFlowData)
    effects.consume(code)
    return open
  }

  /**
   * After `<`, at tag name or other stuff.
   *
   * ```markdown
   * > | <x />
   *      ^
   * > | <!doctype>
   *      ^
   * > | <!--xxx-->
   *      ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.exclamationMark) {
      effects.consume(code)
      return declarationOpen
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.slash) {
      effects.consume(code)
      closingTag = true
      return tagCloseStart
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.questionMark) {
      effects.consume(code)
      marker = micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlInstruction
      // To do:
      // tokenizer.concrete = true
      // To do: use `markdown-rs` style interrupt.
      // While we’re in an instruction instead of a declaration, we’re on a `?`
      // right now, so we do need to search for `>`, similar to declarations.
      return self.interrupt ? ok : continuationDeclarationInside
    }

    // ASCII alphabetical.
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.asciiAlpha)(code)) {
      effects.consume(code)
      // @ts-expect-error: not null.
      buffer = String.fromCharCode(code)
      return tagName
    }

    return nok(code)
  }

  /**
   * After `<!`, at declaration, comment, or CDATA.
   *
   * ```markdown
   * > | <!doctype>
   *       ^
   * > | <!--xxx-->
   *       ^
   * > | <![CDATA[>&<]]>
   *       ^
   * ```
   *
   * @type {State}
   */
  function declarationOpen(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.dash) {
      effects.consume(code)
      marker = micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlComment
      return commentOpenInside
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.leftSquareBracket) {
      effects.consume(code)
      marker = micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlCdata
      index = 0
      return cdataOpenInside
    }

    // ASCII alphabetical.
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.asciiAlpha)(code)) {
      effects.consume(code)
      marker = micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlDeclaration
      // // Do not form containers.
      // tokenizer.concrete = true
      return self.interrupt ? ok : continuationDeclarationInside
    }

    return nok(code)
  }

  /**
   * After `<!-`, inside a comment, at another `-`.
   *
   * ```markdown
   * > | <!--xxx-->
   *        ^
   * ```
   *
   * @type {State}
   */
  function commentOpenInside(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.dash) {
      effects.consume(code)
      // // Do not form containers.
      // tokenizer.concrete = true
      return self.interrupt ? ok : continuationDeclarationInside
    }

    return nok(code)
  }

  /**
   * After `<![`, inside CDATA, expecting `CDATA[`.
   *
   * ```markdown
   * > | <![CDATA[>&<]]>
   *        ^^^^^^
   * ```
   *
   * @type {State}
   */
  function cdataOpenInside(code) {
    const value = micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.cdataOpeningString

    if (code === value.charCodeAt(index++)) {
      effects.consume(code)

      if (index === value.length) {
        // // Do not form containers.
        // tokenizer.concrete = true
        return self.interrupt ? ok : continuation
      }

      return cdataOpenInside
    }

    return nok(code)
  }

  /**
   * After `</`, in closing tag, at tag name.
   *
   * ```markdown
   * > | </x>
   *       ^
   * ```
   *
   * @type {State}
   */
  function tagCloseStart(code) {
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.asciiAlpha)(code)) {
      effects.consume(code)
      // @ts-expect-error: not null.
      buffer = String.fromCharCode(code)
      return tagName
    }

    return nok(code)
  }

  /**
   * In tag name.
   *
   * ```markdown
   * > | <ab>
   *      ^^
   * > | </ab>
   *       ^^
   * ```
   *
   * @type {State}
   */
  function tagName(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.slash ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.greaterThan ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEndingOrSpace)(code)
    ) {
      const slash = code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.slash
      const name = buffer.toLowerCase()

      if (!slash && !closingTag && micromark_util_html_tag_name__WEBPACK_IMPORTED_MODULE_5__.htmlRawNames.includes(name)) {
        marker = micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlRaw
        // // Do not form containers.
        // tokenizer.concrete = true
        return self.interrupt ? ok(code) : continuation(code)
      }

      if (micromark_util_html_tag_name__WEBPACK_IMPORTED_MODULE_5__.htmlBlockNames.includes(buffer.toLowerCase())) {
        marker = micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlBasic

        if (slash) {
          effects.consume(code)
          return basicSelfClosing
        }

        // // Do not form containers.
        // tokenizer.concrete = true
        return self.interrupt ? ok(code) : continuation(code)
      }

      marker = micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlComplete
      // Do not support complete HTML when interrupting.
      return self.interrupt && !self.parser.lazy[self.now().line]
        ? nok(code)
        : closingTag
        ? completeClosingTagAfter(code)
        : completeAttributeNameBefore(code)
    }

    // ASCII alphanumerical and `-`.
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.dash || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.asciiAlphanumeric)(code)) {
      effects.consume(code)
      buffer += String.fromCharCode(code)
      return tagName
    }

    return nok(code)
  }

  /**
   * After closing slash of a basic tag name.
   *
   * ```markdown
   * > | <div/>
   *          ^
   * ```
   *
   * @type {State}
   */
  function basicSelfClosing(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.greaterThan) {
      effects.consume(code)
      // // Do not form containers.
      // tokenizer.concrete = true
      return self.interrupt ? ok : continuation
    }

    return nok(code)
  }

  /**
   * After closing slash of a complete tag name.
   *
   * ```markdown
   * > | <x/>
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeClosingTagAfter(code) {
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownSpace)(code)) {
      effects.consume(code)
      return completeClosingTagAfter
    }

    return completeEnd(code)
  }

  /**
   * At an attribute name.
   *
   * At first, this state is used after a complete tag name, after whitespace,
   * where it expects optional attributes or the end of the tag.
   * It is also reused after attributes, when expecting more optional
   * attributes.
   *
   * ```markdown
   * > | <a />
   *        ^
   * > | <a :b>
   *        ^
   * > | <a _b>
   *        ^
   * > | <a b>
   *        ^
   * > | <a >
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeNameBefore(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.slash) {
      effects.consume(code)
      return completeEnd
    }

    // ASCII alphanumerical and `:` and `_`.
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.colon || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.underscore || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.asciiAlpha)(code)) {
      effects.consume(code)
      return completeAttributeName
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownSpace)(code)) {
      effects.consume(code)
      return completeAttributeNameBefore
    }

    return completeEnd(code)
  }

  /**
   * In attribute name.
   *
   * ```markdown
   * > | <a :b>
   *         ^
   * > | <a _b>
   *         ^
   * > | <a b>
   *         ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeName(code) {
    // ASCII alphanumerical and `-`, `.`, `:`, and `_`.
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.dash ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.dot ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.colon ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.underscore ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.asciiAlphanumeric)(code)
    ) {
      effects.consume(code)
      return completeAttributeName
    }

    return completeAttributeNameAfter(code)
  }

  /**
   * After attribute name, at an optional initializer, the end of the tag, or
   * whitespace.
   *
   * ```markdown
   * > | <a b>
   *         ^
   * > | <a b=c>
   *         ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeNameAfter(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.equalsTo) {
      effects.consume(code)
      return completeAttributeValueBefore
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownSpace)(code)) {
      effects.consume(code)
      return completeAttributeNameAfter
    }

    return completeAttributeNameBefore(code)
  }

  /**
   * Before unquoted, double quoted, or single quoted attribute value, allowing
   * whitespace.
   *
   * ```markdown
   * > | <a b=c>
   *          ^
   * > | <a b="c">
   *          ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueBefore(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.lessThan ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.equalsTo ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.greaterThan ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.graveAccent
    ) {
      return nok(code)
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.quotationMark || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.apostrophe) {
      effects.consume(code)
      markerB = code
      return completeAttributeValueQuoted
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownSpace)(code)) {
      effects.consume(code)
      return completeAttributeValueBefore
    }

    return completeAttributeValueUnquoted(code)
  }

  /**
   * In double or single quoted attribute value.
   *
   * ```markdown
   * > | <a b="c">
   *           ^
   * > | <a b='c'>
   *           ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueQuoted(code) {
    if (code === markerB) {
      effects.consume(code)
      markerB = null
      return completeAttributeValueQuotedAfter
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code)) {
      return nok(code)
    }

    effects.consume(code)
    return completeAttributeValueQuoted
  }

  /**
   * In unquoted attribute value.
   *
   * ```markdown
   * > | <a b=c>
   *          ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueUnquoted(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.quotationMark ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.apostrophe ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.slash ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.lessThan ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.equalsTo ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.greaterThan ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.graveAccent ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEndingOrSpace)(code)
    ) {
      return completeAttributeNameAfter(code)
    }

    effects.consume(code)
    return completeAttributeValueUnquoted
  }

  /**
   * After double or single quoted attribute value, before whitespace or the
   * end of the tag.
   *
   * ```markdown
   * > | <a b="c">
   *            ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueQuotedAfter(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.slash ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.greaterThan ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownSpace)(code)
    ) {
      return completeAttributeNameBefore(code)
    }

    return nok(code)
  }

  /**
   * In certain circumstances of a complete tag where only an `>` is allowed.
   *
   * ```markdown
   * > | <a b="c">
   *             ^
   * ```
   *
   * @type {State}
   */
  function completeEnd(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.greaterThan) {
      effects.consume(code)
      return completeAfter
    }

    return nok(code)
  }

  /**
   * After `>` in a complete tag.
   *
   * ```markdown
   * > | <x>
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeAfter(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code)) {
      // // Do not form containers.
      // tokenizer.concrete = true
      return continuation(code)
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownSpace)(code)) {
      effects.consume(code)
      return completeAfter
    }

    return nok(code)
  }

  /**
   * In continuation of any HTML kind.
   *
   * ```markdown
   * > | <!--xxx-->
   *          ^
   * ```
   *
   * @type {State}
   */
  function continuation(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.dash && marker === micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlComment) {
      effects.consume(code)
      return continuationCommentInside
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.lessThan && marker === micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlRaw) {
      effects.consume(code)
      return continuationRawTagOpen
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.greaterThan && marker === micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlDeclaration) {
      effects.consume(code)
      return continuationClose
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.questionMark && marker === micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlInstruction) {
      effects.consume(code)
      return continuationDeclarationInside
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.rightSquareBracket && marker === micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlCdata) {
      effects.consume(code)
      return continuationCdataInside
    }

    if (
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code) &&
      (marker === micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlBasic || marker === micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlComplete)
    ) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.htmlFlowData)
      return effects.check(
        blankLineBefore,
        continuationAfter,
        continuationStart
      )(code)
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code)) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.htmlFlowData)
      return continuationStart(code)
    }

    effects.consume(code)
    return continuation
  }

  /**
   * In continuation, at eol.
   *
   * ```markdown
   * > | <x>
   *        ^
   *   | asd
   * ```
   *
   * @type {State}
   */
  function continuationStart(code) {
    return effects.check(
      nonLazyContinuationStart,
      continuationStartNonLazy,
      continuationAfter
    )(code)
  }

  /**
   * In continuation, at eol, before non-lazy content.
   *
   * ```markdown
   * > | <x>
   *        ^
   *   | asd
   * ```
   *
   * @type {State}
   */
  function continuationStartNonLazy(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code))
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding)
    return continuationBefore
  }

  /**
   * In continuation, before non-lazy content.
   *
   * ```markdown
   *   | <x>
   * > | asd
   *     ^
   * ```
   *
   * @type {State}
   */
  function continuationBefore(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code)) {
      return continuationStart(code)
    }

    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.htmlFlowData)
    return continuation(code)
  }

  /**
   * In comment continuation, after one `-`, expecting another.
   *
   * ```markdown
   * > | <!--xxx-->
   *             ^
   * ```
   *
   * @type {State}
   */
  function continuationCommentInside(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.dash) {
      effects.consume(code)
      return continuationDeclarationInside
    }

    return continuation(code)
  }

  /**
   * In raw continuation, after `<`, at `/`.
   *
   * ```markdown
   * > | <script>console.log(1)</script>
   *                            ^
   * ```
   *
   * @type {State}
   */
  function continuationRawTagOpen(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.slash) {
      effects.consume(code)
      buffer = ''
      return continuationRawEndTag
    }

    return continuation(code)
  }

  /**
   * In raw continuation, after `</`, in a raw tag name.
   *
   * ```markdown
   * > | <script>console.log(1)</script>
   *                             ^^^^^^
   * ```
   *
   * @type {State}
   */
  function continuationRawEndTag(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.greaterThan) {
      const name = buffer.toLowerCase()

      if (micromark_util_html_tag_name__WEBPACK_IMPORTED_MODULE_5__.htmlRawNames.includes(name)) {
        effects.consume(code)
        return continuationClose
      }

      return continuation(code)
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.asciiAlpha)(code) && buffer.length < micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlRawSizeMax) {
      effects.consume(code)
      // @ts-expect-error: not null.
      buffer += String.fromCharCode(code)
      return continuationRawEndTag
    }

    return continuation(code)
  }

  /**
   * In cdata continuation, after `]`, expecting `]>`.
   *
   * ```markdown
   * > | <![CDATA[>&<]]>
   *                  ^
   * ```
   *
   * @type {State}
   */
  function continuationCdataInside(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.rightSquareBracket) {
      effects.consume(code)
      return continuationDeclarationInside
    }

    return continuation(code)
  }

  /**
   * In declaration or instruction continuation, at `>`.
   *
   * ```markdown
   * > | <!-->
   *         ^
   * > | <?>
   *       ^
   * > | <!q>
   *        ^
   * > | <!--ab-->
   *             ^
   * > | <![CDATA[>&<]]>
   *                   ^
   * ```
   *
   * @type {State}
   */
  function continuationDeclarationInside(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.greaterThan) {
      effects.consume(code)
      return continuationClose
    }

    // More dashes.
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.dash && marker === micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.htmlComment) {
      effects.consume(code)
      return continuationDeclarationInside
    }

    return continuation(code)
  }

  /**
   * In closed continuation: everything we get until the eol/eof is part of it.
   *
   * ```markdown
   * > | <!doctype>
   *               ^
   * ```
   *
   * @type {State}
   */
  function continuationClose(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code)) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.htmlFlowData)
      return continuationAfter(code)
    }

    effects.consume(code)
    return continuationClose
  }

  /**
   * Done.
   *
   * ```markdown
   * > | <!doctype>
   *               ^
   * ```
   *
   * @type {State}
   */
  function continuationAfter(code) {
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.htmlFlow)
    // // Feel free to interrupt.
    // tokenizer.interrupt = false
    // // No longer concrete.
    // tokenizer.concrete = false
    return ok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeNonLazyContinuationStart(effects, ok, nok) {
  const self = this

  return start

  /**
   * At eol, before continuation.
   *
   * ```markdown
   * > | * ```js
   *            ^
   *   | b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code)) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding)
      return after
    }

    return nok(code)
  }

  /**
   * A continuation.
   *
   * ```markdown
   *   | * ```js
   * > | b
   *     ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlankLineBefore(effects, ok, nok) {
  return start

  /**
   * Before eol, expecting blank line.
   *
   * ```markdown
   * > | <div>
   *          ^
   *   |
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code), 'expected a line ending')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding)
    return effects.attempt(_blank_line_js__WEBPACK_IMPORTED_MODULE_6__.blankLine, ok, nok)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/html-text.js":
/*!*********************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/html-text.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   htmlText: function() { return /* binding */ htmlText; }
/* harmony export */ });
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */








/** @type {Construct} */
const htmlText = {name: 'htmlText', tokenize: tokenizeHtmlText}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHtmlText(effects, ok, nok) {
  const self = this
  /** @type {NonNullable<Code> | undefined} */
  let marker
  /** @type {number} */
  let index
  /** @type {State} */
  let returnState

  return start

  /**
   * Start of HTML (text).
   *
   * ```markdown
   * > | a <b> c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.lessThan, 'expected `<`')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.htmlText)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.htmlTextData)
    effects.consume(code)
    return open
  }

  /**
   * After `<`, at tag name or other stuff.
   *
   * ```markdown
   * > | a <b> c
   *        ^
   * > | a <!doctype> c
   *        ^
   * > | a <!--b--> c
   *        ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.exclamationMark) {
      effects.consume(code)
      return declarationOpen
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.slash) {
      effects.consume(code)
      return tagCloseStart
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.questionMark) {
      effects.consume(code)
      return instruction
    }

    // ASCII alphabetical.
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiAlpha)(code)) {
      effects.consume(code)
      return tagOpen
    }

    return nok(code)
  }

  /**
   * After `<!`, at declaration, comment, or CDATA.
   *
   * ```markdown
   * > | a <!doctype> c
   *         ^
   * > | a <!--b--> c
   *         ^
   * > | a <![CDATA[>&<]]> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function declarationOpen(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dash) {
      effects.consume(code)
      return commentOpenInside
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.leftSquareBracket) {
      effects.consume(code)
      index = 0
      return cdataOpenInside
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiAlpha)(code)) {
      effects.consume(code)
      return declaration
    }

    return nok(code)
  }

  /**
   * In a comment, after `<!-`, at another `-`.
   *
   * ```markdown
   * > | a <!--b--> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function commentOpenInside(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dash) {
      effects.consume(code)
      return commentEnd
    }

    return nok(code)
  }

  /**
   * In comment.
   *
   * ```markdown
   * > | a <!--b--> c
   *           ^
   * ```
   *
   * @type {State}
   */
  function comment(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof) {
      return nok(code)
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dash) {
      effects.consume(code)
      return commentClose
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)) {
      returnState = comment
      return lineEndingBefore(code)
    }

    effects.consume(code)
    return comment
  }

  /**
   * In comment, after `-`.
   *
   * ```markdown
   * > | a <!--b--> c
   *             ^
   * ```
   *
   * @type {State}
   */
  function commentClose(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dash) {
      effects.consume(code)
      return commentEnd
    }

    return comment(code)
  }

  /**
   * In comment, after `--`.
   *
   * ```markdown
   * > | a <!--b--> c
   *              ^
   * ```
   *
   * @type {State}
   */
  function commentEnd(code) {
    return code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.greaterThan
      ? end(code)
      : code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dash
      ? commentClose(code)
      : comment(code)
  }

  /**
   * After `<![`, in CDATA, expecting `CDATA[`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *          ^^^^^^
   * ```
   *
   * @type {State}
   */
  function cdataOpenInside(code) {
    const value = micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__.constants.cdataOpeningString

    if (code === value.charCodeAt(index++)) {
      effects.consume(code)
      return index === value.length ? cdata : cdataOpenInside
    }

    return nok(code)
  }

  /**
   * In CDATA.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                ^^^
   * ```
   *
   * @type {State}
   */
  function cdata(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof) {
      return nok(code)
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.rightSquareBracket) {
      effects.consume(code)
      return cdataClose
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)) {
      returnState = cdata
      return lineEndingBefore(code)
    }

    effects.consume(code)
    return cdata
  }

  /**
   * In CDATA, after `]`, at another `]`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                    ^
   * ```
   *
   * @type {State}
   */
  function cdataClose(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.rightSquareBracket) {
      effects.consume(code)
      return cdataEnd
    }

    return cdata(code)
  }

  /**
   * In CDATA, after `]]`, at `>`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                     ^
   * ```
   *
   * @type {State}
   */
  function cdataEnd(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.greaterThan) {
      return end(code)
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.rightSquareBracket) {
      effects.consume(code)
      return cdataEnd
    }

    return cdata(code)
  }

  /**
   * In declaration.
   *
   * ```markdown
   * > | a <!b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function declaration(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.greaterThan) {
      return end(code)
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)) {
      returnState = declaration
      return lineEndingBefore(code)
    }

    effects.consume(code)
    return declaration
  }

  /**
   * In instruction.
   *
   * ```markdown
   * > | a <?b?> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function instruction(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof) {
      return nok(code)
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.questionMark) {
      effects.consume(code)
      return instructionClose
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)) {
      returnState = instruction
      return lineEndingBefore(code)
    }

    effects.consume(code)
    return instruction
  }

  /**
   * In instruction, after `?`, at `>`.
   *
   * ```markdown
   * > | a <?b?> c
   *           ^
   * ```
   *
   * @type {State}
   */
  function instructionClose(code) {
    return code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.greaterThan ? end(code) : instruction(code)
  }

  /**
   * After `</`, in closing tag, at tag name.
   *
   * ```markdown
   * > | a </b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagCloseStart(code) {
    // ASCII alphabetical.
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiAlpha)(code)) {
      effects.consume(code)
      return tagClose
    }

    return nok(code)
  }

  /**
   * After `</x`, in a tag name.
   *
   * ```markdown
   * > | a </b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagClose(code) {
    // ASCII alphanumerical and `-`.
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dash || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiAlphanumeric)(code)) {
      effects.consume(code)
      return tagClose
    }

    return tagCloseBetween(code)
  }

  /**
   * In closing tag, after tag name.
   *
   * ```markdown
   * > | a </b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagCloseBetween(code) {
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)) {
      returnState = tagCloseBetween
      return lineEndingBefore(code)
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownSpace)(code)) {
      effects.consume(code)
      return tagCloseBetween
    }

    return end(code)
  }

  /**
   * After `<x`, in opening tag name.
   *
   * ```markdown
   * > | a <b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagOpen(code) {
    // ASCII alphanumerical and `-`.
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dash || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiAlphanumeric)(code)) {
      effects.consume(code)
      return tagOpen
    }

    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.slash ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.greaterThan ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEndingOrSpace)(code)
    ) {
      return tagOpenBetween(code)
    }

    return nok(code)
  }

  /**
   * In opening tag, after tag name.
   *
   * ```markdown
   * > | a <b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagOpenBetween(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.slash) {
      effects.consume(code)
      return end
    }

    // ASCII alphabetical and `:` and `_`.
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.colon || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.underscore || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiAlpha)(code)) {
      effects.consume(code)
      return tagOpenAttributeName
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)) {
      returnState = tagOpenBetween
      return lineEndingBefore(code)
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownSpace)(code)) {
      effects.consume(code)
      return tagOpenBetween
    }

    return end(code)
  }

  /**
   * In attribute name.
   *
   * ```markdown
   * > | a <b c> d
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeName(code) {
    // ASCII alphabetical and `-`, `.`, `:`, and `_`.
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dash ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.dot ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.colon ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.underscore ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiAlphanumeric)(code)
    ) {
      effects.consume(code)
      return tagOpenAttributeName
    }

    return tagOpenAttributeNameAfter(code)
  }

  /**
   * After attribute name, before initializer, the end of the tag, or
   * whitespace.
   *
   * ```markdown
   * > | a <b c> d
   *           ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeNameAfter(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.equalsTo) {
      effects.consume(code)
      return tagOpenAttributeValueBefore
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)) {
      returnState = tagOpenAttributeNameAfter
      return lineEndingBefore(code)
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownSpace)(code)) {
      effects.consume(code)
      return tagOpenAttributeNameAfter
    }

    return tagOpenBetween(code)
  }

  /**
   * Before unquoted, double quoted, or single quoted attribute value, allowing
   * whitespace.
   *
   * ```markdown
   * > | a <b c=d> e
   *            ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueBefore(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.lessThan ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.equalsTo ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.greaterThan ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.graveAccent
    ) {
      return nok(code)
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.quotationMark || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.apostrophe) {
      effects.consume(code)
      marker = code
      return tagOpenAttributeValueQuoted
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)) {
      returnState = tagOpenAttributeValueBefore
      return lineEndingBefore(code)
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownSpace)(code)) {
      effects.consume(code)
      return tagOpenAttributeValueBefore
    }

    effects.consume(code)
    return tagOpenAttributeValueUnquoted
  }

  /**
   * In double or single quoted attribute value.
   *
   * ```markdown
   * > | a <b c="d"> e
   *             ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueQuoted(code) {
    if (code === marker) {
      effects.consume(code)
      marker = undefined
      return tagOpenAttributeValueQuotedAfter
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof) {
      return nok(code)
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)) {
      returnState = tagOpenAttributeValueQuoted
      return lineEndingBefore(code)
    }

    effects.consume(code)
    return tagOpenAttributeValueQuoted
  }

  /**
   * In unquoted attribute value.
   *
   * ```markdown
   * > | a <b c=d> e
   *            ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueUnquoted(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.quotationMark ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.apostrophe ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.lessThan ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.equalsTo ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.graveAccent
    ) {
      return nok(code)
    }

    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.slash ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.greaterThan ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEndingOrSpace)(code)
    ) {
      return tagOpenBetween(code)
    }

    effects.consume(code)
    return tagOpenAttributeValueUnquoted
  }

  /**
   * After double or single quoted attribute value, before whitespace or the end
   * of the tag.
   *
   * ```markdown
   * > | a <b c="d"> e
   *               ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueQuotedAfter(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.slash ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.greaterThan ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEndingOrSpace)(code)
    ) {
      return tagOpenBetween(code)
    }

    return nok(code)
  }

  /**
   * In certain circumstances of a tag where only an `>` is allowed.
   *
   * ```markdown
   * > | a <b c="d"> e
   *               ^
   * ```
   *
   * @type {State}
   */
  function end(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.greaterThan) {
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.htmlTextData)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.htmlText)
      return ok
    }

    return nok(code)
  }

  /**
   * At eol.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   * > | a <!--a
   *            ^
   *   | b-->
   * ```
   *
   * @type {State}
   */
  function lineEndingBefore(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(returnState, 'expected return state')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code), 'expected eol')
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.htmlTextData)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineEnding)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineEnding)
    return lineEndingAfter
  }

  /**
   * After eol, at optional whitespace.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   *   | a <!--a
   * > | b-->
   *     ^
   * ```
   *
   * @type {State}
   */
  function lineEndingAfter(code) {
    // Always populated by defaults.
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      self.parser.constructs.disable.null,
      'expected `disable.null` to be populated'
    )
    return (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownSpace)(code)
      ? (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_5__.factorySpace)(
          effects,
          lineEndingAfterPrefix,
          micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.linePrefix,
          self.parser.constructs.disable.null.includes('codeIndented')
            ? undefined
            : micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__.constants.tabSize
        )(code)
      : lineEndingAfterPrefix(code)
  }

  /**
   * After eol, after optional whitespace.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   *   | a <!--a
   * > | b-->
   *     ^
   * ```
   *
   * @type {State}
   */
  function lineEndingAfterPrefix(code) {
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.htmlTextData)
    return returnState(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/label-end.js":
/*!*********************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/label-end.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   labelEnd: function() { return /* binding */ labelEnd; }
/* harmony export */ });
/* harmony import */ var micromark_factory_destination__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! micromark-factory-destination */ "./node_modules/micromark-factory-destination/dev/index.js");
/* harmony import */ var micromark_factory_label__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! micromark-factory-label */ "./node_modules/micromark-factory-label/dev/index.js");
/* harmony import */ var micromark_factory_title__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! micromark-factory-title */ "./node_modules/micromark-factory-title/dev/index.js");
/* harmony import */ var micromark_factory_whitespace__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! micromark-factory-whitespace */ "./node_modules/micromark-factory-whitespace/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-chunked */ "./node_modules/micromark-util-chunked/dev/index.js");
/* harmony import */ var micromark_util_normalize_identifier__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-util-normalize-identifier */ "./node_modules/micromark-util-normalize-identifier/dev/index.js");
/* harmony import */ var micromark_util_resolve_all__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-resolve-all */ "./node_modules/micromark-util-resolve-all/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */














/** @type {Construct} */
const labelEnd = {
  name: 'labelEnd',
  tokenize: tokenizeLabelEnd,
  resolveTo: resolveToLabelEnd,
  resolveAll: resolveAllLabelEnd
}

/** @type {Construct} */
const resourceConstruct = {tokenize: tokenizeResource}
/** @type {Construct} */
const referenceFullConstruct = {tokenize: tokenizeReferenceFull}
/** @type {Construct} */
const referenceCollapsedConstruct = {tokenize: tokenizeReferenceCollapsed}

/** @type {Resolver} */
function resolveAllLabelEnd(events) {
  let index = -1

  while (++index < events.length) {
    const token = events[index][1]

    if (
      token.type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelImage ||
      token.type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelLink ||
      token.type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelEnd
    ) {
      // Remove the marker.
      events.splice(index + 1, token.type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelImage ? 4 : 2)
      token.type = micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.data
      index++
    }
  }

  return events
}

/** @type {Resolver} */
function resolveToLabelEnd(events, context) {
  let index = events.length
  let offset = 0
  /** @type {Token} */
  let token
  /** @type {number | undefined} */
  let open
  /** @type {number | undefined} */
  let close
  /** @type {Array<Event>} */
  let media

  // Find an opening.
  while (index--) {
    token = events[index][1]

    if (open) {
      // If we see another link, or inactive link label, we’ve been here before.
      if (
        token.type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.link ||
        (token.type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelLink && token._inactive)
      ) {
        break
      }

      // Mark other link openings as inactive, as we can’t have links in
      // links.
      if (events[index][0] === 'enter' && token.type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelLink) {
        token._inactive = true
      }
    } else if (close) {
      if (
        events[index][0] === 'enter' &&
        (token.type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelImage || token.type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelLink) &&
        !token._balanced
      ) {
        open = index

        if (token.type !== micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelLink) {
          offset = 2
          break
        }
      }
    } else if (token.type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelEnd) {
      close = index
    }
  }

  (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(open !== undefined, '`open` is supposed to be found')
  ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(close !== undefined, '`close` is supposed to be found')

  const group = {
    type: events[open][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelLink ? micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.link : micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.image,
    start: Object.assign({}, events[open][1].start),
    end: Object.assign({}, events[events.length - 1][1].end)
  }

  const label = {
    type: micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.label,
    start: Object.assign({}, events[open][1].start),
    end: Object.assign({}, events[close][1].end)
  }

  const text = {
    type: micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelText,
    start: Object.assign({}, events[open + offset + 2][1].end),
    end: Object.assign({}, events[close - 2][1].start)
  }

  media = [
    ['enter', group, context],
    ['enter', label, context]
  ]

  // Opening marker.
  media = (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.push)(media, events.slice(open + 1, open + offset + 3))

  // Text open.
  media = (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.push)(media, [['enter', text, context]])

  // Always populated by defaults.
  ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
    context.parser.constructs.insideSpan.null,
    'expected `insideSpan.null` to be populated'
  )
  // Between.
  media = (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.push)(
    media,
    (0,micromark_util_resolve_all__WEBPACK_IMPORTED_MODULE_3__.resolveAll)(
      context.parser.constructs.insideSpan.null,
      events.slice(open + offset + 4, close - 3),
      context
    )
  )

  // Text close, marker close, label close.
  media = (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.push)(media, [
    ['exit', text, context],
    events[close - 2],
    events[close - 1],
    ['exit', label, context]
  ])

  // Reference, resource, or so.
  media = (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.push)(media, events.slice(close + 1))

  // Media close.
  media = (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.push)(media, [['exit', group, context]])

  ;(0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.splice)(events, open, events.length, media)

  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLabelEnd(effects, ok, nok) {
  const self = this
  let index = self.events.length
  /** @type {Token} */
  let labelStart
  /** @type {boolean} */
  let defined

  // Find an opening.
  while (index--) {
    if (
      (self.events[index][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelImage ||
        self.events[index][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelLink) &&
      !self.events[index][1]._balanced
    ) {
      labelStart = self.events[index][1]
      break
    }
  }

  return start

  /**
   * Start of label end.
   *
   * ```markdown
   * > | [a](b) c
   *       ^
   * > | [a][b] c
   *       ^
   * > | [a][] b
   *       ^
   * > | [a] b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.rightSquareBracket, 'expected `]`')

    // If there is not an okay opening.
    if (!labelStart) {
      return nok(code)
    }

    // If the corresponding label (link) start is marked as inactive,
    // it means we’d be wrapping a link, like this:
    //
    // ```markdown
    // > | a [b [c](d) e](f) g.
    //                  ^
    // ```
    //
    // We can’t have that, so it’s just balanced brackets.
    if (labelStart._inactive) {
      return labelEndNok(code)
    }

    defined = self.parser.defined.includes(
      (0,micromark_util_normalize_identifier__WEBPACK_IMPORTED_MODULE_5__.normalizeIdentifier)(
        self.sliceSerialize({start: labelStart.end, end: self.now()})
      )
    )
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelEnd)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelMarker)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelMarker)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.labelEnd)
    return after
  }

  /**
   * After `]`.
   *
   * ```markdown
   * > | [a](b) c
   *       ^
   * > | [a][b] c
   *       ^
   * > | [a][] b
   *       ^
   * > | [a] b
   *       ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    // Note: `markdown-rs` also parses GFM footnotes here, which for us is in
    // an extension.

    // Resource (`[asd](fgh)`)?
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.leftParenthesis) {
      return effects.attempt(
        resourceConstruct,
        labelEndOk,
        defined ? labelEndOk : labelEndNok
      )(code)
    }

    // Full (`[asd][fgh]`) or collapsed (`[asd][]`) reference?
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.leftSquareBracket) {
      return effects.attempt(
        referenceFullConstruct,
        labelEndOk,
        defined ? referenceNotFull : labelEndNok
      )(code)
    }

    // Shortcut (`[asd]`) reference?
    return defined ? labelEndOk(code) : labelEndNok(code)
  }

  /**
   * After `]`, at `[`, but not at a full reference.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] b
   *        ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceNotFull(code) {
    return effects.attempt(
      referenceCollapsedConstruct,
      labelEndOk,
      labelEndNok
    )(code)
  }

  /**
   * Done, we found something.
   *
   * ```markdown
   * > | [a](b) c
   *           ^
   * > | [a][b] c
   *           ^
   * > | [a][] b
   *          ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEndOk(code) {
    // Note: `markdown-rs` does a bunch of stuff here.
    return ok(code)
  }

  /**
   * Done, it’s nothing.
   *
   * There was an okay opening, but we didn’t match anything.
   *
   * ```markdown
   * > | [a](b c
   *        ^
   * > | [a][b c
   *        ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEndNok(code) {
    labelStart._balanced = true
    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeResource(effects, ok, nok) {
  return resourceStart

  /**
   * At a resource.
   *
   * ```markdown
   * > | [a](b) c
   *        ^
   * ```
   *
   * @type {State}
   */
  function resourceStart(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.leftParenthesis, 'expected left paren')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.resource)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.resourceMarker)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.resourceMarker)
    return resourceBefore
  }

  /**
   * In resource, after `(`, at optional whitespace.
   *
   * ```markdown
   * > | [a](b) c
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceBefore(code) {
    return (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_6__.markdownLineEndingOrSpace)(code)
      ? (0,micromark_factory_whitespace__WEBPACK_IMPORTED_MODULE_7__.factoryWhitespace)(effects, resourceOpen)(code)
      : resourceOpen(code)
  }

  /**
   * In resource, after optional whitespace, at `)` or a destination.
   *
   * ```markdown
   * > | [a](b) c
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceOpen(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.rightParenthesis) {
      return resourceEnd(code)
    }

    return (0,micromark_factory_destination__WEBPACK_IMPORTED_MODULE_8__.factoryDestination)(
      effects,
      resourceDestinationAfter,
      resourceDestinationMissing,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.resourceDestination,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.resourceDestinationLiteral,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.resourceDestinationLiteralMarker,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.resourceDestinationRaw,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.resourceDestinationString,
      micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_9__.constants.linkResourceDestinationBalanceMax
    )(code)
  }

  /**
   * In resource, after destination, at optional whitespace.
   *
   * ```markdown
   * > | [a](b) c
   *          ^
   * ```
   *
   * @type {State}
   */
  function resourceDestinationAfter(code) {
    return (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_6__.markdownLineEndingOrSpace)(code)
      ? (0,micromark_factory_whitespace__WEBPACK_IMPORTED_MODULE_7__.factoryWhitespace)(effects, resourceBetween)(code)
      : resourceEnd(code)
  }

  /**
   * At invalid destination.
   *
   * ```markdown
   * > | [a](<<) b
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceDestinationMissing(code) {
    return nok(code)
  }

  /**
   * In resource, after destination and whitespace, at `(` or title.
   *
   * ```markdown
   * > | [a](b ) c
   *           ^
   * ```
   *
   * @type {State}
   */
  function resourceBetween(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.quotationMark ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.apostrophe ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.leftParenthesis
    ) {
      return (0,micromark_factory_title__WEBPACK_IMPORTED_MODULE_10__.factoryTitle)(
        effects,
        resourceTitleAfter,
        nok,
        micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.resourceTitle,
        micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.resourceTitleMarker,
        micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.resourceTitleString
      )(code)
    }

    return resourceEnd(code)
  }

  /**
   * In resource, after title, at optional whitespace.
   *
   * ```markdown
   * > | [a](b "c") d
   *              ^
   * ```
   *
   * @type {State}
   */
  function resourceTitleAfter(code) {
    return (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_6__.markdownLineEndingOrSpace)(code)
      ? (0,micromark_factory_whitespace__WEBPACK_IMPORTED_MODULE_7__.factoryWhitespace)(effects, resourceEnd)(code)
      : resourceEnd(code)
  }

  /**
   * In resource, at `)`.
   *
   * ```markdown
   * > | [a](b) d
   *          ^
   * ```
   *
   * @type {State}
   */
  function resourceEnd(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.rightParenthesis) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.resourceMarker)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.resourceMarker)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.resource)
      return ok
    }

    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeReferenceFull(effects, ok, nok) {
  const self = this

  return referenceFull

  /**
   * In a reference (full), at the `[`.
   *
   * ```markdown
   * > | [a][b] d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceFull(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.leftSquareBracket, 'expected left bracket')
    return micromark_factory_label__WEBPACK_IMPORTED_MODULE_11__.factoryLabel.call(
      self,
      effects,
      referenceFullAfter,
      referenceFullMissing,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.reference,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.referenceMarker,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.referenceString
    )(code)
  }

  /**
   * In a reference (full), after `]`.
   *
   * ```markdown
   * > | [a][b] d
   *          ^
   * ```
   *
   * @type {State}
   */
  function referenceFullAfter(code) {
    return self.parser.defined.includes(
      (0,micromark_util_normalize_identifier__WEBPACK_IMPORTED_MODULE_5__.normalizeIdentifier)(
        self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)
      )
    )
      ? ok(code)
      : nok(code)
  }

  /**
   * In reference (full) that was missing.
   *
   * ```markdown
   * > | [a][b d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceFullMissing(code) {
    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeReferenceCollapsed(effects, ok, nok) {
  return referenceCollapsedStart

  /**
   * In reference (collapsed), at `[`.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceCollapsedStart(code) {
    // We only attempt a collapsed label if there’s a `[`.
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.leftSquareBracket, 'expected left bracket')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.reference)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.referenceMarker)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.referenceMarker)
    return referenceCollapsedOpen
  }

  /**
   * In reference (collapsed), at `]`.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] d
   *         ^
   * ```
   *
   *  @type {State}
   */
  function referenceCollapsedOpen(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_4__.codes.rightSquareBracket) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.referenceMarker)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.referenceMarker)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.reference)
      return ok
    }

    return nok(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/label-start-image.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/label-start-image.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   labelStartImage: function() { return /* binding */ labelStartImage; }
/* harmony export */ });
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/* harmony import */ var _label_end_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./label-end.js */ "./node_modules/micromark-core-commonmark/dev/lib/label-end.js");
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */






/** @type {Construct} */
const labelStartImage = {
  name: 'labelStartImage',
  tokenize: tokenizeLabelStartImage,
  resolveAll: _label_end_js__WEBPACK_IMPORTED_MODULE_1__.labelEnd.resolveAll
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLabelStartImage(effects, ok, nok) {
  const self = this

  return start

  /**
   * Start of label (image) start.
   *
   * ```markdown
   * > | a ![b] c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.exclamationMark, 'expected `!`')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.labelImage)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.labelImageMarker)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.labelImageMarker)
    return open
  }

  /**
   * After `!`, at `[`.
   *
   * ```markdown
   * > | a ![b] c
   *        ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.leftSquareBracket) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.labelMarker)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.labelMarker)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.labelImage)
      return after
    }

    return nok(code)
  }

  /**
   * After `![`.
   *
   * ```markdown
   * > | a ![b] c
   *         ^
   * ```
   *
   * This is needed in because, when GFM footnotes are enabled, images never
   * form when started with a `^`.
   * Instead, links form:
   *
   * ```markdown
   * ![^a](b)
   *
   * ![^a][b]
   *
   * [b]: c
   * ```
   *
   * ```html
   * <p>!<a href=\"b\">^a</a></p>
   * <p>!<a href=\"c\">^a</a></p>
   * ```
   *
   * @type {State}
   */
  function after(code) {
    // To do: use a new field to do this, this is still needed for
    // `micromark-extension-gfm-footnote`, but the `label-start-link`
    // behavior isn’t.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    return code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.caret &&
      '_hiddenFootnoteSupport' in self.parser.constructs
      ? nok(code)
      : ok(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/label-start-link.js":
/*!****************************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/label-start-link.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   labelStartLink: function() { return /* binding */ labelStartLink; }
/* harmony export */ });
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/* harmony import */ var _label_end_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./label-end.js */ "./node_modules/micromark-core-commonmark/dev/lib/label-end.js");
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */






/** @type {Construct} */
const labelStartLink = {
  name: 'labelStartLink',
  tokenize: tokenizeLabelStartLink,
  resolveAll: _label_end_js__WEBPACK_IMPORTED_MODULE_1__.labelEnd.resolveAll
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLabelStartLink(effects, ok, nok) {
  const self = this

  return start

  /**
   * Start of label (link) start.
   *
   * ```markdown
   * > | a [b] c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.leftSquareBracket, 'expected `[`')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.labelLink)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.labelMarker)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.labelMarker)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.labelLink)
    return after
  }

  /** @type {State} */
  function after(code) {
    // To do: this isn’t needed in `micromark-extension-gfm-footnote`,
    // remove.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    return code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.caret &&
      '_hiddenFootnoteSupport' in self.parser.constructs
      ? nok(code)
      : ok(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/line-ending.js":
/*!***********************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/line-ending.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   lineEnding: function() { return /* binding */ lineEnding; }
/* harmony export */ });
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */






/** @type {Construct} */
const lineEnding = {name: 'lineEnding', tokenize: tokenizeLineEnding}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLineEnding(effects, ok) {
  return start

  /** @type {State} */
  function start(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_1__.markdownLineEnding)(code), 'expected eol')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineEnding)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineEnding)
    return (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_3__.factorySpace)(effects, ok, micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.linePrefix)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/list.js":
/*!****************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/list.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   list: function() { return /* binding */ list; }
/* harmony export */ });
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/* harmony import */ var _blank_line_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./blank-line.js */ "./node_modules/micromark-core-commonmark/dev/lib/blank-line.js");
/* harmony import */ var _thematic_break_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./thematic-break.js */ "./node_modules/micromark-core-commonmark/dev/lib/thematic-break.js");
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').ContainerState} ContainerState
 * @typedef {import('micromark-util-types').Exiter} Exiter
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */










/** @type {Construct} */
const list = {
  name: 'list',
  tokenize: tokenizeListStart,
  continuation: {tokenize: tokenizeListContinuation},
  exit: tokenizeListEnd
}

/** @type {Construct} */
const listItemPrefixWhitespaceConstruct = {
  tokenize: tokenizeListItemPrefixWhitespace,
  partial: true
}

/** @type {Construct} */
const indentConstruct = {tokenize: tokenizeIndent, partial: true}

// To do: `markdown-rs` parses list items on their own and later stitches them
// together.

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeListStart(effects, ok, nok) {
  const self = this
  const tail = self.events[self.events.length - 1]
  let initialSize =
    tail && tail[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.linePrefix
      ? tail[2].sliceSerialize(tail[1], true).length
      : 0
  let size = 0

  return start

  /** @type {State} */
  function start(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(self.containerState, 'expected state')
    const kind =
      self.containerState.type ||
      (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.asterisk || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.plusSign || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.dash
        ? micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listUnordered
        : micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listOrdered)

    if (
      kind === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listUnordered
        ? !self.containerState.marker || code === self.containerState.marker
        : (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiDigit)(code)
    ) {
      if (!self.containerState.type) {
        self.containerState.type = kind
        effects.enter(kind, {_container: true})
      }

      if (kind === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listUnordered) {
        effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listItemPrefix)
        return code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.asterisk || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.dash
          ? effects.check(_thematic_break_js__WEBPACK_IMPORTED_MODULE_4__.thematicBreak, nok, atMarker)(code)
          : atMarker(code)
      }

      if (!self.interrupt || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.digit1) {
        effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listItemPrefix)
        effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listItemValue)
        return inside(code)
      }
    }

    return nok(code)
  }

  /** @type {State} */
  function inside(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(self.containerState, 'expected state')
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.asciiDigit)(code) && ++size < micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_5__.constants.listItemValueSizeMax) {
      effects.consume(code)
      return inside
    }

    if (
      (!self.interrupt || size < 2) &&
      (self.containerState.marker
        ? code === self.containerState.marker
        : code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.rightParenthesis || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.dot)
    ) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listItemValue)
      return atMarker(code)
    }

    return nok(code)
  }

  /**
   * @type {State}
   **/
  function atMarker(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(self.containerState, 'expected state')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code !== micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof, 'eof (`null`) is not a marker')
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listItemMarker)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listItemMarker)
    self.containerState.marker = self.containerState.marker || code
    return effects.check(
      _blank_line_js__WEBPACK_IMPORTED_MODULE_6__.blankLine,
      // Can’t be empty when interrupting.
      self.interrupt ? nok : onBlank,
      effects.attempt(
        listItemPrefixWhitespaceConstruct,
        endOfPrefix,
        otherPrefix
      )
    )
  }

  /** @type {State} */
  function onBlank(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(self.containerState, 'expected state')
    self.containerState.initialBlankLine = true
    initialSize++
    return endOfPrefix(code)
  }

  /** @type {State} */
  function otherPrefix(code) {
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownSpace)(code)) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listItemPrefixWhitespace)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listItemPrefixWhitespace)
      return endOfPrefix
    }

    return nok(code)
  }

  /** @type {State} */
  function endOfPrefix(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(self.containerState, 'expected state')
    self.containerState.size =
      initialSize +
      self.sliceSerialize(effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listItemPrefix), true).length
    return ok(code)
  }
}

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeListContinuation(effects, ok, nok) {
  const self = this

  ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(self.containerState, 'expected state')
  self.containerState._closeFlow = undefined

  return effects.check(_blank_line_js__WEBPACK_IMPORTED_MODULE_6__.blankLine, onBlank, notBlank)

  /** @type {State} */
  function onBlank(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(self.containerState, 'expected state')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(typeof self.containerState.size === 'number', 'expected size')
    self.containerState.furtherBlankLines =
      self.containerState.furtherBlankLines ||
      self.containerState.initialBlankLine

    // We have a blank line.
    // Still, try to consume at most the items size.
    return (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_7__.factorySpace)(
      effects,
      ok,
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listItemIndent,
      self.containerState.size + 1
    )(code)
  }

  /** @type {State} */
  function notBlank(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(self.containerState, 'expected state')
    if (self.containerState.furtherBlankLines || !(0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownSpace)(code)) {
      self.containerState.furtherBlankLines = undefined
      self.containerState.initialBlankLine = undefined
      return notInCurrentItem(code)
    }

    self.containerState.furtherBlankLines = undefined
    self.containerState.initialBlankLine = undefined
    return effects.attempt(indentConstruct, ok, notInCurrentItem)(code)
  }

  /** @type {State} */
  function notInCurrentItem(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(self.containerState, 'expected state')
    // While we do continue, we signal that the flow should be closed.
    self.containerState._closeFlow = true
    // As we’re closing flow, we’re no longer interrupting.
    self.interrupt = undefined
    // Always populated by defaults.
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      self.parser.constructs.disable.null,
      'expected `disable.null` to be populated'
    )
    return (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_7__.factorySpace)(
      effects,
      effects.attempt(list, ok, nok),
      micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.linePrefix,
      self.parser.constructs.disable.null.includes('codeIndented')
        ? undefined
        : micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_5__.constants.tabSize
    )(code)
  }
}

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeIndent(effects, ok, nok) {
  const self = this

  ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(self.containerState, 'expected state')
  ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(typeof self.containerState.size === 'number', 'expected size')

  return (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_7__.factorySpace)(
    effects,
    afterPrefix,
    micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listItemIndent,
    self.containerState.size + 1
  )

  /** @type {State} */
  function afterPrefix(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(self.containerState, 'expected state')
    const tail = self.events[self.events.length - 1]
    return tail &&
      tail[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listItemIndent &&
      tail[2].sliceSerialize(tail[1], true).length === self.containerState.size
      ? ok(code)
      : nok(code)
  }
}

/**
 * @type {Exiter}
 * @this {TokenizeContext}
 */
function tokenizeListEnd(effects) {
  (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(this.containerState, 'expected state')
  ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(typeof this.containerState.type === 'string', 'expected type')
  effects.exit(this.containerState.type)
}

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeListItemPrefixWhitespace(effects, ok, nok) {
  const self = this

  // Always populated by defaults.
  ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
    self.parser.constructs.disable.null,
    'expected `disable.null` to be populated'
  )

  return (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_7__.factorySpace)(
    effects,
    afterPrefix,
    micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listItemPrefixWhitespace,
    self.parser.constructs.disable.null.includes('codeIndented')
      ? undefined
      : micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_5__.constants.tabSize + 1
  )

  /** @type {State} */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1]

    return !(0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownSpace)(code) &&
      tail &&
      tail[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listItemPrefixWhitespace
      ? ok(code)
      : nok(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/setext-underline.js":
/*!****************************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/setext-underline.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setextUnderline: function() { return /* binding */ setextUnderline; }
/* harmony export */ });
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */







/** @type {Construct} */
const setextUnderline = {
  name: 'setextUnderline',
  tokenize: tokenizeSetextUnderline,
  resolveTo: resolveToSetextUnderline
}

/** @type {Resolver} */
function resolveToSetextUnderline(events, context) {
  // To do: resolve like `markdown-rs`.
  let index = events.length
  /** @type {number | undefined} */
  let content
  /** @type {number | undefined} */
  let text
  /** @type {number | undefined} */
  let definition

  // Find the opening of the content.
  // It’ll always exist: we don’t tokenize if it isn’t there.
  while (index--) {
    if (events[index][0] === 'enter') {
      if (events[index][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.content) {
        content = index
        break
      }

      if (events[index][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.paragraph) {
        text = index
      }
    }
    // Exit
    else {
      if (events[index][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.content) {
        // Remove the content end (if needed we’ll add it later)
        events.splice(index, 1)
      }

      if (!definition && events[index][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.definition) {
        definition = index
      }
    }
  }

  (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(text !== undefined, 'expected a `text` index to be found')
  ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(content !== undefined, 'expected a `text` index to be found')

  const heading = {
    type: micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.setextHeading,
    start: Object.assign({}, events[text][1].start),
    end: Object.assign({}, events[events.length - 1][1].end)
  }

  // Change the paragraph to setext heading text.
  events[text][1].type = micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.setextHeadingText

  // If we have definitions in the content, we’ll keep on having content,
  // but we need move it.
  if (definition) {
    events.splice(text, 0, ['enter', heading, context])
    events.splice(definition + 1, 0, ['exit', events[content][1], context])
    events[content][1].end = Object.assign({}, events[definition][1].end)
  } else {
    events[content][1] = heading
  }

  // Add the heading exit at the end.
  events.push(['exit', heading, context])

  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeSetextUnderline(effects, ok, nok) {
  const self = this
  /** @type {NonNullable<Code>} */
  let marker

  return start

  /**
   * At start of heading (setext) underline.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    let index = self.events.length
    /** @type {boolean | undefined} */
    let paragraph

    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.dash || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.equalsTo,
      'expected `=` or `-`'
    )

    // Find an opening.
    while (index--) {
      // Skip enter/exit of line ending, line prefix, and content.
      // We can now either have a definition or a paragraph.
      if (
        self.events[index][1].type !== micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding &&
        self.events[index][1].type !== micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.linePrefix &&
        self.events[index][1].type !== micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.content
      ) {
        paragraph = self.events[index][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.paragraph
        break
      }
    }

    // To do: handle lazy/pierce like `markdown-rs`.
    // To do: parse indent like `markdown-rs`.
    if (!self.parser.lazy[self.now().line] && (self.interrupt || paragraph)) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.setextHeadingLine)
      marker = code
      return before(code)
    }

    return nok(code)
  }

  /**
   * After optional whitespace, at `-` or `=`.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.setextHeadingLineSequence)
    return inside(code)
  }

  /**
   * In sequence.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker) {
      effects.consume(code)
      return inside
    }

    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.setextHeadingLineSequence)

    return (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownSpace)(code)
      ? (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_4__.factorySpace)(effects, after, micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineSuffix)(code)
      : after(code)
  }

  /**
   * After sequence, after optional whitespace.
   *
   * ```markdown
   *   | aa
   * > | ==
   *       ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.setextHeadingLine)
      return ok(code)
    }

    return nok(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-core-commonmark/dev/lib/thematic-break.js":
/*!**************************************************************************!*\
  !*** ./node_modules/micromark-core-commonmark/dev/lib/thematic-break.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   thematicBreak: function() { return /* binding */ thematicBreak; }
/* harmony export */ });
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */








/** @type {Construct} */
const thematicBreak = {
  name: 'thematicBreak',
  tokenize: tokenizeThematicBreak
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeThematicBreak(effects, ok, nok) {
  let size = 0
  /** @type {NonNullable<Code>} */
  let marker

  return start

  /**
   * Start of thematic break.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.thematicBreak)
    // To do: parse indent like `markdown-rs`.
    return before(code)
  }

  /**
   * After optional whitespace, at marker.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.asterisk ||
        code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.dash ||
        code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.underscore,
      'expected `*`, `-`, or `_`'
    )
    marker = code
    return atBreak(code)
  }

  /**
   * After something, before something else.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === marker) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.thematicBreakSequence)
      return sequence(code)
    }

    if (
      size >= micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.thematicBreakMarkerCountMin &&
      (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownLineEnding)(code))
    ) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.thematicBreak)
      return ok(code)
    }

    return nok(code)
  }

  /**
   * In sequence.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequence(code) {
    if (code === marker) {
      effects.consume(code)
      size++
      return sequence
    }

    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.thematicBreakSequence)
    return (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_4__.markdownSpace)(code)
      ? (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_5__.factorySpace)(effects, atBreak, micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.whitespace)(code)
      : atBreak(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-factory-destination/dev/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/micromark-factory-destination/dev/index.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   factoryDestination: function() { return /* binding */ factoryDestination; }
/* harmony export */ });
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */






/**
 * Parse destinations.
 *
 * ###### Examples
 *
 * ```markdown
 * <a>
 * <a\>b>
 * <a b>
 * <a)>
 * a
 * a\)b
 * a(b)c
 * a(b)
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type for whole (`<a>` or `b`).
 * @param {TokenType} literalType
 *   Type when enclosed (`<a>`).
 * @param {TokenType} literalMarkerType
 *   Type for enclosing (`<` and `>`).
 * @param {TokenType} rawType
 *   Type when not enclosed (`b`).
 * @param {TokenType} stringType
 *   Type for the value (`a` or `b`).
 * @param {number | undefined} [max=Infinity]
 *   Depth of nested parens (inclusive).
 * @returns {State}
 *   Start state.
 */
// eslint-disable-next-line max-params
function factoryDestination(
  effects,
  ok,
  nok,
  type,
  literalType,
  literalMarkerType,
  rawType,
  stringType,
  max
) {
  const limit = max || Number.POSITIVE_INFINITY
  let balance = 0

  return start

  /**
   * Start of destination.
   *
   * ```markdown
   * > | <aa>
   *     ^
   * > | aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.lessThan) {
      effects.enter(type)
      effects.enter(literalType)
      effects.enter(literalMarkerType)
      effects.consume(code)
      effects.exit(literalMarkerType)
      return enclosedBefore
    }

    // ASCII control, space, closing paren.
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.eof ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.space ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.rightParenthesis ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_1__.asciiControl)(code)
    ) {
      return nok(code)
    }

    effects.enter(type)
    effects.enter(rawType)
    effects.enter(stringType)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.chunkString, {contentType: micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.contentTypeString})
    return raw(code)
  }

  /**
   * After `<`, at an enclosed destination.
   *
   * ```markdown
   * > | <aa>
   *      ^
   * ```
   *
   * @type {State}
   */
  function enclosedBefore(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.greaterThan) {
      effects.enter(literalMarkerType)
      effects.consume(code)
      effects.exit(literalMarkerType)
      effects.exit(literalType)
      effects.exit(type)
      return ok
    }

    effects.enter(stringType)
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.chunkString, {contentType: micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.contentTypeString})
    return enclosed(code)
  }

  /**
   * In enclosed destination.
   *
   * ```markdown
   * > | <aa>
   *      ^
   * ```
   *
   * @type {State}
   */
  function enclosed(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.greaterThan) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.chunkString)
      effects.exit(stringType)
      return enclosedBefore(code)
    }

    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.eof ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.lessThan ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_1__.markdownLineEnding)(code)
    ) {
      return nok(code)
    }

    effects.consume(code)
    return code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.backslash ? enclosedEscape : enclosed
  }

  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | <a\*a>
   *        ^
   * ```
   *
   * @type {State}
   */
  function enclosedEscape(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.lessThan ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.greaterThan ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.backslash
    ) {
      effects.consume(code)
      return enclosed
    }

    return enclosed(code)
  }

  /**
   * In raw destination.
   *
   * ```markdown
   * > | aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function raw(code) {
    if (
      !balance &&
      (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.eof ||
        code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.rightParenthesis ||
        (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_1__.markdownLineEndingOrSpace)(code))
    ) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.chunkString)
      effects.exit(stringType)
      effects.exit(rawType)
      effects.exit(type)
      return ok(code)
    }

    if (balance < limit && code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.leftParenthesis) {
      effects.consume(code)
      balance++
      return raw
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.rightParenthesis) {
      effects.consume(code)
      balance--
      return raw
    }

    // ASCII control (but *not* `\0`) and space and `(`.
    // Note: in `markdown-rs`, `\0` exists in codes, in `micromark-js` it
    // doesn’t.
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.eof ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.space ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.leftParenthesis ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_1__.asciiControl)(code)
    ) {
      return nok(code)
    }

    effects.consume(code)
    return code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.backslash ? rawEscape : raw
  }

  /**
   * After `\`, at special character.
   *
   * ```markdown
   * > | a\*a
   *       ^
   * ```
   *
   * @type {State}
   */
  function rawEscape(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.leftParenthesis ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.rightParenthesis ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.backslash
    ) {
      effects.consume(code)
      return raw
    }

    return raw(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-factory-label/dev/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/micromark-factory-label/dev/index.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   factoryLabel: function() { return /* binding */ factoryLabel; }
/* harmony export */ });
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */







/**
 * Parse labels.
 *
 * > 👉 **Note**: labels in markdown are capped at 999 characters in the string.
 *
 * ###### Examples
 *
 * ```markdown
 * [a]
 * [a
 * b]
 * [a\]b]
 * ```
 *
 * @this {TokenizeContext}
 *   Tokenize context.
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type of the whole label (`[a]`).
 * @param {TokenType} markerType
 *   Type for the markers (`[` and `]`).
 * @param {TokenType} stringType
 *   Type for the identifier (`a`).
 * @returns {State}
 *   Start state.
 */
// eslint-disable-next-line max-params
function factoryLabel(effects, ok, nok, type, markerType, stringType) {
  const self = this
  let size = 0
  /** @type {boolean} */
  let seen

  return start

  /**
   * Start of label.
   *
   * ```markdown
   * > | [a]
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.leftSquareBracket, 'expected `[`')
    effects.enter(type)
    effects.enter(markerType)
    effects.consume(code)
    effects.exit(markerType)
    effects.enter(stringType)
    return atBreak
  }

  /**
   * In label, at something, before something else.
   *
   * ```markdown
   * > | [a]
   *      ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (
      size > micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_2__.constants.linkReferenceSizeMax ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.leftSquareBracket ||
      (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.rightSquareBracket && !seen) ||
      // To do: remove in the future once we’ve switched from
      // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
      // which doesn’t need this.
      // Hidden footnotes hook.
      /* c8 ignore next 3 */
      (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.caret &&
        !size &&
        '_hiddenFootnoteSupport' in self.parser.constructs)
    ) {
      return nok(code)
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.rightSquareBracket) {
      effects.exit(stringType)
      effects.enter(markerType)
      effects.consume(code)
      effects.exit(markerType)
      effects.exit(type)
      return ok
    }

    // To do: indent? Link chunks and EOLs together?
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code)) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.lineEnding)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.lineEnding)
      return atBreak
    }

    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.chunkString, {contentType: micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_2__.constants.contentTypeString})
    return labelInside(code)
  }

  /**
   * In label, in text.
   *
   * ```markdown
   * > | [a]
   *      ^
   * ```
   *
   * @type {State}
   */
  function labelInside(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.leftSquareBracket ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.rightSquareBracket ||
      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownLineEnding)(code) ||
      size++ > micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_2__.constants.linkReferenceSizeMax
    ) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.chunkString)
      return atBreak(code)
    }

    effects.consume(code)
    if (!seen) seen = !(0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.markdownSpace)(code)
    return code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.backslash ? labelEscape : labelInside
  }

  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | [a\*a]
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEscape(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.leftSquareBracket ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.backslash ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.rightSquareBracket
    ) {
      effects.consume(code)
      size++
      return labelInside
    }

    return labelInside(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-factory-space/dev/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/micromark-factory-space/dev/index.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   factorySpace: function() { return /* binding */ factorySpace; }
/* harmony export */ });
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */



// To do: implement `spaceOrTab`, `spaceOrTabMinMax`, `spaceOrTabWithOptions`.

/**
 * Parse spaces and tabs.
 *
 * There is no `nok` parameter:
 *
 * *   spaces in markdown are often optional, in which case this factory can be
 *     used and `ok` will be switched to whether spaces were found or not
 * *   one line ending or space can be detected with `markdownSpace(code)` right
 *     before using `factorySpace`
 *
 * ###### Examples
 *
 * Where `␉` represents a tab (plus how much it expands) and `␠` represents a
 * single space.
 *
 * ```markdown
 * ␉
 * ␠␠␠␠
 * ␉␠
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {TokenType} type
 *   Type (`' \t'`).
 * @param {number | undefined} [max=Infinity]
 *   Max (exclusive).
 * @returns
 *   Start state.
 */
function factorySpace(effects, ok, type, max) {
  const limit = max ? max - 1 : Number.POSITIVE_INFINITY
  let size = 0

  return start

  /** @type {State} */
  function start(code) {
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_0__.markdownSpace)(code)) {
      effects.enter(type)
      return prefix(code)
    }

    return ok(code)
  }

  /** @type {State} */
  function prefix(code) {
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_0__.markdownSpace)(code) && size++ < limit) {
      effects.consume(code)
      return prefix
    }

    effects.exit(type)
    return ok(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-factory-title/dev/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/micromark-factory-title/dev/index.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   factoryTitle: function() { return /* binding */ factoryTitle; }
/* harmony export */ });
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */







/**
 * Parse titles.
 *
 * ###### Examples
 *
 * ```markdown
 * "a"
 * 'b'
 * (c)
 * "a
 * b"
 * 'a
 *     b'
 * (a\)b)
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type of the whole title (`"a"`, `'b'`, `(c)`).
 * @param {TokenType} markerType
 *   Type for the markers (`"`, `'`, `(`, and `)`).
 * @param {TokenType} stringType
 *   Type for the value (`a`).
 * @returns {State}
 *   Start state.
 */
// eslint-disable-next-line max-params
function factoryTitle(effects, ok, nok, type, markerType, stringType) {
  /** @type {NonNullable<Code>} */
  let marker

  return start

  /**
   * Start of title.
   *
   * ```markdown
   * > | "a"
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.quotationMark ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.apostrophe ||
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.leftParenthesis
    ) {
      effects.enter(type)
      effects.enter(markerType)
      effects.consume(code)
      effects.exit(markerType)
      marker = code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.leftParenthesis ? micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.rightParenthesis : code
      return begin
    }

    return nok(code)
  }

  /**
   * After opening marker.
   *
   * This is also used at the closing marker.
   *
   * ```markdown
   * > | "a"
   *      ^
   * ```
   *
   * @type {State}
   */
  function begin(code) {
    if (code === marker) {
      effects.enter(markerType)
      effects.consume(code)
      effects.exit(markerType)
      effects.exit(type)
      return ok
    }

    effects.enter(stringType)
    return atBreak(code)
  }

  /**
   * At something, before something else.
   *
   * ```markdown
   * > | "a"
   *      ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === marker) {
      effects.exit(stringType)
      return begin(marker)
    }

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.eof) {
      return nok(code)
    }

    // Note: blank lines can’t exist in content.
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_1__.markdownLineEnding)(code)) {
      // To do: use `space_or_tab_eol_with_options`, connect.
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineEnding)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineEnding)
      return (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_3__.factorySpace)(effects, atBreak, micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.linePrefix)
    }

    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.chunkString, {contentType: micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__.constants.contentTypeString})
    return inside(code)
  }

  /**
   *
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_1__.markdownLineEnding)(code)) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.chunkString)
      return atBreak(code)
    }

    effects.consume(code)
    return code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.backslash ? escape : inside
  }

  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | "a\*b"
   *      ^
   * ```
   *
   * @type {State}
   */
  function escape(code) {
    if (code === marker || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.backslash) {
      effects.consume(code)
      return inside
    }

    return inside(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-factory-whitespace/dev/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/micromark-factory-whitespace/dev/index.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   factoryWhitespace: function() { return /* binding */ factoryWhitespace; }
/* harmony export */ });
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 */





/**
 * Parse spaces and tabs.
 *
 * There is no `nok` parameter:
 *
 * *   line endings or spaces in markdown are often optional, in which case this
 *     factory can be used and `ok` will be switched to whether spaces were found
 *     or not
 * *   one line ending or space can be detected with
 *     `markdownLineEndingOrSpace(code)` right before using `factoryWhitespace`
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @returns
 *   Start state.
 */
function factoryWhitespace(effects, ok) {
  /** @type {boolean} */
  let seen

  return start

  /** @type {State} */
  function start(code) {
    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_0__.markdownLineEnding)(code)) {
      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding)
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding)
      seen = true
      return start
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_0__.markdownSpace)(code)) {
      return (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_2__.factorySpace)(
        effects,
        start,
        seen ? micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.linePrefix : micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineSuffix
      )(code)
    }

    return ok(code)
  }
}


/***/ }),

/***/ "./node_modules/micromark-util-character/dev/index.js":
/*!************************************************************!*\
  !*** ./node_modules/micromark-util-character/dev/index.js ***!
  \************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   asciiAlpha: function() { return /* binding */ asciiAlpha; },
/* harmony export */   asciiAlphanumeric: function() { return /* binding */ asciiAlphanumeric; },
/* harmony export */   asciiAtext: function() { return /* binding */ asciiAtext; },
/* harmony export */   asciiControl: function() { return /* binding */ asciiControl; },
/* harmony export */   asciiDigit: function() { return /* binding */ asciiDigit; },
/* harmony export */   asciiHexDigit: function() { return /* binding */ asciiHexDigit; },
/* harmony export */   asciiPunctuation: function() { return /* binding */ asciiPunctuation; },
/* harmony export */   markdownLineEnding: function() { return /* binding */ markdownLineEnding; },
/* harmony export */   markdownLineEndingOrSpace: function() { return /* binding */ markdownLineEndingOrSpace; },
/* harmony export */   markdownSpace: function() { return /* binding */ markdownSpace; },
/* harmony export */   unicodePunctuation: function() { return /* binding */ unicodePunctuation; },
/* harmony export */   unicodeWhitespace: function() { return /* binding */ unicodeWhitespace; }
/* harmony export */ });
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var _lib_unicode_punctuation_regex_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/unicode-punctuation-regex.js */ "./node_modules/micromark-util-character/dev/lib/unicode-punctuation-regex.js");
/**
 * @typedef {import('micromark-util-types').Code} Code
 */




/**
 * Check whether the character code represents an ASCII alpha (`a` through `z`,
 * case insensitive).
 *
 * An **ASCII alpha** is an ASCII upper alpha or ASCII lower alpha.
 *
 * An **ASCII upper alpha** is a character in the inclusive range U+0041 (`A`)
 * to U+005A (`Z`).
 *
 * An **ASCII lower alpha** is a character in the inclusive range U+0061 (`a`)
 * to U+007A (`z`).
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiAlpha = regexCheck(/[A-Za-z]/)

/**
 * Check whether the character code represents an ASCII alphanumeric (`a`
 * through `z`, case insensitive, or `0` through `9`).
 *
 * An **ASCII alphanumeric** is an ASCII digit (see `asciiDigit`) or ASCII alpha
 * (see `asciiAlpha`).
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiAlphanumeric = regexCheck(/[\dA-Za-z]/)

/**
 * Check whether the character code represents an ASCII atext.
 *
 * atext is an ASCII alphanumeric (see `asciiAlphanumeric`), or a character in
 * the inclusive ranges U+0023 NUMBER SIGN (`#`) to U+0027 APOSTROPHE (`'`),
 * U+002A ASTERISK (`*`), U+002B PLUS SIGN (`+`), U+002D DASH (`-`), U+002F
 * SLASH (`/`), U+003D EQUALS TO (`=`), U+003F QUESTION MARK (`?`), U+005E
 * CARET (`^`) to U+0060 GRAVE ACCENT (`` ` ``), or U+007B LEFT CURLY BRACE
 * (`{`) to U+007E TILDE (`~`).
 *
 * See:
 * **\[RFC5322]**:
 * [Internet Message Format](https://tools.ietf.org/html/rfc5322).
 * P. Resnick.
 * IETF.
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/)

/**
 * Check whether a character code is an ASCII control character.
 *
 * An **ASCII control** is a character in the inclusive range U+0000 NULL (NUL)
 * to U+001F (US), or U+007F (DEL).
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function asciiControl(code) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    code !== null && (code < micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.space || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.del)
  )
}

/**
 * Check whether the character code represents an ASCII digit (`0` through `9`).
 *
 * An **ASCII digit** is a character in the inclusive range U+0030 (`0`) to
 * U+0039 (`9`).
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiDigit = regexCheck(/\d/)

/**
 * Check whether the character code represents an ASCII hex digit (`a` through
 * `f`, case insensitive, or `0` through `9`).
 *
 * An **ASCII hex digit** is an ASCII digit (see `asciiDigit`), ASCII upper hex
 * digit, or an ASCII lower hex digit.
 *
 * An **ASCII upper hex digit** is a character in the inclusive range U+0041
 * (`A`) to U+0046 (`F`).
 *
 * An **ASCII lower hex digit** is a character in the inclusive range U+0061
 * (`a`) to U+0066 (`f`).
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiHexDigit = regexCheck(/[\dA-Fa-f]/)

/**
 * Check whether the character code represents ASCII punctuation.
 *
 * An **ASCII punctuation** is a character in the inclusive ranges U+0021
 * EXCLAMATION MARK (`!`) to U+002F SLASH (`/`), U+003A COLON (`:`) to U+0040 AT
 * SIGN (`@`), U+005B LEFT SQUARE BRACKET (`[`) to U+0060 GRAVE ACCENT
 * (`` ` ``), or U+007B LEFT CURLY BRACE (`{`) to U+007E TILDE (`~`).
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/)

/**
 * Check whether a character code is a markdown line ending.
 *
 * A **markdown line ending** is the virtual characters M-0003 CARRIAGE RETURN
 * LINE FEED (CRLF), M-0004 LINE FEED (LF) and M-0005 CARRIAGE RETURN (CR).
 *
 * In micromark, the actual character U+000A LINE FEED (LF) and U+000D CARRIAGE
 * RETURN (CR) are replaced by these virtual characters depending on whether
 * they occurred together.
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownLineEnding(code) {
  return code !== null && code < micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.horizontalTab
}

/**
 * Check whether a character code is a markdown line ending (see
 * `markdownLineEnding`) or markdown space (see `markdownSpace`).
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownLineEndingOrSpace(code) {
  return code !== null && (code < micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.nul || code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.space)
}

/**
 * Check whether a character code is a markdown space.
 *
 * A **markdown space** is the concrete character U+0020 SPACE (SP) and the
 * virtual characters M-0001 VIRTUAL SPACE (VS) and M-0002 HORIZONTAL TAB (HT).
 *
 * In micromark, the actual character U+0009 CHARACTER TABULATION (HT) is
 * replaced by one M-0002 HORIZONTAL TAB (HT) and between 0 and 3 M-0001 VIRTUAL
 * SPACE (VS) characters, depending on the column at which the tab occurred.
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownSpace(code) {
  return (
    code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.horizontalTab ||
    code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.virtualSpace ||
    code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.space
  )
}

// Size note: removing ASCII from the regex and using `asciiPunctuation` here
// In fact adds to the bundle size.
/**
 * Check whether the character code represents Unicode punctuation.
 *
 * A **Unicode punctuation** is a character in the Unicode `Pc` (Punctuation,
 * Connector), `Pd` (Punctuation, Dash), `Pe` (Punctuation, Close), `Pf`
 * (Punctuation, Final quote), `Pi` (Punctuation, Initial quote), `Po`
 * (Punctuation, Other), or `Ps` (Punctuation, Open) categories, or an ASCII
 * punctuation (see `asciiPunctuation`).
 *
 * See:
 * **\[UNICODE]**:
 * [The Unicode Standard](https://www.unicode.org/versions/).
 * Unicode Consortium.
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const unicodePunctuation = regexCheck(_lib_unicode_punctuation_regex_js__WEBPACK_IMPORTED_MODULE_1__.unicodePunctuationRegex)

/**
 * Check whether the character code represents Unicode whitespace.
 *
 * Note that this does handle micromark specific markdown whitespace characters.
 * See `markdownLineEndingOrSpace` to check that.
 *
 * A **Unicode whitespace** is a character in the Unicode `Zs` (Separator,
 * Space) category, or U+0009 CHARACTER TABULATION (HT), U+000A LINE FEED (LF),
 * U+000C (FF), or U+000D CARRIAGE RETURN (CR) (**\[UNICODE]**).
 *
 * See:
 * **\[UNICODE]**:
 * [The Unicode Standard](https://www.unicode.org/versions/).
 * Unicode Consortium.
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const unicodeWhitespace = regexCheck(/\s/)

/**
 * Create a code check from a regex.
 *
 * @param {RegExp} regex
 * @returns {(code: Code) => boolean}
 */
function regexCheck(regex) {
  return check

  /**
   * Check whether a code matches the bound regex.
   *
   * @param {Code} code
   *   Character code.
   * @returns {boolean}
   *   Whether the character code matches the bound regex.
   */
  function check(code) {
    return code !== null && regex.test(String.fromCharCode(code))
  }
}


/***/ }),

/***/ "./node_modules/micromark-util-character/dev/lib/unicode-punctuation-regex.js":
/*!************************************************************************************!*\
  !*** ./node_modules/micromark-util-character/dev/lib/unicode-punctuation-regex.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   unicodePunctuationRegex: function() { return /* binding */ unicodePunctuationRegex; }
/* harmony export */ });
// This module is generated by `script/`.
//
// CommonMark handles attention (emphasis, strong) markers based on what comes
// before or after them.
// One such difference is if those characters are Unicode punctuation.
// This script is generated from the Unicode data.

/**
 * Regular expression that matches a unicode punctuation character.
 */
const unicodePunctuationRegex =
  /[!-/:-@[-`{-~\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/


/***/ }),

/***/ "./node_modules/micromark-util-chunked/dev/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/micromark-util-chunked/dev/index.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   push: function() { return /* binding */ push; },
/* harmony export */   splice: function() { return /* binding */ splice; }
/* harmony export */ });
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");


/**
 * Like `Array#splice`, but smarter for giant arrays.
 *
 * `Array#splice` takes all items to be inserted as individual argument which
 * causes a stack overflow in V8 when trying to insert 100k items for instance.
 *
 * Otherwise, this does not return the removed items, and takes `items` as an
 * array instead of rest parameters.
 *
 * @template {unknown} T
 *   Item type.
 * @param {Array<T>} list
 *   List to operate on.
 * @param {number} start
 *   Index to remove/insert at (can be negative).
 * @param {number} remove
 *   Number of items to remove.
 * @param {Array<T>} items
 *   Items to inject into `list`.
 * @returns {void}
 *   Nothing.
 */
function splice(list, start, remove, items) {
  const end = list.length
  let chunkStart = 0
  /** @type {Array<unknown>} */
  let parameters

  // Make start between zero and `end` (included).
  if (start < 0) {
    start = -start > end ? 0 : end + start
  } else {
    start = start > end ? end : start
  }

  remove = remove > 0 ? remove : 0

  // No need to chunk the items if there’s only a couple (10k) items.
  if (items.length < micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_0__.constants.v8MaxSafeChunkSize) {
    parameters = Array.from(items)
    parameters.unshift(start, remove)
    // @ts-expect-error Hush, it’s fine.
    list.splice(...parameters)
  } else {
    // Delete `remove` items starting from `start`
    if (remove) list.splice(start, remove)

    // Insert the items in chunks to not cause stack overflows.
    while (chunkStart < items.length) {
      parameters = items.slice(
        chunkStart,
        chunkStart + micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_0__.constants.v8MaxSafeChunkSize
      )
      parameters.unshift(start, 0)
      // @ts-expect-error Hush, it’s fine.
      list.splice(...parameters)

      chunkStart += micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_0__.constants.v8MaxSafeChunkSize
      start += micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_0__.constants.v8MaxSafeChunkSize
    }
  }
}

/**
 * Append `items` (an array) at the end of `list` (another array).
 * When `list` was empty, returns `items` instead.
 *
 * This prevents a potentially expensive operation when `list` is empty,
 * and adds items in batches to prevent V8 from hanging.
 *
 * @template {unknown} T
 *   Item type.
 * @param {Array<T>} list
 *   List to operate on.
 * @param {Array<T>} items
 *   Items to add to `list`.
 * @returns {Array<T>}
 *   Either `list` or `items`.
 */
function push(list, items) {
  if (list.length > 0) {
    splice(list, list.length, 0, items)
    return list
  }

  return items
}


/***/ }),

/***/ "./node_modules/micromark-util-classify-character/dev/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/micromark-util-classify-character/dev/index.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   classifyCharacter: function() { return /* binding */ classifyCharacter; }
/* harmony export */ });
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/**
 * @typedef {import('micromark-util-types').Code} Code
 */





/**
 * Classify whether a code represents whitespace, punctuation, or something
 * else.
 *
 * Used for attention (emphasis, strong), whose sequences can open or close
 * based on the class of surrounding characters.
 *
 * > 👉 **Note**: eof (`null`) is seen as whitespace.
 *
 * @param {Code} code
 *   Code.
 * @returns {typeof constants.characterGroupWhitespace | typeof constants.characterGroupPunctuation | undefined}
 *   Group.
 */
function classifyCharacter(code) {
  if (
    code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.eof ||
    (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_1__.markdownLineEndingOrSpace)(code) ||
    (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_1__.unicodeWhitespace)(code)
  ) {
    return micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_2__.constants.characterGroupWhitespace
  }

  if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_1__.unicodePunctuation)(code)) {
    return micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_2__.constants.characterGroupPunctuation
  }
}


/***/ }),

/***/ "./node_modules/micromark-util-combine-extensions/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/micromark-util-combine-extensions/index.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   combineExtensions: function() { return /* binding */ combineExtensions; },
/* harmony export */   combineHtmlExtensions: function() { return /* binding */ combineHtmlExtensions; }
/* harmony export */ });
/* harmony import */ var micromark_util_chunked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-chunked */ "./node_modules/micromark-util-chunked/dev/index.js");
/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').Handles} Handles
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 * @typedef {import('micromark-util-types').NormalizedExtension} NormalizedExtension
 */



const hasOwnProperty = {}.hasOwnProperty

/**
 * Combine multiple syntax extensions into one.
 *
 * @param {Array<Extension>} extensions
 *   List of syntax extensions.
 * @returns {NormalizedExtension}
 *   A single combined extension.
 */
function combineExtensions(extensions) {
  /** @type {NormalizedExtension} */
  const all = {}
  let index = -1

  while (++index < extensions.length) {
    syntaxExtension(all, extensions[index])
  }

  return all
}

/**
 * Merge `extension` into `all`.
 *
 * @param {NormalizedExtension} all
 *   Extension to merge into.
 * @param {Extension} extension
 *   Extension to merge.
 * @returns {void}
 */
function syntaxExtension(all, extension) {
  /** @type {keyof Extension} */
  let hook

  for (hook in extension) {
    const maybe = hasOwnProperty.call(all, hook) ? all[hook] : undefined
    /** @type {Record<string, unknown>} */
    const left = maybe || (all[hook] = {})
    /** @type {Record<string, unknown> | undefined} */
    const right = extension[hook]
    /** @type {string} */
    let code

    if (right) {
      for (code in right) {
        if (!hasOwnProperty.call(left, code)) left[code] = []
        const value = right[code]
        constructs(
          // @ts-expect-error Looks like a list.
          left[code],
          Array.isArray(value) ? value : value ? [value] : []
        )
      }
    }
  }
}

/**
 * Merge `list` into `existing` (both lists of constructs).
 * Mutates `existing`.
 *
 * @param {Array<unknown>} existing
 * @param {Array<unknown>} list
 * @returns {void}
 */
function constructs(existing, list) {
  let index = -1
  /** @type {Array<unknown>} */
  const before = []

  while (++index < list.length) {
    // @ts-expect-error Looks like an object.
    ;(list[index].add === 'after' ? existing : before).push(list[index])
  }

  (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_0__.splice)(existing, 0, 0, before)
}

/**
 * Combine multiple HTML extensions into one.
 *
 * @param {Array<HtmlExtension>} htmlExtensions
 *   List of HTML extensions.
 * @returns {HtmlExtension}
 *   A single combined HTML extension.
 */
function combineHtmlExtensions(htmlExtensions) {
  /** @type {HtmlExtension} */
  const handlers = {}
  let index = -1

  while (++index < htmlExtensions.length) {
    htmlExtension(handlers, htmlExtensions[index])
  }

  return handlers
}

/**
 * Merge `extension` into `all`.
 *
 * @param {HtmlExtension} all
 *   Extension to merge into.
 * @param {HtmlExtension} extension
 *   Extension to merge.
 * @returns {void}
 */
function htmlExtension(all, extension) {
  /** @type {keyof HtmlExtension} */
  let hook

  for (hook in extension) {
    const maybe = hasOwnProperty.call(all, hook) ? all[hook] : undefined
    const left = maybe || (all[hook] = {})
    const right = extension[hook]
    /** @type {keyof Handles} */
    let type

    if (right) {
      for (type in right) {
        // @ts-expect-error assume document vs regular handler are managed correctly.
        left[type] = right[type]
      }
    }
  }
}


/***/ }),

/***/ "./node_modules/micromark-util-decode-numeric-character-reference/dev/index.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/micromark-util-decode-numeric-character-reference/dev/index.js ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decodeNumericCharacterReference: function() { return /* binding */ decodeNumericCharacterReference; }
/* harmony export */ });
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_values_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/values.js */ "./node_modules/micromark-util-symbol/values.js");



/**
 * Turn the number (in string form as either hexa- or plain decimal) coming from
 * a numeric character reference into a character.
 *
 * Sort of like `String.fromCharCode(Number.parseInt(value, base))`, but makes
 * non-characters and control characters safe.
 *
 * @param {string} value
 *   Value to decode.
 * @param {number} base
 *   Numeric base.
 * @returns {string}
 *   Character.
 */
function decodeNumericCharacterReference(value, base) {
  const code = Number.parseInt(value, base)

  if (
    // C0 except for HT, LF, FF, CR, space.
    code < micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.ht ||
    code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.vt ||
    (code > micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.cr && code < micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.space) ||
    // Control character (DEL) of C0, and C1 controls.
    (code > micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.tilde && code < 160) ||
    // Lone high surrogates and low surrogates.
    (code > 55295 && code < 57344) ||
    // Noncharacters.
    (code > 64975 && code < 65008) ||
    /* eslint-disable no-bitwise */
    (code & 65535) === 65535 ||
    (code & 65535) === 65534 ||
    /* eslint-enable no-bitwise */
    // Out of range
    code > 1114111
  ) {
    return micromark_util_symbol_values_js__WEBPACK_IMPORTED_MODULE_1__.values.replacementCharacter
  }

  return String.fromCharCode(code)
}


/***/ }),

/***/ "./node_modules/micromark-util-decode-string/dev/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/micromark-util-decode-string/dev/index.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decodeString: function() { return /* binding */ decodeString; }
/* harmony export */ });
/* harmony import */ var decode_named_character_reference__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! decode-named-character-reference */ "./node_modules/decode-named-character-reference/index.dom.js");
/* harmony import */ var micromark_util_decode_numeric_character_reference__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-decode-numeric-character-reference */ "./node_modules/micromark-util-decode-numeric-character-reference/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");





const characterEscapeOrReference =
  /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi

/**
 * Decode markdown strings (which occur in places such as fenced code info
 * strings, destinations, labels, and titles).
 *
 * The “string” content type allows character escapes and -references.
 * This decodes those.
 *
 * @param {string} value
 *   Value to decode.
 * @returns {string}
 *   Decoded value.
 */
function decodeString(value) {
  return value.replace(characterEscapeOrReference, decode)
}

/**
 * @param {string} $0
 * @param {string} $1
 * @param {string} $2
 * @returns {string}
 */
function decode($0, $1, $2) {
  if ($1) {
    // Escape.
    return $1
  }

  // Reference.
  const head = $2.charCodeAt(0)

  if (head === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.numberSign) {
    const head = $2.charCodeAt(1)
    const hex = head === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.lowercaseX || head === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.uppercaseX
    return (0,micromark_util_decode_numeric_character_reference__WEBPACK_IMPORTED_MODULE_1__.decodeNumericCharacterReference)(
      $2.slice(hex ? 2 : 1),
      hex ? micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_2__.constants.numericBaseHexadecimal : micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_2__.constants.numericBaseDecimal
    )
  }

  return (0,decode_named_character_reference__WEBPACK_IMPORTED_MODULE_3__.decodeNamedCharacterReference)($2) || $0
}


/***/ }),

/***/ "./node_modules/micromark-util-html-tag-name/index.js":
/*!************************************************************!*\
  !*** ./node_modules/micromark-util-html-tag-name/index.js ***!
  \************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   htmlBlockNames: function() { return /* binding */ htmlBlockNames; },
/* harmony export */   htmlRawNames: function() { return /* binding */ htmlRawNames; }
/* harmony export */ });
/**
 * List of lowercase HTML “block” tag names.
 *
 * The list, when parsing HTML (flow), results in more relaxed rules (condition
 * 6).
 * Because they are known blocks, the HTML-like syntax doesn’t have to be
 * strictly parsed.
 * For tag names not in this list, a more strict algorithm (condition 7) is used
 * to detect whether the HTML-like syntax is seen as HTML (flow) or not.
 *
 * This is copied from:
 * <https://spec.commonmark.org/0.30/#html-blocks>.
 *
 * > 👉 **Note**: `search` was added in `CommonMark@0.31`.
 */
const htmlBlockNames = [
  'address',
  'article',
  'aside',
  'base',
  'basefont',
  'blockquote',
  'body',
  'caption',
  'center',
  'col',
  'colgroup',
  'dd',
  'details',
  'dialog',
  'dir',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'frame',
  'frameset',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'iframe',
  'legend',
  'li',
  'link',
  'main',
  'menu',
  'menuitem',
  'nav',
  'noframes',
  'ol',
  'optgroup',
  'option',
  'p',
  'param',
  'search',
  'section',
  'summary',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'title',
  'tr',
  'track',
  'ul'
]

/**
 * List of lowercase HTML “raw” tag names.
 *
 * The list, when parsing HTML (flow), results in HTML that can include lines
 * without exiting, until a closing tag also in this list is found (condition
 * 1).
 *
 * This module is copied from:
 * <https://spec.commonmark.org/0.30/#html-blocks>.
 *
 * > 👉 **Note**: `textarea` was added in `CommonMark@0.30`.
 */
const htmlRawNames = ['pre', 'script', 'style', 'textarea']


/***/ }),

/***/ "./node_modules/micromark-util-normalize-identifier/dev/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/micromark-util-normalize-identifier/dev/index.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   normalizeIdentifier: function() { return /* binding */ normalizeIdentifier; }
/* harmony export */ });
/* harmony import */ var micromark_util_symbol_values_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-symbol/values.js */ "./node_modules/micromark-util-symbol/values.js");


/**
 * Normalize an identifier (as found in references, definitions).
 *
 * Collapses markdown whitespace, trim, and then lower- and uppercase.
 *
 * Some characters are considered “uppercase”, such as U+03F4 (`ϴ`), but if their
 * lowercase counterpart (U+03B8 (`θ`)) is uppercased will result in a different
 * uppercase character (U+0398 (`Θ`)).
 * So, to get a canonical form, we perform both lower- and uppercase.
 *
 * Using uppercase last makes sure keys will never interact with default
 * prototypal values (such as `constructor`): nothing in the prototype of
 * `Object` is uppercase.
 *
 * @param {string} value
 *   Identifier to normalize.
 * @returns {string}
 *   Normalized identifier.
 */
function normalizeIdentifier(value) {
  return (
    value
      // Collapse markdown whitespace.
      .replace(/[\t\n\r ]+/g, micromark_util_symbol_values_js__WEBPACK_IMPORTED_MODULE_0__.values.space)
      // Trim.
      .replace(/^ | $/g, '')
      // Some characters are considered “uppercase”, but if their lowercase
      // counterpart is uppercased will result in a different uppercase
      // character.
      // Hence, to get that form, we perform both lower- and uppercase.
      // Upper case makes sure keys will not interact with default prototypal
      // methods: no method is uppercase.
      .toLowerCase()
      .toUpperCase()
  )
}


/***/ }),

/***/ "./node_modules/micromark-util-resolve-all/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/micromark-util-resolve-all/index.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   resolveAll: function() { return /* binding */ resolveAll; }
/* harmony export */ });
/**
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */

/**
 * Call all `resolveAll`s.
 *
 * @param {Array<{resolveAll?: Resolver | undefined}>} constructs
 *   List of constructs, optionally with `resolveAll`s.
 * @param {Array<Event>} events
 *   List of events.
 * @param {TokenizeContext} context
 *   Context used by `tokenize`.
 * @returns {Array<Event>}
 *   Changed events.
 */
function resolveAll(constructs, events, context) {
  /** @type {Array<Resolver>} */
  const called = []
  let index = -1

  while (++index < constructs.length) {
    const resolve = constructs[index].resolveAll

    if (resolve && !called.includes(resolve)) {
      events = resolve(events, context)
      called.push(resolve)
    }
  }

  return events
}


/***/ }),

/***/ "./node_modules/micromark-util-subtokenize/dev/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/micromark-util-subtokenize/dev/index.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   subtokenize: function() { return /* binding */ subtokenize; }
/* harmony export */ });
/* harmony import */ var micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-chunked */ "./node_modules/micromark-util-chunked/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Chunk} Chunk
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Token} Token
 */






/**
 * Tokenize subcontent.
 *
 * @param {Array<Event>} events
 *   List of events.
 * @returns {boolean}
 *   Whether subtokens were found.
 */
function subtokenize(events) {
  /** @type {Record<string, number>} */
  const jumps = {}
  let index = -1
  /** @type {Event} */
  let event
  /** @type {number | undefined} */
  let lineIndex
  /** @type {number} */
  let otherIndex
  /** @type {Event} */
  let otherEvent
  /** @type {Array<Event>} */
  let parameters
  /** @type {Array<Event>} */
  let subevents
  /** @type {boolean | undefined} */
  let more

  while (++index < events.length) {
    while (index in jumps) {
      index = jumps[index]
    }

    event = events[index]

    // Add a hook for the GFM tasklist extension, which needs to know if text
    // is in the first content of a list item.
    if (
      index &&
      event[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.chunkFlow &&
      events[index - 1][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.listItemPrefix
    ) {
      (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(event[1]._tokenizer, 'expected `_tokenizer` on subtokens')
      subevents = event[1]._tokenizer.events
      otherIndex = 0

      if (
        otherIndex < subevents.length &&
        subevents[otherIndex][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEndingBlank
      ) {
        otherIndex += 2
      }

      if (
        otherIndex < subevents.length &&
        subevents[otherIndex][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.content
      ) {
        while (++otherIndex < subevents.length) {
          if (subevents[otherIndex][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.content) {
            break
          }

          if (subevents[otherIndex][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.chunkText) {
            subevents[otherIndex][1]._isInFirstContentOfListItem = true
            otherIndex++
          }
        }
      }
    }

    // Enter.
    if (event[0] === 'enter') {
      if (event[1].contentType) {
        Object.assign(jumps, subcontent(events, index))
        index = jumps[index]
        more = true
      }
    }
    // Exit.
    else if (event[1]._container) {
      otherIndex = index
      lineIndex = undefined

      while (otherIndex--) {
        otherEvent = events[otherIndex]

        if (
          otherEvent[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding ||
          otherEvent[1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEndingBlank
        ) {
          if (otherEvent[0] === 'enter') {
            if (lineIndex) {
              events[lineIndex][1].type = micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEndingBlank
            }

            otherEvent[1].type = micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.lineEnding
            lineIndex = otherIndex
          }
        } else {
          break
        }
      }

      if (lineIndex) {
        // Fix position.
        event[1].end = Object.assign({}, events[lineIndex][1].start)

        // Switch container exit w/ line endings.
        parameters = events.slice(lineIndex, index)
        parameters.unshift(event)
        ;(0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.splice)(events, lineIndex, index - lineIndex + 1, parameters)
      }
    }
  }

  return !more
}

/**
 * Tokenize embedded tokens.
 *
 * @param {Array<Event>} events
 * @param {number} eventIndex
 * @returns {Record<string, number>}
 */
function subcontent(events, eventIndex) {
  const token = events[eventIndex][1]
  const context = events[eventIndex][2]
  let startPosition = eventIndex - 1
  /** @type {Array<number>} */
  const startPositions = []
  ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(token.contentType, 'expected `contentType` on subtokens')
  const tokenizer =
    token._tokenizer || context.parser[token.contentType](token.start)
  const childEvents = tokenizer.events
  /** @type {Array<[number, number]>} */
  const jumps = []
  /** @type {Record<string, number>} */
  const gaps = {}
  /** @type {Array<Chunk>} */
  let stream
  /** @type {Token | undefined} */
  let previous
  let index = -1
  /** @type {Token | undefined} */
  let current = token
  let adjust = 0
  let start = 0
  const breaks = [start]

  // Loop forward through the linked tokens to pass them in order to the
  // subtokenizer.
  while (current) {
    // Find the position of the event for this token.
    while (events[++startPosition][1] !== current) {
      // Empty.
    }

    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      !previous || current.previous === previous,
      'expected previous to match'
    )
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(!previous || previous.next === current, 'expected next to match')

    startPositions.push(startPosition)

    if (!current._tokenizer) {
      stream = context.sliceStream(current)

      if (!current.next) {
        stream.push(micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_3__.codes.eof)
      }

      if (previous) {
        tokenizer.defineSkip(current.start)
      }

      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = true
      }

      tokenizer.write(stream)

      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = undefined
      }
    }

    // Unravel the next token.
    previous = current
    current = current.next
  }

  // Now, loop back through all events (and linked tokens), to figure out which
  // parts belong where.
  current = token

  while (++index < childEvents.length) {
    if (
      // Find a void token that includes a break.
      childEvents[index][0] === 'exit' &&
      childEvents[index - 1][0] === 'enter' &&
      childEvents[index][1].type === childEvents[index - 1][1].type &&
      childEvents[index][1].start.line !== childEvents[index][1].end.line
    ) {
      (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(current, 'expected a current token')
      start = index + 1
      breaks.push(start)
      // Help GC.
      current._tokenizer = undefined
      current.previous = undefined
      current = current.next
    }
  }

  // Help GC.
  tokenizer.events = []

  // If there’s one more token (which is the cases for lines that end in an
  // EOF), that’s perfect: the last point we found starts it.
  // If there isn’t then make sure any remaining content is added to it.
  if (current) {
    // Help GC.
    current._tokenizer = undefined
    current.previous = undefined
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(!current.next, 'expected no next token')
  } else {
    breaks.pop()
  }

  // Now splice the events from the subtokenizer into the current events,
  // moving back to front so that splice indices aren’t affected.
  index = breaks.length

  while (index--) {
    const slice = childEvents.slice(breaks[index], breaks[index + 1])
    const start = startPositions.pop()
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(start !== undefined, 'expected a start position when splicing')
    jumps.unshift([start, start + slice.length - 1])
    ;(0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.splice)(events, start, 2, slice)
  }

  index = -1

  while (++index < jumps.length) {
    gaps[adjust + jumps[index][0]] = adjust + jumps[index][1]
    adjust += jumps[index][1] - jumps[index][0] - 1
  }

  return gaps
}


/***/ }),

/***/ "./node_modules/micromark-util-symbol/codes.js":
/*!*****************************************************!*\
  !*** ./node_modules/micromark-util-symbol/codes.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   codes: function() { return /* binding */ codes; }
/* harmony export */ });
/**
 * Character codes.
 *
 * This module is compiled away!
 *
 * micromark works based on character codes.
 * This module contains constants for the ASCII block and the replacement
 * character.
 * A couple of them are handled in a special way, such as the line endings
 * (CR, LF, and CR+LF, commonly known as end-of-line: EOLs), the tab (horizontal
 * tab) and its expansion based on what column it’s at (virtual space),
 * and the end-of-file (eof) character.
 * As values are preprocessed before handling them, the actual characters LF,
 * CR, HT, and NUL (which is present as the replacement character), are
 * guaranteed to not exist.
 *
 * Unicode basic latin block.
 */
const codes = /** @type {const} */ ({
  carriageReturn: -5,
  lineFeed: -4,
  carriageReturnLineFeed: -3,
  horizontalTab: -2,
  virtualSpace: -1,
  eof: null,
  nul: 0,
  soh: 1,
  stx: 2,
  etx: 3,
  eot: 4,
  enq: 5,
  ack: 6,
  bel: 7,
  bs: 8,
  ht: 9, // `\t`
  lf: 10, // `\n`
  vt: 11, // `\v`
  ff: 12, // `\f`
  cr: 13, // `\r`
  so: 14,
  si: 15,
  dle: 16,
  dc1: 17,
  dc2: 18,
  dc3: 19,
  dc4: 20,
  nak: 21,
  syn: 22,
  etb: 23,
  can: 24,
  em: 25,
  sub: 26,
  esc: 27,
  fs: 28,
  gs: 29,
  rs: 30,
  us: 31,
  space: 32,
  exclamationMark: 33, // `!`
  quotationMark: 34, // `"`
  numberSign: 35, // `#`
  dollarSign: 36, // `$`
  percentSign: 37, // `%`
  ampersand: 38, // `&`
  apostrophe: 39, // `'`
  leftParenthesis: 40, // `(`
  rightParenthesis: 41, // `)`
  asterisk: 42, // `*`
  plusSign: 43, // `+`
  comma: 44, // `,`
  dash: 45, // `-`
  dot: 46, // `.`
  slash: 47, // `/`
  digit0: 48, // `0`
  digit1: 49, // `1`
  digit2: 50, // `2`
  digit3: 51, // `3`
  digit4: 52, // `4`
  digit5: 53, // `5`
  digit6: 54, // `6`
  digit7: 55, // `7`
  digit8: 56, // `8`
  digit9: 57, // `9`
  colon: 58, // `:`
  semicolon: 59, // `;`
  lessThan: 60, // `<`
  equalsTo: 61, // `=`
  greaterThan: 62, // `>`
  questionMark: 63, // `?`
  atSign: 64, // `@`
  uppercaseA: 65, // `A`
  uppercaseB: 66, // `B`
  uppercaseC: 67, // `C`
  uppercaseD: 68, // `D`
  uppercaseE: 69, // `E`
  uppercaseF: 70, // `F`
  uppercaseG: 71, // `G`
  uppercaseH: 72, // `H`
  uppercaseI: 73, // `I`
  uppercaseJ: 74, // `J`
  uppercaseK: 75, // `K`
  uppercaseL: 76, // `L`
  uppercaseM: 77, // `M`
  uppercaseN: 78, // `N`
  uppercaseO: 79, // `O`
  uppercaseP: 80, // `P`
  uppercaseQ: 81, // `Q`
  uppercaseR: 82, // `R`
  uppercaseS: 83, // `S`
  uppercaseT: 84, // `T`
  uppercaseU: 85, // `U`
  uppercaseV: 86, // `V`
  uppercaseW: 87, // `W`
  uppercaseX: 88, // `X`
  uppercaseY: 89, // `Y`
  uppercaseZ: 90, // `Z`
  leftSquareBracket: 91, // `[`
  backslash: 92, // `\`
  rightSquareBracket: 93, // `]`
  caret: 94, // `^`
  underscore: 95, // `_`
  graveAccent: 96, // `` ` ``
  lowercaseA: 97, // `a`
  lowercaseB: 98, // `b`
  lowercaseC: 99, // `c`
  lowercaseD: 100, // `d`
  lowercaseE: 101, // `e`
  lowercaseF: 102, // `f`
  lowercaseG: 103, // `g`
  lowercaseH: 104, // `h`
  lowercaseI: 105, // `i`
  lowercaseJ: 106, // `j`
  lowercaseK: 107, // `k`
  lowercaseL: 108, // `l`
  lowercaseM: 109, // `m`
  lowercaseN: 110, // `n`
  lowercaseO: 111, // `o`
  lowercaseP: 112, // `p`
  lowercaseQ: 113, // `q`
  lowercaseR: 114, // `r`
  lowercaseS: 115, // `s`
  lowercaseT: 116, // `t`
  lowercaseU: 117, // `u`
  lowercaseV: 118, // `v`
  lowercaseW: 119, // `w`
  lowercaseX: 120, // `x`
  lowercaseY: 121, // `y`
  lowercaseZ: 122, // `z`
  leftCurlyBrace: 123, // `{`
  verticalBar: 124, // `|`
  rightCurlyBrace: 125, // `}`
  tilde: 126, // `~`
  del: 127,
  // Unicode Specials block.
  byteOrderMarker: 65279,
  // Unicode Specials block.
  replacementCharacter: 65533 // `�`
})


/***/ }),

/***/ "./node_modules/micromark-util-symbol/constants.js":
/*!*********************************************************!*\
  !*** ./node_modules/micromark-util-symbol/constants.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   constants: function() { return /* binding */ constants; }
/* harmony export */ });
/**
 * This module is compiled away!
 *
 * Parsing markdown comes with a couple of constants, such as minimum or maximum
 * sizes of certain sequences.
 * Additionally, there are a couple symbols used inside micromark.
 * These are all defined here, but compiled away by scripts.
 */
const constants = /** @type {const} */ ({
  attentionSideBefore: 1, // Symbol to mark an attention sequence as before content: `*a`
  attentionSideAfter: 2, // Symbol to mark an attention sequence as after content: `a*`
  atxHeadingOpeningFenceSizeMax: 6, // 6 number signs is fine, 7 isn’t.
  autolinkDomainSizeMax: 63, // 63 characters is fine, 64 is too many.
  autolinkSchemeSizeMax: 32, // 32 characters is fine, 33 is too many.
  cdataOpeningString: 'CDATA[', // And preceded by `<![`.
  characterGroupWhitespace: 1, // Symbol used to indicate a character is whitespace
  characterGroupPunctuation: 2, // Symbol used to indicate a character is punctuation
  characterReferenceDecimalSizeMax: 7, // `&#9999999;`.
  characterReferenceHexadecimalSizeMax: 6, // `&#xff9999;`.
  characterReferenceNamedSizeMax: 31, // `&CounterClockwiseContourIntegral;`.
  codeFencedSequenceSizeMin: 3, // At least 3 ticks or tildes are needed.
  contentTypeDocument: 'document',
  contentTypeFlow: 'flow',
  contentTypeContent: 'content',
  contentTypeString: 'string',
  contentTypeText: 'text',
  hardBreakPrefixSizeMin: 2, // At least 2 trailing spaces are needed.
  htmlRaw: 1, // Symbol for `<script>`
  htmlComment: 2, // Symbol for `<!---->`
  htmlInstruction: 3, // Symbol for `<?php?>`
  htmlDeclaration: 4, // Symbol for `<!doctype>`
  htmlCdata: 5, // Symbol for `<![CDATA[]]>`
  htmlBasic: 6, // Symbol for `<div`
  htmlComplete: 7, // Symbol for `<x>`
  htmlRawSizeMax: 8, // Length of `textarea`.
  linkResourceDestinationBalanceMax: 32, // See: <https://spec.commonmark.org/0.30/#link-destination>, <https://github.com/remarkjs/react-markdown/issues/658#issuecomment-984345577>
  linkReferenceSizeMax: 999, // See: <https://spec.commonmark.org/0.30/#link-label>
  listItemValueSizeMax: 10, // See: <https://spec.commonmark.org/0.30/#ordered-list-marker>
  numericBaseDecimal: 10,
  numericBaseHexadecimal: 0x10,
  tabSize: 4, // Tabs have a hard-coded size of 4, per CommonMark.
  thematicBreakMarkerCountMin: 3, // At least 3 asterisks, dashes, or underscores are needed.
  v8MaxSafeChunkSize: 10000 // V8 (and potentially others) have problems injecting giant arrays into other arrays, hence we operate in chunks.
})


/***/ }),

/***/ "./node_modules/micromark-util-symbol/types.js":
/*!*****************************************************!*\
  !*** ./node_modules/micromark-util-symbol/types.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   types: function() { return /* binding */ types; }
/* harmony export */ });
/**
 * This module is compiled away!
 *
 * Here is the list of all types of tokens exposed by micromark, with a short
 * explanation of what they include and where they are found.
 * In picking names, generally, the rule is to be as explicit as possible
 * instead of reusing names.
 * For example, there is a `definitionDestination` and a `resourceDestination`,
 * instead of one shared name.
 */

// Note: when changing the next record, you must also change `TokenTypeMap`
// in `micromark-util-types/index.d.ts`.
const types = /** @type {const} */ ({
  // Generic type for data, such as in a title, a destination, etc.
  data: 'data',

  // Generic type for syntactic whitespace (tabs, virtual spaces, spaces).
  // Such as, between a fenced code fence and an info string.
  whitespace: 'whitespace',

  // Generic type for line endings (line feed, carriage return, carriage return +
  // line feed).
  lineEnding: 'lineEnding',

  // A line ending, but ending a blank line.
  lineEndingBlank: 'lineEndingBlank',

  // Generic type for whitespace (tabs, virtual spaces, spaces) at the start of a
  // line.
  linePrefix: 'linePrefix',

  // Generic type for whitespace (tabs, virtual spaces, spaces) at the end of a
  // line.
  lineSuffix: 'lineSuffix',

  // Whole ATX heading:
  //
  // ```markdown
  // #
  // ## Alpha
  // ### Bravo ###
  // ```
  //
  // Includes `atxHeadingSequence`, `whitespace`, `atxHeadingText`.
  atxHeading: 'atxHeading',

  // Sequence of number signs in an ATX heading (`###`).
  atxHeadingSequence: 'atxHeadingSequence',

  // Content in an ATX heading (`alpha`).
  // Includes text.
  atxHeadingText: 'atxHeadingText',

  // Whole autolink (`<https://example.com>` or `<admin@example.com>`)
  // Includes `autolinkMarker` and `autolinkProtocol` or `autolinkEmail`.
  autolink: 'autolink',

  // Email autolink w/o markers (`admin@example.com`)
  autolinkEmail: 'autolinkEmail',

  // Marker around an `autolinkProtocol` or `autolinkEmail` (`<` or `>`).
  autolinkMarker: 'autolinkMarker',

  // Protocol autolink w/o markers (`https://example.com`)
  autolinkProtocol: 'autolinkProtocol',

  // A whole character escape (`\-`).
  // Includes `escapeMarker` and `characterEscapeValue`.
  characterEscape: 'characterEscape',

  // The escaped character (`-`).
  characterEscapeValue: 'characterEscapeValue',

  // A whole character reference (`&amp;`, `&#8800;`, or `&#x1D306;`).
  // Includes `characterReferenceMarker`, an optional
  // `characterReferenceMarkerNumeric`, in which case an optional
  // `characterReferenceMarkerHexadecimal`, and a `characterReferenceValue`.
  characterReference: 'characterReference',

  // The start or end marker (`&` or `;`).
  characterReferenceMarker: 'characterReferenceMarker',

  // Mark reference as numeric (`#`).
  characterReferenceMarkerNumeric: 'characterReferenceMarkerNumeric',

  // Mark reference as numeric (`x` or `X`).
  characterReferenceMarkerHexadecimal: 'characterReferenceMarkerHexadecimal',

  // Value of character reference w/o markers (`amp`, `8800`, or `1D306`).
  characterReferenceValue: 'characterReferenceValue',

  // Whole fenced code:
  //
  // ````markdown
  // ```js
  // alert(1)
  // ```
  // ````
  codeFenced: 'codeFenced',

  // A fenced code fence, including whitespace, sequence, info, and meta
  // (` ```js `).
  codeFencedFence: 'codeFencedFence',

  // Sequence of grave accent or tilde characters (` ``` `) in a fence.
  codeFencedFenceSequence: 'codeFencedFenceSequence',

  // Info word (`js`) in a fence.
  // Includes string.
  codeFencedFenceInfo: 'codeFencedFenceInfo',

  // Meta words (`highlight="1"`) in a fence.
  // Includes string.
  codeFencedFenceMeta: 'codeFencedFenceMeta',

  // A line of code.
  codeFlowValue: 'codeFlowValue',

  // Whole indented code:
  //
  // ```markdown
  //     alert(1)
  // ```
  //
  // Includes `lineEnding`, `linePrefix`, and `codeFlowValue`.
  codeIndented: 'codeIndented',

  // A text code (``` `alpha` ```).
  // Includes `codeTextSequence`, `codeTextData`, `lineEnding`, and can include
  // `codeTextPadding`.
  codeText: 'codeText',

  codeTextData: 'codeTextData',

  // A space or line ending right after or before a tick.
  codeTextPadding: 'codeTextPadding',

  // A text code fence (` `` `).
  codeTextSequence: 'codeTextSequence',

  // Whole content:
  //
  // ```markdown
  // [a]: b
  // c
  // =
  // d
  // ```
  //
  // Includes `paragraph` and `definition`.
  content: 'content',
  // Whole definition:
  //
  // ```markdown
  // [micromark]: https://github.com/micromark/micromark
  // ```
  //
  // Includes `definitionLabel`, `definitionMarker`, `whitespace`,
  // `definitionDestination`, and optionally `lineEnding` and `definitionTitle`.
  definition: 'definition',

  // Destination of a definition (`https://github.com/micromark/micromark` or
  // `<https://github.com/micromark/micromark>`).
  // Includes `definitionDestinationLiteral` or `definitionDestinationRaw`.
  definitionDestination: 'definitionDestination',

  // Enclosed destination of a definition
  // (`<https://github.com/micromark/micromark>`).
  // Includes `definitionDestinationLiteralMarker` and optionally
  // `definitionDestinationString`.
  definitionDestinationLiteral: 'definitionDestinationLiteral',

  // Markers of an enclosed definition destination (`<` or `>`).
  definitionDestinationLiteralMarker: 'definitionDestinationLiteralMarker',

  // Unenclosed destination of a definition
  // (`https://github.com/micromark/micromark`).
  // Includes `definitionDestinationString`.
  definitionDestinationRaw: 'definitionDestinationRaw',

  // Text in an destination (`https://github.com/micromark/micromark`).
  // Includes string.
  definitionDestinationString: 'definitionDestinationString',

  // Label of a definition (`[micromark]`).
  // Includes `definitionLabelMarker` and `definitionLabelString`.
  definitionLabel: 'definitionLabel',

  // Markers of a definition label (`[` or `]`).
  definitionLabelMarker: 'definitionLabelMarker',

  // Value of a definition label (`micromark`).
  // Includes string.
  definitionLabelString: 'definitionLabelString',

  // Marker between a label and a destination (`:`).
  definitionMarker: 'definitionMarker',

  // Title of a definition (`"x"`, `'y'`, or `(z)`).
  // Includes `definitionTitleMarker` and optionally `definitionTitleString`.
  definitionTitle: 'definitionTitle',

  // Marker around a title of a definition (`"`, `'`, `(`, or `)`).
  definitionTitleMarker: 'definitionTitleMarker',

  // Data without markers in a title (`z`).
  // Includes string.
  definitionTitleString: 'definitionTitleString',

  // Emphasis (`*alpha*`).
  // Includes `emphasisSequence` and `emphasisText`.
  emphasis: 'emphasis',

  // Sequence of emphasis markers (`*` or `_`).
  emphasisSequence: 'emphasisSequence',

  // Emphasis text (`alpha`).
  // Includes text.
  emphasisText: 'emphasisText',

  // The character escape marker (`\`).
  escapeMarker: 'escapeMarker',

  // A hard break created with a backslash (`\\n`).
  // Note: does not include the line ending.
  hardBreakEscape: 'hardBreakEscape',

  // A hard break created with trailing spaces (`  \n`).
  // Does not include the line ending.
  hardBreakTrailing: 'hardBreakTrailing',

  // Flow HTML:
  //
  // ```markdown
  // <div
  // ```
  //
  // Inlcudes `lineEnding`, `htmlFlowData`.
  htmlFlow: 'htmlFlow',

  htmlFlowData: 'htmlFlowData',

  // HTML in text (the tag in `a <i> b`).
  // Includes `lineEnding`, `htmlTextData`.
  htmlText: 'htmlText',

  htmlTextData: 'htmlTextData',

  // Whole image (`![alpha](bravo)`, `![alpha][bravo]`, `![alpha][]`, or
  // `![alpha]`).
  // Includes `label` and an optional `resource` or `reference`.
  image: 'image',

  // Whole link label (`[*alpha*]`).
  // Includes `labelLink` or `labelImage`, `labelText`, and `labelEnd`.
  label: 'label',

  // Text in an label (`*alpha*`).
  // Includes text.
  labelText: 'labelText',

  // Start a link label (`[`).
  // Includes a `labelMarker`.
  labelLink: 'labelLink',

  // Start an image label (`![`).
  // Includes `labelImageMarker` and `labelMarker`.
  labelImage: 'labelImage',

  // Marker of a label (`[` or `]`).
  labelMarker: 'labelMarker',

  // Marker to start an image (`!`).
  labelImageMarker: 'labelImageMarker',

  // End a label (`]`).
  // Includes `labelMarker`.
  labelEnd: 'labelEnd',

  // Whole link (`[alpha](bravo)`, `[alpha][bravo]`, `[alpha][]`, or `[alpha]`).
  // Includes `label` and an optional `resource` or `reference`.
  link: 'link',

  // Whole paragraph:
  //
  // ```markdown
  // alpha
  // bravo.
  // ```
  //
  // Includes text.
  paragraph: 'paragraph',

  // A reference (`[alpha]` or `[]`).
  // Includes `referenceMarker` and an optional `referenceString`.
  reference: 'reference',

  // A reference marker (`[` or `]`).
  referenceMarker: 'referenceMarker',

  // Reference text (`alpha`).
  // Includes string.
  referenceString: 'referenceString',

  // A resource (`(https://example.com "alpha")`).
  // Includes `resourceMarker`, an optional `resourceDestination` with an optional
  // `whitespace` and `resourceTitle`.
  resource: 'resource',

  // A resource destination (`https://example.com`).
  // Includes `resourceDestinationLiteral` or `resourceDestinationRaw`.
  resourceDestination: 'resourceDestination',

  // A literal resource destination (`<https://example.com>`).
  // Includes `resourceDestinationLiteralMarker` and optionally
  // `resourceDestinationString`.
  resourceDestinationLiteral: 'resourceDestinationLiteral',

  // A resource destination marker (`<` or `>`).
  resourceDestinationLiteralMarker: 'resourceDestinationLiteralMarker',

  // A raw resource destination (`https://example.com`).
  // Includes `resourceDestinationString`.
  resourceDestinationRaw: 'resourceDestinationRaw',

  // Resource destination text (`https://example.com`).
  // Includes string.
  resourceDestinationString: 'resourceDestinationString',

  // A resource marker (`(` or `)`).
  resourceMarker: 'resourceMarker',

  // A resource title (`"alpha"`, `'alpha'`, or `(alpha)`).
  // Includes `resourceTitleMarker` and optionally `resourceTitleString`.
  resourceTitle: 'resourceTitle',

  // A resource title marker (`"`, `'`, `(`, or `)`).
  resourceTitleMarker: 'resourceTitleMarker',

  // Resource destination title (`alpha`).
  // Includes string.
  resourceTitleString: 'resourceTitleString',

  // Whole setext heading:
  //
  // ```markdown
  // alpha
  // bravo
  // =====
  // ```
  //
  // Includes `setextHeadingText`, `lineEnding`, `linePrefix`, and
  // `setextHeadingLine`.
  setextHeading: 'setextHeading',

  // Content in a setext heading (`alpha\nbravo`).
  // Includes text.
  setextHeadingText: 'setextHeadingText',

  // Underline in a setext heading, including whitespace suffix (`==`).
  // Includes `setextHeadingLineSequence`.
  setextHeadingLine: 'setextHeadingLine',

  // Sequence of equals or dash characters in underline in a setext heading (`-`).
  setextHeadingLineSequence: 'setextHeadingLineSequence',

  // Strong (`**alpha**`).
  // Includes `strongSequence` and `strongText`.
  strong: 'strong',

  // Sequence of strong markers (`**` or `__`).
  strongSequence: 'strongSequence',

  // Strong text (`alpha`).
  // Includes text.
  strongText: 'strongText',

  // Whole thematic break:
  //
  // ```markdown
  // * * *
  // ```
  //
  // Includes `thematicBreakSequence` and `whitespace`.
  thematicBreak: 'thematicBreak',

  // A sequence of one or more thematic break markers (`***`).
  thematicBreakSequence: 'thematicBreakSequence',

  // Whole block quote:
  //
  // ```markdown
  // > a
  // >
  // > b
  // ```
  //
  // Includes `blockQuotePrefix` and flow.
  blockQuote: 'blockQuote',
  // The `>` or `> ` of a block quote.
  blockQuotePrefix: 'blockQuotePrefix',
  // The `>` of a block quote prefix.
  blockQuoteMarker: 'blockQuoteMarker',
  // The optional ` ` of a block quote prefix.
  blockQuotePrefixWhitespace: 'blockQuotePrefixWhitespace',

  // Whole unordered list:
  //
  // ```markdown
  // - a
  //   b
  // ```
  //
  // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
  // lines.
  listOrdered: 'listOrdered',

  // Whole ordered list:
  //
  // ```markdown
  // 1. a
  //    b
  // ```
  //
  // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
  // lines.
  listUnordered: 'listUnordered',

  // The indent of further list item lines.
  listItemIndent: 'listItemIndent',

  // A marker, as in, `*`, `+`, `-`, `.`, or `)`.
  listItemMarker: 'listItemMarker',

  // The thing that starts a list item, such as `1. `.
  // Includes `listItemValue` if ordered, `listItemMarker`, and
  // `listItemPrefixWhitespace` (unless followed by a line ending).
  listItemPrefix: 'listItemPrefix',

  // The whitespace after a marker.
  listItemPrefixWhitespace: 'listItemPrefixWhitespace',

  // The numerical value of an ordered item.
  listItemValue: 'listItemValue',

  // Internal types used for subtokenizers, compiled away
  chunkDocument: 'chunkDocument',
  chunkContent: 'chunkContent',
  chunkFlow: 'chunkFlow',
  chunkText: 'chunkText',
  chunkString: 'chunkString'
})


/***/ }),

/***/ "./node_modules/micromark-util-symbol/values.js":
/*!******************************************************!*\
  !*** ./node_modules/micromark-util-symbol/values.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   values: function() { return /* binding */ values; }
/* harmony export */ });
/**
 * This module is compiled away!
 *
 * While micromark works based on character codes, this module includes the
 * string versions of ’em.
 * The C0 block, except for LF, CR, HT, and w/ the replacement character added,
 * are available here.
 */
const values = /** @type {const} */ ({
  ht: '\t',
  lf: '\n',
  cr: '\r',
  space: ' ',
  exclamationMark: '!',
  quotationMark: '"',
  numberSign: '#',
  dollarSign: '$',
  percentSign: '%',
  ampersand: '&',
  apostrophe: "'",
  leftParenthesis: '(',
  rightParenthesis: ')',
  asterisk: '*',
  plusSign: '+',
  comma: ',',
  dash: '-',
  dot: '.',
  slash: '/',
  digit0: '0',
  digit1: '1',
  digit2: '2',
  digit3: '3',
  digit4: '4',
  digit5: '5',
  digit6: '6',
  digit7: '7',
  digit8: '8',
  digit9: '9',
  colon: ':',
  semicolon: ';',
  lessThan: '<',
  equalsTo: '=',
  greaterThan: '>',
  questionMark: '?',
  atSign: '@',
  uppercaseA: 'A',
  uppercaseB: 'B',
  uppercaseC: 'C',
  uppercaseD: 'D',
  uppercaseE: 'E',
  uppercaseF: 'F',
  uppercaseG: 'G',
  uppercaseH: 'H',
  uppercaseI: 'I',
  uppercaseJ: 'J',
  uppercaseK: 'K',
  uppercaseL: 'L',
  uppercaseM: 'M',
  uppercaseN: 'N',
  uppercaseO: 'O',
  uppercaseP: 'P',
  uppercaseQ: 'Q',
  uppercaseR: 'R',
  uppercaseS: 'S',
  uppercaseT: 'T',
  uppercaseU: 'U',
  uppercaseV: 'V',
  uppercaseW: 'W',
  uppercaseX: 'X',
  uppercaseY: 'Y',
  uppercaseZ: 'Z',
  leftSquareBracket: '[',
  backslash: '\\',
  rightSquareBracket: ']',
  caret: '^',
  underscore: '_',
  graveAccent: '`',
  lowercaseA: 'a',
  lowercaseB: 'b',
  lowercaseC: 'c',
  lowercaseD: 'd',
  lowercaseE: 'e',
  lowercaseF: 'f',
  lowercaseG: 'g',
  lowercaseH: 'h',
  lowercaseI: 'i',
  lowercaseJ: 'j',
  lowercaseK: 'k',
  lowercaseL: 'l',
  lowercaseM: 'm',
  lowercaseN: 'n',
  lowercaseO: 'o',
  lowercaseP: 'p',
  lowercaseQ: 'q',
  lowercaseR: 'r',
  lowercaseS: 's',
  lowercaseT: 't',
  lowercaseU: 'u',
  lowercaseV: 'v',
  lowercaseW: 'w',
  lowercaseX: 'x',
  lowercaseY: 'y',
  lowercaseZ: 'z',
  leftCurlyBrace: '{',
  verticalBar: '|',
  rightCurlyBrace: '}',
  tilde: '~',
  replacementCharacter: '�'
})


/***/ }),

/***/ "./node_modules/micromark/dev/lib/constructs.js":
/*!******************************************************!*\
  !*** ./node_modules/micromark/dev/lib/constructs.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attentionMarkers: function() { return /* binding */ attentionMarkers; },
/* harmony export */   contentInitial: function() { return /* binding */ contentInitial; },
/* harmony export */   disable: function() { return /* binding */ disable; },
/* harmony export */   document: function() { return /* binding */ document; },
/* harmony export */   flow: function() { return /* binding */ flow; },
/* harmony export */   flowInitial: function() { return /* binding */ flowInitial; },
/* harmony export */   insideSpan: function() { return /* binding */ insideSpan; },
/* harmony export */   string: function() { return /* binding */ string; },
/* harmony export */   text: function() { return /* binding */ text; }
/* harmony export */ });
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/list.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/block-quote.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/definition.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/code-indented.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/heading-atx.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/thematic-break.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/setext-underline.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/html-flow.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/code-fenced.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/character-reference.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/character-escape.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/line-ending.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/label-start-image.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/attention.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/autolink.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/html-text.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/label-start-link.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/hard-break-escape.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/label-end.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/code-text.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var _initialize_text_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./initialize/text.js */ "./node_modules/micromark/dev/lib/initialize/text.js");
/**
 * @typedef {import('micromark-util-types').Extension} Extension
 */





/** @satisfies {Extension['document']} */
const document = {
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.asterisk]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__.list,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.plusSign]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__.list,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.dash]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__.list,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.digit0]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__.list,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.digit1]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__.list,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.digit2]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__.list,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.digit3]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__.list,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.digit4]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__.list,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.digit5]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__.list,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.digit6]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__.list,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.digit7]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__.list,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.digit8]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__.list,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.digit9]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__.list,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.greaterThan]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_2__.blockQuote
}

/** @satisfies {Extension['contentInitial']} */
const contentInitial = {
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.leftSquareBracket]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_3__.definition
}

/** @satisfies {Extension['flowInitial']} */
const flowInitial = {
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.horizontalTab]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_4__.codeIndented,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.virtualSpace]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_4__.codeIndented,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.space]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_4__.codeIndented
}

/** @satisfies {Extension['flow']} */
const flow = {
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.numberSign]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_5__.headingAtx,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.asterisk]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_6__.thematicBreak,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.dash]: [micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_7__.setextUnderline, micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_6__.thematicBreak],
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.lessThan]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_8__.htmlFlow,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.equalsTo]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_7__.setextUnderline,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.underscore]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_6__.thematicBreak,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.graveAccent]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_9__.codeFenced,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.tilde]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_9__.codeFenced
}

/** @satisfies {Extension['string']} */
const string = {
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.ampersand]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_10__.characterReference,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.backslash]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_11__.characterEscape
}

/** @satisfies {Extension['text']} */
const text = {
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.carriageReturn]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_12__.lineEnding,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.lineFeed]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_12__.lineEnding,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.carriageReturnLineFeed]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_12__.lineEnding,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.exclamationMark]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_13__.labelStartImage,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.ampersand]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_10__.characterReference,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.asterisk]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_14__.attention,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.lessThan]: [micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_15__.autolink, micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_16__.htmlText],
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.leftSquareBracket]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_17__.labelStartLink,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.backslash]: [micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_18__.hardBreakEscape, micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_11__.characterEscape],
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.rightSquareBracket]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_19__.labelEnd,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.underscore]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_14__.attention,
  [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.graveAccent]: micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_20__.codeText
}

/** @satisfies {Extension['insideSpan']} */
const insideSpan = {null: [micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_14__.attention, _initialize_text_js__WEBPACK_IMPORTED_MODULE_21__.resolver]}

/** @satisfies {Extension['attentionMarkers']} */
const attentionMarkers = {null: [micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.asterisk, micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.underscore]}

/** @satisfies {Extension['disable']} */
const disable = {null: []}


/***/ }),

/***/ "./node_modules/micromark/dev/lib/create-tokenizer.js":
/*!************************************************************!*\
  !*** ./node_modules/micromark/dev/lib/create-tokenizer.js ***!
  \************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTokenizer: function() { return /* binding */ createTokenizer; }
/* harmony export */ });
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_chunked__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-chunked */ "./node_modules/micromark-util-chunked/dev/index.js");
/* harmony import */ var micromark_util_resolve_all__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-resolve-all */ "./node_modules/micromark-util-resolve-all/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_values_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! micromark-util-symbol/values.js */ "./node_modules/micromark-util-symbol/values.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Chunk} Chunk
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').ConstructRecord} ConstructRecord
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').ParseContext} ParseContext
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenType} TokenType
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */

/**
 * @callback Restore
 * @returns {void}
 *
 * @typedef Info
 * @property {Restore} restore
 * @property {number} from
 *
 * @callback ReturnHandle
 *   Handle a successful run.
 * @param {Construct} construct
 * @param {Info} info
 * @returns {void}
 */









const debug = debug__WEBPACK_IMPORTED_MODULE_0__('micromark')

/**
 * Create a tokenizer.
 * Tokenizers deal with one type of data (e.g., containers, flow, text).
 * The parser is the object dealing with it all.
 * `initialize` works like other constructs, except that only its `tokenize`
 * function is used, in which case it doesn’t receive an `ok` or `nok`.
 * `from` can be given to set the point before the first character, although
 * when further lines are indented, they must be set with `defineSkip`.
 *
 * @param {ParseContext} parser
 * @param {InitialConstruct} initialize
 * @param {Omit<Point, '_bufferIndex' | '_index'> | undefined} [from]
 * @returns {TokenizeContext}
 */
function createTokenizer(parser, initialize, from) {
  /** @type {Point} */
  let point = Object.assign(
    from ? Object.assign({}, from) : {line: 1, column: 1, offset: 0},
    {_index: 0, _bufferIndex: -1}
  )
  /** @type {Record<string, number>} */
  const columnStart = {}
  /** @type {Array<Construct>} */
  const resolveAllConstructs = []
  /** @type {Array<Chunk>} */
  let chunks = []
  /** @type {Array<Token>} */
  let stack = []
  /** @type {boolean | undefined} */
  let consumed = true

  /**
   * Tools used for tokenizing.
   *
   * @type {Effects}
   */
  const effects = {
    consume,
    enter,
    exit,
    attempt: constructFactory(onsuccessfulconstruct),
    check: constructFactory(onsuccessfulcheck),
    interrupt: constructFactory(onsuccessfulcheck, {interrupt: true})
  }

  /**
   * State and tools for resolving and serializing.
   *
   * @type {TokenizeContext}
   */
  const context = {
    previous: micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof,
    code: micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof,
    containerState: {},
    events: [],
    parser,
    sliceStream,
    sliceSerialize,
    now,
    defineSkip,
    write
  }

  /**
   * The state function.
   *
   * @type {State | void}
   */
  let state = initialize.tokenize.call(context, effects)

  /**
   * Track which character we expect to be consumed, to catch bugs.
   *
   * @type {Code}
   */
  let expectedCode

  if (initialize.resolveAll) {
    resolveAllConstructs.push(initialize)
  }

  return context

  /** @type {TokenizeContext['write']} */
  function write(slice) {
    chunks = (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_3__.push)(chunks, slice)

    main()

    // Exit if we’re not done, resolve might change stuff.
    if (chunks[chunks.length - 1] !== micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.eof) {
      return []
    }

    addResult(initialize, 0)

    // Otherwise, resolve, and exit.
    context.events = (0,micromark_util_resolve_all__WEBPACK_IMPORTED_MODULE_4__.resolveAll)(resolveAllConstructs, context.events, context)

    return context.events
  }

  //
  // Tools.
  //

  /** @type {TokenizeContext['sliceSerialize']} */
  function sliceSerialize(token, expandTabs) {
    return serializeChunks(sliceStream(token), expandTabs)
  }

  /** @type {TokenizeContext['sliceStream']} */
  function sliceStream(token) {
    return sliceChunks(chunks, token)
  }

  /** @type {TokenizeContext['now']} */
  function now() {
    // This is a hot path, so we clone manually instead of `Object.assign({}, point)`
    const {line, column, offset, _index, _bufferIndex} = point
    return {line, column, offset, _index, _bufferIndex}
  }

  /** @type {TokenizeContext['defineSkip']} */
  function defineSkip(value) {
    columnStart[value.line] = value.column
    accountForPotentialSkip()
    debug('position: define skip: `%j`', point)
  }

  //
  // State management.
  //

  /**
   * Main loop (note that `_index` and `_bufferIndex` in `point` are modified by
   * `consume`).
   * Here is where we walk through the chunks, which either include strings of
   * several characters, or numerical character codes.
   * The reason to do this in a loop instead of a call is so the stack can
   * drain.
   *
   * @returns {void}
   */
  function main() {
    /** @type {number} */
    let chunkIndex

    while (point._index < chunks.length) {
      const chunk = chunks[point._index]

      // If we’re in a buffer chunk, loop through it.
      if (typeof chunk === 'string') {
        chunkIndex = point._index

        if (point._bufferIndex < 0) {
          point._bufferIndex = 0
        }

        while (
          point._index === chunkIndex &&
          point._bufferIndex < chunk.length
        ) {
          go(chunk.charCodeAt(point._bufferIndex))
        }
      } else {
        go(chunk)
      }
    }
  }

  /**
   * Deal with one code.
   *
   * @param {Code} code
   * @returns {void}
   */
  function go(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(consumed === true, 'expected character to be consumed')
    consumed = undefined
    debug('main: passing `%s` to %s', code, state && state.name)
    expectedCode = code
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(typeof state === 'function', 'expected state')
    state = state(code)
  }

  /** @type {Effects['consume']} */
  function consume(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(code === expectedCode, 'expected given code to equal expected code')

    debug('consume: `%s`', code)

    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(
      consumed === undefined,
      'expected code to not have been consumed: this might be because `return x(code)` instead of `return x` was used'
    )
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(
      code === null
        ? context.events.length === 0 ||
            context.events[context.events.length - 1][0] === 'exit'
        : context.events[context.events.length - 1][0] === 'enter',
      'expected last token to be open'
    )

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_5__.markdownLineEnding)(code)) {
      point.line++
      point.column = 1
      point.offset += code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.carriageReturnLineFeed ? 2 : 1
      accountForPotentialSkip()
      debug('position: after eol: `%j`', point)
    } else if (code !== micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.virtualSpace) {
      point.column++
      point.offset++
    }

    // Not in a string chunk.
    if (point._bufferIndex < 0) {
      point._index++
    } else {
      point._bufferIndex++

      // At end of string chunk.
      // @ts-expect-error Points w/ non-negative `_bufferIndex` reference
      // strings.
      if (point._bufferIndex === chunks[point._index].length) {
        point._bufferIndex = -1
        point._index++
      }
    }

    // Expose the previous character.
    context.previous = code

    // Mark as consumed.
    consumed = true
  }

  /** @type {Effects['enter']} */
  function enter(type, fields) {
    /** @type {Token} */
    // @ts-expect-error Patch instead of assign required fields to help GC.
    const token = fields || {}
    token.type = type
    token.start = now()

    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(typeof type === 'string', 'expected string type')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(type.length > 0, 'expected non-empty string')
    debug('enter: `%s`', type)

    context.events.push(['enter', token, context])

    stack.push(token)

    return token
  }

  /** @type {Effects['exit']} */
  function exit(type) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(typeof type === 'string', 'expected string type')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(type.length > 0, 'expected non-empty string')

    const token = stack.pop()
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(token, 'cannot close w/o open tokens')
    token.end = now()

    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(type === token.type, 'expected exit token to match current token')

    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(
      !(
        token.start._index === token.end._index &&
        token.start._bufferIndex === token.end._bufferIndex
      ),
      'expected non-empty token (`' + type + '`)'
    )

    debug('exit: `%s`', token.type)
    context.events.push(['exit', token, context])

    return token
  }

  /**
   * Use results.
   *
   * @type {ReturnHandle}
   */
  function onsuccessfulconstruct(construct, info) {
    addResult(construct, info.from)
  }

  /**
   * Discard results.
   *
   * @type {ReturnHandle}
   */
  function onsuccessfulcheck(_, info) {
    info.restore()
  }

  /**
   * Factory to attempt/check/interrupt.
   *
   * @param {ReturnHandle} onreturn
   * @param {{interrupt?: boolean | undefined} | undefined} [fields]
   */
  function constructFactory(onreturn, fields) {
    return hook

    /**
     * Handle either an object mapping codes to constructs, a list of
     * constructs, or a single construct.
     *
     * @param {Array<Construct> | Construct | ConstructRecord} constructs
     * @param {State} returnState
     * @param {State | undefined} [bogusState]
     * @returns {State}
     */
    function hook(constructs, returnState, bogusState) {
      /** @type {Array<Construct>} */
      let listOfConstructs
      /** @type {number} */
      let constructIndex
      /** @type {Construct} */
      let currentConstruct
      /** @type {Info} */
      let info

      return Array.isArray(constructs)
        ? /* c8 ignore next 1 */
          handleListOfConstructs(constructs)
        : 'tokenize' in constructs
        ? // @ts-expect-error Looks like a construct.
          handleListOfConstructs([constructs])
        : handleMapOfConstructs(constructs)

      /**
       * Handle a list of construct.
       *
       * @param {ConstructRecord} map
       * @returns {State}
       */
      function handleMapOfConstructs(map) {
        return start

        /** @type {State} */
        function start(code) {
          const def = code !== null && map[code]
          const all = code !== null && map.null
          const list = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...(Array.isArray(def) ? def : def ? [def] : []),
            ...(Array.isArray(all) ? all : all ? [all] : [])
          ]

          return handleListOfConstructs(list)(code)
        }
      }

      /**
       * Handle a list of construct.
       *
       * @param {Array<Construct>} list
       * @returns {State}
       */
      function handleListOfConstructs(list) {
        listOfConstructs = list
        constructIndex = 0

        if (list.length === 0) {
          (0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(bogusState, 'expected `bogusState` to be given')
          return bogusState
        }

        return handleConstruct(list[constructIndex])
      }

      /**
       * Handle a single construct.
       *
       * @param {Construct} construct
       * @returns {State}
       */
      function handleConstruct(construct) {
        return start

        /** @type {State} */
        function start(code) {
          // To do: not needed to store if there is no bogus state, probably?
          // Currently doesn’t work because `inspect` in document does a check
          // w/o a bogus, which doesn’t make sense. But it does seem to help perf
          // by not storing.
          info = store()
          currentConstruct = construct

          if (!construct.partial) {
            context.currentConstruct = construct
          }

          // Always populated by defaults.
          (0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(
            context.parser.constructs.disable.null,
            'expected `disable.null` to be populated'
          )

          if (
            construct.name &&
            context.parser.constructs.disable.null.includes(construct.name)
          ) {
            return nok(code)
          }

          return construct.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            fields ? Object.assign(Object.create(context), fields) : context,
            effects,
            ok,
            nok
          )(code)
        }
      }

      /** @type {State} */
      function ok(code) {
        (0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(code === expectedCode, 'expected code')
        consumed = true
        onreturn(currentConstruct, info)
        return returnState
      }

      /** @type {State} */
      function nok(code) {
        (0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(code === expectedCode, 'expected code')
        consumed = true
        info.restore()

        if (++constructIndex < listOfConstructs.length) {
          return handleConstruct(listOfConstructs[constructIndex])
        }

        return bogusState
      }
    }
  }

  /**
   * @param {Construct} construct
   * @param {number} from
   * @returns {void}
   */
  function addResult(construct, from) {
    if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
      resolveAllConstructs.push(construct)
    }

    if (construct.resolve) {
      (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_3__.splice)(
        context.events,
        from,
        context.events.length - from,
        construct.resolve(context.events.slice(from), context)
      )
    }

    if (construct.resolveTo) {
      context.events = construct.resolveTo(context.events, context)
    }

    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(
      construct.partial ||
        context.events.length === 0 ||
        context.events[context.events.length - 1][0] === 'exit',
      'expected last token to end'
    )
  }

  /**
   * Store state.
   *
   * @returns {Info}
   */
  function store() {
    const startPoint = now()
    const startPrevious = context.previous
    const startCurrentConstruct = context.currentConstruct
    const startEventsIndex = context.events.length
    const startStack = Array.from(stack)

    return {restore, from: startEventsIndex}

    /**
     * Restore state.
     *
     * @returns {void}
     */
    function restore() {
      point = startPoint
      context.previous = startPrevious
      context.currentConstruct = startCurrentConstruct
      context.events.length = startEventsIndex
      stack = startStack
      accountForPotentialSkip()
      debug('position: restore: `%j`', point)
    }
  }

  /**
   * Move the current point a bit forward in the line when it’s on a column
   * skip.
   *
   * @returns {void}
   */
  function accountForPotentialSkip() {
    if (point.line in columnStart && point.column < 2) {
      point.column = columnStart[point.line]
      point.offset += columnStart[point.line] - 1
    }
  }
}

/**
 * Get the chunks from a slice of chunks in the range of a token.
 *
 * @param {Array<Chunk>} chunks
 * @param {Pick<Token, 'end' | 'start'>} token
 * @returns {Array<Chunk>}
 */
function sliceChunks(chunks, token) {
  const startIndex = token.start._index
  const startBufferIndex = token.start._bufferIndex
  const endIndex = token.end._index
  const endBufferIndex = token.end._bufferIndex
  /** @type {Array<Chunk>} */
  let view

  if (startIndex === endIndex) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(endBufferIndex > -1, 'expected non-negative end buffer index')
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(startBufferIndex > -1, 'expected non-negative start buffer index')
    // @ts-expect-error `_bufferIndex` is used on string chunks.
    view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)]
  } else {
    view = chunks.slice(startIndex, endIndex)

    if (startBufferIndex > -1) {
      const head = view[0]
      if (typeof head === 'string') {
        view[0] = head.slice(startBufferIndex)
      } else {
        (0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(startBufferIndex === 0, 'expected `startBufferIndex` to be `0`')
        view.shift()
      }
    }

    if (endBufferIndex > 0) {
      // @ts-expect-error `_bufferIndex` is used on string chunks.
      view.push(chunks[endIndex].slice(0, endBufferIndex))
    }
  }

  return view
}

/**
 * Get the string value of a slice of chunks.
 *
 * @param {Array<Chunk>} chunks
 * @param {boolean | undefined} [expandTabs=false]
 * @returns {string}
 */
function serializeChunks(chunks, expandTabs) {
  let index = -1
  /** @type {Array<string>} */
  const result = []
  /** @type {boolean | undefined} */
  let atTab

  while (++index < chunks.length) {
    const chunk = chunks[index]
    /** @type {string} */
    let value

    if (typeof chunk === 'string') {
      value = chunk
    } else
      switch (chunk) {
        case micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.carriageReturn: {
          value = micromark_util_symbol_values_js__WEBPACK_IMPORTED_MODULE_6__.values.cr

          break
        }

        case micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.lineFeed: {
          value = micromark_util_symbol_values_js__WEBPACK_IMPORTED_MODULE_6__.values.lf

          break
        }

        case micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.carriageReturnLineFeed: {
          value = micromark_util_symbol_values_js__WEBPACK_IMPORTED_MODULE_6__.values.cr + micromark_util_symbol_values_js__WEBPACK_IMPORTED_MODULE_6__.values.lf

          break
        }

        case micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.horizontalTab: {
          value = expandTabs ? micromark_util_symbol_values_js__WEBPACK_IMPORTED_MODULE_6__.values.space : micromark_util_symbol_values_js__WEBPACK_IMPORTED_MODULE_6__.values.ht

          break
        }

        case micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.virtualSpace: {
          if (!expandTabs && atTab) continue
          value = micromark_util_symbol_values_js__WEBPACK_IMPORTED_MODULE_6__.values.space

          break
        }

        default: {
          (0,uvu_assert__WEBPACK_IMPORTED_MODULE_1__.ok)(typeof chunk === 'number', 'expected number')
          // Currently only replacement character.
          value = String.fromCharCode(chunk)
        }
      }

    atTab = chunk === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_2__.codes.horizontalTab
    result.push(value)
  }

  return result.join('')
}


/***/ }),

/***/ "./node_modules/micromark/dev/lib/initialize/content.js":
/*!**************************************************************!*\
  !*** ./node_modules/micromark/dev/lib/initialize/content.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   content: function() { return /* binding */ content; }
/* harmony export */ });
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */








/** @type {InitialConstruct} */
const content = {tokenize: initializeContent}

/**
 * @this {TokenizeContext}
 * @type {Initializer}
 */
function initializeContent(effects) {
  const contentStart = effects.attempt(
    this.parser.constructs.contentInitial,
    afterContentStartConstruct,
    paragraphInitial
  )
  /** @type {Token} */
  let previous

  return contentStart

  /** @type {State} */
  function afterContentStartConstruct(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_2__.markdownLineEnding)(code),
      'expected eol or eof'
    )

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof) {
      effects.consume(code)
      return
    }

    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.lineEnding)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.lineEnding)
    return (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_4__.factorySpace)(effects, contentStart, micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.linePrefix)
  }

  /** @type {State} */
  function paragraphInitial(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      code !== micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof && !(0,micromark_util_character__WEBPACK_IMPORTED_MODULE_2__.markdownLineEnding)(code),
      'expected anything other than a line ending or EOF'
    )
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.paragraph)
    return lineStart(code)
  }

  /** @type {State} */
  function lineStart(code) {
    const token = effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.chunkText, {
      contentType: micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_5__.constants.contentTypeText,
      previous
    })

    if (previous) {
      previous.next = token
    }

    previous = token

    return data(code)
  }

  /** @type {State} */
  function data(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof) {
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.chunkText)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.paragraph)
      effects.consume(code)
      return
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_2__.markdownLineEnding)(code)) {
      effects.consume(code)
      effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_3__.types.chunkText)
      return lineStart
    }

    // Data.
    effects.consume(code)
    return data
  }
}


/***/ }),

/***/ "./node_modules/micromark/dev/lib/initialize/document.js":
/*!***************************************************************!*\
  !*** ./node_modules/micromark/dev/lib/initialize/document.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   document: function() { return /* binding */ document; }
/* harmony export */ });
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-chunked */ "./node_modules/micromark-util-chunked/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').ContainerState} ContainerState
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/**
 * @typedef {[Construct, ContainerState]} StackItem
 */









/** @type {InitialConstruct} */
const document = {tokenize: initializeDocument}

/** @type {Construct} */
const containerConstruct = {tokenize: tokenizeContainer}

/**
 * @this {TokenizeContext}
 * @type {Initializer}
 */
function initializeDocument(effects) {
  const self = this
  /** @type {Array<StackItem>} */
  const stack = []
  let continued = 0
  /** @type {TokenizeContext | undefined} */
  let childFlow
  /** @type {Token | undefined} */
  let childToken
  /** @type {number} */
  let lineStartOffset

  return start

  /** @type {State} */
  function start(code) {
    // First we iterate through the open blocks, starting with the root
    // document, and descending through last children down to the last open
    // block.
    // Each block imposes a condition that the line must satisfy if the block is
    // to remain open.
    // For example, a block quote requires a `>` character.
    // A paragraph requires a non-blank line.
    // In this phase we may match all or just some of the open blocks.
    // But we cannot close unmatched blocks yet, because we may have a lazy
    // continuation line.
    if (continued < stack.length) {
      const item = stack[continued]
      self.containerState = item[1]
      ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
        item[0].continuation,
        'expected `continuation` to be defined on container construct'
      )
      return effects.attempt(
        item[0].continuation,
        documentContinue,
        checkNewContainers
      )(code)
    }

    // Done.
    return checkNewContainers(code)
  }

  /** @type {State} */
  function documentContinue(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      self.containerState,
      'expected `containerState` to be defined after continuation'
    )

    continued++

    // Note: this field is called `_closeFlow` but it also closes containers.
    // Perhaps a good idea to rename it but it’s already used in the wild by
    // extensions.
    if (self.containerState._closeFlow) {
      self.containerState._closeFlow = undefined

      if (childFlow) {
        closeFlow()
      }

      // Note: this algorithm for moving events around is similar to the
      // algorithm when dealing with lazy lines in `writeToChild`.
      const indexBeforeExits = self.events.length
      let indexBeforeFlow = indexBeforeExits
      /** @type {Point | undefined} */
      let point

      // Find the flow chunk.
      while (indexBeforeFlow--) {
        if (
          self.events[indexBeforeFlow][0] === 'exit' &&
          self.events[indexBeforeFlow][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.chunkFlow
        ) {
          point = self.events[indexBeforeFlow][1].end
          break
        }
      }

      (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(point, 'could not find previous flow chunk')

      exitContainers(continued)

      // Fix positions.
      let index = indexBeforeExits

      while (index < self.events.length) {
        self.events[index][1].end = Object.assign({}, point)
        index++
      }

      // Inject the exits earlier (they’re still also at the end).
      (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.splice)(
        self.events,
        indexBeforeFlow + 1,
        0,
        self.events.slice(indexBeforeExits)
      )

      // Discard the duplicate exits.
      self.events.length = index

      return checkNewContainers(code)
    }

    return start(code)
  }

  /** @type {State} */
  function checkNewContainers(code) {
    // Next, after consuming the continuation markers for existing blocks, we
    // look for new block starts (e.g. `>` for a block quote).
    // If we encounter a new block start, we close any blocks unmatched in
    // step 1 before creating the new block as a child of the last matched
    // block.
    if (continued === stack.length) {
      // No need to `check` whether there’s a container, of `exitContainers`
      // would be moot.
      // We can instead immediately `attempt` to parse one.
      if (!childFlow) {
        return documentContinued(code)
      }

      // If we have concrete content, such as block HTML or fenced code,
      // we can’t have containers “pierce” into them, so we can immediately
      // start.
      if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
        return flowStart(code)
      }

      // If we do have flow, it could still be a blank line,
      // but we’d be interrupting it w/ a new container if there’s a current
      // construct.
      // To do: next major: remove `_gfmTableDynamicInterruptHack` (no longer
      // needed in micromark-extension-gfm-table@1.0.6).
      self.interrupt = Boolean(
        childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack
      )
    }

    // Check if there is a new container.
    self.containerState = {}
    return effects.check(
      containerConstruct,
      thereIsANewContainer,
      thereIsNoNewContainer
    )(code)
  }

  /** @type {State} */
  function thereIsANewContainer(code) {
    if (childFlow) closeFlow()
    exitContainers(continued)
    return documentContinued(code)
  }

  /** @type {State} */
  function thereIsNoNewContainer(code) {
    self.parser.lazy[self.now().line] = continued !== stack.length
    lineStartOffset = self.now().offset
    return flowStart(code)
  }

  /** @type {State} */
  function documentContinued(code) {
    // Try new containers.
    self.containerState = {}
    return effects.attempt(
      containerConstruct,
      containerContinue,
      flowStart
    )(code)
  }

  /** @type {State} */
  function containerContinue(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      self.currentConstruct,
      'expected `currentConstruct` to be defined on tokenizer'
    )
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      self.containerState,
      'expected `containerState` to be defined on tokenizer'
    )
    continued++
    stack.push([self.currentConstruct, self.containerState])
    // Try another.
    return documentContinued(code)
  }

  /** @type {State} */
  function flowStart(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_3__.codes.eof) {
      if (childFlow) closeFlow()
      exitContainers(0)
      effects.consume(code)
      return
    }

    childFlow = childFlow || self.parser.flow(self.now())
    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.chunkFlow, {
      contentType: micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__.constants.contentTypeFlow,
      previous: childToken,
      _tokenizer: childFlow
    })

    return flowContinue(code)
  }

  /** @type {State} */
  function flowContinue(code) {
    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_3__.codes.eof) {
      writeToChild(effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.chunkFlow), true)
      exitContainers(0)
      effects.consume(code)
      return
    }

    if ((0,micromark_util_character__WEBPACK_IMPORTED_MODULE_5__.markdownLineEnding)(code)) {
      effects.consume(code)
      writeToChild(effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.chunkFlow))
      // Get ready for the next line.
      continued = 0
      self.interrupt = undefined
      return start
    }

    effects.consume(code)
    return flowContinue
  }

  /**
   * @param {Token} token
   * @param {boolean | undefined} [eof]
   * @returns {void}
   */
  function writeToChild(token, eof) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(childFlow, 'expected `childFlow` to be defined when continuing')
    const stream = self.sliceStream(token)
    if (eof) stream.push(null)
    token.previous = childToken
    if (childToken) childToken.next = token
    childToken = token
    childFlow.defineSkip(token.start)
    childFlow.write(stream)

    // Alright, so we just added a lazy line:
    //
    // ```markdown
    // > a
    // b.
    //
    // Or:
    //
    // > ~~~c
    // d
    //
    // Or:
    //
    // > | e |
    // f
    // ```
    //
    // The construct in the second example (fenced code) does not accept lazy
    // lines, so it marked itself as done at the end of its first line, and
    // then the content construct parses `d`.
    // Most constructs in markdown match on the first line: if the first line
    // forms a construct, a non-lazy line can’t “unmake” it.
    //
    // The construct in the third example is potentially a GFM table, and
    // those are *weird*.
    // It *could* be a table, from the first line, if the following line
    // matches a condition.
    // In this case, that second line is lazy, which “unmakes” the first line
    // and turns the whole into one content block.
    //
    // We’ve now parsed the non-lazy and the lazy line, and can figure out
    // whether the lazy line started a new flow block.
    // If it did, we exit the current containers between the two flow blocks.
    if (self.parser.lazy[token.start.line]) {
      let index = childFlow.events.length

      while (index--) {
        if (
          // The token starts before the line ending…
          childFlow.events[index][1].start.offset < lineStartOffset &&
          // …and either is not ended yet…
          (!childFlow.events[index][1].end ||
            // …or ends after it.
            childFlow.events[index][1].end.offset > lineStartOffset)
        ) {
          // Exit: there’s still something open, which means it’s a lazy line
          // part of something.
          return
        }
      }

      // Note: this algorithm for moving events around is similar to the
      // algorithm when closing flow in `documentContinue`.
      const indexBeforeExits = self.events.length
      let indexBeforeFlow = indexBeforeExits
      /** @type {boolean | undefined} */
      let seen
      /** @type {Point | undefined} */
      let point

      // Find the previous chunk (the one before the lazy line).
      while (indexBeforeFlow--) {
        if (
          self.events[indexBeforeFlow][0] === 'exit' &&
          self.events[indexBeforeFlow][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.chunkFlow
        ) {
          if (seen) {
            point = self.events[indexBeforeFlow][1].end
            break
          }

          seen = true
        }
      }

      (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(point, 'could not find previous flow chunk')

      exitContainers(continued)

      // Fix positions.
      index = indexBeforeExits

      while (index < self.events.length) {
        self.events[index][1].end = Object.assign({}, point)
        index++
      }

      // Inject the exits earlier (they’re still also at the end).
      (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_2__.splice)(
        self.events,
        indexBeforeFlow + 1,
        0,
        self.events.slice(indexBeforeExits)
      )

      // Discard the duplicate exits.
      self.events.length = index
    }
  }

  /**
   * @param {number} size
   * @returns {void}
   */
  function exitContainers(size) {
    let index = stack.length

    // Exit open containers.
    while (index-- > size) {
      const entry = stack[index]
      self.containerState = entry[1]
      ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
        entry[0].exit,
        'expected `exit` to be defined on container construct'
      )
      entry[0].exit.call(self, effects)
    }

    stack.length = size
  }

  function closeFlow() {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      self.containerState,
      'expected `containerState` to be defined when closing flow'
    )
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(childFlow, 'expected `childFlow` to be defined when closing it')
    childFlow.write([micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_3__.codes.eof])
    childToken = undefined
    childFlow = undefined
    self.containerState._closeFlow = undefined
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeContainer(effects, ok, nok) {
  // Always populated by defaults.
  (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
    this.parser.constructs.disable.null,
    'expected `disable.null` to be populated'
  )
  return (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_6__.factorySpace)(
    effects,
    effects.attempt(this.parser.constructs.document, ok, nok),
    micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_1__.types.linePrefix,
    this.parser.constructs.disable.null.includes('codeIndented')
      ? undefined
      : micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_4__.constants.tabSize
  )
}


/***/ }),

/***/ "./node_modules/micromark/dev/lib/initialize/flow.js":
/*!***********************************************************!*\
  !*** ./node_modules/micromark/dev/lib/initialize/flow.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   flow: function() { return /* binding */ flow; }
/* harmony export */ });
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/blank-line.js");
/* harmony import */ var micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-core-commonmark */ "./node_modules/micromark-core-commonmark/dev/lib/content.js");
/* harmony import */ var micromark_factory_space__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-factory-space */ "./node_modules/micromark-factory-space/dev/index.js");
/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! micromark-util-character */ "./node_modules/micromark-util-character/dev/index.js");
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */








/** @type {InitialConstruct} */
const flow = {tokenize: initializeFlow}

/**
 * @this {TokenizeContext}
 * @type {Initializer}
 */
function initializeFlow(effects) {
  const self = this
  const initial = effects.attempt(
    // Try to parse a blank line.
    micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_1__.blankLine,
    atBlankEnding,
    // Try to parse initial flow (essentially, only code).
    effects.attempt(
      this.parser.constructs.flowInitial,
      afterConstruct,
      (0,micromark_factory_space__WEBPACK_IMPORTED_MODULE_2__.factorySpace)(
        effects,
        effects.attempt(
          this.parser.constructs.flow,
          afterConstruct,
          effects.attempt(micromark_core_commonmark__WEBPACK_IMPORTED_MODULE_3__.content, afterConstruct)
        ),
        micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.linePrefix
      )
    )
  )

  return initial

  /** @type {State} */
  function atBlankEnding(code) {
    ;(0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_5__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_6__.markdownLineEnding)(code),
      'expected eol or eof'
    )

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_5__.codes.eof) {
      effects.consume(code)
      return
    }

    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.lineEndingBlank)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.lineEndingBlank)
    self.currentConstruct = undefined
    return initial
  }

  /** @type {State} */
  function afterConstruct(code) {
    (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(
      code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_5__.codes.eof || (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_6__.markdownLineEnding)(code),
      'expected eol or eof'
    )

    if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_5__.codes.eof) {
      effects.consume(code)
      return
    }

    effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.lineEnding)
    effects.consume(code)
    effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_4__.types.lineEnding)
    self.currentConstruct = undefined
    return initial
  }
}


/***/ }),

/***/ "./node_modules/micromark/dev/lib/initialize/text.js":
/*!***********************************************************!*\
  !*** ./node_modules/micromark/dev/lib/initialize/text.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   resolver: function() { return /* binding */ resolver; },
/* harmony export */   string: function() { return /* binding */ string; },
/* harmony export */   text: function() { return /* binding */ text; }
/* harmony export */ });
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/* harmony import */ var micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol/types.js */ "./node_modules/micromark-util-symbol/types.js");
/* harmony import */ var uvu_assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uvu/assert */ "./node_modules/uvu/assert/index.mjs");
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */






const resolver = {resolveAll: createResolver()}
const string = initializeFactory('string')
const text = initializeFactory('text')

/**
 * @param {'string' | 'text'} field
 * @returns {InitialConstruct}
 */
function initializeFactory(field) {
  return {
    tokenize: initializeText,
    resolveAll: createResolver(
      field === 'text' ? resolveAllLineSuffixes : undefined
    )
  }

  /**
   * @this {TokenizeContext}
   * @type {Initializer}
   */
  function initializeText(effects) {
    const self = this
    const constructs = this.parser.constructs[field]
    const text = effects.attempt(constructs, start, notText)

    return start

    /** @type {State} */
    function start(code) {
      return atBreak(code) ? text(code) : notText(code)
    }

    /** @type {State} */
    function notText(code) {
      if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof) {
        effects.consume(code)
        return
      }

      effects.enter(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.data)
      effects.consume(code)
      return data
    }

    /** @type {State} */
    function data(code) {
      if (atBreak(code)) {
        effects.exit(micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.data)
        return text(code)
      }

      // Data.
      effects.consume(code)
      return data
    }

    /**
     * @param {Code} code
     * @returns {boolean}
     */
    function atBreak(code) {
      if (code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.eof) {
        return true
      }

      const list = constructs[code]
      let index = -1

      if (list) {
        // Always populated by defaults.
        (0,uvu_assert__WEBPACK_IMPORTED_MODULE_0__.ok)(Array.isArray(list), 'expected `disable.null` to be populated')

        while (++index < list.length) {
          const item = list[index]
          if (!item.previous || item.previous.call(self, self.previous)) {
            return true
          }
        }
      }

      return false
    }
  }
}

/**
 * @param {Resolver | undefined} [extraResolver]
 * @returns {Resolver}
 */
function createResolver(extraResolver) {
  return resolveAllText

  /** @type {Resolver} */
  function resolveAllText(events, context) {
    let index = -1
    /** @type {number | undefined} */
    let enter

    // A rather boring computation (to merge adjacent `data` events) which
    // improves mm performance by 29%.
    while (++index <= events.length) {
      if (enter === undefined) {
        if (events[index] && events[index][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.data) {
          enter = index
          index++
        }
      } else if (!events[index] || events[index][1].type !== micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.data) {
        // Don’t do anything if there is one data token.
        if (index !== enter + 2) {
          events[enter][1].end = events[index - 1][1].end
          events.splice(enter + 2, index - enter - 2)
          index = enter + 2
        }

        enter = undefined
      }
    }

    return extraResolver ? extraResolver(events, context) : events
  }
}

/**
 * A rather ugly set of instructions which again looks at chunks in the input
 * stream.
 * The reason to do this here is that it is *much* faster to parse in reverse.
 * And that we can’t hook into `null` to split the line suffix before an EOF.
 * To do: figure out if we can make this into a clean utility, or even in core.
 * As it will be useful for GFMs literal autolink extension (and maybe even
 * tables?)
 *
 * @type {Resolver}
 */
function resolveAllLineSuffixes(events, context) {
  let eventIndex = 0 // Skip first.

  while (++eventIndex <= events.length) {
    if (
      (eventIndex === events.length ||
        events[eventIndex][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineEnding) &&
      events[eventIndex - 1][1].type === micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.data
    ) {
      const data = events[eventIndex - 1][1]
      const chunks = context.sliceStream(data)
      let index = chunks.length
      let bufferIndex = -1
      let size = 0
      /** @type {boolean | undefined} */
      let tabs

      while (index--) {
        const chunk = chunks[index]

        if (typeof chunk === 'string') {
          bufferIndex = chunk.length

          while (chunk.charCodeAt(bufferIndex - 1) === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.space) {
            size++
            bufferIndex--
          }

          if (bufferIndex) break
          bufferIndex = -1
        }
        // Number
        else if (chunk === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.horizontalTab) {
          tabs = true
          size++
        } else if (chunk === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_1__.codes.virtualSpace) {
          // Empty
        } else {
          // Replacement character, exit.
          index++
          break
        }
      }

      if (size) {
        const token = {
          type:
            eventIndex === events.length ||
            tabs ||
            size < micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_3__.constants.hardBreakPrefixSizeMin
              ? micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.lineSuffix
              : micromark_util_symbol_types_js__WEBPACK_IMPORTED_MODULE_2__.types.hardBreakTrailing,
          start: {
            line: data.end.line,
            column: data.end.column - size,
            offset: data.end.offset - size,
            _index: data.start._index + index,
            _bufferIndex: index
              ? bufferIndex
              : data.start._bufferIndex + bufferIndex
          },
          end: Object.assign({}, data.end)
        }

        data.end = Object.assign({}, token.start)

        if (data.start.offset === data.end.offset) {
          Object.assign(data, token)
        } else {
          events.splice(
            eventIndex,
            0,
            ['enter', token, context],
            ['exit', token, context]
          )
          eventIndex += 2
        }
      }

      eventIndex++
    }
  }

  return events
}


/***/ }),

/***/ "./node_modules/micromark/dev/lib/parse.js":
/*!*************************************************!*\
  !*** ./node_modules/micromark/dev/lib/parse.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parse: function() { return /* binding */ parse; }
/* harmony export */ });
/* harmony import */ var micromark_util_combine_extensions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-combine-extensions */ "./node_modules/micromark-util-combine-extensions/index.js");
/* harmony import */ var _initialize_content_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./initialize/content.js */ "./node_modules/micromark/dev/lib/initialize/content.js");
/* harmony import */ var _initialize_document_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./initialize/document.js */ "./node_modules/micromark/dev/lib/initialize/document.js");
/* harmony import */ var _initialize_flow_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./initialize/flow.js */ "./node_modules/micromark/dev/lib/initialize/flow.js");
/* harmony import */ var _initialize_text_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./initialize/text.js */ "./node_modules/micromark/dev/lib/initialize/text.js");
/* harmony import */ var _create_tokenizer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./create-tokenizer.js */ "./node_modules/micromark/dev/lib/create-tokenizer.js");
/* harmony import */ var _constructs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constructs.js */ "./node_modules/micromark/dev/lib/constructs.js");
/**
 * @typedef {import('micromark-util-types').Create} Create
 * @typedef {import('micromark-util-types').FullNormalizedExtension} FullNormalizedExtension
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').ParseContext} ParseContext
 * @typedef {import('micromark-util-types').ParseOptions} ParseOptions
 */









/**
 * @param {ParseOptions | null | undefined} [options]
 * @returns {ParseContext}
 */
function parse(options) {
  const settings = options || {}
  const constructs = /** @type {FullNormalizedExtension} */ (
    (0,micromark_util_combine_extensions__WEBPACK_IMPORTED_MODULE_0__.combineExtensions)([_constructs_js__WEBPACK_IMPORTED_MODULE_1__, ...(settings.extensions || [])])
  )

  /** @type {ParseContext} */
  const parser = {
    defined: [],
    lazy: {},
    constructs,
    content: create(_initialize_content_js__WEBPACK_IMPORTED_MODULE_2__.content),
    document: create(_initialize_document_js__WEBPACK_IMPORTED_MODULE_3__.document),
    flow: create(_initialize_flow_js__WEBPACK_IMPORTED_MODULE_4__.flow),
    string: create(_initialize_text_js__WEBPACK_IMPORTED_MODULE_5__.string),
    text: create(_initialize_text_js__WEBPACK_IMPORTED_MODULE_5__.text)
  }

  return parser

  /**
   * @param {InitialConstruct} initial
   */
  function create(initial) {
    return creator
    /** @type {Create} */
    function creator(from) {
      return (0,_create_tokenizer_js__WEBPACK_IMPORTED_MODULE_6__.createTokenizer)(parser, initial, from)
    }
  }
}


/***/ }),

/***/ "./node_modules/micromark/dev/lib/postprocess.js":
/*!*******************************************************!*\
  !*** ./node_modules/micromark/dev/lib/postprocess.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   postprocess: function() { return /* binding */ postprocess; }
/* harmony export */ });
/* harmony import */ var micromark_util_subtokenize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-subtokenize */ "./node_modules/micromark-util-subtokenize/dev/index.js");
/**
 * @typedef {import('micromark-util-types').Event} Event
 */



/**
 * @param {Array<Event>} events
 * @returns {Array<Event>}
 */
function postprocess(events) {
  while (!(0,micromark_util_subtokenize__WEBPACK_IMPORTED_MODULE_0__.subtokenize)(events)) {
    // Empty
  }

  return events
}


/***/ }),

/***/ "./node_modules/micromark/dev/lib/preprocess.js":
/*!******************************************************!*\
  !*** ./node_modules/micromark/dev/lib/preprocess.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   preprocess: function() { return /* binding */ preprocess; }
/* harmony export */ });
/* harmony import */ var micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-symbol/codes.js */ "./node_modules/micromark-util-symbol/codes.js");
/* harmony import */ var micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol/constants.js */ "./node_modules/micromark-util-symbol/constants.js");
/**
 * @typedef {import('micromark-util-types').Chunk} Chunk
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Encoding} Encoding
 * @typedef {import('micromark-util-types').Value} Value
 */

/**
 * @callback Preprocessor
 * @param {Value} value
 * @param {Encoding | null | undefined} [encoding]
 * @param {boolean | null | undefined} [end=false]
 * @returns {Array<Chunk>}
 */




const search = /[\0\t\n\r]/g

/**
 * @returns {Preprocessor}
 */
function preprocess() {
  let column = 1
  let buffer = ''
  /** @type {boolean | undefined} */
  let start = true
  /** @type {boolean | undefined} */
  let atCarriageReturn

  return preprocessor

  /** @type {Preprocessor} */
  function preprocessor(value, encoding, end) {
    /** @type {Array<Chunk>} */
    const chunks = []
    /** @type {RegExpMatchArray | null} */
    let match
    /** @type {number} */
    let next
    /** @type {number} */
    let startPosition
    /** @type {number} */
    let endPosition
    /** @type {Code} */
    let code

    // @ts-expect-error `Buffer` does allow an encoding.
    value = buffer + value.toString(encoding)
    startPosition = 0
    buffer = ''

    if (start) {
      // To do: `markdown-rs` actually parses BOMs (byte order mark).
      if (value.charCodeAt(0) === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.byteOrderMarker) {
        startPosition++
      }

      start = undefined
    }

    while (startPosition < value.length) {
      search.lastIndex = startPosition
      match = search.exec(value)
      endPosition =
        match && match.index !== undefined ? match.index : value.length
      code = value.charCodeAt(endPosition)

      if (!match) {
        buffer = value.slice(startPosition)
        break
      }

      if (
        code === micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.lf &&
        startPosition === endPosition &&
        atCarriageReturn
      ) {
        chunks.push(micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.carriageReturnLineFeed)
        atCarriageReturn = undefined
      } else {
        if (atCarriageReturn) {
          chunks.push(micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.carriageReturn)
          atCarriageReturn = undefined
        }

        if (startPosition < endPosition) {
          chunks.push(value.slice(startPosition, endPosition))
          column += endPosition - startPosition
        }

        switch (code) {
          case micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.nul: {
            chunks.push(micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.replacementCharacter)
            column++

            break
          }

          case micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.ht: {
            next = Math.ceil(column / micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_1__.constants.tabSize) * micromark_util_symbol_constants_js__WEBPACK_IMPORTED_MODULE_1__.constants.tabSize
            chunks.push(micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.horizontalTab)
            while (column++ < next) chunks.push(micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.virtualSpace)

            break
          }

          case micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.lf: {
            chunks.push(micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.lineFeed)
            column = 1

            break
          }

          default: {
            atCarriageReturn = true
            column = 1
          }
        }
      }

      startPosition = endPosition + 1
    }

    if (end) {
      if (atCarriageReturn) chunks.push(micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.carriageReturn)
      if (buffer) chunks.push(buffer)
      chunks.push(micromark_util_symbol_codes_js__WEBPACK_IMPORTED_MODULE_0__.codes.eof)
    }

    return chunks
  }
}


/***/ }),

/***/ "./node_modules/unist-util-stringify-position/lib/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/unist-util-stringify-position/lib/index.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   stringifyPosition: function() { return /* binding */ stringifyPosition; }
/* harmony export */ });
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Point} Point
 * @typedef {import('unist').Position} Position
 */

/**
 * @typedef NodeLike
 * @property {string} type
 * @property {PositionLike | null | undefined} [position]
 *
 * @typedef PositionLike
 * @property {PointLike | null | undefined} [start]
 * @property {PointLike | null | undefined} [end]
 *
 * @typedef PointLike
 * @property {number | null | undefined} [line]
 * @property {number | null | undefined} [column]
 * @property {number | null | undefined} [offset]
 */

/**
 * Serialize the positional info of a point, position (start and end points),
 * or node.
 *
 * @param {Node | NodeLike | Position | PositionLike | Point | PointLike | null | undefined} [value]
 *   Node, position, or point.
 * @returns {string}
 *   Pretty printed positional info of a node (`string`).
 *
 *   In the format of a range `ls:cs-le:ce` (when given `node` or `position`)
 *   or a point `l:c` (when given `point`), where `l` stands for line, `c` for
 *   column, `s` for `start`, and `e` for end.
 *   An empty string (`''`) is returned if the given value is neither `node`,
 *   `position`, nor `point`.
 */
function stringifyPosition(value) {
  // Nothing.
  if (!value || typeof value !== 'object') {
    return ''
  }

  // Node.
  if ('position' in value || 'type' in value) {
    return position(value.position)
  }

  // Position.
  if ('start' in value || 'end' in value) {
    return position(value)
  }

  // Point.
  if ('line' in value || 'column' in value) {
    return point(value)
  }

  // ?
  return ''
}

/**
 * @param {Point | PointLike | null | undefined} point
 * @returns {string}
 */
function point(point) {
  return index(point && point.line) + ':' + index(point && point.column)
}

/**
 * @param {Position | PositionLike | null | undefined} pos
 * @returns {string}
 */
function position(pos) {
  return point(pos && pos.start) + '-' + point(pos && pos.end)
}

/**
 * @param {number | null | undefined} value
 * @returns {number}
 */
function index(value) {
  return value && typeof value === 'number' ? value : 1
}


/***/ }),

/***/ "./node_modules/uvu/assert/index.mjs":
/*!*******************************************!*\
  !*** ./node_modules/uvu/assert/index.mjs ***!
  \*******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Assertion: function() { return /* binding */ Assertion; },
/* harmony export */   equal: function() { return /* binding */ equal; },
/* harmony export */   fixture: function() { return /* binding */ fixture; },
/* harmony export */   instance: function() { return /* binding */ instance; },
/* harmony export */   is: function() { return /* binding */ is; },
/* harmony export */   match: function() { return /* binding */ match; },
/* harmony export */   not: function() { return /* binding */ not; },
/* harmony export */   ok: function() { return /* binding */ ok; },
/* harmony export */   snapshot: function() { return /* binding */ snapshot; },
/* harmony export */   throws: function() { return /* binding */ throws; },
/* harmony export */   type: function() { return /* binding */ type; },
/* harmony export */   unreachable: function() { return /* binding */ unreachable; }
/* harmony export */ });
/* harmony import */ var dequal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dequal */ "./node_modules/dequal/dist/index.mjs");
/* harmony import */ var uvu_diff__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uvu/diff */ "./node_modules/uvu/diff/index.mjs");



function dedent(str) {
	str = str.replace(/\r?\n/g, '\n');
  let arr = str.match(/^[ \t]*(?=\S)/gm);
  let i = 0, min = 1/0, len = (arr||[]).length;
  for (; i < len; i++) min = Math.min(min, arr[i].length);
  return len && min ? str.replace(new RegExp(`^[ \\t]{${min}}`, 'gm'), '') : str;
}

class Assertion extends Error {
	constructor(opts={}) {
		super(opts.message);
		this.name = 'Assertion';
		this.code = 'ERR_ASSERTION';
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
		this.details = opts.details || false;
		this.generated = !!opts.generated;
		this.operator = opts.operator;
		this.expects = opts.expects;
		this.actual = opts.actual;
	}
}

function assert(bool, actual, expects, operator, detailer, backup, msg) {
	if (bool) return;
	let message = msg || backup;
	if (msg instanceof Error) throw msg;
	let details = detailer && detailer(actual, expects);
	throw new Assertion({ actual, expects, operator, message, details, generated: !msg });
}

function ok(val, msg) {
	assert(!!val, false, true, 'ok', false, 'Expected value to be truthy', msg);
}

function is(val, exp, msg) {
	assert(val === exp, val, exp, 'is', uvu_diff__WEBPACK_IMPORTED_MODULE_1__.compare, 'Expected values to be strictly equal:', msg);
}

function equal(val, exp, msg) {
	assert((0,dequal__WEBPACK_IMPORTED_MODULE_0__.dequal)(val, exp), val, exp, 'equal', uvu_diff__WEBPACK_IMPORTED_MODULE_1__.compare, 'Expected values to be deeply equal:', msg);
}

function unreachable(msg) {
	assert(false, true, false, 'unreachable', false, 'Expected not to be reached!', msg);
}

function type(val, exp, msg) {
	let tmp = typeof val;
	assert(tmp === exp, tmp, exp, 'type', false, `Expected "${tmp}" to be "${exp}"`, msg);
}

function instance(val, exp, msg) {
	let name = '`' + (exp.name || exp.constructor.name) + '`';
	assert(val instanceof exp, val, exp, 'instance', false, `Expected value to be an instance of ${name}`, msg);
}

function match(val, exp, msg) {
	if (typeof exp === 'string') {
		assert(val.includes(exp), val, exp, 'match', false, `Expected value to include "${exp}" substring`, msg);
	} else {
		assert(exp.test(val), val, exp, 'match', false, `Expected value to match \`${String(exp)}\` pattern`, msg);
	}
}

function snapshot(val, exp, msg) {
	val=dedent(val); exp=dedent(exp);
	assert(val === exp, val, exp, 'snapshot', uvu_diff__WEBPACK_IMPORTED_MODULE_1__.lines, 'Expected value to match snapshot:', msg);
}

const lineNums = (x, y) => (0,uvu_diff__WEBPACK_IMPORTED_MODULE_1__.lines)(x, y, 1);
function fixture(val, exp, msg) {
	val=dedent(val); exp=dedent(exp);
	assert(val === exp, val, exp, 'fixture', lineNums, 'Expected value to match fixture:', msg);
}

function throws(blk, exp, msg) {
	if (!msg && typeof exp === 'string') {
		msg = exp; exp = null;
	}

	try {
		blk();
		assert(false, false, true, 'throws', false, 'Expected function to throw', msg);
	} catch (err) {
		if (err instanceof Assertion) throw err;

		if (typeof exp === 'function') {
			assert(exp(err), false, true, 'throws', false, 'Expected function to throw matching exception', msg);
		} else if (exp instanceof RegExp) {
			assert(exp.test(err.message), false, true, 'throws', false, `Expected function to throw exception matching \`${String(exp)}\` pattern`, msg);
		}
	}
}

// ---

function not(val, msg) {
	assert(!val, true, false, 'not', false, 'Expected value to be falsey', msg);
}

not.ok = not;

is.not = function (val, exp, msg) {
	assert(val !== exp, val, exp, 'is.not', false, 'Expected values not to be strictly equal', msg);
}

not.equal = function (val, exp, msg) {
	assert(!(0,dequal__WEBPACK_IMPORTED_MODULE_0__.dequal)(val, exp), val, exp, 'not.equal', false, 'Expected values not to be deeply equal', msg);
}

not.type = function (val, exp, msg) {
	let tmp = typeof val;
	assert(tmp !== exp, tmp, exp, 'not.type', false, `Expected "${tmp}" not to be "${exp}"`, msg);
}

not.instance = function (val, exp, msg) {
	let name = '`' + (exp.name || exp.constructor.name) + '`';
	assert(!(val instanceof exp), val, exp, 'not.instance', false, `Expected value not to be an instance of ${name}`, msg);
}

not.snapshot = function (val, exp, msg) {
	val=dedent(val); exp=dedent(exp);
	assert(val !== exp, val, exp, 'not.snapshot', false, 'Expected value not to match snapshot', msg);
}

not.fixture = function (val, exp, msg) {
	val=dedent(val); exp=dedent(exp);
	assert(val !== exp, val, exp, 'not.fixture', false, 'Expected value not to match fixture', msg);
}

not.match = function (val, exp, msg) {
	if (typeof exp === 'string') {
		assert(!val.includes(exp), val, exp, 'not.match', false, `Expected value not to include "${exp}" substring`, msg);
	} else {
		assert(!exp.test(val), val, exp, 'not.match', false, `Expected value not to match \`${String(exp)}\` pattern`, msg);
	}
}

not.throws = function (blk, exp, msg) {
	if (!msg && typeof exp === 'string') {
		msg = exp; exp = null;
	}

	try {
		blk();
	} catch (err) {
		if (typeof exp === 'function') {
			assert(!exp(err), true, false, 'not.throws', false, 'Expected function not to throw matching exception', msg);
		} else if (exp instanceof RegExp) {
			assert(!exp.test(err.message), true, false, 'not.throws', false, `Expected function not to throw exception matching \`${String(exp)}\` pattern`, msg);
		} else if (!exp) {
			assert(false, true, false, 'not.throws', false, 'Expected function not to throw', msg);
		}
	}
}


/***/ }),

/***/ "./node_modules/uvu/diff/index.mjs":
/*!*****************************************!*\
  !*** ./node_modules/uvu/diff/index.mjs ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrays: function() { return /* binding */ arrays; },
/* harmony export */   chars: function() { return /* binding */ chars; },
/* harmony export */   circular: function() { return /* binding */ circular; },
/* harmony export */   compare: function() { return /* binding */ compare; },
/* harmony export */   direct: function() { return /* binding */ direct; },
/* harmony export */   lines: function() { return /* binding */ lines; },
/* harmony export */   sort: function() { return /* binding */ sort; },
/* harmony export */   stringify: function() { return /* binding */ stringify; }
/* harmony export */ });
/* harmony import */ var kleur__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! kleur */ "./node_modules/kleur/index.mjs");
/* harmony import */ var diff__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! diff */ "./node_modules/diff/lib/index.mjs");



const colors = {
	'--': kleur__WEBPACK_IMPORTED_MODULE_0__["default"].red,
	'··': kleur__WEBPACK_IMPORTED_MODULE_0__["default"].grey,
	'++': kleur__WEBPACK_IMPORTED_MODULE_0__["default"].green,
};

const TITLE = kleur__WEBPACK_IMPORTED_MODULE_0__["default"].dim().italic;
const TAB=kleur__WEBPACK_IMPORTED_MODULE_0__["default"].dim('→'), SPACE=kleur__WEBPACK_IMPORTED_MODULE_0__["default"].dim('·'), NL=kleur__WEBPACK_IMPORTED_MODULE_0__["default"].dim('↵');
const LOG = (sym, str) => colors[sym](sym + PRETTY(str)) + '\n';
const LINE = (num, x) => kleur__WEBPACK_IMPORTED_MODULE_0__["default"].dim('L' + String(num).padStart(x, '0') + ' ');
const PRETTY = str => str.replace(/[ ]/g, SPACE).replace(/\t/g, TAB).replace(/(\r?\n)/g, NL);

function line(obj, prev, pad) {
	let char = obj.removed ? '--' : obj.added ? '++' : '··';
	let arr = obj.value.replace(/\r?\n$/, '').split('\n');
	let i=0, tmp, out='';

	if (obj.added) out += colors[char]().underline(TITLE('Expected:')) + '\n';
	else if (obj.removed) out += colors[char]().underline(TITLE('Actual:')) + '\n';

	for (; i < arr.length; i++) {
		tmp = arr[i];
		if (tmp != null) {
			if (prev) out += LINE(prev + i, pad);
			out += LOG(char, tmp || '\n');
		}
	}

	return out;
}

// TODO: want better diffing
//~> complex items bail outright
function arrays(input, expect) {
	let arr = diff__WEBPACK_IMPORTED_MODULE_1__.diffArrays(input, expect);
	let i=0, j=0, k=0, tmp, val, char, isObj, str;
	let out = LOG('··', '[');

	for (; i < arr.length; i++) {
		char = (tmp = arr[i]).removed ? '--' : tmp.added ? '++' : '··';

		if (tmp.added) {
			out += colors[char]().underline(TITLE('Expected:')) + '\n';
		} else if (tmp.removed) {
			out += colors[char]().underline(TITLE('Actual:')) + '\n';
		}

		for (j=0; j < tmp.value.length; j++) {
			isObj = (tmp.value[j] && typeof tmp.value[j] === 'object');
			val = stringify(tmp.value[j]).split(/\r?\n/g);
			for (k=0; k < val.length;) {
				str = '  ' + val[k++] + (isObj ? '' : ',');
				if (isObj && k === val.length && (j + 1) < tmp.value.length) str += ',';
				out += LOG(char, str);
			}
		}
	}

	return out + LOG('··', ']');
}

function lines(input, expect, linenum = 0) {
	let i=0, tmp, output='';
	let arr = diff__WEBPACK_IMPORTED_MODULE_1__.diffLines(input, expect);
	let pad = String(expect.split(/\r?\n/g).length - linenum).length;

	for (; i < arr.length; i++) {
		output += line(tmp = arr[i], linenum, pad);
		if (linenum && !tmp.removed) linenum += tmp.count;
	}

	return output;
}

function chars(input, expect) {
	let arr = diff__WEBPACK_IMPORTED_MODULE_1__.diffChars(input, expect);
	let i=0, output='', tmp;

	let l1 = input.length;
	let l2 = expect.length;

	let p1 = PRETTY(input);
	let p2 = PRETTY(expect);

	tmp = arr[i];

	if (l1 === l2) {
		// no length offsets
	} else if (tmp.removed && arr[i + 1]) {
		let del = tmp.count - arr[i + 1].count;
		if (del == 0) {
			// wash~
		} else if (del > 0) {
			expect = ' '.repeat(del) + expect;
			p2 = ' '.repeat(del) + p2;
			l2 += del;
		} else if (del < 0) {
			input = ' '.repeat(-del) + input;
			p1 = ' '.repeat(-del) + p1;
			l1 += -del;
		}
	}

	output += direct(p1, p2, l1, l2);

	if (l1 === l2) {
		for (tmp='  '; i < l1; i++) {
			tmp += input[i] === expect[i] ? ' ' : '^';
		}
	} else {
		for (tmp='  '; i < arr.length; i++) {
			tmp += ((arr[i].added || arr[i].removed) ? '^' : ' ').repeat(Math.max(arr[i].count, 0));
			if (i + 1 < arr.length && ((arr[i].added && arr[i+1].removed) || (arr[i].removed && arr[i+1].added))) {
				arr[i + 1].count -= arr[i].count;
			}
		}
	}

	return output + kleur__WEBPACK_IMPORTED_MODULE_0__["default"].red(tmp);
}

function direct(input, expect, lenA = String(input).length, lenB = String(expect).length) {
	let gutter = 4;
	let lenC = Math.max(lenA, lenB);
	let typeA=typeof input, typeB=typeof expect;

	if (typeA !== typeB) {
		gutter = 2;

		let delA = gutter + lenC - lenA;
		let delB = gutter + lenC - lenB;

		input += ' '.repeat(delA) + kleur__WEBPACK_IMPORTED_MODULE_0__["default"].dim(`[${typeA}]`);
		expect += ' '.repeat(delB) + kleur__WEBPACK_IMPORTED_MODULE_0__["default"].dim(`[${typeB}]`);

		lenA += delA + typeA.length + 2;
		lenB += delB + typeB.length + 2;
		lenC = Math.max(lenA, lenB);
	}

	let output = colors['++']('++' + expect + ' '.repeat(gutter + lenC - lenB) + TITLE('(Expected)')) + '\n';
	return output + colors['--']('--' + input + ' '.repeat(gutter + lenC - lenA) + TITLE('(Actual)')) + '\n';
}

function sort(input, expect) {
	var k, i=0, tmp, isArr = Array.isArray(input);
	var keys=[], out=isArr ? Array(input.length) : {};

	if (isArr) {
		for (i=0; i < out.length; i++) {
			tmp = input[i];
			if (!tmp || typeof tmp !== 'object') out[i] = tmp;
			else out[i] = sort(tmp, expect[i]); // might not be right
		}
	} else {
		for (k in expect)
			keys.push(k);

		for (; i < keys.length; i++) {
			if (Object.prototype.hasOwnProperty.call(input, k = keys[i])) {
				if (!(tmp = input[k]) || typeof tmp !== 'object') out[k] = tmp;
				else out[k] = sort(tmp, expect[k]);
			}
		}

		for (k in input) {
			if (!out.hasOwnProperty(k)) {
				out[k] = input[k]; // expect didnt have
			}
		}
	}

	return out;
}

function circular() {
	var cache = new Set;
	return function print(key, val) {
		if (val === void 0) return '[__VOID__]';
		if (typeof val === 'number' && val !== val) return '[__NAN__]';
		if (typeof val === 'bigint') return val.toString();
		if (!val || typeof val !== 'object') return val;
		if (cache.has(val)) return '[Circular]';
		cache.add(val); return val;
	}
}

function stringify(input) {
	return JSON.stringify(input, circular(), 2).replace(/"\[__NAN__\]"/g, 'NaN').replace(/"\[__VOID__\]"/g, 'undefined');
}

function compare(input, expect) {
	if (Array.isArray(expect) && Array.isArray(input)) return arrays(input, expect);
	if (expect instanceof RegExp) return chars(''+input, ''+expect);

	let isA = input && typeof input == 'object';
	let isB = expect && typeof expect == 'object';

	if (isA && isB) input = sort(input, expect);
	if (isB) expect = stringify(expect);
	if (isA) input = stringify(input);

	if (expect && typeof expect == 'object') {
		input = stringify(sort(input, expect));
		expect = stringify(expect);
	}

	isA = typeof input == 'string';
	isB = typeof expect == 'string';

	if (isA && /\r?\n/.test(input)) return lines(input, ''+expect);
	if (isB && /\r?\n/.test(expect)) return lines(''+input, expect);
	if (isA && isB) return chars(input, expect);

	return direct(input, expect);
}


/***/ })

}]);
//# sourceMappingURL=-------.1659f75b.js.5a1e4e7b.map