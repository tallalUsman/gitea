/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@popperjs/core/lib/createPopper.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/createPopper.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: function() { return /* binding */ createPopper; },
/* harmony export */   detectOverflow: function() { return /* reexport safe */ _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"]; },
/* harmony export */   popperGenerator: function() { return /* binding */ popperGenerator; }
/* harmony export */ });
/* harmony import */ var _dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom-utils/getCompositeRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-utils/listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/orderModifiers.js */ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js");
/* harmony import */ var _utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/debounce.js */ "./node_modules/@popperjs/core/lib/utils/debounce.js");
/* harmony import */ var _utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/mergeByName.js */ "./node_modules/@popperjs/core/lib/utils/mergeByName.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");









var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: (0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(reference) ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference) : reference.contextElement ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference.contextElement) : [],
          popper: (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = (0,_utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__["default"])([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: (0,_dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__["default"])(reference, (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(popper), state.options.strategy === 'fixed'),
          popper: (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: (0,_utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__["default"])(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref) {
        var name = _ref.name,
            _ref$options = _ref.options,
            options = _ref$options === void 0 ? {} : _ref$options,
            effect = _ref.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}
var createPopper = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/contains.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/contains.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ contains; }
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getBoundingClientRect; }
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    scaleX = element.offsetWidth > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !(0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__["default"])() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getClippingRect; }
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getViewportRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js");
/* harmony import */ var _getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getDocumentRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js");
/* harmony import */ var _listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");















function getInnerBoundingClientRect(element, strategy) {
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === _enums_js__WEBPACK_IMPORTED_MODULE_1__.viewport ? (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element, strategy)) : (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = (0,_listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_8__["default"])(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__["default"])(element).position) >= 0;
  var clipperElement = canEscapeClipping && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(element) ? (0,_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(element) : element;

  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) && (0,_contains_js__WEBPACK_IMPORTED_MODULE_11__["default"])(clippingParent, clipperElement) && (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_12__["default"])(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.top, accRect.top);
    accRect.right = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getCompositeRect; }
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getNodeScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");









function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.width) / element.offsetWidth || 1;
  var scaleY = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent);
  var offsetParentIsScaled = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent) && isElementScaled(offsetParent);
  var documentElement = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(offsetParent);
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(documentElement)) {
      scroll = (0,_getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent);
    }

    if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent)) {
      offsets = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__["default"])(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getComputedStyle; }
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getComputedStyle(element) {
  return (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element).getComputedStyle(element);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getDocumentElement; }
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return (((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getDocumentRect; }
/* harmony export */ });
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");




 // Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var winScroll = (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);
  var y = -winScroll.scrollTop;

  if ((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__["default"])(body || html).direction === 'rtl') {
    x += (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getHTMLElementScroll; }
/* harmony export */ });
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getLayoutRect; }
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
 // Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getNodeName; }
/* harmony export */ });
function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getNodeScroll; }
/* harmony export */ });
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getHTMLElementScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js");




function getNodeScroll(node) {
  if (node === (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node) || !(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node)) {
    return (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node);
  } else {
    return (0,_getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node);
  }
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getOffsetParent; }
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _isTableElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isTableElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");








function getTrueOffsetParent(element) {
  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || // https://github.com/popperjs/popper-core/issues/837
  (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());
  var isIE = /Trident/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());

  if (isIE && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = (0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(currentNode)) {
    currentNode = currentNode.host;
  }

  while ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(currentNode) && ['html', 'body'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(currentNode)) < 0) {
    var css = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_5__["default"])(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && (0,_isTableElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent) && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'html' || (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'body' && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getParentNode; }
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");



function getParentNode(element) {
  if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isShadowRoot)(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) // fallback

  );
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getScrollParent; }
/* harmony export */ });
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");




function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node) && (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node)) {
    return node;
  }

  return getScrollParent((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getViewportRect; }
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getViewportRect(element, strategy) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = (0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__["default"])();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element),
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js":
/*!****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindow.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getWindow; }
/* harmony export */ });
function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getWindowScroll; }
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getWindowScroll(node) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getWindowScrollBarX; }
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");



function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)).left + (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element).scrollLeft;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isElement: function() { return /* binding */ isElement; },
/* harmony export */   isHTMLElement: function() { return /* binding */ isHTMLElement; },
/* harmony export */   isShadowRoot: function() { return /* binding */ isShadowRoot; }
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");


function isElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isLayoutViewport; }
/* harmony export */ });
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__["default"])());
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isScrollParent; }
/* harmony export */ });
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isTableElement; }
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element)) >= 0;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js":
/*!************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ listScrollParents; }
/* harmony export */ });
/* harmony import */ var _getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");




/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = (0,_getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(target)));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/enums.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/enums.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterMain: function() { return /* binding */ afterMain; },
/* harmony export */   afterRead: function() { return /* binding */ afterRead; },
/* harmony export */   afterWrite: function() { return /* binding */ afterWrite; },
/* harmony export */   auto: function() { return /* binding */ auto; },
/* harmony export */   basePlacements: function() { return /* binding */ basePlacements; },
/* harmony export */   beforeMain: function() { return /* binding */ beforeMain; },
/* harmony export */   beforeRead: function() { return /* binding */ beforeRead; },
/* harmony export */   beforeWrite: function() { return /* binding */ beforeWrite; },
/* harmony export */   bottom: function() { return /* binding */ bottom; },
/* harmony export */   clippingParents: function() { return /* binding */ clippingParents; },
/* harmony export */   end: function() { return /* binding */ end; },
/* harmony export */   left: function() { return /* binding */ left; },
/* harmony export */   main: function() { return /* binding */ main; },
/* harmony export */   modifierPhases: function() { return /* binding */ modifierPhases; },
/* harmony export */   placements: function() { return /* binding */ placements; },
/* harmony export */   popper: function() { return /* binding */ popper; },
/* harmony export */   read: function() { return /* binding */ read; },
/* harmony export */   reference: function() { return /* binding */ reference; },
/* harmony export */   right: function() { return /* binding */ right; },
/* harmony export */   start: function() { return /* binding */ start; },
/* harmony export */   top: function() { return /* binding */ top; },
/* harmony export */   variationPlacements: function() { return /* binding */ variationPlacements; },
/* harmony export */   viewport: function() { return /* binding */ viewport; },
/* harmony export */   write: function() { return /* binding */ write; }
/* harmony export */ });
var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/applyStyles.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

 // This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect,
  requires: ['computeStyles']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/arrow.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/arrow.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../dom-utils/contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");








 // eslint-disable-next-line import/no-unused-modules

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return (0,_utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(typeof padding !== 'number' ? padding : (0,_utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_2__.basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(state.placement);
  var axis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(basePlacement);
  var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_2__.left, _enums_js__WEBPACK_IMPORTED_MODULE_2__.right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])(arrowElement);
  var minProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.top : _enums_js__WEBPACK_IMPORTED_MODULE_2__.left;
  var maxProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_2__.right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_7__.within)(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!(0,_dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__["default"])(state.elements.popper, arrowElement)) {
    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/computeStyles.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mapToStyles: function() { return /* binding */ mapToStyles; }
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");







 // eslint-disable-next-line import/no-unused-modules

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x,
      y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(x * dpr) / dpr || 0,
    y: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.left;
  var sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;
  var win = window;

  if (adaptive) {
    var offsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) {
      offsetParent = (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(popper);

      if ((0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.right) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }, (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.placement),
    variation: (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__["default"])(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/eventListeners.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
 // eslint-disable-next-line import/no-unused-modules

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/flip.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/flip.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getOppositePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getOppositeVariationPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/computeAutoPlacement.js */ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");






 // eslint-disable-next-line import/no-unused-modules

function getExpandedFallbackPlacements(placement) {
  if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto) {
    return [];
  }

  var oppositePlacement = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(placement);
  return [(0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement), oppositePlacement, (0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [(0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto ? (0,_utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);

    var isStartVariation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.start;
    var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.top, _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.right : _enums_js__WEBPACK_IMPORTED_MODULE_1__.left : isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    }

    var altVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/hide.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/hide.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");



function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom, _enums_js__WEBPACK_IMPORTED_MODULE_0__.left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/index.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: function() { return /* reexport safe */ _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__["default"]; },
/* harmony export */   arrow: function() { return /* reexport safe */ _arrow_js__WEBPACK_IMPORTED_MODULE_1__["default"]; },
/* harmony export */   computeStyles: function() { return /* reexport safe */ _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"]; },
/* harmony export */   eventListeners: function() { return /* reexport safe */ _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__["default"]; },
/* harmony export */   flip: function() { return /* reexport safe */ _flip_js__WEBPACK_IMPORTED_MODULE_4__["default"]; },
/* harmony export */   hide: function() { return /* reexport safe */ _hide_js__WEBPACK_IMPORTED_MODULE_5__["default"]; },
/* harmony export */   offset: function() { return /* reexport safe */ _offset_js__WEBPACK_IMPORTED_MODULE_6__["default"]; },
/* harmony export */   popperOffsets: function() { return /* reexport safe */ _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"]; },
/* harmony export */   preventOverflow: function() { return /* reexport safe */ _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"]; }
/* harmony export */ });
/* harmony import */ var _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _arrow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _flip_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _hide_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _offset_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");










/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/offset.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/offset.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   distanceAndSkiddingToXY: function() { return /* binding */ distanceAndSkiddingToXY; }
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");

 // eslint-disable-next-line import/no-unused-modules

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
  var invertDistance = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = _enums_js__WEBPACK_IMPORTED_MODULE_1__.placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");


function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = (0,_utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getAltAxis.js */ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");












function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state.placement);
  var variation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement);
  var altAxis = (0,_utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__["default"])(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;
    var altSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = offset + overflow[mainSide];
    var max = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : (0,_utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.min)(min, tetherMin) : min, offset, tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.max)(max, tetherMax) : max);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;

    var _altSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [_enums_js__WEBPACK_IMPORTED_MODULE_5__.top, _enums_js__WEBPACK_IMPORTED_MODULE_5__.left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.withinMaxClamp)(_tetherMin, _offset, _tetherMax) : (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper-lite.js":
/*!********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper-lite.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: function() { return /* binding */ createPopper; },
/* harmony export */   defaultModifiers: function() { return /* binding */ defaultModifiers; },
/* harmony export */   detectOverflow: function() { return /* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_5__["default"]; },
/* harmony export */   popperGenerator: function() { return /* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator; }
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");





var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper.js":
/*!***************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.applyStyles; },
/* harmony export */   arrow: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.arrow; },
/* harmony export */   computeStyles: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.computeStyles; },
/* harmony export */   createPopper: function() { return /* binding */ createPopper; },
/* harmony export */   createPopperLite: function() { return /* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__.createPopper; },
/* harmony export */   defaultModifiers: function() { return /* binding */ defaultModifiers; },
/* harmony export */   detectOverflow: function() { return /* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_10__["default"]; },
/* harmony export */   eventListeners: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.eventListeners; },
/* harmony export */   flip: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.flip; },
/* harmony export */   hide: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.hide; },
/* harmony export */   offset: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.offset; },
/* harmony export */   popperGenerator: function() { return /* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator; },
/* harmony export */   popperOffsets: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.popperOffsets; },
/* harmony export */   preventOverflow: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.preventOverflow; }
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modifiers/offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modifiers/flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modifiers/preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");
/* harmony import */ var _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modifiers/arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modifiers/hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");










var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"], _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__["default"], _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__["default"], _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"], _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__["default"], _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ computeAutoPlacement; }
/* harmony export */ });
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");




function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements : _options$allowedAutoP;
  var variation = (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement);
  var placements = variation ? flipVariations ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements : _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements.filter(function (placement) {
    return (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) === variation;
  }) : _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements;
  var allowedPlacements = placements.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = (0,_detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[(0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeOffsets.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ computeOffsets; }
/* harmony export */ });
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");




function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? (0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) : null;
  var variation = placement ? (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? (0,_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;

      default:
    }
  }

  return offsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/debounce.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/debounce.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ debounce; }
/* harmony export */ });
function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/detectOverflow.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ detectOverflow; }
/* harmony export */ });
/* harmony import */ var _dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getClippingRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");
/* harmony import */ var _rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");








 // eslint-disable-next-line import/no-unused-modules

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = (0,_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(typeof padding !== 'number' ? padding : (0,_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements));
  var altContext = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference : _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = (0,_dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(element) ? element : element.contextElement || (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = (0,_dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.elements.reference);
  var popperOffsets = (0,_computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"])({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = (0,_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__["default"])(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/expandToHashMap.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ expandToHashMap; }
/* harmony export */ });
function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getAltAxis.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getAltAxis; }
/* harmony export */ });
function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getBasePlacement.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getBasePlacement; }
/* harmony export */ });

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getFreshSideObject; }
/* harmony export */ });
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getMainAxisFromPlacement; }
/* harmony export */ });
function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getOppositePlacement; }
/* harmony export */ });
var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getOppositeVariationPlacement; }
/* harmony export */ });
var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getVariation.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getVariation.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getVariation; }
/* harmony export */ });
function getVariation(placement) {
  return placement.split('-')[1];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/math.js":
/*!*******************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/math.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   max: function() { return /* binding */ max; },
/* harmony export */   min: function() { return /* binding */ min; },
/* harmony export */   round: function() { return /* binding */ round; }
/* harmony export */ });
var max = Math.max;
var min = Math.min;
var round = Math.round;

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergeByName.js":
/*!**************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergeByName.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ mergeByName; }
/* harmony export */ });
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ mergePaddingObject; }
/* harmony export */ });
/* harmony import */ var _getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");

function mergePaddingObject(paddingObject) {
  return Object.assign({}, (0,_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(), paddingObject);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/orderModifiers.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ orderModifiers; }
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
 // source: https://stackoverflow.com/questions/49875255

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/rectToClientRect.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ rectToClientRect; }
/* harmony export */ });
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/userAgent.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/userAgent.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getUAString; }
/* harmony export */ });
function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/within.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/within.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   within: function() { return /* binding */ within; },
/* harmony export */   withinMaxClamp: function() { return /* binding */ withinMaxClamp; }
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");

function within(min, value, max) {
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.max)(min, (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.min)(value, max));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

/***/ }),

/***/ "./node_modules/dayjs/dayjs.min.js":
/*!*****************************************!*\
  !*** ./node_modules/dayjs/dayjs.min.js ***!
  \*****************************************/
/***/ (function(module) {

!function(t,e){ true?module.exports=e():0}(this,(function(){"use strict";var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",c="month",f="quarter",h="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,c),s=n-i<0,u=e.clone().add(r+(s?-1:1),c);return+(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:c,y:h,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:f}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p="$isDayjsObject",S=function(t){return t instanceof _||!(!t||!t[p])},w=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else{var a=e.name;D[a]=e,i=a}return!r&&i&&(g=i),i||!r&&g},O=function(t,e){if(S(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},b=v;b.l=w,b.i=S,b.w=function(t,e){return O(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=w(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[p]=!0}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(b.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.init()},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},m.$utils=function(){return b},m.isValid=function(){return!(this.$d.toString()===l)},m.isSame=function(t,e){var n=O(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return O(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<O(t)},m.$g=function(t,e,n){return b.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!b.u(e)||e,f=b.p(t),l=function(t,e){var i=b.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return b.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(f){case h:return r?l(1,0):l(31,11);case c:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=b.p(t),f="set"+(this.$u?"UTC":""),l=(n={},n[a]=f+"Date",n[d]=f+"Date",n[c]=f+"Month",n[h]=f+"FullYear",n[u]=f+"Hours",n[s]=f+"Minutes",n[i]=f+"Seconds",n[r]=f+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===c||o===h){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[b.p(t)]()},m.add=function(r,f){var d,l=this;r=Number(r);var $=b.p(f),y=function(t){var e=O(l);return b.w(e.date(e.date()+Math.round(t*r)),l)};if($===c)return this.set(c,this.$M+r);if($===h)return this.set(h,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return b.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=b.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,c=n.months,f=n.meridiem,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},d=function(t){return b.s(s%12||12,t,"0")},$=f||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(y,(function(t,r){return r||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return b.s(e.$y,4,"0");case"M":return a+1;case"MM":return b.s(a+1,2,"0");case"MMM":return h(n.monthsShort,a,c,3);case"MMMM":return h(c,a);case"D":return e.$D;case"DD":return b.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return h(n.weekdaysMin,e.$W,o,2);case"ddd":return h(n.weekdaysShort,e.$W,o,3);case"dddd":return o[e.$W];case"H":return String(s);case"HH":return b.s(s,2,"0");case"h":return d(1);case"hh":return d(2);case"a":return $(s,u,!0);case"A":return $(s,u,!1);case"m":return String(u);case"mm":return b.s(u,2,"0");case"s":return String(e.$s);case"ss":return b.s(e.$s,2,"0");case"SSS":return b.s(e.$ms,3,"0");case"Z":return i}return null}(t)||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=this,M=b.p(d),m=O(r),v=(m.utcOffset()-this.utcOffset())*e,g=this-m,D=function(){return b.m(y,m)};switch(M){case h:$=D()/12;break;case c:$=D();break;case f:$=D()/3;break;case o:$=(g-v)/6048e5;break;case a:$=(g-v)/864e5;break;case u:$=g/n;break;case s:$=g/e;break;case i:$=g/t;break;default:$=g}return l?$:b.a($)},m.daysInMonth=function(){return this.endOf(c).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=w(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return b.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),k=_.prototype;return O.prototype=k,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",c],["$y",h],["$D",d]].forEach((function(t){k[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),O.extend=function(t,e){return t.$i||(t(e,_,O),t.$i=!0),O},O.locale=w,O.isDayjs=S,O.unix=function(t){return O(1e3*t)},O.en=D[g],O.Ls=D,O.p={},O}));

/***/ }),

/***/ "./node_modules/tippy.js/dist/tippy.esm.js":
/*!*************************************************!*\
  !*** ./node_modules/tippy.js/dist/tippy.esm.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   animateFill: function() { return /* binding */ animateFill; },
/* harmony export */   createSingleton: function() { return /* binding */ createSingleton; },
/* harmony export */   delegate: function() { return /* binding */ delegate; },
/* harmony export */   followCursor: function() { return /* binding */ followCursor; },
/* harmony export */   hideAll: function() { return /* binding */ hideAll; },
/* harmony export */   inlinePositioning: function() { return /* binding */ inlinePositioning; },
/* harmony export */   roundArrow: function() { return /* binding */ ROUND_ARROW; },
/* harmony export */   sticky: function() { return /* binding */ sticky; }
/* harmony export */ });
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/popper.js");
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/**!
* tippy.js v6.3.7
* (c) 2017-2021 atomiks
* MIT License
*/


var ROUND_ARROW = '<svg width="16" height="6" xmlns="http://www.w3.org/2000/svg"><path d="M0 6s1.796-.013 4.67-3.615C5.851.9 6.93.006 8 0c1.07-.006 2.148.887 3.343 2.385C14.233 6.005 16 6 16 6H0z"></svg>';
var BOX_CLASS = "tippy-box";
var CONTENT_CLASS = "tippy-content";
var BACKDROP_CLASS = "tippy-backdrop";
var ARROW_CLASS = "tippy-arrow";
var SVG_ARROW_CLASS = "tippy-svg-arrow";
var TOUCH_OPTIONS = {
  passive: true,
  capture: true
};
var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO() {
  return document.body;
};

function hasOwnProperty(obj, key) {
  return {}.hasOwnProperty.call(obj, key);
}
function getValueAtIndexOrReturn(value, index, defaultValue) {
  if (Array.isArray(value)) {
    var v = value[index];
    return v == null ? Array.isArray(defaultValue) ? defaultValue[index] : defaultValue : v;
  }

  return value;
}
function isType(value, type) {
  var str = {}.toString.call(value);
  return str.indexOf('[object') === 0 && str.indexOf(type + "]") > -1;
}
function invokeWithArgsOrReturn(value, args) {
  return typeof value === 'function' ? value.apply(void 0, args) : value;
}
function debounce(fn, ms) {
  // Avoid wrapping in `setTimeout` if ms is 0 anyway
  if (ms === 0) {
    return fn;
  }

  var timeout;
  return function (arg) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      fn(arg);
    }, ms);
  };
}
function removeProperties(obj, keys) {
  var clone = Object.assign({}, obj);
  keys.forEach(function (key) {
    delete clone[key];
  });
  return clone;
}
function splitBySpaces(value) {
  return value.split(/\s+/).filter(Boolean);
}
function normalizeToArray(value) {
  return [].concat(value);
}
function pushIfUnique(arr, value) {
  if (arr.indexOf(value) === -1) {
    arr.push(value);
  }
}
function unique(arr) {
  return arr.filter(function (item, index) {
    return arr.indexOf(item) === index;
  });
}
function getBasePlacement(placement) {
  return placement.split('-')[0];
}
function arrayFrom(value) {
  return [].slice.call(value);
}
function removeUndefinedProps(obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
}

function div() {
  return document.createElement('div');
}
function isElement(value) {
  return ['Element', 'Fragment'].some(function (type) {
    return isType(value, type);
  });
}
function isNodeList(value) {
  return isType(value, 'NodeList');
}
function isMouseEvent(value) {
  return isType(value, 'MouseEvent');
}
function isReferenceElement(value) {
  return !!(value && value._tippy && value._tippy.reference === value);
}
function getArrayOfElements(value) {
  if (isElement(value)) {
    return [value];
  }

  if (isNodeList(value)) {
    return arrayFrom(value);
  }

  if (Array.isArray(value)) {
    return value;
  }

  return arrayFrom(document.querySelectorAll(value));
}
function setTransitionDuration(els, value) {
  els.forEach(function (el) {
    if (el) {
      el.style.transitionDuration = value + "ms";
    }
  });
}
function setVisibilityState(els, state) {
  els.forEach(function (el) {
    if (el) {
      el.setAttribute('data-state', state);
    }
  });
}
function getOwnerDocument(elementOrElements) {
  var _element$ownerDocumen;

  var _normalizeToArray = normalizeToArray(elementOrElements),
      element = _normalizeToArray[0]; // Elements created via a <template> have an ownerDocument with no reference to the body


  return element != null && (_element$ownerDocumen = element.ownerDocument) != null && _element$ownerDocumen.body ? element.ownerDocument : document;
}
function isCursorOutsideInteractiveBorder(popperTreeData, event) {
  var clientX = event.clientX,
      clientY = event.clientY;
  return popperTreeData.every(function (_ref) {
    var popperRect = _ref.popperRect,
        popperState = _ref.popperState,
        props = _ref.props;
    var interactiveBorder = props.interactiveBorder;
    var basePlacement = getBasePlacement(popperState.placement);
    var offsetData = popperState.modifiersData.offset;

    if (!offsetData) {
      return true;
    }

    var topDistance = basePlacement === 'bottom' ? offsetData.top.y : 0;
    var bottomDistance = basePlacement === 'top' ? offsetData.bottom.y : 0;
    var leftDistance = basePlacement === 'right' ? offsetData.left.x : 0;
    var rightDistance = basePlacement === 'left' ? offsetData.right.x : 0;
    var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
    var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
    var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
    var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
    return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
  });
}
function updateTransitionEndListener(box, action, listener) {
  var method = action + "EventListener"; // some browsers apparently support `transition` (unprefixed) but only fire
  // `webkitTransitionEnd`...

  ['transitionend', 'webkitTransitionEnd'].forEach(function (event) {
    box[method](event, listener);
  });
}
/**
 * Compared to xxx.contains, this function works for dom structures with shadow
 * dom
 */

function actualContains(parent, child) {
  var target = child;

  while (target) {
    var _target$getRootNode;

    if (parent.contains(target)) {
      return true;
    }

    target = target.getRootNode == null ? void 0 : (_target$getRootNode = target.getRootNode()) == null ? void 0 : _target$getRootNode.host;
  }

  return false;
}

var currentInput = {
  isTouch: false
};
var lastMouseMoveTime = 0;
/**
 * When a `touchstart` event is fired, it's assumed the user is using touch
 * input. We'll bind a `mousemove` event listener to listen for mouse input in
 * the future. This way, the `isTouch` property is fully dynamic and will handle
 * hybrid devices that use a mix of touch + mouse input.
 */

function onDocumentTouchStart() {
  if (currentInput.isTouch) {
    return;
  }

  currentInput.isTouch = true;

  if (window.performance) {
    document.addEventListener('mousemove', onDocumentMouseMove);
  }
}
/**
 * When two `mousemove` event are fired consecutively within 20ms, it's assumed
 * the user is using mouse input again. `mousemove` can fire on touch devices as
 * well, but very rarely that quickly.
 */

function onDocumentMouseMove() {
  var now = performance.now();

  if (now - lastMouseMoveTime < 20) {
    currentInput.isTouch = false;
    document.removeEventListener('mousemove', onDocumentMouseMove);
  }

  lastMouseMoveTime = now;
}
/**
 * When an element is in focus and has a tippy, leaving the tab/window and
 * returning causes it to show again. For mouse users this is unexpected, but
 * for keyboard use it makes sense.
 * TODO: find a better technique to solve this problem
 */

function onWindowBlur() {
  var activeElement = document.activeElement;

  if (isReferenceElement(activeElement)) {
    var instance = activeElement._tippy;

    if (activeElement.blur && !instance.state.isVisible) {
      activeElement.blur();
    }
  }
}
function bindGlobalEventListeners() {
  document.addEventListener('touchstart', onDocumentTouchStart, TOUCH_OPTIONS);
  window.addEventListener('blur', onWindowBlur);
}

var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
var isIE11 = isBrowser ? // @ts-ignore
!!window.msCrypto : false;

function createMemoryLeakWarning(method) {
  var txt = method === 'destroy' ? 'n already-' : ' ';
  return [method + "() was called on a" + txt + "destroyed instance. This is a no-op but", 'indicates a potential memory leak.'].join(' ');
}
function clean(value) {
  var spacesAndTabs = /[ \t]{2,}/g;
  var lineStartWithSpaces = /^[ \t]*/gm;
  return value.replace(spacesAndTabs, ' ').replace(lineStartWithSpaces, '').trim();
}

function getDevMessage(message) {
  return clean("\n  %ctippy.js\n\n  %c" + clean(message) + "\n\n  %c\uD83D\uDC77\u200D This is a development-only message. It will be removed in production.\n  ");
}

function getFormattedMessage(message) {
  return [getDevMessage(message), // title
  'color: #00C584; font-size: 1.3em; font-weight: bold;', // message
  'line-height: 1.5', // footer
  'color: #a6a095;'];
} // Assume warnings and errors never have the same message

var visitedMessages;

if (true) {
  resetVisitedMessages();
}

function resetVisitedMessages() {
  visitedMessages = new Set();
}
function warnWhen(condition, message) {
  if (condition && !visitedMessages.has(message)) {
    var _console;

    visitedMessages.add(message);

    (_console = console).warn.apply(_console, getFormattedMessage(message));
  }
}
function errorWhen(condition, message) {
  if (condition && !visitedMessages.has(message)) {
    var _console2;

    visitedMessages.add(message);

    (_console2 = console).error.apply(_console2, getFormattedMessage(message));
  }
}
function validateTargets(targets) {
  var didPassFalsyValue = !targets;
  var didPassPlainObject = Object.prototype.toString.call(targets) === '[object Object]' && !targets.addEventListener;
  errorWhen(didPassFalsyValue, ['tippy() was passed', '`' + String(targets) + '`', 'as its targets (first) argument. Valid types are: String, Element,', 'Element[], or NodeList.'].join(' '));
  errorWhen(didPassPlainObject, ['tippy() was passed a plain object which is not supported as an argument', 'for virtual positioning. Use props.getReferenceClientRect instead.'].join(' '));
}

var pluginProps = {
  animateFill: false,
  followCursor: false,
  inlinePositioning: false,
  sticky: false
};
var renderProps = {
  allowHTML: false,
  animation: 'fade',
  arrow: true,
  content: '',
  inertia: false,
  maxWidth: 350,
  role: 'tooltip',
  theme: '',
  zIndex: 9999
};
var defaultProps = Object.assign({
  appendTo: TIPPY_DEFAULT_APPEND_TO,
  aria: {
    content: 'auto',
    expanded: 'auto'
  },
  delay: 0,
  duration: [300, 250],
  getReferenceClientRect: null,
  hideOnClick: true,
  ignoreAttributes: false,
  interactive: false,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  moveTransition: '',
  offset: [0, 10],
  onAfterUpdate: function onAfterUpdate() {},
  onBeforeUpdate: function onBeforeUpdate() {},
  onCreate: function onCreate() {},
  onDestroy: function onDestroy() {},
  onHidden: function onHidden() {},
  onHide: function onHide() {},
  onMount: function onMount() {},
  onShow: function onShow() {},
  onShown: function onShown() {},
  onTrigger: function onTrigger() {},
  onUntrigger: function onUntrigger() {},
  onClickOutside: function onClickOutside() {},
  placement: 'top',
  plugins: [],
  popperOptions: {},
  render: null,
  showOnCreate: false,
  touch: true,
  trigger: 'mouseenter focus',
  triggerTarget: null
}, pluginProps, renderProps);
var defaultKeys = Object.keys(defaultProps);
var setDefaultProps = function setDefaultProps(partialProps) {
  /* istanbul ignore else */
  if (true) {
    validateProps(partialProps, []);
  }

  var keys = Object.keys(partialProps);
  keys.forEach(function (key) {
    defaultProps[key] = partialProps[key];
  });
};
function getExtendedPassedProps(passedProps) {
  var plugins = passedProps.plugins || [];
  var pluginProps = plugins.reduce(function (acc, plugin) {
    var name = plugin.name,
        defaultValue = plugin.defaultValue;

    if (name) {
      var _name;

      acc[name] = passedProps[name] !== undefined ? passedProps[name] : (_name = defaultProps[name]) != null ? _name : defaultValue;
    }

    return acc;
  }, {});
  return Object.assign({}, passedProps, pluginProps);
}
function getDataAttributeProps(reference, plugins) {
  var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
    plugins: plugins
  }))) : defaultKeys;
  var props = propKeys.reduce(function (acc, key) {
    var valueAsString = (reference.getAttribute("data-tippy-" + key) || '').trim();

    if (!valueAsString) {
      return acc;
    }

    if (key === 'content') {
      acc[key] = valueAsString;
    } else {
      try {
        acc[key] = JSON.parse(valueAsString);
      } catch (e) {
        acc[key] = valueAsString;
      }
    }

    return acc;
  }, {});
  return props;
}
function evaluateProps(reference, props) {
  var out = Object.assign({}, props, {
    content: invokeWithArgsOrReturn(props.content, [reference])
  }, props.ignoreAttributes ? {} : getDataAttributeProps(reference, props.plugins));
  out.aria = Object.assign({}, defaultProps.aria, out.aria);
  out.aria = {
    expanded: out.aria.expanded === 'auto' ? props.interactive : out.aria.expanded,
    content: out.aria.content === 'auto' ? props.interactive ? null : 'describedby' : out.aria.content
  };
  return out;
}
function validateProps(partialProps, plugins) {
  if (partialProps === void 0) {
    partialProps = {};
  }

  if (plugins === void 0) {
    plugins = [];
  }

  var keys = Object.keys(partialProps);
  keys.forEach(function (prop) {
    var nonPluginProps = removeProperties(defaultProps, Object.keys(pluginProps));
    var didPassUnknownProp = !hasOwnProperty(nonPluginProps, prop); // Check if the prop exists in `plugins`

    if (didPassUnknownProp) {
      didPassUnknownProp = plugins.filter(function (plugin) {
        return plugin.name === prop;
      }).length === 0;
    }

    warnWhen(didPassUnknownProp, ["`" + prop + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", 'a plugin, forgot to pass it in an array as props.plugins.', '\n\n', 'All props: https://atomiks.github.io/tippyjs/v6/all-props/\n', 'Plugins: https://atomiks.github.io/tippyjs/v6/plugins/'].join(' '));
  });
}

var innerHTML = function innerHTML() {
  return 'innerHTML';
};

function dangerouslySetInnerHTML(element, html) {
  element[innerHTML()] = html;
}

function createArrowElement(value) {
  var arrow = div();

  if (value === true) {
    arrow.className = ARROW_CLASS;
  } else {
    arrow.className = SVG_ARROW_CLASS;

    if (isElement(value)) {
      arrow.appendChild(value);
    } else {
      dangerouslySetInnerHTML(arrow, value);
    }
  }

  return arrow;
}

function setContent(content, props) {
  if (isElement(props.content)) {
    dangerouslySetInnerHTML(content, '');
    content.appendChild(props.content);
  } else if (typeof props.content !== 'function') {
    if (props.allowHTML) {
      dangerouslySetInnerHTML(content, props.content);
    } else {
      content.textContent = props.content;
    }
  }
}
function getChildren(popper) {
  var box = popper.firstElementChild;
  var boxChildren = arrayFrom(box.children);
  return {
    box: box,
    content: boxChildren.find(function (node) {
      return node.classList.contains(CONTENT_CLASS);
    }),
    arrow: boxChildren.find(function (node) {
      return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
    }),
    backdrop: boxChildren.find(function (node) {
      return node.classList.contains(BACKDROP_CLASS);
    })
  };
}
function render(instance) {
  var popper = div();
  var box = div();
  box.className = BOX_CLASS;
  box.setAttribute('data-state', 'hidden');
  box.setAttribute('tabindex', '-1');
  var content = div();
  content.className = CONTENT_CLASS;
  content.setAttribute('data-state', 'hidden');
  setContent(content, instance.props);
  popper.appendChild(box);
  box.appendChild(content);
  onUpdate(instance.props, instance.props);

  function onUpdate(prevProps, nextProps) {
    var _getChildren = getChildren(popper),
        box = _getChildren.box,
        content = _getChildren.content,
        arrow = _getChildren.arrow;

    if (nextProps.theme) {
      box.setAttribute('data-theme', nextProps.theme);
    } else {
      box.removeAttribute('data-theme');
    }

    if (typeof nextProps.animation === 'string') {
      box.setAttribute('data-animation', nextProps.animation);
    } else {
      box.removeAttribute('data-animation');
    }

    if (nextProps.inertia) {
      box.setAttribute('data-inertia', '');
    } else {
      box.removeAttribute('data-inertia');
    }

    box.style.maxWidth = typeof nextProps.maxWidth === 'number' ? nextProps.maxWidth + "px" : nextProps.maxWidth;

    if (nextProps.role) {
      box.setAttribute('role', nextProps.role);
    } else {
      box.removeAttribute('role');
    }

    if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) {
      setContent(content, instance.props);
    }

    if (nextProps.arrow) {
      if (!arrow) {
        box.appendChild(createArrowElement(nextProps.arrow));
      } else if (prevProps.arrow !== nextProps.arrow) {
        box.removeChild(arrow);
        box.appendChild(createArrowElement(nextProps.arrow));
      }
    } else if (arrow) {
      box.removeChild(arrow);
    }
  }

  return {
    popper: popper,
    onUpdate: onUpdate
  };
} // Runtime check to identify if the render function is the default one; this
// way we can apply default CSS transitions logic and it can be tree-shaken away

render.$$tippy = true;

var idCounter = 1;
var mouseMoveListeners = []; // Used by `hideAll()`

var mountedInstances = [];
function createTippy(reference, passedProps) {
  var props = evaluateProps(reference, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps)))); // ===========================================================================
  // 🔒 Private members
  // ===========================================================================

  var showTimeout;
  var hideTimeout;
  var scheduleHideAnimationFrame;
  var isVisibleFromClick = false;
  var didHideDueToDocumentMouseDown = false;
  var didTouchMove = false;
  var ignoreOnFirstUpdate = false;
  var lastTriggerEvent;
  var currentTransitionEndListener;
  var onFirstUpdate;
  var listeners = [];
  var debouncedOnMouseMove = debounce(onMouseMove, props.interactiveDebounce);
  var currentTarget; // ===========================================================================
  // 🔑 Public members
  // ===========================================================================

  var id = idCounter++;
  var popperInstance = null;
  var plugins = unique(props.plugins);
  var state = {
    // Is the instance currently enabled?
    isEnabled: true,
    // Is the tippy currently showing and not transitioning out?
    isVisible: false,
    // Has the instance been destroyed?
    isDestroyed: false,
    // Is the tippy currently mounted to the DOM?
    isMounted: false,
    // Has the tippy finished transitioning in?
    isShown: false
  };
  var instance = {
    // properties
    id: id,
    reference: reference,
    popper: div(),
    popperInstance: popperInstance,
    props: props,
    state: state,
    plugins: plugins,
    // methods
    clearDelayTimeouts: clearDelayTimeouts,
    setProps: setProps,
    setContent: setContent,
    show: show,
    hide: hide,
    hideWithInteractivity: hideWithInteractivity,
    enable: enable,
    disable: disable,
    unmount: unmount,
    destroy: destroy
  }; // TODO: Investigate why this early return causes a TDZ error in the tests —
  // it doesn't seem to happen in the browser

  /* istanbul ignore if */

  if (!props.render) {
    if (true) {
      errorWhen(true, 'render() function has not been supplied.');
    }

    return instance;
  } // ===========================================================================
  // Initial mutations
  // ===========================================================================


  var _props$render = props.render(instance),
      popper = _props$render.popper,
      onUpdate = _props$render.onUpdate;

  popper.setAttribute('data-tippy-root', '');
  popper.id = "tippy-" + instance.id;
  instance.popper = popper;
  reference._tippy = instance;
  popper._tippy = instance;
  var pluginsHooks = plugins.map(function (plugin) {
    return plugin.fn(instance);
  });
  var hasAriaExpanded = reference.hasAttribute('aria-expanded');
  addListeners();
  handleAriaExpandedAttribute();
  handleStyles();
  invokeHook('onCreate', [instance]);

  if (props.showOnCreate) {
    scheduleShow();
  } // Prevent a tippy with a delay from hiding if the cursor left then returned
  // before it started hiding


  popper.addEventListener('mouseenter', function () {
    if (instance.props.interactive && instance.state.isVisible) {
      instance.clearDelayTimeouts();
    }
  });
  popper.addEventListener('mouseleave', function () {
    if (instance.props.interactive && instance.props.trigger.indexOf('mouseenter') >= 0) {
      getDocument().addEventListener('mousemove', debouncedOnMouseMove);
    }
  });
  return instance; // ===========================================================================
  // 🔒 Private methods
  // ===========================================================================

  function getNormalizedTouchSettings() {
    var touch = instance.props.touch;
    return Array.isArray(touch) ? touch : [touch, 0];
  }

  function getIsCustomTouchBehavior() {
    return getNormalizedTouchSettings()[0] === 'hold';
  }

  function getIsDefaultRenderFn() {
    var _instance$props$rende;

    // @ts-ignore
    return !!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy);
  }

  function getCurrentTarget() {
    return currentTarget || reference;
  }

  function getDocument() {
    var parent = getCurrentTarget().parentNode;
    return parent ? getOwnerDocument(parent) : document;
  }

  function getDefaultTemplateChildren() {
    return getChildren(popper);
  }

  function getDelay(isShow) {
    // For touch or keyboard input, force `0` delay for UX reasons
    // Also if the instance is mounted but not visible (transitioning out),
    // ignore delay
    if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === 'focus') {
      return 0;
    }

    return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
  }

  function handleStyles(fromHide) {
    if (fromHide === void 0) {
      fromHide = false;
    }

    popper.style.pointerEvents = instance.props.interactive && !fromHide ? '' : 'none';
    popper.style.zIndex = "" + instance.props.zIndex;
  }

  function invokeHook(hook, args, shouldInvokePropsHook) {
    if (shouldInvokePropsHook === void 0) {
      shouldInvokePropsHook = true;
    }

    pluginsHooks.forEach(function (pluginHooks) {
      if (pluginHooks[hook]) {
        pluginHooks[hook].apply(pluginHooks, args);
      }
    });

    if (shouldInvokePropsHook) {
      var _instance$props;

      (_instance$props = instance.props)[hook].apply(_instance$props, args);
    }
  }

  function handleAriaContentAttribute() {
    var aria = instance.props.aria;

    if (!aria.content) {
      return;
    }

    var attr = "aria-" + aria.content;
    var id = popper.id;
    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      var currentValue = node.getAttribute(attr);

      if (instance.state.isVisible) {
        node.setAttribute(attr, currentValue ? currentValue + " " + id : id);
      } else {
        var nextValue = currentValue && currentValue.replace(id, '').trim();

        if (nextValue) {
          node.setAttribute(attr, nextValue);
        } else {
          node.removeAttribute(attr);
        }
      }
    });
  }

  function handleAriaExpandedAttribute() {
    if (hasAriaExpanded || !instance.props.aria.expanded) {
      return;
    }

    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      if (instance.props.interactive) {
        node.setAttribute('aria-expanded', instance.state.isVisible && node === getCurrentTarget() ? 'true' : 'false');
      } else {
        node.removeAttribute('aria-expanded');
      }
    });
  }

  function cleanupInteractiveMouseListeners() {
    getDocument().removeEventListener('mousemove', debouncedOnMouseMove);
    mouseMoveListeners = mouseMoveListeners.filter(function (listener) {
      return listener !== debouncedOnMouseMove;
    });
  }

  function onDocumentPress(event) {
    // Moved finger to scroll instead of an intentional tap outside
    if (currentInput.isTouch) {
      if (didTouchMove || event.type === 'mousedown') {
        return;
      }
    }

    var actualTarget = event.composedPath && event.composedPath()[0] || event.target; // Clicked on interactive popper

    if (instance.props.interactive && actualContains(popper, actualTarget)) {
      return;
    } // Clicked on the event listeners target


    if (normalizeToArray(instance.props.triggerTarget || reference).some(function (el) {
      return actualContains(el, actualTarget);
    })) {
      if (currentInput.isTouch) {
        return;
      }

      if (instance.state.isVisible && instance.props.trigger.indexOf('click') >= 0) {
        return;
      }
    } else {
      invokeHook('onClickOutside', [instance, event]);
    }

    if (instance.props.hideOnClick === true) {
      instance.clearDelayTimeouts();
      instance.hide(); // `mousedown` event is fired right before `focus` if pressing the
      // currentTarget. This lets a tippy with `focus` trigger know that it
      // should not show

      didHideDueToDocumentMouseDown = true;
      setTimeout(function () {
        didHideDueToDocumentMouseDown = false;
      }); // The listener gets added in `scheduleShow()`, but this may be hiding it
      // before it shows, and hide()'s early bail-out behavior can prevent it
      // from being cleaned up

      if (!instance.state.isMounted) {
        removeDocumentPress();
      }
    }
  }

  function onTouchMove() {
    didTouchMove = true;
  }

  function onTouchStart() {
    didTouchMove = false;
  }

  function addDocumentPress() {
    var doc = getDocument();
    doc.addEventListener('mousedown', onDocumentPress, true);
    doc.addEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
    doc.addEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
    doc.addEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
  }

  function removeDocumentPress() {
    var doc = getDocument();
    doc.removeEventListener('mousedown', onDocumentPress, true);
    doc.removeEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
    doc.removeEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
    doc.removeEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
  }

  function onTransitionedOut(duration, callback) {
    onTransitionEnd(duration, function () {
      if (!instance.state.isVisible && popper.parentNode && popper.parentNode.contains(popper)) {
        callback();
      }
    });
  }

  function onTransitionedIn(duration, callback) {
    onTransitionEnd(duration, callback);
  }

  function onTransitionEnd(duration, callback) {
    var box = getDefaultTemplateChildren().box;

    function listener(event) {
      if (event.target === box) {
        updateTransitionEndListener(box, 'remove', listener);
        callback();
      }
    } // Make callback synchronous if duration is 0
    // `transitionend` won't fire otherwise


    if (duration === 0) {
      return callback();
    }

    updateTransitionEndListener(box, 'remove', currentTransitionEndListener);
    updateTransitionEndListener(box, 'add', listener);
    currentTransitionEndListener = listener;
  }

  function on(eventType, handler, options) {
    if (options === void 0) {
      options = false;
    }

    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      node.addEventListener(eventType, handler, options);
      listeners.push({
        node: node,
        eventType: eventType,
        handler: handler,
        options: options
      });
    });
  }

  function addListeners() {
    if (getIsCustomTouchBehavior()) {
      on('touchstart', onTrigger, {
        passive: true
      });
      on('touchend', onMouseLeave, {
        passive: true
      });
    }

    splitBySpaces(instance.props.trigger).forEach(function (eventType) {
      if (eventType === 'manual') {
        return;
      }

      on(eventType, onTrigger);

      switch (eventType) {
        case 'mouseenter':
          on('mouseleave', onMouseLeave);
          break;

        case 'focus':
          on(isIE11 ? 'focusout' : 'blur', onBlurOrFocusOut);
          break;

        case 'focusin':
          on('focusout', onBlurOrFocusOut);
          break;
      }
    });
  }

  function removeListeners() {
    listeners.forEach(function (_ref) {
      var node = _ref.node,
          eventType = _ref.eventType,
          handler = _ref.handler,
          options = _ref.options;
      node.removeEventListener(eventType, handler, options);
    });
    listeners = [];
  }

  function onTrigger(event) {
    var _lastTriggerEvent;

    var shouldScheduleClickHide = false;

    if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) {
      return;
    }

    var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === 'focus';
    lastTriggerEvent = event;
    currentTarget = event.currentTarget;
    handleAriaExpandedAttribute();

    if (!instance.state.isVisible && isMouseEvent(event)) {
      // If scrolling, `mouseenter` events can be fired if the cursor lands
      // over a new target, but `mousemove` events don't get fired. This
      // causes interactive tooltips to get stuck open until the cursor is
      // moved
      mouseMoveListeners.forEach(function (listener) {
        return listener(event);
      });
    } // Toggle show/hide when clicking click-triggered tooltips


    if (event.type === 'click' && (instance.props.trigger.indexOf('mouseenter') < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) {
      shouldScheduleClickHide = true;
    } else {
      scheduleShow(event);
    }

    if (event.type === 'click') {
      isVisibleFromClick = !shouldScheduleClickHide;
    }

    if (shouldScheduleClickHide && !wasFocused) {
      scheduleHide(event);
    }
  }

  function onMouseMove(event) {
    var target = event.target;
    var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper.contains(target);

    if (event.type === 'mousemove' && isCursorOverReferenceOrPopper) {
      return;
    }

    var popperTreeData = getNestedPopperTree().concat(popper).map(function (popper) {
      var _instance$popperInsta;

      var instance = popper._tippy;
      var state = (_instance$popperInsta = instance.popperInstance) == null ? void 0 : _instance$popperInsta.state;

      if (state) {
        return {
          popperRect: popper.getBoundingClientRect(),
          popperState: state,
          props: props
        };
      }

      return null;
    }).filter(Boolean);

    if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
      cleanupInteractiveMouseListeners();
      scheduleHide(event);
    }
  }

  function onMouseLeave(event) {
    var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf('click') >= 0 && isVisibleFromClick;

    if (shouldBail) {
      return;
    }

    if (instance.props.interactive) {
      instance.hideWithInteractivity(event);
      return;
    }

    scheduleHide(event);
  }

  function onBlurOrFocusOut(event) {
    if (instance.props.trigger.indexOf('focusin') < 0 && event.target !== getCurrentTarget()) {
      return;
    } // If focus was moved to within the popper


    if (instance.props.interactive && event.relatedTarget && popper.contains(event.relatedTarget)) {
      return;
    }

    scheduleHide(event);
  }

  function isEventListenerStopped(event) {
    return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf('touch') >= 0 : false;
  }

  function createPopperInstance() {
    destroyPopperInstance();
    var _instance$props2 = instance.props,
        popperOptions = _instance$props2.popperOptions,
        placement = _instance$props2.placement,
        offset = _instance$props2.offset,
        getReferenceClientRect = _instance$props2.getReferenceClientRect,
        moveTransition = _instance$props2.moveTransition;
    var arrow = getIsDefaultRenderFn() ? getChildren(popper).arrow : null;
    var computedReference = getReferenceClientRect ? {
      getBoundingClientRect: getReferenceClientRect,
      contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
    } : reference;
    var tippyModifier = {
      name: '$$tippy',
      enabled: true,
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      fn: function fn(_ref2) {
        var state = _ref2.state;

        if (getIsDefaultRenderFn()) {
          var _getDefaultTemplateCh = getDefaultTemplateChildren(),
              box = _getDefaultTemplateCh.box;

          ['placement', 'reference-hidden', 'escaped'].forEach(function (attr) {
            if (attr === 'placement') {
              box.setAttribute('data-placement', state.placement);
            } else {
              if (state.attributes.popper["data-popper-" + attr]) {
                box.setAttribute("data-" + attr, '');
              } else {
                box.removeAttribute("data-" + attr);
              }
            }
          });
          state.attributes.popper = {};
        }
      }
    };
    var modifiers = [{
      name: 'offset',
      options: {
        offset: offset
      }
    }, {
      name: 'preventOverflow',
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5
        }
      }
    }, {
      name: 'flip',
      options: {
        padding: 5
      }
    }, {
      name: 'computeStyles',
      options: {
        adaptive: !moveTransition
      }
    }, tippyModifier];

    if (getIsDefaultRenderFn() && arrow) {
      modifiers.push({
        name: 'arrow',
        options: {
          element: arrow,
          padding: 3
        }
      });
    }

    modifiers.push.apply(modifiers, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
    instance.popperInstance = (0,_popperjs_core__WEBPACK_IMPORTED_MODULE_0__.createPopper)(computedReference, popper, Object.assign({}, popperOptions, {
      placement: placement,
      onFirstUpdate: onFirstUpdate,
      modifiers: modifiers
    }));
  }

  function destroyPopperInstance() {
    if (instance.popperInstance) {
      instance.popperInstance.destroy();
      instance.popperInstance = null;
    }
  }

  function mount() {
    var appendTo = instance.props.appendTo;
    var parentNode; // By default, we'll append the popper to the triggerTargets's parentNode so
    // it's directly after the reference element so the elements inside the
    // tippy can be tabbed to
    // If there are clipping issues, the user can specify a different appendTo
    // and ensure focus management is handled correctly manually

    var node = getCurrentTarget();

    if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || appendTo === 'parent') {
      parentNode = node.parentNode;
    } else {
      parentNode = invokeWithArgsOrReturn(appendTo, [node]);
    } // The popper element needs to exist on the DOM before its position can be
    // updated as Popper needs to read its dimensions


    if (!parentNode.contains(popper)) {
      parentNode.appendChild(popper);
    }

    instance.state.isMounted = true;
    createPopperInstance();
    /* istanbul ignore else */

    if (true) {
      // Accessibility check
      warnWhen(instance.props.interactive && appendTo === defaultProps.appendTo && node.nextElementSibling !== popper, ['Interactive tippy element may not be accessible via keyboard', 'navigation because it is not directly after the reference element', 'in the DOM source order.', '\n\n', 'Using a wrapper <div> or <span> tag around the reference element', 'solves this by creating a new parentNode context.', '\n\n', 'Specifying `appendTo: document.body` silences this warning, but it', 'assumes you are using a focus management solution to handle', 'keyboard navigation.', '\n\n', 'See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity'].join(' '));
    }
  }

  function getNestedPopperTree() {
    return arrayFrom(popper.querySelectorAll('[data-tippy-root]'));
  }

  function scheduleShow(event) {
    instance.clearDelayTimeouts();

    if (event) {
      invokeHook('onTrigger', [instance, event]);
    }

    addDocumentPress();
    var delay = getDelay(true);

    var _getNormalizedTouchSe = getNormalizedTouchSettings(),
        touchValue = _getNormalizedTouchSe[0],
        touchDelay = _getNormalizedTouchSe[1];

    if (currentInput.isTouch && touchValue === 'hold' && touchDelay) {
      delay = touchDelay;
    }

    if (delay) {
      showTimeout = setTimeout(function () {
        instance.show();
      }, delay);
    } else {
      instance.show();
    }
  }

  function scheduleHide(event) {
    instance.clearDelayTimeouts();
    invokeHook('onUntrigger', [instance, event]);

    if (!instance.state.isVisible) {
      removeDocumentPress();
      return;
    } // For interactive tippies, scheduleHide is added to a document.body handler
    // from onMouseLeave so must intercept scheduled hides from mousemove/leave
    // events when trigger contains mouseenter and click, and the tip is
    // currently shown as a result of a click.


    if (instance.props.trigger.indexOf('mouseenter') >= 0 && instance.props.trigger.indexOf('click') >= 0 && ['mouseleave', 'mousemove'].indexOf(event.type) >= 0 && isVisibleFromClick) {
      return;
    }

    var delay = getDelay(false);

    if (delay) {
      hideTimeout = setTimeout(function () {
        if (instance.state.isVisible) {
          instance.hide();
        }
      }, delay);
    } else {
      // Fixes a `transitionend` problem when it fires 1 frame too
      // late sometimes, we don't want hide() to be called.
      scheduleHideAnimationFrame = requestAnimationFrame(function () {
        instance.hide();
      });
    }
  } // ===========================================================================
  // 🔑 Public methods
  // ===========================================================================


  function enable() {
    instance.state.isEnabled = true;
  }

  function disable() {
    // Disabling the instance should also hide it
    // https://github.com/atomiks/tippy.js-react/issues/106
    instance.hide();
    instance.state.isEnabled = false;
  }

  function clearDelayTimeouts() {
    clearTimeout(showTimeout);
    clearTimeout(hideTimeout);
    cancelAnimationFrame(scheduleHideAnimationFrame);
  }

  function setProps(partialProps) {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('setProps'));
    }

    if (instance.state.isDestroyed) {
      return;
    }

    invokeHook('onBeforeUpdate', [instance, partialProps]);
    removeListeners();
    var prevProps = instance.props;
    var nextProps = evaluateProps(reference, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
      ignoreAttributes: true
    }));
    instance.props = nextProps;
    addListeners();

    if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
      cleanupInteractiveMouseListeners();
      debouncedOnMouseMove = debounce(onMouseMove, nextProps.interactiveDebounce);
    } // Ensure stale aria-expanded attributes are removed


    if (prevProps.triggerTarget && !nextProps.triggerTarget) {
      normalizeToArray(prevProps.triggerTarget).forEach(function (node) {
        node.removeAttribute('aria-expanded');
      });
    } else if (nextProps.triggerTarget) {
      reference.removeAttribute('aria-expanded');
    }

    handleAriaExpandedAttribute();
    handleStyles();

    if (onUpdate) {
      onUpdate(prevProps, nextProps);
    }

    if (instance.popperInstance) {
      createPopperInstance(); // Fixes an issue with nested tippies if they are all getting re-rendered,
      // and the nested ones get re-rendered first.
      // https://github.com/atomiks/tippyjs-react/issues/177
      // TODO: find a cleaner / more efficient solution(!)

      getNestedPopperTree().forEach(function (nestedPopper) {
        // React (and other UI libs likely) requires a rAF wrapper as it flushes
        // its work in one
        requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
      });
    }

    invokeHook('onAfterUpdate', [instance, partialProps]);
  }

  function setContent(content) {
    instance.setProps({
      content: content
    });
  }

  function show() {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('show'));
    } // Early bail-out


    var isAlreadyVisible = instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);

    if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) {
      return;
    } // Normalize `disabled` behavior across browsers.
    // Firefox allows events on disabled elements, but Chrome doesn't.
    // Using a wrapper element (i.e. <span>) is recommended.


    if (getCurrentTarget().hasAttribute('disabled')) {
      return;
    }

    invokeHook('onShow', [instance], false);

    if (instance.props.onShow(instance) === false) {
      return;
    }

    instance.state.isVisible = true;

    if (getIsDefaultRenderFn()) {
      popper.style.visibility = 'visible';
    }

    handleStyles();
    addDocumentPress();

    if (!instance.state.isMounted) {
      popper.style.transition = 'none';
    } // If flipping to the opposite side after hiding at least once, the
    // animation will use the wrong placement without resetting the duration


    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh2 = getDefaultTemplateChildren(),
          box = _getDefaultTemplateCh2.box,
          content = _getDefaultTemplateCh2.content;

      setTransitionDuration([box, content], 0);
    }

    onFirstUpdate = function onFirstUpdate() {
      var _instance$popperInsta2;

      if (!instance.state.isVisible || ignoreOnFirstUpdate) {
        return;
      }

      ignoreOnFirstUpdate = true; // reflow

      void popper.offsetHeight;
      popper.style.transition = instance.props.moveTransition;

      if (getIsDefaultRenderFn() && instance.props.animation) {
        var _getDefaultTemplateCh3 = getDefaultTemplateChildren(),
            _box = _getDefaultTemplateCh3.box,
            _content = _getDefaultTemplateCh3.content;

        setTransitionDuration([_box, _content], duration);
        setVisibilityState([_box, _content], 'visible');
      }

      handleAriaContentAttribute();
      handleAriaExpandedAttribute();
      pushIfUnique(mountedInstances, instance); // certain modifiers (e.g. `maxSize`) require a second update after the
      // popper has been positioned for the first time

      (_instance$popperInsta2 = instance.popperInstance) == null ? void 0 : _instance$popperInsta2.forceUpdate();
      invokeHook('onMount', [instance]);

      if (instance.props.animation && getIsDefaultRenderFn()) {
        onTransitionedIn(duration, function () {
          instance.state.isShown = true;
          invokeHook('onShown', [instance]);
        });
      }
    };

    mount();
  }

  function hide() {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('hide'));
    } // Early bail-out


    var isAlreadyHidden = !instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);

    if (isAlreadyHidden || isDestroyed || isDisabled) {
      return;
    }

    invokeHook('onHide', [instance], false);

    if (instance.props.onHide(instance) === false) {
      return;
    }

    instance.state.isVisible = false;
    instance.state.isShown = false;
    ignoreOnFirstUpdate = false;
    isVisibleFromClick = false;

    if (getIsDefaultRenderFn()) {
      popper.style.visibility = 'hidden';
    }

    cleanupInteractiveMouseListeners();
    removeDocumentPress();
    handleStyles(true);

    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh4 = getDefaultTemplateChildren(),
          box = _getDefaultTemplateCh4.box,
          content = _getDefaultTemplateCh4.content;

      if (instance.props.animation) {
        setTransitionDuration([box, content], duration);
        setVisibilityState([box, content], 'hidden');
      }
    }

    handleAriaContentAttribute();
    handleAriaExpandedAttribute();

    if (instance.props.animation) {
      if (getIsDefaultRenderFn()) {
        onTransitionedOut(duration, instance.unmount);
      }
    } else {
      instance.unmount();
    }
  }

  function hideWithInteractivity(event) {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('hideWithInteractivity'));
    }

    getDocument().addEventListener('mousemove', debouncedOnMouseMove);
    pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
    debouncedOnMouseMove(event);
  }

  function unmount() {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('unmount'));
    }

    if (instance.state.isVisible) {
      instance.hide();
    }

    if (!instance.state.isMounted) {
      return;
    }

    destroyPopperInstance(); // If a popper is not interactive, it will be appended outside the popper
    // tree by default. This seems mainly for interactive tippies, but we should
    // find a workaround if possible

    getNestedPopperTree().forEach(function (nestedPopper) {
      nestedPopper._tippy.unmount();
    });

    if (popper.parentNode) {
      popper.parentNode.removeChild(popper);
    }

    mountedInstances = mountedInstances.filter(function (i) {
      return i !== instance;
    });
    instance.state.isMounted = false;
    invokeHook('onHidden', [instance]);
  }

  function destroy() {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('destroy'));
    }

    if (instance.state.isDestroyed) {
      return;
    }

    instance.clearDelayTimeouts();
    instance.unmount();
    removeListeners();
    delete reference._tippy;
    instance.state.isDestroyed = true;
    invokeHook('onDestroy', [instance]);
  }
}

function tippy(targets, optionalProps) {
  if (optionalProps === void 0) {
    optionalProps = {};
  }

  var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
  /* istanbul ignore else */

  if (true) {
    validateTargets(targets);
    validateProps(optionalProps, plugins);
  }

  bindGlobalEventListeners();
  var passedProps = Object.assign({}, optionalProps, {
    plugins: plugins
  });
  var elements = getArrayOfElements(targets);
  /* istanbul ignore else */

  if (true) {
    var isSingleContentElement = isElement(passedProps.content);
    var isMoreThanOneReferenceElement = elements.length > 1;
    warnWhen(isSingleContentElement && isMoreThanOneReferenceElement, ['tippy() was passed an Element as the `content` prop, but more than', 'one tippy instance was created by this invocation. This means the', 'content element will only be appended to the last tippy instance.', '\n\n', 'Instead, pass the .innerHTML of the element, or use a function that', 'returns a cloned version of the element instead.', '\n\n', '1) content: element.innerHTML\n', '2) content: () => element.cloneNode(true)'].join(' '));
  }

  var instances = elements.reduce(function (acc, reference) {
    var instance = reference && createTippy(reference, passedProps);

    if (instance) {
      acc.push(instance);
    }

    return acc;
  }, []);
  return isElement(targets) ? instances[0] : instances;
}

tippy.defaultProps = defaultProps;
tippy.setDefaultProps = setDefaultProps;
tippy.currentInput = currentInput;
var hideAll = function hideAll(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      excludedReferenceOrInstance = _ref.exclude,
      duration = _ref.duration;

  mountedInstances.forEach(function (instance) {
    var isExcluded = false;

    if (excludedReferenceOrInstance) {
      isExcluded = isReferenceElement(excludedReferenceOrInstance) ? instance.reference === excludedReferenceOrInstance : instance.popper === excludedReferenceOrInstance.popper;
    }

    if (!isExcluded) {
      var originalDuration = instance.props.duration;
      instance.setProps({
        duration: duration
      });
      instance.hide();

      if (!instance.state.isDestroyed) {
        instance.setProps({
          duration: originalDuration
        });
      }
    }
  });
};

// every time the popper is destroyed (i.e. a new target), removing the styles
// and causing transitions to break for singletons when the console is open, but
// most notably for non-transform styles being used, `gpuAcceleration: false`.

var applyStylesModifier = Object.assign({}, _popperjs_core__WEBPACK_IMPORTED_MODULE_1__["default"], {
  effect: function effect(_ref) {
    var state = _ref.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: '0',
        top: '0',
        margin: '0'
      },
      arrow: {
        position: 'absolute'
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;

    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    } // intentionally return no cleanup function
    // return () => { ... }

  }
});

var createSingleton = function createSingleton(tippyInstances, optionalProps) {
  var _optionalProps$popper;

  if (optionalProps === void 0) {
    optionalProps = {};
  }

  /* istanbul ignore else */
  if (true) {
    errorWhen(!Array.isArray(tippyInstances), ['The first argument passed to createSingleton() must be an array of', 'tippy instances. The passed value was', String(tippyInstances)].join(' '));
  }

  var individualInstances = tippyInstances;
  var references = [];
  var triggerTargets = [];
  var currentTarget;
  var overrides = optionalProps.overrides;
  var interceptSetPropsCleanups = [];
  var shownOnCreate = false;

  function setTriggerTargets() {
    triggerTargets = individualInstances.map(function (instance) {
      return normalizeToArray(instance.props.triggerTarget || instance.reference);
    }).reduce(function (acc, item) {
      return acc.concat(item);
    }, []);
  }

  function setReferences() {
    references = individualInstances.map(function (instance) {
      return instance.reference;
    });
  }

  function enableInstances(isEnabled) {
    individualInstances.forEach(function (instance) {
      if (isEnabled) {
        instance.enable();
      } else {
        instance.disable();
      }
    });
  }

  function interceptSetProps(singleton) {
    return individualInstances.map(function (instance) {
      var originalSetProps = instance.setProps;

      instance.setProps = function (props) {
        originalSetProps(props);

        if (instance.reference === currentTarget) {
          singleton.setProps(props);
        }
      };

      return function () {
        instance.setProps = originalSetProps;
      };
    });
  } // have to pass singleton, as it maybe undefined on first call


  function prepareInstance(singleton, target) {
    var index = triggerTargets.indexOf(target); // bail-out

    if (target === currentTarget) {
      return;
    }

    currentTarget = target;
    var overrideProps = (overrides || []).concat('content').reduce(function (acc, prop) {
      acc[prop] = individualInstances[index].props[prop];
      return acc;
    }, {});
    singleton.setProps(Object.assign({}, overrideProps, {
      getReferenceClientRect: typeof overrideProps.getReferenceClientRect === 'function' ? overrideProps.getReferenceClientRect : function () {
        var _references$index;

        return (_references$index = references[index]) == null ? void 0 : _references$index.getBoundingClientRect();
      }
    }));
  }

  enableInstances(false);
  setReferences();
  setTriggerTargets();
  var plugin = {
    fn: function fn() {
      return {
        onDestroy: function onDestroy() {
          enableInstances(true);
        },
        onHidden: function onHidden() {
          currentTarget = null;
        },
        onClickOutside: function onClickOutside(instance) {
          if (instance.props.showOnCreate && !shownOnCreate) {
            shownOnCreate = true;
            currentTarget = null;
          }
        },
        onShow: function onShow(instance) {
          if (instance.props.showOnCreate && !shownOnCreate) {
            shownOnCreate = true;
            prepareInstance(instance, references[0]);
          }
        },
        onTrigger: function onTrigger(instance, event) {
          prepareInstance(instance, event.currentTarget);
        }
      };
    }
  };
  var singleton = tippy(div(), Object.assign({}, removeProperties(optionalProps, ['overrides']), {
    plugins: [plugin].concat(optionalProps.plugins || []),
    triggerTarget: triggerTargets,
    popperOptions: Object.assign({}, optionalProps.popperOptions, {
      modifiers: [].concat(((_optionalProps$popper = optionalProps.popperOptions) == null ? void 0 : _optionalProps$popper.modifiers) || [], [applyStylesModifier])
    })
  }));
  var originalShow = singleton.show;

  singleton.show = function (target) {
    originalShow(); // first time, showOnCreate or programmatic call with no params
    // default to showing first instance

    if (!currentTarget && target == null) {
      return prepareInstance(singleton, references[0]);
    } // triggered from event (do nothing as prepareInstance already called by onTrigger)
    // programmatic call with no params when already visible (do nothing again)


    if (currentTarget && target == null) {
      return;
    } // target is index of instance


    if (typeof target === 'number') {
      return references[target] && prepareInstance(singleton, references[target]);
    } // target is a child tippy instance


    if (individualInstances.indexOf(target) >= 0) {
      var ref = target.reference;
      return prepareInstance(singleton, ref);
    } // target is a ReferenceElement


    if (references.indexOf(target) >= 0) {
      return prepareInstance(singleton, target);
    }
  };

  singleton.showNext = function () {
    var first = references[0];

    if (!currentTarget) {
      return singleton.show(0);
    }

    var index = references.indexOf(currentTarget);
    singleton.show(references[index + 1] || first);
  };

  singleton.showPrevious = function () {
    var last = references[references.length - 1];

    if (!currentTarget) {
      return singleton.show(last);
    }

    var index = references.indexOf(currentTarget);
    var target = references[index - 1] || last;
    singleton.show(target);
  };

  var originalSetProps = singleton.setProps;

  singleton.setProps = function (props) {
    overrides = props.overrides || overrides;
    originalSetProps(props);
  };

  singleton.setInstances = function (nextInstances) {
    enableInstances(true);
    interceptSetPropsCleanups.forEach(function (fn) {
      return fn();
    });
    individualInstances = nextInstances;
    enableInstances(false);
    setReferences();
    setTriggerTargets();
    interceptSetPropsCleanups = interceptSetProps(singleton);
    singleton.setProps({
      triggerTarget: triggerTargets
    });
  };

  interceptSetPropsCleanups = interceptSetProps(singleton);
  return singleton;
};

var BUBBLING_EVENTS_MAP = {
  mouseover: 'mouseenter',
  focusin: 'focus',
  click: 'click'
};
/**
 * Creates a delegate instance that controls the creation of tippy instances
 * for child elements (`target` CSS selector).
 */

function delegate(targets, props) {
  /* istanbul ignore else */
  if (true) {
    errorWhen(!(props && props.target), ['You must specity a `target` prop indicating a CSS selector string matching', 'the target elements that should receive a tippy.'].join(' '));
  }

  var listeners = [];
  var childTippyInstances = [];
  var disabled = false;
  var target = props.target;
  var nativeProps = removeProperties(props, ['target']);
  var parentProps = Object.assign({}, nativeProps, {
    trigger: 'manual',
    touch: false
  });
  var childProps = Object.assign({
    touch: defaultProps.touch
  }, nativeProps, {
    showOnCreate: true
  });
  var returnValue = tippy(targets, parentProps);
  var normalizedReturnValue = normalizeToArray(returnValue);

  function onTrigger(event) {
    if (!event.target || disabled) {
      return;
    }

    var targetNode = event.target.closest(target);

    if (!targetNode) {
      return;
    } // Get relevant trigger with fallbacks:
    // 1. Check `data-tippy-trigger` attribute on target node
    // 2. Fallback to `trigger` passed to `delegate()`
    // 3. Fallback to `defaultProps.trigger`


    var trigger = targetNode.getAttribute('data-tippy-trigger') || props.trigger || defaultProps.trigger; // @ts-ignore

    if (targetNode._tippy) {
      return;
    }

    if (event.type === 'touchstart' && typeof childProps.touch === 'boolean') {
      return;
    }

    if (event.type !== 'touchstart' && trigger.indexOf(BUBBLING_EVENTS_MAP[event.type]) < 0) {
      return;
    }

    var instance = tippy(targetNode, childProps);

    if (instance) {
      childTippyInstances = childTippyInstances.concat(instance);
    }
  }

  function on(node, eventType, handler, options) {
    if (options === void 0) {
      options = false;
    }

    node.addEventListener(eventType, handler, options);
    listeners.push({
      node: node,
      eventType: eventType,
      handler: handler,
      options: options
    });
  }

  function addEventListeners(instance) {
    var reference = instance.reference;
    on(reference, 'touchstart', onTrigger, TOUCH_OPTIONS);
    on(reference, 'mouseover', onTrigger);
    on(reference, 'focusin', onTrigger);
    on(reference, 'click', onTrigger);
  }

  function removeEventListeners() {
    listeners.forEach(function (_ref) {
      var node = _ref.node,
          eventType = _ref.eventType,
          handler = _ref.handler,
          options = _ref.options;
      node.removeEventListener(eventType, handler, options);
    });
    listeners = [];
  }

  function applyMutations(instance) {
    var originalDestroy = instance.destroy;
    var originalEnable = instance.enable;
    var originalDisable = instance.disable;

    instance.destroy = function (shouldDestroyChildInstances) {
      if (shouldDestroyChildInstances === void 0) {
        shouldDestroyChildInstances = true;
      }

      if (shouldDestroyChildInstances) {
        childTippyInstances.forEach(function (instance) {
          instance.destroy();
        });
      }

      childTippyInstances = [];
      removeEventListeners();
      originalDestroy();
    };

    instance.enable = function () {
      originalEnable();
      childTippyInstances.forEach(function (instance) {
        return instance.enable();
      });
      disabled = false;
    };

    instance.disable = function () {
      originalDisable();
      childTippyInstances.forEach(function (instance) {
        return instance.disable();
      });
      disabled = true;
    };

    addEventListeners(instance);
  }

  normalizedReturnValue.forEach(applyMutations);
  return returnValue;
}

var animateFill = {
  name: 'animateFill',
  defaultValue: false,
  fn: function fn(instance) {
    var _instance$props$rende;

    // @ts-ignore
    if (!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy)) {
      if (true) {
        errorWhen(instance.props.animateFill, 'The `animateFill` plugin requires the default render function.');
      }

      return {};
    }

    var _getChildren = getChildren(instance.popper),
        box = _getChildren.box,
        content = _getChildren.content;

    var backdrop = instance.props.animateFill ? createBackdropElement() : null;
    return {
      onCreate: function onCreate() {
        if (backdrop) {
          box.insertBefore(backdrop, box.firstElementChild);
          box.setAttribute('data-animatefill', '');
          box.style.overflow = 'hidden';
          instance.setProps({
            arrow: false,
            animation: 'shift-away'
          });
        }
      },
      onMount: function onMount() {
        if (backdrop) {
          var transitionDuration = box.style.transitionDuration;
          var duration = Number(transitionDuration.replace('ms', '')); // The content should fade in after the backdrop has mostly filled the
          // tooltip element. `clip-path` is the other alternative but is not
          // well-supported and is buggy on some devices.

          content.style.transitionDelay = Math.round(duration / 10) + "ms";
          backdrop.style.transitionDuration = transitionDuration;
          setVisibilityState([backdrop], 'visible');
        }
      },
      onShow: function onShow() {
        if (backdrop) {
          backdrop.style.transitionDuration = '0ms';
        }
      },
      onHide: function onHide() {
        if (backdrop) {
          setVisibilityState([backdrop], 'hidden');
        }
      }
    };
  }
};

function createBackdropElement() {
  var backdrop = div();
  backdrop.className = BACKDROP_CLASS;
  setVisibilityState([backdrop], 'hidden');
  return backdrop;
}

var mouseCoords = {
  clientX: 0,
  clientY: 0
};
var activeInstances = [];

function storeMouseCoords(_ref) {
  var clientX = _ref.clientX,
      clientY = _ref.clientY;
  mouseCoords = {
    clientX: clientX,
    clientY: clientY
  };
}

function addMouseCoordsListener(doc) {
  doc.addEventListener('mousemove', storeMouseCoords);
}

function removeMouseCoordsListener(doc) {
  doc.removeEventListener('mousemove', storeMouseCoords);
}

var followCursor = {
  name: 'followCursor',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference;
    var doc = getOwnerDocument(instance.props.triggerTarget || reference);
    var isInternalUpdate = false;
    var wasFocusEvent = false;
    var isUnmounted = true;
    var prevProps = instance.props;

    function getIsInitialBehavior() {
      return instance.props.followCursor === 'initial' && instance.state.isVisible;
    }

    function addListener() {
      doc.addEventListener('mousemove', onMouseMove);
    }

    function removeListener() {
      doc.removeEventListener('mousemove', onMouseMove);
    }

    function unsetGetReferenceClientRect() {
      isInternalUpdate = true;
      instance.setProps({
        getReferenceClientRect: null
      });
      isInternalUpdate = false;
    }

    function onMouseMove(event) {
      // If the instance is interactive, avoid updating the position unless it's
      // over the reference element
      var isCursorOverReference = event.target ? reference.contains(event.target) : true;
      var followCursor = instance.props.followCursor;
      var clientX = event.clientX,
          clientY = event.clientY;
      var rect = reference.getBoundingClientRect();
      var relativeX = clientX - rect.left;
      var relativeY = clientY - rect.top;

      if (isCursorOverReference || !instance.props.interactive) {
        instance.setProps({
          // @ts-ignore - unneeded DOMRect properties
          getReferenceClientRect: function getReferenceClientRect() {
            var rect = reference.getBoundingClientRect();
            var x = clientX;
            var y = clientY;

            if (followCursor === 'initial') {
              x = rect.left + relativeX;
              y = rect.top + relativeY;
            }

            var top = followCursor === 'horizontal' ? rect.top : y;
            var right = followCursor === 'vertical' ? rect.right : x;
            var bottom = followCursor === 'horizontal' ? rect.bottom : y;
            var left = followCursor === 'vertical' ? rect.left : x;
            return {
              width: right - left,
              height: bottom - top,
              top: top,
              right: right,
              bottom: bottom,
              left: left
            };
          }
        });
      }
    }

    function create() {
      if (instance.props.followCursor) {
        activeInstances.push({
          instance: instance,
          doc: doc
        });
        addMouseCoordsListener(doc);
      }
    }

    function destroy() {
      activeInstances = activeInstances.filter(function (data) {
        return data.instance !== instance;
      });

      if (activeInstances.filter(function (data) {
        return data.doc === doc;
      }).length === 0) {
        removeMouseCoordsListener(doc);
      }
    }

    return {
      onCreate: create,
      onDestroy: destroy,
      onBeforeUpdate: function onBeforeUpdate() {
        prevProps = instance.props;
      },
      onAfterUpdate: function onAfterUpdate(_, _ref2) {
        var followCursor = _ref2.followCursor;

        if (isInternalUpdate) {
          return;
        }

        if (followCursor !== undefined && prevProps.followCursor !== followCursor) {
          destroy();

          if (followCursor) {
            create();

            if (instance.state.isMounted && !wasFocusEvent && !getIsInitialBehavior()) {
              addListener();
            }
          } else {
            removeListener();
            unsetGetReferenceClientRect();
          }
        }
      },
      onMount: function onMount() {
        if (instance.props.followCursor && !wasFocusEvent) {
          if (isUnmounted) {
            onMouseMove(mouseCoords);
            isUnmounted = false;
          }

          if (!getIsInitialBehavior()) {
            addListener();
          }
        }
      },
      onTrigger: function onTrigger(_, event) {
        if (isMouseEvent(event)) {
          mouseCoords = {
            clientX: event.clientX,
            clientY: event.clientY
          };
        }

        wasFocusEvent = event.type === 'focus';
      },
      onHidden: function onHidden() {
        if (instance.props.followCursor) {
          unsetGetReferenceClientRect();
          removeListener();
          isUnmounted = true;
        }
      }
    };
  }
};

function getProps(props, modifier) {
  var _props$popperOptions;

  return {
    popperOptions: Object.assign({}, props.popperOptions, {
      modifiers: [].concat((((_props$popperOptions = props.popperOptions) == null ? void 0 : _props$popperOptions.modifiers) || []).filter(function (_ref) {
        var name = _ref.name;
        return name !== modifier.name;
      }), [modifier])
    })
  };
}

var inlinePositioning = {
  name: 'inlinePositioning',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference;

    function isEnabled() {
      return !!instance.props.inlinePositioning;
    }

    var placement;
    var cursorRectIndex = -1;
    var isInternalUpdate = false;
    var triedPlacements = [];
    var modifier = {
      name: 'tippyInlinePositioning',
      enabled: true,
      phase: 'afterWrite',
      fn: function fn(_ref2) {
        var state = _ref2.state;

        if (isEnabled()) {
          if (triedPlacements.indexOf(state.placement) !== -1) {
            triedPlacements = [];
          }

          if (placement !== state.placement && triedPlacements.indexOf(state.placement) === -1) {
            triedPlacements.push(state.placement);
            instance.setProps({
              // @ts-ignore - unneeded DOMRect properties
              getReferenceClientRect: function getReferenceClientRect() {
                return _getReferenceClientRect(state.placement);
              }
            });
          }

          placement = state.placement;
        }
      }
    };

    function _getReferenceClientRect(placement) {
      return getInlineBoundingClientRect(getBasePlacement(placement), reference.getBoundingClientRect(), arrayFrom(reference.getClientRects()), cursorRectIndex);
    }

    function setInternalProps(partialProps) {
      isInternalUpdate = true;
      instance.setProps(partialProps);
      isInternalUpdate = false;
    }

    function addModifier() {
      if (!isInternalUpdate) {
        setInternalProps(getProps(instance.props, modifier));
      }
    }

    return {
      onCreate: addModifier,
      onAfterUpdate: addModifier,
      onTrigger: function onTrigger(_, event) {
        if (isMouseEvent(event)) {
          var rects = arrayFrom(instance.reference.getClientRects());
          var cursorRect = rects.find(function (rect) {
            return rect.left - 2 <= event.clientX && rect.right + 2 >= event.clientX && rect.top - 2 <= event.clientY && rect.bottom + 2 >= event.clientY;
          });
          var index = rects.indexOf(cursorRect);
          cursorRectIndex = index > -1 ? index : cursorRectIndex;
        }
      },
      onHidden: function onHidden() {
        cursorRectIndex = -1;
      }
    };
  }
};
function getInlineBoundingClientRect(currentBasePlacement, boundingRect, clientRects, cursorRectIndex) {
  // Not an inline element, or placement is not yet known
  if (clientRects.length < 2 || currentBasePlacement === null) {
    return boundingRect;
  } // There are two rects and they are disjoined


  if (clientRects.length === 2 && cursorRectIndex >= 0 && clientRects[0].left > clientRects[1].right) {
    return clientRects[cursorRectIndex] || boundingRect;
  }

  switch (currentBasePlacement) {
    case 'top':
    case 'bottom':
      {
        var firstRect = clientRects[0];
        var lastRect = clientRects[clientRects.length - 1];
        var isTop = currentBasePlacement === 'top';
        var top = firstRect.top;
        var bottom = lastRect.bottom;
        var left = isTop ? firstRect.left : lastRect.left;
        var right = isTop ? firstRect.right : lastRect.right;
        var width = right - left;
        var height = bottom - top;
        return {
          top: top,
          bottom: bottom,
          left: left,
          right: right,
          width: width,
          height: height
        };
      }

    case 'left':
    case 'right':
      {
        var minLeft = Math.min.apply(Math, clientRects.map(function (rects) {
          return rects.left;
        }));
        var maxRight = Math.max.apply(Math, clientRects.map(function (rects) {
          return rects.right;
        }));
        var measureRects = clientRects.filter(function (rect) {
          return currentBasePlacement === 'left' ? rect.left === minLeft : rect.right === maxRight;
        });
        var _top = measureRects[0].top;
        var _bottom = measureRects[measureRects.length - 1].bottom;
        var _left = minLeft;
        var _right = maxRight;

        var _width = _right - _left;

        var _height = _bottom - _top;

        return {
          top: _top,
          bottom: _bottom,
          left: _left,
          right: _right,
          width: _width,
          height: _height
        };
      }

    default:
      {
        return boundingRect;
      }
  }
}

var sticky = {
  name: 'sticky',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference,
        popper = instance.popper;

    function getReference() {
      return instance.popperInstance ? instance.popperInstance.state.elements.reference : reference;
    }

    function shouldCheck(value) {
      return instance.props.sticky === true || instance.props.sticky === value;
    }

    var prevRefRect = null;
    var prevPopRect = null;

    function updatePosition() {
      var currentRefRect = shouldCheck('reference') ? getReference().getBoundingClientRect() : null;
      var currentPopRect = shouldCheck('popper') ? popper.getBoundingClientRect() : null;

      if (currentRefRect && areRectsDifferent(prevRefRect, currentRefRect) || currentPopRect && areRectsDifferent(prevPopRect, currentPopRect)) {
        if (instance.popperInstance) {
          instance.popperInstance.update();
        }
      }

      prevRefRect = currentRefRect;
      prevPopRect = currentPopRect;

      if (instance.state.isMounted) {
        requestAnimationFrame(updatePosition);
      }
    }

    return {
      onMount: function onMount() {
        if (instance.props.sticky) {
          updatePosition();
        }
      }
    };
  }
};

function areRectsDifferent(rectA, rectB) {
  if (rectA && rectB) {
    return rectA.top !== rectB.top || rectA.right !== rectB.right || rectA.bottom !== rectB.bottom || rectA.left !== rectB.left;
  }

  return true;
}

tippy.setDefaultProps({
  render: render
});

/* harmony default export */ __webpack_exports__["default"] = (tippy);

//# sourceMappingURL=tippy.esm.js.map


/***/ }),

/***/ "./node_modules/uint8-to-base64/esm/index.js":
/*!***************************************************!*\
  !*** ./node_modules/uint8-to-base64/esm/index.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decode: function() { return /* binding */ decode; },
/* harmony export */   encode: function() { return /* binding */ encode; }
/* harmony export */ });
const {fromCharCode} = String;

const encode = uint8array => {
  const output = [];
  for (let i = 0, {length} = uint8array; i < length; i++)
    output.push(fromCharCode(uint8array[i]));
  return btoa(output.join(''));
}

const asCharCode = c => c.charCodeAt(0);

const decode = chars => Uint8Array.from(atob(chars), asCharCode);


/***/ }),

/***/ "./public/assets/img/svg/octicon-kebab-horizontal.svg":
/*!************************************************************!*\
  !*** ./public/assets/img/svg/octicon-kebab-horizontal.svg ***!
  \************************************************************/
/***/ (function(module) {

"use strict";
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\" class=\"svg octicon-kebab-horizontal\" width=\"16\" height=\"16\" aria-hidden=\"true\"><path d=\"M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3\"/></svg>";

/***/ }),

/***/ "./node_modules/@github/relative-time-element/dist/duration-format-ponyfill.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@github/relative-time-element/dist/duration-format-ponyfill.js ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ DurationFormat; }
/* harmony export */ });
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DurationFormat_options;
class ListFormatPonyFill {
    formatToParts(members) {
        const parts = [];
        for (const value of members) {
            parts.push({ type: 'element', value });
            parts.push({ type: 'literal', value: ', ' });
        }
        return parts.slice(0, -1);
    }
}
const ListFormat = (typeof Intl !== 'undefined' && Intl.ListFormat) || ListFormatPonyFill;
const partsTable = [
    ['years', 'year'],
    ['months', 'month'],
    ['weeks', 'week'],
    ['days', 'day'],
    ['hours', 'hour'],
    ['minutes', 'minute'],
    ['seconds', 'second'],
    ['milliseconds', 'millisecond'],
];
const twoDigitFormatOptions = { minimumIntegerDigits: 2 };
class DurationFormat {
    constructor(locale, options = {}) {
        _DurationFormat_options.set(this, void 0);
        let style = String(options.style || 'short');
        if (style !== 'long' && style !== 'short' && style !== 'narrow' && style !== 'digital')
            style = 'short';
        let prevStyle = style === 'digital' ? 'numeric' : style;
        const hours = options.hours || prevStyle;
        prevStyle = hours === '2-digit' ? 'numeric' : hours;
        const minutes = options.minutes || prevStyle;
        prevStyle = minutes === '2-digit' ? 'numeric' : minutes;
        const seconds = options.seconds || prevStyle;
        prevStyle = seconds === '2-digit' ? 'numeric' : seconds;
        const milliseconds = options.milliseconds || prevStyle;
        __classPrivateFieldSet(this, _DurationFormat_options, {
            locale,
            style,
            years: options.years || style === 'digital' ? 'short' : style,
            yearsDisplay: options.yearsDisplay === 'always' ? 'always' : 'auto',
            months: options.months || style === 'digital' ? 'short' : style,
            monthsDisplay: options.monthsDisplay === 'always' ? 'always' : 'auto',
            weeks: options.weeks || style === 'digital' ? 'short' : style,
            weeksDisplay: options.weeksDisplay === 'always' ? 'always' : 'auto',
            days: options.days || style === 'digital' ? 'short' : style,
            daysDisplay: options.daysDisplay === 'always' ? 'always' : 'auto',
            hours,
            hoursDisplay: options.hoursDisplay === 'always' ? 'always' : style === 'digital' ? 'always' : 'auto',
            minutes,
            minutesDisplay: options.minutesDisplay === 'always' ? 'always' : style === 'digital' ? 'always' : 'auto',
            seconds,
            secondsDisplay: options.secondsDisplay === 'always' ? 'always' : style === 'digital' ? 'always' : 'auto',
            milliseconds,
            millisecondsDisplay: options.millisecondsDisplay === 'always' ? 'always' : 'auto',
        }, "f");
    }
    resolvedOptions() {
        return __classPrivateFieldGet(this, _DurationFormat_options, "f");
    }
    formatToParts(duration) {
        const list = [];
        const options = __classPrivateFieldGet(this, _DurationFormat_options, "f");
        const style = options.style;
        const locale = options.locale;
        for (const [unit, nfUnit] of partsTable) {
            const value = duration[unit];
            if (options[`${unit}Display`] === 'auto' && !value)
                continue;
            const unitStyle = options[unit];
            const nfOpts = unitStyle === '2-digit'
                ? twoDigitFormatOptions
                : unitStyle === 'numeric'
                    ? {}
                    : { style: 'unit', unit: nfUnit, unitDisplay: unitStyle };
            list.push(new Intl.NumberFormat(locale, nfOpts).format(value));
        }
        return new ListFormat(locale, {
            type: 'unit',
            style: style === 'digital' ? 'short' : style,
        }).formatToParts(list);
    }
    format(duration) {
        return this.formatToParts(duration)
            .map(p => p.value)
            .join('');
    }
}
_DurationFormat_options = new WeakMap();


/***/ }),

/***/ "./node_modules/@github/relative-time-element/dist/duration.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@github/relative-time-element/dist/duration.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Duration: function() { return /* binding */ Duration; },
/* harmony export */   applyDuration: function() { return /* binding */ applyDuration; },
/* harmony export */   elapsedTime: function() { return /* binding */ elapsedTime; },
/* harmony export */   getRelativeTimeUnit: function() { return /* binding */ getRelativeTimeUnit; },
/* harmony export */   isDuration: function() { return /* binding */ isDuration; },
/* harmony export */   roundToSingleUnit: function() { return /* binding */ roundToSingleUnit; },
/* harmony export */   unitNames: function() { return /* binding */ unitNames; }
/* harmony export */ });
/* harmony import */ var _duration_format_ponyfill_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./duration-format-ponyfill.js */ "./node_modules/@github/relative-time-element/dist/duration-format-ponyfill.js");

const durationRe = /^[-+]?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
const unitNames = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];
const isDuration = (str) => durationRe.test(str);
class Duration {
    constructor(years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0) {
        this.years = years;
        this.months = months;
        this.weeks = weeks;
        this.days = days;
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.milliseconds = milliseconds;
        this.years || (this.years = 0);
        this.sign || (this.sign = Math.sign(this.years));
        this.months || (this.months = 0);
        this.sign || (this.sign = Math.sign(this.months));
        this.weeks || (this.weeks = 0);
        this.sign || (this.sign = Math.sign(this.weeks));
        this.days || (this.days = 0);
        this.sign || (this.sign = Math.sign(this.days));
        this.hours || (this.hours = 0);
        this.sign || (this.sign = Math.sign(this.hours));
        this.minutes || (this.minutes = 0);
        this.sign || (this.sign = Math.sign(this.minutes));
        this.seconds || (this.seconds = 0);
        this.sign || (this.sign = Math.sign(this.seconds));
        this.milliseconds || (this.milliseconds = 0);
        this.sign || (this.sign = Math.sign(this.milliseconds));
        this.blank = this.sign === 0;
    }
    abs() {
        return new Duration(Math.abs(this.years), Math.abs(this.months), Math.abs(this.weeks), Math.abs(this.days), Math.abs(this.hours), Math.abs(this.minutes), Math.abs(this.seconds), Math.abs(this.milliseconds));
    }
    static from(durationLike) {
        var _a;
        if (typeof durationLike === 'string') {
            const str = String(durationLike).trim();
            const factor = str.startsWith('-') ? -1 : 1;
            const parsed = (_a = str
                .match(durationRe)) === null || _a === void 0 ? void 0 : _a.slice(1).map(x => (Number(x) || 0) * factor);
            if (!parsed)
                return new Duration();
            return new Duration(...parsed);
        }
        else if (typeof durationLike === 'object') {
            const { years, months, weeks, days, hours, minutes, seconds, milliseconds } = durationLike;
            return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds);
        }
        throw new RangeError('invalid duration');
    }
    static compare(one, two) {
        const now = Date.now();
        const oneApplied = Math.abs(applyDuration(now, Duration.from(one)).getTime() - now);
        const twoApplied = Math.abs(applyDuration(now, Duration.from(two)).getTime() - now);
        return oneApplied > twoApplied ? -1 : oneApplied < twoApplied ? 1 : 0;
    }
    toLocaleString(locale, opts) {
        return new _duration_format_ponyfill_js__WEBPACK_IMPORTED_MODULE_0__["default"](locale, opts).format(this);
    }
}
function applyDuration(date, duration) {
    const r = new Date(date);
    r.setFullYear(r.getFullYear() + duration.years);
    r.setMonth(r.getMonth() + duration.months);
    r.setDate(r.getDate() + duration.weeks * 7 + duration.days);
    r.setHours(r.getHours() + duration.hours);
    r.setMinutes(r.getMinutes() + duration.minutes);
    r.setSeconds(r.getSeconds() + duration.seconds);
    return r;
}
function elapsedTime(date, precision = 'second', now = Date.now()) {
    const delta = date.getTime() - now;
    if (delta === 0)
        return new Duration();
    const sign = Math.sign(delta);
    const ms = Math.abs(delta);
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    const month = Math.floor(day / 30);
    const year = Math.floor(month / 12);
    const i = unitNames.indexOf(precision) || unitNames.length;
    return new Duration(i >= 0 ? year * sign : 0, i >= 1 ? (month - year * 12) * sign : 0, 0, i >= 3 ? (day - month * 30) * sign : 0, i >= 4 ? (hr - day * 24) * sign : 0, i >= 5 ? (min - hr * 60) * sign : 0, i >= 6 ? (sec - min * 60) * sign : 0, i >= 7 ? (ms - sec * 1000) * sign : 0);
}
function roundToSingleUnit(duration, { relativeTo = Date.now() } = {}) {
    relativeTo = new Date(relativeTo);
    if (duration.blank)
        return duration;
    const sign = duration.sign;
    let years = Math.abs(duration.years);
    let months = Math.abs(duration.months);
    let weeks = Math.abs(duration.weeks);
    let days = Math.abs(duration.days);
    let hours = Math.abs(duration.hours);
    let minutes = Math.abs(duration.minutes);
    let seconds = Math.abs(duration.seconds);
    let milliseconds = Math.abs(duration.milliseconds);
    if (milliseconds >= 900)
        seconds += Math.round(milliseconds / 1000);
    if (seconds || minutes || hours || days || weeks || months || years) {
        milliseconds = 0;
    }
    if (seconds >= 55)
        minutes += Math.round(seconds / 60);
    if (minutes || hours || days || weeks || months || years)
        seconds = 0;
    if (minutes >= 55)
        hours += Math.round(minutes / 60);
    if (hours || days || weeks || months || years)
        minutes = 0;
    if (days && hours >= 12)
        days += Math.round(hours / 24);
    if (!days && hours >= 21)
        days += Math.round(hours / 24);
    if (days || weeks || months || years)
        hours = 0;
    const currentYear = relativeTo.getFullYear();
    let currentMonth = relativeTo.getMonth();
    const currentDate = relativeTo.getDate();
    if (days >= 27 || years + months + days) {
        const newDate = new Date(relativeTo);
        newDate.setFullYear(currentYear + years * sign);
        newDate.setMonth(currentMonth + months * sign);
        newDate.setDate(currentDate + days * sign);
        const yearDiff = newDate.getFullYear() - relativeTo.getFullYear();
        const monthDiff = newDate.getMonth() - relativeTo.getMonth();
        const daysDiff = Math.abs(Math.round((Number(newDate) - Number(relativeTo)) / 86400000));
        const monthsDiff = Math.abs(yearDiff * 12 + monthDiff);
        if (daysDiff < 27) {
            if (days >= 6) {
                weeks += Math.round(days / 7);
                days = 0;
            }
            else {
                days = daysDiff;
            }
            months = years = 0;
        }
        else if (monthsDiff < 11) {
            months = monthsDiff;
            years = 0;
        }
        else {
            months = 0;
            years = yearDiff * sign;
        }
        if (months || years)
            days = 0;
        currentMonth = relativeTo.getMonth();
    }
    if (years)
        months = 0;
    if (weeks >= 4)
        months += Math.round(weeks / 4);
    if (months || years)
        weeks = 0;
    if (days && weeks && !months && !years) {
        weeks += Math.round(days / 7);
        days = 0;
    }
    return new Duration(years * sign, months * sign, weeks * sign, days * sign, hours * sign, minutes * sign, seconds * sign, milliseconds * sign);
}
function getRelativeTimeUnit(duration, opts) {
    const rounded = roundToSingleUnit(duration, opts);
    if (rounded.blank)
        return [0, 'second'];
    for (const unit of unitNames) {
        if (unit === 'millisecond')
            continue;
        const val = rounded[`${unit}s`];
        if (val)
            return [val, unit];
    }
    return [0, 'second'];
}


/***/ }),

/***/ "./node_modules/@github/relative-time-element/dist/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/@github/relative-time-element/dist/index.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RelativeTimeElement: function() { return /* reexport safe */ _relative_time_element_define_js__WEBPACK_IMPORTED_MODULE_0__["default"]; },
/* harmony export */   RelativeTimeUpdatedEvent: function() { return /* reexport safe */ _relative_time_element_define_js__WEBPACK_IMPORTED_MODULE_0__.RelativeTimeUpdatedEvent; }
/* harmony export */ });
/* harmony import */ var _relative_time_element_define_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./relative-time-element-define.js */ "./node_modules/@github/relative-time-element/dist/relative-time-element-define.js");


/* harmony default export */ __webpack_exports__["default"] = (_relative_time_element_define_js__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./node_modules/@github/relative-time-element/dist/relative-time-element-define.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@github/relative-time-element/dist/relative-time-element-define.js ***!
  \*****************************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RelativeTimeElement: function() { return /* reexport safe */ _relative_time_element_js__WEBPACK_IMPORTED_MODULE_0__.RelativeTimeElement; },
/* harmony export */   RelativeTimeUpdatedEvent: function() { return /* reexport safe */ _relative_time_element_js__WEBPACK_IMPORTED_MODULE_0__.RelativeTimeUpdatedEvent; }
/* harmony export */ });
/* harmony import */ var _relative_time_element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./relative-time-element.js */ "./node_modules/@github/relative-time-element/dist/relative-time-element.js");

const root = (typeof globalThis !== 'undefined' ? globalThis : window);
try {
    root.RelativeTimeElement = _relative_time_element_js__WEBPACK_IMPORTED_MODULE_0__.RelativeTimeElement.define();
}
catch (e) {
    if (!(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
        !(e instanceof ReferenceError)) {
        throw e;
    }
}
/* harmony default export */ __webpack_exports__["default"] = (_relative_time_element_js__WEBPACK_IMPORTED_MODULE_0__.RelativeTimeElement);



/***/ }),

/***/ "./node_modules/@github/relative-time-element/dist/relative-time-element.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@github/relative-time-element/dist/relative-time-element.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RelativeTimeElement: function() { return /* binding */ RelativeTimeElement; },
/* harmony export */   RelativeTimeUpdatedEvent: function() { return /* binding */ RelativeTimeUpdatedEvent; }
/* harmony export */ });
/* harmony import */ var _duration_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./duration.js */ "./node_modules/@github/relative-time-element/dist/duration.js");
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _RelativeTimeElement_instances, _RelativeTimeElement_customTitle, _RelativeTimeElement_updating, _RelativeTimeElement_lang_get, _RelativeTimeElement_renderRoot, _RelativeTimeElement_getFormattedTitle, _RelativeTimeElement_resolveFormat, _RelativeTimeElement_getDurationFormat, _RelativeTimeElement_getRelativeFormat, _RelativeTimeElement_getDateTimeFormat, _RelativeTimeElement_onRelativeTimeUpdated;

const HTMLElement = globalThis.HTMLElement || null;
const emptyDuration = new _duration_js__WEBPACK_IMPORTED_MODULE_0__.Duration();
const microEmptyDuration = new _duration_js__WEBPACK_IMPORTED_MODULE_0__.Duration(0, 0, 0, 0, 0, 1);
class RelativeTimeUpdatedEvent extends Event {
    constructor(oldText, newText, oldTitle, newTitle) {
        super('relative-time-updated', { bubbles: true, composed: true });
        this.oldText = oldText;
        this.newText = newText;
        this.oldTitle = oldTitle;
        this.newTitle = newTitle;
    }
}
function getUnitFactor(el) {
    if (!el.date)
        return Infinity;
    if (el.format === 'duration' || el.format === 'elapsed') {
        const precision = el.precision;
        if (precision === 'second') {
            return 1000;
        }
        else if (precision === 'minute') {
            return 60 * 1000;
        }
    }
    const ms = Math.abs(Date.now() - el.date.getTime());
    if (ms < 60 * 1000)
        return 1000;
    if (ms < 60 * 60 * 1000)
        return 60 * 1000;
    return 60 * 60 * 1000;
}
const dateObserver = new (class {
    constructor() {
        this.elements = new Set();
        this.time = Infinity;
        this.timer = -1;
    }
    observe(element) {
        if (this.elements.has(element))
            return;
        this.elements.add(element);
        const date = element.date;
        if (date && date.getTime()) {
            const ms = getUnitFactor(element);
            const time = Date.now() + ms;
            if (time < this.time) {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => this.update(), ms);
                this.time = time;
            }
        }
    }
    unobserve(element) {
        if (!this.elements.has(element))
            return;
        this.elements.delete(element);
    }
    update() {
        clearTimeout(this.timer);
        if (!this.elements.size)
            return;
        let nearestDistance = Infinity;
        for (const timeEl of this.elements) {
            nearestDistance = Math.min(nearestDistance, getUnitFactor(timeEl));
            timeEl.update();
        }
        this.time = Math.min(60 * 60 * 1000, nearestDistance);
        this.timer = setTimeout(() => this.update(), this.time);
        this.time += Date.now();
    }
})();
class RelativeTimeElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _RelativeTimeElement_instances.add(this);
        _RelativeTimeElement_customTitle.set(this, false);
        _RelativeTimeElement_updating.set(this, false);
        _RelativeTimeElement_renderRoot.set(this, this.shadowRoot ? this.shadowRoot : this.attachShadow ? this.attachShadow({ mode: 'open' }) : this);
        _RelativeTimeElement_onRelativeTimeUpdated.set(this, null);
    }
    static define(tag = 'relative-time', registry = customElements) {
        registry.define(tag, this);
        return this;
    }
    static get observedAttributes() {
        return [
            'second',
            'minute',
            'hour',
            'weekday',
            'day',
            'month',
            'year',
            'time-zone-name',
            'prefix',
            'threshold',
            'tense',
            'precision',
            'format',
            'format-style',
            'datetime',
            'lang',
            'title',
        ];
    }
    get onRelativeTimeUpdated() {
        return __classPrivateFieldGet(this, _RelativeTimeElement_onRelativeTimeUpdated, "f");
    }
    set onRelativeTimeUpdated(listener) {
        if (__classPrivateFieldGet(this, _RelativeTimeElement_onRelativeTimeUpdated, "f")) {
            this.removeEventListener('relative-time-updated', __classPrivateFieldGet(this, _RelativeTimeElement_onRelativeTimeUpdated, "f"));
        }
        __classPrivateFieldSet(this, _RelativeTimeElement_onRelativeTimeUpdated, typeof listener === 'object' || typeof listener === 'function' ? listener : null, "f");
        if (typeof listener === 'function') {
            this.addEventListener('relative-time-updated', listener);
        }
    }
    get second() {
        const second = this.getAttribute('second');
        if (second === 'numeric' || second === '2-digit')
            return second;
    }
    set second(value) {
        this.setAttribute('second', value || '');
    }
    get minute() {
        const minute = this.getAttribute('minute');
        if (minute === 'numeric' || minute === '2-digit')
            return minute;
    }
    set minute(value) {
        this.setAttribute('minute', value || '');
    }
    get hour() {
        const hour = this.getAttribute('hour');
        if (hour === 'numeric' || hour === '2-digit')
            return hour;
    }
    set hour(value) {
        this.setAttribute('hour', value || '');
    }
    get weekday() {
        const weekday = this.getAttribute('weekday');
        if (weekday === 'long' || weekday === 'short' || weekday === 'narrow') {
            return weekday;
        }
        if (this.format === 'datetime' && weekday !== '')
            return this.formatStyle;
    }
    set weekday(value) {
        this.setAttribute('weekday', value || '');
    }
    get day() {
        var _a;
        const day = (_a = this.getAttribute('day')) !== null && _a !== void 0 ? _a : 'numeric';
        if (day === 'numeric' || day === '2-digit')
            return day;
    }
    set day(value) {
        this.setAttribute('day', value || '');
    }
    get month() {
        const format = this.format;
        let month = this.getAttribute('month');
        if (month === '')
            return;
        month !== null && month !== void 0 ? month : (month = format === 'datetime' ? this.formatStyle : 'short');
        if (month === 'numeric' || month === '2-digit' || month === 'short' || month === 'long' || month === 'narrow') {
            return month;
        }
    }
    set month(value) {
        this.setAttribute('month', value || '');
    }
    get year() {
        var _a;
        const year = this.getAttribute('year');
        if (year === 'numeric' || year === '2-digit')
            return year;
        if (!this.hasAttribute('year') && new Date().getUTCFullYear() !== ((_a = this.date) === null || _a === void 0 ? void 0 : _a.getUTCFullYear())) {
            return 'numeric';
        }
    }
    set year(value) {
        this.setAttribute('year', value || '');
    }
    get timeZoneName() {
        const name = this.getAttribute('time-zone-name');
        if (name === 'long' ||
            name === 'short' ||
            name === 'shortOffset' ||
            name === 'longOffset' ||
            name === 'shortGeneric' ||
            name === 'longGeneric') {
            return name;
        }
    }
    set timeZoneName(value) {
        this.setAttribute('time-zone-name', value || '');
    }
    get prefix() {
        var _a;
        return (_a = this.getAttribute('prefix')) !== null && _a !== void 0 ? _a : (this.format === 'datetime' ? '' : 'on');
    }
    set prefix(value) {
        this.setAttribute('prefix', value);
    }
    get threshold() {
        const threshold = this.getAttribute('threshold');
        return threshold && (0,_duration_js__WEBPACK_IMPORTED_MODULE_0__.isDuration)(threshold) ? threshold : 'P30D';
    }
    set threshold(value) {
        this.setAttribute('threshold', value);
    }
    get tense() {
        const tense = this.getAttribute('tense');
        if (tense === 'past')
            return 'past';
        if (tense === 'future')
            return 'future';
        return 'auto';
    }
    set tense(value) {
        this.setAttribute('tense', value);
    }
    get precision() {
        const precision = this.getAttribute('precision');
        if (_duration_js__WEBPACK_IMPORTED_MODULE_0__.unitNames.includes(precision))
            return precision;
        if (this.format === 'micro')
            return 'minute';
        return 'second';
    }
    set precision(value) {
        this.setAttribute('precision', value);
    }
    get format() {
        const format = this.getAttribute('format');
        if (format === 'datetime')
            return 'datetime';
        if (format === 'relative')
            return 'relative';
        if (format === 'duration')
            return 'duration';
        if (format === 'micro')
            return 'micro';
        if (format === 'elapsed')
            return 'elapsed';
        return 'auto';
    }
    set format(value) {
        this.setAttribute('format', value);
    }
    get formatStyle() {
        const formatStyle = this.getAttribute('format-style');
        if (formatStyle === 'long')
            return 'long';
        if (formatStyle === 'short')
            return 'short';
        if (formatStyle === 'narrow')
            return 'narrow';
        const format = this.format;
        if (format === 'elapsed' || format === 'micro')
            return 'narrow';
        if (format === 'datetime')
            return 'short';
        return 'long';
    }
    set formatStyle(value) {
        this.setAttribute('format-style', value);
    }
    get datetime() {
        return this.getAttribute('datetime') || '';
    }
    set datetime(value) {
        this.setAttribute('datetime', value);
    }
    get date() {
        const parsed = Date.parse(this.datetime);
        return Number.isNaN(parsed) ? null : new Date(parsed);
    }
    set date(value) {
        this.datetime = (value === null || value === void 0 ? void 0 : value.toISOString()) || '';
    }
    connectedCallback() {
        this.update();
    }
    disconnectedCallback() {
        dateObserver.unobserve(this);
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        if (oldValue === newValue)
            return;
        if (attrName === 'title') {
            __classPrivateFieldSet(this, _RelativeTimeElement_customTitle, newValue !== null && (this.date && __classPrivateFieldGet(this, _RelativeTimeElement_instances, "m", _RelativeTimeElement_getFormattedTitle).call(this, this.date)) !== newValue, "f");
        }
        if (!__classPrivateFieldGet(this, _RelativeTimeElement_updating, "f") && !(attrName === 'title' && __classPrivateFieldGet(this, _RelativeTimeElement_customTitle, "f"))) {
            __classPrivateFieldSet(this, _RelativeTimeElement_updating, (async () => {
                await Promise.resolve();
                this.update();
            })(), "f");
        }
    }
    update() {
        const oldText = __classPrivateFieldGet(this, _RelativeTimeElement_renderRoot, "f").textContent || this.textContent || '';
        const oldTitle = this.getAttribute('title') || '';
        let newTitle = oldTitle;
        const date = this.date;
        if (typeof Intl === 'undefined' || !Intl.DateTimeFormat || !date) {
            __classPrivateFieldGet(this, _RelativeTimeElement_renderRoot, "f").textContent = oldText;
            return;
        }
        const now = Date.now();
        if (!__classPrivateFieldGet(this, _RelativeTimeElement_customTitle, "f")) {
            newTitle = __classPrivateFieldGet(this, _RelativeTimeElement_instances, "m", _RelativeTimeElement_getFormattedTitle).call(this, date) || '';
            if (newTitle)
                this.setAttribute('title', newTitle);
        }
        const duration = (0,_duration_js__WEBPACK_IMPORTED_MODULE_0__.elapsedTime)(date, this.precision, now);
        const format = __classPrivateFieldGet(this, _RelativeTimeElement_instances, "m", _RelativeTimeElement_resolveFormat).call(this, duration);
        let newText = oldText;
        if (format === 'duration') {
            newText = __classPrivateFieldGet(this, _RelativeTimeElement_instances, "m", _RelativeTimeElement_getDurationFormat).call(this, duration);
        }
        else if (format === 'relative') {
            newText = __classPrivateFieldGet(this, _RelativeTimeElement_instances, "m", _RelativeTimeElement_getRelativeFormat).call(this, duration);
        }
        else {
            newText = __classPrivateFieldGet(this, _RelativeTimeElement_instances, "m", _RelativeTimeElement_getDateTimeFormat).call(this, date);
        }
        if (newText) {
            __classPrivateFieldGet(this, _RelativeTimeElement_renderRoot, "f").textContent = newText;
        }
        else if (this.shadowRoot === __classPrivateFieldGet(this, _RelativeTimeElement_renderRoot, "f") && this.textContent) {
            __classPrivateFieldGet(this, _RelativeTimeElement_renderRoot, "f").textContent = this.textContent;
        }
        if (newText !== oldText || newTitle !== oldTitle) {
            this.dispatchEvent(new RelativeTimeUpdatedEvent(oldText, newText, oldTitle, newTitle));
        }
        if (format === 'relative' || format === 'duration') {
            dateObserver.observe(this);
        }
        else {
            dateObserver.unobserve(this);
        }
        __classPrivateFieldSet(this, _RelativeTimeElement_updating, false, "f");
    }
}
_RelativeTimeElement_customTitle = new WeakMap(), _RelativeTimeElement_updating = new WeakMap(), _RelativeTimeElement_renderRoot = new WeakMap(), _RelativeTimeElement_onRelativeTimeUpdated = new WeakMap(), _RelativeTimeElement_instances = new WeakSet(), _RelativeTimeElement_lang_get = function _RelativeTimeElement_lang_get() {
    var _a;
    return (((_a = this.closest('[lang]')) === null || _a === void 0 ? void 0 : _a.getAttribute('lang')) ||
        this.ownerDocument.documentElement.getAttribute('lang') ||
        'default');
}, _RelativeTimeElement_getFormattedTitle = function _RelativeTimeElement_getFormattedTitle(date) {
    return new Intl.DateTimeFormat(__classPrivateFieldGet(this, _RelativeTimeElement_instances, "a", _RelativeTimeElement_lang_get), {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
    }).format(date);
}, _RelativeTimeElement_resolveFormat = function _RelativeTimeElement_resolveFormat(duration) {
    const format = this.format;
    if (format === 'datetime')
        return 'datetime';
    if (format === 'duration')
        return 'duration';
    if (format === 'elapsed')
        return 'duration';
    if (format === 'micro')
        return 'duration';
    if ((format === 'auto' || format === 'relative') && typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
        const tense = this.tense;
        if (tense === 'past' || tense === 'future')
            return 'relative';
        if (_duration_js__WEBPACK_IMPORTED_MODULE_0__.Duration.compare(duration, this.threshold) === 1)
            return 'relative';
    }
    return 'datetime';
}, _RelativeTimeElement_getDurationFormat = function _RelativeTimeElement_getDurationFormat(duration) {
    const locale = __classPrivateFieldGet(this, _RelativeTimeElement_instances, "a", _RelativeTimeElement_lang_get);
    const format = this.format;
    const style = this.formatStyle;
    const tense = this.tense;
    let empty = emptyDuration;
    if (format === 'micro') {
        duration = (0,_duration_js__WEBPACK_IMPORTED_MODULE_0__.roundToSingleUnit)(duration);
        empty = microEmptyDuration;
        if ((this.tense === 'past' && duration.sign !== -1) || (this.tense === 'future' && duration.sign !== 1)) {
            duration = microEmptyDuration;
        }
    }
    else if ((tense === 'past' && duration.sign !== -1) || (tense === 'future' && duration.sign !== 1)) {
        duration = empty;
    }
    const display = `${this.precision}sDisplay`;
    if (duration.blank) {
        return empty.toLocaleString(locale, { style, [display]: 'always' });
    }
    return duration.abs().toLocaleString(locale, { style });
}, _RelativeTimeElement_getRelativeFormat = function _RelativeTimeElement_getRelativeFormat(duration) {
    const relativeFormat = new Intl.RelativeTimeFormat(__classPrivateFieldGet(this, _RelativeTimeElement_instances, "a", _RelativeTimeElement_lang_get), {
        numeric: 'auto',
        style: this.formatStyle,
    });
    const tense = this.tense;
    if (tense === 'future' && duration.sign !== 1)
        duration = emptyDuration;
    if (tense === 'past' && duration.sign !== -1)
        duration = emptyDuration;
    const [int, unit] = (0,_duration_js__WEBPACK_IMPORTED_MODULE_0__.getRelativeTimeUnit)(duration);
    if (unit === 'second' && int < 10) {
        return relativeFormat.format(0, this.precision === 'millisecond' ? 'second' : this.precision);
    }
    return relativeFormat.format(int, unit);
}, _RelativeTimeElement_getDateTimeFormat = function _RelativeTimeElement_getDateTimeFormat(date) {
    const formatter = new Intl.DateTimeFormat(__classPrivateFieldGet(this, _RelativeTimeElement_instances, "a", _RelativeTimeElement_lang_get), {
        second: this.second,
        minute: this.minute,
        hour: this.hour,
        weekday: this.weekday,
        day: this.day,
        month: this.month,
        year: this.year,
        timeZoneName: this.timeZoneName,
    });
    return `${this.prefix} ${formatter.format(date)}`.trim();
};
/* harmony default export */ __webpack_exports__["default"] = (RelativeTimeElement);


/***/ }),

/***/ "./web_src/js/modules/tippy.js":
/*!*************************************!*\
  !*** ./web_src/js/modules/tippy.js ***!
  \*************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTippy: function() { return /* binding */ createTippy; },
/* harmony export */   initGlobalTooltips: function() { return /* binding */ initGlobalTooltips; },
/* harmony export */   showTemporaryTooltip: function() { return /* binding */ showTemporaryTooltip; }
/* harmony export */ });
/* harmony import */ var tippy_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tippy.js */ "./node_modules/tippy.js/dist/tippy.esm.js");
/* harmony import */ var _utils_dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/dom.js */ "./web_src/js/utils/dom.js");
/* harmony import */ var _utils_time_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/time.js */ "./web_src/js/utils/time.js");



const visibleInstances = /* @__PURE__ */ new Set();
const arrowSvg = `<svg width="16" height="7"><path d="m0 7 8-7 8 7Z" class="tippy-svg-arrow-outer"/><path d="m0 8 8-7 8 7Z" class="tippy-svg-arrow-inner"/></svg>`;
function createTippy(target, opts = {}) {
  const { onHide, onShow, onDestroy, role, theme, arrow, ...other } = opts;
  const instance = (0,tippy_js__WEBPACK_IMPORTED_MODULE_2__["default"])(target, {
    appendTo: document.body,
    animation: false,
    allowHTML: false,
    hideOnClick: false,
    interactiveBorder: 20,
    ignoreAttributes: true,
    maxWidth: 500,
    // increase over default 350px
    onHide: (instance2) => {
      visibleInstances.delete(instance2);
      return onHide?.(instance2);
    },
    onDestroy: (instance2) => {
      visibleInstances.delete(instance2);
      return onDestroy?.(instance2);
    },
    onShow: (instance2) => {
      for (const visibleInstance of visibleInstances) {
        if (visibleInstance.props.role === "tooltip") {
          visibleInstance.hide();
        }
      }
      visibleInstances.add(instance2);
      return onShow?.(instance2);
    },
    arrow: arrow || (theme === "bare" ? false : arrowSvg),
    // HTML role attribute, ideally the default role would be "popover" but it does not exist
    role: role || "menu",
    // CSS theme, either "default", "tooltip", "menu", "box-with-header" or "bare"
    theme: theme || role || "default",
    plugins: [tippy_js__WEBPACK_IMPORTED_MODULE_2__.followCursor],
    ...other
  });
  if (role === "menu") {
    target.setAttribute("aria-haspopup", "true");
  }
  return instance;
}
function attachTooltip(target, content = null) {
  switchTitleToTooltip(target);
  content = content ?? target.getAttribute("data-tooltip-content");
  if (!content)
    return null;
  const hasClipboardTarget = target.hasAttribute("data-clipboard-target");
  const hideOnClick = !hasClipboardTarget;
  const props = {
    content,
    delay: 100,
    role: "tooltip",
    theme: "tooltip",
    hideOnClick,
    placement: target.getAttribute("data-tooltip-placement") || "top-start",
    followCursor: target.getAttribute("data-tooltip-follow-cursor") || false,
    ...target.getAttribute("data-tooltip-interactive") === "true" ? { interactive: true, aria: { content: "describedby", expanded: false } } : {}
  };
  if (!target._tippy) {
    createTippy(target, props);
  } else {
    target._tippy.setProps(props);
  }
  return target._tippy;
}
function switchTitleToTooltip(target) {
  let title = target.getAttribute("title");
  if (title) {
    if (target.tagName.toLowerCase() === "relative-time") {
      const datetime = target.getAttribute("datetime");
      if (datetime) {
        title = (0,_utils_time_js__WEBPACK_IMPORTED_MODULE_1__.formatDatetime)(new Date(datetime));
      }
    }
    target.setAttribute("data-tooltip-content", title);
    target.setAttribute("aria-label", title);
    target.setAttribute("title", "");
  }
}
function lazyTooltipOnMouseHover(e) {
  e.target.removeEventListener("mouseover", lazyTooltipOnMouseHover, true);
  attachTooltip(this);
}
function attachLazyTooltip(el) {
  el.addEventListener("mouseover", lazyTooltipOnMouseHover, { capture: true });
  if (!el.hasAttribute("aria-label")) {
    const content = el.getAttribute("data-tooltip-content");
    if (content) {
      el.setAttribute("aria-label", content);
    }
  }
}
function attachChildrenLazyTooltip(target) {
  for (const el of target.querySelectorAll("[data-tooltip-content]")) {
    attachLazyTooltip(el);
  }
}
function initGlobalTooltips() {
  const observerConnect = (observer2) => observer2.observe(document, {
    subtree: true,
    childList: true,
    attributeFilter: ["data-tooltip-content", "title"]
  });
  const observer = new MutationObserver((mutationList, observer2) => {
    const pending = observer2.takeRecords();
    observer2.disconnect();
    for (const mutation of [...mutationList, ...pending]) {
      if (mutation.type === "childList") {
        for (const el of mutation.addedNodes) {
          if (!(0,_utils_dom_js__WEBPACK_IMPORTED_MODULE_0__.isDocumentFragmentOrElementNode)(el))
            continue;
          attachChildrenLazyTooltip(el);
          if (el.hasAttribute("data-tooltip-content")) {
            attachLazyTooltip(el);
          }
        }
      } else if (mutation.type === "attributes") {
        attachTooltip(mutation.target);
      }
    }
    observerConnect(observer2);
  });
  observerConnect(observer);
  attachChildrenLazyTooltip(document.documentElement);
}
function showTemporaryTooltip(target, content) {
  if (target.closest(".ui.dropdown > .menu"))
    return;
  const tippy2 = target._tippy ?? attachTooltip(target, content);
  tippy2.setContent(content);
  if (!tippy2.state.isShown)
    tippy2.show();
  tippy2.setProps({
    onHidden: (tippy3) => {
      if (!attachTooltip(target)) {
        tippy3.destroy();
      }
    }
  });
}


/***/ }),

/***/ "./web_src/js/utils.js":
/*!*****************************!*\
  !*** ./web_src/js/utils.js ***!
  \*****************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   basename: function() { return /* binding */ basename; },
/* harmony export */   blobToDataURI: function() { return /* binding */ blobToDataURI; },
/* harmony export */   convertImage: function() { return /* binding */ convertImage; },
/* harmony export */   decodeURLEncodedBase64: function() { return /* binding */ decodeURLEncodedBase64; },
/* harmony export */   encodeURLEncodedBase64: function() { return /* binding */ encodeURLEncodedBase64; },
/* harmony export */   extname: function() { return /* binding */ extname; },
/* harmony export */   getCurrentLocale: function() { return /* binding */ getCurrentLocale; },
/* harmony export */   isDarkTheme: function() { return /* binding */ isDarkTheme; },
/* harmony export */   isObject: function() { return /* binding */ isObject; },
/* harmony export */   parseDom: function() { return /* binding */ parseDom; },
/* harmony export */   parseIssueHref: function() { return /* binding */ parseIssueHref; },
/* harmony export */   parseUrl: function() { return /* binding */ parseUrl; },
/* harmony export */   serializeXml: function() { return /* binding */ serializeXml; },
/* harmony export */   sleep: function() { return /* binding */ sleep; },
/* harmony export */   stripTags: function() { return /* binding */ stripTags; },
/* harmony export */   toAbsoluteUrl: function() { return /* binding */ toAbsoluteUrl; },
/* harmony export */   translateDay: function() { return /* binding */ translateDay; },
/* harmony export */   translateMonth: function() { return /* binding */ translateMonth; }
/* harmony export */ });
/* harmony import */ var uint8_to_base64__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uint8-to-base64 */ "./node_modules/uint8-to-base64/esm/index.js");

function basename(path = "") {
  const lastSlashIndex = path.lastIndexOf("/");
  return lastSlashIndex < 0 ? path : path.substring(lastSlashIndex + 1);
}
function extname(path = "") {
  const lastPointIndex = path.lastIndexOf(".");
  return lastPointIndex < 0 ? "" : path.substring(lastPointIndex);
}
function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
function isDarkTheme() {
  const style = window.getComputedStyle(document.documentElement);
  return style.getPropertyValue("--is-dark-theme").trim().toLowerCase() === "true";
}
function stripTags(text) {
  return text.replace(/<[^>]*>?/g, "");
}
function parseIssueHref(href) {
  const path = (href || "").replace(/[#?].*$/, "");
  const [_, owner, repo, type, index] = /([^/]+)\/([^/]+)\/(issues|pulls)\/([0-9]+)/.exec(path) || [];
  return { owner, repo, type, index };
}
function parseUrl(str) {
  return new URL(str, str.startsWith("http") ? void 0 : window.location.origin);
}
function getCurrentLocale() {
  return document.documentElement.lang;
}
function translateMonth(month) {
  return new Date(Date.UTC(2022, month, 12)).toLocaleString(getCurrentLocale(), { month: "short", timeZone: "UTC" });
}
function translateDay(day) {
  return new Date(Date.UTC(2022, 7, day)).toLocaleString(getCurrentLocale(), { weekday: "short", timeZone: "UTC" });
}
function blobToDataURI(blob) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.addEventListener("load", (e) => {
        resolve(e.target.result);
      });
      reader.addEventListener("error", () => {
        reject(new Error("FileReader failed"));
      });
      reader.readAsDataURL(blob);
    } catch (err) {
      reject(err);
    }
  });
}
function convertImage(blob, mime) {
  return new Promise(async (resolve, reject) => {
    try {
      const img = new Image();
      const canvas = document.createElement("canvas");
      img.addEventListener("load", () => {
        try {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const context = canvas.getContext("2d");
          context.drawImage(img, 0, 0);
          canvas.toBlob((blob2) => {
            if (!(blob2 instanceof Blob))
              return reject(new Error("imageBlobToPng failed"));
            resolve(blob2);
          }, mime);
        } catch (err) {
          reject(err);
        }
      });
      img.addEventListener("error", () => {
        reject(new Error("imageBlobToPng failed"));
      });
      img.src = await blobToDataURI(blob);
    } catch (err) {
      reject(err);
    }
  });
}
function toAbsoluteUrl(url) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("//")) {
    return `${window.location.protocol}${url}`;
  }
  if (url && !url.startsWith("/")) {
    throw new Error("unsupported url, it should either start with / or http(s)://");
  }
  return `${window.location.origin}${url}`;
}
function encodeURLEncodedBase64(arrayBuffer) {
  return (0,uint8_to_base64__WEBPACK_IMPORTED_MODULE_0__.encode)(arrayBuffer).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function decodeURLEncodedBase64(base64url) {
  return (0,uint8_to_base64__WEBPACK_IMPORTED_MODULE_0__.decode)(base64url.replace(/_/g, "/").replace(/-/g, "+"));
}
const domParser = new DOMParser();
const xmlSerializer = new XMLSerializer();
function parseDom(text, contentType) {
  return domParser.parseFromString(text, contentType);
}
function serializeXml(node) {
  return xmlSerializer.serializeToString(node);
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


/***/ }),

/***/ "./web_src/js/utils/dom.js":
/*!*********************************!*\
  !*** ./web_src/js/utils/dom.js ***!
  \*********************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   autosize: function() { return /* binding */ autosize; },
/* harmony export */   getPastedContent: function() { return /* binding */ getPastedContent; },
/* harmony export */   hideElem: function() { return /* binding */ hideElem; },
/* harmony export */   initSubmitEventPolyfill: function() { return /* binding */ initSubmitEventPolyfill; },
/* harmony export */   isDocumentFragmentOrElementNode: function() { return /* binding */ isDocumentFragmentOrElementNode; },
/* harmony export */   isElemHidden: function() { return /* binding */ isElemHidden; },
/* harmony export */   isElemVisible: function() { return /* binding */ isElemVisible; },
/* harmony export */   loadElem: function() { return /* binding */ loadElem; },
/* harmony export */   onDomReady: function() { return /* binding */ onDomReady; },
/* harmony export */   onInputDebounce: function() { return /* binding */ onInputDebounce; },
/* harmony export */   queryElemChildren: function() { return /* binding */ queryElemChildren; },
/* harmony export */   queryElemSiblings: function() { return /* binding */ queryElemSiblings; },
/* harmony export */   queryElems: function() { return /* binding */ queryElems; },
/* harmony export */   replaceTextareaSelection: function() { return /* binding */ replaceTextareaSelection; },
/* harmony export */   showElem: function() { return /* binding */ showElem; },
/* harmony export */   submitEventSubmitter: function() { return /* binding */ submitEventSubmitter; },
/* harmony export */   toggleElem: function() { return /* binding */ toggleElem; }
/* harmony export */ });
/* harmony import */ var throttle_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! throttle-debounce */ "./node_modules/throttle-debounce/esm/index.js");

function elementsCall(el, func, ...args) {
  if (typeof el === "string" || el instanceof String) {
    el = document.querySelectorAll(el);
  }
  if (el instanceof Node) {
    func(el, ...args);
  } else if (el.length !== void 0) {
    for (const e of el) {
      func(e, ...args);
    }
  } else {
    throw new Error("invalid argument to be shown/hidden");
  }
}
function toggleShown(el, force) {
  if (force === true) {
    el.classList.remove("tw-hidden");
  } else if (force === false) {
    el.classList.add("tw-hidden");
  } else if (force === void 0) {
    el.classList.toggle("tw-hidden");
  } else {
    throw new Error("invalid force argument");
  }
}
function showElem(el) {
  elementsCall(el, toggleShown, true);
}
function hideElem(el) {
  elementsCall(el, toggleShown, false);
}
function toggleElem(el, force) {
  elementsCall(el, toggleShown, force);
}
function isElemHidden(el) {
  const res = [];
  elementsCall(el, (e) => res.push(e.classList.contains("tw-hidden")));
  if (res.length > 1)
    throw new Error(`isElemHidden doesn't work for multiple elements`);
  return res[0];
}
function applyElemsCallback(elems, fn) {
  if (fn) {
    for (const el of elems) {
      fn(el);
    }
  }
  return elems;
}
function queryElemSiblings(el, selector = "*", fn) {
  return applyElemsCallback(Array.from(el.parentNode.children).filter((child) => child !== el && child.matches(selector)), fn);
}
function queryElemChildren(parent, selector = "*", fn) {
  return applyElemsCallback(parent.querySelectorAll(`:scope > ${selector}`), fn);
}
function queryElems(selector, fn) {
  return applyElemsCallback(document.querySelectorAll(selector), fn);
}
function onDomReady(cb) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cb);
  } else {
    cb();
  }
}
function isDocumentFragmentOrElementNode(el) {
  try {
    return el.ownerDocument === document && el.nodeType === Node.ELEMENT_NODE || el.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
  } catch {
    return false;
  }
}
function autosize(textarea, { viewportMarginBottom = 0 } = {}) {
  let isUserResized = false;
  let lastMouseX, lastMouseY, lastStyleHeight, initialStyleHeight;
  function onUserResize(event) {
    if (isUserResized)
      return;
    if (lastMouseX !== event.clientX || lastMouseY !== event.clientY) {
      const newStyleHeight = textarea.style.height;
      if (lastStyleHeight && lastStyleHeight !== newStyleHeight) {
        isUserResized = true;
      }
      lastStyleHeight = newStyleHeight;
    }
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }
  function overflowOffset() {
    let offsetTop = 0;
    let el = textarea;
    while (el !== document.body && el !== null) {
      offsetTop += el.offsetTop || 0;
      el = el.offsetParent;
    }
    const top = offsetTop - document.defaultView.scrollY;
    const bottom = document.documentElement.clientHeight - (top + textarea.offsetHeight);
    return { top, bottom };
  }
  function resizeToFit() {
    if (isUserResized)
      return;
    if (textarea.offsetWidth <= 0 && textarea.offsetHeight <= 0)
      return;
    try {
      const { top, bottom } = overflowOffset();
      const isOutOfViewport = top < 0 || bottom < 0;
      const computedStyle = getComputedStyle(textarea);
      const topBorderWidth = parseFloat(computedStyle.borderTopWidth);
      const bottomBorderWidth = parseFloat(computedStyle.borderBottomWidth);
      const isBorderBox = computedStyle.boxSizing === "border-box";
      const borderAddOn = isBorderBox ? topBorderWidth + bottomBorderWidth : 0;
      const adjustedViewportMarginBottom = bottom < viewportMarginBottom ? bottom : viewportMarginBottom;
      const curHeight = parseFloat(computedStyle.height);
      const maxHeight = curHeight + bottom - adjustedViewportMarginBottom;
      textarea.style.height = "auto";
      let newHeight = textarea.scrollHeight + borderAddOn;
      if (isOutOfViewport) {
        if (newHeight > curHeight) {
          newHeight = curHeight;
        }
      } else {
        newHeight = Math.min(maxHeight, newHeight);
      }
      textarea.style.height = `${newHeight}px`;
      lastStyleHeight = textarea.style.height;
    } finally {
      if (textarea.selectionStart === textarea.selectionEnd && textarea.selectionStart === textarea.value.length) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    }
  }
  function onFormReset() {
    isUserResized = false;
    if (initialStyleHeight !== void 0) {
      textarea.style.height = initialStyleHeight;
    } else {
      textarea.style.removeProperty("height");
    }
  }
  textarea.addEventListener("mousemove", onUserResize);
  textarea.addEventListener("input", resizeToFit);
  textarea.form?.addEventListener("reset", onFormReset);
  initialStyleHeight = textarea.style.height ?? void 0;
  if (textarea.value)
    resizeToFit();
  return {
    resizeToFit,
    destroy() {
      textarea.removeEventListener("mousemove", onUserResize);
      textarea.removeEventListener("input", resizeToFit);
      textarea.form?.removeEventListener("reset", onFormReset);
    }
  };
}
function onInputDebounce(fn) {
  return (0,throttle_debounce__WEBPACK_IMPORTED_MODULE_0__.debounce)(300, fn);
}
function loadElem(el, src) {
  return new Promise((resolve) => {
    el.addEventListener("load", () => resolve(true), { once: true });
    el.addEventListener("error", () => resolve(false), { once: true });
    el.src = src;
  });
}
const needSubmitEventPolyfill = typeof SubmitEvent === "undefined";
function submitEventSubmitter(e) {
  e = e.originalEvent ?? e;
  return needSubmitEventPolyfill ? e.target._submitter || null : e.submitter;
}
function submitEventPolyfillListener(e) {
  const form = e.target.closest("form");
  if (!form)
    return;
  form._submitter = e.target.closest('button:not([type]), button[type="submit"], input[type="submit"]');
}
function initSubmitEventPolyfill() {
  if (!needSubmitEventPolyfill)
    return;
  console.warn(`This browser doesn't have "SubmitEvent" support, use a tricky method to polyfill`);
  document.body.addEventListener("click", submitEventPolyfillListener);
  document.body.addEventListener("focus", submitEventPolyfillListener);
}
function isElemVisible(element) {
  if (!element)
    return false;
  return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}
function getPastedContent(e) {
  const images = [];
  for (const item of e.clipboardData?.items ?? []) {
    if (item.type?.startsWith("image/")) {
      images.push(item.getAsFile());
    }
  }
  const text = e.clipboardData?.getData?.("text") ?? "";
  return { text, images };
}
function replaceTextareaSelection(textarea, text) {
  const before = textarea.value.slice(0, textarea.selectionStart ?? void 0);
  const after = textarea.value.slice(textarea.selectionEnd ?? void 0);
  let success = true;
  textarea.contentEditable = "true";
  try {
    success = document.execCommand("insertText", false, text);
  } catch {
    success = false;
  }
  textarea.contentEditable = "false";
  if (success && !textarea.value.slice(0, textarea.selectionStart ?? void 0).endsWith(text)) {
    success = false;
  }
  if (!success) {
    textarea.value = `${before}${text}${after}`;
    textarea.dispatchEvent(new CustomEvent("change", { bubbles: true, cancelable: true }));
  }
}


/***/ }),

/***/ "./web_src/js/utils/time.js":
/*!**********************************!*\
  !*** ./web_src/js/utils/time.js ***!
  \**********************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fillEmptyStartDaysWithZeroes: function() { return /* binding */ fillEmptyStartDaysWithZeroes; },
/* harmony export */   firstStartDateAfterDate: function() { return /* binding */ firstStartDateAfterDate; },
/* harmony export */   formatDatetime: function() { return /* binding */ formatDatetime; },
/* harmony export */   startDaysBetween: function() { return /* binding */ startDaysBetween; }
/* harmony export */ });
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./web_src/js/utils.js");


function startDaysBetween(startDate, endDate) {
  while (startDate.getDay() !== 0) {
    startDate.setDate(startDate.getDate() + 1);
  }
  const start = dayjs__WEBPACK_IMPORTED_MODULE_0__(startDate);
  const end = dayjs__WEBPACK_IMPORTED_MODULE_0__(endDate);
  const startDays = [];
  let current = start;
  while (current.isBefore(end)) {
    startDays.push(current.valueOf());
    current = current.add(7 * 24, "hour");
  }
  return startDays;
}
function firstStartDateAfterDate(inputDate) {
  if (!(inputDate instanceof Date)) {
    throw new Error("Invalid date");
  }
  const dayOfWeek = inputDate.getDay();
  const daysUntilSunday = 7 - dayOfWeek;
  const resultDate = new Date(inputDate.getTime());
  resultDate.setDate(resultDate.getDate() + daysUntilSunday);
  return resultDate.valueOf();
}
function fillEmptyStartDaysWithZeroes(startDays, data) {
  const result = {};
  for (const startDay of startDays) {
    result[startDay] = data[startDay] || { "week": startDay, "additions": 0, "deletions": 0, "commits": 0 };
  }
  return Object.values(result);
}
let dateFormat;
function formatDatetime(date) {
  if (!dateFormat) {
    dateFormat = new Intl.DateTimeFormat((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getCurrentLocale)(), {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      hour12: !Number.isInteger(Number(new Intl.DateTimeFormat([], { hour: "numeric" }).format())),
      minute: "2-digit",
      timeZoneName: "short"
    });
  }
  return dateFormat.format(date);
}


/***/ }),

/***/ "./web_src/js/webcomponents/absolute-date.js":
/*!***************************************************!*\
  !*** ./web_src/js/webcomponents/absolute-date.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toAbsoluteLocaleDate: function() { return /* binding */ toAbsoluteLocaleDate; }
/* harmony export */ });
/* harmony import */ var temporal_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! temporal-polyfill */ "./node_modules/temporal-polyfill/chunks/classApi.js");
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var _a;

function toAbsoluteLocaleDate(dateStr, lang, opts) {
  return temporal_polyfill__WEBPACK_IMPORTED_MODULE_0__.Temporal.PlainDate.from(dateStr).toLocaleString(lang ?? [], opts);
}
window.customElements.define("absolute-date", (_a = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __publicField(this, "update", () => {
      const year = this.getAttribute("year") ?? "";
      const month = this.getAttribute("month") ?? "";
      const weekday = this.getAttribute("weekday") ?? "";
      const day = this.getAttribute("day") ?? "";
      const lang = this.closest("[lang]")?.getAttribute("lang") || this.ownerDocument.documentElement.getAttribute("lang") || "";
      const dateStr = this.getAttribute("date").substring(0, 10);
      if (!this.shadowRoot)
        this.attachShadow({ mode: "open" });
      this.shadowRoot.textContent = toAbsoluteLocaleDate(dateStr, lang, {
        ...year && { year },
        ...month && { month },
        ...weekday && { weekday },
        ...day && { day }
      });
    });
  }
  attributeChangedCallback(_name, oldValue, newValue) {
    if (!this.initialized || oldValue === newValue)
      return;
    this.update();
  }
  connectedCallback() {
    this.initialized = false;
    this.update();
    this.initialized = true;
  }
}, __publicField(_a, "observedAttributes", ["date", "year", "month", "weekday", "day"]), _a));


/***/ }),

/***/ "./web_src/js/webcomponents/origin-url.js":
/*!************************************************!*\
  !*** ./web_src/js/webcomponents/origin-url.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toOriginUrl: function() { return /* binding */ toOriginUrl; }
/* harmony export */ });
function toOriginUrl(urlStr) {
  try {
    if (urlStr.startsWith("http://") || urlStr.startsWith("https://") || urlStr.startsWith("/")) {
      const { origin, protocol, hostname, port } = window.location;
      const url = new URL(urlStr, origin);
      url.protocol = protocol;
      url.hostname = hostname;
      url.port = port || (protocol === "https:" ? "443" : "80");
      return url.toString();
    }
  } catch {
  }
  return urlStr;
}
window.customElements.define("origin-url", class extends HTMLElement {
  connectedCallback() {
    this.textContent = toOriginUrl(this.getAttribute("data-url"));
  }
});


/***/ }),

/***/ "./web_src/js/webcomponents/overflow-menu.js":
/*!***************************************************!*\
  !*** ./web_src/js/webcomponents/overflow-menu.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var throttle_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! throttle-debounce */ "./node_modules/throttle-debounce/esm/index.js");
/* harmony import */ var _modules_tippy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/tippy.js */ "./web_src/js/modules/tippy.js");
/* harmony import */ var _utils_dom_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/dom.js */ "./web_src/js/utils/dom.js");
/* harmony import */ var _public_assets_img_svg_octicon_kebab_horizontal_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../public/assets/img/svg/octicon-kebab-horizontal.svg */ "./public/assets/img/svg/octicon-kebab-horizontal.svg");
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};




window.customElements.define("overflow-menu", class extends HTMLElement {
  constructor() {
    super(...arguments);
    __publicField(this, "updateItems", (0,throttle_debounce__WEBPACK_IMPORTED_MODULE_0__.throttle)(100, () => {
      if (!this.tippyContent) {
        const div = document.createElement("div");
        div.classList.add("tippy-target");
        div.tabIndex = -1;
        div.addEventListener("keydown", (e) => {
          if (e.key === "Tab") {
            const items = this.tippyContent.querySelectorAll('[role="menuitem"]');
            if (e.shiftKey) {
              if (document.activeElement === items[0]) {
                e.preventDefault();
                items[items.length - 1].focus();
              }
            } else {
              if (document.activeElement === items[items.length - 1]) {
                e.preventDefault();
                items[0].focus();
              }
            }
          } else if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            this.button._tippy.hide();
            this.button.focus();
          } else if (e.key === " " || e.code === "Enter") {
            if (document.activeElement?.matches('[role="menuitem"]')) {
              e.preventDefault();
              e.stopPropagation();
              document.activeElement.click();
            }
          } else if (e.key === "ArrowDown") {
            if (document.activeElement?.matches(".tippy-target")) {
              e.preventDefault();
              e.stopPropagation();
              document.activeElement.querySelector('[role="menuitem"]:first-of-type').focus();
            } else if (document.activeElement?.matches('[role="menuitem"]')) {
              e.preventDefault();
              e.stopPropagation();
              document.activeElement.nextElementSibling?.focus();
            }
          } else if (e.key === "ArrowUp") {
            if (document.activeElement?.matches(".tippy-target")) {
              e.preventDefault();
              e.stopPropagation();
              document.activeElement.querySelector('[role="menuitem"]:last-of-type').focus();
            } else if (document.activeElement?.matches('[role="menuitem"]')) {
              e.preventDefault();
              e.stopPropagation();
              document.activeElement.previousElementSibling?.focus();
            }
          }
        });
        this.append(div);
        this.tippyContent = div;
      }
      const itemFlexSpace = this.menuItemsEl.querySelector(".item-flex-space");
      for (const item of this.tippyItems || []) {
        if (!itemFlexSpace || item.getAttribute("data-after-flex-space")) {
          this.menuItemsEl.append(item);
        } else {
          itemFlexSpace.insertAdjacentElement("beforebegin", item);
        }
      }
      itemFlexSpace?.style.setProperty("display", "none", "important");
      this.tippyItems = [];
      const menuRight = this.offsetLeft + this.offsetWidth;
      const menuItems = this.menuItemsEl.querySelectorAll(".item, .item-flex-space");
      let afterFlexSpace = false;
      for (const item of menuItems) {
        if (item.classList.contains("item-flex-space")) {
          afterFlexSpace = true;
          continue;
        }
        if (afterFlexSpace)
          item.setAttribute("data-after-flex-space", "true");
        const itemRight = item.offsetLeft + item.offsetWidth;
        if (menuRight - itemRight < 38) {
          this.tippyItems.push(item);
        }
      }
      itemFlexSpace?.style.removeProperty("display");
      if (!this.tippyItems?.length) {
        const btn2 = this.querySelector(".overflow-menu-button");
        btn2?._tippy?.destroy();
        btn2?.remove();
        return;
      }
      for (const item of menuItems) {
        if (!this.tippyItems.includes(item)) {
          item.removeAttribute("role");
        }
      }
      for (const item of this.tippyItems) {
        item.setAttribute("role", "menuitem");
        this.tippyContent.append(item);
      }
      if (this.button?._tippy) {
        this.button._tippy.setContent(this.tippyContent);
        return;
      }
      const btn = document.createElement("button");
      btn.classList.add("overflow-menu-button");
      btn.setAttribute("aria-label", window.config.i18n.more_items);
      btn.innerHTML = _public_assets_img_svg_octicon_kebab_horizontal_svg__WEBPACK_IMPORTED_MODULE_3__;
      this.append(btn);
      this.button = btn;
      (0,_modules_tippy_js__WEBPACK_IMPORTED_MODULE_1__.createTippy)(btn, {
        trigger: "click",
        hideOnClick: true,
        interactive: true,
        placement: "bottom-end",
        role: "menu",
        theme: "menu",
        content: this.tippyContent,
        onShow: () => {
          setTimeout(() => {
            this.tippyContent.focus();
          }, 0);
        }
      });
    }));
  }
  init() {
    if (this.matches(".ui.secondary.pointing.menu, .ui.tabular.menu")) {
      for (const item of this.querySelectorAll(".item")) {
        for (const child of item.childNodes) {
          if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent.trim();
            if (!text)
              continue;
            const span = document.createElement("span");
            span.classList.add("resize-for-semibold");
            span.setAttribute("data-text", text);
            span.textContent = text;
            child.replaceWith(span);
          }
        }
      }
    }
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentBoxSize[0].inlineSize;
        if (newWidth !== this.lastWidth) {
          requestAnimationFrame(() => {
            this.updateItems();
          });
          this.lastWidth = newWidth;
        }
      }
    });
    this.resizeObserver.observe(this);
  }
  connectedCallback() {
    this.setAttribute("role", "navigation");
    const menuItemsEl = this.querySelector(".overflow-menu-items");
    if (menuItemsEl) {
      this.menuItemsEl = menuItemsEl;
      this.init();
    } else {
      this.mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (!(0,_utils_dom_js__WEBPACK_IMPORTED_MODULE_2__.isDocumentFragmentOrElementNode)(node))
              continue;
            if (node.classList.contains("overflow-menu-items")) {
              this.menuItemsEl = node;
              this.mutationObserver?.disconnect();
              this.init();
            }
          }
        }
      });
      this.mutationObserver.observe(this, { childList: true });
    }
  }
  disconnectedCallback() {
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();
  }
});


/***/ }),

/***/ "./web_src/js/webcomponents/polyfills.js":
/*!***********************************************!*\
  !*** ./web_src/js/webcomponents/polyfills.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
try {
  new Intl.NumberFormat("en", { style: "unit", unit: "minute" }).format(1);
} catch {
  const intlNumberFormat = Intl.NumberFormat;
  Intl.NumberFormat = function(locales, options) {
    if (options.style === "unit") {
      return {
        format(value) {
          return ` ${value} ${options.unit}`;
        }
      };
    }
    return intlNumberFormat(locales, options);
  };
}


/***/ }),

/***/ "./node_modules/temporal-polyfill/chunks/classApi.js":
/*!***********************************************************!*\
  !*** ./node_modules/temporal-polyfill/chunks/classApi.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DateTimeFormat: function() { return /* binding */ Sr; },
/* harmony export */   IntlExtended: function() { return /* binding */ Tr; },
/* harmony export */   Temporal: function() { return /* binding */ mr; },
/* harmony export */   toTemporalInstant: function() { return /* binding */ toTemporalInstant; }
/* harmony export */ });
/* harmony import */ var _internal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./internal.js */ "./node_modules/temporal-polyfill/chunks/internal.js");
function createSlotClass(e, t, n, o, r) {
  function Class(...e) {
    if (!(this instanceof Class)) {
      throw new TypeError(_internal_js__WEBPACK_IMPORTED_MODULE_0__.invalidCallingContext);
    }
    oo(this, t(...e));
  }
  function bindMethod(e, t) {
    return Object.defineProperties((function(...t) {
      return e.call(this, getSpecificSlots(this), ...t);
    }), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createNameDescriptors)(t));
  }
  function getSpecificSlots(t) {
    const n = no(t);
    if (!n || n.branding !== e) {
      throw new TypeError(_internal_js__WEBPACK_IMPORTED_MODULE_0__.invalidCallingContext);
    }
    return n;
  }
  return Object.defineProperties(Class.prototype, {
    ...(0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createGetterDescriptors)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.mapProps)(bindMethod, n)),
    ...(0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPropDescriptors)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.mapProps)(bindMethod, o)),
    ...(0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createStringTagDescriptors)("Temporal." + e)
  }), Object.defineProperties(Class, {
    ...(0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPropDescriptors)(r),
    ...(0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createNameDescriptors)(e)
  }), [ Class, e => {
    const t = Object.create(Class.prototype);
    return oo(t, e), t;
  }, getSpecificSlots ];
}

function createProtocolValidator(e) {
  return e = e.concat("id").sort(), t => {
    if (!(0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.hasAllPropsByName)(t, e)) {
      throw new TypeError(_internal_js__WEBPACK_IMPORTED_MODULE_0__.invalidProtocol);
    }
    return t;
  };
}

function rejectInvalidBag(e) {
  if (no(e) || void 0 !== e.calendar || void 0 !== e.timeZone) {
    throw new TypeError(_internal_js__WEBPACK_IMPORTED_MODULE_0__.invalidBag);
  }
  return e;
}

function createCalendarFieldMethods(e, t) {
  const n = {};
  for (const o in e) {
    n[o] = ({F: e}, n) => {
      const r = no(n) || {}, {branding: a} = r, i = a === _internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainDateBranding || t.includes(a) ? r : toPlainDateSlots(n);
      return e[o](i);
    };
  }
  return n;
}

function createCalendarGetters(e) {
  const t = {};
  for (const n in e) {
    t[n] = e => {
      const {calendar: t} = e;
      return (o = t, "string" == typeof o ? (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createNativeStandardOps)(o) : (r = o, Object.assign(Object.create(co), {
        C: r
      })))[n](e);
      var o, r;
    };
  }
  return t;
}

function neverValueOf() {
  throw new TypeError(_internal_js__WEBPACK_IMPORTED_MODULE_0__.forbiddenValueOf);
}

function createCalendarFromSlots({calendar: e}) {
  return "string" == typeof e ? new lr(e) : e;
}

function toPlainMonthDaySlots(e, t) {
  if (t = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.copyOptions)(t), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.isObjectLike)(e)) {
    const n = no(e);
    if (n && n.branding === _internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainMonthDayBranding) {
      return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), n;
    }
    const o = extractCalendarSlotFromBag(e);
    return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refinePlainMonthDayBag)(Qo(o || _internal_js__WEBPACK_IMPORTED_MODULE_0__.isoCalendarId), !o, e, t);
  }
  const n = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.parsePlainMonthDay)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.createNativeStandardOps, e);
  return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), n;
}

function getOffsetNanosecondsForAdapter(e, t, n) {
  return o = t.call(e, Co((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createInstantSlots)(n))), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.validateTimeZoneOffset)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.requireInteger)(o));
  var o;
}

function createAdapterOps(e, t = ho) {
  const n = Object.keys(t).sort(), o = {};
  for (const r of n) {
    o[r] = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.bindArgs)(t[r], e, (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.requireFunction)(e[r]));
  }
  return o;
}

function createTimeZoneOps(e, t) {
  return "string" == typeof e ? (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.queryNativeTimeZone)(e) : createAdapterOps(e, t);
}

function createTimeZoneOffsetOps(e) {
  return createTimeZoneOps(e, Do);
}

function toInstantSlots(e) {
  if ((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.isObjectLike)(e)) {
    const t = no(e);
    if (t) {
      switch (t.branding) {
       case _internal_js__WEBPACK_IMPORTED_MODULE_0__.InstantBranding:
        return t;

       case _internal_js__WEBPACK_IMPORTED_MODULE_0__.ZonedDateTimeBranding:
        return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createInstantSlots)(t.epochNanoseconds);
      }
    }
  }
  return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.parseInstant)(e);
}

function toTemporalInstant() {
  return Co((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createInstantSlots)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.numberToBigNano)(this.valueOf(), _internal_js__WEBPACK_IMPORTED_MODULE_0__.nanoInMilli)));
}

function getImplTransition(e, t, n) {
  const o = t.B(toInstantSlots(n).epochNanoseconds, e);
  return o ? Co((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createInstantSlots)(o)) : null;
}

function refineTimeZoneSlot(e) {
  return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.isObjectLike)(e) ? (no(e) || {}).timeZone || Fo(e) : (e => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.resolveTimeZoneId)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.parseTimeZoneId)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.requireString)(e))))(e);
}

function toPlainTimeSlots(e, t) {
  if ((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.isObjectLike)(e)) {
    const n = no(e) || {};
    switch (n.branding) {
     case _internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainTimeBranding:
      return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), n;

     case _internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainDateTimeBranding:
      return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainTimeSlots)(n);

     case _internal_js__WEBPACK_IMPORTED_MODULE_0__.ZonedDateTimeBranding:
      return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.zonedDateTimeToPlainTime)(createTimeZoneOffsetOps, n);
    }
    return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refinePlainTimeBag)(e, t);
  }
  return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.parsePlainTime)(e);
}

function optionalToPlainTimeFields(e) {
  return void 0 === e ? void 0 : toPlainTimeSlots(e);
}

function toPlainYearMonthSlots(e, t) {
  if (t = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.copyOptions)(t), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.isObjectLike)(e)) {
    const n = no(e);
    return n && n.branding === _internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainYearMonthBranding ? ((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), n) : (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refinePlainYearMonthBag)(Ho(getCalendarSlotFromBag(e)), e, t);
  }
  const n = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.parsePlainYearMonth)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.createNativeStandardOps, e);
  return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), n;
}

function toPlainDateTimeSlots(e, t) {
  if (t = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.copyOptions)(t), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.isObjectLike)(e)) {
    const n = no(e) || {};
    switch (n.branding) {
     case _internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainDateTimeBranding:
      return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), n;

     case _internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainDateBranding:
      return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateTimeSlots)({
        ...n,
        ..._internal_js__WEBPACK_IMPORTED_MODULE_0__.isoTimeFieldDefaults
      });

     case _internal_js__WEBPACK_IMPORTED_MODULE_0__.ZonedDateTimeBranding:
      return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.zonedDateTimeToPlainDateTime)(createTimeZoneOffsetOps, n);
    }
    return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refinePlainDateTimeBag)(Ko(getCalendarSlotFromBag(e)), e, t);
  }
  const n = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.parsePlainDateTime)(e);
  return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), n;
}

function toPlainDateSlots(e, t) {
  if (t = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.copyOptions)(t), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.isObjectLike)(e)) {
    const n = no(e) || {};
    switch (n.branding) {
     case _internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainDateBranding:
      return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), n;

     case _internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainDateTimeBranding:
      return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateSlots)(n);

     case _internal_js__WEBPACK_IMPORTED_MODULE_0__.ZonedDateTimeBranding:
      return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.zonedDateTimeToPlainDate)(createTimeZoneOffsetOps, n);
    }
    return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refinePlainDateBag)(Ko(getCalendarSlotFromBag(e)), e, t);
  }
  const n = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.parsePlainDate)(e);
  return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineOverflowOptions)(t), n;
}

function dayAdapter(e, t, n) {
  return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.requirePositiveInteger)(t.call(e, Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateSlots)(n, e))));
}

function createCompoundOpsCreator(e) {
  return t => "string" == typeof t ? (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createNativeStandardOps)(t) : ((e, t) => {
    const n = Object.keys(t).sort(), o = {};
    for (const r of n) {
      o[r] = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.bindArgs)(t[r], e, e[r]);
    }
    return o;
  })(t, e);
}

function toDurationSlots(e) {
  if ((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.isObjectLike)(e)) {
    const t = no(e);
    return t && t.branding === _internal_js__WEBPACK_IMPORTED_MODULE_0__.DurationBranding ? t : (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineDurationBag)(e);
  }
  return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.parseDuration)(e);
}

function refinePublicRelativeTo(e) {
  if (void 0 !== e) {
    if ((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.isObjectLike)(e)) {
      const t = no(e) || {};
      switch (t.branding) {
       case _internal_js__WEBPACK_IMPORTED_MODULE_0__.ZonedDateTimeBranding:
       case _internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainDateBranding:
        return t;

       case _internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainDateTimeBranding:
        return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateSlots)(t);
      }
      const n = getCalendarSlotFromBag(e);
      return {
        ...(0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineMaybeZonedDateTimeBag)(refineTimeZoneSlot, createTimeZoneOps, Ko(n), e),
        calendar: n
      };
    }
    return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.parseRelativeToSlots)(e);
  }
}

function getCalendarSlotFromBag(e) {
  return extractCalendarSlotFromBag(e) || _internal_js__WEBPACK_IMPORTED_MODULE_0__.isoCalendarId;
}

function extractCalendarSlotFromBag(e) {
  const {calendar: t} = e;
  if (void 0 !== t) {
    return refineCalendarSlot(t);
  }
}

function refineCalendarSlot(e) {
  return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.isObjectLike)(e) ? (no(e) || {}).calendar || cr(e) : (e => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.resolveCalendarId)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.parseCalendarId)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.requireString)(e))))(e);
}

function toZonedDateTimeSlots(e, t) {
  if (t = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.copyOptions)(t), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.isObjectLike)(e)) {
    const n = no(e);
    if (n && n.branding === _internal_js__WEBPACK_IMPORTED_MODULE_0__.ZonedDateTimeBranding) {
      return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineZonedFieldOptions)(t), n;
    }
    const o = getCalendarSlotFromBag(e);
    return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineZonedDateTimeBag)(refineTimeZoneSlot, createTimeZoneOps, Ko(o), o, e, t);
  }
  return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.parseZonedDateTime)(e, t);
}

function adaptDateMethods(e) {
  return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.mapProps)((e => t => e(slotsToIso(t))), e);
}

function slotsToIso(e) {
  return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.zonedEpochSlotsToIso)(e, createTimeZoneOffsetOps);
}

function createDateTimeFormatClass() {
  const e = _internal_js__WEBPACK_IMPORTED_MODULE_0__.RawDateTimeFormat.prototype, t = Object.getOwnPropertyDescriptors(e), n = Object.getOwnPropertyDescriptors(_internal_js__WEBPACK_IMPORTED_MODULE_0__.RawDateTimeFormat), DateTimeFormat = function(e, t = {}) {
    if (!(this instanceof DateTimeFormat)) {
      return new DateTimeFormat(e, t);
    }
    Or.set(this, ((e, t = {}) => {
      const n = new _internal_js__WEBPACK_IMPORTED_MODULE_0__.RawDateTimeFormat(e, t), o = n.resolvedOptions(), r = o.locale, a = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.pluckProps)(Object.keys(t), o), i = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.memoize)(createFormatPrepperForBranding), prepFormat = (...e) => {
        let t;
        const o = e.map(((e, n) => {
          const o = no(e), r = (o || {}).branding;
          if (n && t && t !== r) {
            throw new TypeError(_internal_js__WEBPACK_IMPORTED_MODULE_0__.mismatchingFormatTypes);
          }
          return t = r, o;
        }));
        return t ? i(t)(r, a, ...o) : [ n, ...e ];
      };
      return prepFormat.U = n, prepFormat;
    })(e, t));
  };
  for (const e in t) {
    const n = t[e], o = e.startsWith("format") && createFormatMethod(e);
    "function" == typeof n.value ? n.value = "constructor" === e ? DateTimeFormat : o || createProxiedMethod(e) : o && (n.get = function() {
      return o.bind(this);
    });
  }
  return n.prototype.value = Object.create(e, t), Object.defineProperties(DateTimeFormat, n), 
  DateTimeFormat;
}

function createFormatMethod(e) {
  return function(...t) {
    const n = Or.get(this), [o, ...r] = n(...t);
    return o[e](...r);
  };
}

function createProxiedMethod(e) {
  return function(...t) {
    return Or.get(this).U[e](...t);
  };
}

function createFormatPrepperForBranding(t) {
  const n = xn[t];
  if (!n) {
    throw new TypeError((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.invalidFormatType)(t));
  }
  return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createFormatPrepper)(n, (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.memoize)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.createFormatForPrep));
}



const xn = {
  Instant: _internal_js__WEBPACK_IMPORTED_MODULE_0__.instantConfig,
  PlainDateTime: _internal_js__WEBPACK_IMPORTED_MODULE_0__.dateTimeConfig,
  PlainDate: _internal_js__WEBPACK_IMPORTED_MODULE_0__.dateConfig,
  PlainTime: _internal_js__WEBPACK_IMPORTED_MODULE_0__.timeConfig,
  PlainYearMonth: _internal_js__WEBPACK_IMPORTED_MODULE_0__.yearMonthConfig,
  PlainMonthDay: _internal_js__WEBPACK_IMPORTED_MODULE_0__.monthDayConfig
}, Rn = /*@__PURE__*/ (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createFormatPrepper)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.instantConfig), Wn = /*@__PURE__*/ (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createFormatPrepper)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.zonedConfig), Gn = /*@__PURE__*/ (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createFormatPrepper)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.dateTimeConfig), Un = /*@__PURE__*/ (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createFormatPrepper)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.dateConfig), zn = /*@__PURE__*/ (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createFormatPrepper)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.timeConfig), Hn = /*@__PURE__*/ (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createFormatPrepper)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.yearMonthConfig), Kn = /*@__PURE__*/ (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createFormatPrepper)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.monthDayConfig), Qn = {
  era: _internal_js__WEBPACK_IMPORTED_MODULE_0__.requireStringOrUndefined,
  eraYear: _internal_js__WEBPACK_IMPORTED_MODULE_0__.requireIntegerOrUndefined,
  year: _internal_js__WEBPACK_IMPORTED_MODULE_0__.requireInteger,
  month: _internal_js__WEBPACK_IMPORTED_MODULE_0__.requirePositiveInteger,
  daysInMonth: _internal_js__WEBPACK_IMPORTED_MODULE_0__.requirePositiveInteger,
  daysInYear: _internal_js__WEBPACK_IMPORTED_MODULE_0__.requirePositiveInteger,
  inLeapYear: _internal_js__WEBPACK_IMPORTED_MODULE_0__.requireBoolean,
  monthsInYear: _internal_js__WEBPACK_IMPORTED_MODULE_0__.requirePositiveInteger
}, Xn = {
  monthCode: _internal_js__WEBPACK_IMPORTED_MODULE_0__.requireString
}, $n = {
  day: _internal_js__WEBPACK_IMPORTED_MODULE_0__.requirePositiveInteger
}, _n = {
  dayOfWeek: _internal_js__WEBPACK_IMPORTED_MODULE_0__.requirePositiveInteger,
  dayOfYear: _internal_js__WEBPACK_IMPORTED_MODULE_0__.requirePositiveInteger,
  weekOfYear: _internal_js__WEBPACK_IMPORTED_MODULE_0__.requirePositiveIntegerOrUndefined,
  yearOfWeek: _internal_js__WEBPACK_IMPORTED_MODULE_0__.requireIntegerOrUndefined,
  daysInWeek: _internal_js__WEBPACK_IMPORTED_MODULE_0__.requirePositiveInteger
}, eo = /*@__PURE__*/ Object.assign({}, Qn, Xn, $n, _n), to = /*@__PURE__*/ new WeakMap, no = /*@__PURE__*/ to.get.bind(to), oo = /*@__PURE__*/ to.set.bind(to), ro = {
  ...createCalendarFieldMethods(Qn, [ _internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainYearMonthBranding ]),
  ...createCalendarFieldMethods(_n, []),
  ...createCalendarFieldMethods(Xn, [ _internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainYearMonthBranding, _internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainMonthDayBranding ]),
  ...createCalendarFieldMethods($n, [ _internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainMonthDayBranding ])
}, ao = /*@__PURE__*/ createCalendarGetters(eo), io = /*@__PURE__*/ createCalendarGetters({
  ...Qn,
  ...Xn
}), so = /*@__PURE__*/ createCalendarGetters({
  ...Xn,
  ...$n
}), lo = {
  calendarId: e => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getId)(e.calendar)
}, co = /*@__PURE__*/ (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.mapProps)(((e, t) => function(n) {
  const {C: o} = this;
  return e(o[t](Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateSlots)(n, o))));
}), eo), uo = /*@__PURE__*/ (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.mapPropNames)((e => t => t[e]), _internal_js__WEBPACK_IMPORTED_MODULE_0__.durationFieldNamesAsc.concat("sign")), fo = /*@__PURE__*/ (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.mapPropNames)(((e, t) => e => e[_internal_js__WEBPACK_IMPORTED_MODULE_0__.isoTimeFieldNamesAsc[t]]), _internal_js__WEBPACK_IMPORTED_MODULE_0__.timeFieldNamesAsc), mo = {
  epochSeconds: _internal_js__WEBPACK_IMPORTED_MODULE_0__.getEpochSec,
  epochMilliseconds: _internal_js__WEBPACK_IMPORTED_MODULE_0__.getEpochMilli,
  epochMicroseconds: _internal_js__WEBPACK_IMPORTED_MODULE_0__.getEpochMicro,
  epochNanoseconds: _internal_js__WEBPACK_IMPORTED_MODULE_0__.getEpochNano
}, So = /*@__PURE__*/ (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.bindArgs)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.excludePropsByName, new Set([ "branding" ])), [Oo, To, po] = createSlotClass(_internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainMonthDayBranding, (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.bindArgs)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.constructPlainMonthDaySlots, refineCalendarSlot), {
  ...lo,
  ...so
}, {
  getISOFields: So,
  getCalendar: createCalendarFromSlots,
  with(e, t, n) {
    return To((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainMonthDayWithFields)(_o, e, this, rejectInvalidBag(t), n));
  },
  equals: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainMonthDaysEqual)(e, toPlainMonthDaySlots(t)),
  toPlainDate(e, t) {
    return Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainMonthDayToPlainDate)($o, e, this, t));
  },
  toLocaleString(e, t, n) {
    const [o, r] = Kn(t, n, e);
    return o.format(r);
  },
  toString: _internal_js__WEBPACK_IMPORTED_MODULE_0__.formatPlainMonthDayIso,
  toJSON: e => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.formatPlainMonthDayIso)(e),
  valueOf: neverValueOf
}, {
  from: (e, t) => To(toPlainMonthDaySlots(e, t))
}), ho = {
  getOffsetNanosecondsFor: getOffsetNanosecondsForAdapter,
  getPossibleInstantsFor(e, t, n) {
    const o = [ ...t.call(e, No((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateTimeSlots)(n, _internal_js__WEBPACK_IMPORTED_MODULE_0__.isoCalendarId))) ].map((e => go(e).epochNanoseconds)), r = o.length;
    return r > 1 && (o.sort(_internal_js__WEBPACK_IMPORTED_MODULE_0__.compareBigNanos), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.validateTimeZoneGap)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.bigNanoToNumber)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.diffBigNanos)(o[0], o[r - 1])))), o;
  }
}, Do = {
  getOffsetNanosecondsFor: getOffsetNanosecondsForAdapter
}, [Po, Co, go] = createSlotClass(_internal_js__WEBPACK_IMPORTED_MODULE_0__.InstantBranding, _internal_js__WEBPACK_IMPORTED_MODULE_0__.constructInstantSlots, mo, {
  add: (e, t) => Co((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.moveInstant)(0, e, toDurationSlots(t))),
  subtract: (e, t) => Co((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.moveInstant)(1, e, toDurationSlots(t))),
  until: (e, t, n) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.diffInstants)(0, e, toInstantSlots(t), n)),
  since: (e, t, n) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.diffInstants)(1, e, toInstantSlots(t), n)),
  round: (e, t) => Co((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.roundInstant)(e, t)),
  equals: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.instantsEqual)(e, toInstantSlots(t)),
  toZonedDateTime(e, t) {
    const n = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.requireObjectLike)(t);
    return dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.instantToZonedDateTime)(e, refineTimeZoneSlot(n.timeZone), refineCalendarSlot(n.calendar)));
  },
  toZonedDateTimeISO: (e, t) => dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.instantToZonedDateTime)(e, refineTimeZoneSlot(t))),
  toLocaleString(e, t, n) {
    const [o, r] = Rn(t, n, e);
    return o.format(r);
  },
  toString: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.formatInstantIso)(refineTimeZoneSlot, createTimeZoneOffsetOps, e, t),
  toJSON: e => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.formatInstantIso)(refineTimeZoneSlot, createTimeZoneOffsetOps, e),
  valueOf: neverValueOf
}, {
  from: e => Co(toInstantSlots(e)),
  fromEpochSeconds: e => Co((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.epochSecToInstant)(e)),
  fromEpochMilliseconds: e => Co((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.epochMilliToInstant)(e)),
  fromEpochMicroseconds: e => Co((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.epochMicroToInstant)(e)),
  fromEpochNanoseconds: e => Co((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.epochNanoToInstant)(e)),
  compare: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.compareInstants)(toInstantSlots(e), toInstantSlots(t))
}), [Zo, bo] = createSlotClass("TimeZone", (e => {
  const t = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineTimeZoneId)(e);
  return {
    branding: "TimeZone",
    id: t,
    F: (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.queryNativeTimeZone)(t)
  };
}), {
  id: e => e.id
}, {
  getPossibleInstantsFor: ({F: e}, t) => e.getPossibleInstantsFor(toPlainDateTimeSlots(t)).map((e => Co((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createInstantSlots)(e)))),
  getOffsetNanosecondsFor: ({F: e}, t) => e.getOffsetNanosecondsFor(toInstantSlots(t).epochNanoseconds),
  getOffsetStringFor(e, t) {
    const n = toInstantSlots(t).epochNanoseconds, o = createAdapterOps(this, Do).getOffsetNanosecondsFor(n);
    return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.formatOffsetNano)(o);
  },
  getPlainDateTimeFor(e, t, n = _internal_js__WEBPACK_IMPORTED_MODULE_0__.isoCalendarId) {
    const o = toInstantSlots(t).epochNanoseconds, r = createAdapterOps(this, Do).getOffsetNanosecondsFor(o);
    return No((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateTimeSlots)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.epochNanoToIso)(o, r), refineCalendarSlot(n)));
  },
  getInstantFor(e, t, n) {
    const o = toPlainDateTimeSlots(t), r = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineEpochDisambigOptions)(n), a = createAdapterOps(this);
    return Co((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createInstantSlots)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getSingleInstantFor)(a, o, r)));
  },
  getNextTransition: ({F: e}, t) => getImplTransition(1, e, t),
  getPreviousTransition: ({F: e}, t) => getImplTransition(-1, e, t),
  equals(e, t) {
    return !!(0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.isTimeZoneSlotsEqual)(this, refineTimeZoneSlot(t));
  },
  toString: e => e.id,
  toJSON: e => e.id
}, {
  from(e) {
    const t = refineTimeZoneSlot(e);
    return "string" == typeof t ? new Zo(t) : t;
  }
}), Fo = /*@__PURE__*/ createProtocolValidator(Object.keys(ho)), [Io, vo] = createSlotClass(_internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainTimeBranding, _internal_js__WEBPACK_IMPORTED_MODULE_0__.constructPlainTimeSlots, fo, {
  getISOFields: So,
  with(e, t, n) {
    return vo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainTimeWithFields)(this, rejectInvalidBag(t), n));
  },
  add: (e, t) => vo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.movePlainTime)(0, e, toDurationSlots(t))),
  subtract: (e, t) => vo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.movePlainTime)(1, e, toDurationSlots(t))),
  until: (e, t, n) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.diffPlainTimes)(0, e, toPlainTimeSlots(t), n)),
  since: (e, t, n) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.diffPlainTimes)(1, e, toPlainTimeSlots(t), n)),
  round: (e, t) => vo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.roundPlainTime)(e, t)),
  equals: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainTimesEqual)(e, toPlainTimeSlots(t)),
  toZonedDateTime: (e, t) => dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainTimeToZonedDateTime)(refineTimeZoneSlot, toPlainDateSlots, createTimeZoneOps, e, t)),
  toPlainDateTime: (e, t) => No((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainTimeToPlainDateTime)(e, toPlainDateSlots(t))),
  toLocaleString(e, t, n) {
    const [o, r] = zn(t, n, e);
    return o.format(r);
  },
  toString: _internal_js__WEBPACK_IMPORTED_MODULE_0__.formatPlainTimeIso,
  toJSON: e => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.formatPlainTimeIso)(e),
  valueOf: neverValueOf
}, {
  from: (e, t) => vo(toPlainTimeSlots(e, t)),
  compare: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.compareIsoTimeFields)(toPlainTimeSlots(e), toPlainTimeSlots(t))
}), [wo, jo, Mo] = createSlotClass(_internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainYearMonthBranding, (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.bindArgs)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.constructPlainYearMonthSlots, refineCalendarSlot), {
  ...lo,
  ...io
}, {
  getISOFields: So,
  getCalendar: createCalendarFromSlots,
  with(e, t, n) {
    return jo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainYearMonthWithFields)(Xo, e, this, rejectInvalidBag(t), n));
  },
  add: (e, t, n) => jo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.movePlainYearMonth)(nr, 0, e, toDurationSlots(t), n)),
  subtract: (e, t, n) => jo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.movePlainYearMonth)(nr, 1, e, toDurationSlots(t), n)),
  until: (e, t, n) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.diffPlainYearMonth)(or, 0, e, toPlainYearMonthSlots(t), n)),
  since: (e, t, n) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.diffPlainYearMonth)(or, 1, e, toPlainYearMonthSlots(t), n)),
  equals: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainYearMonthsEqual)(e, toPlainYearMonthSlots(t)),
  toPlainDate(e, t) {
    return Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainYearMonthToPlainDate)($o, e, this, t));
  },
  toLocaleString(e, t, n) {
    const [o, r] = Hn(t, n, e);
    return o.format(r);
  },
  toString: _internal_js__WEBPACK_IMPORTED_MODULE_0__.formatPlainYearMonthIso,
  toJSON: e => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.formatPlainYearMonthIso)(e),
  valueOf: neverValueOf
}, {
  from: (e, t) => jo(toPlainYearMonthSlots(e, t)),
  compare: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.compareIsoDateFields)(toPlainYearMonthSlots(e), toPlainYearMonthSlots(t))
}), [yo, No] = createSlotClass(_internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainDateTimeBranding, (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.bindArgs)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.constructPlainDateTimeSlots, refineCalendarSlot), {
  ...lo,
  ...ao,
  ...fo
}, {
  getISOFields: So,
  getCalendar: createCalendarFromSlots,
  with(e, t, n) {
    return No((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainDateTimeWithFields)($o, e, this, rejectInvalidBag(t), n));
  },
  withCalendar: (e, t) => No((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.slotsWithCalendar)(e, refineCalendarSlot(t))),
  withPlainDate: (e, t) => No((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainDateTimeWithPlainDate)(e, toPlainDateSlots(t))),
  withPlainTime: (e, t) => No((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainDateTimeWithPlainTime)(e, optionalToPlainTimeFields(t))),
  add: (e, t, n) => No((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.movePlainDateTime)(er, 0, e, toDurationSlots(t), n)),
  subtract: (e, t, n) => No((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.movePlainDateTime)(er, 1, e, toDurationSlots(t), n)),
  until: (e, t, n) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.diffPlainDateTimes)(tr, 0, e, toPlainDateTimeSlots(t), n)),
  since: (e, t, n) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.diffPlainDateTimes)(tr, 1, e, toPlainDateTimeSlots(t), n)),
  round: (e, t) => No((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.roundPlainDateTime)(e, t)),
  equals: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainDateTimesEqual)(e, toPlainDateTimeSlots(t)),
  toZonedDateTime: (e, t, n) => dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainDateTimeToZonedDateTime)(createTimeZoneOps, e, refineTimeZoneSlot(t), n)),
  toPlainDate: e => Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateSlots)(e)),
  toPlainTime: e => vo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainTimeSlots)(e)),
  toPlainYearMonth(e) {
    return jo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainDateTimeToPlainYearMonth)(Ho, e, this));
  },
  toPlainMonthDay(e) {
    return To((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainDateTimeToPlainMonthDay)(Qo, e, this));
  },
  toLocaleString(e, t, n) {
    const [o, r] = Gn(t, n, e);
    return o.format(r);
  },
  toString: _internal_js__WEBPACK_IMPORTED_MODULE_0__.formatPlainDateTimeIso,
  toJSON: e => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.formatPlainDateTimeIso)(e),
  valueOf: neverValueOf
}, {
  from: (e, t) => No(toPlainDateTimeSlots(e, t)),
  compare: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.compareIsoDateTimeFields)(toPlainDateTimeSlots(e), toPlainDateTimeSlots(t))
}), [Bo, Yo, Ao] = createSlotClass(_internal_js__WEBPACK_IMPORTED_MODULE_0__.PlainDateBranding, (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.bindArgs)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.constructPlainDateSlots, refineCalendarSlot), {
  ...lo,
  ...ao
}, {
  getISOFields: So,
  getCalendar: createCalendarFromSlots,
  with(e, t, n) {
    return Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainDateWithFields)($o, e, this, rejectInvalidBag(t), n));
  },
  withCalendar: (e, t) => Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.slotsWithCalendar)(e, refineCalendarSlot(t))),
  add: (e, t, n) => Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.movePlainDate)(er, 0, e, toDurationSlots(t), n)),
  subtract: (e, t, n) => Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.movePlainDate)(er, 1, e, toDurationSlots(t), n)),
  until: (e, t, n) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.diffPlainDates)(tr, 0, e, toPlainDateSlots(t), n)),
  since: (e, t, n) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.diffPlainDates)(tr, 1, e, toPlainDateSlots(t), n)),
  equals: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainDatesEqual)(e, toPlainDateSlots(t)),
  toZonedDateTime(e, t) {
    const n = !(0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.isObjectLike)(t) || t instanceof Zo ? {
      timeZone: t
    } : t;
    return dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainDateToZonedDateTime)(refineTimeZoneSlot, toPlainTimeSlots, createTimeZoneOps, e, n));
  },
  toPlainDateTime: (e, t) => No((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainDateToPlainDateTime)(e, optionalToPlainTimeFields(t))),
  toPlainYearMonth(e) {
    return jo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainDateToPlainYearMonth)(Ho, e, this));
  },
  toPlainMonthDay(e) {
    return To((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.plainDateToPlainMonthDay)(Qo, e, this));
  },
  toLocaleString(e, t, n) {
    const [o, r] = Un(t, n, e);
    return o.format(r);
  },
  toString: _internal_js__WEBPACK_IMPORTED_MODULE_0__.formatPlainDateIso,
  toJSON: e => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.formatPlainDateIso)(e),
  valueOf: neverValueOf
}, {
  from: (e, t) => Yo(toPlainDateSlots(e, t)),
  compare: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.compareIsoDateFields)(toPlainDateSlots(e), toPlainDateSlots(t))
}), Eo = {
  fields(e, t, n) {
    return [ ...t.call(e, n) ];
  }
}, Vo = /*@__PURE__*/ Object.assign({
  dateFromFields(e, t, n, o) {
    return Ao(t.call(e, Object.assign(Object.create(null), n), o));
  }
}, Eo), Jo = /*@__PURE__*/ Object.assign({
  yearMonthFromFields(e, t, n, o) {
    return Mo(t.call(e, Object.assign(Object.create(null), n), o));
  }
}, Eo), Lo = /*@__PURE__*/ Object.assign({
  monthDayFromFields(e, t, n, o) {
    return po(t.call(e, Object.assign(Object.create(null), n), o));
  }
}, Eo), qo = {
  mergeFields(e, t, n, o) {
    return (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.requireObjectLike)(t.call(e, Object.assign(Object.create(null), n), Object.assign(Object.create(null), o)));
  }
}, ko = /*@__PURE__*/ Object.assign({}, Vo, qo), xo = /*@__PURE__*/ Object.assign({}, Jo, qo), Ro = /*@__PURE__*/ Object.assign({}, Lo, qo), Wo = {
  dateAdd(e, t, n, o, r) {
    return Ao(t.call(e, Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateSlots)(n, e)), ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createDurationSlots)(o)), r));
  }
}, Go = /*@__PURE__*/ Object.assign({}, Wo, {
  dateUntil(e, t, n, o, r, a) {
    return ir(t.call(e, Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateSlots)(n, e)), Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateSlots)(o, e)), Object.assign(Object.create(null), a, {
      largestUnit: _internal_js__WEBPACK_IMPORTED_MODULE_0__.unitNamesAsc[r]
    })));
  }
}), Uo = /*@__PURE__*/ Object.assign({}, Wo, {
  day: dayAdapter
}), zo = /*@__PURE__*/ Object.assign({}, Go, {
  day: dayAdapter
}), Ho = /*@__PURE__*/ createCompoundOpsCreator(Jo), Ko = /*@__PURE__*/ createCompoundOpsCreator(Vo), Qo = /*@__PURE__*/ createCompoundOpsCreator(Lo), Xo = /*@__PURE__*/ createCompoundOpsCreator(xo), $o = /*@__PURE__*/ createCompoundOpsCreator(ko), _o = /*@__PURE__*/ createCompoundOpsCreator(Ro), er = /*@__PURE__*/ createCompoundOpsCreator(Wo), tr = /*@__PURE__*/ createCompoundOpsCreator(Go), nr = /*@__PURE__*/ createCompoundOpsCreator(Uo), or = /*@__PURE__*/ createCompoundOpsCreator(zo), [rr, ar, ir] = createSlotClass(_internal_js__WEBPACK_IMPORTED_MODULE_0__.DurationBranding, _internal_js__WEBPACK_IMPORTED_MODULE_0__.constructDurationSlots, {
  ...uo,
  blank: _internal_js__WEBPACK_IMPORTED_MODULE_0__.getDurationBlank
}, {
  with: (e, t) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.durationWithFields)(e, t)),
  negated: e => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.negateDuration)(e)),
  abs: e => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.absDuration)(e)),
  add: (e, t, n) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.addDurations)(refinePublicRelativeTo, tr, createTimeZoneOps, 0, e, toDurationSlots(t), n)),
  subtract: (e, t, n) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.addDurations)(refinePublicRelativeTo, tr, createTimeZoneOps, 1, e, toDurationSlots(t), n)),
  round: (e, t) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.roundDuration)(refinePublicRelativeTo, tr, createTimeZoneOps, e, t)),
  total: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.totalDuration)(refinePublicRelativeTo, tr, createTimeZoneOps, e, t),
  toLocaleString(e, t, n) {
    return Intl.DurationFormat ? new Intl.DurationFormat(t, n).format(this) : (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.formatDurationIso)(e);
  },
  toString: _internal_js__WEBPACK_IMPORTED_MODULE_0__.formatDurationIso,
  toJSON: e => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.formatDurationIso)(e),
  valueOf: neverValueOf
}, {
  from: e => ar(toDurationSlots(e)),
  compare: (e, t, n) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.compareDurations)(refinePublicRelativeTo, er, createTimeZoneOps, toDurationSlots(e), toDurationSlots(t), n)
}), sr = {
  toString: e => e.id,
  toJSON: e => e.id,
  ...ro,
  dateAdd: ({id: e, F: t}, n, o, r) => Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateSlots)(t.dateAdd(toPlainDateSlots(n), toDurationSlots(o), r), e)),
  dateUntil: ({F: e}, t, n, o) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createDurationSlots)(e.dateUntil(toPlainDateSlots(t), toPlainDateSlots(n), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineDateDiffOptions)(o)))),
  dateFromFields: ({id: e, F: t}, n, o) => Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refinePlainDateBag)(t, n, o, (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getRequiredDateFields)(e))),
  yearMonthFromFields: ({id: e, F: t}, n, o) => jo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refinePlainYearMonthBag)(t, n, o, (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getRequiredYearMonthFields)(e))),
  monthDayFromFields: ({id: e, F: t}, n, o) => To((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refinePlainMonthDayBag)(t, 0, n, o, (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getRequiredMonthDayFields)(e))),
  fields({F: e}, t) {
    const n = new Set(_internal_js__WEBPACK_IMPORTED_MODULE_0__.dateFieldNamesAlpha), o = [];
    for (const e of t) {
      if ((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.requireString)(e), !n.has(e)) {
        throw new RangeError((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.forbiddenField)(e));
      }
      n.delete(e), o.push(e);
    }
    return e.fields(o);
  },
  mergeFields: ({F: e}, t, n) => e.mergeFields((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.excludeUndefinedProps)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.requireNonNullish)(t)), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.excludeUndefinedProps)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.requireNonNullish)(n)))
}, [lr] = createSlotClass("Calendar", (e => {
  const t = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.refineCalendarId)(e);
  return {
    branding: "Calendar",
    id: t,
    F: (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createNativeStandardOps)(t)
  };
}), {
  id: e => e.id
}, sr, {
  from(e) {
    const t = refineCalendarSlot(e);
    return "string" == typeof t ? new lr(t) : t;
  }
}), cr = /*@__PURE__*/ createProtocolValidator(Object.keys(sr).slice(4)), [ur, dr] = createSlotClass(_internal_js__WEBPACK_IMPORTED_MODULE_0__.ZonedDateTimeBranding, (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.bindArgs)(_internal_js__WEBPACK_IMPORTED_MODULE_0__.constructZonedDateTimeSlots, refineCalendarSlot, refineTimeZoneSlot), {
  ...mo,
  ...lo,
  ...adaptDateMethods(ao),
  ...adaptDateMethods(fo),
  offset: e => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.formatOffsetNano)(slotsToIso(e).offsetNanoseconds),
  offsetNanoseconds: e => slotsToIso(e).offsetNanoseconds,
  timeZoneId: e => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getId)(e.timeZone),
  hoursInDay: e => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.computeZonedHoursInDay)(createTimeZoneOps, e)
}, {
  getISOFields: e => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.buildZonedIsoFields)(createTimeZoneOffsetOps, e),
  getCalendar: createCalendarFromSlots,
  getTimeZone: ({timeZone: e}) => "string" == typeof e ? new Zo(e) : e,
  with(e, t, n) {
    return dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.zonedDateTimeWithFields)($o, createTimeZoneOps, e, this, rejectInvalidBag(t), n));
  },
  withCalendar: (e, t) => dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.slotsWithCalendar)(e, refineCalendarSlot(t))),
  withTimeZone: (e, t) => dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.slotsWithTimeZone)(e, refineTimeZoneSlot(t))),
  withPlainDate: (e, t) => dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.zonedDateTimeWithPlainDate)(createTimeZoneOps, e, toPlainDateSlots(t))),
  withPlainTime: (e, t) => dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.zonedDateTimeWithPlainTime)(createTimeZoneOps, e, optionalToPlainTimeFields(t))),
  add: (e, t, n) => dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.moveZonedDateTime)(er, createTimeZoneOps, 0, e, toDurationSlots(t), n)),
  subtract: (e, t, n) => dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.moveZonedDateTime)(er, createTimeZoneOps, 1, e, toDurationSlots(t), n)),
  until: (e, t, n) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createDurationSlots)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.diffZonedDateTimes)(tr, createTimeZoneOps, 0, e, toZonedDateTimeSlots(t), n))),
  since: (e, t, n) => ar((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createDurationSlots)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.diffZonedDateTimes)(tr, createTimeZoneOps, 1, e, toZonedDateTimeSlots(t), n))),
  round: (e, t) => dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.roundZonedDateTime)(createTimeZoneOps, e, t)),
  startOfDay: e => dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.computeZonedStartOfDay)(createTimeZoneOps, e)),
  equals: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.zonedDateTimesEqual)(e, toZonedDateTimeSlots(t)),
  toInstant: e => Co((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.zonedDateTimeToInstant)(e)),
  toPlainDateTime: e => No((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.zonedDateTimeToPlainDateTime)(createTimeZoneOffsetOps, e)),
  toPlainDate: e => Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.zonedDateTimeToPlainDate)(createTimeZoneOffsetOps, e)),
  toPlainTime: e => vo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.zonedDateTimeToPlainTime)(createTimeZoneOffsetOps, e)),
  toPlainYearMonth(e) {
    return jo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.zonedDateTimeToPlainYearMonth)(Ho, e, this));
  },
  toPlainMonthDay(e) {
    return To((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.zonedDateTimeToPlainMonthDay)(Qo, e, this));
  },
  toLocaleString(e, t, n = {}) {
    const [o, r] = Wn(t, n, e);
    return o.format(r);
  },
  toString: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.formatZonedDateTimeIso)(createTimeZoneOffsetOps, e, t),
  toJSON: e => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.formatZonedDateTimeIso)(createTimeZoneOffsetOps, e),
  valueOf: neverValueOf
}, {
  from: (e, t) => dr(toZonedDateTimeSlots(e, t)),
  compare: (e, t) => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.compareZonedDateTimes)(toZonedDateTimeSlots(e), toZonedDateTimeSlots(t))
}), fr = /*@__PURE__*/ Object.defineProperties({}, {
  ...(0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createStringTagDescriptors)("Temporal.Now"),
  ...(0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPropDescriptors)({
    timeZoneId: () => (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentTimeZoneId)(),
    instant: () => Co((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createInstantSlots)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentEpochNano)())),
    zonedDateTime: (e, t = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentTimeZoneId)()) => dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createZonedDateTimeSlots)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentEpochNano)(), refineTimeZoneSlot(t), refineCalendarSlot(e))),
    zonedDateTimeISO: (e = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentTimeZoneId)()) => dr((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createZonedDateTimeSlots)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentEpochNano)(), refineTimeZoneSlot(e), _internal_js__WEBPACK_IMPORTED_MODULE_0__.isoCalendarId)),
    plainDateTime: (e, t = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentTimeZoneId)()) => No((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateTimeSlots)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentIsoDateTime)(createTimeZoneOffsetOps(refineTimeZoneSlot(t))), refineCalendarSlot(e))),
    plainDateTimeISO: (e = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentTimeZoneId)()) => No((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateTimeSlots)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentIsoDateTime)(createTimeZoneOffsetOps(refineTimeZoneSlot(e))), _internal_js__WEBPACK_IMPORTED_MODULE_0__.isoCalendarId)),
    plainDate: (e, t = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentTimeZoneId)()) => Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateSlots)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentIsoDateTime)(createTimeZoneOffsetOps(refineTimeZoneSlot(t))), refineCalendarSlot(e))),
    plainDateISO: (e = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentTimeZoneId)()) => Yo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainDateSlots)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentIsoDateTime)(createTimeZoneOffsetOps(refineTimeZoneSlot(e))), _internal_js__WEBPACK_IMPORTED_MODULE_0__.isoCalendarId)),
    plainTimeISO: (e = (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentTimeZoneId)()) => vo((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPlainTimeSlots)((0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentIsoDateTime)(createTimeZoneOffsetOps(refineTimeZoneSlot(e)))))
  })
}), mr = /*@__PURE__*/ Object.defineProperties({}, {
  ...(0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createStringTagDescriptors)("Temporal"),
  ...(0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPropDescriptors)({
    PlainYearMonth: wo,
    PlainMonthDay: Oo,
    PlainDate: Bo,
    PlainTime: Io,
    PlainDateTime: yo,
    ZonedDateTime: ur,
    Instant: Po,
    Calendar: lr,
    TimeZone: Zo,
    Duration: rr,
    Now: fr
  })
}), Sr = /*@__PURE__*/ createDateTimeFormatClass(), Or = /*@__PURE__*/ new WeakMap, Tr = /*@__PURE__*/ Object.defineProperties(Object.create(Intl), (0,_internal_js__WEBPACK_IMPORTED_MODULE_0__.createPropDescriptors)({
  DateTimeFormat: Sr
}));




/***/ }),

/***/ "./node_modules/temporal-polyfill/chunks/internal.js":
/*!***********************************************************!*\
  !*** ./node_modules/temporal-polyfill/chunks/internal.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DurationBranding: function() { return /* binding */ qt; },
/* harmony export */   InstantBranding: function() { return /* binding */ Oe; },
/* harmony export */   PlainDateBranding: function() { return /* binding */ J; },
/* harmony export */   PlainDateTimeBranding: function() { return /* binding */ We; },
/* harmony export */   PlainMonthDayBranding: function() { return /* binding */ q; },
/* harmony export */   PlainTimeBranding: function() { return /* binding */ xe; },
/* harmony export */   PlainYearMonthBranding: function() { return /* binding */ L; },
/* harmony export */   RawDateTimeFormat: function() { return /* binding */ En; },
/* harmony export */   ZonedDateTimeBranding: function() { return /* binding */ Te; },
/* harmony export */   absDuration: function() { return /* binding */ Rt; },
/* harmony export */   addDurations: function() { return /* binding */ Wt; },
/* harmony export */   bigNanoToNumber: function() { return /* binding */ oe; },
/* harmony export */   bindArgs: function() { return /* binding */ E; },
/* harmony export */   buildZonedIsoFields: function() { return /* binding */ mn; },
/* harmony export */   compareBigNanos: function() { return /* binding */ te; },
/* harmony export */   compareDurations: function() { return /* binding */ $t; },
/* harmony export */   compareInstants: function() { return /* binding */ Ze; },
/* harmony export */   compareIsoDateFields: function() { return /* binding */ rt; },
/* harmony export */   compareIsoDateTimeFields: function() { return /* binding */ gt; },
/* harmony export */   compareIsoTimeFields: function() { return /* binding */ He; },
/* harmony export */   compareZonedDateTimes: function() { return /* binding */ yn; },
/* harmony export */   computeZonedHoursInDay: function() { return /* binding */ dn; },
/* harmony export */   computeZonedStartOfDay: function() { return /* binding */ Cn; },
/* harmony export */   constructDurationSlots: function() { return /* binding */ Lt; },
/* harmony export */   constructInstantSlots: function() { return /* binding */ Se; },
/* harmony export */   constructPlainDateSlots: function() { return /* binding */ Nt; },
/* harmony export */   constructPlainDateTimeSlots: function() { return /* binding */ pt; },
/* harmony export */   constructPlainMonthDaySlots: function() { return /* binding */ G; },
/* harmony export */   constructPlainTimeSlots: function() { return /* binding */ ke; },
/* harmony export */   constructPlainYearMonthSlots: function() { return /* binding */ tt; },
/* harmony export */   constructZonedDateTimeSlots: function() { return /* binding */ vn; },
/* harmony export */   copyOptions: function() { return /* binding */ U; },
/* harmony export */   createDurationSlots: function() { return /* binding */ Vt; },
/* harmony export */   createFormatForPrep: function() { return /* binding */ qn; },
/* harmony export */   createFormatPrepper: function() { return /* binding */ e; },
/* harmony export */   createGetterDescriptors: function() { return /* binding */ O; },
/* harmony export */   createInstantSlots: function() { return /* binding */ _; },
/* harmony export */   createNameDescriptors: function() { return /* binding */ D; },
/* harmony export */   createNativeStandardOps: function() { return /* binding */ Y; },
/* harmony export */   createPlainDateSlots: function() { return /* binding */ v; },
/* harmony export */   createPlainDateTimeSlots: function() { return /* binding */ ee; },
/* harmony export */   createPlainTimeSlots: function() { return /* binding */ Ge; },
/* harmony export */   createPropDescriptors: function() { return /* binding */ p; },
/* harmony export */   createStringTagDescriptors: function() { return /* binding */ h; },
/* harmony export */   createZonedDateTimeSlots: function() { return /* binding */ Yn; },
/* harmony export */   dateConfig: function() { return /* binding */ o; },
/* harmony export */   dateFieldNamesAlpha: function() { return /* binding */ en; },
/* harmony export */   dateTimeConfig: function() { return /* binding */ n; },
/* harmony export */   diffBigNanos: function() { return /* binding */ re; },
/* harmony export */   diffInstants: function() { return /* binding */ le; },
/* harmony export */   diffPlainDateTimes: function() { return /* binding */ ut; },
/* harmony export */   diffPlainDates: function() { return /* binding */ Ft; },
/* harmony export */   diffPlainTimes: function() { return /* binding */ Ae; },
/* harmony export */   diffPlainYearMonth: function() { return /* binding */ Xe; },
/* harmony export */   diffZonedDateTimes: function() { return /* binding */ Dn; },
/* harmony export */   durationFieldNamesAsc: function() { return /* binding */ F; },
/* harmony export */   durationWithFields: function() { return /* binding */ kt; },
/* harmony export */   epochMicroToInstant: function() { return /* binding */ Ce; },
/* harmony export */   epochMilliToInstant: function() { return /* binding */ Pe; },
/* harmony export */   epochNanoToInstant: function() { return /* binding */ ge; },
/* harmony export */   epochNanoToIso: function() { return /* binding */ Ie; },
/* harmony export */   epochSecToInstant: function() { return /* binding */ De; },
/* harmony export */   excludePropsByName: function() { return /* binding */ V; },
/* harmony export */   excludeUndefinedProps: function() { return /* binding */ nn; },
/* harmony export */   forbiddenField: function() { return /* binding */ tn; },
/* harmony export */   forbiddenValueOf: function() { return /* binding */ A; },
/* harmony export */   formatDurationIso: function() { return /* binding */ zt; },
/* harmony export */   formatInstantIso: function() { return /* binding */ me; },
/* harmony export */   formatOffsetNano: function() { return /* binding */ Fe; },
/* harmony export */   formatPlainDateIso: function() { return /* binding */ yt; },
/* harmony export */   formatPlainDateTimeIso: function() { return /* binding */ Tt; },
/* harmony export */   formatPlainMonthDayIso: function() { return /* binding */ W; },
/* harmony export */   formatPlainTimeIso: function() { return /* binding */ qe; },
/* harmony export */   formatPlainYearMonthIso: function() { return /* binding */ et; },
/* harmony export */   formatZonedDateTimeIso: function() { return /* binding */ In; },
/* harmony export */   getCurrentEpochNano: function() { return /* binding */ Bn; },
/* harmony export */   getCurrentIsoDateTime: function() { return /* binding */ An; },
/* harmony export */   getCurrentTimeZoneId: function() { return /* binding */ Nn; },
/* harmony export */   getDurationBlank: function() { return /* binding */ Jt; },
/* harmony export */   getEpochMicro: function() { return /* binding */ N; },
/* harmony export */   getEpochMilli: function() { return /* binding */ y; },
/* harmony export */   getEpochNano: function() { return /* binding */ B; },
/* harmony export */   getEpochSec: function() { return /* binding */ M; },
/* harmony export */   getId: function() { return /* binding */ I; },
/* harmony export */   getRequiredDateFields: function() { return /* binding */ ln; },
/* harmony export */   getRequiredMonthDayFields: function() { return /* binding */ cn; },
/* harmony export */   getRequiredYearMonthFields: function() { return /* binding */ un; },
/* harmony export */   getSingleInstantFor: function() { return /* binding */ we; },
/* harmony export */   hasAllPropsByName: function() { return /* binding */ C; },
/* harmony export */   instantConfig: function() { return /* binding */ t; },
/* harmony export */   instantToZonedDateTime: function() { return /* binding */ fe; },
/* harmony export */   instantsEqual: function() { return /* binding */ ue; },
/* harmony export */   invalidBag: function() { return /* binding */ Z; },
/* harmony export */   invalidCallingContext: function() { return /* binding */ P; },
/* harmony export */   invalidFormatType: function() { return /* binding */ Ln; },
/* harmony export */   invalidProtocol: function() { return /* binding */ g; },
/* harmony export */   isObjectLike: function() { return /* binding */ z; },
/* harmony export */   isTimeZoneSlotsEqual: function() { return /* binding */ je; },
/* harmony export */   isoCalendarId: function() { return /* binding */ X; },
/* harmony export */   isoTimeFieldDefaults: function() { return /* binding */ Dt; },
/* harmony export */   isoTimeFieldNamesAsc: function() { return /* binding */ j; },
/* harmony export */   mapPropNames: function() { return /* binding */ b; },
/* harmony export */   mapProps: function() { return /* binding */ T; },
/* harmony export */   memoize: function() { return /* binding */ Jn; },
/* harmony export */   mismatchingFormatTypes: function() { return /* binding */ kn; },
/* harmony export */   monthDayConfig: function() { return /* binding */ i; },
/* harmony export */   moveInstant: function() { return /* binding */ se; },
/* harmony export */   movePlainDate: function() { return /* binding */ bt; },
/* harmony export */   movePlainDateTime: function() { return /* binding */ ct; },
/* harmony export */   movePlainTime: function() { return /* binding */ Ye; },
/* harmony export */   movePlainYearMonth: function() { return /* binding */ Qe; },
/* harmony export */   moveZonedDateTime: function() { return /* binding */ hn; },
/* harmony export */   nanoInMilli: function() { return /* binding */ be; },
/* harmony export */   negateDuration: function() { return /* binding */ xt; },
/* harmony export */   numberToBigNano: function() { return /* binding */ he; },
/* harmony export */   parseCalendarId: function() { return /* binding */ sn; },
/* harmony export */   parseDuration: function() { return /* binding */ Kt; },
/* harmony export */   parseInstant: function() { return /* binding */ pe; },
/* harmony export */   parsePlainDate: function() { return /* binding */ At; },
/* harmony export */   parsePlainDateTime: function() { return /* binding */ Ct; },
/* harmony export */   parsePlainMonthDay: function() { return /* binding */ Q; },
/* harmony export */   parsePlainTime: function() { return /* binding */ ze; },
/* harmony export */   parsePlainYearMonth: function() { return /* binding */ ot; },
/* harmony export */   parseRelativeToSlots: function() { return /* binding */ Xt; },
/* harmony export */   parseTimeZoneId: function() { return /* binding */ Ne; },
/* harmony export */   parseZonedDateTime: function() { return /* binding */ Mn; },
/* harmony export */   plainDateTimeToPlainMonthDay: function() { return /* binding */ Ot; },
/* harmony export */   plainDateTimeToPlainYearMonth: function() { return /* binding */ St; },
/* harmony export */   plainDateTimeToZonedDateTime: function() { return /* binding */ mt; },
/* harmony export */   plainDateTimeWithFields: function() { return /* binding */ at; },
/* harmony export */   plainDateTimeWithPlainDate: function() { return /* binding */ st; },
/* harmony export */   plainDateTimeWithPlainTime: function() { return /* binding */ lt; },
/* harmony export */   plainDateTimesEqual: function() { return /* binding */ ft; },
/* harmony export */   plainDateToPlainDateTime: function() { return /* binding */ wt; },
/* harmony export */   plainDateToPlainMonthDay: function() { return /* binding */ Mt; },
/* harmony export */   plainDateToPlainYearMonth: function() { return /* binding */ jt; },
/* harmony export */   plainDateToZonedDateTime: function() { return /* binding */ vt; },
/* harmony export */   plainDateWithFields: function() { return /* binding */ Zt; },
/* harmony export */   plainDatesEqual: function() { return /* binding */ It; },
/* harmony export */   plainMonthDayToPlainDate: function() { return /* binding */ R; },
/* harmony export */   plainMonthDayWithFields: function() { return /* binding */ k; },
/* harmony export */   plainMonthDaysEqual: function() { return /* binding */ x; },
/* harmony export */   plainTimeToPlainDateTime: function() { return /* binding */ Le; },
/* harmony export */   plainTimeToZonedDateTime: function() { return /* binding */ Je; },
/* harmony export */   plainTimeWithFields: function() { return /* binding */ Be; },
/* harmony export */   plainTimesEqual: function() { return /* binding */ Ve; },
/* harmony export */   plainYearMonthToPlainDate: function() { return /* binding */ _e; },
/* harmony export */   plainYearMonthWithFields: function() { return /* binding */ Ke; },
/* harmony export */   plainYearMonthsEqual: function() { return /* binding */ $e; },
/* harmony export */   pluckProps: function() { return /* binding */ Vn; },
/* harmony export */   queryNativeTimeZone: function() { return /* binding */ ie; },
/* harmony export */   refineCalendarId: function() { return /* binding */ rn; },
/* harmony export */   refineDateDiffOptions: function() { return /* binding */ _t; },
/* harmony export */   refineDurationBag: function() { return /* binding */ Ht; },
/* harmony export */   refineEpochDisambigOptions: function() { return /* binding */ ve; },
/* harmony export */   refineMaybeZonedDateTimeBag: function() { return /* binding */ Qt; },
/* harmony export */   refineOverflowOptions: function() { return /* binding */ H; },
/* harmony export */   refinePlainDateBag: function() { return /* binding */ Yt; },
/* harmony export */   refinePlainDateTimeBag: function() { return /* binding */ Pt; },
/* harmony export */   refinePlainMonthDayBag: function() { return /* binding */ K; },
/* harmony export */   refinePlainTimeBag: function() { return /* binding */ Ue; },
/* harmony export */   refinePlainYearMonthBag: function() { return /* binding */ nt; },
/* harmony export */   refineTimeZoneId: function() { return /* binding */ Me; },
/* harmony export */   refineZonedDateTimeBag: function() { return /* binding */ jn; },
/* harmony export */   refineZonedFieldOptions: function() { return /* binding */ wn; },
/* harmony export */   requireBoolean: function() { return /* binding */ f; },
/* harmony export */   requireFunction: function() { return /* binding */ $; },
/* harmony export */   requireInteger: function() { return /* binding */ u; },
/* harmony export */   requireIntegerOrUndefined: function() { return /* binding */ c; },
/* harmony export */   requireNonNullish: function() { return /* binding */ on; },
/* harmony export */   requireObjectLike: function() { return /* binding */ de; },
/* harmony export */   requirePositiveInteger: function() { return /* binding */ d; },
/* harmony export */   requirePositiveIntegerOrUndefined: function() { return /* binding */ S; },
/* harmony export */   requireString: function() { return /* binding */ m; },
/* harmony export */   requireStringOrUndefined: function() { return /* binding */ l; },
/* harmony export */   resolveCalendarId: function() { return /* binding */ an; },
/* harmony export */   resolveTimeZoneId: function() { return /* binding */ ye; },
/* harmony export */   roundDuration: function() { return /* binding */ Gt; },
/* harmony export */   roundInstant: function() { return /* binding */ ce; },
/* harmony export */   roundPlainDateTime: function() { return /* binding */ dt; },
/* harmony export */   roundPlainTime: function() { return /* binding */ Ee; },
/* harmony export */   roundZonedDateTime: function() { return /* binding */ Pn; },
/* harmony export */   slotsWithCalendar: function() { return /* binding */ it; },
/* harmony export */   slotsWithTimeZone: function() { return /* binding */ On; },
/* harmony export */   timeConfig: function() { return /* binding */ r; },
/* harmony export */   timeFieldNamesAsc: function() { return /* binding */ w; },
/* harmony export */   totalDuration: function() { return /* binding */ Ut; },
/* harmony export */   unitNamesAsc: function() { return /* binding */ Et; },
/* harmony export */   validateTimeZoneGap: function() { return /* binding */ ne; },
/* harmony export */   validateTimeZoneOffset: function() { return /* binding */ ae; },
/* harmony export */   yearMonthConfig: function() { return /* binding */ a; },
/* harmony export */   zonedConfig: function() { return /* binding */ s; },
/* harmony export */   zonedDateTimeToInstant: function() { return /* binding */ Zn; },
/* harmony export */   zonedDateTimeToPlainDate: function() { return /* binding */ Bt; },
/* harmony export */   zonedDateTimeToPlainDateTime: function() { return /* binding */ ht; },
/* harmony export */   zonedDateTimeToPlainMonthDay: function() { return /* binding */ Fn; },
/* harmony export */   zonedDateTimeToPlainTime: function() { return /* binding */ Re; },
/* harmony export */   zonedDateTimeToPlainYearMonth: function() { return /* binding */ bn; },
/* harmony export */   zonedDateTimeWithFields: function() { return /* binding */ Sn; },
/* harmony export */   zonedDateTimeWithPlainDate: function() { return /* binding */ Tn; },
/* harmony export */   zonedDateTimeWithPlainTime: function() { return /* binding */ pn; },
/* harmony export */   zonedDateTimesEqual: function() { return /* binding */ gn; },
/* harmony export */   zonedEpochSlotsToIso: function() { return /* binding */ fn; }
/* harmony export */ });
function clampProp(e, n, t, o, r) {
  return clampEntity(n, getDefinedProp(e, n), t, o, r);
}

function clampEntity(e, n, t, o, r, i) {
  const a = clampNumber(n, t, o);
  if (r && n !== a) {
    throw new RangeError(numberOutOfRange(e, n, t, o, i));
  }
  return a;
}

function getDefinedProp(e, n) {
  const t = e[n];
  if (void 0 === t) {
    throw new TypeError(missingField(n));
  }
  return t;
}

function z(e) {
  return null !== e && /object|function/.test(typeof e);
}

function Jn(e, n = Map) {
  const t = new n;
  return (n, ...o) => {
    if (t.has(n)) {
      return t.get(n);
    }
    const r = e(n, ...o);
    return t.set(n, r), r;
  };
}

function D(e) {
  return p({
    name: e
  }, 1);
}

function p(e, n) {
  return T((e => ({
    value: e,
    configurable: 1,
    writable: !n
  })), e);
}

function O(e) {
  return T((e => ({
    get: e,
    configurable: 1
  })), e);
}

function h(e) {
  return {
    [Symbol.toStringTag]: {
      value: e,
      configurable: 1
    }
  };
}

function zipProps(e, n) {
  const t = {};
  let o = e.length;
  for (const r of n) {
    t[e[--o]] = r;
  }
  return t;
}

function T(e, n, t) {
  const o = {};
  for (const r in n) {
    o[r] = e(n[r], r, t);
  }
  return o;
}

function b(e, n, t) {
  const o = {};
  for (let r = 0; r < n.length; r++) {
    const i = n[r];
    o[i] = e(i, r, t);
  }
  return o;
}

function remapProps(e, n, t) {
  const o = {};
  for (let r = 0; r < e.length; r++) {
    o[n[r]] = t[e[r]];
  }
  return o;
}

function Vn(e, n) {
  const t = {};
  for (const o of e) {
    t[o] = n[o];
  }
  return t;
}

function V(e, n) {
  const t = {};
  for (const o in n) {
    e.has(o) || (t[o] = n[o]);
  }
  return t;
}

function nn(e) {
  e = {
    ...e
  };
  const n = Object.keys(e);
  for (const t of n) {
    void 0 === e[t] && delete e[t];
  }
  return e;
}

function C(e, n) {
  for (const t of n) {
    if (!(t in e)) {
      return 0;
    }
  }
  return 1;
}

function allPropsEqual(e, n, t) {
  for (const o of e) {
    if (n[o] !== t[o]) {
      return 0;
    }
  }
  return 1;
}

function zeroOutProps(e, n, t) {
  const o = {
    ...t
  };
  for (let t = 0; t < n; t++) {
    o[e[t]] = 0;
  }
  return o;
}

function E(e, ...n) {
  return (...t) => e(...n, ...t);
}

function capitalize(e) {
  return e[0].toUpperCase() + e.substring(1);
}

function sortStrings(e) {
  return e.slice().sort();
}

function padNumber(e, n) {
  return String(n).padStart(e, "0");
}

function compareNumbers(e, n) {
  return Math.sign(e - n);
}

function clampNumber(e, n, t) {
  return Math.min(Math.max(e, n), t);
}

function divModFloor(e, n) {
  return [ Math.floor(e / n), modFloor(e, n) ];
}

function modFloor(e, n) {
  return (e % n + n) % n;
}

function divModTrunc(e, n) {
  return [ divTrunc(e, n), modTrunc(e, n) ];
}

function divTrunc(e, n) {
  return Math.trunc(e / n) || 0;
}

function modTrunc(e, n) {
  return e % n || 0;
}

function hasHalf(e) {
  return .5 === Math.abs(e % 1);
}

function givenFieldsToBigNano(e, n, t) {
  let o = 0, r = 0;
  for (let i = 0; i <= n; i++) {
    const n = e[t[i]], a = Xr[i], s = Qr / a, [c, u] = divModTrunc(n, s);
    o += u * a, r += c;
  }
  const [i, a] = divModTrunc(o, Qr);
  return [ r + i, a ];
}

function nanoToGivenFields(e, n, t) {
  const o = {};
  for (let r = n; r >= 0; r--) {
    const n = Xr[r];
    o[t[r]] = divTrunc(e, n), e = modTrunc(e, n);
  }
  return o;
}

function un(e) {
  return e === X ? si : [];
}

function cn(e) {
  return e === X ? li : [];
}

function ln(e) {
  return e === X ? [ "year", "day" ] : [];
}

function l(e) {
  if (void 0 !== e) {
    return m(e);
  }
}

function S(e) {
  if (void 0 !== e) {
    return d(e);
  }
}

function c(e) {
  if (void 0 !== e) {
    return u(e);
  }
}

function d(e) {
  return requireNumberIsPositive(u(e));
}

function u(e) {
  return requireNumberIsInteger(Ni(e));
}

function on(e) {
  if (null == e) {
    throw new TypeError("Cannot be null or undefined");
  }
  return e;
}

function requirePropDefined(e, n) {
  if (null == n) {
    throw new RangeError(missingField(e));
  }
  return n;
}

function de(e) {
  if (!z(e)) {
    throw new TypeError(hr);
  }
  return e;
}

function requireType(e, n, t = e) {
  if (typeof n !== e) {
    throw new TypeError(invalidEntity(t, n));
  }
  return n;
}

function requireNumberIsInteger(e, n = "number") {
  if (!Number.isInteger(e)) {
    throw new RangeError(expectedInteger(n, e));
  }
  return e || 0;
}

function requireNumberIsPositive(e, n = "number") {
  if (e <= 0) {
    throw new RangeError(expectedPositive(n, e));
  }
  return e;
}

function toString(e) {
  if ("symbol" == typeof e) {
    throw new TypeError(pr);
  }
  return String(e);
}

function toStringViaPrimitive(e, n) {
  return z(e) ? String(e) : m(e, n);
}

function toBigInt(e) {
  if ("string" == typeof e) {
    return BigInt(e);
  }
  if ("bigint" != typeof e) {
    throw new TypeError(invalidBigInt(e));
  }
  return e;
}

function toNumber(e, n = "number") {
  if ("bigint" == typeof e) {
    throw new TypeError(forbiddenBigIntToNumber(n));
  }
  if (e = Number(e), !Number.isFinite(e)) {
    throw new RangeError(expectedFinite(n, e));
  }
  return e;
}

function toInteger(e, n) {
  return Math.trunc(toNumber(e, n)) || 0;
}

function toStrictInteger(e, n) {
  return requireNumberIsInteger(toNumber(e, n), n);
}

function toPositiveInteger(e, n) {
  return requireNumberIsPositive(toInteger(e, n), n);
}

function createBigNano(e, n) {
  let [t, o] = divModTrunc(n, Qr), r = e + t;
  const i = Math.sign(r);
  return i && i === -Math.sign(o) && (r -= i, o += i * Qr), [ r, o ];
}

function addBigNanos(e, n, t = 1) {
  return createBigNano(e[0] + n[0] * t, e[1] + n[1] * t);
}

function moveBigNano(e, n) {
  return createBigNano(e[0], e[1] + n);
}

function re(e, n) {
  return addBigNanos(n, e, -1);
}

function te(e, n) {
  return compareNumbers(e[0], n[0]) || compareNumbers(e[1], n[1]);
}

function bigNanoOutside(e, n, t) {
  return -1 === te(e, n) || 1 === te(e, t);
}

function bigIntToBigNano(e, n = 1) {
  const t = BigInt(Qr / n);
  return [ Number(e / t), Number(e % t) * n ];
}

function he(e, n = 1) {
  const t = Qr / n, [o, r] = divModTrunc(e, t);
  return [ o, r * n ];
}

function bigNanoToBigInt(e, n = 1) {
  const [t, o] = e, r = Math.floor(o / n), i = Qr / n;
  return BigInt(t) * BigInt(i) + BigInt(r);
}

function oe(e, n = 1, t) {
  const [o, r] = e, [i, a] = divModTrunc(r, n);
  return o * (Qr / n) + (i + (t ? a / n : 0));
}

function divModBigNano(e, n, t = divModFloor) {
  const [o, r] = e, [i, a] = t(r, n);
  return [ o * (Qr / n) + i, a ];
}

function hashIntlFormatParts(e, n) {
  const t = e.formatToParts(n), o = {};
  for (const e of t) {
    o[e.type] = e.value;
  }
  return o;
}

function checkIsoYearMonthInBounds(e) {
  return clampProp(e, "isoYear", Wi, Li, 1), e.isoYear === Wi ? clampProp(e, "isoMonth", 4, 12, 1) : e.isoYear === Li && clampProp(e, "isoMonth", 1, 9, 1), 
  e;
}

function checkIsoDateInBounds(e) {
  return checkIsoDateTimeInBounds({
    ...e,
    ...Dt,
    isoHour: 12
  }), e;
}

function checkIsoDateTimeInBounds(e) {
  const n = clampProp(e, "isoYear", Wi, Li, 1), t = n === Wi ? 1 : n === Li ? -1 : 0;
  return t && checkEpochNanoInBounds(isoToEpochNano({
    ...e,
    isoDay: e.isoDay + t,
    isoNanosecond: e.isoNanosecond - t
  })), e;
}

function checkEpochNanoInBounds(e) {
  if (!e || bigNanoOutside(e, Ui, Ai)) {
    throw new RangeError(Cr);
  }
  return e;
}

function isoTimeFieldsToNano(e) {
  return givenFieldsToBigNano(e, 5, j)[1];
}

function nanoToIsoTimeAndDay(e) {
  const [n, t] = divModFloor(e, Qr);
  return [ nanoToGivenFields(t, 5, j), n ];
}

function epochNanoToSec(e) {
  return epochNanoToSecMod(e)[0];
}

function epochNanoToSecMod(e) {
  return divModBigNano(e, _r);
}

function isoToEpochMilli(e) {
  return isoArgsToEpochMilli(e.isoYear, e.isoMonth, e.isoDay, e.isoHour, e.isoMinute, e.isoSecond, e.isoMillisecond);
}

function isoToEpochNano(e) {
  const n = isoToEpochMilli(e);
  if (void 0 !== n) {
    const [t, o] = divModTrunc(n, Gr);
    return [ t, o * be + (e.isoMicrosecond || 0) * Vr + (e.isoNanosecond || 0) ];
  }
}

function isoToEpochNanoWithOffset(e, n) {
  const [t, o] = nanoToIsoTimeAndDay(isoTimeFieldsToNano(e) - n);
  return checkEpochNanoInBounds(isoToEpochNano({
    ...e,
    isoDay: e.isoDay + o,
    ...t
  }));
}

function isoArgsToEpochSec(...e) {
  return isoArgsToEpochMilli(...e) / Hr;
}

function isoArgsToEpochMilli(...e) {
  const [n, t] = isoToLegacyDate(...e), o = n.valueOf();
  if (!isNaN(o)) {
    return o - t * Gr;
  }
}

function isoToLegacyDate(e, n = 1, t = 1, o = 0, r = 0, i = 0, a = 0) {
  const s = e === Wi ? 1 : e === Li ? -1 : 0, c = new Date;
  return c.setUTCHours(o, r, i, a), c.setUTCFullYear(e, n - 1, t + s), [ c, s ];
}

function Ie(e, n) {
  let [t, o] = moveBigNano(e, n);
  o < 0 && (o += Qr, t -= 1);
  const [r, i] = divModFloor(o, be), [a, s] = divModFloor(i, Vr);
  return epochMilliToIso(t * Gr + r, a, s);
}

function epochMilliToIso(e, n = 0, t = 0) {
  const o = Math.ceil(Math.max(0, Math.abs(e) - qi) / Gr) * Math.sign(e), r = new Date(e - o * Gr);
  return zipProps(Bi, [ r.getUTCFullYear(), r.getUTCMonth() + 1, r.getUTCDate() + o, r.getUTCHours(), r.getUTCMinutes(), r.getUTCSeconds(), r.getUTCMilliseconds(), n, t ]);
}

function computeIsoDateParts(e) {
  return [ e.isoYear, e.isoMonth, e.isoDay ];
}

function computeIsoMonthsInYear() {
  return $i;
}

function computeIsoDaysInMonth(e, n) {
  switch (n) {
   case 2:
    return computeIsoInLeapYear(e) ? 29 : 28;

   case 4:
   case 6:
   case 9:
   case 11:
    return 30;
  }
  return 31;
}

function computeIsoDaysInYear(e) {
  return computeIsoInLeapYear(e) ? 366 : 365;
}

function computeIsoInLeapYear(e) {
  return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
}

function computeIsoDayOfWeek(e) {
  const [n, t] = isoToLegacyDate(e.isoYear, e.isoMonth, e.isoDay);
  return modFloor(n.getUTCDay() - t, 7) || 7;
}

function computeGregoryEraParts({isoYear: e}) {
  return e < 1 ? [ "bce", 1 - e ] : [ "ce", e ];
}

function computeJapaneseEraParts(e) {
  const n = isoToEpochMilli(e);
  if (n < Gi) {
    return computeGregoryEraParts(e);
  }
  const t = hashIntlFormatParts(Wa(Ti), n), {era: o, eraYear: r} = parseIntlYear(t, Ti);
  return [ o, r ];
}

function checkIsoDateTimeFields(e) {
  return checkIsoDateFields(e), constrainIsoTimeFields(e, 1), e;
}

function checkIsoDateFields(e) {
  return constrainIsoDateFields(e, 1), e;
}

function isIsoDateFieldsValid(e) {
  return allPropsEqual(wi, e, constrainIsoDateFields(e));
}

function constrainIsoDateFields(e, n) {
  const {isoYear: t} = e, o = clampProp(e, "isoMonth", 1, computeIsoMonthsInYear(), n);
  return {
    isoYear: t,
    isoMonth: o,
    isoDay: clampProp(e, "isoDay", 1, computeIsoDaysInMonth(t, o), n)
  };
}

function constrainIsoTimeFields(e, n) {
  return zipProps(j, [ clampProp(e, "isoHour", 0, 23, n), clampProp(e, "isoMinute", 0, 59, n), clampProp(e, "isoSecond", 0, 59, n), clampProp(e, "isoMillisecond", 0, 999, n), clampProp(e, "isoMicrosecond", 0, 999, n), clampProp(e, "isoNanosecond", 0, 999, n) ]);
}

function H(e) {
  return void 0 === e ? 0 : la(de(e));
}

function wn(e, n = 0) {
  e = normalizeOptions(e);
  const t = fa(e), o = da(e, n);
  return [ la(e), o, t ];
}

function ve(e) {
  return fa(normalizeOptions(e));
}

function _t(e) {
  return e = normalizeOptions(e), ca(e, 9, 6, 1);
}

function refineDiffOptions(e, n, t, o = 9, r = 0, i = 4) {
  n = normalizeOptions(n);
  let a = ca(n, o, r), s = parseRoundingIncInteger(n), c = ga(n, i);
  const u = sa(n, o, r, 1);
  return null == a ? a = Math.max(t, u) : checkLargestSmallestUnit(a, u), s = refineRoundingInc(s, u, 1), 
  e && (c = (e => e < 4 ? (e + 2) % 4 : e)(c)), [ a, u, s, c ];
}

function refineRoundingOptions(e, n = 6, t) {
  let o = parseRoundingIncInteger(e = normalizeOptionsOrString(e, Vi));
  const r = ga(e, 7);
  let i = sa(e, n);
  return i = requirePropDefined(Vi, i), o = refineRoundingInc(o, i, void 0, t), [ i, o, r ];
}

function refineDateDisplayOptions(e) {
  return ma(normalizeOptions(e));
}

function refineTimeDisplayOptions(e, n) {
  return refineTimeDisplayTuple(normalizeOptions(e), n);
}

function refineTimeDisplayTuple(e, n = 4) {
  const t = refineSubsecDigits(e);
  return [ ga(e, 4), ...refineSmallestUnitAndSubsecDigits(sa(e, n), t) ];
}

function refineSmallestUnitAndSubsecDigits(e, n) {
  return null != e ? [ Xr[e], e < 4 ? 9 - 3 * e : -1 ] : [ void 0 === n ? 1 : 10 ** (9 - n), n ];
}

function parseRoundingIncInteger(e) {
  const n = e[Ji];
  return void 0 === n ? 1 : toInteger(n, Ji);
}

function refineRoundingInc(e, n, t, o) {
  const r = o ? Qr : Xr[n + 1];
  if (r) {
    const t = Xr[n];
    if (r % ((e = clampEntity(Ji, e, 1, r / t - (o ? 0 : 1), 1)) * t)) {
      throw new RangeError(invalidEntity(Ji, e));
    }
  } else {
    e = clampEntity(Ji, e, 1, t ? 10 ** 9 : 1, 1);
  }
  return e;
}

function refineSubsecDigits(e) {
  let n = e[Ki];
  if (void 0 !== n) {
    if ("number" != typeof n) {
      if ("auto" === toString(n)) {
        return;
      }
      throw new RangeError(invalidEntity(Ki, n));
    }
    n = clampEntity(Ki, Math.floor(n), 0, 9, 1);
  }
  return n;
}

function normalizeOptions(e) {
  return void 0 === e ? {} : de(e);
}

function normalizeOptionsOrString(e, n) {
  return "string" == typeof e ? {
    [n]: e
  } : de(e);
}

function U(e) {
  if (void 0 !== e) {
    if (z(e)) {
      return Object.assign(Object.create(null), e);
    }
    throw new TypeError(hr);
  }
}

function overrideOverflowOptions(e, n) {
  return e && Object.assign(Object.create(null), e, {
    overflow: ea[n]
  });
}

function refineUnitOption(e, n, t = 9, o = 0, r) {
  let i = n[e];
  if (void 0 === i) {
    return r ? o : void 0;
  }
  if (i = toString(i), "auto" === i) {
    return r ? o : null;
  }
  let a = $r[i];
  if (void 0 === a && (a = Si[i]), void 0 === a) {
    throw new RangeError(invalidChoice(e, i, $r));
  }
  return clampEntity(e, a, o, t, 1, Et), a;
}

function refineChoiceOption(e, n, t, o = 0) {
  const r = t[e];
  if (void 0 === r) {
    return o;
  }
  const i = toString(r), a = n[i];
  if (void 0 === a) {
    throw new RangeError(invalidChoice(e, i, n));
  }
  return a;
}

function checkLargestSmallestUnit(e, n) {
  if (n > e) {
    throw new RangeError(Ur);
  }
}

function _(e) {
  return {
    branding: Oe,
    epochNanoseconds: e
  };
}

function Yn(e, n, t) {
  return {
    branding: Te,
    calendar: t,
    timeZone: n,
    epochNanoseconds: e
  };
}

function ee(e, n = e.calendar) {
  return {
    branding: We,
    calendar: n,
    ...Vn(Ci, e)
  };
}

function v(e, n = e.calendar) {
  return {
    branding: J,
    calendar: n,
    ...Vn(ki, e)
  };
}

function createPlainYearMonthSlots(e, n = e.calendar) {
  return {
    branding: L,
    calendar: n,
    ...Vn(ki, e)
  };
}

function createPlainMonthDaySlots(e, n = e.calendar) {
  return {
    branding: q,
    calendar: n,
    ...Vn(ki, e)
  };
}

function Ge(e) {
  return {
    branding: xe,
    ...Vn(Yi, e)
  };
}

function Vt(e) {
  return {
    branding: qt,
    sign: computeDurationSign(e),
    ...Vn(yi, e)
  };
}

function M(e) {
  return epochNanoToSec(e.epochNanoseconds);
}

function y(e) {
  return divModBigNano(e.epochNanoseconds, be)[0];
}

function N(e) {
  return bigNanoToBigInt(e.epochNanoseconds, Vr);
}

function B(e) {
  return bigNanoToBigInt(e.epochNanoseconds);
}

function extractEpochNano(e) {
  return e.epochNanoseconds;
}

function I(e) {
  return "string" == typeof e ? e : m(e.id);
}

function isIdLikeEqual(e, n) {
  return e === n || I(e) === I(n);
}

function Ut(e, n, t, o, r) {
  const i = getLargestDurationUnit(o), [a, s] = ((e, n) => {
    const t = n((e = normalizeOptionsOrString(e, _i))[Qi]);
    let o = ua(e);
    return o = requirePropDefined(_i, o), [ o, t ];
  })(r, e);
  if (isUniformUnit(Math.max(a, i), s)) {
    return ((e, n) => oe(durationFieldsToBigNano(e), Xr[n], 1))(o, a);
  }
  if (!s) {
    throw new RangeError(zr);
  }
  const [c, u, l] = createMarkerSystem(n, t, s), f = createMarkerToEpochNano(l), d = createMoveMarker(u, l);
  return ((e, n, t, o, r, i) => {
    const a = computeDurationSign(e), [s, c] = clampRelativeDuration(Oi(t, e), t, a, o, r, i), u = computeEpochNanoFrac(n, s, c);
    return e[F[t]] + u * a;
  })(...spanDuration(o, a, c, f, d, createDiffMarkers(u, l)), a, c, f, d);
}

function clampRelativeDuration(e, n, t, o, r, i) {
  const a = {
    ...Fi,
    [F[n]]: t
  }, s = i(o, e), c = i(s, a);
  return [ r(s), r(c) ];
}

function computeEpochNanoFrac(e, n, t) {
  const o = oe(re(n, t));
  if (!o) {
    throw new RangeError(vr);
  }
  return oe(re(n, e)) / o;
}

function ce(e, n) {
  const [t, o, r] = refineRoundingOptions(n, 5, 1);
  return _(roundBigNano(e.epochNanoseconds, t, o, r, 1));
}

function Pn(e, n, t) {
  let {epochNanoseconds: o, timeZone: r, calendar: i} = n;
  const [a, s, c] = refineRoundingOptions(t);
  if (0 === a && 1 === s) {
    return n;
  }
  const u = e(r);
  if (6 === a) {
    o = ((e, n, t, o) => {
      const r = fn(t, n), [i, a] = e(r), s = t.epochNanoseconds, c = we(n, i), u = we(n, a);
      if (bigNanoOutside(s, c, u)) {
        throw new RangeError(vr);
      }
      return roundWithMode(computeEpochNanoFrac(s, c, u), o) ? u : c;
    })(computeDayInterval, u, n, c);
  } else {
    const e = u.getOffsetNanosecondsFor(o);
    o = getMatchingInstantFor(u, roundDateTime(Ie(o, e), a, s, c), e, 2, 0, 1);
  }
  return Yn(o, r, i);
}

function dt(e, n) {
  return ee(roundDateTime(e, ...refineRoundingOptions(n)), e.calendar);
}

function Ee(e, n) {
  const [t, o, r] = refineRoundingOptions(n, 5);
  var i;
  return Ge((i = r, roundTimeToNano(e, computeNanoInc(t, o), i)[0]));
}

function dn(e, n) {
  const t = e(n.timeZone), o = fn(n, t), [r, i] = computeDayInterval(o), a = oe(re(we(t, r), we(t, i)), Kr, 1);
  if (a <= 0) {
    throw new RangeError(vr);
  }
  return a;
}

function Cn(e, n) {
  const {timeZone: t, calendar: o} = n, r = ((e, n, t) => we(n, e(fn(t, n))))(computeDayFloor, e(t), n);
  return Yn(r, t, o);
}

function roundDateTime(e, n, t, o) {
  return roundDateTimeToNano(e, computeNanoInc(n, t), o);
}

function roundDateTimeToNano(e, n, t) {
  const [o, r] = roundTimeToNano(e, n, t);
  return checkIsoDateTimeInBounds({
    ...moveByDays(e, r),
    ...o
  });
}

function roundTimeToNano(e, n, t) {
  return nanoToIsoTimeAndDay(roundByInc(isoTimeFieldsToNano(e), n, t));
}

function roundToMinute(e) {
  return roundByInc(e, Jr, 7);
}

function computeNanoInc(e, n) {
  return Xr[e] * n;
}

function computeDayInterval(e) {
  const n = computeDayFloor(e);
  return [ n, moveByDays(n, 1) ];
}

function computeDayFloor(e) {
  return Zi(6, e);
}

function roundDayTimeDurationByInc(e, n, t) {
  const o = Math.min(getLargestDurationUnit(e), 6);
  return nanoToDurationDayTimeFields(roundBigNanoByInc(durationFieldsToBigNano(e, o), n, t), o);
}

function roundRelativeDuration(e, n, t, o, r, i, a, s, c) {
  if (0 === o && 1 === r) {
    return e;
  }
  const u = o > 6 ? nudgeRelativeDuration : isZonedEpochSlots(a) && o < 6 ? nudgeZonedTimeDuration : nudgeDayTimeDuration;
  let [l, f, d] = u(e, n, t, o, r, i, a, s, c);
  return d && (l = ((e, n, t, o, r, i, a) => {
    const s = computeDurationSign(e);
    for (let c = o + 1; c <= t; c++) {
      if (7 === c && 7 !== t) {
        continue;
      }
      const o = Oi(c, e);
      o[F[c]] += s;
      const u = oe(re(i(a(r, o)), n));
      if (u && Math.sign(u) !== s) {
        break;
      }
      e = o;
    }
    return e;
  })(l, f, t, Math.max(6, o), a, s, c)), l;
}

function roundBigNano(e, n, t, o, r) {
  if (6 === n) {
    const n = (e => e[0] + e[1] / Qr)(e);
    return [ roundByInc(n, t, o), 0 ];
  }
  return roundBigNanoByInc(e, computeNanoInc(n, t), o, r);
}

function roundBigNanoByInc(e, n, t, o) {
  let [r, i] = e;
  o && i < 0 && (i += Qr, r -= 1);
  const [a, s] = divModFloor(roundByInc(i, n, t), Qr);
  return createBigNano(r + a, s);
}

function roundByInc(e, n, t) {
  return roundWithMode(e / n, t) * n;
}

function roundWithMode(e, n) {
  return Ta[n](e);
}

function nudgeDayTimeDuration(e, n, t, o, r, i) {
  const a = computeDurationSign(e), s = durationFieldsToBigNano(e), c = roundBigNano(s, o, r, i), u = re(s, c), l = Math.sign(c[0] - s[0]) === a, f = nanoToDurationDayTimeFields(c, Math.min(t, 6));
  return [ {
    ...e,
    ...f
  }, addBigNanos(n, u), l ];
}

function nudgeZonedTimeDuration(e, n, t, o, r, i, a, s, c) {
  const u = computeDurationSign(e);
  let [l, f] = durationFieldsToBigNano(e, 5);
  const d = computeNanoInc(o, r);
  let m = roundByInc(f, d, i);
  const [p, h] = clampRelativeDuration({
    ...e,
    ...bi
  }, 6, u, a, s, c), g = m - oe(re(p, h));
  g && Math.sign(g) !== u ? n = moveBigNano(p, m) : (l += u, m = roundByInc(g, d, i), 
  n = moveBigNano(h, m));
  const T = nanoToDurationTimeFields(m);
  return [ {
    ...e,
    ...T,
    days: e.days + l
  }, n, Boolean(l) ];
}

function nudgeRelativeDuration(e, n, t, o, r, i, a, s, c) {
  const u = computeDurationSign(e), l = F[o], f = Oi(o, e), d = divTrunc(e[l], r) * r;
  f[l] = d;
  const [m, p] = clampRelativeDuration(f, o, r * u, a, s, c), h = d + computeEpochNanoFrac(n, m, p) * u * r, g = roundByInc(h, r, i), T = Math.sign(g - h) === u;
  return f[l] = g, [ f, T ? p : m, T ];
}

function me(e, n, t, o) {
  const [r, i, a, s] = (e => {
    const n = refineTimeDisplayTuple(e = normalizeOptions(e));
    return [ e.timeZone, ...n ];
  })(o), c = void 0 !== r;
  return ((e, n, t, o, r, i) => {
    t = roundBigNanoByInc(t, r, o, 1);
    const a = n.getOffsetNanosecondsFor(t);
    return formatIsoDateTimeFields(Ie(t, a), i) + (e ? Fe(roundToMinute(a)) : "Z");
  })(c, n(c ? e(r) : Da), t.epochNanoseconds, i, a, s);
}

function In(e, n, t) {
  const [o, r, i, a, s, c] = (e => {
    e = normalizeOptions(e);
    const n = ma(e), t = refineSubsecDigits(e), o = ha(e), r = ga(e, 4), i = sa(e, 4);
    return [ n, pa(e), o, r, ...refineSmallestUnitAndSubsecDigits(i, t) ];
  })(t);
  return ((e, n, t, o, r, i, a, s, c, u) => {
    o = roundBigNanoByInc(o, c, s, 1);
    const l = e(t).getOffsetNanosecondsFor(o);
    return formatIsoDateTimeFields(Ie(o, l), u) + Fe(roundToMinute(l), a) + ((e, n) => 1 !== n ? "[" + (2 === n ? "!" : "") + I(e) + "]" : "")(t, i) + formatCalendar(n, r);
  })(e, n.calendar, n.timeZone, n.epochNanoseconds, o, r, i, a, s, c);
}

function Tt(e, n) {
  const [t, o, r, i] = (e => (e = normalizeOptions(e), [ ma(e), ...refineTimeDisplayTuple(e) ]))(n);
  return a = e.calendar, s = t, c = i, formatIsoDateTimeFields(roundDateTimeToNano(e, r, o), c) + formatCalendar(a, s);
  var a, s, c;
}

function yt(e, n) {
  return t = e.calendar, o = e, r = refineDateDisplayOptions(n), formatIsoDateFields(o) + formatCalendar(t, r);
  var t, o, r;
}

function et(e, n) {
  return formatDateLikeIso(e.calendar, formatIsoYearMonthFields, e, refineDateDisplayOptions(n));
}

function W(e, n) {
  return formatDateLikeIso(e.calendar, formatIsoMonthDayFields, e, refineDateDisplayOptions(n));
}

function qe(e, n) {
  const [t, o, r] = refineTimeDisplayOptions(n);
  return i = r, formatIsoTimeFields(roundTimeToNano(e, o, t)[0], i);
  var i;
}

function zt(e, n) {
  const [t, o, r] = refineTimeDisplayOptions(n, 3);
  return o > 1 && (e = {
    ...e,
    ...roundDayTimeDurationByInc(e, o, t)
  }), ((e, n) => {
    const {sign: t} = e, o = -1 === t ? negateDurationFields(e) : e, {hours: r, minutes: i} = o, [a, s] = divModBigNano(durationFieldsToBigNano(o, 3), _r, divModTrunc);
    checkDurationTimeUnit(a);
    const c = formatSubsecNano(s, n), u = n >= 0 || !t || c;
    return (t < 0 ? "-" : "") + "P" + formatDurationFragments({
      Y: formatDurationNumber(o.years),
      M: formatDurationNumber(o.months),
      W: formatDurationNumber(o.weeks),
      D: formatDurationNumber(o.days)
    }) + (r || i || a || u ? "T" + formatDurationFragments({
      H: formatDurationNumber(r),
      M: formatDurationNumber(i),
      S: formatDurationNumber(a, u) + c
    }) : "");
  })(e, r);
}

function formatDateLikeIso(e, n, t, o) {
  const r = I(e), i = o > 1 || 0 === o && r !== X;
  return 1 === o ? r === X ? n(t) : formatIsoDateFields(t) : i ? formatIsoDateFields(t) + formatCalendarId(r, 2 === o) : n(t);
}

function formatDurationFragments(e) {
  const n = [];
  for (const t in e) {
    const o = e[t];
    o && n.push(o, t);
  }
  return n.join("");
}

function formatIsoDateTimeFields(e, n) {
  return formatIsoDateFields(e) + "T" + formatIsoTimeFields(e, n);
}

function formatIsoDateFields(e) {
  return formatIsoYearMonthFields(e) + "-" + xr(e.isoDay);
}

function formatIsoYearMonthFields(e) {
  const {isoYear: n} = e;
  return (n < 0 || n > 9999 ? getSignStr(n) + padNumber(6, Math.abs(n)) : padNumber(4, n)) + "-" + xr(e.isoMonth);
}

function formatIsoMonthDayFields(e) {
  return xr(e.isoMonth) + "-" + xr(e.isoDay);
}

function formatIsoTimeFields(e, n) {
  const t = [ xr(e.isoHour), xr(e.isoMinute) ];
  return -1 !== n && t.push(xr(e.isoSecond) + ((e, n, t, o) => formatSubsecNano(e * be + n * Vr + t, o))(e.isoMillisecond, e.isoMicrosecond, e.isoNanosecond, n)), 
  t.join(":");
}

function Fe(e, n = 0) {
  if (1 === n) {
    return "";
  }
  const [t, o] = divModFloor(Math.abs(e), Kr), [r, i] = divModFloor(o, Jr), [a, s] = divModFloor(i, _r);
  return getSignStr(e) + xr(t) + ":" + xr(r) + (a || s ? ":" + xr(a) + formatSubsecNano(s) : "");
}

function formatCalendar(e, n) {
  if (1 !== n) {
    const t = I(e);
    if (n > 1 || 0 === n && t !== X) {
      return formatCalendarId(t, 2 === n);
    }
  }
  return "";
}

function formatCalendarId(e, n) {
  return "[" + (n ? "!" : "") + "u-ca=" + e + "]";
}

function formatSubsecNano(e, n) {
  let t = padNumber(9, e);
  return t = void 0 === n ? t.replace(ya, "") : t.slice(0, n), t ? "." + t : "";
}

function getSignStr(e) {
  return e < 0 ? "-" : "+";
}

function formatDurationNumber(e, n) {
  return e || n ? e.toLocaleString("fullwide", {
    useGrouping: 0
  }) : "";
}

function _zonedEpochSlotsToIso(e, n) {
  const {epochNanoseconds: t} = e, o = (n.getOffsetNanosecondsFor ? n : n(e.timeZone)).getOffsetNanosecondsFor(t), r = Ie(t, o);
  return {
    calendar: e.calendar,
    ...r,
    offsetNanoseconds: o
  };
}

function mn(e, n) {
  const t = fn(n, e);
  return {
    calendar: n.calendar,
    ...Vn(Ci, t),
    offset: Fe(t.offsetNanoseconds),
    timeZone: n.timeZone
  };
}

function getMatchingInstantFor(e, n, t, o = 0, r = 0, i, a) {
  if (void 0 !== t && 1 === o && (1 === o || a)) {
    return isoToEpochNanoWithOffset(n, t);
  }
  const s = e.getPossibleInstantsFor(n);
  if (void 0 !== t && 3 !== o) {
    const e = ((e, n, t, o) => {
      const r = isoToEpochNano(n);
      o && (t = roundToMinute(t));
      for (const n of e) {
        let e = oe(re(n, r));
        if (o && (e = roundToMinute(e)), e === t) {
          return n;
        }
      }
    })(s, n, t, i);
    if (void 0 !== e) {
      return e;
    }
    if (0 === o) {
      throw new RangeError(kr);
    }
  }
  return a ? isoToEpochNano(n) : we(e, n, r, s);
}

function we(e, n, t = 0, o = e.getPossibleInstantsFor(n)) {
  if (1 === o.length) {
    return o[0];
  }
  if (1 === t) {
    throw new RangeError(Yr);
  }
  if (o.length) {
    return o[3 === t ? 1 : 0];
  }
  const r = isoToEpochNano(n), i = ((e, n) => {
    const t = e.getOffsetNanosecondsFor(moveBigNano(n, -Qr));
    return ne(e.getOffsetNanosecondsFor(moveBigNano(n, Qr)) - t);
  })(e, r), a = i * (2 === t ? -1 : 1);
  return (o = e.getPossibleInstantsFor(Ie(r, a)))[2 === t ? 0 : o.length - 1];
}

function ae(e) {
  if (Math.abs(e) >= Qr) {
    throw new RangeError(wr);
  }
  return e;
}

function ne(e) {
  if (e > Qr) {
    throw new RangeError(Br);
  }
  return e;
}

function se(e, n, t) {
  return _(checkEpochNanoInBounds(addBigNanos(n.epochNanoseconds, (e => {
    if (durationHasDateParts(e)) {
      throw new RangeError(qr);
    }
    return durationFieldsToBigNano(e, 5);
  })(e ? negateDurationFields(t) : t))));
}

function hn(e, n, t, o, r, i = Object.create(null)) {
  const a = n(o.timeZone), s = e(o.calendar);
  return {
    ...o,
    ...moveZonedEpochs(s, a, o, t ? negateDurationFields(r) : r, i)
  };
}

function ct(e, n, t, o, r = Object.create(null)) {
  const {calendar: i} = t;
  return ee(moveDateTime(e(i), t, n ? negateDurationFields(o) : o, r), i);
}

function bt(e, n, t, o, r) {
  const {calendar: i} = t;
  return v(moveDate(e(i), t, n ? negateDurationFields(o) : o, r), i);
}

function Qe(e, n, t, o, r = Object.create(null)) {
  const i = t.calendar, a = e(i);
  let s = moveToDayOfMonthUnsafe(a, t);
  n && (o = xt(o)), o.sign < 0 && (s = a.dateAdd(s, {
    ...Fi,
    months: 1
  }), s = moveByDays(s, -1));
  const c = a.dateAdd(s, o, r);
  return createPlainYearMonthSlots(moveToDayOfMonthUnsafe(a, c), i);
}

function Ye(e, n, t) {
  return Ge(moveTime(n, e ? negateDurationFields(t) : t)[0]);
}

function moveZonedEpochs(e, n, t, o, r) {
  const i = durationFieldsToBigNano(o, 5);
  let a = t.epochNanoseconds;
  if (durationHasDateParts(o)) {
    const s = fn(t, n);
    a = addBigNanos(we(n, {
      ...moveDate(e, s, {
        ...o,
        ...bi
      }, r),
      ...Vn(j, s)
    }), i);
  } else {
    a = addBigNanos(a, i), H(r);
  }
  return {
    epochNanoseconds: checkEpochNanoInBounds(a)
  };
}

function moveDateTime(e, n, t, o) {
  const [r, i] = moveTime(n, t);
  return checkIsoDateTimeInBounds({
    ...moveDate(e, n, {
      ...t,
      ...bi,
      days: t.days + i
    }, o),
    ...r
  });
}

function moveDate(e, n, t, o) {
  if (t.years || t.months || t.weeks) {
    return e.dateAdd(n, t, o);
  }
  H(o);
  const r = t.days + durationFieldsToBigNano(t, 5)[0];
  return r ? checkIsoDateInBounds(moveByDays(n, r)) : n;
}

function moveToDayOfMonthUnsafe(e, n, t = 1) {
  return moveByDays(n, t - e.day(n));
}

function moveTime(e, n) {
  const [t, o] = durationFieldsToBigNano(n, 5), [r, i] = nanoToIsoTimeAndDay(isoTimeFieldsToNano(e) + o);
  return [ r, t + i ];
}

function moveByDays(e, n) {
  return n ? {
    ...e,
    ...epochMilliToIso(isoToEpochMilli(e) + n * Gr)
  } : e;
}

function createMarkerSystem(e, n, t) {
  const o = e(t.calendar);
  return isZonedEpochSlots(t) ? [ t, o, n(t.timeZone) ] : [ {
    ...t,
    ...Dt
  }, o ];
}

function createMarkerToEpochNano(e) {
  return e ? extractEpochNano : isoToEpochNano;
}

function createMoveMarker(e, n) {
  return n ? E(moveZonedEpochs, e, n) : E(moveDateTime, e);
}

function createDiffMarkers(e, n) {
  return n ? E(diffZonedEpochsExact, e, n) : E(diffDateTimesExact, e);
}

function isZonedEpochSlots(e) {
  return e && e.epochNanoseconds;
}

function isUniformUnit(e, n) {
  return e <= 6 - (isZonedEpochSlots(n) ? 1 : 0);
}

function spanDuration(e, n, t, o, r, i) {
  const a = r(t, e);
  return [ i(t, a, n), o(a) ];
}

function Wt(e, n, t, o, r, i, a) {
  const s = e(normalizeOptions(a).relativeTo), c = Math.max(getLargestDurationUnit(r), getLargestDurationUnit(i));
  if (isUniformUnit(c, s)) {
    return Vt(checkDurationUnits(((e, n, t, o) => {
      const r = addBigNanos(durationFieldsToBigNano(e), durationFieldsToBigNano(n), o ? -1 : 1);
      if (!Number.isFinite(r[0])) {
        throw new RangeError(Cr);
      }
      return {
        ...Fi,
        ...nanoToDurationDayTimeFields(r, t)
      };
    })(r, i, c, o)));
  }
  if (!s) {
    throw new RangeError(zr);
  }
  o && (i = negateDurationFields(i));
  const [u, l, f] = createMarkerSystem(n, t, s), d = createMoveMarker(l, f), m = createDiffMarkers(l, f), p = d(u, r);
  return Vt(m(u, d(p, i), c));
}

function Gt(e, n, t, o, r) {
  const i = getLargestDurationUnit(o), [a, s, c, u, l] = ((e, n, t) => {
    e = normalizeOptionsOrString(e, Vi);
    let o = ca(e);
    const r = t(e[Qi]);
    let i = parseRoundingIncInteger(e);
    const a = ga(e, 7);
    let s = sa(e);
    if (void 0 === o && void 0 === s) {
      throw new RangeError(Ar);
    }
    return null == s && (s = 0), null == o && (o = Math.max(s, n)), checkLargestSmallestUnit(o, s), 
    i = refineRoundingInc(i, s, 1), [ o, s, i, a, r ];
  })(r, i, e);
  if (isUniformUnit(Math.max(i, a), l)) {
    return Vt(checkDurationUnits(((e, n, t, o, r) => {
      const i = roundBigNano(durationFieldsToBigNano(e), t, o, r);
      return {
        ...Fi,
        ...nanoToDurationDayTimeFields(i, n)
      };
    })(o, a, s, c, u)));
  }
  if (!l) {
    throw new RangeError(zr);
  }
  const [f, d, m] = createMarkerSystem(n, t, l), p = createMarkerToEpochNano(m), h = createMoveMarker(d, m), g = createDiffMarkers(d, m);
  let T = 0;
  o.weeks && 7 === s && (T = o.weeks, o = {
    ...o,
    weeks: 0
  });
  let [D, I] = spanDuration(o, a, f, p, h, g);
  const M = o.sign, N = computeDurationSign(D);
  if (M && N && M !== N) {
    throw new RangeError(vr);
  }
  return N && (D = roundRelativeDuration(D, I, a, s, c, u, f, p, h)), D.weeks += T, 
  Vt(D);
}

function Rt(e) {
  return -1 === e.sign ? xt(e) : e;
}

function xt(e) {
  return Vt(negateDurationFields(e));
}

function negateDurationFields(e) {
  const n = {};
  for (const t of F) {
    n[t] = -1 * e[t] || 0;
  }
  return n;
}

function Jt(e) {
  return !e.sign;
}

function computeDurationSign(e, n = F) {
  let t = 0;
  for (const o of n) {
    const n = Math.sign(e[o]);
    if (n) {
      if (t && t !== n) {
        throw new RangeError(Rr);
      }
      t = n;
    }
  }
  return t;
}

function checkDurationUnits(e) {
  for (const n of Ei) {
    clampEntity(n, e[n], -Pa, Pa, 1);
  }
  return checkDurationTimeUnit(oe(durationFieldsToBigNano(e), _r)), e;
}

function checkDurationTimeUnit(e) {
  if (!Number.isSafeInteger(e)) {
    throw new RangeError(Zr);
  }
}

function durationFieldsToBigNano(e, n = 6) {
  return givenFieldsToBigNano(e, n, F);
}

function nanoToDurationDayTimeFields(e, n = 6) {
  const [t, o] = e, r = nanoToGivenFields(o, n, F);
  if (r[F[n]] += t * (Qr / Xr[n]), !Number.isFinite(r[F[n]])) {
    throw new RangeError(Cr);
  }
  return r;
}

function nanoToDurationTimeFields(e, n = 5) {
  return nanoToGivenFields(e, n, F);
}

function durationHasDateParts(e) {
  return Boolean(computeDurationSign(e, vi));
}

function getLargestDurationUnit(e) {
  let n = 9;
  for (;n > 0 && !e[F[n]]; n--) {}
  return n;
}

function createSplitTuple(e, n) {
  return [ e, n ];
}

function computePeriod(e) {
  const n = Math.floor(e / Ia) * Ia;
  return [ n, n + Ia ];
}

function pe(e) {
  const n = parseDateTimeLike(e = toStringViaPrimitive(e));
  if (!n) {
    throw new RangeError(failedParse(e));
  }
  let t;
  if (n.O) {
    t = 0;
  } else {
    if (!n.offset) {
      throw new RangeError(failedParse(e));
    }
    t = parseOffsetNano(n.offset);
  }
  return n.timeZone && parseOffsetNanoMaybe(n.timeZone, 1), _(isoToEpochNanoWithOffset(checkIsoDateTimeFields(n), t));
}

function Xt(e) {
  const n = parseDateTimeLike(m(e));
  if (!n) {
    throw new RangeError(failedParse(e));
  }
  if (n.timeZone) {
    return finalizeZonedDateTime(n, n.offset ? parseOffsetNano(n.offset) : void 0);
  }
  if (n.O) {
    throw new RangeError(failedParse(e));
  }
  return finalizeDate(n);
}

function Mn(e, n) {
  const t = parseDateTimeLike(m(e));
  if (!t || !t.timeZone) {
    throw new RangeError(failedParse(e));
  }
  const {offset: o} = t, r = o ? parseOffsetNano(o) : void 0, [, i, a] = wn(n);
  return finalizeZonedDateTime(t, r, i, a);
}

function parseOffsetNano(e) {
  const n = parseOffsetNanoMaybe(e);
  if (void 0 === n) {
    throw new RangeError(failedParse(e));
  }
  return n;
}

function Ct(e) {
  const n = parseDateTimeLike(m(e));
  if (!n || n.O) {
    throw new RangeError(failedParse(e));
  }
  return ee(finalizeDateTime(n));
}

function At(e) {
  const n = parseDateTimeLike(m(e));
  if (!n || n.O) {
    throw new RangeError(failedParse(e));
  }
  return v(n.I ? finalizeDateTime(n) : finalizeDate(n));
}

function ot(e, n) {
  const t = parseYearMonthOnly(m(n));
  if (t) {
    return requireIsoCalendar(t), createPlainYearMonthSlots(checkIsoYearMonthInBounds(checkIsoDateFields(t)));
  }
  const o = At(n);
  return createPlainYearMonthSlots(moveToDayOfMonthUnsafe(e(o.calendar), o));
}

function requireIsoCalendar(e) {
  if (e.calendar !== X) {
    throw new RangeError(invalidSubstring(e.calendar));
  }
}

function Q(e, n) {
  const t = parseMonthDayOnly(m(n));
  if (t) {
    return requireIsoCalendar(t), createPlainMonthDaySlots(checkIsoDateFields(t));
  }
  const o = At(n), {calendar: r} = o, i = e(r), [a, s, c] = i.v(o), [u, l] = i.$(a, s), [f, d] = i.k(u, l, c);
  return createPlainMonthDaySlots(checkIsoDateInBounds(i.L(f, d, c)), r);
}

function ze(e) {
  let n, t = (e => {
    const n = Za.exec(e);
    return n ? (organizeAnnotationParts(n[10]), organizeTimeParts(n)) : void 0;
  })(m(e));
  if (!t) {
    if (t = parseDateTimeLike(e), !t) {
      throw new RangeError(failedParse(e));
    }
    if (!t.I) {
      throw new RangeError(failedParse(e));
    }
    if (t.O) {
      throw new RangeError(invalidSubstring("Z"));
    }
    requireIsoCalendar(t);
  }
  if ((n = parseYearMonthOnly(e)) && isIsoDateFieldsValid(n)) {
    throw new RangeError(failedParse(e));
  }
  if ((n = parseMonthDayOnly(e)) && isIsoDateFieldsValid(n)) {
    throw new RangeError(failedParse(e));
  }
  return Ge(constrainIsoTimeFields(t, 1));
}

function Kt(e) {
  const n = (e => {
    const n = qa.exec(e);
    return n ? (e => {
      function parseUnit(e, r, i) {
        let a = 0, s = 0;
        if (i && ([a, o] = divModFloor(o, Xr[i])), void 0 !== e) {
          if (t) {
            throw new RangeError(invalidSubstring(e));
          }
          s = (e => {
            const n = parseInt(e);
            if (!Number.isFinite(n)) {
              throw new RangeError(invalidSubstring(e));
            }
            return n;
          })(e), n = 1, r && (o = parseSubsecNano(r) * (Xr[i] / _r), t = 1);
        }
        return a + s;
      }
      let n = 0, t = 0, o = 0, r = {
        ...zipProps(F, [ parseUnit(e[2]), parseUnit(e[3]), parseUnit(e[4]), parseUnit(e[5]), parseUnit(e[6], e[7], 5), parseUnit(e[8], e[9], 4), parseUnit(e[10], e[11], 3) ]),
        ...nanoToGivenFields(o, 2, F)
      };
      if (!n) {
        throw new RangeError(noValidFields(F));
      }
      return parseSign(e[1]) < 0 && (r = negateDurationFields(r)), r;
    })(n) : void 0;
  })(m(e));
  if (!n) {
    throw new RangeError(failedParse(e));
  }
  return Vt(checkDurationUnits(n));
}

function sn(e) {
  const n = parseDateTimeLike(e) || parseYearMonthOnly(e) || parseMonthDayOnly(e);
  return n ? n.calendar : e;
}

function Ne(e) {
  const n = parseDateTimeLike(e);
  return n && (n.timeZone || n.O && Da || n.offset) || e;
}

function finalizeZonedDateTime(e, n, t = 0, o = 0) {
  const r = ye(e.timeZone), i = ie(r);
  return Yn(getMatchingInstantFor(i, checkIsoDateTimeFields(e), n, t, o, !i.R, e.O), r, an(e.calendar));
}

function finalizeDateTime(e) {
  return resolveSlotsCalendar(checkIsoDateTimeInBounds(checkIsoDateTimeFields(e)));
}

function finalizeDate(e) {
  return resolveSlotsCalendar(checkIsoDateInBounds(checkIsoDateFields(e)));
}

function resolveSlotsCalendar(e) {
  return {
    ...e,
    calendar: an(e.calendar)
  };
}

function parseDateTimeLike(e) {
  const n = Ca.exec(e);
  return n ? (e => {
    const n = e[10], t = "Z" === (n || "").toUpperCase();
    return {
      isoYear: organizeIsoYearParts(e),
      isoMonth: parseInt(e[4]),
      isoDay: parseInt(e[5]),
      ...organizeTimeParts(e.slice(5)),
      ...organizeAnnotationParts(e[16]),
      I: Boolean(e[6]),
      O: t,
      offset: t ? void 0 : n
    };
  })(n) : void 0;
}

function parseYearMonthOnly(e) {
  const n = ka.exec(e);
  return n ? (e => ({
    isoYear: organizeIsoYearParts(e),
    isoMonth: parseInt(e[4]),
    isoDay: 1,
    ...organizeAnnotationParts(e[5])
  }))(n) : void 0;
}

function parseMonthDayOnly(e) {
  const n = Ya.exec(e);
  return n ? (e => ({
    isoYear: xi,
    isoMonth: parseInt(e[1]),
    isoDay: parseInt(e[2]),
    ...organizeAnnotationParts(e[3])
  }))(n) : void 0;
}

function parseOffsetNanoMaybe(e, n) {
  const t = Ra.exec(e);
  return t ? ((e, n) => {
    const t = e[4] || e[5];
    if (n && t) {
      throw new RangeError(invalidSubstring(t));
    }
    return ae((parseInt0(e[2]) * Kr + parseInt0(e[3]) * Jr + parseInt0(e[4]) * _r + parseSubsecNano(e[5] || "")) * parseSign(e[1]));
  })(t, n) : void 0;
}

function organizeIsoYearParts(e) {
  const n = parseSign(e[1]), t = parseInt(e[2] || e[3]);
  if (n < 0 && !t) {
    throw new RangeError(invalidSubstring(-0));
  }
  return n * t;
}

function organizeTimeParts(e) {
  const n = parseInt0(e[3]);
  return {
    ...nanoToIsoTimeAndDay(parseSubsecNano(e[4] || ""))[0],
    isoHour: parseInt0(e[1]),
    isoMinute: parseInt0(e[2]),
    isoSecond: 60 === n ? 59 : n
  };
}

function organizeAnnotationParts(e) {
  let n, t;
  const o = [];
  if (e.replace(za, ((e, r, i) => {
    const a = Boolean(r), [s, c] = i.split("=").reverse();
    if (c) {
      if ("u-ca" === c) {
        o.push(s), n || (n = a);
      } else if (a || /[A-Z]/.test(c)) {
        throw new RangeError(invalidSubstring(e));
      }
    } else {
      if (t) {
        throw new RangeError(invalidSubstring(e));
      }
      t = s;
    }
    return "";
  })), o.length > 1 && n) {
    throw new RangeError(invalidSubstring(e));
  }
  return {
    timeZone: t,
    calendar: o[0] || X
  };
}

function parseSubsecNano(e) {
  return parseInt(e.padEnd(9, "0"));
}

function createRegExp(e) {
  return new RegExp(`^${e}$`, "i");
}

function parseSign(e) {
  return e && "+" !== e ? -1 : 1;
}

function parseInt0(e) {
  return void 0 === e ? 0 : parseInt(e);
}

function Me(e) {
  return ye(m(e));
}

function ye(e) {
  const n = getTimeZoneEssence(e);
  return "number" == typeof n ? Fe(n) : n ? (e => {
    if (Ua.test(e)) {
      throw new RangeError(br);
    }
    return e.toLowerCase().split("/").map(((e, n) => (e.length <= 3 || /\d/.test(e)) && !/etc|yap/.test(e) ? e.toUpperCase() : e.replace(/baja|dumont|[a-z]+/g, ((e, t) => e.length <= 2 && !n || "in" === e || "chat" === e ? e.toUpperCase() : e.length > 2 || !t ? capitalize(e).replace(/island|noronha|murdo|rivadavia|urville/, capitalize) : e)))).join("/");
  })(e) : Da;
}

function getTimeZoneAtomic(e) {
  const n = getTimeZoneEssence(e);
  return "number" == typeof n ? n : n ? n.resolvedOptions().timeZone : Da;
}

function getTimeZoneEssence(e) {
  const n = parseOffsetNanoMaybe(e = e.toUpperCase(), 1);
  return void 0 !== n ? n : e !== Da ? Aa(e) : void 0;
}

function Ze(e, n) {
  return te(e.epochNanoseconds, n.epochNanoseconds);
}

function yn(e, n) {
  return te(e.epochNanoseconds, n.epochNanoseconds);
}

function $t(e, n, t, o, r, i) {
  const a = e(normalizeOptions(i).relativeTo), s = Math.max(getLargestDurationUnit(o), getLargestDurationUnit(r));
  if (allPropsEqual(F, o, r)) {
    return 0;
  }
  if (isUniformUnit(s, a)) {
    return te(durationFieldsToBigNano(o), durationFieldsToBigNano(r));
  }
  if (!a) {
    throw new RangeError(zr);
  }
  const [c, u, l] = createMarkerSystem(n, t, a), f = createMarkerToEpochNano(l), d = createMoveMarker(u, l);
  return te(f(d(c, o)), f(d(c, r)));
}

function gt(e, n) {
  return rt(e, n) || He(e, n);
}

function rt(e, n) {
  return compareNumbers(isoToEpochMilli(e), isoToEpochMilli(n));
}

function He(e, n) {
  return compareNumbers(isoTimeFieldsToNano(e), isoTimeFieldsToNano(n));
}

function ue(e, n) {
  return !Ze(e, n);
}

function gn(e, n) {
  return !yn(e, n) && !!je(e.timeZone, n.timeZone) && isIdLikeEqual(e.calendar, n.calendar);
}

function ft(e, n) {
  return !gt(e, n) && isIdLikeEqual(e.calendar, n.calendar);
}

function It(e, n) {
  return !rt(e, n) && isIdLikeEqual(e.calendar, n.calendar);
}

function $e(e, n) {
  return !rt(e, n) && isIdLikeEqual(e.calendar, n.calendar);
}

function x(e, n) {
  return !rt(e, n) && isIdLikeEqual(e.calendar, n.calendar);
}

function Ve(e, n) {
  return !He(e, n);
}

function je(e, n) {
  if (e === n) {
    return 1;
  }
  const t = I(e), o = I(n);
  if (t === o) {
    return 1;
  }
  try {
    return getTimeZoneAtomic(t) === getTimeZoneAtomic(o);
  } catch (e) {}
}

function le(e, n, t, o) {
  const r = refineDiffOptions(e, U(o), 3, 5), i = diffEpochNanos(n.epochNanoseconds, t.epochNanoseconds, ...r);
  return Vt(e ? negateDurationFields(i) : i);
}

function Dn(e, n, t, o, r, i) {
  const a = getCommonCalendarSlot(o.calendar, r.calendar), s = U(i), [c, u, l, f] = refineDiffOptions(t, s, 5), d = o.epochNanoseconds, m = r.epochNanoseconds, p = te(m, d);
  let h;
  if (p) {
    if (c < 6) {
      h = diffEpochNanos(d, m, c, u, l, f);
    } else {
      const t = n(((e, n) => {
        if (!je(e, n)) {
          throw new RangeError(Fr);
        }
        return e;
      })(o.timeZone, r.timeZone)), i = e(a);
      h = diffZonedEpochsBig(i, t, o, r, p, c, s), h = roundRelativeDuration(h, m, c, u, l, f, o, extractEpochNano, E(moveZonedEpochs, i, t));
    }
  } else {
    h = Fi;
  }
  return Vt(t ? negateDurationFields(h) : h);
}

function ut(e, n, t, o, r) {
  const i = getCommonCalendarSlot(t.calendar, o.calendar), a = U(r), [s, c, u, l] = refineDiffOptions(n, a, 6), f = isoToEpochNano(t), d = isoToEpochNano(o), m = te(d, f);
  let p;
  if (m) {
    if (s <= 6) {
      p = diffEpochNanos(f, d, s, c, u, l);
    } else {
      const n = e(i);
      p = diffDateTimesBig(n, t, o, m, s, a), p = roundRelativeDuration(p, d, s, c, u, l, t, isoToEpochNano, E(moveDateTime, n));
    }
  } else {
    p = Fi;
  }
  return Vt(n ? negateDurationFields(p) : p);
}

function Ft(e, n, t, o, r) {
  const i = getCommonCalendarSlot(t.calendar, o.calendar), a = U(r);
  return diffDateLike(n, (() => e(i)), t, o, ...refineDiffOptions(n, a, 6, 9, 6), a);
}

function Xe(e, n, t, o, r) {
  const i = getCommonCalendarSlot(t.calendar, o.calendar), a = U(r), s = refineDiffOptions(n, a, 9, 9, 8), c = e(i);
  return diffDateLike(n, (() => c), moveToDayOfMonthUnsafe(c, t), moveToDayOfMonthUnsafe(c, o), ...s, a);
}

function diffDateLike(e, n, t, o, r, i, a, s, c) {
  const u = isoToEpochNano(t), l = isoToEpochNano(o);
  let f;
  if (te(l, u)) {
    if (6 === r) {
      f = diffEpochNanos(u, l, r, i, a, s);
    } else {
      const e = n();
      f = e.dateUntil(t, o, r, c), 6 === i && 1 === a || (f = roundRelativeDuration(f, l, r, i, a, s, t, isoToEpochNano, E(moveDate, e)));
    }
  } else {
    f = Fi;
  }
  return Vt(e ? negateDurationFields(f) : f);
}

function Ae(e, n, t, o) {
  const r = U(o), [i, a, s, c] = refineDiffOptions(e, r, 5, 5), u = roundByInc(diffTimes(n, t), computeNanoInc(a, s), c), l = {
    ...Fi,
    ...nanoToDurationTimeFields(u, i)
  };
  return Vt(e ? negateDurationFields(l) : l);
}

function diffZonedEpochsExact(e, n, t, o, r, i) {
  const a = te(o.epochNanoseconds, t.epochNanoseconds);
  return a ? r < 6 ? diffEpochNanosExact(t.epochNanoseconds, o.epochNanoseconds, r) : diffZonedEpochsBig(e, n, t, o, a, r, i) : Fi;
}

function diffDateTimesExact(e, n, t, o, r) {
  const i = isoToEpochNano(n), a = isoToEpochNano(t), s = te(a, i);
  return s ? o <= 6 ? diffEpochNanosExact(i, a, o) : diffDateTimesBig(e, n, t, s, o, r) : Fi;
}

function diffZonedEpochsBig(e, n, t, o, r, i, a) {
  const [s, c, u] = ((e, n, t, o) => {
    function updateMid() {
      return l = {
        ...moveByDays(a, c++ * -o),
        ...i
      }, f = we(e, l), te(s, f) === -o;
    }
    const r = fn(n, e), i = Vn(j, r), a = fn(t, e), s = t.epochNanoseconds;
    let c = 0;
    const u = diffTimes(r, a);
    let l, f;
    if (Math.sign(u) === -o && c++, updateMid() && (-1 === o || updateMid())) {
      throw new RangeError(vr);
    }
    const d = oe(re(f, s));
    return [ r, l, d ];
  })(n, t, o, r);
  var l, f;
  return {
    ...6 === i ? (l = s, f = c, {
      ...Fi,
      days: diffDays(l, f)
    }) : e.dateUntil(s, c, i, a),
    ...nanoToDurationTimeFields(u)
  };
}

function diffDateTimesBig(e, n, t, o, r, i) {
  let a = n, s = diffTimes(n, t);
  return Math.sign(s) === -o && (a = moveByDays(n, o), s += Qr * o), {
    ...e.dateUntil(a, t, r, i),
    ...nanoToDurationTimeFields(s)
  };
}

function diffEpochNanos(e, n, t, o, r, i) {
  return {
    ...Fi,
    ...nanoToDurationDayTimeFields(roundBigNano(re(e, n), o, r, i), t)
  };
}

function diffEpochNanosExact(e, n, t) {
  return {
    ...Fi,
    ...nanoToDurationDayTimeFields(re(e, n), t)
  };
}

function diffDays(e, n) {
  return diffEpochMilliByDay(isoToEpochMilli(e), isoToEpochMilli(n));
}

function diffEpochMilliByDay(e, n) {
  return Math.trunc((n - e) / Gr);
}

function diffTimes(e, n) {
  return isoTimeFieldsToNano(n) - isoTimeFieldsToNano(e);
}

function getCommonCalendarSlot(e, n) {
  if (!isIdLikeEqual(e, n)) {
    throw new RangeError(Er);
  }
  return e;
}

function createIntlCalendar(e) {
  function epochMilliToIntlFields(e) {
    return ((e, n) => ({
      ...parseIntlYear(e, n),
      o: e.month,
      day: parseInt(e.day)
    }))(hashIntlFormatParts(n, e), t);
  }
  const n = Wa(e), t = computeCalendarIdBase(e);
  return {
    id: e,
    h: createIntlFieldCache(epochMilliToIntlFields),
    l: createIntlYearDataCache(epochMilliToIntlFields)
  };
}

function createIntlFieldCache(e) {
  return Jn((n => {
    const t = isoToEpochMilli(n);
    return e(t);
  }), WeakMap);
}

function createIntlYearDataCache(e) {
  const n = e(0).year - ji;
  return Jn((t => {
    let o, r = isoArgsToEpochMilli(t - n);
    const i = [], a = [];
    do {
      r += 400 * Gr;
    } while ((o = e(r)).year <= t);
    do {
      r += (1 - o.day) * Gr, o.year === t && (i.push(r), a.push(o.o)), r -= Gr;
    } while ((o = e(r)).year >= t);
    return {
      i: i.reverse(),
      u: Wr(a.reverse())
    };
  }));
}

function parseIntlYear(e, n) {
  let t, o, r = parseIntlPartsYear(e);
  if (e.era) {
    const a = Di[n];
    void 0 !== a && (i = (i = e.era).normalize("NFD").toLowerCase().replace(/[^a-z0-9]/g, ""), 
    t = Ii[i] || i, o = r, r = eraYearToYear(o, a[t] || 0));
  }
  var i;
  return {
    era: t,
    eraYear: o,
    year: r
  };
}

function parseIntlPartsYear(e) {
  return parseInt(e.relatedYear || e.year);
}

function computeIntlDateParts(e) {
  const {year: n, o: t, day: o} = this.h(e), {u: r} = this.l(n);
  return [ n, r[t] + 1, o ];
}

function computeIntlEpochMilli(e, n = 1, t = 1) {
  return this.l(e).i[n - 1] + (t - 1) * Gr;
}

function computeIntlLeapMonth(e) {
  const n = queryMonthStrings(this, e), t = queryMonthStrings(this, e - 1), o = n.length;
  if (o > t.length) {
    const e = getCalendarLeapMonthMeta(this);
    if (e < 0) {
      return -e;
    }
    for (let e = 0; e < o; e++) {
      if (n[e] !== t[e]) {
        return e + 1;
      }
    }
  }
}

function computeIntlDaysInYear(e) {
  return diffEpochMilliByDay(computeIntlEpochMilli.call(this, e), computeIntlEpochMilli.call(this, e + 1));
}

function computeIntlDaysInMonth(e, n) {
  const {i: t} = this.l(e);
  let o = n + 1, r = t;
  return o > t.length && (o = 1, r = this.l(e + 1).i), diffEpochMilliByDay(t[n - 1], r[o - 1]);
}

function computeIntlMonthsInYear(e) {
  return this.l(e).i.length;
}

function queryMonthStrings(e, n) {
  return Object.keys(e.l(n).u);
}

function rn(e) {
  return an(m(e));
}

function an(e) {
  if ((e = e.toLowerCase()) !== X && e !== gi && computeCalendarIdBase(e) !== computeCalendarIdBase(Wa(e).resolvedOptions().calendar)) {
    throw new RangeError(invalidCalendar(e));
  }
  return e;
}

function computeCalendarIdBase(e) {
  return "islamicc" === e && (e = "islamic"), e.split("-")[0];
}

function computeNativeWeekOfYear(e) {
  return this.m(e)[0];
}

function computeNativeYearOfWeek(e) {
  return this.m(e)[1];
}

function computeNativeDayOfYear(e) {
  const [n] = this.v(e);
  return diffEpochMilliByDay(this.p(n), isoToEpochMilli(e)) + 1;
}

function parseMonthCode(e) {
  const n = ja.exec(e);
  if (!n) {
    throw new RangeError(invalidMonthCode(e));
  }
  return [ parseInt(n[1]), Boolean(n[2]) ];
}

function monthCodeNumberToMonth(e, n, t) {
  return e + (n || t && e >= t ? 1 : 0);
}

function monthToMonthCodeNumber(e, n) {
  return e - (n && e >= n ? 1 : 0);
}

function eraYearToYear(e, n) {
  return (n + e) * (Math.sign(n) || 1) || 0;
}

function getCalendarEraOrigins(e) {
  return Di[getCalendarIdBase(e)];
}

function getCalendarLeapMonthMeta(e) {
  return Mi[getCalendarIdBase(e)];
}

function getCalendarIdBase(e) {
  return computeCalendarIdBase(e.id || X);
}

function Qt(e, n, t, o) {
  const r = refineCalendarFields(t, o, en, [], ri);
  if (void 0 !== r.timeZone) {
    const o = t.dateFromFields(r), i = refineTimeBag(r), a = e(r.timeZone);
    return {
      epochNanoseconds: getMatchingInstantFor(n(a), {
        ...o,
        ...i
      }, void 0 !== r.offset ? parseOffsetNano(r.offset) : void 0),
      timeZone: a
    };
  }
  return {
    ...t.dateFromFields(r),
    ...Dt
  };
}

function jn(e, n, t, o, r, i) {
  const a = refineCalendarFields(t, r, en, ti, ri), s = e(a.timeZone), [c, u, l] = wn(i), f = t.dateFromFields(a, overrideOverflowOptions(i, c)), d = refineTimeBag(a, c);
  return Yn(getMatchingInstantFor(n(s), {
    ...f,
    ...d
  }, void 0 !== a.offset ? parseOffsetNano(a.offset) : void 0, u, l), s, o);
}

function Pt(e, n, t) {
  const o = refineCalendarFields(e, n, en, [], w), r = H(t);
  return ee(checkIsoDateTimeInBounds({
    ...e.dateFromFields(o, overrideOverflowOptions(t, r)),
    ...refineTimeBag(o, r)
  }));
}

function Yt(e, n, t, o = []) {
  const r = refineCalendarFields(e, n, en, o);
  return e.dateFromFields(r, t);
}

function nt(e, n, t, o) {
  const r = refineCalendarFields(e, n, fi, o);
  return e.yearMonthFromFields(r, t);
}

function K(e, n, t, o, r = []) {
  const i = refineCalendarFields(e, t, en, r);
  return n && void 0 !== i.month && void 0 === i.monthCode && void 0 === i.year && (i.year = xi), 
  e.monthDayFromFields(i, o);
}

function Ue(e, n) {
  const t = H(n);
  return Ge(refineTimeBag(refineFields(e, ei, [], 1), t));
}

function Ht(e) {
  const n = refineFields(e, yi);
  return Vt(checkDurationUnits({
    ...Fi,
    ...n
  }));
}

function refineCalendarFields(e, n, t, o = [], r = []) {
  return refineFields(n, [ ...e.fields(t), ...r ].sort(), o);
}

function refineFields(e, n, t, o = !t) {
  const r = {};
  let i, a = 0;
  for (const o of n) {
    if (o === i) {
      throw new RangeError(duplicateFields(o));
    }
    if ("constructor" === o || "__proto__" === o) {
      throw new RangeError(tn(o));
    }
    let n = e[o];
    if (void 0 !== n) {
      a = 1, Ha[o] && (n = Ha[o](n, o)), r[o] = n;
    } else if (t) {
      if (t.includes(o)) {
        throw new TypeError(missingField(o));
      }
      r[o] = hi[o];
    }
    i = o;
  }
  if (o && !a) {
    throw new TypeError(noValidFields(n));
  }
  return r;
}

function refineTimeBag(e, n) {
  return constrainIsoTimeFields(Va({
    ...hi,
    ...e
  }), n);
}

function Sn(e, n, t, o, r, i) {
  const a = U(i), {calendar: s, timeZone: c} = t;
  return Yn(((e, n, t, o, r) => {
    const i = mergeCalendarFields(e, t, o, en, oi, ni), [a, s, c] = wn(r, 2);
    return getMatchingInstantFor(n, {
      ...e.dateFromFields(i, overrideOverflowOptions(r, a)),
      ...refineTimeBag(i, a)
    }, parseOffsetNano(i.offset), s, c);
  })(e(s), n(c), o, r, a), c, s);
}

function at(e, n, t, o, r) {
  const i = U(r);
  return ee(((e, n, t, o) => {
    const r = mergeCalendarFields(e, n, t, en, w), i = H(o);
    return checkIsoDateTimeInBounds({
      ...e.dateFromFields(r, overrideOverflowOptions(o, i)),
      ...refineTimeBag(r, i)
    });
  })(e(n.calendar), t, o, i));
}

function Zt(e, n, t, o, r) {
  const i = U(r);
  return ((e, n, t, o) => {
    const r = mergeCalendarFields(e, n, t, en);
    return e.dateFromFields(r, o);
  })(e(n.calendar), t, o, i);
}

function Ke(e, n, t, o, r) {
  const i = U(r);
  return createPlainYearMonthSlots(((e, n, t, o) => {
    const r = mergeCalendarFields(e, n, t, fi);
    return e.yearMonthFromFields(r, o);
  })(e(n.calendar), t, o, i));
}

function k(e, n, t, o, r) {
  const i = U(r);
  return ((e, n, t, o) => {
    const r = mergeCalendarFields(e, n, t, en);
    return e.monthDayFromFields(r, o);
  })(e(n.calendar), t, o, i);
}

function Be(e, n, t) {
  return Ge(((e, n, t) => {
    const o = H(t);
    return refineTimeBag({
      ...Vn(ei, e),
      ...refineFields(n, ei)
    }, o);
  })(e, n, t));
}

function kt(e, n) {
  return Vt((t = e, o = n, checkDurationUnits({
    ...t,
    ...refineFields(o, yi)
  })));
  var t, o;
}

function mergeCalendarFields(e, n, t, o, r = [], i = []) {
  const a = [ ...e.fields(o), ...r ].sort();
  let s = refineFields(n, a, i);
  const c = refineFields(t, a);
  return s = e.mergeFields(s, c), refineFields(s, a, []);
}

function convertToPlainMonthDay(e, n) {
  const t = refineCalendarFields(e, n, pi);
  return e.monthDayFromFields(t);
}

function convertToPlainYearMonth(e, n, t) {
  const o = refineCalendarFields(e, n, di);
  return e.yearMonthFromFields(o, t);
}

function convertToIso(e, n, t, o, r) {
  n = Vn(t = e.fields(t), n), o = refineFields(o, r = e.fields(r), []);
  let i = e.mergeFields(n, o);
  return i = refineFields(i, [ ...t, ...r ].sort(), []), e.dateFromFields(i);
}

function refineYear(e, n) {
  let {era: t, eraYear: o, year: r} = n;
  const i = getCalendarEraOrigins(e);
  if (void 0 !== t || void 0 !== o) {
    if (void 0 === t || void 0 === o) {
      throw new TypeError(Dr);
    }
    if (!i) {
      throw new RangeError(gr);
    }
    const e = i[t];
    if (void 0 === e) {
      throw new RangeError(invalidEra(t));
    }
    const n = eraYearToYear(o, e);
    if (void 0 !== r && r !== n) {
      throw new RangeError(Ir);
    }
    r = n;
  } else if (void 0 === r) {
    throw new TypeError(missingYear(i));
  }
  return r;
}

function refineMonth(e, n, t, o) {
  let {month: r, monthCode: i} = n;
  if (void 0 !== i) {
    const n = ((e, n, t, o) => {
      const r = e.P(t), [i, a] = parseMonthCode(n);
      let s = monthCodeNumberToMonth(i, a, r);
      if (a) {
        const n = getCalendarLeapMonthMeta(e);
        if (void 0 === n) {
          throw new RangeError(Pr);
        }
        if (n > 0) {
          if (s > n) {
            throw new RangeError(Pr);
          }
          if (void 0 === r) {
            if (1 === o) {
              throw new RangeError(Pr);
            }
            s--;
          }
        } else {
          if (s !== -n) {
            throw new RangeError(Pr);
          }
          if (void 0 === r && 1 === o) {
            throw new RangeError(Pr);
          }
        }
      }
      return s;
    })(e, i, t, o);
    if (void 0 !== r && r !== n) {
      throw new RangeError(Mr);
    }
    r = n, o = 1;
  } else if (void 0 === r) {
    throw new TypeError(Nr);
  }
  return clampEntity("month", r, 1, e.j(t), o);
}

function refineDay(e, n, t, o, r) {
  return clampProp(n, "day", 1, e.N(o, t), r);
}

function spliceFields(e, n, t, o) {
  let r = 0;
  const i = [];
  for (const e of t) {
    void 0 !== n[e] ? r = 1 : i.push(e);
  }
  if (Object.assign(e, n), r) {
    for (const n of o || i) {
      delete e[n];
    }
  }
}

function Se(e) {
  return _(checkEpochNanoInBounds(bigIntToBigNano(toBigInt(e))));
}

function vn(e, n, t, o, r = X) {
  return Yn(checkEpochNanoInBounds(bigIntToBigNano(toBigInt(t))), n(o), e(r));
}

function pt(e, n, t, o, r = 0, i = 0, a = 0, s = 0, c = 0, u = 0, l = X) {
  return ee(checkIsoDateTimeInBounds(checkIsoDateTimeFields(T(toInteger, zipProps(Bi, [ n, t, o, r, i, a, s, c, u ])))), e(l));
}

function Nt(e, n, t, o, r = X) {
  return v(checkIsoDateInBounds(checkIsoDateFields(T(toInteger, {
    isoYear: n,
    isoMonth: t,
    isoDay: o
  }))), e(r));
}

function tt(e, n, t, o = X, r = 1) {
  const i = toInteger(n), a = toInteger(t), s = e(o);
  return createPlainYearMonthSlots(checkIsoYearMonthInBounds(checkIsoDateFields({
    isoYear: i,
    isoMonth: a,
    isoDay: toInteger(r)
  })), s);
}

function G(e, n, t, o = X, r = xi) {
  const i = toInteger(n), a = toInteger(t), s = e(o);
  return createPlainMonthDaySlots(checkIsoDateInBounds(checkIsoDateFields({
    isoYear: toInteger(r),
    isoMonth: i,
    isoDay: a
  })), s);
}

function ke(e = 0, n = 0, t = 0, o = 0, r = 0, i = 0) {
  return Ge(constrainIsoTimeFields(T(toInteger, zipProps(j, [ e, n, t, o, r, i ])), 1));
}

function Lt(e = 0, n = 0, t = 0, o = 0, r = 0, i = 0, a = 0, s = 0, c = 0, u = 0) {
  return Vt(checkDurationUnits(T(toStrictInteger, zipProps(F, [ e, n, t, o, r, i, a, s, c, u ]))));
}

function fe(e, n, t = X) {
  return Yn(e.epochNanoseconds, n, t);
}

function Zn(e) {
  return _(e.epochNanoseconds);
}

function ht(e, n) {
  return ee(fn(n, e));
}

function Bt(e, n) {
  return v(fn(n, e));
}

function bn(e, n, t) {
  return convertToPlainYearMonth(e(n.calendar), t);
}

function Fn(e, n, t) {
  return convertToPlainMonthDay(e(n.calendar), t);
}

function Re(e, n) {
  return Ge(fn(n, e));
}

function mt(e, n, t, o) {
  const r = ((e, n, t, o) => {
    const r = ve(o);
    return we(e(n), t, r);
  })(e, t, n, o);
  return Yn(checkEpochNanoInBounds(r), t, n.calendar);
}

function St(e, n, t) {
  const o = e(n.calendar);
  return createPlainYearMonthSlots({
    ...n,
    ...convertToPlainYearMonth(o, t)
  });
}

function Ot(e, n, t) {
  return convertToPlainMonthDay(e(n.calendar), t);
}

function vt(e, n, t, o, r) {
  const i = e(r.timeZone), a = r.plainTime, s = void 0 !== a ? n(a) : Dt;
  return Yn(we(t(i), {
    ...o,
    ...s
  }), i, o.calendar);
}

function wt(e, n = Dt) {
  return ee(checkIsoDateTimeInBounds({
    ...e,
    ...n
  }));
}

function jt(e, n, t) {
  return convertToPlainYearMonth(e(n.calendar), t);
}

function Mt(e, n, t) {
  return convertToPlainMonthDay(e(n.calendar), t);
}

function _e(e, n, t, o) {
  return ((e, n, t) => convertToIso(e, n, di, de(t), li))(e(n.calendar), t, o);
}

function R(e, n, t, o) {
  return ((e, n, t) => convertToIso(e, n, pi, de(t), si))(e(n.calendar), t, o);
}

function Je(e, n, t, o, r) {
  const i = de(r), a = n(i.plainDate), s = e(i.timeZone);
  return Yn(we(t(s), {
    ...a,
    ...o
  }), s, a.calendar);
}

function Le(e, n) {
  return ee(checkIsoDateTimeInBounds({
    ...e,
    ...n
  }));
}

function De(e) {
  return _(checkEpochNanoInBounds(he(e, _r)));
}

function Pe(e) {
  return _(checkEpochNanoInBounds(he(e, be)));
}

function Ce(e) {
  return _(checkEpochNanoInBounds(bigIntToBigNano(toBigInt(e), Vr)));
}

function ge(e) {
  return _(checkEpochNanoInBounds(bigIntToBigNano(toBigInt(e))));
}

function pn(e, n, t = Dt) {
  const o = n.timeZone, r = e(o), i = {
    ...fn(n, r),
    ...t
  };
  return Yn(getMatchingInstantFor(r, i, i.offsetNanoseconds, 2), o, n.calendar);
}

function Tn(e, n, t) {
  const o = n.timeZone, r = e(o), i = {
    ...fn(n, r),
    ...t
  }, a = getPreferredCalendarSlot(n.calendar, t.calendar);
  return Yn(getMatchingInstantFor(r, i, i.offsetNanoseconds, 2), o, a);
}

function lt(e, n = Dt) {
  return ee({
    ...e,
    ...n
  });
}

function st(e, n) {
  return ee({
    ...e,
    ...n
  }, getPreferredCalendarSlot(e.calendar, n.calendar));
}

function it(e, n) {
  return {
    ...e,
    calendar: n
  };
}

function On(e, n) {
  return {
    ...e,
    timeZone: n
  };
}

function getPreferredCalendarSlot(e, n) {
  if (e === n) {
    return e;
  }
  const t = I(e), o = I(n);
  if (t === o || t === X) {
    return n;
  }
  if (o === X) {
    return e;
  }
  throw new RangeError(Er);
}

function createNativeOpsCreator(e, n) {
  return t => t === X ? e : t === gi || t === Ti ? Object.assign(Object.create(e), {
    id: t
  }) : Object.assign(Object.create(n), La(t));
}

function createOptionsTransformer(e, n, t) {
  const o = new Set(t);
  return r => (((e, n) => {
    for (const t of n) {
      if (t in e) {
        return 1;
      }
    }
    return 0;
  })(r = V(o, r), e) || Object.assign(r, n), t && (r.timeZone = Da, [ "full", "long" ].includes(r.timeStyle) && (r.timeStyle = "medium")), 
  r);
}

function e(e, n = qn) {
  const [t, , , o] = e;
  return (r, i = ys, ...a) => {
    const s = n(o && o(...a), r, i, t), c = s.resolvedOptions();
    return [ s, ...toEpochMillis(e, c, a) ];
  };
}

function qn(e, n, t, o) {
  if (t = o(t), e) {
    if (void 0 !== t.timeZone) {
      throw new TypeError(Lr);
    }
    t.timeZone = e;
  }
  return new En(n, t);
}

function toEpochMillis(e, n, t) {
  const [, o, r] = e;
  return t.map((e => (e.calendar && ((e, n, t) => {
    if ((t || e !== X) && e !== n) {
      throw new RangeError(Er);
    }
  })(I(e.calendar), n.calendar, r), o(e, n))));
}

function An(e) {
  const n = Bn();
  return Ie(n, e.getOffsetNanosecondsFor(n));
}

function Bn() {
  return he(Date.now(), be);
}

function Nn() {
  return Ps || (Ps = (new En).resolvedOptions().timeZone);
}

const expectedInteger = (e, n) => `Non-integer ${e}: ${n}`, expectedPositive = (e, n) => `Non-positive ${e}: ${n}`, expectedFinite = (e, n) => `Non-finite ${e}: ${n}`, forbiddenBigIntToNumber = e => `Cannot convert bigint to ${e}`, invalidBigInt = e => `Invalid bigint: ${e}`, pr = "Cannot convert Symbol to string", hr = "Invalid object", numberOutOfRange = (e, n, t, o, r) => r ? numberOutOfRange(e, r[n], r[t], r[o]) : invalidEntity(e, n) + `; must be between ${t}-${o}`, invalidEntity = (e, n) => `Invalid ${e}: ${n}`, missingField = e => `Missing ${e}`, tn = e => `Invalid field ${e}`, duplicateFields = e => `Duplicate field ${e}`, noValidFields = e => "No valid fields: " + e.join(), Z = "Invalid bag", invalidChoice = (e, n, t) => invalidEntity(e, n) + "; must be " + Object.keys(t).join(), A = "Cannot use valueOf", P = "Invalid calling context", gr = "Forbidden era/eraYear", Dr = "Mismatching era/eraYear", Ir = "Mismatching year/eraYear", invalidEra = e => `Invalid era: ${e}`, missingYear = e => "Missing year" + (e ? "/era/eraYear" : ""), invalidMonthCode = e => `Invalid monthCode: ${e}`, Mr = "Mismatching month/monthCode", Nr = "Missing month/monthCode", yr = "Cannot guess year", Pr = "Invalid leap month", g = "Invalid protocol", vr = "Invalid protocol results", Er = "Mismatching Calendars", invalidCalendar = e => `Invalid Calendar: ${e}`, Fr = "Mismatching TimeZones", br = "Forbidden ICU TimeZone", wr = "Out-of-bounds offset", Br = "Out-of-bounds TimeZone gap", kr = "Invalid TimeZone offset", Yr = "Ambiguous offset", Cr = "Out-of-bounds date", Zr = "Out-of-bounds duration", Rr = "Cannot mix duration signs", zr = "Missing relativeTo", qr = "Cannot use large units", Ar = "Required smallestUnit or largestUnit", Ur = "smallestUnit > largestUnit", failedParse = e => `Cannot parse: ${e}`, invalidSubstring = e => `Invalid substring: ${e}`, Ln = e => `Cannot format ${e}`, kn = "Mismatching types for formatting", Lr = "Cannot specify TimeZone", Wr = /*@__PURE__*/ E(b, ((e, n) => n)), jr = /*@__PURE__*/ E(b, ((e, n, t) => t)), xr = /*@__PURE__*/ E(padNumber, 2), $r = {
  nanosecond: 0,
  microsecond: 1,
  millisecond: 2,
  second: 3,
  minute: 4,
  hour: 5,
  day: 6,
  week: 7,
  month: 8,
  year: 9
}, Et = /*@__PURE__*/ Object.keys($r), Gr = 864e5, Hr = 1e3, Vr = 1e3, be = 1e6, _r = 1e9, Jr = 6e10, Kr = 36e11, Qr = 864e11, Xr = [ 1, Vr, be, _r, Jr, Kr, Qr ], w = /*@__PURE__*/ Et.slice(0, 6), ei = /*@__PURE__*/ sortStrings(w), ni = [ "offset" ], ti = [ "timeZone" ], oi = /*@__PURE__*/ w.concat(ni), ri = /*@__PURE__*/ oi.concat(ti), ii = [ "era", "eraYear" ], ai = /*@__PURE__*/ ii.concat([ "year" ]), si = [ "year" ], ci = [ "monthCode" ], ui = /*@__PURE__*/ [ "month" ].concat(ci), li = [ "day" ], fi = /*@__PURE__*/ ui.concat(si), di = /*@__PURE__*/ ci.concat(si), en = /*@__PURE__*/ li.concat(fi), mi = /*@__PURE__*/ li.concat(ui), pi = /*@__PURE__*/ li.concat(ci), hi = /*@__PURE__*/ jr(w, 0), X = "iso8601", gi = "gregory", Ti = "japanese", Di = {
  [gi]: {
    bce: -1,
    ce: 0
  },
  [Ti]: {
    bce: -1,
    ce: 0,
    meiji: 1867,
    taisho: 1911,
    showa: 1925,
    heisei: 1988,
    reiwa: 2018
  },
  ethioaa: {
    era0: 0
  },
  ethiopic: {
    era0: 0,
    era1: 5500
  },
  coptic: {
    era0: -1,
    era1: 0
  },
  roc: {
    beforeroc: -1,
    minguo: 0
  },
  buddhist: {
    be: 0
  },
  islamic: {
    ah: 0
  },
  indian: {
    saka: 0
  },
  persian: {
    ap: 0
  }
}, Ii = {
  bc: "bce",
  ad: "ce"
}, Mi = {
  chinese: 13,
  dangi: 13,
  hebrew: -6
}, m = /*@__PURE__*/ E(requireType, "string"), f = /*@__PURE__*/ E(requireType, "boolean"), Ni = /*@__PURE__*/ E(requireType, "number"), $ = /*@__PURE__*/ E(requireType, "function"), F = /*@__PURE__*/ Et.map((e => e + "s")), yi = /*@__PURE__*/ sortStrings(F), Pi = /*@__PURE__*/ F.slice(0, 6), vi = /*@__PURE__*/ F.slice(6), Ei = /*@__PURE__*/ vi.slice(1), Si = /*@__PURE__*/ Wr(F), Fi = /*@__PURE__*/ jr(F, 0), bi = /*@__PURE__*/ jr(Pi, 0), Oi = /*@__PURE__*/ E(zeroOutProps, F), j = [ "isoNanosecond", "isoMicrosecond", "isoMillisecond", "isoSecond", "isoMinute", "isoHour" ], wi = [ "isoDay", "isoMonth", "isoYear" ], Bi = /*@__PURE__*/ j.concat(wi), ki = /*@__PURE__*/ sortStrings(wi), Yi = /*@__PURE__*/ sortStrings(j), Ci = /*@__PURE__*/ sortStrings(Bi), Dt = /*@__PURE__*/ jr(Yi, 0), Zi = /*@__PURE__*/ E(zeroOutProps, Bi), En = Intl.DateTimeFormat, Ri = "en-GB", zi = 1e8, qi = zi * Gr, Ai = [ zi, 0 ], Ui = [ -zi, 0 ], Li = 275760, Wi = -271821, ji = 1970, xi = 1972, $i = 12, Gi = /*@__PURE__*/ isoArgsToEpochMilli(1868, 9, 8), Hi = /*@__PURE__*/ Jn(computeJapaneseEraParts, WeakMap), Vi = "smallestUnit", _i = "unit", Ji = "roundingIncrement", Ki = "fractionalSecondDigits", Qi = "relativeTo", Xi = {
  constrain: 0,
  reject: 1
}, ea = /*@__PURE__*/ Object.keys(Xi), na = {
  compatible: 0,
  reject: 1,
  earlier: 2,
  later: 3
}, ta = {
  reject: 0,
  use: 1,
  prefer: 2,
  ignore: 3
}, oa = {
  auto: 0,
  never: 1,
  critical: 2,
  always: 3
}, ra = {
  auto: 0,
  never: 1,
  critical: 2
}, ia = {
  auto: 0,
  never: 1
}, aa = {
  floor: 0,
  halfFloor: 1,
  ceil: 2,
  halfCeil: 3,
  trunc: 4,
  halfTrunc: 5,
  expand: 6,
  halfExpand: 7,
  halfEven: 8
}, sa = /*@__PURE__*/ E(refineUnitOption, Vi), ca = /*@__PURE__*/ E(refineUnitOption, "largestUnit"), ua = /*@__PURE__*/ E(refineUnitOption, _i), la = /*@__PURE__*/ E(refineChoiceOption, "overflow", Xi), fa = /*@__PURE__*/ E(refineChoiceOption, "disambiguation", na), da = /*@__PURE__*/ E(refineChoiceOption, "offset", ta), ma = /*@__PURE__*/ E(refineChoiceOption, "calendarName", oa), pa = /*@__PURE__*/ E(refineChoiceOption, "timeZoneName", ra), ha = /*@__PURE__*/ E(refineChoiceOption, "offset", ia), ga = /*@__PURE__*/ E(refineChoiceOption, "roundingMode", aa), L = "PlainYearMonth", q = "PlainMonthDay", J = "PlainDate", We = "PlainDateTime", xe = "PlainTime", Te = "ZonedDateTime", Oe = "Instant", qt = "Duration", Ta = [ Math.floor, e => hasHalf(e) ? Math.floor(e) : Math.round(e), Math.ceil, e => hasHalf(e) ? Math.ceil(e) : Math.round(e), Math.trunc, e => hasHalf(e) ? Math.trunc(e) || 0 : Math.round(e), e => e < 0 ? Math.floor(e) : Math.ceil(e), e => Math.sign(e) * Math.round(Math.abs(e)) || 0, e => hasHalf(e) ? (e = Math.trunc(e) || 0) + e % 2 : Math.round(e) ], Da = "UTC", Ia = 5184e3, Ma = /*@__PURE__*/ isoArgsToEpochSec(1847), Na = /*@__PURE__*/ isoArgsToEpochSec(/*@__PURE__*/ (/*@__PURE__*/ new Date).getUTCFullYear() + 10), ya = /0+$/, fn = /*@__PURE__*/ Jn(_zonedEpochSlotsToIso, WeakMap), Pa = 2 ** 32 - 1, ie = /*@__PURE__*/ Jn((e => {
  const n = getTimeZoneEssence(e);
  return "object" == typeof n ? new IntlTimeZone(n) : new FixedTimeZone(n || 0);
}));

class FixedTimeZone {
  constructor(e) {
    this.R = e;
  }
  getOffsetNanosecondsFor() {
    return this.R;
  }
  getPossibleInstantsFor(e) {
    return [ isoToEpochNanoWithOffset(e, this.R) ];
  }
  B() {}
}

class IntlTimeZone {
  constructor(e) {
    this.q = (e => {
      function getOffsetSec(e) {
        const i = clampNumber(e, o, r), [a, s] = computePeriod(i), c = n(a), u = n(s);
        return c === u ? c : pinch(t(a, s), c, u, e);
      }
      function pinch(n, t, o, r) {
        let i, a;
        for (;(void 0 === r || void 0 === (i = r < n[0] ? t : r >= n[1] ? o : void 0)) && (a = n[1] - n[0]); ) {
          const t = n[0] + Math.floor(a / 2);
          e(t) === o ? n[1] = t : n[0] = t + 1;
        }
        return i;
      }
      const n = Jn(e), t = Jn(createSplitTuple);
      let o = Ma, r = Na;
      return {
        J(e) {
          const n = getOffsetSec(e - 86400), t = getOffsetSec(e + 86400), o = e - n, r = e - t;
          if (n === t) {
            return [ o ];
          }
          const i = getOffsetSec(o);
          return i === getOffsetSec(r) ? [ e - i ] : n > t ? [ o, r ] : [];
        },
        _: getOffsetSec,
        B(e, i) {
          const a = clampNumber(e, o, r);
          let [s, c] = computePeriod(a);
          const u = Ia * i, l = i < 0 ? () => c > o || (o = a, 0) : () => s < r || (r = a, 
          0);
          for (;l(); ) {
            const o = n(s), r = n(c);
            if (o !== r) {
              const n = t(s, c);
              pinch(n, o, r);
              const a = n[0];
              if ((compareNumbers(a, e) || 1) === i) {
                return a;
              }
            }
            s += u, c += u;
          }
        }
      };
    })((e => n => {
      const t = hashIntlFormatParts(e, n * Hr);
      return isoArgsToEpochSec(parseIntlPartsYear(t), parseInt(t.month), parseInt(t.day), parseInt(t.hour), parseInt(t.minute), parseInt(t.second)) - n;
    })(e));
  }
  getOffsetNanosecondsFor(e) {
    return this.q._(epochNanoToSec(e)) * _r;
  }
  getPossibleInstantsFor(e) {
    const [n, t] = [ isoArgsToEpochSec((o = e).isoYear, o.isoMonth, o.isoDay, o.isoHour, o.isoMinute, o.isoSecond), o.isoMillisecond * be + o.isoMicrosecond * Vr + o.isoNanosecond ];
    var o;
    return this.q.J(n).map((e => checkEpochNanoInBounds(moveBigNano(he(e, _r), t))));
  }
  B(e, n) {
    const [t, o] = epochNanoToSecMod(e), r = this.q.B(t + (n > 0 || o ? 1 : 0), n);
    if (void 0 !== r) {
      return he(r, _r);
    }
  }
}

const va = "([+−-])", Ea = "(?:[.,](\\d{1,9}))?", Sa = `(?:(?:${va}(\\d{6}))|(\\d{4}))-?(\\d{2})`, Fa = "(\\d{2})(?::?(\\d{2})(?::?(\\d{2})" + Ea + ")?)?", ba = va + Fa, Oa = Sa + "-?(\\d{2})(?:[T ]" + Fa + "(Z|" + ba + ")?)?", wa = "\\[(!?)([^\\]]*)\\]", Ba = `((?:${wa}){0,9})`, ka = /*@__PURE__*/ createRegExp(Sa + Ba), Ya = /*@__PURE__*/ createRegExp("(?:--)?(\\d{2})-?(\\d{2})" + Ba), Ca = /*@__PURE__*/ createRegExp(Oa + Ba), Za = /*@__PURE__*/ createRegExp("T?" + Fa + "(?:" + ba + ")?" + Ba), Ra = /*@__PURE__*/ createRegExp(ba), za = /*@__PURE__*/ new RegExp(wa, "g"), qa = /*@__PURE__*/ createRegExp(`${va}?P(\\d+Y)?(\\d+M)?(\\d+W)?(\\d+D)?(?:T(?:(\\d+)${Ea}H)?(?:(\\d+)${Ea}M)?(?:(\\d+)${Ea}S)?)?`), Aa = /*@__PURE__*/ Jn((e => new En(Ri, {
  timeZone: e,
  era: "short",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric"
}))), Ua = /^(AC|AE|AG|AR|AS|BE|BS|CA|CN|CS|CT|EA|EC|IE|IS|JS|MI|NE|NS|PL|PN|PR|PS|SS|VS)T$/, La = /*@__PURE__*/ Jn(createIntlCalendar), Wa = /*@__PURE__*/ Jn((e => new En(Ri, {
  calendar: e,
  timeZone: Da,
  era: "short",
  year: "numeric",
  month: "short",
  day: "numeric"
}))), ja = /^M(\d{2})(L?)$/, xa = {
  era: toStringViaPrimitive,
  eraYear: toInteger,
  year: toInteger,
  month: toPositiveInteger,
  monthCode: toStringViaPrimitive,
  day: toPositiveInteger
}, $a = /*@__PURE__*/ jr(w, toInteger), Ga = /*@__PURE__*/ jr(F, toStrictInteger), Ha = /*@__PURE__*/ Object.assign({}, xa, $a, Ga, {
  offset: toStringViaPrimitive
}), Va = /*@__PURE__*/ E(remapProps, w, j), _a = {
  dateAdd(e, n, t) {
    const o = H(t);
    let r, {years: i, months: a, weeks: s, days: c} = n;
    if (c += durationFieldsToBigNano(n, 5)[0], i || a) {
      r = ((e, n, t, o, r) => {
        let [i, a, s] = e.v(n);
        if (t) {
          const [n, o] = e.$(i, a);
          i += t, a = monthCodeNumberToMonth(n, o, e.P(i)), a = clampEntity("month", a, 1, e.j(i), r);
        }
        return o && ([i, a] = e.G(i, a, o)), s = clampEntity("day", s, 1, e.N(i, a), r), 
        e.p(i, a, s);
      })(this, e, i, a, o);
    } else {
      if (!s && !c) {
        return e;
      }
      r = isoToEpochMilli(e);
    }
    return r += (7 * s + c) * Gr, checkIsoDateInBounds(epochMilliToIso(r));
  },
  dateUntil(e, n, t) {
    if (t <= 7) {
      let o = 0, r = diffDays({
        ...e,
        ...Dt
      }, {
        ...n,
        ...Dt
      });
      return 7 === t && ([o, r] = divModTrunc(r, 7)), {
        ...Fi,
        weeks: o,
        days: r
      };
    }
    const o = this.v(e), r = this.v(n);
    let [i, a, s] = ((e, n, t, o, r, i, a) => {
      let s = r - n, c = i - t, u = a - o;
      if (s || c) {
        const l = Math.sign(s || c);
        let f = e.N(r, i), d = 0;
        if (Math.sign(u) === -l) {
          const o = f;
          [r, i] = e.G(r, i, -l), s = r - n, c = i - t, f = e.N(r, i), d = l < 0 ? -o : f;
        }
        if (u = a - Math.min(o, f) + d, s) {
          const [o, a] = e.$(n, t), [u, f] = e.$(r, i);
          if (c = u - o || Number(f) - Number(a), Math.sign(c) === -l) {
            const t = l < 0 && -e.j(r);
            s = (r -= l) - n, c = i - monthCodeNumberToMonth(o, a, e.P(r)) + (t || e.j(r));
          }
        }
      }
      return [ s, c, u ];
    })(this, ...o, ...r);
    return 8 === t && (a += this.V(i, o[0]), i = 0), {
      ...Fi,
      years: i,
      months: a,
      days: s
    };
  },
  dateFromFields(e, n) {
    const t = H(n), o = refineYear(this, e), r = refineMonth(this, e, o, t), i = refineDay(this, e, r, o, t);
    return v(checkIsoDateInBounds(this.L(o, r, i)), this.id || X);
  },
  yearMonthFromFields(e, n) {
    const t = H(n), o = refineYear(this, e), r = refineMonth(this, e, o, t);
    return createPlainYearMonthSlots(checkIsoYearMonthInBounds(this.L(o, r, 1)), this.id || X);
  },
  monthDayFromFields(e, n) {
    const t = H(n), o = !this.id, {monthCode: r, year: i, month: a} = e;
    let s, c, u, l, f;
    if (void 0 !== r) {
      [s, c] = parseMonthCode(r), f = getDefinedProp(e, "day");
      const n = this.k(s, c, f);
      if (!n) {
        throw new RangeError(yr);
      }
      if ([u, l] = n, void 0 !== a && a !== l) {
        throw new RangeError(Mr);
      }
      o && (l = clampEntity("month", l, 1, $i, 1), f = clampEntity("day", f, 1, computeIsoDaysInMonth(void 0 !== i ? i : u, l), t));
    } else {
      u = void 0 === i && o ? xi : refineYear(this, e), l = refineMonth(this, e, u, t), 
      f = refineDay(this, e, l, u, t);
      const n = this.P(u);
      c = l === n, s = monthToMonthCodeNumber(l, n);
      const r = this.k(s, c, f);
      if (!r) {
        throw new RangeError(yr);
      }
      [u, l] = r;
    }
    return createPlainMonthDaySlots(checkIsoDateInBounds(this.L(u, l, f)), this.id || X);
  },
  fields(e) {
    return getCalendarEraOrigins(this) && e.includes("year") ? [ ...e, ...ii ] : e;
  },
  mergeFields(e, n) {
    const t = Object.assign(Object.create(null), e);
    return spliceFields(t, n, ui), getCalendarEraOrigins(this) && (spliceFields(t, n, ai), 
    this.id === Ti && spliceFields(t, n, mi, ii)), t;
  },
  inLeapYear(e) {
    const [n] = this.v(e);
    return this.K(n);
  },
  monthsInYear(e) {
    const [n] = this.v(e);
    return this.j(n);
  },
  daysInMonth(e) {
    const [n, t] = this.v(e);
    return this.N(n, t);
  },
  daysInYear(e) {
    const [n] = this.v(e);
    return this.X(n);
  },
  dayOfYear: computeNativeDayOfYear,
  era(e) {
    return this.nn(e)[0];
  },
  eraYear(e) {
    return this.nn(e)[1];
  },
  monthCode(e) {
    const [n, t] = this.v(e), [o, r] = this.$(n, t);
    return ((e, n) => "M" + xr(e) + (n ? "L" : ""))(o, r);
  },
  dayOfWeek: computeIsoDayOfWeek,
  daysInWeek() {
    return 7;
  }
}, Ja = {
  dayOfYear: computeNativeDayOfYear,
  v: computeIsoDateParts,
  p: isoArgsToEpochMilli
}, Ka = /*@__PURE__*/ Object.assign({}, Ja, {
  weekOfYear: computeNativeWeekOfYear,
  yearOfWeek: computeNativeYearOfWeek,
  m(e) {
    function computeWeekShift(e) {
      return (7 - e < n ? 7 : 0) - e;
    }
    function computeWeeksInYear(e) {
      const n = computeIsoDaysInYear(l + e), t = e || 1, o = computeWeekShift(modFloor(a + n * t, 7));
      return c = (n + (o - s) * t) / 7;
    }
    const n = this.id ? 1 : 4, t = computeIsoDayOfWeek(e), o = this.dayOfYear(e), r = modFloor(t - 1, 7), i = o - 1, a = modFloor(r - i, 7), s = computeWeekShift(a);
    let c, u = Math.floor((i - s) / 7) + 1, l = e.isoYear;
    return u ? u > computeWeeksInYear(0) && (u = 1, l++) : (u = computeWeeksInYear(-1), 
    l--), [ u, l, c ];
  }
}), Qa = {
  dayOfYear: computeNativeDayOfYear,
  v: computeIntlDateParts,
  p: computeIntlEpochMilli,
  weekOfYear: computeNativeWeekOfYear,
  yearOfWeek: computeNativeYearOfWeek,
  m() {
    return [];
  }
}, Y = /*@__PURE__*/ createNativeOpsCreator(/*@__PURE__*/ Object.assign({}, _a, Ka, {
  v: computeIsoDateParts,
  nn(e) {
    return this.id === gi ? computeGregoryEraParts(e) : this.id === Ti ? Hi(e) : [];
  },
  $: (e, n) => [ n, 0 ],
  k(e, n) {
    if (!n) {
      return [ xi, e ];
    }
  },
  K: computeIsoInLeapYear,
  P() {},
  j: computeIsoMonthsInYear,
  V: e => e * $i,
  N: computeIsoDaysInMonth,
  X: computeIsoDaysInYear,
  L: (e, n, t) => ({
    isoYear: e,
    isoMonth: n,
    isoDay: t
  }),
  p: isoArgsToEpochMilli,
  G: (e, n, t) => (e += divTrunc(t, $i), (n += modTrunc(t, $i)) < 1 ? (e--, n += $i) : n > $i && (e++, 
  n -= $i), [ e, n ]),
  year(e) {
    return e.isoYear;
  },
  month(e) {
    return e.isoMonth;
  },
  day: e => e.isoDay
}), /*@__PURE__*/ Object.assign({}, _a, Qa, {
  v: computeIntlDateParts,
  nn(e) {
    const n = this.h(e);
    return [ n.era, n.eraYear ];
  },
  $(e, n) {
    const t = computeIntlLeapMonth.call(this, e);
    return [ monthToMonthCodeNumber(n, t), t === n ];
  },
  k(e, n, t) {
    let [o, r, i] = computeIntlDateParts.call(this, {
      isoYear: xi,
      isoMonth: $i,
      isoDay: 31
    });
    const a = computeIntlLeapMonth.call(this, o), s = r === a;
    1 === (compareNumbers(e, monthToMonthCodeNumber(r, a)) || compareNumbers(Number(n), Number(s)) || compareNumbers(t, i)) && o--;
    for (let r = 0; r < 100; r++) {
      const i = o - r, a = computeIntlLeapMonth.call(this, i), s = monthCodeNumberToMonth(e, n, a);
      if (n === (s === a) && t <= computeIntlDaysInMonth.call(this, i, s)) {
        return [ i, s ];
      }
    }
  },
  K(e) {
    const n = computeIntlDaysInYear.call(this, e);
    return n > computeIntlDaysInYear.call(this, e - 1) && n > computeIntlDaysInYear.call(this, e + 1);
  },
  P: computeIntlLeapMonth,
  j: computeIntlMonthsInYear,
  V(e, n) {
    const t = n + e, o = Math.sign(e), r = o < 0 ? -1 : 0;
    let i = 0;
    for (let e = n; e !== t; e += o) {
      i += computeIntlMonthsInYear.call(this, e + r);
    }
    return i;
  },
  N: computeIntlDaysInMonth,
  X: computeIntlDaysInYear,
  L(e, n, t) {
    return epochMilliToIso(computeIntlEpochMilli.call(this, e, n, t));
  },
  p: computeIntlEpochMilli,
  G(e, n, t) {
    if (t) {
      if (n += t, !Number.isSafeInteger(n)) {
        throw new RangeError(Cr);
      }
      if (t < 0) {
        for (;n < 1; ) {
          n += computeIntlMonthsInYear.call(this, --e);
        }
      } else {
        let t;
        for (;n > (t = computeIntlMonthsInYear.call(this, e)); ) {
          n -= t, e++;
        }
      }
    }
    return [ e, n ];
  },
  year(e) {
    return this.h(e).year;
  },
  month(e) {
    const {year: n, o: t} = this.h(e), {u: o} = this.l(n);
    return o[t] + 1;
  },
  day(e) {
    return this.h(e).day;
  }
})), Xa = "numeric", es = [ "timeZoneName" ], ns = {
  month: Xa,
  day: Xa
}, ts = {
  year: Xa,
  month: Xa
}, os = /*@__PURE__*/ Object.assign({}, ts, {
  day: Xa
}), rs = {
  hour: Xa,
  minute: Xa,
  second: Xa
}, is = /*@__PURE__*/ Object.assign({}, os, rs), as = /*@__PURE__*/ Object.assign({}, is, {
  timeZoneName: "short"
}), ss = /*@__PURE__*/ Object.keys(ts), cs = /*@__PURE__*/ Object.keys(ns), us = /*@__PURE__*/ Object.keys(os), ls = /*@__PURE__*/ Object.keys(rs), fs = [ "dateStyle" ], ds = /*@__PURE__*/ ss.concat(fs), ms = /*@__PURE__*/ cs.concat(fs), ps = /*@__PURE__*/ us.concat(fs, [ "weekday" ]), hs = /*@__PURE__*/ ls.concat([ "dayPeriod", "timeStyle" ]), gs = /*@__PURE__*/ ps.concat(hs), Ts = /*@__PURE__*/ gs.concat(es), Ds = /*@__PURE__*/ es.concat(hs), Is = /*@__PURE__*/ es.concat(ps), Ms = /*@__PURE__*/ es.concat([ "day", "weekday" ], hs), Ns = /*@__PURE__*/ es.concat([ "year", "weekday" ], hs), ys = {}, t = [ /*@__PURE__*/ createOptionsTransformer(gs, is), y ], s = [ /*@__PURE__*/ createOptionsTransformer(Ts, as), y, 0, (e, n) => {
  const t = I(e.timeZone);
  if (n && I(n.timeZone) !== t) {
    throw new RangeError(Fr);
  }
  return t;
} ], n = [ /*@__PURE__*/ createOptionsTransformer(gs, is, es), isoToEpochMilli ], o = [ /*@__PURE__*/ createOptionsTransformer(ps, os, Ds), isoToEpochMilli ], r = [ /*@__PURE__*/ createOptionsTransformer(hs, rs, Is), e => isoTimeFieldsToNano(e) / be ], a = [ /*@__PURE__*/ createOptionsTransformer(ds, ts, Ms), isoToEpochMilli, 1 ], i = [ /*@__PURE__*/ createOptionsTransformer(ms, ns, Ns), isoToEpochMilli, 1 ];

let Ps;




/***/ }),

/***/ "./node_modules/throttle-debounce/esm/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/throttle-debounce/esm/index.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   debounce: function() { return /* binding */ debounce; },
/* harmony export */   throttle: function() { return /* binding */ throttle; }
/* harmony export */ });
/* eslint-disable no-undefined,no-param-reassign,no-shadow */

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param {number} delay -                  A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher)
 *                                            are most useful.
 * @param {Function} callback -               A function to be executed after delay milliseconds. The `this` context and all arguments are passed through,
 *                                            as-is, to `callback` when the throttled-function is executed.
 * @param {object} [options] -              An object to configure options.
 * @param {boolean} [options.noTrailing] -   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds
 *                                            while the throttled-function is being called. If noTrailing is false or unspecified, callback will be executed
 *                                            one final time after the last throttled-function call. (After the throttled-function has not been called for
 *                                            `delay` milliseconds, the internal counter is reset).
 * @param {boolean} [options.noLeading] -   Optional, defaults to false. If noLeading is false, the first throttled-function call will execute callback
 *                                            immediately. If noLeading is true, the first the callback execution will be skipped. It should be noted that
 *                                            callback will never executed if both noLeading = true and noTrailing = true.
 * @param {boolean} [options.debounceMode] - If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is
 *                                            false (at end), schedule `callback` to execute after `delay` ms.
 *
 * @returns {Function} A new, throttled, function.
 */
function throttle (delay, callback, options) {
  var _ref = options || {},
      _ref$noTrailing = _ref.noTrailing,
      noTrailing = _ref$noTrailing === void 0 ? false : _ref$noTrailing,
      _ref$noLeading = _ref.noLeading,
      noLeading = _ref$noLeading === void 0 ? false : _ref$noLeading,
      _ref$debounceMode = _ref.debounceMode,
      debounceMode = _ref$debounceMode === void 0 ? undefined : _ref$debounceMode;
  /*
   * After wrapper has stopped being called, this timeout ensures that
   * `callback` is executed at the proper times in `throttle` and `end`
   * debounce modes.
   */


  var timeoutID;
  var cancelled = false; // Keep track of the last time `callback` was executed.

  var lastExec = 0; // Function to clear existing timeout

  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  } // Function to cancel next exec


  function cancel(options) {
    var _ref2 = options || {},
        _ref2$upcomingOnly = _ref2.upcomingOnly,
        upcomingOnly = _ref2$upcomingOnly === void 0 ? false : _ref2$upcomingOnly;

    clearExistingTimeout();
    cancelled = !upcomingOnly;
  }
  /*
   * The `wrapper` function encapsulates all of the throttling / debouncing
   * functionality and when executed will limit the rate at which `callback`
   * is executed.
   */


  function wrapper() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
      arguments_[_key] = arguments[_key];
    }

    var self = this;
    var elapsed = Date.now() - lastExec;

    if (cancelled) {
      return;
    } // Execute `callback` and update the `lastExec` timestamp.


    function exec() {
      lastExec = Date.now();
      callback.apply(self, arguments_);
    }
    /*
     * If `debounceMode` is true (at begin) this is used to clear the flag
     * to allow future `callback` executions.
     */


    function clear() {
      timeoutID = undefined;
    }

    if (!noLeading && debounceMode && !timeoutID) {
      /*
       * Since `wrapper` is being called for the first time and
       * `debounceMode` is true (at begin), execute `callback`
       * and noLeading != true.
       */
      exec();
    }

    clearExistingTimeout();

    if (debounceMode === undefined && elapsed > delay) {
      if (noLeading) {
        /*
         * In throttle mode with noLeading, if `delay` time has
         * been exceeded, update `lastExec` and schedule `callback`
         * to execute after `delay` ms.
         */
        lastExec = Date.now();

        if (!noTrailing) {
          timeoutID = setTimeout(debounceMode ? clear : exec, delay);
        }
      } else {
        /*
         * In throttle mode without noLeading, if `delay` time has been exceeded, execute
         * `callback`.
         */
        exec();
      }
    } else if (noTrailing !== true) {
      /*
       * In trailing throttle mode, since `delay` time has not been
       * exceeded, schedule `callback` to execute `delay` ms after most
       * recent execution.
       *
       * If `debounceMode` is true (at begin), schedule `clear` to execute
       * after `delay` ms.
       *
       * If `debounceMode` is false (at end), schedule `callback` to
       * execute after `delay` ms.
       */
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
    }
  }

  wrapper.cancel = cancel; // Return the wrapper function.

  return wrapper;
}

/* eslint-disable no-undefined */
/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param {number} delay -               A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param {Function} callback -          A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                        to `callback` when the debounced-function is executed.
 * @param {object} [options] -           An object to configure options.
 * @param {boolean} [options.atBegin] -  Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
 *                                        after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
 *                                        (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
 *
 * @returns {Function} A new, debounced function.
 */

function debounce (delay, callback, options) {
  var _ref = options || {},
      _ref$atBegin = _ref.atBegin,
      atBegin = _ref$atBegin === void 0 ? false : _ref$atBegin;

  return throttle(delay, callback, {
    debounceMode: atBegin !== false
  });
}


//# sourceMappingURL=index.js.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!*******************************************!*\
  !*** ./web_src/js/webcomponents/index.js ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _polyfills_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polyfills.js */ "./web_src/js/webcomponents/polyfills.js");
/* harmony import */ var _github_relative_time_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @github/relative-time-element */ "./node_modules/@github/relative-time-element/dist/index.js");
/* harmony import */ var _origin_url_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./origin-url.js */ "./web_src/js/webcomponents/origin-url.js");
/* harmony import */ var _overflow_menu_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./overflow-menu.js */ "./web_src/js/webcomponents/overflow-menu.js");
/* harmony import */ var _absolute_date_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./absolute-date.js */ "./web_src/js/webcomponents/absolute-date.js");






}();
/******/ })()
;
//# sourceMappingURL=webcomponents.js.9b1bfe55.map