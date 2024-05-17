"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["-"],{

/***/ "./node_modules/monaco-editor/esm/vs/basic-languages/typescript/typescript.js":
/*!************************************************************************************!*\
  !*** ./node_modules/monaco-editor/esm/vs/basic-languages/typescript/typescript.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   conf: function() { return /* binding */ conf; },
/* harmony export */   language: function() { return /* binding */ language; }
/* harmony export */ });
/* harmony import */ var _editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../editor/editor.api.js */ "include-loader!./node_modules/monaco-editor/esm/vs/editor/editor.api.js");
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.48.0(0037b13fb5d186fdf1e7df51a9416a2de2b8c670)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));

// src/fillers/monaco-editor-core.ts
var monaco_editor_core_exports = {};
__reExport(monaco_editor_core_exports, _editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__);


// src/basic-languages/typescript/typescript.ts
var conf = {
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  onEnterRules: [
    {
      // e.g. /** | */
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      afterText: /^\s*\*\/$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent,
        appendText: " * "
      }
    },
    {
      // e.g. /** ...|
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.None,
        appendText: " * "
      }
    },
    {
      // e.g.  * ...|
      beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.None,
        appendText: "* "
      }
    },
    {
      // e.g.  */|
      beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.None,
        removeText: 1
      }
    }
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: "`", close: "`", notIn: ["string", "comment"] },
    { open: "/**", close: " */", notIn: ["string"] }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*//\\s*#?region\\b"),
      end: new RegExp("^\\s*//\\s*#?endregion\\b")
    }
  }
};
var language = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: "invalid",
  tokenPostfix: ".ts",
  keywords: [
    // Should match the keys of textToKeywordObj in
    // https://github.com/microsoft/TypeScript/blob/master/src/compiler/scanner.ts
    "abstract",
    "any",
    "as",
    "asserts",
    "bigint",
    "boolean",
    "break",
    "case",
    "catch",
    "class",
    "continue",
    "const",
    "constructor",
    "debugger",
    "declare",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "from",
    "function",
    "get",
    "if",
    "implements",
    "import",
    "in",
    "infer",
    "instanceof",
    "interface",
    "is",
    "keyof",
    "let",
    "module",
    "namespace",
    "never",
    "new",
    "null",
    "number",
    "object",
    "out",
    "package",
    "private",
    "protected",
    "public",
    "override",
    "readonly",
    "require",
    "global",
    "return",
    "satisfies",
    "set",
    "static",
    "string",
    "super",
    "switch",
    "symbol",
    "this",
    "throw",
    "true",
    "try",
    "type",
    "typeof",
    "undefined",
    "unique",
    "unknown",
    "var",
    "void",
    "while",
    "with",
    "yield",
    "async",
    "await",
    "of"
  ],
  operators: [
    "<=",
    ">=",
    "==",
    "!=",
    "===",
    "!==",
    "=>",
    "+",
    "-",
    "**",
    "*",
    "/",
    "%",
    "++",
    "--",
    "<<",
    "</",
    ">>",
    ">>>",
    "&",
    "|",
    "^",
    "!",
    "~",
    "&&",
    "||",
    "??",
    "?",
    ":",
    "=",
    "+=",
    "-=",
    "*=",
    "**=",
    "/=",
    "%=",
    "<<=",
    ">>=",
    ">>>=",
    "&=",
    "|=",
    "^=",
    "@"
  ],
  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,
  // The main tokenizer for our languages
  tokenizer: {
    root: [[/[{}]/, "delimiter.bracket"], { include: "common" }],
    common: [
      // identifiers and keywords
      [
        /#?[a-z_$][\w$]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier"
          }
        }
      ],
      [/[A-Z][\w\$]*/, "type.identifier"],
      // to show class names nicely
      // [/[A-Z][\w\$]*/, 'identifier'],
      // whitespace
      { include: "@whitespace" },
      // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
      [
        /\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
        { token: "regexp", bracket: "@open", next: "@regexp" }
      ],
      // delimiters and operators
      [/[()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [/!(?=([^=]|$))/, "delimiter"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "delimiter",
            "@default": ""
          }
        }
      ],
      // numbers
      [/(@digits)[eE]([\-+]?(@digits))?/, "number.float"],
      [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, "number.float"],
      [/0[xX](@hexdigits)n?/, "number.hex"],
      [/0[oO]?(@octaldigits)n?/, "number.octal"],
      [/0[bB](@binarydigits)n?/, "number.binary"],
      [/(@digits)n?/, "number"],
      // delimiter: after number because of .\d floats
      [/[;,.]/, "delimiter"],
      // strings
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      // non-teminated string
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      // non-teminated string
      [/"/, "string", "@string_double"],
      [/'/, "string", "@string_single"],
      [/`/, "string", "@string_backtick"]
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*\*(?!\/)/, "comment.doc", "@jsdoc"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    jsdoc: [
      [/[^\/*]+/, "comment.doc"],
      [/\*\//, "comment.doc", "@pop"],
      [/[\/*]/, "comment.doc"]
    ],
    // We match regular expression quite precisely
    regexp: [
      [
        /(\{)(\d+(?:,\d*)?)(\})/,
        ["regexp.escape.control", "regexp.escape.control", "regexp.escape.control"]
      ],
      [
        /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
        ["regexp.escape.control", { token: "regexp.escape.control", next: "@regexrange" }]
      ],
      [/(\()(\?:|\?=|\?!)/, ["regexp.escape.control", "regexp.escape.control"]],
      [/[()]/, "regexp.escape.control"],
      [/@regexpctl/, "regexp.escape.control"],
      [/[^\\\/]/, "regexp"],
      [/@regexpesc/, "regexp.escape"],
      [/\\\./, "regexp.invalid"],
      [/(\/)([dgimsuy]*)/, [{ token: "regexp", bracket: "@close", next: "@pop" }, "keyword.other"]]
    ],
    regexrange: [
      [/-/, "regexp.escape.control"],
      [/\^/, "regexp.invalid"],
      [/@regexpesc/, "regexp.escape"],
      [/[^\]]/, "regexp"],
      [
        /\]/,
        {
          token: "regexp.escape.control",
          next: "@pop",
          bracket: "@close"
        }
      ]
    ],
    string_double: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"]
    ],
    string_single: [
      [/[^\\']+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/'/, "string", "@pop"]
    ],
    string_backtick: [
      [/\$\{/, { token: "delimiter.bracket", next: "@bracketCounting" }],
      [/[^\\`$]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/`/, "string", "@pop"]
    ],
    bracketCounting: [
      [/\{/, "delimiter.bracket", "@bracketCounting"],
      [/\}/, "delimiter.bracket", "@pop"],
      { include: "common" }
    ]
  }
};



/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre-js/label/add-html-label.js":
/*!***********************************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre-js/label/add-html-label.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addHtmlLabel: function() { return /* binding */ addHtmlLabel; }
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util.js */ "./node_modules/dagre-d3-es/src/dagre-js/util.js");




function addHtmlLabel(root, node) {
  var fo = root.append('foreignObject').attr('width', '100000');

  var div = fo.append('xhtml:div');
  div.attr('xmlns', 'http://www.w3.org/1999/xhtml');

  var label = node.label;
  switch (typeof label) {
    case 'function':
      div.insert(label);
      break;
    case 'object':
      // Currently we assume this is a DOM object.
      div.insert(function () {
        return label;
      });
      break;
    default:
      div.html(label);
  }

  _util_js__WEBPACK_IMPORTED_MODULE_0__.applyStyle(div, node.labelStyle);
  div.style('display', 'inline-block');
  // Fix for firefox
  div.style('white-space', 'nowrap');

  var client = div.node().getBoundingClientRect();
  fo.attr('width', client.width).attr('height', client.height);

  return fo;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/dagre-js/util.js":
/*!*******************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/dagre-js/util.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyClass: function() { return /* binding */ applyClass; },
/* harmony export */   applyStyle: function() { return /* binding */ applyStyle; },
/* harmony export */   applyTransition: function() { return /* binding */ applyTransition; },
/* harmony export */   edgeToId: function() { return /* binding */ edgeToId; },
/* harmony export */   isSubgraph: function() { return /* binding */ isSubgraph; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/isPlainObject.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/isFunction.js");


// Public utility functions


/*
 * Returns true if the specified node in the graph is a subgraph node. A
 * subgraph node is one that contains other nodes.
 */
function isSubgraph(g, v) {
  return !!g.children(v).length;
}

function edgeToId(e) {
  return escapeId(e.v) + ':' + escapeId(e.w) + ':' + escapeId(e.name);
}

var ID_DELIM = /:/g;
function escapeId(str) {
  return str ? String(str).replace(ID_DELIM, '\\:') : '';
}

function applyStyle(dom, styleFn) {
  if (styleFn) {
    dom.attr('style', styleFn);
  }
}

function applyClass(dom, classFn, otherClasses) {
  if (classFn) {
    dom.attr('class', classFn).attr('class', otherClasses + ' ' + dom.attr('class'));
  }
}

function applyTransition(selection, g) {
  var graph = g.graph();

  if (lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"](graph)) {
    var transition = graph.transition;
    if (lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](transition)) {
      return transition(selection);
    }
  }

  return selection;
}


/***/ }),

/***/ "./node_modules/dagre-d3-es/src/graphlib/json.js":
/*!*******************************************************!*\
  !*** ./node_modules/dagre-d3-es/src/graphlib/json.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   read: function() { return /* binding */ read; },
/* harmony export */   write: function() { return /* binding */ write; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/isUndefined.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/clone.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/map.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/forEach.js");
/* harmony import */ var _graph_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./graph.js */ "./node_modules/dagre-d3-es/src/graphlib/graph.js");





function write(g) {
  var json = {
    options: {
      directed: g.isDirected(),
      multigraph: g.isMultigraph(),
      compound: g.isCompound(),
    },
    nodes: writeNodes(g),
    edges: writeEdges(g),
  };
  if (!lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](g.graph())) {
    json.value = lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](g.graph());
  }
  return json;
}

function writeNodes(g) {
  return lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](g.nodes(), function (v) {
    var nodeValue = g.node(v);
    var parent = g.parent(v);
    var node = { v: v };
    if (!lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](nodeValue)) {
      node.value = nodeValue;
    }
    if (!lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](parent)) {
      node.parent = parent;
    }
    return node;
  });
}

function writeEdges(g) {
  return lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"](g.edges(), function (e) {
    var edgeValue = g.edge(e);
    var edge = { v: e.v, w: e.w };
    if (!lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](e.name)) {
      edge.name = e.name;
    }
    if (!lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](edgeValue)) {
      edge.value = edgeValue;
    }
    return edge;
  });
}

function read(json) {
  var g = new _graph_js__WEBPACK_IMPORTED_MODULE_0__.Graph(json.options).setGraph(json.value);
  lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](json.nodes, function (entry) {
    g.setNode(entry.v, entry.value);
    if (entry.parent) {
      g.setParent(entry.v, entry.parent);
    }
  });
  lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](json.edges, function (entry) {
    g.setEdge({ v: entry.v, w: entry.w, name: entry.name }, entry.value);
  });
  return g;
}


/***/ }),

/***/ "./node_modules/khroma/dist/methods/channel.js":
/*!*****************************************************!*\
  !*** ./node_modules/khroma/dist/methods/channel.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/index.js */ "./node_modules/khroma/dist/utils/index.js");
/* harmony import */ var _color_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../color/index.js */ "./node_modules/khroma/dist/color/index.js");
/* IMPORT */


/* MAIN */
const channel = (color, channel) => {
    return _utils_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].lang.round(_color_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].parse(color)[channel]);
};
/* EXPORT */
/* harmony default export */ __webpack_exports__["default"] = (channel);


/***/ }),

/***/ "./node_modules/lodash-es/clone.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/clone.js ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseClone_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseClone.js */ "./node_modules/lodash-es/_baseClone.js");


/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return (0,_baseClone_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value, CLONE_SYMBOLS_FLAG);
}

/* harmony default export */ __webpack_exports__["default"] = (clone);


/***/ }),

/***/ "./node_modules/mermaid/dist/edges-d32062c0.js":
/*!*****************************************************!*\
  !*** ./node_modules/mermaid/dist/edges-d32062c0.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: function() { return /* binding */ insertMarkers$1; },
/* harmony export */   b: function() { return /* binding */ clear$1; },
/* harmony export */   c: function() { return /* binding */ createLabel$1; },
/* harmony export */   d: function() { return /* binding */ clear; },
/* harmony export */   e: function() { return /* binding */ insertNode; },
/* harmony export */   f: function() { return /* binding */ insertEdgeLabel; },
/* harmony export */   g: function() { return /* binding */ getSubGraphTitleMargins; },
/* harmony export */   h: function() { return /* binding */ insertEdge; },
/* harmony export */   i: function() { return /* binding */ intersectRect$1; },
/* harmony export */   j: function() { return /* binding */ positionEdgeLabel; },
/* harmony export */   k: function() { return /* binding */ getLineFunctionsWithOffset; },
/* harmony export */   l: function() { return /* binding */ labelHelper; },
/* harmony export */   m: function() { return /* binding */ addEdgeMarkers; },
/* harmony export */   p: function() { return /* binding */ positionNode; },
/* harmony export */   s: function() { return /* binding */ setNodeElem; },
/* harmony export */   u: function() { return /* binding */ updateNodeBounds; }
/* harmony export */ });
/* harmony import */ var _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mermaid-f47111a7.js */ "./node_modules/mermaid/dist/mermaid-f47111a7.js");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "./node_modules/d3/src/index.js");
/* harmony import */ var _createText_6b48ae7d_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createText-6b48ae7d.js */ "./node_modules/mermaid/dist/createText-6b48ae7d.js");



const insertMarkers = (elem, markerArray, type, id) => {
  markerArray.forEach((markerName) => {
    markers[markerName](elem, type, id);
  });
};
const extension = (elem, type, id) => {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.trace("Making markers for ", id);
  elem.append("defs").append("marker").attr("id", id + "_" + type + "-extensionStart").attr("class", "marker extension " + type).attr("refX", 18).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 1,7 L18,13 V 1 Z");
  elem.append("defs").append("marker").attr("id", id + "_" + type + "-extensionEnd").attr("class", "marker extension " + type).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 1,1 V 13 L18,7 Z");
};
const composition = (elem, type, id) => {
  elem.append("defs").append("marker").attr("id", id + "_" + type + "-compositionStart").attr("class", "marker composition " + type).attr("refX", 18).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
  elem.append("defs").append("marker").attr("id", id + "_" + type + "-compositionEnd").attr("class", "marker composition " + type).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
};
const aggregation = (elem, type, id) => {
  elem.append("defs").append("marker").attr("id", id + "_" + type + "-aggregationStart").attr("class", "marker aggregation " + type).attr("refX", 18).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
  elem.append("defs").append("marker").attr("id", id + "_" + type + "-aggregationEnd").attr("class", "marker aggregation " + type).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
};
const dependency = (elem, type, id) => {
  elem.append("defs").append("marker").attr("id", id + "_" + type + "-dependencyStart").attr("class", "marker dependency " + type).attr("refX", 6).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 5,7 L9,13 L1,7 L9,1 Z");
  elem.append("defs").append("marker").attr("id", id + "_" + type + "-dependencyEnd").attr("class", "marker dependency " + type).attr("refX", 13).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L14,7 L9,1 Z");
};
const lollipop = (elem, type, id) => {
  elem.append("defs").append("marker").attr("id", id + "_" + type + "-lollipopStart").attr("class", "marker lollipop " + type).attr("refX", 13).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("circle").attr("stroke", "black").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6);
  elem.append("defs").append("marker").attr("id", id + "_" + type + "-lollipopEnd").attr("class", "marker lollipop " + type).attr("refX", 1).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("circle").attr("stroke", "black").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6);
};
const point = (elem, type, id) => {
  elem.append("marker").attr("id", id + "_" + type + "-pointEnd").attr("class", "marker " + type).attr("viewBox", "0 0 10 10").attr("refX", 6).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0");
  elem.append("marker").attr("id", id + "_" + type + "-pointStart").attr("class", "marker " + type).attr("viewBox", "0 0 10 10").attr("refX", 4.5).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 0 5 L 10 10 L 10 0 z").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0");
};
const circle$1 = (elem, type, id) => {
  elem.append("marker").attr("id", id + "_" + type + "-circleEnd").attr("class", "marker " + type).attr("viewBox", "0 0 10 10").attr("refX", 11).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0");
  elem.append("marker").attr("id", id + "_" + type + "-circleStart").attr("class", "marker " + type).attr("viewBox", "0 0 10 10").attr("refX", -1).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0");
};
const cross = (elem, type, id) => {
  elem.append("marker").attr("id", id + "_" + type + "-crossEnd").attr("class", "marker cross " + type).attr("viewBox", "0 0 11 11").attr("refX", 12).attr("refY", 5.2).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 1,1 l 9,9 M 10,1 l -9,9").attr("class", "arrowMarkerPath").style("stroke-width", 2).style("stroke-dasharray", "1,0");
  elem.append("marker").attr("id", id + "_" + type + "-crossStart").attr("class", "marker cross " + type).attr("viewBox", "0 0 11 11").attr("refX", -1).attr("refY", 5.2).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 1,1 l 9,9 M 10,1 l -9,9").attr("class", "arrowMarkerPath").style("stroke-width", 2).style("stroke-dasharray", "1,0");
};
const barb = (elem, type, id) => {
  elem.append("defs").append("marker").attr("id", id + "_" + type + "-barbEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "strokeWidth").attr("orient", "auto").append("path").attr("d", "M 19,7 L9,13 L14,7 L9,1 Z");
};
const markers = {
  extension,
  composition,
  aggregation,
  dependency,
  lollipop,
  point,
  circle: circle$1,
  cross,
  barb
};
const insertMarkers$1 = insertMarkers;
function applyStyle(dom, styleFn) {
  if (styleFn) {
    dom.attr("style", styleFn);
  }
}
function addHtmlLabel(node) {
  const fo = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(document.createElementNS("http://www.w3.org/2000/svg", "foreignObject"));
  const div = fo.append("xhtml:div");
  const label = node.label;
  const labelClass = node.isNode ? "nodeLabel" : "edgeLabel";
  div.html(
    '<span class="' + labelClass + '" ' + (node.labelStyle ? 'style="' + node.labelStyle + '"' : "") + ">" + label + "</span>"
  );
  applyStyle(div, node.labelStyle);
  div.style("display", "inline-block");
  div.style("white-space", "nowrap");
  div.attr("xmlns", "http://www.w3.org/1999/xhtml");
  return fo.node();
}
const createLabel = (_vertexText, style, isTitle, isNode) => {
  let vertexText = _vertexText || "";
  if (typeof vertexText === "object") {
    vertexText = vertexText[0];
  }
  if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.m)((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.htmlLabels)) {
    vertexText = vertexText.replace(/\\n|\n/g, "<br />");
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.debug("vertexText" + vertexText);
    const node = {
      isNode,
      label: (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.M)(vertexText).replace(
        /fa[blrs]?:fa-[\w-]+/g,
        // cspell: disable-line
        (s) => `<i class='${s.replace(":", " ")}'></i>`
      ),
      labelStyle: style.replace("fill:", "color:")
    };
    let vertexNode = addHtmlLabel(node);
    return vertexNode;
  } else {
    const svgLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    svgLabel.setAttribute("style", style.replace("color:", "fill:"));
    let rows = [];
    if (typeof vertexText === "string") {
      rows = vertexText.split(/\\n|\n|<br\s*\/?>/gi);
    } else if (Array.isArray(vertexText)) {
      rows = vertexText;
    } else {
      rows = [];
    }
    for (const row of rows) {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
      tspan.setAttribute("dy", "1em");
      tspan.setAttribute("x", "0");
      if (isTitle) {
        tspan.setAttribute("class", "title-row");
      } else {
        tspan.setAttribute("class", "row");
      }
      tspan.textContent = row.trim();
      svgLabel.appendChild(tspan);
    }
    return svgLabel;
  }
};
const createLabel$1 = createLabel;
const labelHelper = async (parent, node, _classes, isNode) => {
  let classes;
  const useHtmlLabels = node.useHtmlLabels || (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.m)((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.htmlLabels);
  if (!_classes) {
    classes = "node default";
  } else {
    classes = _classes;
  }
  const shapeSvg = parent.insert("g").attr("class", classes).attr("id", node.domId || node.id);
  const label = shapeSvg.insert("g").attr("class", "label").attr("style", node.labelStyle);
  let labelText;
  if (node.labelText === void 0) {
    labelText = "";
  } else {
    labelText = typeof node.labelText === "string" ? node.labelText : node.labelText[0];
  }
  const textNode = label.node();
  let text;
  if (node.labelType === "markdown") {
    text = (0,_createText_6b48ae7d_js__WEBPACK_IMPORTED_MODULE_2__.a)(label, (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.d)((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.M)(labelText), (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)()), {
      useHtmlLabels,
      width: node.width || (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.wrappingWidth,
      classes: "markdown-node-label"
    });
  } else {
    text = textNode.appendChild(
      createLabel$1(
        (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.d)((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.M)(labelText), (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)()),
        node.labelStyle,
        false,
        isNode
      )
    );
  }
  let bbox = text.getBBox();
  const halfPadding = node.padding / 2;
  if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.m)((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.htmlLabels)) {
    const div = text.children[0];
    const dv = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(text);
    const images = div.getElementsByTagName("img");
    if (images) {
      const noImgText = labelText.replace(/<img[^>]*>/g, "").trim() === "";
      await Promise.all(
        [...images].map(
          (img) => new Promise((res) => {
            function setupImage() {
              img.style.display = "flex";
              img.style.flexDirection = "column";
              if (noImgText) {
                const bodyFontSize = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().fontSize ? (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().fontSize : window.getComputedStyle(document.body).fontSize;
                const enlargingFactor = 5;
                const width = parseInt(bodyFontSize, 10) * enlargingFactor + "px";
                img.style.minWidth = width;
                img.style.maxWidth = width;
              } else {
                img.style.width = "100%";
              }
              res(img);
            }
            setTimeout(() => {
              if (img.complete) {
                setupImage();
              }
            });
            img.addEventListener("error", setupImage);
            img.addEventListener("load", setupImage);
          })
        )
      );
    }
    bbox = div.getBoundingClientRect();
    dv.attr("width", bbox.width);
    dv.attr("height", bbox.height);
  }
  if (useHtmlLabels) {
    label.attr("transform", "translate(" + -bbox.width / 2 + ", " + -bbox.height / 2 + ")");
  } else {
    label.attr("transform", "translate(0, " + -bbox.height / 2 + ")");
  }
  if (node.centerLabel) {
    label.attr("transform", "translate(" + -bbox.width / 2 + ", " + -bbox.height / 2 + ")");
  }
  label.insert("rect", ":first-child");
  return { shapeSvg, bbox, halfPadding, label };
};
const updateNodeBounds = (node, element) => {
  const bbox = element.node().getBBox();
  node.width = bbox.width;
  node.height = bbox.height;
};
function insertPolygonShape(parent, w, h, points) {
  return parent.insert("polygon", ":first-child").attr(
    "points",
    points.map(function(d) {
      return d.x + "," + d.y;
    }).join(" ")
  ).attr("class", "label-container").attr("transform", "translate(" + -w / 2 + "," + h / 2 + ")");
}
function intersectNode(node, point2) {
  return node.intersect(point2);
}
function intersectEllipse(node, rx, ry, point2) {
  var cx = node.x;
  var cy = node.y;
  var px = cx - point2.x;
  var py = cy - point2.y;
  var det = Math.sqrt(rx * rx * py * py + ry * ry * px * px);
  var dx = Math.abs(rx * ry * px / det);
  if (point2.x < cx) {
    dx = -dx;
  }
  var dy = Math.abs(rx * ry * py / det);
  if (point2.y < cy) {
    dy = -dy;
  }
  return { x: cx + dx, y: cy + dy };
}
function intersectCircle(node, rx, point2) {
  return intersectEllipse(node, rx, rx, point2);
}
function intersectLine(p1, p2, q1, q2) {
  var a1, a2, b1, b2, c1, c2;
  var r1, r2, r3, r4;
  var denom, offset, num;
  var x, y;
  a1 = p2.y - p1.y;
  b1 = p1.x - p2.x;
  c1 = p2.x * p1.y - p1.x * p2.y;
  r3 = a1 * q1.x + b1 * q1.y + c1;
  r4 = a1 * q2.x + b1 * q2.y + c1;
  if (r3 !== 0 && r4 !== 0 && sameSign(r3, r4)) {
    return;
  }
  a2 = q2.y - q1.y;
  b2 = q1.x - q2.x;
  c2 = q2.x * q1.y - q1.x * q2.y;
  r1 = a2 * p1.x + b2 * p1.y + c2;
  r2 = a2 * p2.x + b2 * p2.y + c2;
  if (r1 !== 0 && r2 !== 0 && sameSign(r1, r2)) {
    return;
  }
  denom = a1 * b2 - a2 * b1;
  if (denom === 0) {
    return;
  }
  offset = Math.abs(denom / 2);
  num = b1 * c2 - b2 * c1;
  x = num < 0 ? (num - offset) / denom : (num + offset) / denom;
  num = a2 * c1 - a1 * c2;
  y = num < 0 ? (num - offset) / denom : (num + offset) / denom;
  return { x, y };
}
function sameSign(r1, r2) {
  return r1 * r2 > 0;
}
function intersectPolygon(node, polyPoints, point2) {
  var x1 = node.x;
  var y1 = node.y;
  var intersections = [];
  var minX = Number.POSITIVE_INFINITY;
  var minY = Number.POSITIVE_INFINITY;
  if (typeof polyPoints.forEach === "function") {
    polyPoints.forEach(function(entry) {
      minX = Math.min(minX, entry.x);
      minY = Math.min(minY, entry.y);
    });
  } else {
    minX = Math.min(minX, polyPoints.x);
    minY = Math.min(minY, polyPoints.y);
  }
  var left = x1 - node.width / 2 - minX;
  var top = y1 - node.height / 2 - minY;
  for (var i = 0; i < polyPoints.length; i++) {
    var p1 = polyPoints[i];
    var p2 = polyPoints[i < polyPoints.length - 1 ? i + 1 : 0];
    var intersect2 = intersectLine(
      node,
      point2,
      { x: left + p1.x, y: top + p1.y },
      { x: left + p2.x, y: top + p2.y }
    );
    if (intersect2) {
      intersections.push(intersect2);
    }
  }
  if (!intersections.length) {
    return node;
  }
  if (intersections.length > 1) {
    intersections.sort(function(p, q) {
      var pdx = p.x - point2.x;
      var pdy = p.y - point2.y;
      var distp = Math.sqrt(pdx * pdx + pdy * pdy);
      var qdx = q.x - point2.x;
      var qdy = q.y - point2.y;
      var distq = Math.sqrt(qdx * qdx + qdy * qdy);
      return distp < distq ? -1 : distp === distq ? 0 : 1;
    });
  }
  return intersections[0];
}
const intersectRect = (node, point2) => {
  var x = node.x;
  var y = node.y;
  var dx = point2.x - x;
  var dy = point2.y - y;
  var w = node.width / 2;
  var h = node.height / 2;
  var sx, sy;
  if (Math.abs(dy) * w > Math.abs(dx) * h) {
    if (dy < 0) {
      h = -h;
    }
    sx = dy === 0 ? 0 : h * dx / dy;
    sy = h;
  } else {
    if (dx < 0) {
      w = -w;
    }
    sx = w;
    sy = dx === 0 ? 0 : w * dy / dx;
  }
  return { x: x + sx, y: y + sy };
};
const intersectRect$1 = intersectRect;
const intersect = {
  node: intersectNode,
  circle: intersectCircle,
  ellipse: intersectEllipse,
  polygon: intersectPolygon,
  rect: intersectRect$1
};
const note = async (parent, node) => {
  const useHtmlLabels = node.useHtmlLabels || (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.htmlLabels;
  if (!useHtmlLabels) {
    node.centerLabel = true;
  }
  const { shapeSvg, bbox, halfPadding } = await labelHelper(
    parent,
    node,
    "node " + node.classes,
    true
  );
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.info("Classes = ", node.classes);
  const rect2 = shapeSvg.insert("rect", ":first-child");
  rect2.attr("rx", node.rx).attr("ry", node.ry).attr("x", -bbox.width / 2 - halfPadding).attr("y", -bbox.height / 2 - halfPadding).attr("width", bbox.width + node.padding).attr("height", bbox.height + node.padding);
  updateNodeBounds(node, rect2);
  node.intersect = function(point2) {
    return intersect.rect(node, point2);
  };
  return shapeSvg;
};
const note$1 = note;
const expandAndDeduplicateDirections = (directions) => {
  const uniqueDirections = /* @__PURE__ */ new Set();
  for (const direction of directions) {
    switch (direction) {
      case "x":
        uniqueDirections.add("right");
        uniqueDirections.add("left");
        break;
      case "y":
        uniqueDirections.add("up");
        uniqueDirections.add("down");
        break;
      default:
        uniqueDirections.add(direction);
        break;
    }
  }
  return uniqueDirections;
};
const getArrowPoints = (duplicatedDirections, bbox, node) => {
  const directions = expandAndDeduplicateDirections(duplicatedDirections);
  const f = 2;
  const height = bbox.height + 2 * node.padding;
  const midpoint = height / f;
  const width = bbox.width + 2 * midpoint + node.padding;
  const padding = node.padding / 2;
  if (directions.has("right") && directions.has("left") && directions.has("up") && directions.has("down")) {
    return [
      // Bottom
      { x: 0, y: 0 },
      { x: midpoint, y: 0 },
      { x: width / 2, y: 2 * padding },
      { x: width - midpoint, y: 0 },
      { x: width, y: 0 },
      // Right
      { x: width, y: -height / 3 },
      { x: width + 2 * padding, y: -height / 2 },
      { x: width, y: -2 * height / 3 },
      { x: width, y: -height },
      // Top
      { x: width - midpoint, y: -height },
      { x: width / 2, y: -height - 2 * padding },
      { x: midpoint, y: -height },
      // Left
      { x: 0, y: -height },
      { x: 0, y: -2 * height / 3 },
      { x: -2 * padding, y: -height / 2 },
      { x: 0, y: -height / 3 }
    ];
  }
  if (directions.has("right") && directions.has("left") && directions.has("up")) {
    return [
      { x: midpoint, y: 0 },
      { x: width - midpoint, y: 0 },
      { x: width, y: -height / 2 },
      { x: width - midpoint, y: -height },
      { x: midpoint, y: -height },
      { x: 0, y: -height / 2 }
    ];
  }
  if (directions.has("right") && directions.has("left") && directions.has("down")) {
    return [
      { x: 0, y: 0 },
      { x: midpoint, y: -height },
      { x: width - midpoint, y: -height },
      { x: width, y: 0 }
    ];
  }
  if (directions.has("right") && directions.has("up") && directions.has("down")) {
    return [
      { x: 0, y: 0 },
      { x: width, y: -midpoint },
      { x: width, y: -height + midpoint },
      { x: 0, y: -height }
    ];
  }
  if (directions.has("left") && directions.has("up") && directions.has("down")) {
    return [
      { x: width, y: 0 },
      { x: 0, y: -midpoint },
      { x: 0, y: -height + midpoint },
      { x: width, y: -height }
    ];
  }
  if (directions.has("right") && directions.has("left")) {
    return [
      { x: midpoint, y: 0 },
      { x: midpoint, y: -padding },
      { x: width - midpoint, y: -padding },
      { x: width - midpoint, y: 0 },
      { x: width, y: -height / 2 },
      { x: width - midpoint, y: -height },
      { x: width - midpoint, y: -height + padding },
      { x: midpoint, y: -height + padding },
      { x: midpoint, y: -height },
      { x: 0, y: -height / 2 }
    ];
  }
  if (directions.has("up") && directions.has("down")) {
    return [
      // Bottom center
      { x: width / 2, y: 0 },
      // Left pont of bottom arrow
      { x: 0, y: -padding },
      { x: midpoint, y: -padding },
      // Left top over vertical section
      { x: midpoint, y: -height + padding },
      { x: 0, y: -height + padding },
      // Top of arrow
      { x: width / 2, y: -height },
      { x: width, y: -height + padding },
      // Top of right vertical bar
      { x: width - midpoint, y: -height + padding },
      { x: width - midpoint, y: -padding },
      { x: width, y: -padding }
    ];
  }
  if (directions.has("right") && directions.has("up")) {
    return [
      { x: 0, y: 0 },
      { x: width, y: -midpoint },
      { x: 0, y: -height }
    ];
  }
  if (directions.has("right") && directions.has("down")) {
    return [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: 0, y: -height }
    ];
  }
  if (directions.has("left") && directions.has("up")) {
    return [
      { x: width, y: 0 },
      { x: 0, y: -midpoint },
      { x: width, y: -height }
    ];
  }
  if (directions.has("left") && directions.has("down")) {
    return [
      { x: width, y: 0 },
      { x: 0, y: 0 },
      { x: width, y: -height }
    ];
  }
  if (directions.has("right")) {
    return [
      { x: midpoint, y: -padding },
      { x: midpoint, y: -padding },
      { x: width - midpoint, y: -padding },
      { x: width - midpoint, y: 0 },
      { x: width, y: -height / 2 },
      { x: width - midpoint, y: -height },
      { x: width - midpoint, y: -height + padding },
      // top left corner of arrow
      { x: midpoint, y: -height + padding },
      { x: midpoint, y: -height + padding }
    ];
  }
  if (directions.has("left")) {
    return [
      { x: midpoint, y: 0 },
      { x: midpoint, y: -padding },
      // Two points, the right corners
      { x: width - midpoint, y: -padding },
      { x: width - midpoint, y: -height + padding },
      { x: midpoint, y: -height + padding },
      { x: midpoint, y: -height },
      { x: 0, y: -height / 2 }
    ];
  }
  if (directions.has("up")) {
    return [
      // Bottom center
      { x: midpoint, y: -padding },
      // Left top over vertical section
      { x: midpoint, y: -height + padding },
      { x: 0, y: -height + padding },
      // Top of arrow
      { x: width / 2, y: -height },
      { x: width, y: -height + padding },
      // Top of right vertical bar
      { x: width - midpoint, y: -height + padding },
      { x: width - midpoint, y: -padding }
    ];
  }
  if (directions.has("down")) {
    return [
      // Bottom center
      { x: width / 2, y: 0 },
      // Left pont of bottom arrow
      { x: 0, y: -padding },
      { x: midpoint, y: -padding },
      // Left top over vertical section
      { x: midpoint, y: -height + padding },
      { x: width - midpoint, y: -height + padding },
      { x: width - midpoint, y: -padding },
      { x: width, y: -padding }
    ];
  }
  return [{ x: 0, y: 0 }];
};
const formatClass = (str) => {
  if (str) {
    return " " + str;
  }
  return "";
};
const getClassesFromNode = (node, otherClasses) => {
  return `${otherClasses ? otherClasses : "node default"}${formatClass(node.classes)} ${formatClass(
    node.class
  )}`;
};
const question = async (parent, node) => {
  const { shapeSvg, bbox } = await labelHelper(
    parent,
    node,
    getClassesFromNode(node, void 0),
    true
  );
  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const s = w + h;
  const points = [
    { x: s / 2, y: 0 },
    { x: s, y: -s / 2 },
    { x: s / 2, y: -s },
    { x: 0, y: -s / 2 }
  ];
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.info("Question main (Circle)");
  const questionElem = insertPolygonShape(shapeSvg, s, s, points);
  questionElem.attr("style", node.style);
  updateNodeBounds(node, questionElem);
  node.intersect = function(point2) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.warn("Intersect called");
    return intersect.polygon(node, points, point2);
  };
  return shapeSvg;
};
const choice = (parent, node) => {
  const shapeSvg = parent.insert("g").attr("class", "node default").attr("id", node.domId || node.id);
  const s = 28;
  const points = [
    { x: 0, y: s / 2 },
    { x: s / 2, y: 0 },
    { x: 0, y: -s / 2 },
    { x: -s / 2, y: 0 }
  ];
  const choice2 = shapeSvg.insert("polygon", ":first-child").attr(
    "points",
    points.map(function(d) {
      return d.x + "," + d.y;
    }).join(" ")
  );
  choice2.attr("class", "state-start").attr("r", 7).attr("width", 28).attr("height", 28);
  node.width = 28;
  node.height = 28;
  node.intersect = function(point2) {
    return intersect.circle(node, 14, point2);
  };
  return shapeSvg;
};
const hexagon = async (parent, node) => {
  const { shapeSvg, bbox } = await labelHelper(
    parent,
    node,
    getClassesFromNode(node, void 0),
    true
  );
  const f = 4;
  const h = bbox.height + node.padding;
  const m = h / f;
  const w = bbox.width + 2 * m + node.padding;
  const points = [
    { x: m, y: 0 },
    { x: w - m, y: 0 },
    { x: w, y: -h / 2 },
    { x: w - m, y: -h },
    { x: m, y: -h },
    { x: 0, y: -h / 2 }
  ];
  const hex = insertPolygonShape(shapeSvg, w, h, points);
  hex.attr("style", node.style);
  updateNodeBounds(node, hex);
  node.intersect = function(point2) {
    return intersect.polygon(node, points, point2);
  };
  return shapeSvg;
};
const block_arrow = async (parent, node) => {
  const { shapeSvg, bbox } = await labelHelper(parent, node, void 0, true);
  const f = 2;
  const h = bbox.height + 2 * node.padding;
  const m = h / f;
  const w = bbox.width + 2 * m + node.padding;
  const points = getArrowPoints(node.directions, bbox, node);
  const blockArrow = insertPolygonShape(shapeSvg, w, h, points);
  blockArrow.attr("style", node.style);
  updateNodeBounds(node, blockArrow);
  node.intersect = function(point2) {
    return intersect.polygon(node, points, point2);
  };
  return shapeSvg;
};
const rect_left_inv_arrow = async (parent, node) => {
  const { shapeSvg, bbox } = await labelHelper(
    parent,
    node,
    getClassesFromNode(node, void 0),
    true
  );
  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const points = [
    { x: -h / 2, y: 0 },
    { x: w, y: 0 },
    { x: w, y: -h },
    { x: -h / 2, y: -h },
    { x: 0, y: -h / 2 }
  ];
  const el = insertPolygonShape(shapeSvg, w, h, points);
  el.attr("style", node.style);
  node.width = w + h;
  node.height = h;
  node.intersect = function(point2) {
    return intersect.polygon(node, points, point2);
  };
  return shapeSvg;
};
const lean_right = async (parent, node) => {
  const { shapeSvg, bbox } = await labelHelper(parent, node, getClassesFromNode(node), true);
  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const points = [
    { x: -2 * h / 6, y: 0 },
    { x: w - h / 6, y: 0 },
    { x: w + 2 * h / 6, y: -h },
    { x: h / 6, y: -h }
  ];
  const el = insertPolygonShape(shapeSvg, w, h, points);
  el.attr("style", node.style);
  updateNodeBounds(node, el);
  node.intersect = function(point2) {
    return intersect.polygon(node, points, point2);
  };
  return shapeSvg;
};
const lean_left = async (parent, node) => {
  const { shapeSvg, bbox } = await labelHelper(
    parent,
    node,
    getClassesFromNode(node, void 0),
    true
  );
  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const points = [
    { x: 2 * h / 6, y: 0 },
    { x: w + h / 6, y: 0 },
    { x: w - 2 * h / 6, y: -h },
    { x: -h / 6, y: -h }
  ];
  const el = insertPolygonShape(shapeSvg, w, h, points);
  el.attr("style", node.style);
  updateNodeBounds(node, el);
  node.intersect = function(point2) {
    return intersect.polygon(node, points, point2);
  };
  return shapeSvg;
};
const trapezoid = async (parent, node) => {
  const { shapeSvg, bbox } = await labelHelper(
    parent,
    node,
    getClassesFromNode(node, void 0),
    true
  );
  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const points = [
    { x: -2 * h / 6, y: 0 },
    { x: w + 2 * h / 6, y: 0 },
    { x: w - h / 6, y: -h },
    { x: h / 6, y: -h }
  ];
  const el = insertPolygonShape(shapeSvg, w, h, points);
  el.attr("style", node.style);
  updateNodeBounds(node, el);
  node.intersect = function(point2) {
    return intersect.polygon(node, points, point2);
  };
  return shapeSvg;
};
const inv_trapezoid = async (parent, node) => {
  const { shapeSvg, bbox } = await labelHelper(
    parent,
    node,
    getClassesFromNode(node, void 0),
    true
  );
  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const points = [
    { x: h / 6, y: 0 },
    { x: w - h / 6, y: 0 },
    { x: w + 2 * h / 6, y: -h },
    { x: -2 * h / 6, y: -h }
  ];
  const el = insertPolygonShape(shapeSvg, w, h, points);
  el.attr("style", node.style);
  updateNodeBounds(node, el);
  node.intersect = function(point2) {
    return intersect.polygon(node, points, point2);
  };
  return shapeSvg;
};
const rect_right_inv_arrow = async (parent, node) => {
  const { shapeSvg, bbox } = await labelHelper(
    parent,
    node,
    getClassesFromNode(node, void 0),
    true
  );
  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const points = [
    { x: 0, y: 0 },
    { x: w + h / 2, y: 0 },
    { x: w, y: -h / 2 },
    { x: w + h / 2, y: -h },
    { x: 0, y: -h }
  ];
  const el = insertPolygonShape(shapeSvg, w, h, points);
  el.attr("style", node.style);
  updateNodeBounds(node, el);
  node.intersect = function(point2) {
    return intersect.polygon(node, points, point2);
  };
  return shapeSvg;
};
const cylinder = async (parent, node) => {
  const { shapeSvg, bbox } = await labelHelper(
    parent,
    node,
    getClassesFromNode(node, void 0),
    true
  );
  const w = bbox.width + node.padding;
  const rx = w / 2;
  const ry = rx / (2.5 + w / 50);
  const h = bbox.height + ry + node.padding;
  const shape = "M 0," + ry + " a " + rx + "," + ry + " 0,0,0 " + w + " 0 a " + rx + "," + ry + " 0,0,0 " + -w + " 0 l 0," + h + " a " + rx + "," + ry + " 0,0,0 " + w + " 0 l 0," + -h;
  const el = shapeSvg.attr("label-offset-y", ry).insert("path", ":first-child").attr("style", node.style).attr("d", shape).attr("transform", "translate(" + -w / 2 + "," + -(h / 2 + ry) + ")");
  updateNodeBounds(node, el);
  node.intersect = function(point2) {
    const pos = intersect.rect(node, point2);
    const x = pos.x - node.x;
    if (rx != 0 && (Math.abs(x) < node.width / 2 || Math.abs(x) == node.width / 2 && Math.abs(pos.y - node.y) > node.height / 2 - ry)) {
      let y = ry * ry * (1 - x * x / (rx * rx));
      if (y != 0) {
        y = Math.sqrt(y);
      }
      y = ry - y;
      if (point2.y - node.y > 0) {
        y = -y;
      }
      pos.y += y;
    }
    return pos;
  };
  return shapeSvg;
};
const rect = async (parent, node) => {
  const { shapeSvg, bbox, halfPadding } = await labelHelper(
    parent,
    node,
    "node " + node.classes + " " + node.class,
    true
  );
  const rect2 = shapeSvg.insert("rect", ":first-child");
  const totalWidth = node.positioned ? node.width : bbox.width + node.padding;
  const totalHeight = node.positioned ? node.height : bbox.height + node.padding;
  const x = node.positioned ? -totalWidth / 2 : -bbox.width / 2 - halfPadding;
  const y = node.positioned ? -totalHeight / 2 : -bbox.height / 2 - halfPadding;
  rect2.attr("class", "basic label-container").attr("style", node.style).attr("rx", node.rx).attr("ry", node.ry).attr("x", x).attr("y", y).attr("width", totalWidth).attr("height", totalHeight);
  if (node.props) {
    const propKeys = new Set(Object.keys(node.props));
    if (node.props.borders) {
      applyNodePropertyBorders(rect2, node.props.borders, totalWidth, totalHeight);
      propKeys.delete("borders");
    }
    propKeys.forEach((propKey) => {
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.warn(`Unknown node property ${propKey}`);
    });
  }
  updateNodeBounds(node, rect2);
  node.intersect = function(point2) {
    return intersect.rect(node, point2);
  };
  return shapeSvg;
};
const composite = async (parent, node) => {
  const { shapeSvg, bbox, halfPadding } = await labelHelper(
    parent,
    node,
    "node " + node.classes,
    true
  );
  const rect2 = shapeSvg.insert("rect", ":first-child");
  const totalWidth = node.positioned ? node.width : bbox.width + node.padding;
  const totalHeight = node.positioned ? node.height : bbox.height + node.padding;
  const x = node.positioned ? -totalWidth / 2 : -bbox.width / 2 - halfPadding;
  const y = node.positioned ? -totalHeight / 2 : -bbox.height / 2 - halfPadding;
  rect2.attr("class", "basic cluster composite label-container").attr("style", node.style).attr("rx", node.rx).attr("ry", node.ry).attr("x", x).attr("y", y).attr("width", totalWidth).attr("height", totalHeight);
  if (node.props) {
    const propKeys = new Set(Object.keys(node.props));
    if (node.props.borders) {
      applyNodePropertyBorders(rect2, node.props.borders, totalWidth, totalHeight);
      propKeys.delete("borders");
    }
    propKeys.forEach((propKey) => {
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.warn(`Unknown node property ${propKey}`);
    });
  }
  updateNodeBounds(node, rect2);
  node.intersect = function(point2) {
    return intersect.rect(node, point2);
  };
  return shapeSvg;
};
const labelRect = async (parent, node) => {
  const { shapeSvg } = await labelHelper(parent, node, "label", true);
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.trace("Classes = ", node.class);
  const rect2 = shapeSvg.insert("rect", ":first-child");
  const totalWidth = 0;
  const totalHeight = 0;
  rect2.attr("width", totalWidth).attr("height", totalHeight);
  shapeSvg.attr("class", "label edgeLabel");
  if (node.props) {
    const propKeys = new Set(Object.keys(node.props));
    if (node.props.borders) {
      applyNodePropertyBorders(rect2, node.props.borders, totalWidth, totalHeight);
      propKeys.delete("borders");
    }
    propKeys.forEach((propKey) => {
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.warn(`Unknown node property ${propKey}`);
    });
  }
  updateNodeBounds(node, rect2);
  node.intersect = function(point2) {
    return intersect.rect(node, point2);
  };
  return shapeSvg;
};
function applyNodePropertyBorders(rect2, borders, totalWidth, totalHeight) {
  const strokeDashArray = [];
  const addBorder = (length) => {
    strokeDashArray.push(length, 0);
  };
  const skipBorder = (length) => {
    strokeDashArray.push(0, length);
  };
  if (borders.includes("t")) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.debug("add top border");
    addBorder(totalWidth);
  } else {
    skipBorder(totalWidth);
  }
  if (borders.includes("r")) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.debug("add right border");
    addBorder(totalHeight);
  } else {
    skipBorder(totalHeight);
  }
  if (borders.includes("b")) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.debug("add bottom border");
    addBorder(totalWidth);
  } else {
    skipBorder(totalWidth);
  }
  if (borders.includes("l")) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.debug("add left border");
    addBorder(totalHeight);
  } else {
    skipBorder(totalHeight);
  }
  rect2.attr("stroke-dasharray", strokeDashArray.join(" "));
}
const rectWithTitle = (parent, node) => {
  let classes;
  if (!node.classes) {
    classes = "node default";
  } else {
    classes = "node " + node.classes;
  }
  const shapeSvg = parent.insert("g").attr("class", classes).attr("id", node.domId || node.id);
  const rect2 = shapeSvg.insert("rect", ":first-child");
  const innerLine = shapeSvg.insert("line");
  const label = shapeSvg.insert("g").attr("class", "label");
  const text2 = node.labelText.flat ? node.labelText.flat() : node.labelText;
  let title = "";
  if (typeof text2 === "object") {
    title = text2[0];
  } else {
    title = text2;
  }
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.info("Label text abc79", title, text2, typeof text2 === "object");
  const text = label.node().appendChild(createLabel$1(title, node.labelStyle, true, true));
  let bbox = { width: 0, height: 0 };
  if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.m)((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.htmlLabels)) {
    const div = text.children[0];
    const dv = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(text);
    bbox = div.getBoundingClientRect();
    dv.attr("width", bbox.width);
    dv.attr("height", bbox.height);
  }
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.info("Text 2", text2);
  const textRows = text2.slice(1, text2.length);
  let titleBox = text.getBBox();
  const descr = label.node().appendChild(
    createLabel$1(textRows.join ? textRows.join("<br/>") : textRows, node.labelStyle, true, true)
  );
  if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.m)((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.htmlLabels)) {
    const div = descr.children[0];
    const dv = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(descr);
    bbox = div.getBoundingClientRect();
    dv.attr("width", bbox.width);
    dv.attr("height", bbox.height);
  }
  const halfPadding = node.padding / 2;
  (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(descr).attr(
    "transform",
    "translate( " + // (titleBox.width - bbox.width) / 2 +
    (bbox.width > titleBox.width ? 0 : (titleBox.width - bbox.width) / 2) + ", " + (titleBox.height + halfPadding + 5) + ")"
  );
  (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(text).attr(
    "transform",
    "translate( " + // (titleBox.width - bbox.width) / 2 +
    (bbox.width < titleBox.width ? 0 : -(titleBox.width - bbox.width) / 2) + ", 0)"
  );
  bbox = label.node().getBBox();
  label.attr(
    "transform",
    "translate(" + -bbox.width / 2 + ", " + (-bbox.height / 2 - halfPadding + 3) + ")"
  );
  rect2.attr("class", "outer title-state").attr("x", -bbox.width / 2 - halfPadding).attr("y", -bbox.height / 2 - halfPadding).attr("width", bbox.width + node.padding).attr("height", bbox.height + node.padding);
  innerLine.attr("class", "divider").attr("x1", -bbox.width / 2 - halfPadding).attr("x2", bbox.width / 2 + halfPadding).attr("y1", -bbox.height / 2 - halfPadding + titleBox.height + halfPadding).attr("y2", -bbox.height / 2 - halfPadding + titleBox.height + halfPadding);
  updateNodeBounds(node, rect2);
  node.intersect = function(point2) {
    return intersect.rect(node, point2);
  };
  return shapeSvg;
};
const stadium = async (parent, node) => {
  const { shapeSvg, bbox } = await labelHelper(
    parent,
    node,
    getClassesFromNode(node, void 0),
    true
  );
  const h = bbox.height + node.padding;
  const w = bbox.width + h / 4 + node.padding;
  const rect2 = shapeSvg.insert("rect", ":first-child").attr("style", node.style).attr("rx", h / 2).attr("ry", h / 2).attr("x", -w / 2).attr("y", -h / 2).attr("width", w).attr("height", h);
  updateNodeBounds(node, rect2);
  node.intersect = function(point2) {
    return intersect.rect(node, point2);
  };
  return shapeSvg;
};
const circle = async (parent, node) => {
  const { shapeSvg, bbox, halfPadding } = await labelHelper(
    parent,
    node,
    getClassesFromNode(node, void 0),
    true
  );
  const circle2 = shapeSvg.insert("circle", ":first-child");
  circle2.attr("style", node.style).attr("rx", node.rx).attr("ry", node.ry).attr("r", bbox.width / 2 + halfPadding).attr("width", bbox.width + node.padding).attr("height", bbox.height + node.padding);
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.info("Circle main");
  updateNodeBounds(node, circle2);
  node.intersect = function(point2) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.info("Circle intersect", node, bbox.width / 2 + halfPadding, point2);
    return intersect.circle(node, bbox.width / 2 + halfPadding, point2);
  };
  return shapeSvg;
};
const doublecircle = async (parent, node) => {
  const { shapeSvg, bbox, halfPadding } = await labelHelper(
    parent,
    node,
    getClassesFromNode(node, void 0),
    true
  );
  const gap = 5;
  const circleGroup = shapeSvg.insert("g", ":first-child");
  const outerCircle = circleGroup.insert("circle");
  const innerCircle = circleGroup.insert("circle");
  circleGroup.attr("class", node.class);
  outerCircle.attr("style", node.style).attr("rx", node.rx).attr("ry", node.ry).attr("r", bbox.width / 2 + halfPadding + gap).attr("width", bbox.width + node.padding + gap * 2).attr("height", bbox.height + node.padding + gap * 2);
  innerCircle.attr("style", node.style).attr("rx", node.rx).attr("ry", node.ry).attr("r", bbox.width / 2 + halfPadding).attr("width", bbox.width + node.padding).attr("height", bbox.height + node.padding);
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.info("DoubleCircle main");
  updateNodeBounds(node, outerCircle);
  node.intersect = function(point2) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.info("DoubleCircle intersect", node, bbox.width / 2 + halfPadding + gap, point2);
    return intersect.circle(node, bbox.width / 2 + halfPadding + gap, point2);
  };
  return shapeSvg;
};
const subroutine = async (parent, node) => {
  const { shapeSvg, bbox } = await labelHelper(
    parent,
    node,
    getClassesFromNode(node, void 0),
    true
  );
  const w = bbox.width + node.padding;
  const h = bbox.height + node.padding;
  const points = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: -h },
    { x: 0, y: -h },
    { x: 0, y: 0 },
    { x: -8, y: 0 },
    { x: w + 8, y: 0 },
    { x: w + 8, y: -h },
    { x: -8, y: -h },
    { x: -8, y: 0 }
  ];
  const el = insertPolygonShape(shapeSvg, w, h, points);
  el.attr("style", node.style);
  updateNodeBounds(node, el);
  node.intersect = function(point2) {
    return intersect.polygon(node, points, point2);
  };
  return shapeSvg;
};
const start = (parent, node) => {
  const shapeSvg = parent.insert("g").attr("class", "node default").attr("id", node.domId || node.id);
  const circle2 = shapeSvg.insert("circle", ":first-child");
  circle2.attr("class", "state-start").attr("r", 7).attr("width", 14).attr("height", 14);
  updateNodeBounds(node, circle2);
  node.intersect = function(point2) {
    return intersect.circle(node, 7, point2);
  };
  return shapeSvg;
};
const forkJoin = (parent, node, dir) => {
  const shapeSvg = parent.insert("g").attr("class", "node default").attr("id", node.domId || node.id);
  let width = 70;
  let height = 10;
  if (dir === "LR") {
    width = 10;
    height = 70;
  }
  const shape = shapeSvg.append("rect").attr("x", -1 * width / 2).attr("y", -1 * height / 2).attr("width", width).attr("height", height).attr("class", "fork-join");
  updateNodeBounds(node, shape);
  node.height = node.height + node.padding / 2;
  node.width = node.width + node.padding / 2;
  node.intersect = function(point2) {
    return intersect.rect(node, point2);
  };
  return shapeSvg;
};
const end = (parent, node) => {
  const shapeSvg = parent.insert("g").attr("class", "node default").attr("id", node.domId || node.id);
  const innerCircle = shapeSvg.insert("circle", ":first-child");
  const circle2 = shapeSvg.insert("circle", ":first-child");
  circle2.attr("class", "state-start").attr("r", 7).attr("width", 14).attr("height", 14);
  innerCircle.attr("class", "state-end").attr("r", 5).attr("width", 10).attr("height", 10);
  updateNodeBounds(node, circle2);
  node.intersect = function(point2) {
    return intersect.circle(node, 7, point2);
  };
  return shapeSvg;
};
const class_box = (parent, node) => {
  const halfPadding = node.padding / 2;
  const rowPadding = 4;
  const lineHeight = 8;
  let classes;
  if (!node.classes) {
    classes = "node default";
  } else {
    classes = "node " + node.classes;
  }
  const shapeSvg = parent.insert("g").attr("class", classes).attr("id", node.domId || node.id);
  const rect2 = shapeSvg.insert("rect", ":first-child");
  const topLine = shapeSvg.insert("line");
  const bottomLine = shapeSvg.insert("line");
  let maxWidth = 0;
  let maxHeight = rowPadding;
  const labelContainer = shapeSvg.insert("g").attr("class", "label");
  let verticalPos = 0;
  const hasInterface = node.classData.annotations && node.classData.annotations[0];
  const interfaceLabelText = node.classData.annotations[0] ? "«" + node.classData.annotations[0] + "»" : "";
  const interfaceLabel = labelContainer.node().appendChild(createLabel$1(interfaceLabelText, node.labelStyle, true, true));
  let interfaceBBox = interfaceLabel.getBBox();
  if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.m)((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.htmlLabels)) {
    const div = interfaceLabel.children[0];
    const dv = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(interfaceLabel);
    interfaceBBox = div.getBoundingClientRect();
    dv.attr("width", interfaceBBox.width);
    dv.attr("height", interfaceBBox.height);
  }
  if (node.classData.annotations[0]) {
    maxHeight += interfaceBBox.height + rowPadding;
    maxWidth += interfaceBBox.width;
  }
  let classTitleString = node.classData.label;
  if (node.classData.type !== void 0 && node.classData.type !== "") {
    if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.htmlLabels) {
      classTitleString += "&lt;" + node.classData.type + "&gt;";
    } else {
      classTitleString += "<" + node.classData.type + ">";
    }
  }
  const classTitleLabel = labelContainer.node().appendChild(createLabel$1(classTitleString, node.labelStyle, true, true));
  (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(classTitleLabel).attr("class", "classTitle");
  let classTitleBBox = classTitleLabel.getBBox();
  if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.m)((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.htmlLabels)) {
    const div = classTitleLabel.children[0];
    const dv = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(classTitleLabel);
    classTitleBBox = div.getBoundingClientRect();
    dv.attr("width", classTitleBBox.width);
    dv.attr("height", classTitleBBox.height);
  }
  maxHeight += classTitleBBox.height + rowPadding;
  if (classTitleBBox.width > maxWidth) {
    maxWidth = classTitleBBox.width;
  }
  const classAttributes = [];
  node.classData.members.forEach((member) => {
    const parsedInfo = member.getDisplayDetails();
    let parsedText = parsedInfo.displayText;
    if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.htmlLabels) {
      parsedText = parsedText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    const lbl = labelContainer.node().appendChild(
      createLabel$1(
        parsedText,
        parsedInfo.cssStyle ? parsedInfo.cssStyle : node.labelStyle,
        true,
        true
      )
    );
    let bbox = lbl.getBBox();
    if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.m)((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.htmlLabels)) {
      const div = lbl.children[0];
      const dv = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(lbl);
      bbox = div.getBoundingClientRect();
      dv.attr("width", bbox.width);
      dv.attr("height", bbox.height);
    }
    if (bbox.width > maxWidth) {
      maxWidth = bbox.width;
    }
    maxHeight += bbox.height + rowPadding;
    classAttributes.push(lbl);
  });
  maxHeight += lineHeight;
  const classMethods = [];
  node.classData.methods.forEach((member) => {
    const parsedInfo = member.getDisplayDetails();
    let displayText = parsedInfo.displayText;
    if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.htmlLabels) {
      displayText = displayText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    const lbl = labelContainer.node().appendChild(
      createLabel$1(
        displayText,
        parsedInfo.cssStyle ? parsedInfo.cssStyle : node.labelStyle,
        true,
        true
      )
    );
    let bbox = lbl.getBBox();
    if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.m)((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.htmlLabels)) {
      const div = lbl.children[0];
      const dv = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(lbl);
      bbox = div.getBoundingClientRect();
      dv.attr("width", bbox.width);
      dv.attr("height", bbox.height);
    }
    if (bbox.width > maxWidth) {
      maxWidth = bbox.width;
    }
    maxHeight += bbox.height + rowPadding;
    classMethods.push(lbl);
  });
  maxHeight += lineHeight;
  if (hasInterface) {
    let diffX2 = (maxWidth - interfaceBBox.width) / 2;
    (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(interfaceLabel).attr(
      "transform",
      "translate( " + (-1 * maxWidth / 2 + diffX2) + ", " + -1 * maxHeight / 2 + ")"
    );
    verticalPos = interfaceBBox.height + rowPadding;
  }
  let diffX = (maxWidth - classTitleBBox.width) / 2;
  (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(classTitleLabel).attr(
    "transform",
    "translate( " + (-1 * maxWidth / 2 + diffX) + ", " + (-1 * maxHeight / 2 + verticalPos) + ")"
  );
  verticalPos += classTitleBBox.height + rowPadding;
  topLine.attr("class", "divider").attr("x1", -maxWidth / 2 - halfPadding).attr("x2", maxWidth / 2 + halfPadding).attr("y1", -maxHeight / 2 - halfPadding + lineHeight + verticalPos).attr("y2", -maxHeight / 2 - halfPadding + lineHeight + verticalPos);
  verticalPos += lineHeight;
  classAttributes.forEach((lbl) => {
    (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(lbl).attr(
      "transform",
      "translate( " + -maxWidth / 2 + ", " + (-1 * maxHeight / 2 + verticalPos + lineHeight / 2) + ")"
    );
    const memberBBox = lbl == null ? void 0 : lbl.getBBox();
    verticalPos += ((memberBBox == null ? void 0 : memberBBox.height) ?? 0) + rowPadding;
  });
  verticalPos += lineHeight;
  bottomLine.attr("class", "divider").attr("x1", -maxWidth / 2 - halfPadding).attr("x2", maxWidth / 2 + halfPadding).attr("y1", -maxHeight / 2 - halfPadding + lineHeight + verticalPos).attr("y2", -maxHeight / 2 - halfPadding + lineHeight + verticalPos);
  verticalPos += lineHeight;
  classMethods.forEach((lbl) => {
    (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(lbl).attr(
      "transform",
      "translate( " + -maxWidth / 2 + ", " + (-1 * maxHeight / 2 + verticalPos) + ")"
    );
    const memberBBox = lbl == null ? void 0 : lbl.getBBox();
    verticalPos += ((memberBBox == null ? void 0 : memberBBox.height) ?? 0) + rowPadding;
  });
  rect2.attr("style", node.style).attr("class", "outer title-state").attr("x", -maxWidth / 2 - halfPadding).attr("y", -(maxHeight / 2) - halfPadding).attr("width", maxWidth + node.padding).attr("height", maxHeight + node.padding);
  updateNodeBounds(node, rect2);
  node.intersect = function(point2) {
    return intersect.rect(node, point2);
  };
  return shapeSvg;
};
const shapes = {
  rhombus: question,
  composite,
  question,
  rect,
  labelRect,
  rectWithTitle,
  choice,
  circle,
  doublecircle,
  stadium,
  hexagon,
  block_arrow,
  rect_left_inv_arrow,
  lean_right,
  lean_left,
  trapezoid,
  inv_trapezoid,
  rect_right_inv_arrow,
  cylinder,
  start,
  end,
  note: note$1,
  subroutine,
  fork: forkJoin,
  join: forkJoin,
  class_box
};
let nodeElems = {};
const insertNode = async (elem, node, dir) => {
  let newEl;
  let el;
  if (node.link) {
    let target;
    if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().securityLevel === "sandbox") {
      target = "_top";
    } else if (node.linkTarget) {
      target = node.linkTarget || "_blank";
    }
    newEl = elem.insert("svg:a").attr("xlink:href", node.link).attr("target", target);
    el = await shapes[node.shape](newEl, node, dir);
  } else {
    el = await shapes[node.shape](elem, node, dir);
    newEl = el;
  }
  if (node.tooltip) {
    el.attr("title", node.tooltip);
  }
  if (node.class) {
    el.attr("class", "node default " + node.class);
  }
  newEl.attr("data-node", "true");
  newEl.attr("data-id", node.id);
  nodeElems[node.id] = newEl;
  if (node.haveCallback) {
    nodeElems[node.id].attr("class", nodeElems[node.id].attr("class") + " clickable");
  }
  return newEl;
};
const setNodeElem = (elem, node) => {
  nodeElems[node.id] = elem;
};
const clear$1 = () => {
  nodeElems = {};
};
const positionNode = (node) => {
  const el = nodeElems[node.id];
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.trace(
    "Transforming node",
    node.diff,
    node,
    "translate(" + (node.x - node.width / 2 - 5) + ", " + node.width / 2 + ")"
  );
  const padding = 8;
  const diff = node.diff || 0;
  if (node.clusterNode) {
    el.attr(
      "transform",
      "translate(" + (node.x + diff - node.width / 2) + ", " + (node.y - node.height / 2 - padding) + ")"
    );
  } else {
    el.attr("transform", "translate(" + node.x + ", " + node.y + ")");
  }
  return diff;
};
const getSubGraphTitleMargins = ({
  flowchart
}) => {
  var _a, _b;
  const subGraphTitleTopMargin = ((_a = flowchart == null ? void 0 : flowchart.subGraphTitleMargin) == null ? void 0 : _a.top) ?? 0;
  const subGraphTitleBottomMargin = ((_b = flowchart == null ? void 0 : flowchart.subGraphTitleMargin) == null ? void 0 : _b.bottom) ?? 0;
  const subGraphTitleTotalMargin = subGraphTitleTopMargin + subGraphTitleBottomMargin;
  return {
    subGraphTitleTopMargin,
    subGraphTitleBottomMargin,
    subGraphTitleTotalMargin
  };
};
const markerOffsets = {
  aggregation: 18,
  extension: 18,
  composition: 18,
  dependency: 6,
  lollipop: 13.5,
  arrow_point: 5.3
};
function calculateDeltaAndAngle(point1, point2) {
  if (point1 === void 0 || point2 === void 0) {
    return { angle: 0, deltaX: 0, deltaY: 0 };
  }
  point1 = pointTransformer(point1);
  point2 = pointTransformer(point2);
  const [x1, y1] = [point1.x, point1.y];
  const [x2, y2] = [point2.x, point2.y];
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  return { angle: Math.atan(deltaY / deltaX), deltaX, deltaY };
}
const pointTransformer = (data) => {
  if (Array.isArray(data)) {
    return { x: data[0], y: data[1] };
  }
  return data;
};
const getLineFunctionsWithOffset = (edge) => {
  return {
    x: function(d, i, data) {
      let offset = 0;
      if (i === 0 && Object.hasOwn(markerOffsets, edge.arrowTypeStart)) {
        const { angle, deltaX } = calculateDeltaAndAngle(data[0], data[1]);
        offset = markerOffsets[edge.arrowTypeStart] * Math.cos(angle) * (deltaX >= 0 ? 1 : -1);
      } else if (i === data.length - 1 && Object.hasOwn(markerOffsets, edge.arrowTypeEnd)) {
        const { angle, deltaX } = calculateDeltaAndAngle(
          data[data.length - 1],
          data[data.length - 2]
        );
        offset = markerOffsets[edge.arrowTypeEnd] * Math.cos(angle) * (deltaX >= 0 ? 1 : -1);
      }
      return pointTransformer(d).x + offset;
    },
    y: function(d, i, data) {
      let offset = 0;
      if (i === 0 && Object.hasOwn(markerOffsets, edge.arrowTypeStart)) {
        const { angle, deltaY } = calculateDeltaAndAngle(data[0], data[1]);
        offset = markerOffsets[edge.arrowTypeStart] * Math.abs(Math.sin(angle)) * (deltaY >= 0 ? 1 : -1);
      } else if (i === data.length - 1 && Object.hasOwn(markerOffsets, edge.arrowTypeEnd)) {
        const { angle, deltaY } = calculateDeltaAndAngle(
          data[data.length - 1],
          data[data.length - 2]
        );
        offset = markerOffsets[edge.arrowTypeEnd] * Math.abs(Math.sin(angle)) * (deltaY >= 0 ? 1 : -1);
      }
      return pointTransformer(d).y + offset;
    }
  };
};
const addEdgeMarkers = (svgPath, edge, url, id, diagramType) => {
  if (edge.arrowTypeStart) {
    addEdgeMarker(svgPath, "start", edge.arrowTypeStart, url, id, diagramType);
  }
  if (edge.arrowTypeEnd) {
    addEdgeMarker(svgPath, "end", edge.arrowTypeEnd, url, id, diagramType);
  }
};
const arrowTypesMap = {
  arrow_cross: "cross",
  arrow_point: "point",
  arrow_barb: "barb",
  arrow_circle: "circle",
  aggregation: "aggregation",
  extension: "extension",
  composition: "composition",
  dependency: "dependency",
  lollipop: "lollipop"
};
const addEdgeMarker = (svgPath, position, arrowType, url, id, diagramType) => {
  const endMarkerType = arrowTypesMap[arrowType];
  if (!endMarkerType) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.warn(`Unknown arrow type: ${arrowType}`);
    return;
  }
  const suffix = position === "start" ? "Start" : "End";
  svgPath.attr(`marker-${position}`, `url(${url}#${id}_${diagramType}-${endMarkerType}${suffix})`);
};
let edgeLabels = {};
let terminalLabels = {};
const clear = () => {
  edgeLabels = {};
  terminalLabels = {};
};
const insertEdgeLabel = (elem, edge) => {
  const useHtmlLabels = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.m)((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.htmlLabels);
  const labelElement = edge.labelType === "markdown" ? (0,_createText_6b48ae7d_js__WEBPACK_IMPORTED_MODULE_2__.a)(elem, edge.label, {
    style: edge.labelStyle,
    useHtmlLabels,
    addSvgBackground: true
  }) : createLabel$1(edge.label, edge.labelStyle);
  const edgeLabel = elem.insert("g").attr("class", "edgeLabel");
  const label = edgeLabel.insert("g").attr("class", "label");
  label.node().appendChild(labelElement);
  let bbox = labelElement.getBBox();
  if (useHtmlLabels) {
    const div = labelElement.children[0];
    const dv = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(labelElement);
    bbox = div.getBoundingClientRect();
    dv.attr("width", bbox.width);
    dv.attr("height", bbox.height);
  }
  label.attr("transform", "translate(" + -bbox.width / 2 + ", " + -bbox.height / 2 + ")");
  edgeLabels[edge.id] = edgeLabel;
  edge.width = bbox.width;
  edge.height = bbox.height;
  let fo;
  if (edge.startLabelLeft) {
    const startLabelElement = createLabel$1(edge.startLabelLeft, edge.labelStyle);
    const startEdgeLabelLeft = elem.insert("g").attr("class", "edgeTerminals");
    const inner = startEdgeLabelLeft.insert("g").attr("class", "inner");
    fo = inner.node().appendChild(startLabelElement);
    const slBox = startLabelElement.getBBox();
    inner.attr("transform", "translate(" + -slBox.width / 2 + ", " + -slBox.height / 2 + ")");
    if (!terminalLabels[edge.id]) {
      terminalLabels[edge.id] = {};
    }
    terminalLabels[edge.id].startLeft = startEdgeLabelLeft;
    setTerminalWidth(fo, edge.startLabelLeft);
  }
  if (edge.startLabelRight) {
    const startLabelElement = createLabel$1(edge.startLabelRight, edge.labelStyle);
    const startEdgeLabelRight = elem.insert("g").attr("class", "edgeTerminals");
    const inner = startEdgeLabelRight.insert("g").attr("class", "inner");
    fo = startEdgeLabelRight.node().appendChild(startLabelElement);
    inner.node().appendChild(startLabelElement);
    const slBox = startLabelElement.getBBox();
    inner.attr("transform", "translate(" + -slBox.width / 2 + ", " + -slBox.height / 2 + ")");
    if (!terminalLabels[edge.id]) {
      terminalLabels[edge.id] = {};
    }
    terminalLabels[edge.id].startRight = startEdgeLabelRight;
    setTerminalWidth(fo, edge.startLabelRight);
  }
  if (edge.endLabelLeft) {
    const endLabelElement = createLabel$1(edge.endLabelLeft, edge.labelStyle);
    const endEdgeLabelLeft = elem.insert("g").attr("class", "edgeTerminals");
    const inner = endEdgeLabelLeft.insert("g").attr("class", "inner");
    fo = inner.node().appendChild(endLabelElement);
    const slBox = endLabelElement.getBBox();
    inner.attr("transform", "translate(" + -slBox.width / 2 + ", " + -slBox.height / 2 + ")");
    endEdgeLabelLeft.node().appendChild(endLabelElement);
    if (!terminalLabels[edge.id]) {
      terminalLabels[edge.id] = {};
    }
    terminalLabels[edge.id].endLeft = endEdgeLabelLeft;
    setTerminalWidth(fo, edge.endLabelLeft);
  }
  if (edge.endLabelRight) {
    const endLabelElement = createLabel$1(edge.endLabelRight, edge.labelStyle);
    const endEdgeLabelRight = elem.insert("g").attr("class", "edgeTerminals");
    const inner = endEdgeLabelRight.insert("g").attr("class", "inner");
    fo = inner.node().appendChild(endLabelElement);
    const slBox = endLabelElement.getBBox();
    inner.attr("transform", "translate(" + -slBox.width / 2 + ", " + -slBox.height / 2 + ")");
    endEdgeLabelRight.node().appendChild(endLabelElement);
    if (!terminalLabels[edge.id]) {
      terminalLabels[edge.id] = {};
    }
    terminalLabels[edge.id].endRight = endEdgeLabelRight;
    setTerminalWidth(fo, edge.endLabelRight);
  }
  return labelElement;
};
function setTerminalWidth(fo, value) {
  if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.htmlLabels && fo) {
    fo.style.width = value.length * 9 + "px";
    fo.style.height = "12px";
  }
}
const positionEdgeLabel = (edge, paths) => {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.debug("Moving label abc88 ", edge.id, edge.label, edgeLabels[edge.id], paths);
  let path = paths.updatedPath ? paths.updatedPath : paths.originalPath;
  const siteConfig = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)();
  const { subGraphTitleTotalMargin } = getSubGraphTitleMargins(siteConfig);
  if (edge.label) {
    const el = edgeLabels[edge.id];
    let x = edge.x;
    let y = edge.y;
    if (path) {
      const pos = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.u.calcLabelPosition(path);
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.debug(
        "Moving label " + edge.label + " from (",
        x,
        ",",
        y,
        ") to (",
        pos.x,
        ",",
        pos.y,
        ") abc88"
      );
      if (paths.updatedPath) {
        x = pos.x;
        y = pos.y;
      }
    }
    el.attr("transform", `translate(${x}, ${y + subGraphTitleTotalMargin / 2})`);
  }
  if (edge.startLabelLeft) {
    const el = terminalLabels[edge.id].startLeft;
    let x = edge.x;
    let y = edge.y;
    if (path) {
      const pos = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.u.calcTerminalLabelPosition(edge.arrowTypeStart ? 10 : 0, "start_left", path);
      x = pos.x;
      y = pos.y;
    }
    el.attr("transform", `translate(${x}, ${y})`);
  }
  if (edge.startLabelRight) {
    const el = terminalLabels[edge.id].startRight;
    let x = edge.x;
    let y = edge.y;
    if (path) {
      const pos = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.u.calcTerminalLabelPosition(
        edge.arrowTypeStart ? 10 : 0,
        "start_right",
        path
      );
      x = pos.x;
      y = pos.y;
    }
    el.attr("transform", `translate(${x}, ${y})`);
  }
  if (edge.endLabelLeft) {
    const el = terminalLabels[edge.id].endLeft;
    let x = edge.x;
    let y = edge.y;
    if (path) {
      const pos = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.u.calcTerminalLabelPosition(edge.arrowTypeEnd ? 10 : 0, "end_left", path);
      x = pos.x;
      y = pos.y;
    }
    el.attr("transform", `translate(${x}, ${y})`);
  }
  if (edge.endLabelRight) {
    const el = terminalLabels[edge.id].endRight;
    let x = edge.x;
    let y = edge.y;
    if (path) {
      const pos = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.u.calcTerminalLabelPosition(edge.arrowTypeEnd ? 10 : 0, "end_right", path);
      x = pos.x;
      y = pos.y;
    }
    el.attr("transform", `translate(${x}, ${y})`);
  }
};
const outsideNode = (node, point2) => {
  const x = node.x;
  const y = node.y;
  const dx = Math.abs(point2.x - x);
  const dy = Math.abs(point2.y - y);
  const w = node.width / 2;
  const h = node.height / 2;
  if (dx >= w || dy >= h) {
    return true;
  }
  return false;
};
const intersection = (node, outsidePoint, insidePoint) => {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.debug(`intersection calc abc89:
  outsidePoint: ${JSON.stringify(outsidePoint)}
  insidePoint : ${JSON.stringify(insidePoint)}
  node        : x:${node.x} y:${node.y} w:${node.width} h:${node.height}`);
  const x = node.x;
  const y = node.y;
  const dx = Math.abs(x - insidePoint.x);
  const w = node.width / 2;
  let r = insidePoint.x < outsidePoint.x ? w - dx : w + dx;
  const h = node.height / 2;
  const Q = Math.abs(outsidePoint.y - insidePoint.y);
  const R = Math.abs(outsidePoint.x - insidePoint.x);
  if (Math.abs(y - outsidePoint.y) * w > Math.abs(x - outsidePoint.x) * h) {
    let q = insidePoint.y < outsidePoint.y ? outsidePoint.y - h - y : y - h - outsidePoint.y;
    r = R * q / Q;
    const res = {
      x: insidePoint.x < outsidePoint.x ? insidePoint.x + r : insidePoint.x - R + r,
      y: insidePoint.y < outsidePoint.y ? insidePoint.y + Q - q : insidePoint.y - Q + q
    };
    if (r === 0) {
      res.x = outsidePoint.x;
      res.y = outsidePoint.y;
    }
    if (R === 0) {
      res.x = outsidePoint.x;
    }
    if (Q === 0) {
      res.y = outsidePoint.y;
    }
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.debug(`abc89 topp/bott calc, Q ${Q}, q ${q}, R ${R}, r ${r}`, res);
    return res;
  } else {
    if (insidePoint.x < outsidePoint.x) {
      r = outsidePoint.x - w - x;
    } else {
      r = x - w - outsidePoint.x;
    }
    let q = Q * r / R;
    let _x = insidePoint.x < outsidePoint.x ? insidePoint.x + R - r : insidePoint.x - R + r;
    let _y = insidePoint.y < outsidePoint.y ? insidePoint.y + q : insidePoint.y - q;
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.debug(`sides calc abc89, Q ${Q}, q ${q}, R ${R}, r ${r}`, { _x, _y });
    if (r === 0) {
      _x = outsidePoint.x;
      _y = outsidePoint.y;
    }
    if (R === 0) {
      _x = outsidePoint.x;
    }
    if (Q === 0) {
      _y = outsidePoint.y;
    }
    return { x: _x, y: _y };
  }
};
const cutPathAtIntersect = (_points, boundaryNode) => {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.debug("abc88 cutPathAtIntersect", _points, boundaryNode);
  let points = [];
  let lastPointOutside = _points[0];
  let isInside = false;
  _points.forEach((point2) => {
    if (!outsideNode(boundaryNode, point2) && !isInside) {
      const inter = intersection(boundaryNode, lastPointOutside, point2);
      let pointPresent = false;
      points.forEach((p) => {
        pointPresent = pointPresent || p.x === inter.x && p.y === inter.y;
      });
      if (!points.some((e) => e.x === inter.x && e.y === inter.y)) {
        points.push(inter);
      }
      isInside = true;
    } else {
      lastPointOutside = point2;
      if (!isInside) {
        points.push(point2);
      }
    }
  });
  return points;
};
const insertEdge = function(elem, e, edge, clusterDb, diagramType, graph, id) {
  let points = edge.points;
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.debug("abc88 InsertEdge: edge=", edge, "e=", e);
  let pointsHasChanged = false;
  const tail = graph.node(e.v);
  var head = graph.node(e.w);
  if ((head == null ? void 0 : head.intersect) && (tail == null ? void 0 : tail.intersect)) {
    points = points.slice(1, edge.points.length - 1);
    points.unshift(tail.intersect(points[0]));
    points.push(head.intersect(points[points.length - 1]));
  }
  if (edge.toCluster) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.debug("to cluster abc88", clusterDb[edge.toCluster]);
    points = cutPathAtIntersect(edge.points, clusterDb[edge.toCluster].node);
    pointsHasChanged = true;
  }
  if (edge.fromCluster) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.debug("from cluster abc88", clusterDb[edge.fromCluster]);
    points = cutPathAtIntersect(points.reverse(), clusterDb[edge.fromCluster].node).reverse();
    pointsHasChanged = true;
  }
  const lineData = points.filter((p) => !Number.isNaN(p.y));
  let curve = d3__WEBPACK_IMPORTED_MODULE_0__.curveBasis;
  if (edge.curve && (diagramType === "graph" || diagramType === "flowchart")) {
    curve = edge.curve;
  }
  const { x, y } = getLineFunctionsWithOffset(edge);
  const lineFunction = (0,d3__WEBPACK_IMPORTED_MODULE_0__.line)().x(x).y(y).curve(curve);
  let strokeClasses;
  switch (edge.thickness) {
    case "normal":
      strokeClasses = "edge-thickness-normal";
      break;
    case "thick":
      strokeClasses = "edge-thickness-thick";
      break;
    case "invisible":
      strokeClasses = "edge-thickness-thick";
      break;
    default:
      strokeClasses = "";
  }
  switch (edge.pattern) {
    case "solid":
      strokeClasses += " edge-pattern-solid";
      break;
    case "dotted":
      strokeClasses += " edge-pattern-dotted";
      break;
    case "dashed":
      strokeClasses += " edge-pattern-dashed";
      break;
  }
  const svgPath = elem.append("path").attr("d", lineFunction(lineData)).attr("id", edge.id).attr("class", " " + strokeClasses + (edge.classes ? " " + edge.classes : "")).attr("style", edge.style);
  let url = "";
  if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().flowchart.arrowMarkerAbsolute || (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().state.arrowMarkerAbsolute) {
    url = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search;
    url = url.replace(/\(/g, "\\(");
    url = url.replace(/\)/g, "\\)");
  }
  addEdgeMarkers(svgPath, edge, url, id, diagramType);
  let paths = {};
  if (pointsHasChanged) {
    paths.updatedPath = points;
  }
  paths.originalPath = edge.points;
  return paths;
};



