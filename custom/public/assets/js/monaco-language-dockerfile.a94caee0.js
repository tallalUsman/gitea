"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["node_modules_monaco-editor_esm_vs_basic-languages_dockerfile_dockerfile_js"],{

/***/ "./node_modules/monaco-editor/esm/vs/basic-languages/dockerfile/dockerfile.js":
/*!************************************************************************************!*\
  !*** ./node_modules/monaco-editor/esm/vs/basic-languages/dockerfile/dockerfile.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   conf: function() { return /* binding */ conf; },
/* harmony export */   language: function() { return /* binding */ language; }
/* harmony export */ });
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.48.0(0037b13fb5d186fdf1e7df51a9416a2de2b8c670)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/dockerfile/dockerfile.ts
var conf = {
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: ".dockerfile",
  variable: /\${?[\w]+}?/,
  tokenizer: {
    root: [
      { include: "@whitespace" },
      { include: "@comment" },
      [/(ONBUILD)(\s+)/, ["keyword", ""]],
      [/(ENV)(\s+)([\w]+)/, ["keyword", "", { token: "variable", next: "@arguments" }]],
      [
        /(FROM|MAINTAINER|RUN|EXPOSE|ENV|ADD|ARG|VOLUME|LABEL|USER|WORKDIR|COPY|CMD|STOPSIGNAL|SHELL|HEALTHCHECK|ENTRYPOINT)/,
        { token: "keyword", next: "@arguments" }
      ]
    ],
    arguments: [
      { include: "@whitespace" },
      { include: "@strings" },
      [
        /(@variable)/,
        {
          cases: {
            "@eos": { token: "variable", next: "@popall" },
            "@default": "variable"
          }
        }
      ],
      [
        /\\/,
        {
          cases: {
            "@eos": "",
            "@default": ""
          }
        }
      ],
      [
        /./,
        {
          cases: {
            "@eos": { token: "", next: "@popall" },
            "@default": ""
          }
        }
      ]
    ],
    // Deal with white space, including comments
    whitespace: [
      [
        /\s+/,
        {
          cases: {
            "@eos": { token: "", next: "@popall" },
            "@default": ""
          }
        }
      ]
    ],
    comment: [[/(^#.*$)/, "comment", "@popall"]],
    // Recognize strings, including those broken across lines with \ (but not without)
    strings: [
      [/\\'$/, "", "@popall"],
      // \' leaves @arguments at eol
      [/\\'/, ""],
      // \' is not a string
      [/'$/, "string", "@popall"],
      [/'/, "string", "@stringBody"],
      [/"$/, "string", "@popall"],
      [/"/, "string", "@dblStringBody"]
    ],
    stringBody: [
      [
        /[^\\\$']/,
        {
          cases: {
            "@eos": { token: "string", next: "@popall" },
            "@default": "string"
          }
        }
      ],
      [/\\./, "string.escape"],
      [/'$/, "string", "@popall"],
      [/'/, "string", "@pop"],
      [/(@variable)/, "variable"],
      [/\\$/, "string"],
      [/$/, "string", "@popall"]
    ],
    dblStringBody: [
      [
        /[^\\\$"]/,
        {
          cases: {
            "@eos": { token: "string", next: "@popall" },
            "@default": "string"
          }
        }
      ],
      [/\\./, "string.escape"],
      [/"$/, "string", "@popall"],
      [/"/, "string", "@pop"],
      [/(@variable)/, "variable"],
      [/\\$/, "string"],
      [/$/, "string", "@popall"]
    ]
  }
};



/***/ })

}]);
//# sourceMappingURL=monaco-language-dockerfile.a94caee0.js.37fc552b.map