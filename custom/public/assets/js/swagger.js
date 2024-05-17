/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/swagger-ui-dist/swagger-ui.css":
/*!*****************************************************!*\
  !*** ./node_modules/swagger-ui-dist/swagger-ui.css ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/swagger-ui-dist/swagger-ui-es-bundle.js":
/*!**************************************************************!*\
  !*** ./node_modules/swagger-ui-dist/swagger-ui-es-bundle.js ***!
  \**************************************************************/
/***/ (function(module) {

/*! For license information please see swagger-ui-es-bundle.js.LICENSE.txt */
//# sourceMappingURL=swagger-ui-es-bundle.js.map

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
var __webpack_exports__ = {};
/*!******************************************!*\
  !*** ./web_src/js/standalone/swagger.js ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var swagger_ui_dist_swagger_ui_es_bundle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! swagger-ui-dist/swagger-ui-es-bundle.js */ "./node_modules/swagger-ui-dist/swagger-ui-es-bundle.js");
/* harmony import */ var swagger_ui_dist_swagger_ui_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! swagger-ui-dist/swagger-ui.css */ "./node_modules/swagger-ui-dist/swagger-ui.css");


window.addEventListener("load", async () => {
  const url = document.getElementById("swagger-ui").getAttribute("data-source");
  const res = await fetch(url);
  const spec = await res.json();
  const proto = window.location.protocol.slice(0, -1);
  spec.schemes.sort((a, b) => {
    if (a === proto)
      return -1;
    if (b === proto)
      return 1;
    return 0;
  });
  const ui = swagger_ui_dist_swagger_ui_es_bundle_js__WEBPACK_IMPORTED_MODULE_0__({
    spec,
    dom_id: "#swagger-ui",
    deepLinking: true,
    docExpansion: "none",
    defaultModelRendering: "model",
    // don't show examples by default, because they may be incomplete
    presets: [
      swagger_ui_dist_swagger_ui_es_bundle_js__WEBPACK_IMPORTED_MODULE_0__.presets.apis
    ],
    plugins: [
      swagger_ui_dist_swagger_ui_es_bundle_js__WEBPACK_IMPORTED_MODULE_0__.plugins.DownloadUrl
    ]
  });
  window.ui = ui;
});

}();
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!********************************************!*\
  !*** ./web_src/css/standalone/swagger.css ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

}();
/******/ })()
;
//# sourceMappingURL=swagger.js.b2f20e1d.map