/***/ }),

/***/ "./node_modules/mermaid/dist/flowDb-4b19a42f.js":
/*!******************************************************!*\
  !*** ./node_modules/mermaid/dist/flowDb-4b19a42f.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   d: function() { return /* binding */ db; },
/* harmony export */   f: function() { return /* binding */ flowDb; },
/* harmony export */   p: function() { return /* binding */ parser$1; }
/* harmony export */ });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "./node_modules/d3/src/index.js");
/* harmony import */ var _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mermaid-f47111a7.js */ "./node_modules/mermaid/dist/mermaid-f47111a7.js");


var parser = function() {
  var o = function(k, v, o2, l) {
    for (o2 = o2 || {}, l = k.length; l--; o2[k[l]] = v)
      ;
    return o2;
  }, $V0 = [1, 4], $V1 = [1, 3], $V2 = [1, 5], $V3 = [1, 8, 9, 10, 11, 27, 34, 36, 38, 42, 58, 81, 82, 83, 84, 85, 86, 99, 102, 103, 106, 108, 111, 112, 113, 118, 119, 120, 121], $V4 = [2, 2], $V5 = [1, 13], $V6 = [1, 14], $V7 = [1, 15], $V8 = [1, 16], $V9 = [1, 23], $Va = [1, 25], $Vb = [1, 26], $Vc = [1, 27], $Vd = [1, 49], $Ve = [1, 48], $Vf = [1, 29], $Vg = [1, 30], $Vh = [1, 31], $Vi = [1, 32], $Vj = [1, 33], $Vk = [1, 44], $Vl = [1, 46], $Vm = [1, 42], $Vn = [1, 47], $Vo = [1, 43], $Vp = [1, 50], $Vq = [1, 45], $Vr = [1, 51], $Vs = [1, 52], $Vt = [1, 34], $Vu = [1, 35], $Vv = [1, 36], $Vw = [1, 37], $Vx = [1, 57], $Vy = [1, 8, 9, 10, 11, 27, 32, 34, 36, 38, 42, 58, 81, 82, 83, 84, 85, 86, 99, 102, 103, 106, 108, 111, 112, 113, 118, 119, 120, 121], $Vz = [1, 61], $VA = [1, 60], $VB = [1, 62], $VC = [8, 9, 11, 73, 75], $VD = [1, 88], $VE = [1, 93], $VF = [1, 92], $VG = [1, 89], $VH = [1, 85], $VI = [1, 91], $VJ = [1, 87], $VK = [1, 94], $VL = [1, 90], $VM = [1, 95], $VN = [1, 86], $VO = [8, 9, 10, 11, 73, 75], $VP = [8, 9, 10, 11, 44, 73, 75], $VQ = [8, 9, 10, 11, 29, 42, 44, 46, 48, 50, 52, 54, 56, 58, 61, 63, 65, 66, 68, 73, 75, 86, 99, 102, 103, 106, 108, 111, 112, 113], $VR = [8, 9, 11, 42, 58, 73, 75, 86, 99, 102, 103, 106, 108, 111, 112, 113], $VS = [42, 58, 86, 99, 102, 103, 106, 108, 111, 112, 113], $VT = [1, 121], $VU = [1, 120], $VV = [1, 128], $VW = [1, 142], $VX = [1, 143], $VY = [1, 144], $VZ = [1, 145], $V_ = [1, 130], $V$ = [1, 132], $V01 = [1, 136], $V11 = [1, 137], $V21 = [1, 138], $V31 = [1, 139], $V41 = [1, 140], $V51 = [1, 141], $V61 = [1, 146], $V71 = [1, 147], $V81 = [1, 126], $V91 = [1, 127], $Va1 = [1, 134], $Vb1 = [1, 129], $Vc1 = [1, 133], $Vd1 = [1, 131], $Ve1 = [8, 9, 10, 11, 27, 32, 34, 36, 38, 42, 58, 81, 82, 83, 84, 85, 86, 99, 102, 103, 106, 108, 111, 112, 113, 118, 119, 120, 121], $Vf1 = [1, 149], $Vg1 = [8, 9, 11], $Vh1 = [8, 9, 10, 11, 14, 42, 58, 86, 102, 103, 106, 108, 111, 112, 113], $Vi1 = [1, 169], $Vj1 = [1, 165], $Vk1 = [1, 166], $Vl1 = [1, 170], $Vm1 = [1, 167], $Vn1 = [1, 168], $Vo1 = [75, 113, 116], $Vp1 = [8, 9, 10, 11, 12, 14, 27, 29, 32, 42, 58, 73, 81, 82, 83, 84, 85, 86, 87, 102, 106, 108, 111, 112, 113], $Vq1 = [10, 103], $Vr1 = [31, 47, 49, 51, 53, 55, 60, 62, 64, 65, 67, 69, 113, 114, 115], $Vs1 = [1, 235], $Vt1 = [1, 233], $Vu1 = [1, 237], $Vv1 = [1, 231], $Vw1 = [1, 232], $Vx1 = [1, 234], $Vy1 = [1, 236], $Vz1 = [1, 238], $VA1 = [1, 255], $VB1 = [8, 9, 11, 103], $VC1 = [8, 9, 10, 11, 58, 81, 102, 103, 106, 107, 108, 109];
  var parser2 = {
    trace: function trace() {
    },
    yy: {},
    symbols_: { "error": 2, "start": 3, "graphConfig": 4, "document": 5, "line": 6, "statement": 7, "SEMI": 8, "NEWLINE": 9, "SPACE": 10, "EOF": 11, "GRAPH": 12, "NODIR": 13, "DIR": 14, "FirstStmtSeparator": 15, "ending": 16, "endToken": 17, "spaceList": 18, "spaceListNewline": 19, "vertexStatement": 20, "separator": 21, "styleStatement": 22, "linkStyleStatement": 23, "classDefStatement": 24, "classStatement": 25, "clickStatement": 26, "subgraph": 27, "textNoTags": 28, "SQS": 29, "text": 30, "SQE": 31, "end": 32, "direction": 33, "acc_title": 34, "acc_title_value": 35, "acc_descr": 36, "acc_descr_value": 37, "acc_descr_multiline_value": 38, "link": 39, "node": 40, "styledVertex": 41, "AMP": 42, "vertex": 43, "STYLE_SEPARATOR": 44, "idString": 45, "DOUBLECIRCLESTART": 46, "DOUBLECIRCLEEND": 47, "PS": 48, "PE": 49, "(-": 50, "-)": 51, "STADIUMSTART": 52, "STADIUMEND": 53, "SUBROUTINESTART": 54, "SUBROUTINEEND": 55, "VERTEX_WITH_PROPS_START": 56, "NODE_STRING[field]": 57, "COLON": 58, "NODE_STRING[value]": 59, "PIPE": 60, "CYLINDERSTART": 61, "CYLINDEREND": 62, "DIAMOND_START": 63, "DIAMOND_STOP": 64, "TAGEND": 65, "TRAPSTART": 66, "TRAPEND": 67, "INVTRAPSTART": 68, "INVTRAPEND": 69, "linkStatement": 70, "arrowText": 71, "TESTSTR": 72, "START_LINK": 73, "edgeText": 74, "LINK": 75, "edgeTextToken": 76, "STR": 77, "MD_STR": 78, "textToken": 79, "keywords": 80, "STYLE": 81, "LINKSTYLE": 82, "CLASSDEF": 83, "CLASS": 84, "CLICK": 85, "DOWN": 86, "UP": 87, "textNoTagsToken": 88, "stylesOpt": 89, "idString[vertex]": 90, "idString[class]": 91, "CALLBACKNAME": 92, "CALLBACKARGS": 93, "HREF": 94, "LINK_TARGET": 95, "STR[link]": 96, "STR[tooltip]": 97, "alphaNum": 98, "DEFAULT": 99, "numList": 100, "INTERPOLATE": 101, "NUM": 102, "COMMA": 103, "style": 104, "styleComponent": 105, "NODE_STRING": 106, "UNIT": 107, "BRKT": 108, "PCT": 109, "idStringToken": 110, "MINUS": 111, "MULT": 112, "UNICODE_TEXT": 113, "TEXT": 114, "TAGSTART": 115, "EDGE_TEXT": 116, "alphaNumToken": 117, "direction_tb": 118, "direction_bt": 119, "direction_rl": 120, "direction_lr": 121, "$accept": 0, "$end": 1 },
    terminals_: { 2: "error", 8: "SEMI", 9: "NEWLINE", 10: "SPACE", 11: "EOF", 12: "GRAPH", 13: "NODIR", 14: "DIR", 27: "subgraph", 29: "SQS", 31: "SQE", 32: "end", 34: "acc_title", 35: "acc_title_value", 36: "acc_descr", 37: "acc_descr_value", 38: "acc_descr_multiline_value", 42: "AMP", 44: "STYLE_SEPARATOR", 46: "DOUBLECIRCLESTART", 47: "DOUBLECIRCLEEND", 48: "PS", 49: "PE", 50: "(-", 51: "-)", 52: "STADIUMSTART", 53: "STADIUMEND", 54: "SUBROUTINESTART", 55: "SUBROUTINEEND", 56: "VERTEX_WITH_PROPS_START", 57: "NODE_STRING[field]", 58: "COLON", 59: "NODE_STRING[value]", 60: "PIPE", 61: "CYLINDERSTART", 62: "CYLINDEREND", 63: "DIAMOND_START", 64: "DIAMOND_STOP", 65: "TAGEND", 66: "TRAPSTART", 67: "TRAPEND", 68: "INVTRAPSTART", 69: "INVTRAPEND", 72: "TESTSTR", 73: "START_LINK", 75: "LINK", 77: "STR", 78: "MD_STR", 81: "STYLE", 82: "LINKSTYLE", 83: "CLASSDEF", 84: "CLASS", 85: "CLICK", 86: "DOWN", 87: "UP", 90: "idString[vertex]", 91: "idString[class]", 92: "CALLBACKNAME", 93: "CALLBACKARGS", 94: "HREF", 95: "LINK_TARGET", 96: "STR[link]", 97: "STR[tooltip]", 99: "DEFAULT", 101: "INTERPOLATE", 102: "NUM", 103: "COMMA", 106: "NODE_STRING", 107: "UNIT", 108: "BRKT", 109: "PCT", 111: "MINUS", 112: "MULT", 113: "UNICODE_TEXT", 114: "TEXT", 115: "TAGSTART", 116: "EDGE_TEXT", 118: "direction_tb", 119: "direction_bt", 120: "direction_rl", 121: "direction_lr" },
    productions_: [0, [3, 2], [5, 0], [5, 2], [6, 1], [6, 1], [6, 1], [6, 1], [6, 1], [4, 2], [4, 2], [4, 2], [4, 3], [16, 2], [16, 1], [17, 1], [17, 1], [17, 1], [15, 1], [15, 1], [15, 2], [19, 2], [19, 2], [19, 1], [19, 1], [18, 2], [18, 1], [7, 2], [7, 2], [7, 2], [7, 2], [7, 2], [7, 2], [7, 9], [7, 6], [7, 4], [7, 1], [7, 2], [7, 2], [7, 1], [21, 1], [21, 1], [21, 1], [20, 3], [20, 4], [20, 2], [20, 1], [40, 1], [40, 5], [41, 1], [41, 3], [43, 4], [43, 4], [43, 6], [43, 4], [43, 4], [43, 4], [43, 8], [43, 4], [43, 4], [43, 4], [43, 6], [43, 4], [43, 4], [43, 4], [43, 4], [43, 4], [43, 1], [39, 2], [39, 3], [39, 3], [39, 1], [39, 3], [74, 1], [74, 2], [74, 1], [74, 1], [70, 1], [71, 3], [30, 1], [30, 2], [30, 1], [30, 1], [80, 1], [80, 1], [80, 1], [80, 1], [80, 1], [80, 1], [80, 1], [80, 1], [80, 1], [80, 1], [80, 1], [28, 1], [28, 2], [28, 1], [28, 1], [24, 5], [25, 5], [26, 2], [26, 4], [26, 3], [26, 5], [26, 3], [26, 5], [26, 5], [26, 7], [26, 2], [26, 4], [26, 2], [26, 4], [26, 4], [26, 6], [22, 5], [23, 5], [23, 5], [23, 9], [23, 9], [23, 7], [23, 7], [100, 1], [100, 3], [89, 1], [89, 3], [104, 1], [104, 2], [105, 1], [105, 1], [105, 1], [105, 1], [105, 1], [105, 1], [105, 1], [105, 1], [110, 1], [110, 1], [110, 1], [110, 1], [110, 1], [110, 1], [110, 1], [110, 1], [110, 1], [110, 1], [110, 1], [79, 1], [79, 1], [79, 1], [79, 1], [88, 1], [88, 1], [88, 1], [88, 1], [88, 1], [88, 1], [88, 1], [88, 1], [88, 1], [88, 1], [88, 1], [76, 1], [76, 1], [117, 1], [117, 1], [117, 1], [117, 1], [117, 1], [117, 1], [117, 1], [117, 1], [117, 1], [117, 1], [117, 1], [45, 1], [45, 2], [98, 1], [98, 2], [33, 1], [33, 1], [33, 1], [33, 1]],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
      var $0 = $$.length - 1;
      switch (yystate) {
        case 2:
          this.$ = [];
          break;
        case 3:
          if (!Array.isArray($$[$0]) || $$[$0].length > 0) {
            $$[$0 - 1].push($$[$0]);
          }
          this.$ = $$[$0 - 1];
          break;
        case 4:
        case 176:
          this.$ = $$[$0];
          break;
        case 11:
          yy.setDirection("TB");
          this.$ = "TB";
          break;
        case 12:
          yy.setDirection($$[$0 - 1]);
          this.$ = $$[$0 - 1];
          break;
        case 27:
          this.$ = $$[$0 - 1].nodes;
          break;
        case 28:
        case 29:
        case 30:
        case 31:
        case 32:
          this.$ = [];
          break;
        case 33:
          this.$ = yy.addSubGraph($$[$0 - 6], $$[$0 - 1], $$[$0 - 4]);
          break;
        case 34:
          this.$ = yy.addSubGraph($$[$0 - 3], $$[$0 - 1], $$[$0 - 3]);
          break;
        case 35:
          this.$ = yy.addSubGraph(void 0, $$[$0 - 1], void 0);
          break;
        case 37:
          this.$ = $$[$0].trim();
          yy.setAccTitle(this.$);
          break;
        case 38:
        case 39:
          this.$ = $$[$0].trim();
          yy.setAccDescription(this.$);
          break;
        case 43:
          yy.addLink($$[$0 - 2].stmt, $$[$0], $$[$0 - 1]);
          this.$ = { stmt: $$[$0], nodes: $$[$0].concat($$[$0 - 2].nodes) };
          break;
        case 44:
          yy.addLink($$[$0 - 3].stmt, $$[$0 - 1], $$[$0 - 2]);
          this.$ = { stmt: $$[$0 - 1], nodes: $$[$0 - 1].concat($$[$0 - 3].nodes) };
          break;
        case 45:
          this.$ = { stmt: $$[$0 - 1], nodes: $$[$0 - 1] };
          break;
        case 46:
          this.$ = { stmt: $$[$0], nodes: $$[$0] };
          break;
        case 47:
          this.$ = [$$[$0]];
          break;
        case 48:
          this.$ = $$[$0 - 4].concat($$[$0]);
          break;
        case 49:
          this.$ = $$[$0];
          break;
        case 50:
          this.$ = $$[$0 - 2];
          yy.setClass($$[$0 - 2], $$[$0]);
          break;
        case 51:
          this.$ = $$[$0 - 3];
          yy.addVertex($$[$0 - 3], $$[$0 - 1], "square");
          break;
        case 52:
          this.$ = $$[$0 - 3];
          yy.addVertex($$[$0 - 3], $$[$0 - 1], "doublecircle");
          break;
        case 53:
          this.$ = $$[$0 - 5];
          yy.addVertex($$[$0 - 5], $$[$0 - 2], "circle");
          break;
        case 54:
          this.$ = $$[$0 - 3];
          yy.addVertex($$[$0 - 3], $$[$0 - 1], "ellipse");
          break;
        case 55:
          this.$ = $$[$0 - 3];
          yy.addVertex($$[$0 - 3], $$[$0 - 1], "stadium");
          break;
        case 56:
          this.$ = $$[$0 - 3];
          yy.addVertex($$[$0 - 3], $$[$0 - 1], "subroutine");
          break;
        case 57:
          this.$ = $$[$0 - 7];
          yy.addVertex($$[$0 - 7], $$[$0 - 1], "rect", void 0, void 0, void 0, Object.fromEntries([[$$[$0 - 5], $$[$0 - 3]]]));
          break;
        case 58:
          this.$ = $$[$0 - 3];
          yy.addVertex($$[$0 - 3], $$[$0 - 1], "cylinder");
          break;
        case 59:
          this.$ = $$[$0 - 3];
          yy.addVertex($$[$0 - 3], $$[$0 - 1], "round");
          break;
        case 60:
          this.$ = $$[$0 - 3];
          yy.addVertex($$[$0 - 3], $$[$0 - 1], "diamond");
          break;
        case 61:
          this.$ = $$[$0 - 5];
          yy.addVertex($$[$0 - 5], $$[$0 - 2], "hexagon");
          break;
        case 62:
          this.$ = $$[$0 - 3];
          yy.addVertex($$[$0 - 3], $$[$0 - 1], "odd");
          break;
        case 63:
          this.$ = $$[$0 - 3];
          yy.addVertex($$[$0 - 3], $$[$0 - 1], "trapezoid");
          break;
        case 64:
          this.$ = $$[$0 - 3];
          yy.addVertex($$[$0 - 3], $$[$0 - 1], "inv_trapezoid");
          break;
        case 65:
          this.$ = $$[$0 - 3];
          yy.addVertex($$[$0 - 3], $$[$0 - 1], "lean_right");
          break;
        case 66:
          this.$ = $$[$0 - 3];
          yy.addVertex($$[$0 - 3], $$[$0 - 1], "lean_left");
          break;
        case 67:
          this.$ = $$[$0];
          yy.addVertex($$[$0]);
          break;
        case 68:
          $$[$0 - 1].text = $$[$0];
          this.$ = $$[$0 - 1];
          break;
        case 69:
        case 70:
          $$[$0 - 2].text = $$[$0 - 1];
          this.$ = $$[$0 - 2];
          break;
        case 71:
          this.$ = $$[$0];
          break;
        case 72:
          var inf = yy.destructLink($$[$0], $$[$0 - 2]);
          this.$ = { "type": inf.type, "stroke": inf.stroke, "length": inf.length, "text": $$[$0 - 1] };
          break;
        case 73:
          this.$ = { text: $$[$0], type: "text" };
          break;
        case 74:
          this.$ = { text: $$[$0 - 1].text + "" + $$[$0], type: $$[$0 - 1].type };
          break;
        case 75:
          this.$ = { text: $$[$0], type: "string" };
          break;
        case 76:
          this.$ = { text: $$[$0], type: "markdown" };
          break;
        case 77:
          var inf = yy.destructLink($$[$0]);
          this.$ = { "type": inf.type, "stroke": inf.stroke, "length": inf.length };
          break;
        case 78:
          this.$ = $$[$0 - 1];
          break;
        case 79:
          this.$ = { text: $$[$0], type: "text" };
          break;
        case 80:
          this.$ = { text: $$[$0 - 1].text + "" + $$[$0], type: $$[$0 - 1].type };
          break;
        case 81:
          this.$ = { text: $$[$0], type: "string" };
          break;
        case 82:
        case 97:
          this.$ = { text: $$[$0], type: "markdown" };
          break;
        case 94:
          this.$ = { text: $$[$0], type: "text" };
          break;
        case 95:
          this.$ = { text: $$[$0 - 1].text + "" + $$[$0], type: $$[$0 - 1].type };
          break;
        case 96:
          this.$ = { text: $$[$0], type: "text" };
          break;
        case 98:
          this.$ = $$[$0 - 4];
          yy.addClass($$[$0 - 2], $$[$0]);
          break;
        case 99:
          this.$ = $$[$0 - 4];
          yy.setClass($$[$0 - 2], $$[$0]);
          break;
        case 100:
        case 108:
          this.$ = $$[$0 - 1];
          yy.setClickEvent($$[$0 - 1], $$[$0]);
          break;
        case 101:
        case 109:
          this.$ = $$[$0 - 3];
          yy.setClickEvent($$[$0 - 3], $$[$0 - 2]);
          yy.setTooltip($$[$0 - 3], $$[$0]);
          break;
        case 102:
          this.$ = $$[$0 - 2];
          yy.setClickEvent($$[$0 - 2], $$[$0 - 1], $$[$0]);
          break;
        case 103:
          this.$ = $$[$0 - 4];
          yy.setClickEvent($$[$0 - 4], $$[$0 - 3], $$[$0 - 2]);
          yy.setTooltip($$[$0 - 4], $$[$0]);
          break;
        case 104:
          this.$ = $$[$0 - 2];
          yy.setLink($$[$0 - 2], $$[$0]);
          break;
        case 105:
          this.$ = $$[$0 - 4];
          yy.setLink($$[$0 - 4], $$[$0 - 2]);
          yy.setTooltip($$[$0 - 4], $$[$0]);
          break;
        case 106:
          this.$ = $$[$0 - 4];
          yy.setLink($$[$0 - 4], $$[$0 - 2], $$[$0]);
          break;
        case 107:
          this.$ = $$[$0 - 6];
          yy.setLink($$[$0 - 6], $$[$0 - 4], $$[$0]);
          yy.setTooltip($$[$0 - 6], $$[$0 - 2]);
          break;
        case 110:
          this.$ = $$[$0 - 1];
          yy.setLink($$[$0 - 1], $$[$0]);
          break;
        case 111:
          this.$ = $$[$0 - 3];
          yy.setLink($$[$0 - 3], $$[$0 - 2]);
          yy.setTooltip($$[$0 - 3], $$[$0]);
          break;
        case 112:
          this.$ = $$[$0 - 3];
          yy.setLink($$[$0 - 3], $$[$0 - 2], $$[$0]);
          break;
        case 113:
          this.$ = $$[$0 - 5];
          yy.setLink($$[$0 - 5], $$[$0 - 4], $$[$0]);
          yy.setTooltip($$[$0 - 5], $$[$0 - 2]);
          break;
        case 114:
          this.$ = $$[$0 - 4];
          yy.addVertex($$[$0 - 2], void 0, void 0, $$[$0]);
          break;
        case 115:
          this.$ = $$[$0 - 4];
          yy.updateLink([$$[$0 - 2]], $$[$0]);
          break;
        case 116:
          this.$ = $$[$0 - 4];
          yy.updateLink($$[$0 - 2], $$[$0]);
          break;
        case 117:
          this.$ = $$[$0 - 8];
          yy.updateLinkInterpolate([$$[$0 - 6]], $$[$0 - 2]);
          yy.updateLink([$$[$0 - 6]], $$[$0]);
          break;
        case 118:
          this.$ = $$[$0 - 8];
          yy.updateLinkInterpolate($$[$0 - 6], $$[$0 - 2]);
          yy.updateLink($$[$0 - 6], $$[$0]);
          break;
        case 119:
          this.$ = $$[$0 - 6];
          yy.updateLinkInterpolate([$$[$0 - 4]], $$[$0]);
          break;
        case 120:
          this.$ = $$[$0 - 6];
          yy.updateLinkInterpolate($$[$0 - 4], $$[$0]);
          break;
        case 121:
        case 123:
          this.$ = [$$[$0]];
          break;
        case 122:
        case 124:
          $$[$0 - 2].push($$[$0]);
          this.$ = $$[$0 - 2];
          break;
        case 126:
          this.$ = $$[$0 - 1] + $$[$0];
          break;
        case 174:
          this.$ = $$[$0];
          break;
        case 175:
          this.$ = $$[$0 - 1] + "" + $$[$0];
          break;
        case 177:
          this.$ = $$[$0 - 1] + "" + $$[$0];
          break;
        case 178:
          this.$ = { stmt: "dir", value: "TB" };
          break;
        case 179:
          this.$ = { stmt: "dir", value: "BT" };
          break;
        case 180:
          this.$ = { stmt: "dir", value: "RL" };
          break;
        case 181:
          this.$ = { stmt: "dir", value: "LR" };
          break;
      }
    },
    table: [{ 3: 1, 4: 2, 9: $V0, 10: $V1, 12: $V2 }, { 1: [3] }, o($V3, $V4, { 5: 6 }), { 4: 7, 9: $V0, 10: $V1, 12: $V2 }, { 4: 8, 9: $V0, 10: $V1, 12: $V2 }, { 13: [1, 9], 14: [1, 10] }, { 1: [2, 1], 6: 11, 7: 12, 8: $V5, 9: $V6, 10: $V7, 11: $V8, 20: 17, 22: 18, 23: 19, 24: 20, 25: 21, 26: 22, 27: $V9, 33: 24, 34: $Va, 36: $Vb, 38: $Vc, 40: 28, 41: 38, 42: $Vd, 43: 39, 45: 40, 58: $Ve, 81: $Vf, 82: $Vg, 83: $Vh, 84: $Vi, 85: $Vj, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 110: 41, 111: $Vq, 112: $Vr, 113: $Vs, 118: $Vt, 119: $Vu, 120: $Vv, 121: $Vw }, o($V3, [2, 9]), o($V3, [2, 10]), o($V3, [2, 11]), { 8: [1, 54], 9: [1, 55], 10: $Vx, 15: 53, 18: 56 }, o($Vy, [2, 3]), o($Vy, [2, 4]), o($Vy, [2, 5]), o($Vy, [2, 6]), o($Vy, [2, 7]), o($Vy, [2, 8]), { 8: $Vz, 9: $VA, 11: $VB, 21: 58, 39: 59, 70: 63, 73: [1, 64], 75: [1, 65] }, { 8: $Vz, 9: $VA, 11: $VB, 21: 66 }, { 8: $Vz, 9: $VA, 11: $VB, 21: 67 }, { 8: $Vz, 9: $VA, 11: $VB, 21: 68 }, { 8: $Vz, 9: $VA, 11: $VB, 21: 69 }, { 8: $Vz, 9: $VA, 11: $VB, 21: 70 }, { 8: $Vz, 9: $VA, 10: [1, 71], 11: $VB, 21: 72 }, o($Vy, [2, 36]), { 35: [1, 73] }, { 37: [1, 74] }, o($Vy, [2, 39]), o($VC, [2, 46], { 18: 75, 10: $Vx }), { 10: [1, 76] }, { 10: [1, 77] }, { 10: [1, 78] }, { 10: [1, 79] }, { 14: $VD, 42: $VE, 58: $VF, 77: [1, 83], 86: $VG, 92: [1, 80], 94: [1, 81], 98: 82, 102: $VH, 103: $VI, 106: $VJ, 108: $VK, 111: $VL, 112: $VM, 113: $VN, 117: 84 }, o($Vy, [2, 178]), o($Vy, [2, 179]), o($Vy, [2, 180]), o($Vy, [2, 181]), o($VO, [2, 47]), o($VO, [2, 49], { 44: [1, 96] }), o($VP, [2, 67], { 110: 109, 29: [1, 97], 42: $Vd, 46: [1, 98], 48: [1, 99], 50: [1, 100], 52: [1, 101], 54: [1, 102], 56: [1, 103], 58: $Ve, 61: [1, 104], 63: [1, 105], 65: [1, 106], 66: [1, 107], 68: [1, 108], 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 111: $Vq, 112: $Vr, 113: $Vs }), o($VQ, [2, 174]), o($VQ, [2, 135]), o($VQ, [2, 136]), o($VQ, [2, 137]), o($VQ, [2, 138]), o($VQ, [2, 139]), o($VQ, [2, 140]), o($VQ, [2, 141]), o($VQ, [2, 142]), o($VQ, [2, 143]), o($VQ, [2, 144]), o($VQ, [2, 145]), o($V3, [2, 12]), o($V3, [2, 18]), o($V3, [2, 19]), { 9: [1, 110] }, o($VR, [2, 26], { 18: 111, 10: $Vx }), o($Vy, [2, 27]), { 40: 112, 41: 38, 42: $Vd, 43: 39, 45: 40, 58: $Ve, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 110: 41, 111: $Vq, 112: $Vr, 113: $Vs }, o($Vy, [2, 40]), o($Vy, [2, 41]), o($Vy, [2, 42]), o($VS, [2, 71], { 71: 113, 60: [1, 115], 72: [1, 114] }), { 74: 116, 76: 117, 77: [1, 118], 78: [1, 119], 113: $VT, 116: $VU }, o([42, 58, 60, 72, 86, 99, 102, 103, 106, 108, 111, 112, 113], [2, 77]), o($Vy, [2, 28]), o($Vy, [2, 29]), o($Vy, [2, 30]), o($Vy, [2, 31]), o($Vy, [2, 32]), { 10: $VV, 12: $VW, 14: $VX, 27: $VY, 28: 122, 32: $VZ, 42: $V_, 58: $V$, 73: $V01, 77: [1, 124], 78: [1, 125], 80: 135, 81: $V11, 82: $V21, 83: $V31, 84: $V41, 85: $V51, 86: $V61, 87: $V71, 88: 123, 102: $V81, 106: $V91, 108: $Va1, 111: $Vb1, 112: $Vc1, 113: $Vd1 }, o($Ve1, $V4, { 5: 148 }), o($Vy, [2, 37]), o($Vy, [2, 38]), o($VC, [2, 45], { 42: $Vf1 }), { 42: $Vd, 45: 150, 58: $Ve, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 110: 41, 111: $Vq, 112: $Vr, 113: $Vs }, { 99: [1, 151], 100: 152, 102: [1, 153] }, { 42: $Vd, 45: 154, 58: $Ve, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 110: 41, 111: $Vq, 112: $Vr, 113: $Vs }, { 42: $Vd, 45: 155, 58: $Ve, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 110: 41, 111: $Vq, 112: $Vr, 113: $Vs }, o($Vg1, [2, 100], { 10: [1, 156], 93: [1, 157] }), { 77: [1, 158] }, o($Vg1, [2, 108], { 117: 160, 10: [1, 159], 14: $VD, 42: $VE, 58: $VF, 86: $VG, 102: $VH, 103: $VI, 106: $VJ, 108: $VK, 111: $VL, 112: $VM, 113: $VN }), o($Vg1, [2, 110], { 10: [1, 161] }), o($Vh1, [2, 176]), o($Vh1, [2, 163]), o($Vh1, [2, 164]), o($Vh1, [2, 165]), o($Vh1, [2, 166]), o($Vh1, [2, 167]), o($Vh1, [2, 168]), o($Vh1, [2, 169]), o($Vh1, [2, 170]), o($Vh1, [2, 171]), o($Vh1, [2, 172]), o($Vh1, [2, 173]), { 42: $Vd, 45: 162, 58: $Ve, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 110: 41, 111: $Vq, 112: $Vr, 113: $Vs }, { 30: 163, 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 30: 171, 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 30: 173, 48: [1, 172], 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 30: 174, 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 30: 175, 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 30: 176, 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 106: [1, 177] }, { 30: 178, 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 30: 179, 63: [1, 180], 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 30: 181, 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 30: 182, 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 30: 183, 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, o($VQ, [2, 175]), o($V3, [2, 20]), o($VR, [2, 25]), o($VC, [2, 43], { 18: 184, 10: $Vx }), o($VS, [2, 68], { 10: [1, 185] }), { 10: [1, 186] }, { 30: 187, 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 75: [1, 188], 76: 189, 113: $VT, 116: $VU }, o($Vo1, [2, 73]), o($Vo1, [2, 75]), o($Vo1, [2, 76]), o($Vo1, [2, 161]), o($Vo1, [2, 162]), { 8: $Vz, 9: $VA, 10: $VV, 11: $VB, 12: $VW, 14: $VX, 21: 191, 27: $VY, 29: [1, 190], 32: $VZ, 42: $V_, 58: $V$, 73: $V01, 80: 135, 81: $V11, 82: $V21, 83: $V31, 84: $V41, 85: $V51, 86: $V61, 87: $V71, 88: 192, 102: $V81, 106: $V91, 108: $Va1, 111: $Vb1, 112: $Vc1, 113: $Vd1 }, o($Vp1, [2, 94]), o($Vp1, [2, 96]), o($Vp1, [2, 97]), o($Vp1, [2, 150]), o($Vp1, [2, 151]), o($Vp1, [2, 152]), o($Vp1, [2, 153]), o($Vp1, [2, 154]), o($Vp1, [2, 155]), o($Vp1, [2, 156]), o($Vp1, [2, 157]), o($Vp1, [2, 158]), o($Vp1, [2, 159]), o($Vp1, [2, 160]), o($Vp1, [2, 83]), o($Vp1, [2, 84]), o($Vp1, [2, 85]), o($Vp1, [2, 86]), o($Vp1, [2, 87]), o($Vp1, [2, 88]), o($Vp1, [2, 89]), o($Vp1, [2, 90]), o($Vp1, [2, 91]), o($Vp1, [2, 92]), o($Vp1, [2, 93]), { 6: 11, 7: 12, 8: $V5, 9: $V6, 10: $V7, 11: $V8, 20: 17, 22: 18, 23: 19, 24: 20, 25: 21, 26: 22, 27: $V9, 32: [1, 193], 33: 24, 34: $Va, 36: $Vb, 38: $Vc, 40: 28, 41: 38, 42: $Vd, 43: 39, 45: 40, 58: $Ve, 81: $Vf, 82: $Vg, 83: $Vh, 84: $Vi, 85: $Vj, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 110: 41, 111: $Vq, 112: $Vr, 113: $Vs, 118: $Vt, 119: $Vu, 120: $Vv, 121: $Vw }, { 10: $Vx, 18: 194 }, { 10: [1, 195], 42: $Vd, 58: $Ve, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 110: 109, 111: $Vq, 112: $Vr, 113: $Vs }, { 10: [1, 196] }, { 10: [1, 197], 103: [1, 198] }, o($Vq1, [2, 121]), { 10: [1, 199], 42: $Vd, 58: $Ve, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 110: 109, 111: $Vq, 112: $Vr, 113: $Vs }, { 10: [1, 200], 42: $Vd, 58: $Ve, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 110: 109, 111: $Vq, 112: $Vr, 113: $Vs }, { 77: [1, 201] }, o($Vg1, [2, 102], { 10: [1, 202] }), o($Vg1, [2, 104], { 10: [1, 203] }), { 77: [1, 204] }, o($Vh1, [2, 177]), { 77: [1, 205], 95: [1, 206] }, o($VO, [2, 50], { 110: 109, 42: $Vd, 58: $Ve, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 111: $Vq, 112: $Vr, 113: $Vs }), { 31: [1, 207], 65: $Vi1, 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, o($Vr1, [2, 79]), o($Vr1, [2, 81]), o($Vr1, [2, 82]), o($Vr1, [2, 146]), o($Vr1, [2, 147]), o($Vr1, [2, 148]), o($Vr1, [2, 149]), { 47: [1, 209], 65: $Vi1, 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 30: 210, 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 49: [1, 211], 65: $Vi1, 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 51: [1, 212], 65: $Vi1, 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 53: [1, 213], 65: $Vi1, 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 55: [1, 214], 65: $Vi1, 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 58: [1, 215] }, { 62: [1, 216], 65: $Vi1, 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 64: [1, 217], 65: $Vi1, 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 30: 218, 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 31: [1, 219], 65: $Vi1, 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 65: $Vi1, 67: [1, 220], 69: [1, 221], 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 65: $Vi1, 67: [1, 223], 69: [1, 222], 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, o($VC, [2, 44], { 42: $Vf1 }), o($VS, [2, 70]), o($VS, [2, 69]), { 60: [1, 224], 65: $Vi1, 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, o($VS, [2, 72]), o($Vo1, [2, 74]), { 30: 225, 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, o($Ve1, $V4, { 5: 226 }), o($Vp1, [2, 95]), o($Vy, [2, 35]), { 41: 227, 42: $Vd, 43: 39, 45: 40, 58: $Ve, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 110: 41, 111: $Vq, 112: $Vr, 113: $Vs }, { 10: $Vs1, 58: $Vt1, 81: $Vu1, 89: 228, 102: $Vv1, 104: 229, 105: 230, 106: $Vw1, 107: $Vx1, 108: $Vy1, 109: $Vz1 }, { 10: $Vs1, 58: $Vt1, 81: $Vu1, 89: 239, 101: [1, 240], 102: $Vv1, 104: 229, 105: 230, 106: $Vw1, 107: $Vx1, 108: $Vy1, 109: $Vz1 }, { 10: $Vs1, 58: $Vt1, 81: $Vu1, 89: 241, 101: [1, 242], 102: $Vv1, 104: 229, 105: 230, 106: $Vw1, 107: $Vx1, 108: $Vy1, 109: $Vz1 }, { 102: [1, 243] }, { 10: $Vs1, 58: $Vt1, 81: $Vu1, 89: 244, 102: $Vv1, 104: 229, 105: 230, 106: $Vw1, 107: $Vx1, 108: $Vy1, 109: $Vz1 }, { 42: $Vd, 45: 245, 58: $Ve, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 110: 41, 111: $Vq, 112: $Vr, 113: $Vs }, o($Vg1, [2, 101]), { 77: [1, 246] }, { 77: [1, 247], 95: [1, 248] }, o($Vg1, [2, 109]), o($Vg1, [2, 111], { 10: [1, 249] }), o($Vg1, [2, 112]), o($VP, [2, 51]), o($Vr1, [2, 80]), o($VP, [2, 52]), { 49: [1, 250], 65: $Vi1, 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, o($VP, [2, 59]), o($VP, [2, 54]), o($VP, [2, 55]), o($VP, [2, 56]), { 106: [1, 251] }, o($VP, [2, 58]), o($VP, [2, 60]), { 64: [1, 252], 65: $Vi1, 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, o($VP, [2, 62]), o($VP, [2, 63]), o($VP, [2, 65]), o($VP, [2, 64]), o($VP, [2, 66]), o([10, 42, 58, 86, 99, 102, 103, 106, 108, 111, 112, 113], [2, 78]), { 31: [1, 253], 65: $Vi1, 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 6: 11, 7: 12, 8: $V5, 9: $V6, 10: $V7, 11: $V8, 20: 17, 22: 18, 23: 19, 24: 20, 25: 21, 26: 22, 27: $V9, 32: [1, 254], 33: 24, 34: $Va, 36: $Vb, 38: $Vc, 40: 28, 41: 38, 42: $Vd, 43: 39, 45: 40, 58: $Ve, 81: $Vf, 82: $Vg, 83: $Vh, 84: $Vi, 85: $Vj, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 110: 41, 111: $Vq, 112: $Vr, 113: $Vs, 118: $Vt, 119: $Vu, 120: $Vv, 121: $Vw }, o($VO, [2, 48]), o($Vg1, [2, 114], { 103: $VA1 }), o($VB1, [2, 123], { 105: 256, 10: $Vs1, 58: $Vt1, 81: $Vu1, 102: $Vv1, 106: $Vw1, 107: $Vx1, 108: $Vy1, 109: $Vz1 }), o($VC1, [2, 125]), o($VC1, [2, 127]), o($VC1, [2, 128]), o($VC1, [2, 129]), o($VC1, [2, 130]), o($VC1, [2, 131]), o($VC1, [2, 132]), o($VC1, [2, 133]), o($VC1, [2, 134]), o($Vg1, [2, 115], { 103: $VA1 }), { 10: [1, 257] }, o($Vg1, [2, 116], { 103: $VA1 }), { 10: [1, 258] }, o($Vq1, [2, 122]), o($Vg1, [2, 98], { 103: $VA1 }), o($Vg1, [2, 99], { 110: 109, 42: $Vd, 58: $Ve, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 111: $Vq, 112: $Vr, 113: $Vs }), o($Vg1, [2, 103]), o($Vg1, [2, 105], { 10: [1, 259] }), o($Vg1, [2, 106]), { 95: [1, 260] }, { 49: [1, 261] }, { 60: [1, 262] }, { 64: [1, 263] }, { 8: $Vz, 9: $VA, 11: $VB, 21: 264 }, o($Vy, [2, 34]), { 10: $Vs1, 58: $Vt1, 81: $Vu1, 102: $Vv1, 104: 265, 105: 230, 106: $Vw1, 107: $Vx1, 108: $Vy1, 109: $Vz1 }, o($VC1, [2, 126]), { 14: $VD, 42: $VE, 58: $VF, 86: $VG, 98: 266, 102: $VH, 103: $VI, 106: $VJ, 108: $VK, 111: $VL, 112: $VM, 113: $VN, 117: 84 }, { 14: $VD, 42: $VE, 58: $VF, 86: $VG, 98: 267, 102: $VH, 103: $VI, 106: $VJ, 108: $VK, 111: $VL, 112: $VM, 113: $VN, 117: 84 }, { 95: [1, 268] }, o($Vg1, [2, 113]), o($VP, [2, 53]), { 30: 269, 65: $Vi1, 77: $Vj1, 78: $Vk1, 79: 164, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, o($VP, [2, 61]), o($Ve1, $V4, { 5: 270 }), o($VB1, [2, 124], { 105: 256, 10: $Vs1, 58: $Vt1, 81: $Vu1, 102: $Vv1, 106: $Vw1, 107: $Vx1, 108: $Vy1, 109: $Vz1 }), o($Vg1, [2, 119], { 117: 160, 10: [1, 271], 14: $VD, 42: $VE, 58: $VF, 86: $VG, 102: $VH, 103: $VI, 106: $VJ, 108: $VK, 111: $VL, 112: $VM, 113: $VN }), o($Vg1, [2, 120], { 117: 160, 10: [1, 272], 14: $VD, 42: $VE, 58: $VF, 86: $VG, 102: $VH, 103: $VI, 106: $VJ, 108: $VK, 111: $VL, 112: $VM, 113: $VN }), o($Vg1, [2, 107]), { 31: [1, 273], 65: $Vi1, 79: 208, 113: $Vl1, 114: $Vm1, 115: $Vn1 }, { 6: 11, 7: 12, 8: $V5, 9: $V6, 10: $V7, 11: $V8, 20: 17, 22: 18, 23: 19, 24: 20, 25: 21, 26: 22, 27: $V9, 32: [1, 274], 33: 24, 34: $Va, 36: $Vb, 38: $Vc, 40: 28, 41: 38, 42: $Vd, 43: 39, 45: 40, 58: $Ve, 81: $Vf, 82: $Vg, 83: $Vh, 84: $Vi, 85: $Vj, 86: $Vk, 99: $Vl, 102: $Vm, 103: $Vn, 106: $Vo, 108: $Vp, 110: 41, 111: $Vq, 112: $Vr, 113: $Vs, 118: $Vt, 119: $Vu, 120: $Vv, 121: $Vw }, { 10: $Vs1, 58: $Vt1, 81: $Vu1, 89: 275, 102: $Vv1, 104: 229, 105: 230, 106: $Vw1, 107: $Vx1, 108: $Vy1, 109: $Vz1 }, { 10: $Vs1, 58: $Vt1, 81: $Vu1, 89: 276, 102: $Vv1, 104: 229, 105: 230, 106: $Vw1, 107: $Vx1, 108: $Vy1, 109: $Vz1 }, o($VP, [2, 57]), o($Vy, [2, 33]), o($Vg1, [2, 117], { 103: $VA1 }), o($Vg1, [2, 118], { 103: $VA1 })],
    defaultActions: {},
    parseError: function parseError(str, hash) {
      if (hash.recoverable) {
        this.trace(str);
      } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
      }
    },
    parse: function parse(input) {
      var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, TERROR = 2, EOF = 1;
      var args = lstack.slice.call(arguments, 1);
      var lexer2 = Object.create(this.lexer);
      var sharedState = { yy: {} };
      for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
          sharedState.yy[k] = this.yy[k];
        }
      }
      lexer2.setInput(input, sharedState.yy);
      sharedState.yy.lexer = lexer2;
      sharedState.yy.parser = this;
      if (typeof lexer2.yylloc == "undefined") {
        lexer2.yylloc = {};
      }
      var yyloc = lexer2.yylloc;
      lstack.push(yyloc);
      var ranges = lexer2.options && lexer2.options.ranges;
      if (typeof sharedState.yy.parseError === "function") {
        this.parseError = sharedState.yy.parseError;
      } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
      }
      function lex2() {
        var token;
        token = tstack.pop() || lexer2.lex() || EOF;
        if (typeof token !== "number") {
          if (token instanceof Array) {
            tstack = token;
            token = tstack.pop();
          }
          token = self.symbols_[token] || token;
        }
        return token;
      }
      var symbol, state, action, r, yyval = {}, p, len, newState, expected;
      while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
          action = this.defaultActions[state];
        } else {
          if (symbol === null || typeof symbol == "undefined") {
            symbol = lex2();
          }
          action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
          var errStr = "";
          expected = [];
          for (p in table[state]) {
            if (this.terminals_[p] && p > TERROR) {
              expected.push("'" + this.terminals_[p] + "'");
            }
          }
          if (lexer2.showPosition) {
            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + lexer2.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
          } else {
            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
          }
          this.parseError(errStr, {
            text: lexer2.match,
            token: this.terminals_[symbol] || symbol,
            line: lexer2.yylineno,
            loc: yyloc,
            expected
          });
        }
        if (action[0] instanceof Array && action.length > 1) {
          throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
          case 1:
            stack.push(symbol);
            vstack.push(lexer2.yytext);
            lstack.push(lexer2.yylloc);
            stack.push(action[1]);
            symbol = null;
            {
              yyleng = lexer2.yyleng;
              yytext = lexer2.yytext;
              yylineno = lexer2.yylineno;
              yyloc = lexer2.yylloc;
            }
            break;
          case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
              first_line: lstack[lstack.length - (len || 1)].first_line,
              last_line: lstack[lstack.length - 1].last_line,
              first_column: lstack[lstack.length - (len || 1)].first_column,
              last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
              yyval._$.range = [
                lstack[lstack.length - (len || 1)].range[0],
                lstack[lstack.length - 1].range[1]
              ];
            }
            r = this.performAction.apply(yyval, [
              yytext,
              yyleng,
              yylineno,
              sharedState.yy,
              action[1],
              vstack,
              lstack
            ].concat(args));
            if (typeof r !== "undefined") {
              return r;
            }
            if (len) {
              stack = stack.slice(0, -1 * len * 2);
              vstack = vstack.slice(0, -1 * len);
              lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
          case 3:
            return true;
        }
      }
      return true;
    }
  };
  var lexer = function() {
    var lexer2 = {
      EOF: 1,
      parseError: function parseError(str, hash) {
        if (this.yy.parser) {
          this.yy.parser.parseError(str, hash);
        } else {
          throw new Error(str);
        }
      },
      // resets the lexer, sets new input
      setInput: function(input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = "";
        this.conditionStack = ["INITIAL"];
        this.yylloc = {
          first_line: 1,
          first_column: 0,
          last_line: 1,
          last_column: 0
        };
        if (this.options.ranges) {
          this.yylloc.range = [0, 0];
        }
        this.offset = 0;
        return this;
      },
      // consumes and returns one char from the input
      input: function() {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno++;
          this.yylloc.last_line++;
        } else {
          this.yylloc.last_column++;
        }
        if (this.options.ranges) {
          this.yylloc.range[1]++;
        }
        this._input = this._input.slice(1);
        return ch;
      },
      // unshifts one char (or a string) into the input
      unput: function(ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);
        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);
        if (lines.length - 1) {
          this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;
        this.yylloc = {
          first_line: this.yylloc.first_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.first_column,
          last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
        };
        if (this.options.ranges) {
          this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
      },
      // When called from action, caches matched text and appends it on next action
      more: function() {
        this._more = true;
        return this;
      },
      // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
      reject: function() {
        if (this.options.backtrack_lexer) {
          this._backtrack = true;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
        return this;
      },
      // retain first n characters of the match
      less: function(n) {
        this.unput(this.match.slice(n));
      },
      // displays already matched input, i.e. for error messages
      pastInput: function() {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
      },
      // displays upcoming input, i.e. for error messages
      upcomingInput: function() {
        var next = this.match;
        if (next.length < 20) {
          next += this._input.substr(0, 20 - next.length);
        }
        return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
      },
      // displays the character position where the lexing error occurred, i.e. for error messages
      showPosition: function() {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
      },
      // test the lexed token: return FALSE when not a match, otherwise return token
      test_match: function(match, indexed_rule) {
        var token, lines, backup;
        if (this.options.backtrack_lexer) {
          backup = {
            yylineno: this.yylineno,
            yylloc: {
              first_line: this.yylloc.first_line,
              last_line: this.last_line,
              first_column: this.yylloc.first_column,
              last_column: this.yylloc.last_column
            },
            yytext: this.yytext,
            match: this.match,
            matches: this.matches,
            matched: this.matched,
            yyleng: this.yyleng,
            offset: this.offset,
            _more: this._more,
            _input: this._input,
            yy: this.yy,
            conditionStack: this.conditionStack.slice(0),
            done: this.done
          };
          if (this.options.ranges) {
            backup.yylloc.range = this.yylloc.range.slice(0);
          }
        }
        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno += lines.length;
        }
        this.yylloc = {
          first_line: this.yylloc.last_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.last_column,
          last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
          this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
          this.done = false;
        }
        if (token) {
          return token;
        } else if (this._backtrack) {
          for (var k in backup) {
            this[k] = backup[k];
          }
          return false;
        }
        return false;
      },
      // return next match in input
      next: function() {
        if (this.done) {
          return this.EOF;
        }
        if (!this._input) {
          this.done = true;
        }
        var token, match, tempMatch, index;
        if (!this._more) {
          this.yytext = "";
          this.match = "";
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
          tempMatch = this._input.match(this.rules[rules[i]]);
          if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
            match = tempMatch;
            index = i;
            if (this.options.backtrack_lexer) {
              token = this.test_match(tempMatch, rules[i]);
              if (token !== false) {
                return token;
              } else if (this._backtrack) {
                match = false;
                continue;
              } else {
                return false;
              }
            } else if (!this.options.flex) {
              break;
            }
          }
        }
        if (match) {
          token = this.test_match(match, rules[index]);
          if (token !== false) {
            return token;
          }
          return false;
        }
        if (this._input === "") {
          return this.EOF;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
      },
      // return next match that has a token
      lex: function lex2() {
        var r = this.next();
        if (r) {
          return r;
        } else {
          return this.lex();
        }
      },
      // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
      begin: function begin(condition) {
        this.conditionStack.push(condition);
      },
      // pop the previously active lexer condition state off the condition stack
      popState: function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
          return this.conditionStack.pop();
        } else {
          return this.conditionStack[0];
        }
      },
      // produce the lexer rule set which is active for the currently active lexer condition state
      _currentRules: function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
          return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
          return this.conditions["INITIAL"].rules;
        }
      },
      // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
      topState: function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
          return this.conditionStack[n];
        } else {
          return "INITIAL";
        }
      },
      // alias for begin(condition)
      pushState: function pushState(condition) {
        this.begin(condition);
      },
      // return the number of states currently on the stack
      stateStackSize: function stateStackSize() {
        return this.conditionStack.length;
      },
      options: {},
      performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
        switch ($avoiding_name_collisions) {
          case 0:
            this.begin("acc_title");
            return 34;
          case 1:
            this.popState();
            return "acc_title_value";
          case 2:
            this.begin("acc_descr");
            return 36;
          case 3:
            this.popState();
            return "acc_descr_value";
          case 4:
            this.begin("acc_descr_multiline");
            break;
          case 5:
            this.popState();
            break;
          case 6:
            return "acc_descr_multiline_value";
          case 7:
            this.begin("callbackname");
            break;
          case 8:
            this.popState();
            break;
          case 9:
            this.popState();
            this.begin("callbackargs");
            break;
          case 10:
            return 92;
          case 11:
            this.popState();
            break;
          case 12:
            return 93;
          case 13:
            return "MD_STR";
          case 14:
            this.popState();
            break;
          case 15:
            this.begin("md_string");
            break;
          case 16:
            return "STR";
          case 17:
            this.popState();
            break;
          case 18:
            this.pushState("string");
            break;
          case 19:
            return 81;
          case 20:
            return 99;
          case 21:
            return 82;
          case 22:
            return 101;
          case 23:
            return 83;
          case 24:
            return 84;
          case 25:
            return 94;
          case 26:
            this.begin("click");
            break;
          case 27:
            this.popState();
            break;
          case 28:
            return 85;
          case 29:
            if (yy.lex.firstGraph()) {
              this.begin("dir");
            }
            return 12;
          case 30:
            if (yy.lex.firstGraph()) {
              this.begin("dir");
            }
            return 12;
          case 31:
            if (yy.lex.firstGraph()) {
              this.begin("dir");
            }
            return 12;
          case 32:
            return 27;
          case 33:
            return 32;
          case 34:
            return 95;
          case 35:
            return 95;
          case 36:
            return 95;
          case 37:
            return 95;
          case 38:
            this.popState();
            return 13;
          case 39:
            this.popState();
            return 14;
          case 40:
            this.popState();
            return 14;
          case 41:
            this.popState();
            return 14;
          case 42:
            this.popState();
            return 14;
          case 43:
            this.popState();
            return 14;
          case 44:
            this.popState();
            return 14;
          case 45:
            this.popState();
            return 14;
          case 46:
            this.popState();
            return 14;
          case 47:
            this.popState();
            return 14;
          case 48:
            this.popState();
            return 14;
          case 49:
            return 118;
          case 50:
            return 119;
          case 51:
            return 120;
          case 52:
            return 121;
          case 53:
            return 102;
          case 54:
            return 108;
          case 55:
            return 44;
          case 56:
            return 58;
          case 57:
            return 42;
          case 58:
            return 8;
          case 59:
            return 103;
          case 60:
            return 112;
          case 61:
            this.popState();
            return 75;
          case 62:
            this.pushState("edgeText");
            return 73;
          case 63:
            return 116;
          case 64:
            this.popState();
            return 75;
          case 65:
            this.pushState("thickEdgeText");
            return 73;
          case 66:
            return 116;
          case 67:
            this.popState();
            return 75;
          case 68:
            this.pushState("dottedEdgeText");
            return 73;
          case 69:
            return 116;
          case 70:
            return 75;
          case 71:
            this.popState();
            return 51;
          case 72:
            return "TEXT";
          case 73:
            this.pushState("ellipseText");
            return 50;
          case 74:
            this.popState();
            return 53;
          case 75:
            this.pushState("text");
            return 52;
          case 76:
            this.popState();
            return 55;
          case 77:
            this.pushState("text");
            return 54;
          case 78:
            return 56;
          case 79:
            this.pushState("text");
            return 65;
          case 80:
            this.popState();
            return 62;
          case 81:
            this.pushState("text");
            return 61;
          case 82:
            this.popState();
            return 47;
          case 83:
            this.pushState("text");
            return 46;
          case 84:
            this.popState();
            return 67;
          case 85:
            this.popState();
            return 69;
          case 86:
            return 114;
          case 87:
            this.pushState("trapText");
            return 66;
          case 88:
            this.pushState("trapText");
            return 68;
          case 89:
            return 115;
          case 90:
            return 65;
          case 91:
            return 87;
          case 92:
            return "SEP";
          case 93:
            return 86;
          case 94:
            return 112;
          case 95:
            return 108;
          case 96:
            return 42;
          case 97:
            return 106;
          case 98:
            return 111;
          case 99:
            return 113;
          case 100:
            this.popState();
            return 60;
          case 101:
            this.pushState("text");
            return 60;
          case 102:
            this.popState();
            return 49;
          case 103:
            this.pushState("text");
            return 48;
          case 104:
            this.popState();
            return 31;
          case 105:
            this.pushState("text");
            return 29;
          case 106:
            this.popState();
            return 64;
          case 107:
            this.pushState("text");
            return 63;
          case 108:
            return "TEXT";
          case 109:
            return "QUOTE";
          case 110:
            return 9;
          case 111:
            return 10;
          case 112:
            return 11;
        }
      },
      rules: [/^(?:accTitle\s*:\s*)/, /^(?:(?!\n||)*[^\n]*)/, /^(?:accDescr\s*:\s*)/, /^(?:(?!\n||)*[^\n]*)/, /^(?:accDescr\s*\{\s*)/, /^(?:[\}])/, /^(?:[^\}]*)/, /^(?:call[\s]+)/, /^(?:\([\s]*\))/, /^(?:\()/, /^(?:[^(]*)/, /^(?:\))/, /^(?:[^)]*)/, /^(?:[^`"]+)/, /^(?:[`]["])/, /^(?:["][`])/, /^(?:[^"]+)/, /^(?:["])/, /^(?:["])/, /^(?:style\b)/, /^(?:default\b)/, /^(?:linkStyle\b)/, /^(?:interpolate\b)/, /^(?:classDef\b)/, /^(?:class\b)/, /^(?:href[\s])/, /^(?:click[\s]+)/, /^(?:[\s\n])/, /^(?:[^\s\n]*)/, /^(?:flowchart-elk\b)/, /^(?:graph\b)/, /^(?:flowchart\b)/, /^(?:subgraph\b)/, /^(?:end\b\s*)/, /^(?:_self\b)/, /^(?:_blank\b)/, /^(?:_parent\b)/, /^(?:_top\b)/, /^(?:(\r?\n)*\s*\n)/, /^(?:\s*LR\b)/, /^(?:\s*RL\b)/, /^(?:\s*TB\b)/, /^(?:\s*BT\b)/, /^(?:\s*TD\b)/, /^(?:\s*BR\b)/, /^(?:\s*<)/, /^(?:\s*>)/, /^(?:\s*\^)/, /^(?:\s*v\b)/, /^(?:.*direction\s+TB[^\n]*)/, /^(?:.*direction\s+BT[^\n]*)/, /^(?:.*direction\s+RL[^\n]*)/, /^(?:.*direction\s+LR[^\n]*)/, /^(?:[0-9]+)/, /^(?:#)/, /^(?::::)/, /^(?::)/, /^(?:&)/, /^(?:;)/, /^(?:,)/, /^(?:\*)/, /^(?:\s*[xo<]?--+[-xo>]\s*)/, /^(?:\s*[xo<]?--\s*)/, /^(?:[^-]|-(?!-)+)/, /^(?:\s*[xo<]?==+[=xo>]\s*)/, /^(?:\s*[xo<]?==\s*)/, /^(?:[^=]|=(?!))/, /^(?:\s*[xo<]?-?\.+-[xo>]?\s*)/, /^(?:\s*[xo<]?-\.\s*)/, /^(?:[^\.]|\.(?!))/, /^(?:\s*~~[\~]+\s*)/, /^(?:[-/\)][\)])/, /^(?:[^\(\)\[\]\{\}]|!\)+)/, /^(?:\(-)/, /^(?:\]\))/, /^(?:\(\[)/, /^(?:\]\])/, /^(?:\[\[)/, /^(?:\[\|)/, /^(?:>)/, /^(?:\)\])/, /^(?:\[\()/, /^(?:\)\)\))/, /^(?:\(\(\()/, /^(?:[\\(?=\])][\]])/, /^(?:\/(?=\])\])/, /^(?:\/(?!\])|\\(?!\])|[^\\\[\]\(\)\{\}\/]+)/, /^(?:\[\/)/, /^(?:\[\\)/, /^(?:<)/, /^(?:>)/, /^(?:\^)/, /^(?:\\\|)/, /^(?:v\b)/, /^(?:\*)/, /^(?:#)/, /^(?:&)/, /^(?:([A-Za-z0-9!"\#$%&'*+\.`?\\_\/]|-(?=[^\>\-\.])|(?!))+)/, /^(?:-)/, /^(?:[\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6]|[\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377]|[\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5]|[\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA]|[\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE]|[\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA]|[\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0]|[\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977]|[\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2]|[\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A]|[\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39]|[\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8]|[\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C]|[\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C]|[\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99]|[\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0]|[\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D]|[\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3]|[\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10]|[\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1]|[\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81]|[\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3]|[\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6]|[\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A]|[\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081]|[\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D]|[\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0]|[\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310]|[\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C]|[\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711]|[\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7]|[\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C]|[\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16]|[\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF]|[\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC]|[\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D]|[\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D]|[\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3]|[\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F]|[\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128]|[\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184]|[\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3]|[\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6]|[\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE]|[\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C]|[\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D]|[\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC]|[\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B]|[\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788]|[\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805]|[\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB]|[\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28]|[\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5]|[\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4]|[\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E]|[\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D]|[\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36]|[\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D]|[\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC]|[\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF]|[\uFFD2-\uFFD7\uFFDA-\uFFDC])/, /^(?:\|)/, /^(?:\|)/, /^(?:\))/, /^(?:\()/, /^(?:\])/, /^(?:\[)/, /^(?:(\}))/, /^(?:\{)/, /^(?:[^\[\]\(\)\{\}\|\"]+)/, /^(?:")/, /^(?:(\r?\n)+)/, /^(?:\s)/, /^(?:$)/],
      conditions: { "callbackargs": { "rules": [11, 12, 15, 18, 70, 73, 75, 77, 81, 83, 87, 88, 101, 103, 105, 107], "inclusive": false }, "callbackname": { "rules": [8, 9, 10, 15, 18, 70, 73, 75, 77, 81, 83, 87, 88, 101, 103, 105, 107], "inclusive": false }, "href": { "rules": [15, 18, 70, 73, 75, 77, 81, 83, 87, 88, 101, 103, 105, 107], "inclusive": false }, "click": { "rules": [15, 18, 27, 28, 70, 73, 75, 77, 81, 83, 87, 88, 101, 103, 105, 107], "inclusive": false }, "dottedEdgeText": { "rules": [15, 18, 67, 69, 70, 73, 75, 77, 81, 83, 87, 88, 101, 103, 105, 107], "inclusive": false }, "thickEdgeText": { "rules": [15, 18, 64, 66, 70, 73, 75, 77, 81, 83, 87, 88, 101, 103, 105, 107], "inclusive": false }, "edgeText": { "rules": [15, 18, 61, 63, 70, 73, 75, 77, 81, 83, 87, 88, 101, 103, 105, 107], "inclusive": false }, "trapText": { "rules": [15, 18, 70, 73, 75, 77, 81, 83, 84, 85, 86, 87, 88, 101, 103, 105, 107], "inclusive": false }, "ellipseText": { "rules": [15, 18, 70, 71, 72, 73, 75, 77, 81, 83, 87, 88, 101, 103, 105, 107], "inclusive": false }, "text": { "rules": [15, 18, 70, 73, 74, 75, 76, 77, 80, 81, 82, 83, 87, 88, 100, 101, 102, 103, 104, 105, 106, 107, 108], "inclusive": false }, "vertex": { "rules": [15, 18, 70, 73, 75, 77, 81, 83, 87, 88, 101, 103, 105, 107], "inclusive": false }, "dir": { "rules": [15, 18, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 70, 73, 75, 77, 81, 83, 87, 88, 101, 103, 105, 107], "inclusive": false }, "acc_descr_multiline": { "rules": [5, 6, 15, 18, 70, 73, 75, 77, 81, 83, 87, 88, 101, 103, 105, 107], "inclusive": false }, "acc_descr": { "rules": [3, 15, 18, 70, 73, 75, 77, 81, 83, 87, 88, 101, 103, 105, 107], "inclusive": false }, "acc_title": { "rules": [1, 15, 18, 70, 73, 75, 77, 81, 83, 87, 88, 101, 103, 105, 107], "inclusive": false }, "md_string": { "rules": [13, 14, 15, 18, 70, 73, 75, 77, 81, 83, 87, 88, 101, 103, 105, 107], "inclusive": false }, "string": { "rules": [15, 16, 17, 18, 70, 73, 75, 77, 81, 83, 87, 88, 101, 103, 105, 107], "inclusive": false }, "INITIAL": { "rules": [0, 2, 4, 7, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 29, 30, 31, 32, 33, 34, 35, 36, 37, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 64, 65, 67, 68, 70, 73, 75, 77, 78, 79, 81, 83, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 101, 103, 105, 107, 109, 110, 111, 112], "inclusive": true } }
    };
    return lexer2;
  }();
  parser2.lexer = lexer;
  function Parser() {
    this.yy = {};
  }
  Parser.prototype = parser2;
  parser2.Parser = Parser;
  return new Parser();
}();
parser.parser = parser;
const parser$1 = parser;
const MERMAID_DOM_ID_PREFIX = "flowchart-";
let vertexCounter = 0;
let config = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)();
let vertices = {};
let edges = [];
let classes = {};
let subGraphs = [];
let subGraphLookup = {};
let tooltips = {};
let subCount = 0;
let firstGraphFlag = true;
let direction;
let version;
let funs = [];
const sanitizeText = (txt) => _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.e.sanitizeText(txt, config);
const lookUpDomId = function(id) {
  const vertexKeys = Object.keys(vertices);
  for (const vertexKey of vertexKeys) {
    if (vertices[vertexKey].id === id) {
      return vertices[vertexKey].domId;
    }
  }
  return id;
};
const addVertex = function(_id, textObj, type, style, classes2, dir, props = {}) {
  let txt;
  let id = _id;
  if (id === void 0) {
    return;
  }
  if (id.trim().length === 0) {
    return;
  }
  if (vertices[id] === void 0) {
    vertices[id] = {
      id,
      labelType: "text",
      domId: MERMAID_DOM_ID_PREFIX + id + "-" + vertexCounter,
      styles: [],
      classes: []
    };
  }
  vertexCounter++;
  if (textObj !== void 0) {
    config = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)();
    txt = sanitizeText(textObj.text.trim());
    vertices[id].labelType = textObj.type;
    if (txt[0] === '"' && txt[txt.length - 1] === '"') {
      txt = txt.substring(1, txt.length - 1);
    }
    vertices[id].text = txt;
  } else {
    if (vertices[id].text === void 0) {
      vertices[id].text = _id;
    }
  }
  if (type !== void 0) {
    vertices[id].type = type;
  }
  if (style !== void 0 && style !== null) {
    style.forEach(function(s) {
      vertices[id].styles.push(s);
    });
  }
  if (classes2 !== void 0 && classes2 !== null) {
    classes2.forEach(function(s) {
      vertices[id].classes.push(s);
    });
  }
  if (dir !== void 0) {
    vertices[id].dir = dir;
  }
  if (vertices[id].props === void 0) {
    vertices[id].props = props;
  } else if (props !== void 0) {
    Object.assign(vertices[id].props, props);
  }
};
const addSingleLink = function(_start, _end, type) {
  let start = _start;
  let end = _end;
  const edge = { start, end, type: void 0, text: "", labelType: "text" };
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.info("abc78 Got edge...", edge);
  const linkTextObj = type.text;
  if (linkTextObj !== void 0) {
    edge.text = sanitizeText(linkTextObj.text.trim());
    if (edge.text[0] === '"' && edge.text[edge.text.length - 1] === '"') {
      edge.text = edge.text.substring(1, edge.text.length - 1);
    }
    edge.labelType = linkTextObj.type;
  }
  if (type !== void 0) {
    edge.type = type.type;
    edge.stroke = type.stroke;
    edge.length = type.length;
  }
  if ((edge == null ? void 0 : edge.length) > 10) {
    edge.length = 10;
  }
  if (edges.length < (config.maxEdges ?? 500)) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.info("abc78 pushing edge...");
    edges.push(edge);
  } else {
    throw new Error(
      `Edge limit exceeded. ${edges.length} edges found, but the limit is ${config.maxEdges}.

Initialize mermaid with maxEdges set to a higher number to allow more edges.
You cannot set this config via configuration inside the diagram as it is a secure config.
You have to call mermaid.initialize.`
    );
  }
};
const addLink = function(_start, _end, type) {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.info("addLink (abc78)", _start, _end, type);
  let i, j;
  for (i = 0; i < _start.length; i++) {
    for (j = 0; j < _end.length; j++) {
      addSingleLink(_start[i], _end[j], type);
    }
  }
};
const updateLinkInterpolate = function(positions, interp) {
  positions.forEach(function(pos) {
    if (pos === "default") {
      edges.defaultInterpolate = interp;
    } else {
      edges[pos].interpolate = interp;
    }
  });
};
const updateLink = function(positions, style) {
  positions.forEach(function(pos) {
    if (pos >= edges.length) {
      throw new Error(
        `The index ${pos} for linkStyle is out of bounds. Valid indices for linkStyle are between 0 and ${edges.length - 1}. (Help: Ensure that the index is within the range of existing edges.)`
      );
    }
    if (pos === "default") {
      edges.defaultStyle = style;
    } else {
      if (_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.u.isSubstringInArray("fill", style) === -1) {
        style.push("fill:none");
      }
      edges[pos].style = style;
    }
  });
};
const addClass = function(ids, style) {
  ids.split(",").forEach(function(id) {
    if (classes[id] === void 0) {
      classes[id] = { id, styles: [], textStyles: [] };
    }
    if (style !== void 0 && style !== null) {
      style.forEach(function(s) {
        if (s.match("color")) {
          const newStyle = s.replace("fill", "bgFill").replace("color", "fill");
          classes[id].textStyles.push(newStyle);
        }
        classes[id].styles.push(s);
      });
    }
  });
};
const setDirection = function(dir) {
  direction = dir;
  if (direction.match(/.*</)) {
    direction = "RL";
  }
  if (direction.match(/.*\^/)) {
    direction = "BT";
  }
  if (direction.match(/.*>/)) {
    direction = "LR";
  }
  if (direction.match(/.*v/)) {
    direction = "TB";
  }
  if (direction === "TD") {
    direction = "TB";
  }
};
const setClass = function(ids, className) {
  ids.split(",").forEach(function(_id) {
    let id = _id;
    if (vertices[id] !== void 0) {
      vertices[id].classes.push(className);
    }
    if (subGraphLookup[id] !== void 0) {
      subGraphLookup[id].classes.push(className);
    }
  });
};
const setTooltip = function(ids, tooltip) {
  ids.split(",").forEach(function(id) {
    if (tooltip !== void 0) {
      tooltips[version === "gen-1" ? lookUpDomId(id) : id] = sanitizeText(tooltip);
    }
  });
};
const setClickFun = function(id, functionName, functionArgs) {
  let domId = lookUpDomId(id);
  if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().securityLevel !== "loose") {
    return;
  }
  if (functionName === void 0) {
    return;
  }
  let argList = [];
  if (typeof functionArgs === "string") {
    argList = functionArgs.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    for (let i = 0; i < argList.length; i++) {
      let item = argList[i].trim();
      if (item.charAt(0) === '"' && item.charAt(item.length - 1) === '"') {
        item = item.substr(1, item.length - 2);
      }
      argList[i] = item;
    }
  }
  if (argList.length === 0) {
    argList.push(id);
  }
  if (vertices[id] !== void 0) {
    vertices[id].haveCallback = true;
    funs.push(function() {
      const elem = document.querySelector(`[id="${domId}"]`);
      if (elem !== null) {
        elem.addEventListener(
          "click",
          function() {
            _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.u.runFunc(functionName, ...argList);
          },
          false
        );
      }
    });
  }
};
const setLink = function(ids, linkStr, target) {
  ids.split(",").forEach(function(id) {
    if (vertices[id] !== void 0) {
      vertices[id].link = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.u.formatUrl(linkStr, config);
      vertices[id].linkTarget = target;
    }
  });
  setClass(ids, "clickable");
};
const getTooltip = function(id) {
  if (tooltips.hasOwnProperty(id)) {
    return tooltips[id];
  }
  return void 0;
};
const setClickEvent = function(ids, functionName, functionArgs) {
  ids.split(",").forEach(function(id) {
    setClickFun(id, functionName, functionArgs);
  });
  setClass(ids, "clickable");
};
const bindFunctions = function(element) {
  funs.forEach(function(fun) {
    fun(element);
  });
};
const getDirection = function() {
  return direction.trim();
};
const getVertices = function() {
  return vertices;
};
const getEdges = function() {
  return edges;
};
const getClasses = function() {
  return classes;
};
const setupToolTips = function(element) {
  let tooltipElem = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(".mermaidTooltip");
  if ((tooltipElem._groups || tooltipElem)[0][0] === null) {
    tooltipElem = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)("body").append("div").attr("class", "mermaidTooltip").style("opacity", 0);
  }
  const svg = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(element).select("svg");
  const nodes = svg.selectAll("g.node");
  nodes.on("mouseover", function() {
    const el = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(this);
    const title = el.attr("title");
    if (title === null) {
      return;
    }
    const rect = this.getBoundingClientRect();
    tooltipElem.transition().duration(200).style("opacity", ".9");
    tooltipElem.text(el.attr("title")).style("left", window.scrollX + rect.left + (rect.right - rect.left) / 2 + "px").style("top", window.scrollY + rect.bottom + "px");
    tooltipElem.html(tooltipElem.html().replace(/&lt;br\/&gt;/g, "<br/>"));
    el.classed("hover", true);
  }).on("mouseout", function() {
    tooltipElem.transition().duration(500).style("opacity", 0);
    const el = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(this);
    el.classed("hover", false);
  });
};
funs.push(setupToolTips);
const clear = function(ver = "gen-1") {
  vertices = {};
  classes = {};
  edges = [];
  funs = [setupToolTips];
  subGraphs = [];
  subGraphLookup = {};
  subCount = 0;
  tooltips = {};
  firstGraphFlag = true;
  version = ver;
  config = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)();
  (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.v)();
};
const setGen = (ver) => {
  version = ver || "gen-2";
};
const defaultStyle = function() {
  return "fill:#ffa;stroke: #f66; stroke-width: 3px; stroke-dasharray: 5, 5;fill:#ffa;stroke: #666;";
};
const addSubGraph = function(_id, list, _title) {
  let id = _id.text.trim();
  let title = _title.text;
  if (_id === _title && _title.text.match(/\s/)) {
    id = void 0;
  }
  function uniq(a) {
    const prims = { boolean: {}, number: {}, string: {} };
    const objs = [];
    let dir2;
    const nodeList2 = a.filter(function(item) {
      const type = typeof item;
      if (item.stmt && item.stmt === "dir") {
        dir2 = item.value;
        return false;
      }
      if (item.trim() === "") {
        return false;
      }
      if (type in prims) {
        return prims[type].hasOwnProperty(item) ? false : prims[type][item] = true;
      } else {
        return objs.includes(item) ? false : objs.push(item);
      }
    });
    return { nodeList: nodeList2, dir: dir2 };
  }
  let nodeList = [];
  const { nodeList: nl, dir } = uniq(nodeList.concat.apply(nodeList, list));
  nodeList = nl;
  if (version === "gen-1") {
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i] = lookUpDomId(nodeList[i]);
    }
  }
  id = id || "subGraph" + subCount;
  title = title || "";
  title = sanitizeText(title);
  subCount = subCount + 1;
  const subGraph = {
    id,
    nodes: nodeList,
    title: title.trim(),
    classes: [],
    dir,
    labelType: _title.type
  };
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.info("Adding", subGraph.id, subGraph.nodes, subGraph.dir);
  subGraph.nodes = makeUniq(subGraph, subGraphs).nodes;
  subGraphs.push(subGraph);
  subGraphLookup[id] = subGraph;
  return id;
};
const getPosForId = function(id) {
  for (const [i, subGraph] of subGraphs.entries()) {
    if (subGraph.id === id) {
      return i;
    }
  }
  return -1;
};
let secCount = -1;
const posCrossRef = [];
const indexNodes2 = function(id, pos) {
  const nodes = subGraphs[pos].nodes;
  secCount = secCount + 1;
  if (secCount > 2e3) {
    return;
  }
  posCrossRef[secCount] = pos;
  if (subGraphs[pos].id === id) {
    return {
      result: true,
      count: 0
    };
  }
  let count = 0;
  let posCount = 1;
  while (count < nodes.length) {
    const childPos = getPosForId(nodes[count]);
    if (childPos >= 0) {
      const res = indexNodes2(id, childPos);
      if (res.result) {
        return {
          result: true,
          count: posCount + res.count
        };
      } else {
        posCount = posCount + res.count;
      }
    }
    count = count + 1;
  }
  return {
    result: false,
    count: posCount
  };
};
const getDepthFirstPos = function(pos) {
  return posCrossRef[pos];
};
const indexNodes = function() {
  secCount = -1;
  if (subGraphs.length > 0) {
    indexNodes2("none", subGraphs.length - 1);
  }
};
const getSubGraphs = function() {
  return subGraphs;
};
const firstGraph = () => {
  if (firstGraphFlag) {
    firstGraphFlag = false;
    return true;
  }
  return false;
};
const destructStartLink = (_str) => {
  let str = _str.trim();
  let type = "arrow_open";
  switch (str[0]) {
    case "<":
      type = "arrow_point";
      str = str.slice(1);
      break;
    case "x":
      type = "arrow_cross";
      str = str.slice(1);
      break;
    case "o":
      type = "arrow_circle";
      str = str.slice(1);
      break;
  }
  let stroke = "normal";
  if (str.includes("=")) {
    stroke = "thick";
  }
  if (str.includes(".")) {
    stroke = "dotted";
  }
  return { type, stroke };
};
const countChar = (char, str) => {
  const length = str.length;
  let count = 0;
  for (let i = 0; i < length; ++i) {
    if (str[i] === char) {
      ++count;
    }
  }
  return count;
};
const destructEndLink = (_str) => {
  const str = _str.trim();
  let line = str.slice(0, -1);
  let type = "arrow_open";
  switch (str.slice(-1)) {
    case "x":
      type = "arrow_cross";
      if (str[0] === "x") {
        type = "double_" + type;
        line = line.slice(1);
      }
      break;
    case ">":
      type = "arrow_point";
      if (str[0] === "<") {
        type = "double_" + type;
        line = line.slice(1);
      }
      break;
    case "o":
      type = "arrow_circle";
      if (str[0] === "o") {
        type = "double_" + type;
        line = line.slice(1);
      }
      break;
  }
  let stroke = "normal";
  let length = line.length - 1;
  if (line[0] === "=") {
    stroke = "thick";
  }
  if (line[0] === "~") {
    stroke = "invisible";
  }
  let dots = countChar(".", line);
  if (dots) {
    stroke = "dotted";
    length = dots;
  }
  return { type, stroke, length };
};
const destructLink = (_str, _startStr) => {
  const info = destructEndLink(_str);
  let startInfo;
  if (_startStr) {
    startInfo = destructStartLink(_startStr);
    if (startInfo.stroke !== info.stroke) {
      return { type: "INVALID", stroke: "INVALID" };
    }
    if (startInfo.type === "arrow_open") {
      startInfo.type = info.type;
    } else {
      if (startInfo.type !== info.type) {
        return { type: "INVALID", stroke: "INVALID" };
      }
      startInfo.type = "double_" + startInfo.type;
    }
    if (startInfo.type === "double_arrow") {
      startInfo.type = "double_arrow_point";
    }
    startInfo.length = info.length;
    return startInfo;
  }
  return info;
};
const exists = (allSgs, _id) => {
  let res = false;
  allSgs.forEach((sg) => {
    const pos = sg.nodes.indexOf(_id);
    if (pos >= 0) {
      res = true;
    }
  });
  return res;
};
const makeUniq = (sg, allSubgraphs) => {
  const res = [];
  sg.nodes.forEach((_id, pos) => {
    if (!exists(allSubgraphs, _id)) {
      res.push(sg.nodes[pos]);
    }
  });
  return { nodes: res };
};
const lex = {
  firstGraph
};
const flowDb = {
  defaultConfig: () => _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.K.flowchart,
  setAccTitle: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.s,
  getAccTitle: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.g,
  getAccDescription: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.a,
  setAccDescription: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.b,
  addVertex,
  lookUpDomId,
  addLink,
  updateLinkInterpolate,
  updateLink,
  addClass,
  setDirection,
  setClass,
  setTooltip,
  getTooltip,
  setClickEvent,
  setLink,
  bindFunctions,
  getDirection,
  getVertices,
  getEdges,
  getClasses,
  clear,
  setGen,
  defaultStyle,
  addSubGraph,
  getDepthFirstPos,
  indexNodes,
  getSubGraphs,
  destructLink,
  lex,
  exists,
  makeUniq,
  setDiagramTitle: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.q,
  getDiagramTitle: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.t
};
const db = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addClass,
  addLink,
  addSingleLink,
  addSubGraph,
  addVertex,
  bindFunctions,
  clear,
  default: flowDb,
  defaultStyle,
  destructLink,
  firstGraph,
  getClasses,
  getDepthFirstPos,
  getDirection,
  getEdges,
  getSubGraphs,
  getTooltip,
  getVertices,
  indexNodes,
  lex,
  lookUpDomId,
  setClass,
  setClickEvent,
  setDirection,
  setGen,
  setLink,
  updateLink,
  updateLinkInterpolate
}, Symbol.toStringTag, { value: "Module" }));



/***/ }),

/***/ "./node_modules/mermaid/dist/index-fc10efb0.js":
/*!*****************************************************!*\
  !*** ./node_modules/mermaid/dist/index-fc10efb0.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   r: function() { return /* binding */ render; }
/* harmony export */ });
/* harmony import */ var dagre_d3_es_src_dagre_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dagre-d3-es/src/dagre/index.js */ "./node_modules/dagre-d3-es/src/dagre/index.js");
/* harmony import */ var dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dagre-d3-es/src/graphlib/json.js */ "./node_modules/dagre-d3-es/src/graphlib/json.js");
/* harmony import */ var _edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./edges-d32062c0.js */ "./node_modules/mermaid/dist/edges-d32062c0.js");
/* harmony import */ var _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mermaid-f47111a7.js */ "./node_modules/mermaid/dist/mermaid-f47111a7.js");
/* harmony import */ var dagre_d3_es_src_graphlib_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! dagre-d3-es/src/graphlib/index.js */ "./node_modules/dagre-d3-es/src/graphlib/index.js");
/* harmony import */ var _createText_6b48ae7d_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createText-6b48ae7d.js */ "./node_modules/mermaid/dist/createText-6b48ae7d.js");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! d3 */ "./node_modules/d3/src/index.js");







let clusterDb = {};
let descendants = {};
let parents = {};
const clear$1 = () => {
  descendants = {};
  parents = {};
  clusterDb = {};
};
const isDescendant = (id, ancestorId) => {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.trace("In isDescendant", ancestorId, " ", id, " = ", descendants[ancestorId].includes(id));
  if (descendants[ancestorId].includes(id)) {
    return true;
  }
  return false;
};
const edgeInCluster = (edge, clusterId) => {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Descendants of ", clusterId, " is ", descendants[clusterId]);
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Edge is ", edge);
  if (edge.v === clusterId) {
    return false;
  }
  if (edge.w === clusterId) {
    return false;
  }
  if (!descendants[clusterId]) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("Tilt, ", clusterId, ",not in descendants");
    return false;
  }
  return descendants[clusterId].includes(edge.v) || isDescendant(edge.v, clusterId) || isDescendant(edge.w, clusterId) || descendants[clusterId].includes(edge.w);
};
const copy = (clusterId, graph, newGraph, rootId) => {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn(
    "Copying children of ",
    clusterId,
    "root",
    rootId,
    "data",
    graph.node(clusterId),
    rootId
  );
  const nodes = graph.children(clusterId) || [];
  if (clusterId !== rootId) {
    nodes.push(clusterId);
  }
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Copying (nodes) clusterId", clusterId, "nodes", nodes);
  nodes.forEach((node) => {
    if (graph.children(node).length > 0) {
      copy(node, graph, newGraph, rootId);
    } else {
      const data = graph.node(node);
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("cp ", node, " to ", rootId, " with parent ", clusterId);
      newGraph.setNode(node, data);
      if (rootId !== graph.parent(node)) {
        _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Setting parent", node, graph.parent(node));
        newGraph.setParent(node, graph.parent(node));
      }
      if (clusterId !== rootId && node !== clusterId) {
        _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("Setting parent", node, clusterId);
        newGraph.setParent(node, clusterId);
      } else {
        _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("In copy ", clusterId, "root", rootId, "data", graph.node(clusterId), rootId);
        _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.debug(
          "Not Setting parent for node=",
          node,
          "cluster!==rootId",
          clusterId !== rootId,
          "node!==clusterId",
          node !== clusterId
        );
      }
      const edges = graph.edges(node);
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("Copying Edges", edges);
      edges.forEach((edge) => {
        _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Edge", edge);
        const data2 = graph.edge(edge.v, edge.w, edge.name);
        _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Edge data", data2, rootId);
        try {
          if (edgeInCluster(edge, rootId)) {
            _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Copying as ", edge.v, edge.w, data2, edge.name);
            newGraph.setEdge(edge.v, edge.w, data2, edge.name);
            _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("newGraph edges ", newGraph.edges(), newGraph.edge(newGraph.edges()[0]));
          } else {
            _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info(
              "Skipping copy of edge ",
              edge.v,
              "-->",
              edge.w,
              " rootId: ",
              rootId,
              " clusterId:",
              clusterId
            );
          }
        } catch (e) {
          _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.error(e);
        }
      });
    }
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("Removing node", node);
    graph.removeNode(node);
  });
};
const extractDescendants = (id, graph) => {
  const children = graph.children(id);
  let res = [...children];
  for (const child of children) {
    parents[child] = id;
    res = [...res, ...extractDescendants(child, graph)];
  }
  return res;
};
const findNonClusterChild = (id, graph) => {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.trace("Searching", id);
  const children = graph.children(id);
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.trace("Searching children of id ", id, children);
  if (children.length < 1) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.trace("This is a valid node", id);
    return id;
  }
  for (const child of children) {
    const _id = findNonClusterChild(child, graph);
    if (_id) {
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.trace("Found replacement for", id, " => ", _id);
      return _id;
    }
  }
};
const getAnchorId = (id) => {
  if (!clusterDb[id]) {
    return id;
  }
  if (!clusterDb[id].externalConnections) {
    return id;
  }
  if (clusterDb[id]) {
    return clusterDb[id].id;
  }
  return id;
};
const adjustClustersAndEdges = (graph, depth) => {
  if (!graph || depth > 10) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("Opting out, no graph ");
    return;
  } else {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("Opting in, graph ");
  }
  graph.nodes().forEach(function(id) {
    const children = graph.children(id);
    if (children.length > 0) {
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn(
        "Cluster identified",
        id,
        " Replacement id in edges: ",
        findNonClusterChild(id, graph)
      );
      descendants[id] = extractDescendants(id, graph);
      clusterDb[id] = { id: findNonClusterChild(id, graph), clusterData: graph.node(id) };
    }
  });
  graph.nodes().forEach(function(id) {
    const children = graph.children(id);
    const edges = graph.edges();
    if (children.length > 0) {
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("Cluster identified", id, descendants);
      edges.forEach((edge) => {
        if (edge.v !== id && edge.w !== id) {
          const d1 = isDescendant(edge.v, id);
          const d2 = isDescendant(edge.w, id);
          if (d1 ^ d2) {
            _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Edge: ", edge, " leaves cluster ", id);
            _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Descendants of XXX ", id, ": ", descendants[id]);
            clusterDb[id].externalConnections = true;
          }
        }
      });
    } else {
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("Not a cluster ", id, descendants);
    }
  });
  for (let id of Object.keys(clusterDb)) {
    const nonClusterChild = clusterDb[id].id;
    const parent = graph.parent(nonClusterChild);
    if (parent !== id && clusterDb[parent] && !clusterDb[parent].externalConnections) {
      clusterDb[id].id = parent;
    }
  }
  graph.edges().forEach(function(e) {
    const edge = graph.edge(e);
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(e));
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(graph.edge(e)));
    let v = e.v;
    let w = e.w;
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn(
      "Fix XXX",
      clusterDb,
      "ids:",
      e.v,
      e.w,
      "Translating: ",
      clusterDb[e.v],
      " --- ",
      clusterDb[e.w]
    );
    if (clusterDb[e.v] && clusterDb[e.w] && clusterDb[e.v] === clusterDb[e.w]) {
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Fixing and trixing link to self - removing XXX", e.v, e.w, e.name);
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Fixing and trixing - removing XXX", e.v, e.w, e.name);
      v = getAnchorId(e.v);
      w = getAnchorId(e.w);
      graph.removeEdge(e.v, e.w, e.name);
      const specialId = e.w + "---" + e.v;
      graph.setNode(specialId, {
        domId: specialId,
        id: specialId,
        labelStyle: "",
        labelText: edge.label,
        padding: 0,
        shape: "labelRect",
        style: ""
      });
      const edge1 = structuredClone(edge);
      const edge2 = structuredClone(edge);
      edge1.label = "";
      edge1.arrowTypeEnd = "none";
      edge2.label = "";
      edge1.fromCluster = e.v;
      edge2.toCluster = e.v;
      graph.setEdge(v, specialId, edge1, e.name + "-cyclic-special");
      graph.setEdge(specialId, w, edge2, e.name + "-cyclic-special");
    } else if (clusterDb[e.v] || clusterDb[e.w]) {
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Fixing and trixing - removing XXX", e.v, e.w, e.name);
      v = getAnchorId(e.v);
      w = getAnchorId(e.w);
      graph.removeEdge(e.v, e.w, e.name);
      if (v !== e.v) {
        const parent = graph.parent(v);
        clusterDb[parent].externalConnections = true;
        edge.fromCluster = e.v;
      }
      if (w !== e.w) {
        const parent = graph.parent(w);
        clusterDb[parent].externalConnections = true;
        edge.toCluster = e.w;
      }
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Fix Replacing with XXX", v, w, e.name);
      graph.setEdge(v, w, edge, e.name);
    }
  });
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Adjusted Graph", dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_1__.write(graph));
  extractor(graph, 0);
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.trace(clusterDb);
};
const extractor = (graph, depth) => {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("extractor - ", depth, dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_1__.write(graph), graph.children("D"));
  if (depth > 10) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.error("Bailing out");
    return;
  }
  let nodes = graph.nodes();
  let hasChildren = false;
  for (const node of nodes) {
    const children = graph.children(node);
    hasChildren = hasChildren || children.length > 0;
  }
  if (!hasChildren) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("Done, no node has children", graph.nodes());
    return;
  }
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("Nodes = ", nodes, depth);
  for (const node of nodes) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.debug(
      "Extracting node",
      node,
      clusterDb,
      clusterDb[node] && !clusterDb[node].externalConnections,
      !graph.parent(node),
      graph.node(node),
      graph.children("D"),
      " Depth ",
      depth
    );
    if (!clusterDb[node]) {
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("Not a cluster", node, depth);
    } else if (!clusterDb[node].externalConnections && // !graph.parent(node) &&
    graph.children(node) && graph.children(node).length > 0) {
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn(
        "Cluster without external connections, without a parent and with children",
        node,
        depth
      );
      const graphSettings = graph.graph();
      let dir = graphSettings.rankdir === "TB" ? "LR" : "TB";
      if (clusterDb[node] && clusterDb[node].clusterData && clusterDb[node].clusterData.dir) {
        dir = clusterDb[node].clusterData.dir;
        _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Fixing dir", clusterDb[node].clusterData.dir, dir);
      }
      const clusterGraph = new dagre_d3_es_src_graphlib_index_js__WEBPACK_IMPORTED_MODULE_2__.Graph({
        multigraph: true,
        compound: true
      }).setGraph({
        rankdir: dir,
        // Todo: set proper spacing
        nodesep: 50,
        ranksep: 50,
        marginx: 8,
        marginy: 8
      }).setDefaultEdgeLabel(function() {
        return {};
      });
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Old graph before copy", dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_1__.write(graph));
      copy(node, graph, clusterGraph, node);
      graph.setNode(node, {
        clusterNode: true,
        id: node,
        clusterData: clusterDb[node].clusterData,
        labelText: clusterDb[node].labelText,
        graph: clusterGraph
      });
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("New graph after copy node: (", node, ")", dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_1__.write(clusterGraph));
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("Old graph after copy", dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_1__.write(graph));
    } else {
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn(
        "Cluster ** ",
        node,
        " **not meeting the criteria !externalConnections:",
        !clusterDb[node].externalConnections,
        " no parent: ",
        !graph.parent(node),
        " children ",
        graph.children(node) && graph.children(node).length > 0,
        graph.children("D"),
        depth
      );
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.debug(clusterDb);
    }
  }
  nodes = graph.nodes();
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("New list of nodes", nodes);
  for (const node of nodes) {
    const data = graph.node(node);
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn(" Now next level", node, data);
    if (data.clusterNode) {
      extractor(data.graph, depth + 1);
    }
  }
};
const sorter = (graph, nodes) => {
  if (nodes.length === 0) {
    return [];
  }
  let result = Object.assign(nodes);
  nodes.forEach((node) => {
    const children = graph.children(node);
    const sorted = sorter(graph, children);
    result = [...result, ...sorted];
  });
  return result;
};
const sortNodesByHierarchy = (graph) => sorter(graph, graph.children());
const rect = (parent, node) => {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Creating subgraph rect for ", node.id, node);
  const siteConfig = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.c)();
  const shapeSvg = parent.insert("g").attr("class", "cluster" + (node.class ? " " + node.class : "")).attr("id", node.id);
  const rect2 = shapeSvg.insert("rect", ":first-child");
  const useHtmlLabels = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.m)(siteConfig.flowchart.htmlLabels);
  const label = shapeSvg.insert("g").attr("class", "cluster-label");
  const text = node.labelType === "markdown" ? (0,_createText_6b48ae7d_js__WEBPACK_IMPORTED_MODULE_5__.a)(label, node.labelText, { style: node.labelStyle, useHtmlLabels }) : label.node().appendChild((0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.c)(node.labelText, node.labelStyle, void 0, true));
  let bbox = text.getBBox();
  if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.m)(siteConfig.flowchart.htmlLabels)) {
    const div = text.children[0];
    const dv = (0,d3__WEBPACK_IMPORTED_MODULE_3__.select)(text);
    bbox = div.getBoundingClientRect();
    dv.attr("width", bbox.width);
    dv.attr("height", bbox.height);
  }
  const padding = 0 * node.padding;
  const halfPadding = padding / 2;
  const width = node.width <= bbox.width + padding ? bbox.width + padding : node.width;
  if (node.width <= bbox.width + padding) {
    node.diff = (bbox.width - node.width) / 2 - node.padding / 2;
  } else {
    node.diff = -node.padding / 2;
  }
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.trace("Data ", node, JSON.stringify(node));
  rect2.attr("style", node.style).attr("rx", node.rx).attr("ry", node.ry).attr("x", node.x - width / 2).attr("y", node.y - node.height / 2 - halfPadding).attr("width", width).attr("height", node.height + padding);
  const { subGraphTitleTopMargin } = (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.g)(siteConfig);
  if (useHtmlLabels) {
    label.attr(
      "transform",
      // This puts the label on top of the box instead of inside it
      `translate(${node.x - bbox.width / 2}, ${node.y - node.height / 2 + subGraphTitleTopMargin})`
    );
  } else {
    label.attr(
      "transform",
      // This puts the label on top of the box instead of inside it
      `translate(${node.x}, ${node.y - node.height / 2 + subGraphTitleTopMargin})`
    );
  }
  const rectBox = rect2.node().getBBox();
  node.width = rectBox.width;
  node.height = rectBox.height;
  node.intersect = function(point) {
    return (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.i)(node, point);
  };
  return shapeSvg;
};
const noteGroup = (parent, node) => {
  const shapeSvg = parent.insert("g").attr("class", "note-cluster").attr("id", node.id);
  const rect2 = shapeSvg.insert("rect", ":first-child");
  const padding = 0 * node.padding;
  const halfPadding = padding / 2;
  rect2.attr("rx", node.rx).attr("ry", node.ry).attr("x", node.x - node.width / 2 - halfPadding).attr("y", node.y - node.height / 2 - halfPadding).attr("width", node.width + padding).attr("height", node.height + padding).attr("fill", "none");
  const rectBox = rect2.node().getBBox();
  node.width = rectBox.width;
  node.height = rectBox.height;
  node.intersect = function(point) {
    return (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.i)(node, point);
  };
  return shapeSvg;
};
const roundedWithTitle = (parent, node) => {
  const siteConfig = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.c)();
  const shapeSvg = parent.insert("g").attr("class", node.classes).attr("id", node.id);
  const rect2 = shapeSvg.insert("rect", ":first-child");
  const label = shapeSvg.insert("g").attr("class", "cluster-label");
  const innerRect = shapeSvg.append("rect");
  const text = label.node().appendChild((0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.c)(node.labelText, node.labelStyle, void 0, true));
  let bbox = text.getBBox();
  if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.m)(siteConfig.flowchart.htmlLabels)) {
    const div = text.children[0];
    const dv = (0,d3__WEBPACK_IMPORTED_MODULE_3__.select)(text);
    bbox = div.getBoundingClientRect();
    dv.attr("width", bbox.width);
    dv.attr("height", bbox.height);
  }
  bbox = text.getBBox();
  const padding = 0 * node.padding;
  const halfPadding = padding / 2;
  const width = node.width <= bbox.width + node.padding ? bbox.width + node.padding : node.width;
  if (node.width <= bbox.width + node.padding) {
    node.diff = (bbox.width + node.padding * 0 - node.width) / 2;
  } else {
    node.diff = -node.padding / 2;
  }
  rect2.attr("class", "outer").attr("x", node.x - width / 2 - halfPadding).attr("y", node.y - node.height / 2 - halfPadding).attr("width", width + padding).attr("height", node.height + padding);
  innerRect.attr("class", "inner").attr("x", node.x - width / 2 - halfPadding).attr("y", node.y - node.height / 2 - halfPadding + bbox.height - 1).attr("width", width + padding).attr("height", node.height + padding - bbox.height - 3);
  const { subGraphTitleTopMargin } = (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.g)(siteConfig);
  label.attr(
    "transform",
    `translate(${node.x - bbox.width / 2}, ${node.y - node.height / 2 - node.padding / 3 + ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.m)(siteConfig.flowchart.htmlLabels) ? 5 : 3) + subGraphTitleTopMargin})`
  );
  const rectBox = rect2.node().getBBox();
  node.height = rectBox.height;
  node.intersect = function(point) {
    return (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.i)(node, point);
  };
  return shapeSvg;
};
const divider = (parent, node) => {
  const shapeSvg = parent.insert("g").attr("class", node.classes).attr("id", node.id);
  const rect2 = shapeSvg.insert("rect", ":first-child");
  const padding = 0 * node.padding;
  const halfPadding = padding / 2;
  rect2.attr("class", "divider").attr("x", node.x - node.width / 2 - halfPadding).attr("y", node.y - node.height / 2).attr("width", node.width + padding).attr("height", node.height + padding);
  const rectBox = rect2.node().getBBox();
  node.width = rectBox.width;
  node.height = rectBox.height;
  node.diff = -node.padding / 2;
  node.intersect = function(point) {
    return (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.i)(node, point);
  };
  return shapeSvg;
};
const shapes = { rect, roundedWithTitle, noteGroup, divider };
let clusterElems = {};
const insertCluster = (elem, node) => {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.trace("Inserting cluster");
  const shape = node.shape || "rect";
  clusterElems[node.id] = shapes[shape](elem, node);
};
const clear = () => {
  clusterElems = {};
};
const recursiveRender = async (_elem, graph, diagramType, id, parentCluster, siteConfig) => {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Graph in recursive render: XXX", dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_1__.write(graph), parentCluster);
  const dir = graph.graph().rankdir;
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.trace("Dir in recursive render - dir:", dir);
  const elem = _elem.insert("g").attr("class", "root");
  if (!graph.nodes()) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("No nodes found for", graph);
  } else {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Recursive render XXX", graph.nodes());
  }
  if (graph.edges().length > 0) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.trace("Recursive edges", graph.edge(graph.edges()[0]));
  }
  const clusters = elem.insert("g").attr("class", "clusters");
  const edgePaths = elem.insert("g").attr("class", "edgePaths");
  const edgeLabels = elem.insert("g").attr("class", "edgeLabels");
  const nodes = elem.insert("g").attr("class", "nodes");
  await Promise.all(
    graph.nodes().map(async function(v) {
      const node = graph.node(v);
      if (parentCluster !== void 0) {
        const data = JSON.parse(JSON.stringify(parentCluster.clusterData));
        _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Setting data for cluster XXX (", v, ") ", data, parentCluster);
        graph.setNode(parentCluster.id, data);
        if (!graph.parent(v)) {
          _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.trace("Setting parent", v, parentCluster.id);
          graph.setParent(v, parentCluster.id, data);
        }
      }
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("(Insert) Node XXX" + v + ": " + JSON.stringify(graph.node(v)));
      if (node && node.clusterNode) {
        _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Cluster identified", v, node.width, graph.node(v));
        const o = await recursiveRender(
          nodes,
          node.graph,
          diagramType,
          id,
          graph.node(v),
          siteConfig
        );
        const newEl = o.elem;
        (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.u)(node, newEl);
        node.diff = o.diff || 0;
        _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Node bounds (abc123)", v, node, node.width, node.x, node.y);
        (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.s)(newEl, node);
        _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Recursive render complete ", newEl, node);
      } else {
        if (graph.children(v).length > 0) {
          _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Cluster - the non recursive path XXX", v, node.id, node, graph);
          _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info(findNonClusterChild(node.id, graph));
          clusterDb[node.id] = { id: findNonClusterChild(node.id, graph), node };
        } else {
          _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Node - the non recursive path", v, node.id, node);
          await (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.e)(nodes, graph.node(v), dir);
        }
      }
    })
  );
  graph.edges().forEach(function(e) {
    const edge = graph.edge(e.v, e.w, e.name);
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(e));
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Edge " + e.v + " -> " + e.w + ": ", e, " ", JSON.stringify(graph.edge(e)));
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Fix", clusterDb, "ids:", e.v, e.w, "Translating: ", clusterDb[e.v], clusterDb[e.w]);
    (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.f)(edgeLabels, edge);
  });
  graph.edges().forEach(function(e) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(e));
  });
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("#############################################");
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("###                Layout                 ###");
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("#############################################");
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info(graph);
  (0,dagre_d3_es_src_dagre_index_js__WEBPACK_IMPORTED_MODULE_0__.layout)(graph);
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Graph after layout:", dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_1__.write(graph));
  let diff = 0;
  const { subGraphTitleTotalMargin } = (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.g)(siteConfig);
  sortNodesByHierarchy(graph).forEach(function(v) {
    const node = graph.node(v);
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Position " + v + ": " + JSON.stringify(graph.node(v)));
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info(
      "Position " + v + ": (" + node.x,
      "," + node.y,
      ") width: ",
      node.width,
      " height: ",
      node.height
    );
    if (node && node.clusterNode) {
      node.y += subGraphTitleTotalMargin;
      (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.p)(node);
    } else {
      if (graph.children(v).length > 0) {
        node.height += subGraphTitleTotalMargin;
        insertCluster(clusters, node);
        clusterDb[node.id].node = node;
      } else {
        node.y += subGraphTitleTotalMargin / 2;
        (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.p)(node);
      }
    }
  });
  graph.edges().forEach(function(e) {
    const edge = graph.edge(e);
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(edge), edge);
    edge.points.forEach((point) => point.y += subGraphTitleTotalMargin / 2);
    const paths = (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.h)(edgePaths, e, edge, clusterDb, diagramType, graph, id);
    (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.j)(edge, paths);
  });
  graph.nodes().forEach(function(v) {
    const n = graph.node(v);
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.info(v, n.type, n.diff);
    if (n.type === "group") {
      diff = n.diff;
    }
  });
  return { elem, diff };
};
const render = async (elem, graph, markers, diagramType, id) => {
  (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.a)(elem, markers, diagramType, id);
  (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.b)();
  (0,_edges_d32062c0_js__WEBPACK_IMPORTED_MODULE_6__.d)();
  clear();
  clear$1();
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Graph at first:", JSON.stringify(dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_1__.write(graph)));
  adjustClustersAndEdges(graph);
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.l.warn("Graph after:", JSON.stringify(dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_1__.write(graph)));
  const siteConfig = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_4__.c)();
  await recursiveRender(elem, graph, diagramType, id, void 0, siteConfig);
};



/***/ }),

/***/ "./node_modules/mermaid/dist/styles-3ed67cfa.js":
/*!******************************************************!*\
  !*** ./node_modules/mermaid/dist/styles-3ed67cfa.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: function() { return /* binding */ flowStyles; },
/* harmony export */   f: function() { return /* binding */ flowRendererV2; }
/* harmony export */ });
/* harmony import */ var dagre_d3_es_src_graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dagre-d3-es/src/graphlib/index.js */ "./node_modules/dagre-d3-es/src/graphlib/index.js");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3 */ "./node_modules/d3/src/index.js");
/* harmony import */ var _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mermaid-f47111a7.js */ "./node_modules/mermaid/dist/mermaid-f47111a7.js");
/* harmony import */ var _index_fc10efb0_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./index-fc10efb0.js */ "./node_modules/mermaid/dist/index-fc10efb0.js");
/* harmony import */ var dagre_d3_es_src_dagre_js_label_add_html_label_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! dagre-d3-es/src/dagre-js/label/add-html-label.js */ "./node_modules/dagre-d3-es/src/dagre-js/label/add-html-label.js");
/* harmony import */ var khroma__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! khroma */ "./node_modules/khroma/dist/methods/channel.js");
/* harmony import */ var khroma__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! khroma */ "./node_modules/khroma/dist/methods/rgba.js");






const conf = {};
const setConf = function(cnf) {
  const keys = Object.keys(cnf);
  for (const key of keys) {
    conf[key] = cnf[key];
  }
};
const addVertices = async function(vert, g, svgId, root, doc, diagObj) {
  const svg = root.select(`[id="${svgId}"]`);
  const keys = Object.keys(vert);
  for (const id of keys) {
    const vertex = vert[id];
    let classStr = "default";
    if (vertex.classes.length > 0) {
      classStr = vertex.classes.join(" ");
    }
    classStr = classStr + " flowchart-label";
    const styles = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.k)(vertex.styles);
    let vertexText = vertex.text !== void 0 ? vertex.text : vertex.id;
    let vertexNode;
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.l.info("vertex", vertex, vertex.labelType);
    if (vertex.labelType === "markdown") {
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.l.info("vertex", vertex, vertex.labelType);
    } else {
      if ((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.m)((0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.c)().flowchart.htmlLabels)) {
        const node = {
          label: vertexText
        };
        vertexNode = (0,dagre_d3_es_src_dagre_js_label_add_html_label_js__WEBPACK_IMPORTED_MODULE_2__.addHtmlLabel)(svg, node).node();
        vertexNode.parentNode.removeChild(vertexNode);
      } else {
        const svgLabel = doc.createElementNS("http://www.w3.org/2000/svg", "text");
        svgLabel.setAttribute("style", styles.labelStyle.replace("color:", "fill:"));
        const rows = vertexText.split(_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.e.lineBreakRegex);
        for (const row of rows) {
          const tspan = doc.createElementNS("http://www.w3.org/2000/svg", "tspan");
          tspan.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
          tspan.setAttribute("dy", "1em");
          tspan.setAttribute("x", "1");
          tspan.textContent = row;
          svgLabel.appendChild(tspan);
        }
        vertexNode = svgLabel;
      }
    }
    let radius = 0;
    let _shape = "";
    switch (vertex.type) {
      case "round":
        radius = 5;
        _shape = "rect";
        break;
      case "square":
        _shape = "rect";
        break;
      case "diamond":
        _shape = "question";
        break;
      case "hexagon":
        _shape = "hexagon";
        break;
      case "odd":
        _shape = "rect_left_inv_arrow";
        break;
      case "lean_right":
        _shape = "lean_right";
        break;
      case "lean_left":
        _shape = "lean_left";
        break;
      case "trapezoid":
        _shape = "trapezoid";
        break;
      case "inv_trapezoid":
        _shape = "inv_trapezoid";
        break;
      case "odd_right":
        _shape = "rect_left_inv_arrow";
        break;
      case "circle":
        _shape = "circle";
        break;
      case "ellipse":
        _shape = "ellipse";
        break;
      case "stadium":
        _shape = "stadium";
        break;
      case "subroutine":
        _shape = "subroutine";
        break;
      case "cylinder":
        _shape = "cylinder";
        break;
      case "group":
        _shape = "rect";
        break;
      case "doublecircle":
        _shape = "doublecircle";
        break;
      default:
        _shape = "rect";
    }
    const labelText = await (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.r)(vertexText, (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.c)());
    g.setNode(vertex.id, {
      labelStyle: styles.labelStyle,
      shape: _shape,
      labelText,
      labelType: vertex.labelType,
      rx: radius,
      ry: radius,
      class: classStr,
      style: styles.style,
      id: vertex.id,
      link: vertex.link,
      linkTarget: vertex.linkTarget,
      tooltip: diagObj.db.getTooltip(vertex.id) || "",
      domId: diagObj.db.lookUpDomId(vertex.id),
      haveCallback: vertex.haveCallback,
      width: vertex.type === "group" ? 500 : void 0,
      dir: vertex.dir,
      type: vertex.type,
      props: vertex.props,
      padding: (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.c)().flowchart.padding
    });
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.l.info("setNode", {
      labelStyle: styles.labelStyle,
      labelType: vertex.labelType,
      shape: _shape,
      labelText,
      rx: radius,
      ry: radius,
      class: classStr,
      style: styles.style,
      id: vertex.id,
      domId: diagObj.db.lookUpDomId(vertex.id),
      width: vertex.type === "group" ? 500 : void 0,
      type: vertex.type,
      dir: vertex.dir,
      props: vertex.props,
      padding: (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.c)().flowchart.padding
    });
  }
};
const addEdges = async function(edges, g, diagObj) {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.l.info("abc78 edges = ", edges);
  let cnt = 0;
  let linkIdCnt = {};
  let defaultStyle;
  let defaultLabelStyle;
  if (edges.defaultStyle !== void 0) {
    const defaultStyles = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.k)(edges.defaultStyle);
    defaultStyle = defaultStyles.style;
    defaultLabelStyle = defaultStyles.labelStyle;
  }
  for (const edge of edges) {
    cnt++;
    const linkIdBase = "L-" + edge.start + "-" + edge.end;
    if (linkIdCnt[linkIdBase] === void 0) {
      linkIdCnt[linkIdBase] = 0;
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.l.info("abc78 new entry", linkIdBase, linkIdCnt[linkIdBase]);
    } else {
      linkIdCnt[linkIdBase]++;
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.l.info("abc78 new entry", linkIdBase, linkIdCnt[linkIdBase]);
    }
    let linkId = linkIdBase + "-" + linkIdCnt[linkIdBase];
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.l.info("abc78 new link id to be used is", linkIdBase, linkId, linkIdCnt[linkIdBase]);
    const linkNameStart = "LS-" + edge.start;
    const linkNameEnd = "LE-" + edge.end;
    const edgeData = { style: "", labelStyle: "" };
    edgeData.minlen = edge.length || 1;
    if (edge.type === "arrow_open") {
      edgeData.arrowhead = "none";
    } else {
      edgeData.arrowhead = "normal";
    }
    edgeData.arrowTypeStart = "arrow_open";
    edgeData.arrowTypeEnd = "arrow_open";
    switch (edge.type) {
      case "double_arrow_cross":
        edgeData.arrowTypeStart = "arrow_cross";
      case "arrow_cross":
        edgeData.arrowTypeEnd = "arrow_cross";
        break;
      case "double_arrow_point":
        edgeData.arrowTypeStart = "arrow_point";
      case "arrow_point":
        edgeData.arrowTypeEnd = "arrow_point";
        break;
      case "double_arrow_circle":
        edgeData.arrowTypeStart = "arrow_circle";
      case "arrow_circle":
        edgeData.arrowTypeEnd = "arrow_circle";
        break;
    }
    let style = "";
    let labelStyle = "";
    switch (edge.stroke) {
      case "normal":
        style = "fill:none;";
        if (defaultStyle !== void 0) {
          style = defaultStyle;
        }
        if (defaultLabelStyle !== void 0) {
          labelStyle = defaultLabelStyle;
        }
        edgeData.thickness = "normal";
        edgeData.pattern = "solid";
        break;
      case "dotted":
        edgeData.thickness = "normal";
        edgeData.pattern = "dotted";
        edgeData.style = "fill:none;stroke-width:2px;stroke-dasharray:3;";
        break;
      case "thick":
        edgeData.thickness = "thick";
        edgeData.pattern = "solid";
        edgeData.style = "stroke-width: 3.5px;fill:none;";
        break;
      case "invisible":
        edgeData.thickness = "invisible";
        edgeData.pattern = "solid";
        edgeData.style = "stroke-width: 0;fill:none;";
        break;
    }
    if (edge.style !== void 0) {
      const styles = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.k)(edge.style);
      style = styles.style;
      labelStyle = styles.labelStyle;
    }
    edgeData.style = edgeData.style += style;
    edgeData.labelStyle = edgeData.labelStyle += labelStyle;
    if (edge.interpolate !== void 0) {
      edgeData.curve = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.n)(edge.interpolate, d3__WEBPACK_IMPORTED_MODULE_1__.curveLinear);
    } else if (edges.defaultInterpolate !== void 0) {
      edgeData.curve = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.n)(edges.defaultInterpolate, d3__WEBPACK_IMPORTED_MODULE_1__.curveLinear);
    } else {
      edgeData.curve = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.n)(conf.curve, d3__WEBPACK_IMPORTED_MODULE_1__.curveLinear);
    }
    if (edge.text === void 0) {
      if (edge.style !== void 0) {
        edgeData.arrowheadStyle = "fill: #333";
      }
    } else {
      edgeData.arrowheadStyle = "fill: #333";
      edgeData.labelpos = "c";
    }
    edgeData.labelType = edge.labelType;
    edgeData.label = await (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.r)(edge.text.replace(_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.e.lineBreakRegex, "\n"), (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.c)());
    if (edge.style === void 0) {
      edgeData.style = edgeData.style || "stroke: #333; stroke-width: 1.5px;fill:none;";
    }
    edgeData.labelStyle = edgeData.labelStyle.replace("color:", "fill:");
    edgeData.id = linkId;
    edgeData.classes = "flowchart-link " + linkNameStart + " " + linkNameEnd;
    g.setEdge(edge.start, edge.end, edgeData, cnt);
  }
};
const getClasses = function(text, diagObj) {
  return diagObj.db.getClasses();
};
const draw = async function(text, id, _version, diagObj) {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.l.info("Drawing flowchart");
  let dir = diagObj.db.getDirection();
  if (dir === void 0) {
    dir = "TD";
  }
  const { securityLevel, flowchart: conf2 } = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.c)();
  const nodeSpacing = conf2.nodeSpacing || 50;
  const rankSpacing = conf2.rankSpacing || 50;
  let sandboxElement;
  if (securityLevel === "sandbox") {
    sandboxElement = (0,d3__WEBPACK_IMPORTED_MODULE_1__.select)("#i" + id);
  }
  const root = securityLevel === "sandbox" ? (0,d3__WEBPACK_IMPORTED_MODULE_1__.select)(sandboxElement.nodes()[0].contentDocument.body) : (0,d3__WEBPACK_IMPORTED_MODULE_1__.select)("body");
  const doc = securityLevel === "sandbox" ? sandboxElement.nodes()[0].contentDocument : document;
  const g = new dagre_d3_es_src_graphlib_index_js__WEBPACK_IMPORTED_MODULE_0__.Graph({
    multigraph: true,
    compound: true
  }).setGraph({
    rankdir: dir,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    marginx: 0,
    marginy: 0
  }).setDefaultEdgeLabel(function() {
    return {};
  });
  let subG;
  const subGraphs = diagObj.db.getSubGraphs();
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.l.info("Subgraphs - ", subGraphs);
  for (let i2 = subGraphs.length - 1; i2 >= 0; i2--) {
    subG = subGraphs[i2];
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.l.info("Subgraph - ", subG);
    diagObj.db.addVertex(
      subG.id,
      { text: subG.title, type: subG.labelType },
      "group",
      void 0,
      subG.classes,
      subG.dir
    );
  }
  const vert = diagObj.db.getVertices();
  const edges = diagObj.db.getEdges();
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.l.info("Edges", edges);
  let i = 0;
  for (i = subGraphs.length - 1; i >= 0; i--) {
    subG = subGraphs[i];
    (0,d3__WEBPACK_IMPORTED_MODULE_1__.selectAll)("cluster").append("text");
    for (let j = 0; j < subG.nodes.length; j++) {
      _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.l.info("Setting up subgraphs", subG.nodes[j], subG.id);
      g.setParent(subG.nodes[j], subG.id);
    }
  }
  await addVertices(vert, g, id, root, doc, diagObj);
  await addEdges(edges, g);
  const svg = root.select(`[id="${id}"]`);
  const element = root.select("#" + id + " g");
  await (0,_index_fc10efb0_js__WEBPACK_IMPORTED_MODULE_4__.r)(element, g, ["point", "circle", "cross"], "flowchart", id);
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.u.insertTitle(svg, "flowchartTitleText", conf2.titleTopMargin, diagObj.db.getDiagramTitle());
  (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_3__.o)(g, svg, conf2.diagramPadding, conf2.useMaxWidth);
  diagObj.db.indexNodes("subGraph" + i);
  if (!conf2.htmlLabels) {
    const labels = doc.querySelectorAll('[id="' + id + '"] .edgeLabel .label');
    for (const label of labels) {
      const dim = label.getBBox();
      const rect = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("rx", 0);
      rect.setAttribute("ry", 0);
      rect.setAttribute("width", dim.width);
      rect.setAttribute("height", dim.height);
      label.insertBefore(rect, label.firstChild);
    }
  }
  const keys = Object.keys(vert);
  keys.forEach(function(key) {
    const vertex = vert[key];
    if (vertex.link) {
      const node = (0,d3__WEBPACK_IMPORTED_MODULE_1__.select)("#" + id + ' [id="' + key + '"]');
      if (node) {
        const link = doc.createElementNS("http://www.w3.org/2000/svg", "a");
        link.setAttributeNS("http://www.w3.org/2000/svg", "class", vertex.classes.join(" "));
        link.setAttributeNS("http://www.w3.org/2000/svg", "href", vertex.link);
        link.setAttributeNS("http://www.w3.org/2000/svg", "rel", "noopener");
        if (securityLevel === "sandbox") {
          link.setAttributeNS("http://www.w3.org/2000/svg", "target", "_top");
        } else if (vertex.linkTarget) {
          link.setAttributeNS("http://www.w3.org/2000/svg", "target", vertex.linkTarget);
        }
        const linkNode = node.insert(function() {
          return link;
        }, ":first-child");
        const shape = node.select(".label-container");
        if (shape) {
          linkNode.append(function() {
            return shape.node();
          });
        }
        const label = node.select(".label");
        if (label) {
          linkNode.append(function() {
            return label.node();
          });
        }
      }
    }
  });
};
const flowRendererV2 = {
  setConf,
  addVertices,
  addEdges,
  getClasses,
  draw
};
const fade = (color, opacity) => {
  const channel = khroma__WEBPACK_IMPORTED_MODULE_5__["default"];
  const r = channel(color, "r");
  const g = channel(color, "g");
  const b = channel(color, "b");
  return khroma__WEBPACK_IMPORTED_MODULE_6__["default"](r, g, b, opacity);
};
const getStyles = (options) => `.label {
    font-family: ${options.fontFamily};
    color: ${options.nodeTextColor || options.textColor};
  }
  .cluster-label text {
    fill: ${options.titleColor};
  }
  .cluster-label span,p {
    color: ${options.titleColor};
  }

  .label text,span,p {
    fill: ${options.nodeTextColor || options.textColor};
    color: ${options.nodeTextColor || options.textColor};
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${options.mainBkg};
    stroke: ${options.nodeBorder};
    stroke-width: 1px;
  }
  .flowchart-label text {
    text-anchor: middle;
  }
  // .flowchart-label .text-outer-tspan {
  //   text-anchor: middle;
  // }
  // .flowchart-label .text-inner-tspan {
  //   text-anchor: start;
  // }

  .node .katex path {
    fill: #000;
    stroke: #000;
    stroke-width: 1px;
  }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${options.arrowheadColor};
  }

  .edgePath .path {
    stroke: ${options.lineColor};
    stroke-width: 2.0px;
  }

  .flowchart-link {
    stroke: ${options.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${options.edgeLabelBackground};
    rect {
      opacity: 0.5;
      background-color: ${options.edgeLabelBackground};
      fill: ${options.edgeLabelBackground};
    }
    text-align: center;
  }

  /* For html labels only */
  .labelBkg {
    background-color: ${fade(options.edgeLabelBackground, 0.5)};
    // background-color: 
  }

  .cluster rect {
    fill: ${options.clusterBkg};
    stroke: ${options.clusterBorder};
    stroke-width: 1px;
  }

  .cluster text {
    fill: ${options.titleColor};
  }

  .cluster span,p {
    color: ${options.titleColor};
  }
  /* .cluster div {
    color: ${options.titleColor};
  } */

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: ${options.fontFamily};
    font-size: 12px;
    background: ${options.tertiaryColor};
    border: 1px solid ${options.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .flowchartTitleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${options.textColor};
  }
`;
const flowStyles = getStyles;



/***/ }),

/***/ "./node_modules/mermaid/dist/styles-991ebdfc.js":
/*!******************************************************!*\
  !*** ./node_modules/mermaid/dist/styles-991ebdfc.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   d: function() { return /* binding */ db; },
/* harmony export */   p: function() { return /* binding */ parser$1; },
/* harmony export */   s: function() { return /* binding */ styles; }
/* harmony export */ });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "./node_modules/d3/src/index.js");
/* harmony import */ var _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mermaid-f47111a7.js */ "./node_modules/mermaid/dist/mermaid-f47111a7.js");


var parser = function() {
  var o = function(k, v, o2, l) {
    for (o2 = o2 || {}, l = k.length; l--; o2[k[l]] = v)
      ;
    return o2;
  }, $V0 = [1, 17], $V1 = [1, 18], $V2 = [1, 19], $V3 = [1, 39], $V4 = [1, 40], $V5 = [1, 25], $V6 = [1, 23], $V7 = [1, 24], $V8 = [1, 31], $V9 = [1, 32], $Va = [1, 33], $Vb = [1, 34], $Vc = [1, 35], $Vd = [1, 36], $Ve = [1, 26], $Vf = [1, 27], $Vg = [1, 28], $Vh = [1, 29], $Vi = [1, 43], $Vj = [1, 30], $Vk = [1, 42], $Vl = [1, 44], $Vm = [1, 41], $Vn = [1, 45], $Vo = [1, 9], $Vp = [1, 8, 9], $Vq = [1, 56], $Vr = [1, 57], $Vs = [1, 58], $Vt = [1, 59], $Vu = [1, 60], $Vv = [1, 61], $Vw = [1, 62], $Vx = [1, 8, 9, 39], $Vy = [1, 74], $Vz = [1, 8, 9, 12, 13, 21, 37, 39, 42, 59, 60, 61, 62, 63, 64, 65, 70, 72], $VA = [1, 8, 9, 12, 13, 19, 21, 37, 39, 42, 46, 59, 60, 61, 62, 63, 64, 65, 70, 72, 74, 80, 95, 97, 98], $VB = [13, 74, 80, 95, 97, 98], $VC = [13, 64, 65, 74, 80, 95, 97, 98], $VD = [13, 59, 60, 61, 62, 63, 74, 80, 95, 97, 98], $VE = [1, 93], $VF = [1, 110], $VG = [1, 108], $VH = [1, 102], $VI = [1, 103], $VJ = [1, 104], $VK = [1, 105], $VL = [1, 106], $VM = [1, 107], $VN = [1, 109], $VO = [1, 8, 9, 37, 39, 42], $VP = [1, 8, 9, 21], $VQ = [1, 8, 9, 78], $VR = [1, 8, 9, 21, 73, 74, 78, 80, 81, 82, 83, 84, 85];
  var parser2 = {
    trace: function trace() {
    },
    yy: {},
    symbols_: { "error": 2, "start": 3, "mermaidDoc": 4, "statements": 5, "graphConfig": 6, "CLASS_DIAGRAM": 7, "NEWLINE": 8, "EOF": 9, "statement": 10, "classLabel": 11, "SQS": 12, "STR": 13, "SQE": 14, "namespaceName": 15, "alphaNumToken": 16, "className": 17, "classLiteralName": 18, "GENERICTYPE": 19, "relationStatement": 20, "LABEL": 21, "namespaceStatement": 22, "classStatement": 23, "memberStatement": 24, "annotationStatement": 25, "clickStatement": 26, "styleStatement": 27, "cssClassStatement": 28, "noteStatement": 29, "direction": 30, "acc_title": 31, "acc_title_value": 32, "acc_descr": 33, "acc_descr_value": 34, "acc_descr_multiline_value": 35, "namespaceIdentifier": 36, "STRUCT_START": 37, "classStatements": 38, "STRUCT_STOP": 39, "NAMESPACE": 40, "classIdentifier": 41, "STYLE_SEPARATOR": 42, "members": 43, "CLASS": 44, "ANNOTATION_START": 45, "ANNOTATION_END": 46, "MEMBER": 47, "SEPARATOR": 48, "relation": 49, "NOTE_FOR": 50, "noteText": 51, "NOTE": 52, "direction_tb": 53, "direction_bt": 54, "direction_rl": 55, "direction_lr": 56, "relationType": 57, "lineType": 58, "AGGREGATION": 59, "EXTENSION": 60, "COMPOSITION": 61, "DEPENDENCY": 62, "LOLLIPOP": 63, "LINE": 64, "DOTTED_LINE": 65, "CALLBACK": 66, "LINK": 67, "LINK_TARGET": 68, "CLICK": 69, "CALLBACK_NAME": 70, "CALLBACK_ARGS": 71, "HREF": 72, "STYLE": 73, "ALPHA": 74, "stylesOpt": 75, "CSSCLASS": 76, "style": 77, "COMMA": 78, "styleComponent": 79, "NUM": 80, "COLON": 81, "UNIT": 82, "SPACE": 83, "BRKT": 84, "PCT": 85, "commentToken": 86, "textToken": 87, "graphCodeTokens": 88, "textNoTagsToken": 89, "TAGSTART": 90, "TAGEND": 91, "==": 92, "--": 93, "DEFAULT": 94, "MINUS": 95, "keywords": 96, "UNICODE_TEXT": 97, "BQUOTE_STR": 98, "$accept": 0, "$end": 1 },
    terminals_: { 2: "error", 7: "CLASS_DIAGRAM", 8: "NEWLINE", 9: "EOF", 12: "SQS", 13: "STR", 14: "SQE", 19: "GENERICTYPE", 21: "LABEL", 31: "acc_title", 32: "acc_title_value", 33: "acc_descr", 34: "acc_descr_value", 35: "acc_descr_multiline_value", 37: "STRUCT_START", 39: "STRUCT_STOP", 40: "NAMESPACE", 42: "STYLE_SEPARATOR", 44: "CLASS", 45: "ANNOTATION_START", 46: "ANNOTATION_END", 47: "MEMBER", 48: "SEPARATOR", 50: "NOTE_FOR", 52: "NOTE", 53: "direction_tb", 54: "direction_bt", 55: "direction_rl", 56: "direction_lr", 59: "AGGREGATION", 60: "EXTENSION", 61: "COMPOSITION", 62: "DEPENDENCY", 63: "LOLLIPOP", 64: "LINE", 65: "DOTTED_LINE", 66: "CALLBACK", 67: "LINK", 68: "LINK_TARGET", 69: "CLICK", 70: "CALLBACK_NAME", 71: "CALLBACK_ARGS", 72: "HREF", 73: "STYLE", 74: "ALPHA", 76: "CSSCLASS", 78: "COMMA", 80: "NUM", 81: "COLON", 82: "UNIT", 83: "SPACE", 84: "BRKT", 85: "PCT", 88: "graphCodeTokens", 90: "TAGSTART", 91: "TAGEND", 92: "==", 93: "--", 94: "DEFAULT", 95: "MINUS", 96: "keywords", 97: "UNICODE_TEXT", 98: "BQUOTE_STR" },
    productions_: [0, [3, 1], [3, 1], [4, 1], [6, 4], [5, 1], [5, 2], [5, 3], [11, 3], [15, 1], [15, 2], [17, 1], [17, 1], [17, 2], [17, 2], [17, 2], [10, 1], [10, 2], [10, 1], [10, 1], [10, 1], [10, 1], [10, 1], [10, 1], [10, 1], [10, 1], [10, 1], [10, 2], [10, 2], [10, 1], [22, 4], [22, 5], [36, 2], [38, 1], [38, 2], [38, 3], [23, 1], [23, 3], [23, 4], [23, 6], [41, 2], [41, 3], [25, 4], [43, 1], [43, 2], [24, 1], [24, 2], [24, 1], [24, 1], [20, 3], [20, 4], [20, 4], [20, 5], [29, 3], [29, 2], [30, 1], [30, 1], [30, 1], [30, 1], [49, 3], [49, 2], [49, 2], [49, 1], [57, 1], [57, 1], [57, 1], [57, 1], [57, 1], [58, 1], [58, 1], [26, 3], [26, 4], [26, 3], [26, 4], [26, 4], [26, 5], [26, 3], [26, 4], [26, 4], [26, 5], [26, 4], [26, 5], [26, 5], [26, 6], [27, 3], [28, 3], [75, 1], [75, 3], [77, 1], [77, 2], [79, 1], [79, 1], [79, 1], [79, 1], [79, 1], [79, 1], [79, 1], [79, 1], [79, 1], [86, 1], [86, 1], [87, 1], [87, 1], [87, 1], [87, 1], [87, 1], [87, 1], [87, 1], [89, 1], [89, 1], [89, 1], [89, 1], [16, 1], [16, 1], [16, 1], [16, 1], [18, 1], [51, 1]],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
      var $0 = $$.length - 1;
      switch (yystate) {
        case 8:
          this.$ = $$[$0 - 1];
          break;
        case 9:
        case 11:
        case 12:
          this.$ = $$[$0];
          break;
        case 10:
        case 13:
          this.$ = $$[$0 - 1] + $$[$0];
          break;
        case 14:
        case 15:
          this.$ = $$[$0 - 1] + "~" + $$[$0] + "~";
          break;
        case 16:
          yy.addRelation($$[$0]);
          break;
        case 17:
          $$[$0 - 1].title = yy.cleanupLabel($$[$0]);
          yy.addRelation($$[$0 - 1]);
          break;
        case 27:
          this.$ = $$[$0].trim();
          yy.setAccTitle(this.$);
          break;
        case 28:
        case 29:
          this.$ = $$[$0].trim();
          yy.setAccDescription(this.$);
          break;
        case 30:
          yy.addClassesToNamespace($$[$0 - 3], $$[$0 - 1]);
          break;
        case 31:
          yy.addClassesToNamespace($$[$0 - 4], $$[$0 - 1]);
          break;
        case 32:
          this.$ = $$[$0];
          yy.addNamespace($$[$0]);
          break;
        case 33:
          this.$ = [$$[$0]];
          break;
        case 34:
          this.$ = [$$[$0 - 1]];
          break;
        case 35:
          $$[$0].unshift($$[$0 - 2]);
          this.$ = $$[$0];
          break;
        case 37:
          yy.setCssClass($$[$0 - 2], $$[$0]);
          break;
        case 38:
          yy.addMembers($$[$0 - 3], $$[$0 - 1]);
          break;
        case 39:
          yy.setCssClass($$[$0 - 5], $$[$0 - 3]);
          yy.addMembers($$[$0 - 5], $$[$0 - 1]);
          break;
        case 40:
          this.$ = $$[$0];
          yy.addClass($$[$0]);
          break;
        case 41:
          this.$ = $$[$0 - 1];
          yy.addClass($$[$0 - 1]);
          yy.setClassLabel($$[$0 - 1], $$[$0]);
          break;
        case 42:
          yy.addAnnotation($$[$0], $$[$0 - 2]);
          break;
        case 43:
          this.$ = [$$[$0]];
          break;
        case 44:
          $$[$0].push($$[$0 - 1]);
          this.$ = $$[$0];
          break;
        case 45:
          break;
        case 46:
          yy.addMember($$[$0 - 1], yy.cleanupLabel($$[$0]));
          break;
        case 47:
          break;
        case 48:
          break;
        case 49:
          this.$ = { "id1": $$[$0 - 2], "id2": $$[$0], relation: $$[$0 - 1], relationTitle1: "none", relationTitle2: "none" };
          break;
        case 50:
          this.$ = { id1: $$[$0 - 3], id2: $$[$0], relation: $$[$0 - 1], relationTitle1: $$[$0 - 2], relationTitle2: "none" };
          break;
        case 51:
          this.$ = { id1: $$[$0 - 3], id2: $$[$0], relation: $$[$0 - 2], relationTitle1: "none", relationTitle2: $$[$0 - 1] };
          break;
        case 52:
          this.$ = { id1: $$[$0 - 4], id2: $$[$0], relation: $$[$0 - 2], relationTitle1: $$[$0 - 3], relationTitle2: $$[$0 - 1] };
          break;
        case 53:
          yy.addNote($$[$0], $$[$0 - 1]);
          break;
        case 54:
          yy.addNote($$[$0]);
          break;
        case 55:
          yy.setDirection("TB");
          break;
        case 56:
          yy.setDirection("BT");
          break;
        case 57:
          yy.setDirection("RL");
          break;
        case 58:
          yy.setDirection("LR");
          break;
        case 59:
          this.$ = { type1: $$[$0 - 2], type2: $$[$0], lineType: $$[$0 - 1] };
          break;
        case 60:
          this.$ = { type1: "none", type2: $$[$0], lineType: $$[$0 - 1] };
          break;
        case 61:
          this.$ = { type1: $$[$0 - 1], type2: "none", lineType: $$[$0] };
          break;
        case 62:
          this.$ = { type1: "none", type2: "none", lineType: $$[$0] };
          break;
        case 63:
          this.$ = yy.relationType.AGGREGATION;
          break;
        case 64:
          this.$ = yy.relationType.EXTENSION;
          break;
        case 65:
          this.$ = yy.relationType.COMPOSITION;
          break;
        case 66:
          this.$ = yy.relationType.DEPENDENCY;
          break;
        case 67:
          this.$ = yy.relationType.LOLLIPOP;
          break;
        case 68:
          this.$ = yy.lineType.LINE;
          break;
        case 69:
          this.$ = yy.lineType.DOTTED_LINE;
          break;
        case 70:
        case 76:
          this.$ = $$[$0 - 2];
          yy.setClickEvent($$[$0 - 1], $$[$0]);
          break;
        case 71:
        case 77:
          this.$ = $$[$0 - 3];
          yy.setClickEvent($$[$0 - 2], $$[$0 - 1]);
          yy.setTooltip($$[$0 - 2], $$[$0]);
          break;
        case 72:
          this.$ = $$[$0 - 2];
          yy.setLink($$[$0 - 1], $$[$0]);
          break;
        case 73:
          this.$ = $$[$0 - 3];
          yy.setLink($$[$0 - 2], $$[$0 - 1], $$[$0]);
          break;
        case 74:
          this.$ = $$[$0 - 3];
          yy.setLink($$[$0 - 2], $$[$0 - 1]);
          yy.setTooltip($$[$0 - 2], $$[$0]);
          break;
        case 75:
          this.$ = $$[$0 - 4];
          yy.setLink($$[$0 - 3], $$[$0 - 2], $$[$0]);
          yy.setTooltip($$[$0 - 3], $$[$0 - 1]);
          break;
        case 78:
          this.$ = $$[$0 - 3];
          yy.setClickEvent($$[$0 - 2], $$[$0 - 1], $$[$0]);
          break;
        case 79:
          this.$ = $$[$0 - 4];
          yy.setClickEvent($$[$0 - 3], $$[$0 - 2], $$[$0 - 1]);
          yy.setTooltip($$[$0 - 3], $$[$0]);
          break;
        case 80:
          this.$ = $$[$0 - 3];
          yy.setLink($$[$0 - 2], $$[$0]);
          break;
        case 81:
          this.$ = $$[$0 - 4];
          yy.setLink($$[$0 - 3], $$[$0 - 1], $$[$0]);
          break;
        case 82:
          this.$ = $$[$0 - 4];
          yy.setLink($$[$0 - 3], $$[$0 - 1]);
          yy.setTooltip($$[$0 - 3], $$[$0]);
          break;
        case 83:
          this.$ = $$[$0 - 5];
          yy.setLink($$[$0 - 4], $$[$0 - 2], $$[$0]);
          yy.setTooltip($$[$0 - 4], $$[$0 - 1]);
          break;
        case 84:
          this.$ = $$[$0 - 2];
          yy.setCssStyle($$[$0 - 1], $$[$0]);
          break;
        case 85:
          yy.setCssClass($$[$0 - 1], $$[$0]);
          break;
        case 86:
          this.$ = [$$[$0]];
          break;
        case 87:
          $$[$0 - 2].push($$[$0]);
          this.$ = $$[$0 - 2];
          break;
        case 89:
          this.$ = $$[$0 - 1] + $$[$0];
          break;
      }
    },
    table: [{ 3: 1, 4: 2, 5: 3, 6: 4, 7: [1, 6], 10: 5, 16: 37, 17: 20, 18: 38, 20: 7, 22: 8, 23: 9, 24: 10, 25: 11, 26: 12, 27: 13, 28: 14, 29: 15, 30: 16, 31: $V0, 33: $V1, 35: $V2, 36: 21, 40: $V3, 41: 22, 44: $V4, 45: $V5, 47: $V6, 48: $V7, 50: $V8, 52: $V9, 53: $Va, 54: $Vb, 55: $Vc, 56: $Vd, 66: $Ve, 67: $Vf, 69: $Vg, 73: $Vh, 74: $Vi, 76: $Vj, 80: $Vk, 95: $Vl, 97: $Vm, 98: $Vn }, { 1: [3] }, { 1: [2, 1] }, { 1: [2, 2] }, { 1: [2, 3] }, o($Vo, [2, 5], { 8: [1, 46] }), { 8: [1, 47] }, o($Vp, [2, 16], { 21: [1, 48] }), o($Vp, [2, 18]), o($Vp, [2, 19]), o($Vp, [2, 20]), o($Vp, [2, 21]), o($Vp, [2, 22]), o($Vp, [2, 23]), o($Vp, [2, 24]), o($Vp, [2, 25]), o($Vp, [2, 26]), { 32: [1, 49] }, { 34: [1, 50] }, o($Vp, [2, 29]), o($Vp, [2, 45], { 49: 51, 57: 54, 58: 55, 13: [1, 52], 21: [1, 53], 59: $Vq, 60: $Vr, 61: $Vs, 62: $Vt, 63: $Vu, 64: $Vv, 65: $Vw }), { 37: [1, 63] }, o($Vx, [2, 36], { 37: [1, 65], 42: [1, 64] }), o($Vp, [2, 47]), o($Vp, [2, 48]), { 16: 66, 74: $Vi, 80: $Vk, 95: $Vl, 97: $Vm }, { 16: 37, 17: 67, 18: 38, 74: $Vi, 80: $Vk, 95: $Vl, 97: $Vm, 98: $Vn }, { 16: 37, 17: 68, 18: 38, 74: $Vi, 80: $Vk, 95: $Vl, 97: $Vm, 98: $Vn }, { 16: 37, 17: 69, 18: 38, 74: $Vi, 80: $Vk, 95: $Vl, 97: $Vm, 98: $Vn }, { 74: [1, 70] }, { 13: [1, 71] }, { 16: 37, 17: 72, 18: 38, 74: $Vi, 80: $Vk, 95: $Vl, 97: $Vm, 98: $Vn }, { 13: $Vy, 51: 73 }, o($Vp, [2, 55]), o($Vp, [2, 56]), o($Vp, [2, 57]), o($Vp, [2, 58]), o($Vz, [2, 11], { 16: 37, 18: 38, 17: 75, 19: [1, 76], 74: $Vi, 80: $Vk, 95: $Vl, 97: $Vm, 98: $Vn }), o($Vz, [2, 12], { 19: [1, 77] }), { 15: 78, 16: 79, 74: $Vi, 80: $Vk, 95: $Vl, 97: $Vm }, { 16: 37, 17: 80, 18: 38, 74: $Vi, 80: $Vk, 95: $Vl, 97: $Vm, 98: $Vn }, o($VA, [2, 112]), o($VA, [2, 113]), o($VA, [2, 114]), o($VA, [2, 115]), o([1, 8, 9, 12, 13, 19, 21, 37, 39, 42, 59, 60, 61, 62, 63, 64, 65, 70, 72], [2, 116]), o($Vo, [2, 6], { 10: 5, 20: 7, 22: 8, 23: 9, 24: 10, 25: 11, 26: 12, 27: 13, 28: 14, 29: 15, 30: 16, 17: 20, 36: 21, 41: 22, 16: 37, 18: 38, 5: 81, 31: $V0, 33: $V1, 35: $V2, 40: $V3, 44: $V4, 45: $V5, 47: $V6, 48: $V7, 50: $V8, 52: $V9, 53: $Va, 54: $Vb, 55: $Vc, 56: $Vd, 66: $Ve, 67: $Vf, 69: $Vg, 73: $Vh, 74: $Vi, 76: $Vj, 80: $Vk, 95: $Vl, 97: $Vm, 98: $Vn }), { 5: 82, 10: 5, 16: 37, 17: 20, 18: 38, 20: 7, 22: 8, 23: 9, 24: 10, 25: 11, 26: 12, 27: 13, 28: 14, 29: 15, 30: 16, 31: $V0, 33: $V1, 35: $V2, 36: 21, 40: $V3, 41: 22, 44: $V4, 45: $V5, 47: $V6, 48: $V7, 50: $V8, 52: $V9, 53: $Va, 54: $Vb, 55: $Vc, 56: $Vd, 66: $Ve, 67: $Vf, 69: $Vg, 73: $Vh, 74: $Vi, 76: $Vj, 80: $Vk, 95: $Vl, 97: $Vm, 98: $Vn }, o($Vp, [2, 17]), o($Vp, [2, 27]), o($Vp, [2, 28]), { 13: [1, 84], 16: 37, 17: 83, 18: 38, 74: $Vi, 80: $Vk, 95: $Vl, 97: $Vm, 98: $Vn }, { 49: 85, 57: 54, 58: 55, 59: $Vq, 60: $Vr, 61: $Vs, 62: $Vt, 63: $Vu, 64: $Vv, 65: $Vw }, o($Vp, [2, 46]), { 58: 86, 64: $Vv, 65: $Vw }, o($VB, [2, 62], { 57: 87, 59: $Vq, 60: $Vr, 61: $Vs, 62: $Vt, 63: $Vu }), o($VC, [2, 63]), o($VC, [2, 64]), o($VC, [2, 65]), o($VC, [2, 66]), o($VC, [2, 67]), o($VD, [2, 68]), o($VD, [2, 69]), { 8: [1, 89], 23: 90, 38: 88, 41: 22, 44: $V4 }, { 16: 91, 74: $Vi, 80: $Vk, 95: $Vl, 97: $Vm }, { 43: 92, 47: $VE }, { 46: [1, 94] }, { 13: [1, 95] }, { 13: [1, 96] }, { 70: [1, 97], 72: [1, 98] }, { 21: $VF, 73: $VG, 74: $VH, 75: 99, 77: 100, 79: 101, 80: $VI, 81: $VJ, 82: $VK, 83: $VL, 84: $VM, 85: $VN }, { 74: [1, 111] }, { 13: $Vy, 51: 112 }, o($Vp, [2, 54]), o($Vp, [2, 117]), o($Vz, [2, 13]), o($Vz, [2, 14]), o($Vz, [2, 15]), { 37: [2, 32] }, { 15: 113, 16: 79, 37: [2, 9], 74: $Vi, 80: $Vk, 95: $Vl, 97: $Vm }, o($VO, [2, 40], { 11: 114, 12: [1, 115] }), o($Vo, [2, 7]), { 9: [1, 116] }, o($VP, [2, 49]), { 16: 37, 17: 117, 18: 38, 74: $Vi, 80: $Vk, 95: $Vl, 97: $Vm, 98: $Vn }, { 13: [1, 119], 16: 37, 17: 118, 18: 38, 74: $Vi, 80: $Vk, 95: $Vl, 97: $Vm, 98: $Vn }, o($VB, [2, 61], { 57: 120, 59: $Vq, 60: $Vr, 61: $Vs, 62: $Vt, 63: $Vu }), o($VB, [2, 60]), { 39: [1, 121] }, { 23: 90, 38: 122, 41: 22, 44: $V4 }, { 8: [1, 123], 39: [2, 33] }, o($Vx, [2, 37], { 37: [1, 124] }), { 39: [1, 125] }, { 39: [2, 43], 43: 126, 47: $VE }, { 16: 37, 17: 127, 18: 38, 74: $Vi, 80: $Vk, 95: $Vl, 97: $Vm, 98: $Vn }, o($Vp, [2, 70], { 13: [1, 128] }), o($Vp, [2, 72], { 13: [1, 130], 68: [1, 129] }), o($Vp, [2, 76], { 13: [1, 131], 71: [1, 132] }), { 13: [1, 133] }, o($Vp, [2, 84], { 78: [1, 134] }), o($VQ, [2, 86], { 79: 135, 21: $VF, 73: $VG, 74: $VH, 80: $VI, 81: $VJ, 82: $VK, 83: $VL, 84: $VM, 85: $VN }), o($VR, [2, 88]), o($VR, [2, 90]), o($VR, [2, 91]), o($VR, [2, 92]), o($VR, [2, 93]), o($VR, [2, 94]), o($VR, [2, 95]), o($VR, [2, 96]), o($VR, [2, 97]), o($VR, [2, 98]), o($Vp, [2, 85]), o($Vp, [2, 53]), { 37: [2, 10] }, o($VO, [2, 41]), { 13: [1, 136] }, { 1: [2, 4] }, o($VP, [2, 51]), o($VP, [2, 50]), { 16: 37, 17: 137, 18: 38, 74: $Vi, 80: $Vk, 95: $Vl, 97: $Vm, 98: $Vn }, o($VB, [2, 59]), o($Vp, [2, 30]), { 39: [1, 138] }, { 23: 90, 38: 139, 39: [2, 34], 41: 22, 44: $V4 }, { 43: 140, 47: $VE }, o($Vx, [2, 38]), { 39: [2, 44] }, o($Vp, [2, 42]), o($Vp, [2, 71]), o($Vp, [2, 73]), o($Vp, [2, 74], { 68: [1, 141] }), o($Vp, [2, 77]), o($Vp, [2, 78], { 13: [1, 142] }), o($Vp, [2, 80], { 13: [1, 144], 68: [1, 143] }), { 21: $VF, 73: $VG, 74: $VH, 77: 145, 79: 101, 80: $VI, 81: $VJ, 82: $VK, 83: $VL, 84: $VM, 85: $VN }, o($VR, [2, 89]), { 14: [1, 146] }, o($VP, [2, 52]), o($Vp, [2, 31]), { 39: [2, 35] }, { 39: [1, 147] }, o($Vp, [2, 75]), o($Vp, [2, 79]), o($Vp, [2, 81]), o($Vp, [2, 82], { 68: [1, 148] }), o($VQ, [2, 87], { 79: 135, 21: $VF, 73: $VG, 74: $VH, 80: $VI, 81: $VJ, 82: $VK, 83: $VL, 84: $VM, 85: $VN }), o($VO, [2, 8]), o($Vx, [2, 39]), o($Vp, [2, 83])],
    defaultActions: { 2: [2, 1], 3: [2, 2], 4: [2, 3], 78: [2, 32], 113: [2, 10], 116: [2, 4], 126: [2, 44], 139: [2, 35] },
    parseError: function parseError(str, hash) {
      if (hash.recoverable) {
        this.trace(str);
      } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
      }
    },
    parse: function parse(input) {
      var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, TERROR = 2, EOF = 1;
      var args = lstack.slice.call(arguments, 1);
      var lexer2 = Object.create(this.lexer);
      var sharedState = { yy: {} };
      for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
          sharedState.yy[k] = this.yy[k];
        }
      }
      lexer2.setInput(input, sharedState.yy);
      sharedState.yy.lexer = lexer2;
      sharedState.yy.parser = this;
      if (typeof lexer2.yylloc == "undefined") {
        lexer2.yylloc = {};
      }
      var yyloc = lexer2.yylloc;
      lstack.push(yyloc);
      var ranges = lexer2.options && lexer2.options.ranges;
      if (typeof sharedState.yy.parseError === "function") {
        this.parseError = sharedState.yy.parseError;
      } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
      }
      function lex() {
        var token;
        token = tstack.pop() || lexer2.lex() || EOF;
        if (typeof token !== "number") {
          if (token instanceof Array) {
            tstack = token;
            token = tstack.pop();
          }
          token = self.symbols_[token] || token;
        }
        return token;
      }
      var symbol, state, action, r, yyval = {}, p, len, newState, expected;
      while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
          action = this.defaultActions[state];
        } else {
          if (symbol === null || typeof symbol == "undefined") {
            symbol = lex();
          }
          action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
          var errStr = "";
          expected = [];
          for (p in table[state]) {
            if (this.terminals_[p] && p > TERROR) {
              expected.push("'" + this.terminals_[p] + "'");
            }
          }
          if (lexer2.showPosition) {
            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + lexer2.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
          } else {
            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
          }
          this.parseError(errStr, {
            text: lexer2.match,
            token: this.terminals_[symbol] || symbol,
            line: lexer2.yylineno,
            loc: yyloc,
            expected
          });
        }
        if (action[0] instanceof Array && action.length > 1) {
          throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
          case 1:
            stack.push(symbol);
            vstack.push(lexer2.yytext);
            lstack.push(lexer2.yylloc);
            stack.push(action[1]);
            symbol = null;
            {
              yyleng = lexer2.yyleng;
              yytext = lexer2.yytext;
              yylineno = lexer2.yylineno;
              yyloc = lexer2.yylloc;
            }
            break;
          case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
              first_line: lstack[lstack.length - (len || 1)].first_line,
              last_line: lstack[lstack.length - 1].last_line,
              first_column: lstack[lstack.length - (len || 1)].first_column,
              last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
              yyval._$.range = [
                lstack[lstack.length - (len || 1)].range[0],
                lstack[lstack.length - 1].range[1]
              ];
            }
            r = this.performAction.apply(yyval, [
              yytext,
              yyleng,
              yylineno,
              sharedState.yy,
              action[1],
              vstack,
              lstack
            ].concat(args));
            if (typeof r !== "undefined") {
              return r;
            }
            if (len) {
              stack = stack.slice(0, -1 * len * 2);
              vstack = vstack.slice(0, -1 * len);
              lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
          case 3:
            return true;
        }
      }
      return true;
    }
  };
  var lexer = function() {
    var lexer2 = {
      EOF: 1,
      parseError: function parseError(str, hash) {
        if (this.yy.parser) {
          this.yy.parser.parseError(str, hash);
        } else {
          throw new Error(str);
        }
      },
      // resets the lexer, sets new input
      setInput: function(input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = "";
        this.conditionStack = ["INITIAL"];
        this.yylloc = {
          first_line: 1,
          first_column: 0,
          last_line: 1,
          last_column: 0
        };
        if (this.options.ranges) {
          this.yylloc.range = [0, 0];
        }
        this.offset = 0;
        return this;
      },
      // consumes and returns one char from the input
      input: function() {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno++;
          this.yylloc.last_line++;
        } else {
          this.yylloc.last_column++;
        }
        if (this.options.ranges) {
          this.yylloc.range[1]++;
        }
        this._input = this._input.slice(1);
        return ch;
      },
      // unshifts one char (or a string) into the input
      unput: function(ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);
        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);
        if (lines.length - 1) {
          this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;
        this.yylloc = {
          first_line: this.yylloc.first_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.first_column,
          last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
        };
        if (this.options.ranges) {
          this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
      },
      // When called from action, caches matched text and appends it on next action
      more: function() {
        this._more = true;
        return this;
      },
      // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
      reject: function() {
        if (this.options.backtrack_lexer) {
          this._backtrack = true;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
        return this;
      },
      // retain first n characters of the match
      less: function(n) {
        this.unput(this.match.slice(n));
      },
      // displays already matched input, i.e. for error messages
      pastInput: function() {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
      },
      // displays upcoming input, i.e. for error messages
      upcomingInput: function() {
        var next = this.match;
        if (next.length < 20) {
          next += this._input.substr(0, 20 - next.length);
        }
        return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
      },
      // displays the character position where the lexing error occurred, i.e. for error messages
      showPosition: function() {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
      },
      // test the lexed token: return FALSE when not a match, otherwise return token
      test_match: function(match, indexed_rule) {
        var token, lines, backup;
        if (this.options.backtrack_lexer) {
          backup = {
            yylineno: this.yylineno,
            yylloc: {
              first_line: this.yylloc.first_line,
              last_line: this.last_line,
              first_column: this.yylloc.first_column,
              last_column: this.yylloc.last_column
            },
            yytext: this.yytext,
            match: this.match,
            matches: this.matches,
            matched: this.matched,
            yyleng: this.yyleng,
            offset: this.offset,
            _more: this._more,
            _input: this._input,
            yy: this.yy,
            conditionStack: this.conditionStack.slice(0),
            done: this.done
          };
          if (this.options.ranges) {
            backup.yylloc.range = this.yylloc.range.slice(0);
          }
        }
        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno += lines.length;
        }
        this.yylloc = {
          first_line: this.yylloc.last_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.last_column,
          last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
          this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
          this.done = false;
        }
        if (token) {
          return token;
        } else if (this._backtrack) {
          for (var k in backup) {
            this[k] = backup[k];
          }
          return false;
        }
        return false;
      },
      // return next match in input
      next: function() {
        if (this.done) {
          return this.EOF;
        }
        if (!this._input) {
          this.done = true;
        }
        var token, match, tempMatch, index;
        if (!this._more) {
          this.yytext = "";
          this.match = "";
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
          tempMatch = this._input.match(this.rules[rules[i]]);
          if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
            match = tempMatch;
            index = i;
            if (this.options.backtrack_lexer) {
              token = this.test_match(tempMatch, rules[i]);
              if (token !== false) {
                return token;
              } else if (this._backtrack) {
                match = false;
                continue;
              } else {
                return false;
              }
            } else if (!this.options.flex) {
              break;
            }
          }
        }
        if (match) {
          token = this.test_match(match, rules[index]);
          if (token !== false) {
            return token;
          }
          return false;
        }
        if (this._input === "") {
          return this.EOF;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
      },
      // return next match that has a token
      lex: function lex() {
        var r = this.next();
        if (r) {
          return r;
        } else {
          return this.lex();
        }
      },
      // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
      begin: function begin(condition) {
        this.conditionStack.push(condition);
      },
      // pop the previously active lexer condition state off the condition stack
      popState: function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
          return this.conditionStack.pop();
        } else {
          return this.conditionStack[0];
        }
      },
      // produce the lexer rule set which is active for the currently active lexer condition state
      _currentRules: function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
          return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
          return this.conditions["INITIAL"].rules;
        }
      },
      // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
      topState: function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
          return this.conditionStack[n];
        } else {
          return "INITIAL";
        }
      },
      // alias for begin(condition)
      pushState: function pushState(condition) {
        this.begin(condition);
      },
      // return the number of states currently on the stack
      stateStackSize: function stateStackSize() {
        return this.conditionStack.length;
      },
      options: {},
      performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
        switch ($avoiding_name_collisions) {
          case 0:
            return 53;
          case 1:
            return 54;
          case 2:
            return 55;
          case 3:
            return 56;
          case 4:
            break;
          case 5:
            break;
          case 6:
            this.begin("acc_title");
            return 31;
          case 7:
            this.popState();
            return "acc_title_value";
          case 8:
            this.begin("acc_descr");
            return 33;
          case 9:
            this.popState();
            return "acc_descr_value";
          case 10:
            this.begin("acc_descr_multiline");
            break;
          case 11:
            this.popState();
            break;
          case 12:
            return "acc_descr_multiline_value";
          case 13:
            return 8;
          case 14:
            break;
          case 15:
            return 7;
          case 16:
            return 7;
          case 17:
            return "EDGE_STATE";
          case 18:
            this.begin("callback_name");
            break;
          case 19:
            this.popState();
            break;
          case 20:
            this.popState();
            this.begin("callback_args");
            break;
          case 21:
            return 70;
          case 22:
            this.popState();
            break;
          case 23:
            return 71;
          case 24:
            this.popState();
            break;
          case 25:
            return "STR";
          case 26:
            this.begin("string");
            break;
          case 27:
            return 73;
          case 28:
            this.begin("namespace");
            return 40;
          case 29:
            this.popState();
            return 8;
          case 30:
            break;
          case 31:
            this.begin("namespace-body");
            return 37;
          case 32:
            this.popState();
            return 39;
          case 33:
            return "EOF_IN_STRUCT";
          case 34:
            return 8;
          case 35:
            break;
          case 36:
            return "EDGE_STATE";
          case 37:
            this.begin("class");
            return 44;
          case 38:
            this.popState();
            return 8;
          case 39:
            break;
          case 40:
            this.popState();
            this.popState();
            return 39;
          case 41:
            this.begin("class-body");
            return 37;
          case 42:
            this.popState();
            return 39;
          case 43:
            return "EOF_IN_STRUCT";
          case 44:
            return "EDGE_STATE";
          case 45:
            return "OPEN_IN_STRUCT";
          case 46:
            break;
          case 47:
            return "MEMBER";
          case 48:
            return 76;
          case 49:
            return 66;
          case 50:
            return 67;
          case 51:
            return 69;
          case 52:
            return 50;
          case 53:
            return 52;
          case 54:
            return 45;
          case 55:
            return 46;
          case 56:
            return 72;
          case 57:
            this.popState();
            break;
          case 58:
            return "GENERICTYPE";
          case 59:
            this.begin("generic");
            break;
          case 60:
            this.popState();
            break;
          case 61:
            return "BQUOTE_STR";
          case 62:
            this.begin("bqstring");
            break;
          case 63:
            return 68;
          case 64:
            return 68;
          case 65:
            return 68;
          case 66:
            return 68;
          case 67:
            return 60;
          case 68:
            return 60;
          case 69:
            return 62;
          case 70:
            return 62;
          case 71:
            return 61;
          case 72:
            return 59;
          case 73:
            return 63;
          case 74:
            return 64;
          case 75:
            return 65;
          case 76:
            return 21;
          case 77:
            return 42;
          case 78:
            return 95;
          case 79:
            return "DOT";
          case 80:
            return "PLUS";
          case 81:
            return 81;
          case 82:
            return 78;
          case 83:
            return 84;
          case 84:
            return 84;
          case 85:
            return 85;
          case 86:
            return "EQUALS";
          case 87:
            return "EQUALS";
          case 88:
            return 74;
          case 89:
            return 12;
          case 90:
            return 14;
          case 91:
            return "PUNCTUATION";
          case 92:
            return 80;
          case 93:
            return 97;
          case 94:
            return 83;
          case 95:
            return 83;
          case 96:
            return 9;
        }
      },
      rules: [/^(?:.*direction\s+TB[^\n]*)/, /^(?:.*direction\s+BT[^\n]*)/, /^(?:.*direction\s+RL[^\n]*)/, /^(?:.*direction\s+LR[^\n]*)/, /^(?:%%(?!\{)*[^\n]*(\r?\n?)+)/, /^(?:%%[^\n]*(\r?\n)*)/, /^(?:accTitle\s*:\s*)/, /^(?:(?!\n||)*[^\n]*)/, /^(?:accDescr\s*:\s*)/, /^(?:(?!\n||)*[^\n]*)/, /^(?:accDescr\s*\{\s*)/, /^(?:[\}])/, /^(?:[^\}]*)/, /^(?:\s*(\r?\n)+)/, /^(?:\s+)/, /^(?:classDiagram-v2\b)/, /^(?:classDiagram\b)/, /^(?:\[\*\])/, /^(?:call[\s]+)/, /^(?:\([\s]*\))/, /^(?:\()/, /^(?:[^(]*)/, /^(?:\))/, /^(?:[^)]*)/, /^(?:["])/, /^(?:[^"]*)/, /^(?:["])/, /^(?:style\b)/, /^(?:namespace\b)/, /^(?:\s*(\r?\n)+)/, /^(?:\s+)/, /^(?:[{])/, /^(?:[}])/, /^(?:$)/, /^(?:\s*(\r?\n)+)/, /^(?:\s+)/, /^(?:\[\*\])/, /^(?:class\b)/, /^(?:\s*(\r?\n)+)/, /^(?:\s+)/, /^(?:[}])/, /^(?:[{])/, /^(?:[}])/, /^(?:$)/, /^(?:\[\*\])/, /^(?:[{])/, /^(?:[\n])/, /^(?:[^{}\n]*)/, /^(?:cssClass\b)/, /^(?:callback\b)/, /^(?:link\b)/, /^(?:click\b)/, /^(?:note for\b)/, /^(?:note\b)/, /^(?:<<)/, /^(?:>>)/, /^(?:href\b)/, /^(?:[~])/, /^(?:[^~]*)/, /^(?:~)/, /^(?:[`])/, /^(?:[^`]+)/, /^(?:[`])/, /^(?:_self\b)/, /^(?:_blank\b)/, /^(?:_parent\b)/, /^(?:_top\b)/, /^(?:\s*<\|)/, /^(?:\s*\|>)/, /^(?:\s*>)/, /^(?:\s*<)/, /^(?:\s*\*)/, /^(?:\s*o\b)/, /^(?:\s*\(\))/, /^(?:--)/, /^(?:\.\.)/, /^(?::{1}[^:\n;]+)/, /^(?::{3})/, /^(?:-)/, /^(?:\.)/, /^(?:\+)/, /^(?::)/, /^(?:,)/, /^(?:#)/, /^(?:#)/, /^(?:%)/, /^(?:=)/, /^(?:=)/, /^(?:\w+)/, /^(?:\[)/, /^(?:\])/, /^(?:[!"#$%&'*+,-.`?\\/])/, /^(?:[0-9]+)/, /^(?:[\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6]|[\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377]|[\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5]|[\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA]|[\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE]|[\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA]|[\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0]|[\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977]|[\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2]|[\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A]|[\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39]|[\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8]|[\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C]|[\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C]|[\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99]|[\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0]|[\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D]|[\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3]|[\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10]|[\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1]|[\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81]|[\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3]|[\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6]|[\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A]|[\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081]|[\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D]|[\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0]|[\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310]|[\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C]|[\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711]|[\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7]|[\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C]|[\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16]|[\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF]|[\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC]|[\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D]|[\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D]|[\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3]|[\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F]|[\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128]|[\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184]|[\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3]|[\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6]|[\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE]|[\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C]|[\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D]|[\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC]|[\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B]|[\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788]|[\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805]|[\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB]|[\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28]|[\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5]|[\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4]|[\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E]|[\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D]|[\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36]|[\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D]|[\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC]|[\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF]|[\uFFD2-\uFFD7\uFFDA-\uFFDC])/, /^(?:\s)/, /^(?:\s)/, /^(?:$)/],
      conditions: { "namespace-body": { "rules": [26, 32, 33, 34, 35, 36, 37, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96], "inclusive": false }, "namespace": { "rules": [26, 28, 29, 30, 31, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96], "inclusive": false }, "class-body": { "rules": [26, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96], "inclusive": false }, "class": { "rules": [26, 38, 39, 40, 41, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96], "inclusive": false }, "acc_descr_multiline": { "rules": [11, 12, 26, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96], "inclusive": false }, "acc_descr": { "rules": [9, 26, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96], "inclusive": false }, "acc_title": { "rules": [7, 26, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96], "inclusive": false }, "callback_args": { "rules": [22, 23, 26, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96], "inclusive": false }, "callback_name": { "rules": [19, 20, 21, 26, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96], "inclusive": false }, "href": { "rules": [26, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96], "inclusive": false }, "struct": { "rules": [26, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96], "inclusive": false }, "generic": { "rules": [26, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96], "inclusive": false }, "bqstring": { "rules": [26, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96], "inclusive": false }, "string": { "rules": [24, 25, 26, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96], "inclusive": false }, "INITIAL": { "rules": [0, 1, 2, 3, 4, 5, 6, 8, 10, 13, 14, 15, 16, 17, 18, 26, 27, 28, 37, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96], "inclusive": true } }
    };
    return lexer2;
  }();
  parser2.lexer = lexer;
  function Parser() {
    this.yy = {};
  }
  Parser.prototype = parser2;
  parser2.Parser = Parser;
  return new Parser();
}();
parser.parser = parser;
const parser$1 = parser;
const visibilityValues = ["#", "+", "~", "-", ""];
class ClassMember {
  constructor(input, memberType) {
    this.memberType = memberType;
    this.visibility = "";
    this.classifier = "";
    const sanitizedInput = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.d)(input, (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)());
    this.parseMember(sanitizedInput);
  }
  getDisplayDetails() {
    let displayText = this.visibility + (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.x)(this.id);
    if (this.memberType === "method") {
      displayText += `(${(0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.x)(this.parameters.trim())})`;
      if (this.returnType) {
        displayText += " : " + (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.x)(this.returnType);
      }
    }
    displayText = displayText.trim();
    const cssStyle = this.parseClassifier();
    return {
      displayText,
      cssStyle
    };
  }
  parseMember(input) {
    let potentialClassifier = "";
    if (this.memberType === "method") {
      const methodRegEx = /([#+~-])?(.+)\((.*)\)([\s$*])?(.*)([$*])?/;
      const match = input.match(methodRegEx);
      if (match) {
        const detectedVisibility = match[1] ? match[1].trim() : "";
        if (visibilityValues.includes(detectedVisibility)) {
          this.visibility = detectedVisibility;
        }
        this.id = match[2].trim();
        this.parameters = match[3] ? match[3].trim() : "";
        potentialClassifier = match[4] ? match[4].trim() : "";
        this.returnType = match[5] ? match[5].trim() : "";
        if (potentialClassifier === "") {
          const lastChar = this.returnType.substring(this.returnType.length - 1);
          if (lastChar.match(/[$*]/)) {
            potentialClassifier = lastChar;
            this.returnType = this.returnType.substring(0, this.returnType.length - 1);
          }
        }
      }
    } else {
      const length = input.length;
      const firstChar = input.substring(0, 1);
      const lastChar = input.substring(length - 1);
      if (visibilityValues.includes(firstChar)) {
        this.visibility = firstChar;
      }
      if (lastChar.match(/[$*]/)) {
        potentialClassifier = lastChar;
      }
      this.id = input.substring(
        this.visibility === "" ? 0 : 1,
        potentialClassifier === "" ? length : length - 1
      );
    }
    this.classifier = potentialClassifier;
  }
  parseClassifier() {
    switch (this.classifier) {
      case "*":
        return "font-style:italic;";
      case "$":
        return "text-decoration:underline;";
      default:
        return "";
    }
  }
}
const MERMAID_DOM_ID_PREFIX = "classId-";
let relations = [];
let classes = {};
let notes = [];
let classCounter = 0;
let namespaces = {};
let namespaceCounter = 0;
let functions = [];
const sanitizeText = (txt) => _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.e.sanitizeText(txt, (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)());
const splitClassNameAndType = function(_id) {
  const id = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.e.sanitizeText(_id, (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)());
  let genericType = "";
  let className = id;
  if (id.indexOf("~") > 0) {
    const split = id.split("~");
    className = sanitizeText(split[0]);
    genericType = sanitizeText(split[1]);
  }
  return { className, type: genericType };
};
const setClassLabel = function(_id, label) {
  const id = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.e.sanitizeText(_id, (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)());
  if (label) {
    label = sanitizeText(label);
  }
  const { className } = splitClassNameAndType(id);
  classes[className].label = label;
};
const addClass = function(_id) {
  const id = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.e.sanitizeText(_id, (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)());
  const { className, type } = splitClassNameAndType(id);
  if (Object.hasOwn(classes, className)) {
    return;
  }
  const name = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.e.sanitizeText(className, (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)());
  classes[name] = {
    id: name,
    type,
    label: name,
    cssClasses: [],
    methods: [],
    members: [],
    annotations: [],
    styles: [],
    domId: MERMAID_DOM_ID_PREFIX + name + "-" + classCounter
  };
  classCounter++;
};
const lookUpDomId = function(_id) {
  const id = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.e.sanitizeText(_id, (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)());
  if (id in classes) {
    return classes[id].domId;
  }
  throw new Error("Class not found: " + id);
};
const clear = function() {
  relations = [];
  classes = {};
  notes = [];
  functions = [];
  functions.push(setupToolTips);
  namespaces = {};
  namespaceCounter = 0;
  (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.v)();
};
const getClass = function(id) {
  return classes[id];
};
const getClasses = function() {
  return classes;
};
const getRelations = function() {
  return relations;
};
const getNotes = function() {
  return notes;
};
const addRelation = function(relation) {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.l.debug("Adding relation: " + JSON.stringify(relation));
  addClass(relation.id1);
  addClass(relation.id2);
  relation.id1 = splitClassNameAndType(relation.id1).className;
  relation.id2 = splitClassNameAndType(relation.id2).className;
  relation.relationTitle1 = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.e.sanitizeText(relation.relationTitle1.trim(), (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)());
  relation.relationTitle2 = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.e.sanitizeText(relation.relationTitle2.trim(), (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)());
  relations.push(relation);
};
const addAnnotation = function(className, annotation) {
  const validatedClassName = splitClassNameAndType(className).className;
  classes[validatedClassName].annotations.push(annotation);
};
const addMember = function(className, member) {
  addClass(className);
  const validatedClassName = splitClassNameAndType(className).className;
  const theClass = classes[validatedClassName];
  if (typeof member === "string") {
    const memberString = member.trim();
    if (memberString.startsWith("<<") && memberString.endsWith(">>")) {
      theClass.annotations.push(sanitizeText(memberString.substring(2, memberString.length - 2)));
    } else if (memberString.indexOf(")") > 0) {
      theClass.methods.push(new ClassMember(memberString, "method"));
    } else if (memberString) {
      theClass.members.push(new ClassMember(memberString, "attribute"));
    }
  }
};
const addMembers = function(className, members) {
  if (Array.isArray(members)) {
    members.reverse();
    members.forEach((member) => addMember(className, member));
  }
};
const addNote = function(text, className) {
  const note = {
    id: `note${notes.length}`,
    class: className,
    text
  };
  notes.push(note);
};
const cleanupLabel = function(label) {
  if (label.startsWith(":")) {
    label = label.substring(1);
  }
  return sanitizeText(label.trim());
};
const setCssClass = function(ids, className) {
  ids.split(",").forEach(function(_id) {
    let id = _id;
    if (_id[0].match(/\d/)) {
      id = MERMAID_DOM_ID_PREFIX + id;
    }
    if (classes[id] !== void 0) {
      classes[id].cssClasses.push(className);
    }
  });
};
const setTooltip = function(ids, tooltip) {
  ids.split(",").forEach(function(id) {
    if (tooltip !== void 0) {
      classes[id].tooltip = sanitizeText(tooltip);
    }
  });
};
const getTooltip = function(id, namespace) {
  if (namespace) {
    return namespaces[namespace].classes[id].tooltip;
  }
  return classes[id].tooltip;
};
const setLink = function(ids, linkStr, target) {
  const config = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)();
  ids.split(",").forEach(function(_id) {
    let id = _id;
    if (_id[0].match(/\d/)) {
      id = MERMAID_DOM_ID_PREFIX + id;
    }
    if (classes[id] !== void 0) {
      classes[id].link = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.u.formatUrl(linkStr, config);
      if (config.securityLevel === "sandbox") {
        classes[id].linkTarget = "_top";
      } else if (typeof target === "string") {
        classes[id].linkTarget = sanitizeText(target);
      } else {
        classes[id].linkTarget = "_blank";
      }
    }
  });
  setCssClass(ids, "clickable");
};
const setClickEvent = function(ids, functionName, functionArgs) {
  ids.split(",").forEach(function(id) {
    setClickFunc(id, functionName, functionArgs);
    classes[id].haveCallback = true;
  });
  setCssClass(ids, "clickable");
};
const setClickFunc = function(_domId, functionName, functionArgs) {
  const domId = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.e.sanitizeText(_domId, (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)());
  const config = (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)();
  if (config.securityLevel !== "loose") {
    return;
  }
  if (functionName === void 0) {
    return;
  }
  const id = domId;
  if (classes[id] !== void 0) {
    const elemId = lookUpDomId(id);
    let argList = [];
    if (typeof functionArgs === "string") {
      argList = functionArgs.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      for (let i = 0; i < argList.length; i++) {
        let item = argList[i].trim();
        if (item.charAt(0) === '"' && item.charAt(item.length - 1) === '"') {
          item = item.substr(1, item.length - 2);
        }
        argList[i] = item;
      }
    }
    if (argList.length === 0) {
      argList.push(elemId);
    }
    functions.push(function() {
      const elem = document.querySelector(`[id="${elemId}"]`);
      if (elem !== null) {
        elem.addEventListener(
          "click",
          function() {
            _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.u.runFunc(functionName, ...argList);
          },
          false
        );
      }
    });
  }
};
const bindFunctions = function(element) {
  functions.forEach(function(fun) {
    fun(element);
  });
};
const lineType = {
  LINE: 0,
  DOTTED_LINE: 1
};
const relationType = {
  AGGREGATION: 0,
  EXTENSION: 1,
  COMPOSITION: 2,
  DEPENDENCY: 3,
  LOLLIPOP: 4
};
const setupToolTips = function(element) {
  let tooltipElem = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(".mermaidTooltip");
  if ((tooltipElem._groups || tooltipElem)[0][0] === null) {
    tooltipElem = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)("body").append("div").attr("class", "mermaidTooltip").style("opacity", 0);
  }
  const svg = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(element).select("svg");
  const nodes = svg.selectAll("g.node");
  nodes.on("mouseover", function() {
    const el = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(this);
    const title = el.attr("title");
    if (title === null) {
      return;
    }
    const rect = this.getBoundingClientRect();
    tooltipElem.transition().duration(200).style("opacity", ".9");
    tooltipElem.text(el.attr("title")).style("left", window.scrollX + rect.left + (rect.right - rect.left) / 2 + "px").style("top", window.scrollY + rect.top - 14 + document.body.scrollTop + "px");
    tooltipElem.html(tooltipElem.html().replace(/&lt;br\/&gt;/g, "<br/>"));
    el.classed("hover", true);
  }).on("mouseout", function() {
    tooltipElem.transition().duration(500).style("opacity", 0);
    const el = (0,d3__WEBPACK_IMPORTED_MODULE_0__.select)(this);
    el.classed("hover", false);
  });
};
functions.push(setupToolTips);
let direction = "TB";
const getDirection = () => direction;
const setDirection = (dir) => {
  direction = dir;
};
const addNamespace = function(id) {
  if (namespaces[id] !== void 0) {
    return;
  }
  namespaces[id] = {
    id,
    classes: {},
    children: {},
    domId: MERMAID_DOM_ID_PREFIX + id + "-" + namespaceCounter
  };
  namespaceCounter++;
};
const getNamespace = function(name) {
  return namespaces[name];
};
const getNamespaces = function() {
  return namespaces;
};
const addClassesToNamespace = function(id, classNames) {
  if (namespaces[id] === void 0) {
    return;
  }
  for (const name of classNames) {
    const { className } = splitClassNameAndType(name);
    classes[className].parent = id;
    namespaces[id].classes[className] = classes[className];
  }
};
const setCssStyle = function(id, styles2) {
  const thisClass = classes[id];
  if (!styles2 || !thisClass) {
    return;
  }
  for (const s of styles2) {
    if (s.includes(",")) {
      thisClass.styles.push(...s.split(","));
    } else {
      thisClass.styles.push(s);
    }
  }
};
const db = {
  setAccTitle: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.s,
  getAccTitle: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.g,
  getAccDescription: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.a,
  setAccDescription: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.b,
  getConfig: () => (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.c)().class,
  addClass,
  bindFunctions,
  clear,
  getClass,
  getClasses,
  getNotes,
  addAnnotation,
  addNote,
  getRelations,
  addRelation,
  getDirection,
  setDirection,
  addMember,
  addMembers,
  cleanupLabel,
  lineType,
  relationType,
  setClickEvent,
  setCssClass,
  setLink,
  getTooltip,
  setTooltip,
  lookUpDomId,
  setDiagramTitle: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.q,
  getDiagramTitle: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_1__.t,
  setClassLabel,
  addNamespace,
  addClassesToNamespace,
  getNamespace,
  getNamespaces,
  setCssStyle
};
const getStyles = (options) => `g.classGroup text {
  fill: ${options.nodeBorder || options.classText};
  stroke: none;
  font-family: ${options.fontFamily};
  font-size: 10px;

  .title {
    font-weight: bolder;
  }

}

.nodeLabel, .edgeLabel {
  color: ${options.classText};
}
.edgeLabel .label rect {
  fill: ${options.mainBkg};
}
.label text {
  fill: ${options.classText};
}
.edgeLabel .label span {
  background: ${options.mainBkg};
}

.classTitle {
  font-weight: bolder;
}
.node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${options.mainBkg};
    stroke: ${options.nodeBorder};
    stroke-width: 1px;
  }


.divider {
  stroke: ${options.nodeBorder};
  stroke-width: 1;
}

g.clickable {
  cursor: pointer;
}

g.classGroup rect {
  fill: ${options.mainBkg};
  stroke: ${options.nodeBorder};
}

g.classGroup line {
  stroke: ${options.nodeBorder};
  stroke-width: 1;
}

.classLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${options.mainBkg};
  opacity: 0.5;
}

.classLabel .label {
  fill: ${options.nodeBorder};
  font-size: 10px;
}

.relation {
  stroke: ${options.lineColor};
  stroke-width: 1;
  fill: none;
}

.dashed-line{
  stroke-dasharray: 3;
}

.dotted-line{
  stroke-dasharray: 1 2;
}

#compositionStart, .composition {
  fill: ${options.lineColor} !important;
  stroke: ${options.lineColor} !important;
  stroke-width: 1;
}

#compositionEnd, .composition {
  fill: ${options.lineColor} !important;
  stroke: ${options.lineColor} !important;
  stroke-width: 1;
}

#dependencyStart, .dependency {
  fill: ${options.lineColor} !important;
  stroke: ${options.lineColor} !important;
  stroke-width: 1;
}

#dependencyStart, .dependency {
  fill: ${options.lineColor} !important;
  stroke: ${options.lineColor} !important;
  stroke-width: 1;
}

#extensionStart, .extension {
  fill: transparent !important;
  stroke: ${options.lineColor} !important;
  stroke-width: 1;
}

#extensionEnd, .extension {
  fill: transparent !important;
  stroke: ${options.lineColor} !important;
  stroke-width: 1;
}

#aggregationStart, .aggregation {
  fill: transparent !important;
  stroke: ${options.lineColor} !important;
  stroke-width: 1;
}

#aggregationEnd, .aggregation {
  fill: transparent !important;
  stroke: ${options.lineColor} !important;
  stroke-width: 1;
}

#lollipopStart, .lollipop {
  fill: ${options.mainBkg} !important;
  stroke: ${options.lineColor} !important;
  stroke-width: 1;
}

#lollipopEnd, .lollipop {
  fill: ${options.mainBkg} !important;
  stroke: ${options.lineColor} !important;
  stroke-width: 1;
}

.edgeTerminals {
  font-size: 11px;
  line-height: initial;
}

.classTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${options.textColor};
}
`;
const styles = getStyles;



/***/ }),

/***/ "./node_modules/mermaid/dist/styles-d20c7d72.js":
/*!******************************************************!*\
  !*** ./node_modules/mermaid/dist/styles-d20c7d72.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D: function() { return /* binding */ DEFAULT_STATE_TYPE; },
/* harmony export */   S: function() { return /* binding */ STMT_RELATION; },
/* harmony export */   a: function() { return /* binding */ DIVIDER_TYPE; },
/* harmony export */   b: function() { return /* binding */ STMT_STATE; },
/* harmony export */   c: function() { return /* binding */ DEFAULT_NESTED_DOC_DIR; },
/* harmony export */   d: function() { return /* binding */ db; },
/* harmony export */   p: function() { return /* binding */ parser$1; },
/* harmony export */   s: function() { return /* binding */ styles; }
/* harmony export */ });
/* harmony import */ var _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mermaid-f47111a7.js */ "./node_modules/mermaid/dist/mermaid-f47111a7.js");

var parser = function() {
  var o = function(k, v, o2, l) {
    for (o2 = o2 || {}, l = k.length; l--; o2[k[l]] = v)
      ;
    return o2;
  }, $V0 = [1, 2], $V1 = [1, 3], $V2 = [1, 4], $V3 = [2, 4], $V4 = [1, 9], $V5 = [1, 11], $V6 = [1, 15], $V7 = [1, 16], $V8 = [1, 17], $V9 = [1, 18], $Va = [1, 30], $Vb = [1, 19], $Vc = [1, 20], $Vd = [1, 21], $Ve = [1, 22], $Vf = [1, 23], $Vg = [1, 25], $Vh = [1, 26], $Vi = [1, 27], $Vj = [1, 28], $Vk = [1, 29], $Vl = [1, 32], $Vm = [1, 33], $Vn = [1, 34], $Vo = [1, 35], $Vp = [1, 31], $Vq = [1, 4, 5, 15, 16, 18, 20, 21, 23, 24, 25, 26, 27, 28, 32, 34, 36, 37, 41, 44, 45, 46, 47, 50], $Vr = [1, 4, 5, 13, 14, 15, 16, 18, 20, 21, 23, 24, 25, 26, 27, 28, 32, 34, 36, 37, 41, 44, 45, 46, 47, 50], $Vs = [4, 5, 15, 16, 18, 20, 21, 23, 24, 25, 26, 27, 28, 32, 34, 36, 37, 41, 44, 45, 46, 47, 50];
  var parser2 = {
    trace: function trace() {
    },
    yy: {},
    symbols_: { "error": 2, "start": 3, "SPACE": 4, "NL": 5, "SD": 6, "document": 7, "line": 8, "statement": 9, "classDefStatement": 10, "cssClassStatement": 11, "idStatement": 12, "DESCR": 13, "-->": 14, "HIDE_EMPTY": 15, "scale": 16, "WIDTH": 17, "COMPOSIT_STATE": 18, "STRUCT_START": 19, "STRUCT_STOP": 20, "STATE_DESCR": 21, "AS": 22, "ID": 23, "FORK": 24, "JOIN": 25, "CHOICE": 26, "CONCURRENT": 27, "note": 28, "notePosition": 29, "NOTE_TEXT": 30, "direction": 31, "acc_title": 32, "acc_title_value": 33, "acc_descr": 34, "acc_descr_value": 35, "acc_descr_multiline_value": 36, "classDef": 37, "CLASSDEF_ID": 38, "CLASSDEF_STYLEOPTS": 39, "DEFAULT": 40, "class": 41, "CLASSENTITY_IDS": 42, "STYLECLASS": 43, "direction_tb": 44, "direction_bt": 45, "direction_rl": 46, "direction_lr": 47, "eol": 48, ";": 49, "EDGE_STATE": 50, "STYLE_SEPARATOR": 51, "left_of": 52, "right_of": 53, "$accept": 0, "$end": 1 },
    terminals_: { 2: "error", 4: "SPACE", 5: "NL", 6: "SD", 13: "DESCR", 14: "-->", 15: "HIDE_EMPTY", 16: "scale", 17: "WIDTH", 18: "COMPOSIT_STATE", 19: "STRUCT_START", 20: "STRUCT_STOP", 21: "STATE_DESCR", 22: "AS", 23: "ID", 24: "FORK", 25: "JOIN", 26: "CHOICE", 27: "CONCURRENT", 28: "note", 30: "NOTE_TEXT", 32: "acc_title", 33: "acc_title_value", 34: "acc_descr", 35: "acc_descr_value", 36: "acc_descr_multiline_value", 37: "classDef", 38: "CLASSDEF_ID", 39: "CLASSDEF_STYLEOPTS", 40: "DEFAULT", 41: "class", 42: "CLASSENTITY_IDS", 43: "STYLECLASS", 44: "direction_tb", 45: "direction_bt", 46: "direction_rl", 47: "direction_lr", 49: ";", 50: "EDGE_STATE", 51: "STYLE_SEPARATOR", 52: "left_of", 53: "right_of" },
    productions_: [0, [3, 2], [3, 2], [3, 2], [7, 0], [7, 2], [8, 2], [8, 1], [8, 1], [9, 1], [9, 1], [9, 1], [9, 2], [9, 3], [9, 4], [9, 1], [9, 2], [9, 1], [9, 4], [9, 3], [9, 6], [9, 1], [9, 1], [9, 1], [9, 1], [9, 4], [9, 4], [9, 1], [9, 2], [9, 2], [9, 1], [10, 3], [10, 3], [11, 3], [31, 1], [31, 1], [31, 1], [31, 1], [48, 1], [48, 1], [12, 1], [12, 1], [12, 3], [12, 3], [29, 1], [29, 1]],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
      var $0 = $$.length - 1;
      switch (yystate) {
        case 3:
          yy.setRootDoc($$[$0]);
          return $$[$0];
        case 4:
          this.$ = [];
          break;
        case 5:
          if ($$[$0] != "nl") {
            $$[$0 - 1].push($$[$0]);
            this.$ = $$[$0 - 1];
          }
          break;
        case 6:
        case 7:
          this.$ = $$[$0];
          break;
        case 8:
          this.$ = "nl";
          break;
        case 11:
          this.$ = $$[$0];
          break;
        case 12:
          const stateStmt = $$[$0 - 1];
          stateStmt.description = yy.trimColon($$[$0]);
          this.$ = stateStmt;
          break;
        case 13:
          this.$ = { stmt: "relation", state1: $$[$0 - 2], state2: $$[$0] };
          break;
        case 14:
          const relDescription = yy.trimColon($$[$0]);
          this.$ = { stmt: "relation", state1: $$[$0 - 3], state2: $$[$0 - 1], description: relDescription };
          break;
        case 18:
          this.$ = { stmt: "state", id: $$[$0 - 3], type: "default", description: "", doc: $$[$0 - 1] };
          break;
        case 19:
          var id = $$[$0];
          var description = $$[$0 - 2].trim();
          if ($$[$0].match(":")) {
            var parts = $$[$0].split(":");
            id = parts[0];
            description = [description, parts[1]];
          }
          this.$ = { stmt: "state", id, type: "default", description };
          break;
        case 20:
          this.$ = { stmt: "state", id: $$[$0 - 3], type: "default", description: $$[$0 - 5], doc: $$[$0 - 1] };
          break;
        case 21:
          this.$ = { stmt: "state", id: $$[$0], type: "fork" };
          break;
        case 22:
          this.$ = { stmt: "state", id: $$[$0], type: "join" };
          break;
        case 23:
          this.$ = { stmt: "state", id: $$[$0], type: "choice" };
          break;
        case 24:
          this.$ = { stmt: "state", id: yy.getDividerId(), type: "divider" };
          break;
        case 25:
          this.$ = { stmt: "state", id: $$[$0 - 1].trim(), note: { position: $$[$0 - 2].trim(), text: $$[$0].trim() } };
          break;
        case 28:
          this.$ = $$[$0].trim();
          yy.setAccTitle(this.$);
          break;
        case 29:
        case 30:
          this.$ = $$[$0].trim();
          yy.setAccDescription(this.$);
          break;
        case 31:
        case 32:
          this.$ = { stmt: "classDef", id: $$[$0 - 1].trim(), classes: $$[$0].trim() };
          break;
        case 33:
          this.$ = { stmt: "applyClass", id: $$[$0 - 1].trim(), styleClass: $$[$0].trim() };
          break;
        case 34:
          yy.setDirection("TB");
          this.$ = { stmt: "dir", value: "TB" };
          break;
        case 35:
          yy.setDirection("BT");
          this.$ = { stmt: "dir", value: "BT" };
          break;
        case 36:
          yy.setDirection("RL");
          this.$ = { stmt: "dir", value: "RL" };
          break;
        case 37:
          yy.setDirection("LR");
          this.$ = { stmt: "dir", value: "LR" };
          break;
        case 40:
        case 41:
          this.$ = { stmt: "state", id: $$[$0].trim(), type: "default", description: "" };
          break;
        case 42:
          this.$ = { stmt: "state", id: $$[$0 - 2].trim(), classes: [$$[$0].trim()], type: "default", description: "" };
          break;
        case 43:
          this.$ = { stmt: "state", id: $$[$0 - 2].trim(), classes: [$$[$0].trim()], type: "default", description: "" };
          break;
      }
    },
    table: [{ 3: 1, 4: $V0, 5: $V1, 6: $V2 }, { 1: [3] }, { 3: 5, 4: $V0, 5: $V1, 6: $V2 }, { 3: 6, 4: $V0, 5: $V1, 6: $V2 }, o([1, 4, 5, 15, 16, 18, 21, 23, 24, 25, 26, 27, 28, 32, 34, 36, 37, 41, 44, 45, 46, 47, 50], $V3, { 7: 7 }), { 1: [2, 1] }, { 1: [2, 2] }, { 1: [2, 3], 4: $V4, 5: $V5, 8: 8, 9: 10, 10: 12, 11: 13, 12: 14, 15: $V6, 16: $V7, 18: $V8, 21: $V9, 23: $Va, 24: $Vb, 25: $Vc, 26: $Vd, 27: $Ve, 28: $Vf, 31: 24, 32: $Vg, 34: $Vh, 36: $Vi, 37: $Vj, 41: $Vk, 44: $Vl, 45: $Vm, 46: $Vn, 47: $Vo, 50: $Vp }, o($Vq, [2, 5]), { 9: 36, 10: 12, 11: 13, 12: 14, 15: $V6, 16: $V7, 18: $V8, 21: $V9, 23: $Va, 24: $Vb, 25: $Vc, 26: $Vd, 27: $Ve, 28: $Vf, 31: 24, 32: $Vg, 34: $Vh, 36: $Vi, 37: $Vj, 41: $Vk, 44: $Vl, 45: $Vm, 46: $Vn, 47: $Vo, 50: $Vp }, o($Vq, [2, 7]), o($Vq, [2, 8]), o($Vq, [2, 9]), o($Vq, [2, 10]), o($Vq, [2, 11], { 13: [1, 37], 14: [1, 38] }), o($Vq, [2, 15]), { 17: [1, 39] }, o($Vq, [2, 17], { 19: [1, 40] }), { 22: [1, 41] }, o($Vq, [2, 21]), o($Vq, [2, 22]), o($Vq, [2, 23]), o($Vq, [2, 24]), { 29: 42, 30: [1, 43], 52: [1, 44], 53: [1, 45] }, o($Vq, [2, 27]), { 33: [1, 46] }, { 35: [1, 47] }, o($Vq, [2, 30]), { 38: [1, 48], 40: [1, 49] }, { 42: [1, 50] }, o($Vr, [2, 40], { 51: [1, 51] }), o($Vr, [2, 41], { 51: [1, 52] }), o($Vq, [2, 34]), o($Vq, [2, 35]), o($Vq, [2, 36]), o($Vq, [2, 37]), o($Vq, [2, 6]), o($Vq, [2, 12]), { 12: 53, 23: $Va, 50: $Vp }, o($Vq, [2, 16]), o($Vs, $V3, { 7: 54 }), { 23: [1, 55] }, { 23: [1, 56] }, { 22: [1, 57] }, { 23: [2, 44] }, { 23: [2, 45] }, o($Vq, [2, 28]), o($Vq, [2, 29]), { 39: [1, 58] }, { 39: [1, 59] }, { 43: [1, 60] }, { 23: [1, 61] }, { 23: [1, 62] }, o($Vq, [2, 13], { 13: [1, 63] }), { 4: $V4, 5: $V5, 8: 8, 9: 10, 10: 12, 11: 13, 12: 14, 15: $V6, 16: $V7, 18: $V8, 20: [1, 64], 21: $V9, 23: $Va, 24: $Vb, 25: $Vc, 26: $Vd, 27: $Ve, 28: $Vf, 31: 24, 32: $Vg, 34: $Vh, 36: $Vi, 37: $Vj, 41: $Vk, 44: $Vl, 45: $Vm, 46: $Vn, 47: $Vo, 50: $Vp }, o($Vq, [2, 19], { 19: [1, 65] }), { 30: [1, 66] }, { 23: [1, 67] }, o($Vq, [2, 31]), o($Vq, [2, 32]), o($Vq, [2, 33]), o($Vr, [2, 42]), o($Vr, [2, 43]), o($Vq, [2, 14]), o($Vq, [2, 18]), o($Vs, $V3, { 7: 68 }), o($Vq, [2, 25]), o($Vq, [2, 26]), { 4: $V4, 5: $V5, 8: 8, 9: 10, 10: 12, 11: 13, 12: 14, 15: $V6, 16: $V7, 18: $V8, 20: [1, 69], 21: $V9, 23: $Va, 24: $Vb, 25: $Vc, 26: $Vd, 27: $Ve, 28: $Vf, 31: 24, 32: $Vg, 34: $Vh, 36: $Vi, 37: $Vj, 41: $Vk, 44: $Vl, 45: $Vm, 46: $Vn, 47: $Vo, 50: $Vp }, o($Vq, [2, 20])],
    defaultActions: { 5: [2, 1], 6: [2, 2], 44: [2, 44], 45: [2, 45] },
    parseError: function parseError(str, hash) {
      if (hash.recoverable) {
        this.trace(str);
      } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
      }
    },
    parse: function parse(input) {
      var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, TERROR = 2, EOF = 1;
      var args = lstack.slice.call(arguments, 1);
      var lexer2 = Object.create(this.lexer);
      var sharedState = { yy: {} };
      for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
          sharedState.yy[k] = this.yy[k];
        }
      }
      lexer2.setInput(input, sharedState.yy);
      sharedState.yy.lexer = lexer2;
      sharedState.yy.parser = this;
      if (typeof lexer2.yylloc == "undefined") {
        lexer2.yylloc = {};
      }
      var yyloc = lexer2.yylloc;
      lstack.push(yyloc);
      var ranges = lexer2.options && lexer2.options.ranges;
      if (typeof sharedState.yy.parseError === "function") {
        this.parseError = sharedState.yy.parseError;
      } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
      }
      function lex() {
        var token;
        token = tstack.pop() || lexer2.lex() || EOF;
        if (typeof token !== "number") {
          if (token instanceof Array) {
            tstack = token;
            token = tstack.pop();
          }
          token = self.symbols_[token] || token;
        }
        return token;
      }
      var symbol, state, action, r, yyval = {}, p, len, newState, expected;
      while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
          action = this.defaultActions[state];
        } else {
          if (symbol === null || typeof symbol == "undefined") {
            symbol = lex();
          }
          action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
          var errStr = "";
          expected = [];
          for (p in table[state]) {
            if (this.terminals_[p] && p > TERROR) {
              expected.push("'" + this.terminals_[p] + "'");
            }
          }
          if (lexer2.showPosition) {
            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + lexer2.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
          } else {
            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
          }
          this.parseError(errStr, {
            text: lexer2.match,
            token: this.terminals_[symbol] || symbol,
            line: lexer2.yylineno,
            loc: yyloc,
            expected
          });
        }
        if (action[0] instanceof Array && action.length > 1) {
          throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
          case 1:
            stack.push(symbol);
            vstack.push(lexer2.yytext);
            lstack.push(lexer2.yylloc);
            stack.push(action[1]);
            symbol = null;
            {
              yyleng = lexer2.yyleng;
              yytext = lexer2.yytext;
              yylineno = lexer2.yylineno;
              yyloc = lexer2.yylloc;
            }
            break;
          case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
              first_line: lstack[lstack.length - (len || 1)].first_line,
              last_line: lstack[lstack.length - 1].last_line,
              first_column: lstack[lstack.length - (len || 1)].first_column,
              last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
              yyval._$.range = [
                lstack[lstack.length - (len || 1)].range[0],
                lstack[lstack.length - 1].range[1]
              ];
            }
            r = this.performAction.apply(yyval, [
              yytext,
              yyleng,
              yylineno,
              sharedState.yy,
              action[1],
              vstack,
              lstack
            ].concat(args));
            if (typeof r !== "undefined") {
              return r;
            }
            if (len) {
              stack = stack.slice(0, -1 * len * 2);
              vstack = vstack.slice(0, -1 * len);
              lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
          case 3:
            return true;
        }
      }
      return true;
    }
  };
  var lexer = function() {
    var lexer2 = {
      EOF: 1,
      parseError: function parseError(str, hash) {
        if (this.yy.parser) {
          this.yy.parser.parseError(str, hash);
        } else {
          throw new Error(str);
        }
      },
      // resets the lexer, sets new input
      setInput: function(input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = "";
        this.conditionStack = ["INITIAL"];
        this.yylloc = {
          first_line: 1,
          first_column: 0,
          last_line: 1,
          last_column: 0
        };
        if (this.options.ranges) {
          this.yylloc.range = [0, 0];
        }
        this.offset = 0;
        return this;
      },
      // consumes and returns one char from the input
      input: function() {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno++;
          this.yylloc.last_line++;
        } else {
          this.yylloc.last_column++;
        }
        if (this.options.ranges) {
          this.yylloc.range[1]++;
        }
        this._input = this._input.slice(1);
        return ch;
      },
      // unshifts one char (or a string) into the input
      unput: function(ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);
        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);
        if (lines.length - 1) {
          this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;
        this.yylloc = {
          first_line: this.yylloc.first_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.first_column,
          last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
        };
        if (this.options.ranges) {
          this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
      },
      // When called from action, caches matched text and appends it on next action
      more: function() {
        this._more = true;
        return this;
      },
      // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
      reject: function() {
        if (this.options.backtrack_lexer) {
          this._backtrack = true;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
        return this;
      },
      // retain first n characters of the match
      less: function(n) {
        this.unput(this.match.slice(n));
      },
      // displays already matched input, i.e. for error messages
      pastInput: function() {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
      },
      // displays upcoming input, i.e. for error messages
      upcomingInput: function() {
        var next = this.match;
        if (next.length < 20) {
          next += this._input.substr(0, 20 - next.length);
        }
        return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
      },
      // displays the character position where the lexing error occurred, i.e. for error messages
      showPosition: function() {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
      },
      // test the lexed token: return FALSE when not a match, otherwise return token
      test_match: function(match, indexed_rule) {
        var token, lines, backup;
        if (this.options.backtrack_lexer) {
          backup = {
            yylineno: this.yylineno,
            yylloc: {
              first_line: this.yylloc.first_line,
              last_line: this.last_line,
              first_column: this.yylloc.first_column,
              last_column: this.yylloc.last_column
            },
            yytext: this.yytext,
            match: this.match,
            matches: this.matches,
            matched: this.matched,
            yyleng: this.yyleng,
            offset: this.offset,
            _more: this._more,
            _input: this._input,
            yy: this.yy,
            conditionStack: this.conditionStack.slice(0),
            done: this.done
          };
          if (this.options.ranges) {
            backup.yylloc.range = this.yylloc.range.slice(0);
          }
        }
        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno += lines.length;
        }
        this.yylloc = {
          first_line: this.yylloc.last_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.last_column,
          last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
          this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
          this.done = false;
        }
        if (token) {
          return token;
        } else if (this._backtrack) {
          for (var k in backup) {
            this[k] = backup[k];
          }
          return false;
        }
        return false;
      },
      // return next match in input
      next: function() {
        if (this.done) {
          return this.EOF;
        }
        if (!this._input) {
          this.done = true;
        }
        var token, match, tempMatch, index;
        if (!this._more) {
          this.yytext = "";
          this.match = "";
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
          tempMatch = this._input.match(this.rules[rules[i]]);
          if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
            match = tempMatch;
            index = i;
            if (this.options.backtrack_lexer) {
              token = this.test_match(tempMatch, rules[i]);
              if (token !== false) {
                return token;
              } else if (this._backtrack) {
                match = false;
                continue;
              } else {
                return false;
              }
            } else if (!this.options.flex) {
              break;
            }
          }
        }
        if (match) {
          token = this.test_match(match, rules[index]);
          if (token !== false) {
            return token;
          }
          return false;
        }
        if (this._input === "") {
          return this.EOF;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
      },
      // return next match that has a token
      lex: function lex() {
        var r = this.next();
        if (r) {
          return r;
        } else {
          return this.lex();
        }
      },
      // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
      begin: function begin(condition) {
        this.conditionStack.push(condition);
      },
      // pop the previously active lexer condition state off the condition stack
      popState: function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
          return this.conditionStack.pop();
        } else {
          return this.conditionStack[0];
        }
      },
      // produce the lexer rule set which is active for the currently active lexer condition state
      _currentRules: function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
          return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
          return this.conditions["INITIAL"].rules;
        }
      },
      // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
      topState: function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
          return this.conditionStack[n];
        } else {
          return "INITIAL";
        }
      },
      // alias for begin(condition)
      pushState: function pushState(condition) {
        this.begin(condition);
      },
      // return the number of states currently on the stack
      stateStackSize: function stateStackSize() {
        return this.conditionStack.length;
      },
      options: { "case-insensitive": true },
      performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
        switch ($avoiding_name_collisions) {
          case 0:
            return 40;
          case 1:
            return 44;
          case 2:
            return 45;
          case 3:
            return 46;
          case 4:
            return 47;
          case 5:
            break;
          case 6:
            break;
          case 7:
            return 5;
          case 8:
            break;
          case 9:
            break;
          case 10:
            break;
          case 11:
            break;
          case 12:
            this.pushState("SCALE");
            return 16;
          case 13:
            return 17;
          case 14:
            this.popState();
            break;
          case 15:
            this.begin("acc_title");
            return 32;
          case 16:
            this.popState();
            return "acc_title_value";
          case 17:
            this.begin("acc_descr");
            return 34;
          case 18:
            this.popState();
            return "acc_descr_value";
          case 19:
            this.begin("acc_descr_multiline");
            break;
          case 20:
            this.popState();
            break;
          case 21:
            return "acc_descr_multiline_value";
          case 22:
            this.pushState("CLASSDEF");
            return 37;
          case 23:
            this.popState();
            this.pushState("CLASSDEFID");
            return "DEFAULT_CLASSDEF_ID";
          case 24:
            this.popState();
            this.pushState("CLASSDEFID");
            return 38;
          case 25:
            this.popState();
            return 39;
          case 26:
            this.pushState("CLASS");
            return 41;
          case 27:
            this.popState();
            this.pushState("CLASS_STYLE");
            return 42;
          case 28:
            this.popState();
            return 43;
          case 29:
            this.pushState("SCALE");
            return 16;
          case 30:
            return 17;
          case 31:
            this.popState();
            break;
          case 32:
            this.pushState("STATE");
            break;
          case 33:
            this.popState();
            yy_.yytext = yy_.yytext.slice(0, -8).trim();
            return 24;
          case 34:
            this.popState();
            yy_.yytext = yy_.yytext.slice(0, -8).trim();
            return 25;
          case 35:
            this.popState();
            yy_.yytext = yy_.yytext.slice(0, -10).trim();
            return 26;
          case 36:
            this.popState();
            yy_.yytext = yy_.yytext.slice(0, -8).trim();
            return 24;
          case 37:
            this.popState();
            yy_.yytext = yy_.yytext.slice(0, -8).trim();
            return 25;
          case 38:
            this.popState();
            yy_.yytext = yy_.yytext.slice(0, -10).trim();
            return 26;
          case 39:
            return 44;
          case 40:
            return 45;
          case 41:
            return 46;
          case 42:
            return 47;
          case 43:
            this.pushState("STATE_STRING");
            break;
          case 44:
            this.pushState("STATE_ID");
            return "AS";
          case 45:
            this.popState();
            return "ID";
          case 46:
            this.popState();
            break;
          case 47:
            return "STATE_DESCR";
          case 48:
            return 18;
          case 49:
            this.popState();
            break;
          case 50:
            this.popState();
            this.pushState("struct");
            return 19;
          case 51:
            break;
          case 52:
            this.popState();
            return 20;
          case 53:
            break;
          case 54:
            this.begin("NOTE");
            return 28;
          case 55:
            this.popState();
            this.pushState("NOTE_ID");
            return 52;
          case 56:
            this.popState();
            this.pushState("NOTE_ID");
            return 53;
          case 57:
            this.popState();
            this.pushState("FLOATING_NOTE");
            break;
          case 58:
            this.popState();
            this.pushState("FLOATING_NOTE_ID");
            return "AS";
          case 59:
            break;
          case 60:
            return "NOTE_TEXT";
          case 61:
            this.popState();
            return "ID";
          case 62:
            this.popState();
            this.pushState("NOTE_TEXT");
            return 23;
          case 63:
            this.popState();
            yy_.yytext = yy_.yytext.substr(2).trim();
            return 30;
          case 64:
            this.popState();
            yy_.yytext = yy_.yytext.slice(0, -8).trim();
            return 30;
          case 65:
            return 6;
          case 66:
            return 6;
          case 67:
            return 15;
          case 68:
            return 50;
          case 69:
            return 23;
          case 70:
            yy_.yytext = yy_.yytext.trim();
            return 13;
          case 71:
            return 14;
          case 72:
            return 27;
          case 73:
            return 51;
          case 74:
            return 5;
          case 75:
            return "INVALID";
        }
      },
      rules: [/^(?:default\b)/i, /^(?:.*direction\s+TB[^\n]*)/i, /^(?:.*direction\s+BT[^\n]*)/i, /^(?:.*direction\s+RL[^\n]*)/i, /^(?:.*direction\s+LR[^\n]*)/i, /^(?:%%(?!\{)[^\n]*)/i, /^(?:[^\}]%%[^\n]*)/i, /^(?:[\n]+)/i, /^(?:[\s]+)/i, /^(?:((?!\n)\s)+)/i, /^(?:#[^\n]*)/i, /^(?:%[^\n]*)/i, /^(?:scale\s+)/i, /^(?:\d+)/i, /^(?:\s+width\b)/i, /^(?:accTitle\s*:\s*)/i, /^(?:(?!\n||)*[^\n]*)/i, /^(?:accDescr\s*:\s*)/i, /^(?:(?!\n||)*[^\n]*)/i, /^(?:accDescr\s*\{\s*)/i, /^(?:[\}])/i, /^(?:[^\}]*)/i, /^(?:classDef\s+)/i, /^(?:DEFAULT\s+)/i, /^(?:\w+\s+)/i, /^(?:[^\n]*)/i, /^(?:class\s+)/i, /^(?:(\w+)+((,\s*\w+)*))/i, /^(?:[^\n]*)/i, /^(?:scale\s+)/i, /^(?:\d+)/i, /^(?:\s+width\b)/i, /^(?:state\s+)/i, /^(?:.*<<fork>>)/i, /^(?:.*<<join>>)/i, /^(?:.*<<choice>>)/i, /^(?:.*\[\[fork\]\])/i, /^(?:.*\[\[join\]\])/i, /^(?:.*\[\[choice\]\])/i, /^(?:.*direction\s+TB[^\n]*)/i, /^(?:.*direction\s+BT[^\n]*)/i, /^(?:.*direction\s+RL[^\n]*)/i, /^(?:.*direction\s+LR[^\n]*)/i, /^(?:["])/i, /^(?:\s*as\s+)/i, /^(?:[^\n\{]*)/i, /^(?:["])/i, /^(?:[^"]*)/i, /^(?:[^\n\s\{]+)/i, /^(?:\n)/i, /^(?:\{)/i, /^(?:%%(?!\{)[^\n]*)/i, /^(?:\})/i, /^(?:[\n])/i, /^(?:note\s+)/i, /^(?:left of\b)/i, /^(?:right of\b)/i, /^(?:")/i, /^(?:\s*as\s*)/i, /^(?:["])/i, /^(?:[^"]*)/i, /^(?:[^\n]*)/i, /^(?:\s*[^:\n\s\-]+)/i, /^(?:\s*:[^:\n;]+)/i, /^(?:[\s\S]*?end note\b)/i, /^(?:stateDiagram\s+)/i, /^(?:stateDiagram-v2\s+)/i, /^(?:hide empty description\b)/i, /^(?:\[\*\])/i, /^(?:[^:\n\s\-\{]+)/i, /^(?:\s*:[^:\n;]+)/i, /^(?:-->)/i, /^(?:--)/i, /^(?::::)/i, /^(?:$)/i, /^(?:.)/i],
      conditions: { "LINE": { "rules": [9, 10], "inclusive": false }, "struct": { "rules": [9, 10, 22, 26, 32, 39, 40, 41, 42, 51, 52, 53, 54, 68, 69, 70, 71, 72], "inclusive": false }, "FLOATING_NOTE_ID": { "rules": [61], "inclusive": false }, "FLOATING_NOTE": { "rules": [58, 59, 60], "inclusive": false }, "NOTE_TEXT": { "rules": [63, 64], "inclusive": false }, "NOTE_ID": { "rules": [62], "inclusive": false }, "NOTE": { "rules": [55, 56, 57], "inclusive": false }, "CLASS_STYLE": { "rules": [28], "inclusive": false }, "CLASS": { "rules": [27], "inclusive": false }, "CLASSDEFID": { "rules": [25], "inclusive": false }, "CLASSDEF": { "rules": [23, 24], "inclusive": false }, "acc_descr_multiline": { "rules": [20, 21], "inclusive": false }, "acc_descr": { "rules": [18], "inclusive": false }, "acc_title": { "rules": [16], "inclusive": false }, "SCALE": { "rules": [13, 14, 30, 31], "inclusive": false }, "ALIAS": { "rules": [], "inclusive": false }, "STATE_ID": { "rules": [45], "inclusive": false }, "STATE_STRING": { "rules": [46, 47], "inclusive": false }, "FORK_STATE": { "rules": [], "inclusive": false }, "STATE": { "rules": [9, 10, 33, 34, 35, 36, 37, 38, 43, 44, 48, 49, 50], "inclusive": false }, "ID": { "rules": [9, 10], "inclusive": false }, "INITIAL": { "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 15, 17, 19, 22, 26, 29, 32, 50, 54, 65, 66, 67, 68, 69, 70, 71, 73, 74, 75], "inclusive": true } }
    };
    return lexer2;
  }();
  parser2.lexer = lexer;
  function Parser() {
    this.yy = {};
  }
  Parser.prototype = parser2;
  parser2.Parser = Parser;
  return new Parser();
}();
parser.parser = parser;
const parser$1 = parser;
const DEFAULT_DIAGRAM_DIRECTION = "LR";
const DEFAULT_NESTED_DOC_DIR = "TB";
const STMT_STATE = "state";
const STMT_RELATION = "relation";
const STMT_CLASSDEF = "classDef";
const STMT_APPLYCLASS = "applyClass";
const DEFAULT_STATE_TYPE = "default";
const DIVIDER_TYPE = "divider";
const START_NODE = "[*]";
const START_TYPE = "start";
const END_NODE = START_NODE;
const END_TYPE = "end";
const COLOR_KEYWORD = "color";
const FILL_KEYWORD = "fill";
const BG_FILL = "bgFill";
const STYLECLASS_SEP = ",";
function newClassesList() {
  return {};
}
let direction = DEFAULT_DIAGRAM_DIRECTION;
let rootDoc = [];
let classes = newClassesList();
const newDoc = () => {
  return {
    relations: [],
    states: {},
    documents: {}
  };
};
let documents = {
  root: newDoc()
};
let currentDocument = documents.root;
let startEndCount = 0;
let dividerCnt = 0;
const lineType = {
  LINE: 0,
  DOTTED_LINE: 1
};
const relationType = {
  AGGREGATION: 0,
  EXTENSION: 1,
  COMPOSITION: 2,
  DEPENDENCY: 3
};
const clone = (o) => JSON.parse(JSON.stringify(o));
const setRootDoc = (o) => {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.l.info("Setting root doc", o);
  rootDoc = o;
};
const getRootDoc = () => rootDoc;
const docTranslator = (parent, node, first) => {
  if (node.stmt === STMT_RELATION) {
    docTranslator(parent, node.state1, true);
    docTranslator(parent, node.state2, false);
  } else {
    if (node.stmt === STMT_STATE) {
      if (node.id === "[*]") {
        node.id = first ? parent.id + "_start" : parent.id + "_end";
        node.start = first;
      } else {
        node.id = node.id.trim();
      }
    }
    if (node.doc) {
      const doc = [];
      let currentDoc = [];
      let i;
      for (i = 0; i < node.doc.length; i++) {
        if (node.doc[i].type === DIVIDER_TYPE) {
          const newNode = clone(node.doc[i]);
          newNode.doc = clone(currentDoc);
          doc.push(newNode);
          currentDoc = [];
        } else {
          currentDoc.push(node.doc[i]);
        }
      }
      if (doc.length > 0 && currentDoc.length > 0) {
        const newNode = {
          stmt: STMT_STATE,
          id: (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.I)(),
          type: "divider",
          doc: clone(currentDoc)
        };
        doc.push(clone(newNode));
        node.doc = doc;
      }
      node.doc.forEach((docNode) => docTranslator(node, docNode, true));
    }
  }
};
const getRootDocV2 = () => {
  docTranslator({ id: "root" }, { id: "root", doc: rootDoc }, true);
  return { id: "root", doc: rootDoc };
};
const extract = (_doc) => {
  let doc;
  if (_doc.doc) {
    doc = _doc.doc;
  } else {
    doc = _doc;
  }
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.l.info(doc);
  clear(true);
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.l.info("Extract", doc);
  doc.forEach((item) => {
    switch (item.stmt) {
      case STMT_STATE:
        addState(
          item.id.trim(),
          item.type,
          item.doc,
          item.description,
          item.note,
          item.classes,
          item.styles,
          item.textStyles
        );
        break;
      case STMT_RELATION:
        addRelation(item.state1, item.state2, item.description);
        break;
      case STMT_CLASSDEF:
        addStyleClass(item.id.trim(), item.classes);
        break;
      case STMT_APPLYCLASS:
        setCssClass(item.id.trim(), item.styleClass);
        break;
    }
  });
};
const addState = function(id, type = DEFAULT_STATE_TYPE, doc = null, descr = null, note = null, classes2 = null, styles2 = null, textStyles = null) {
  const trimmedId = id == null ? void 0 : id.trim();
  if (currentDocument.states[trimmedId] === void 0) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.l.info("Adding state ", trimmedId, descr);
    currentDocument.states[trimmedId] = {
      id: trimmedId,
      descriptions: [],
      type,
      doc,
      note,
      classes: [],
      styles: [],
      textStyles: []
    };
  } else {
    if (!currentDocument.states[trimmedId].doc) {
      currentDocument.states[trimmedId].doc = doc;
    }
    if (!currentDocument.states[trimmedId].type) {
      currentDocument.states[trimmedId].type = type;
    }
  }
  if (descr) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.l.info("Setting state description", trimmedId, descr);
    if (typeof descr === "string") {
      addDescription(trimmedId, descr.trim());
    }
    if (typeof descr === "object") {
      descr.forEach((des) => addDescription(trimmedId, des.trim()));
    }
  }
  if (note) {
    currentDocument.states[trimmedId].note = note;
    currentDocument.states[trimmedId].note.text = _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.e.sanitizeText(
      currentDocument.states[trimmedId].note.text,
      (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.c)()
    );
  }
  if (classes2) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.l.info("Setting state classes", trimmedId, classes2);
    const classesList = typeof classes2 === "string" ? [classes2] : classes2;
    classesList.forEach((cssClass) => setCssClass(trimmedId, cssClass.trim()));
  }
  if (styles2) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.l.info("Setting state styles", trimmedId, styles2);
    const stylesList = typeof styles2 === "string" ? [styles2] : styles2;
    stylesList.forEach((style) => setStyle(trimmedId, style.trim()));
  }
  if (textStyles) {
    _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.l.info("Setting state styles", trimmedId, styles2);
    const textStylesList = typeof textStyles === "string" ? [textStyles] : textStyles;
    textStylesList.forEach((textStyle) => setTextStyle(trimmedId, textStyle.trim()));
  }
};
const clear = function(saveCommon) {
  documents = {
    root: newDoc()
  };
  currentDocument = documents.root;
  startEndCount = 0;
  classes = newClassesList();
  if (!saveCommon) {
    (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.v)();
  }
};
const getState = function(id) {
  return currentDocument.states[id];
};
const getStates = function() {
  return currentDocument.states;
};
const logDocuments = function() {
  _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.l.info("Documents = ", documents);
};
const getRelations = function() {
  return currentDocument.relations;
};
function startIdIfNeeded(id = "") {
  let fixedId = id;
  if (id === START_NODE) {
    startEndCount++;
    fixedId = `${START_TYPE}${startEndCount}`;
  }
  return fixedId;
}
function startTypeIfNeeded(id = "", type = DEFAULT_STATE_TYPE) {
  return id === START_NODE ? START_TYPE : type;
}
function endIdIfNeeded(id = "") {
  let fixedId = id;
  if (id === END_NODE) {
    startEndCount++;
    fixedId = `${END_TYPE}${startEndCount}`;
  }
  return fixedId;
}
function endTypeIfNeeded(id = "", type = DEFAULT_STATE_TYPE) {
  return id === END_NODE ? END_TYPE : type;
}
function addRelationObjs(item1, item2, relationTitle) {
  let id1 = startIdIfNeeded(item1.id.trim());
  let type1 = startTypeIfNeeded(item1.id.trim(), item1.type);
  let id2 = startIdIfNeeded(item2.id.trim());
  let type2 = startTypeIfNeeded(item2.id.trim(), item2.type);
  addState(
    id1,
    type1,
    item1.doc,
    item1.description,
    item1.note,
    item1.classes,
    item1.styles,
    item1.textStyles
  );
  addState(
    id2,
    type2,
    item2.doc,
    item2.description,
    item2.note,
    item2.classes,
    item2.styles,
    item2.textStyles
  );
  currentDocument.relations.push({
    id1,
    id2,
    relationTitle: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.e.sanitizeText(relationTitle, (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.c)())
  });
}
const addRelation = function(item1, item2, title) {
  if (typeof item1 === "object") {
    addRelationObjs(item1, item2, title);
  } else {
    const id1 = startIdIfNeeded(item1.trim());
    const type1 = startTypeIfNeeded(item1);
    const id2 = endIdIfNeeded(item2.trim());
    const type2 = endTypeIfNeeded(item2);
    addState(id1, type1);
    addState(id2, type2);
    currentDocument.relations.push({
      id1,
      id2,
      title: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.e.sanitizeText(title, (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.c)())
    });
  }
};
const addDescription = function(id, descr) {
  const theState = currentDocument.states[id];
  const _descr = descr.startsWith(":") ? descr.replace(":", "").trim() : descr;
  theState.descriptions.push(_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.e.sanitizeText(_descr, (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.c)()));
};
const cleanupLabel = function(label) {
  if (label.substring(0, 1) === ":") {
    return label.substr(2).trim();
  } else {
    return label.trim();
  }
};
const getDividerId = () => {
  dividerCnt++;
  return "divider-id-" + dividerCnt;
};
const addStyleClass = function(id, styleAttributes = "") {
  if (classes[id] === void 0) {
    classes[id] = { id, styles: [], textStyles: [] };
  }
  const foundClass = classes[id];
  if (styleAttributes !== void 0 && styleAttributes !== null) {
    styleAttributes.split(STYLECLASS_SEP).forEach((attrib) => {
      const fixedAttrib = attrib.replace(/([^;]*);/, "$1").trim();
      if (attrib.match(COLOR_KEYWORD)) {
        const newStyle1 = fixedAttrib.replace(FILL_KEYWORD, BG_FILL);
        const newStyle2 = newStyle1.replace(COLOR_KEYWORD, FILL_KEYWORD);
        foundClass.textStyles.push(newStyle2);
      }
      foundClass.styles.push(fixedAttrib);
    });
  }
};
const getClasses = function() {
  return classes;
};
const setCssClass = function(itemIds, cssClassName) {
  itemIds.split(",").forEach(function(id) {
    let foundState = getState(id);
    if (foundState === void 0) {
      const trimmedId = id.trim();
      addState(trimmedId);
      foundState = getState(trimmedId);
    }
    foundState.classes.push(cssClassName);
  });
};
const setStyle = function(itemId, styleText) {
  const item = getState(itemId);
  if (item !== void 0) {
    item.textStyles.push(styleText);
  }
};
const setTextStyle = function(itemId, cssClassName) {
  const item = getState(itemId);
  if (item !== void 0) {
    item.textStyles.push(cssClassName);
  }
};
const getDirection = () => direction;
const setDirection = (dir) => {
  direction = dir;
};
const trimColon = (str) => str && str[0] === ":" ? str.substr(1).trim() : str.trim();
const db = {
  getConfig: () => (0,_mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.c)().state,
  addState,
  clear,
  getState,
  getStates,
  getRelations,
  getClasses,
  getDirection,
  addRelation,
  getDividerId,
  setDirection,
  cleanupLabel,
  lineType,
  relationType,
  logDocuments,
  getRootDoc,
  setRootDoc,
  getRootDocV2,
  extract,
  trimColon,
  getAccTitle: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.g,
  setAccTitle: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.s,
  getAccDescription: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.a,
  setAccDescription: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.b,
  addStyleClass,
  setCssClass,
  addDescription,
  setDiagramTitle: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.q,
  getDiagramTitle: _mermaid_f47111a7_js__WEBPACK_IMPORTED_MODULE_0__.t
};
const getStyles = (options) => `
defs #statediagram-barbEnd {
    fill: ${options.transitionColor};
    stroke: ${options.transitionColor};
  }
g.stateGroup text {
  fill: ${options.nodeBorder};
  stroke: none;
  font-size: 10px;
}
g.stateGroup text {
  fill: ${options.textColor};
  stroke: none;
  font-size: 10px;

}
g.stateGroup .state-title {
  font-weight: bolder;
  fill: ${options.stateLabelColor};
}

g.stateGroup rect {
  fill: ${options.mainBkg};
  stroke: ${options.nodeBorder};
}

g.stateGroup line {
  stroke: ${options.lineColor};
  stroke-width: 1;
}

.transition {
  stroke: ${options.transitionColor};
  stroke-width: 1;
  fill: none;
}

.stateGroup .composit {
  fill: ${options.background};
  border-bottom: 1px
}

.stateGroup .alt-composit {
  fill: #e0e0e0;
  border-bottom: 1px
}

.state-note {
  stroke: ${options.noteBorderColor};
  fill: ${options.noteBkgColor};

  text {
    fill: ${options.noteTextColor};
    stroke: none;
    font-size: 10px;
  }
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${options.mainBkg};
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: ${options.labelBackgroundColor};
  opacity: 0.5;
}
.edgeLabel .label text {
  fill: ${options.transitionLabelColor || options.tertiaryTextColor};
}
.label div .edgeLabel {
  color: ${options.transitionLabelColor || options.tertiaryTextColor};
}

.stateLabel text {
  fill: ${options.stateLabelColor};
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: ${options.specialStateColor};
  stroke: ${options.specialStateColor};
}

.node .fork-join {
  fill: ${options.specialStateColor};
  stroke: ${options.specialStateColor};
}

.node circle.state-end {
  fill: ${options.innerEndBackground};
  stroke: ${options.background};
  stroke-width: 1.5
}
.end-state-inner {
  fill: ${options.compositeBackground || options.background};
  // stroke: ${options.background};
  stroke-width: 1.5
}

.node rect {
  fill: ${options.stateBkg || options.mainBkg};
  stroke: ${options.stateBorder || options.nodeBorder};
  stroke-width: 1px;
}
.node polygon {
  fill: ${options.mainBkg};
  stroke: ${options.stateBorder || options.nodeBorder};;
  stroke-width: 1px;
}
#statediagram-barbEnd {
  fill: ${options.lineColor};
}

.statediagram-cluster rect {
  fill: ${options.compositeTitleBackground};
  stroke: ${options.stateBorder || options.nodeBorder};
  stroke-width: 1px;
}

.cluster-label, .nodeLabel {
  color: ${options.stateLabelColor};
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}
.statediagram-state .divider {
  stroke: ${options.stateBorder || options.nodeBorder};
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}
.statediagram-cluster.statediagram-cluster .inner {
  fill: ${options.compositeBackground || options.background};
}
.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: ${options.altBackground ? options.altBackground : "#efefef"};
}

.statediagram-cluster .inner {
  rx:0;
  ry:0;
}

.statediagram-state rect.basic {
  rx: 5px;
  ry: 5px;
}
.statediagram-state rect.divider {
  stroke-dasharray: 10,10;
  fill: ${options.altBackground ? options.altBackground : "#efefef"};
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: ${options.noteBkgColor};
  stroke: ${options.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}
.statediagram-note rect {
  fill: ${options.noteBkgColor};
  stroke: ${options.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: ${options.noteTextColor};
}

.statediagram-note .nodeLabel {
  color: ${options.noteTextColor};
}
.statediagram .edgeLabel {
  color: red; // ${options.noteTextColor};
}

#dependencyStart, #dependencyEnd {
  fill: ${options.lineColor};
  stroke: ${options.lineColor};
  stroke-width: 1;
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${options.textColor};
}
`;
const styles = getStyles;



/***/ })

}]);
//# sourceMappingURL=-.c971d069.js.fe9538e0.map