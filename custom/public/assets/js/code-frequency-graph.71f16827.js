"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["code-frequency-graph"],{

/***/ "./node_modules/esbuild-loader/dist/index.cjs??clonedRuleSet-1.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0]!./web_src/js/components/RepoCodeFrequency.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/esbuild-loader/dist/index.cjs??clonedRuleSet-1.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0]!./web_src/js/components/RepoCodeFrequency.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _svg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../svg.js */ "./web_src/js/svg.js");
/* harmony import */ var chart_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! chart.js */ "./node_modules/chart.js/dist/chart.js");
/* harmony import */ var _modules_fetch_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/fetch.js */ "./web_src/js/modules/fetch.js");
/* harmony import */ var vue_chartjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vue-chartjs */ "./node_modules/vue-chartjs/dist/index.js");
/* harmony import */ var _utils_time_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/time.js */ "./web_src/js/utils/time.js");
/* harmony import */ var _utils_color_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/color.js */ "./web_src/js/utils/color.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils.js */ "./web_src/js/utils.js");
/* harmony import */ var chartjs_adapter_dayjs_4_dist_chartjs_adapter_dayjs_4_esm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm */ "./node_modules/chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm.js");








const { pageData } = window.config;
chart_js__WEBPACK_IMPORTED_MODULE_6__.Chart.defaults.color = _utils_color_js__WEBPACK_IMPORTED_MODULE_3__.chartJsColors.text;
chart_js__WEBPACK_IMPORTED_MODULE_6__.Chart.defaults.borderColor = _utils_color_js__WEBPACK_IMPORTED_MODULE_3__.chartJsColors.border;
chart_js__WEBPACK_IMPORTED_MODULE_6__.Chart.register(
  chart_js__WEBPACK_IMPORTED_MODULE_6__.TimeScale,
  chart_js__WEBPACK_IMPORTED_MODULE_6__.LinearScale,
  chart_js__WEBPACK_IMPORTED_MODULE_6__.Legend,
  chart_js__WEBPACK_IMPORTED_MODULE_6__.PointElement,
  chart_js__WEBPACK_IMPORTED_MODULE_6__.LineElement,
  chart_js__WEBPACK_IMPORTED_MODULE_6__.Filler
);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: { ChartLine: vue_chartjs__WEBPACK_IMPORTED_MODULE_7__.Line, SvgIcon: _svg_js__WEBPACK_IMPORTED_MODULE_0__.SvgIcon },
  props: {
    locale: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    isLoading: false,
    errorText: "",
    repoLink: pageData.repoLink || [],
    data: []
  }),
  mounted() {
    this.fetchGraphData();
  },
  methods: {
    async fetchGraphData() {
      this.isLoading = true;
      try {
        let response;
        do {
          response = await (0,_modules_fetch_js__WEBPACK_IMPORTED_MODULE_1__.GET)(`${this.repoLink}/activity/code-frequency/data`);
          if (response.status === 202) {
            await (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.sleep)(1e3);
          }
        } while (response.status === 202);
        if (response.ok) {
          this.data = await response.json();
          const weekValues = Object.values(this.data);
          const start = weekValues[0].week;
          const end = (0,_utils_time_js__WEBPACK_IMPORTED_MODULE_2__.firstStartDateAfterDate)(/* @__PURE__ */ new Date());
          const startDays = (0,_utils_time_js__WEBPACK_IMPORTED_MODULE_2__.startDaysBetween)(new Date(start), new Date(end));
          this.data = (0,_utils_time_js__WEBPACK_IMPORTED_MODULE_2__.fillEmptyStartDaysWithZeroes)(startDays, this.data);
          this.errorText = "";
        } else {
          this.errorText = response.statusText;
        }
      } catch (err) {
        this.errorText = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    toGraphData(data) {
      return {
        datasets: [
          {
            data: data.map((i) => ({ x: i.week, y: i.additions })),
            pointRadius: 0,
            pointHitRadius: 0,
            fill: true,
            label: "Additions",
            backgroundColor: _utils_color_js__WEBPACK_IMPORTED_MODULE_3__.chartJsColors["additions"],
            borderWidth: 0,
            tension: 0.3
          },
          {
            data: data.map((i) => ({ x: i.week, y: -i.deletions })),
            pointRadius: 0,
            pointHitRadius: 0,
            fill: true,
            label: "Deletions",
            backgroundColor: _utils_color_js__WEBPACK_IMPORTED_MODULE_3__.chartJsColors["deletions"],
            borderWidth: 0,
            tension: 0.3
          }
        ]
      };
    },
    getOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        animation: true,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          x: {
            type: "time",
            grid: {
              display: false
            },
            time: {
              minUnit: "month"
            },
            ticks: {
              maxRotation: 0,
              maxTicksLimit: 12
            }
          },
          y: {
            ticks: {
              maxTicksLimit: 6
            }
          }
        }
      };
    }
  }
});


/***/ }),

/***/ "./node_modules/esbuild-loader/dist/index.cjs??clonedRuleSet-1.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0]!./web_src/js/components/RepoCodeFrequency.vue?vue&type=template&id=6ae6f1d4&scoped=true":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/esbuild-loader/dist/index.cjs??clonedRuleSet-1.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0]!./web_src/js/components/RepoCodeFrequency.vue?vue&type=template&id=6ae6f1d4&scoped=true ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: function() { return /* binding */ render; }
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm-bundler.js");

const _withScopeId = (n) => ((0,vue__WEBPACK_IMPORTED_MODULE_0__.pushScopeId)("data-v-6ae6f1d4"), n = n(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.popScopeId)(), n);
const _hoisted_1 = { class: "ui header tw-flex tw-items-center tw-justify-between" };
const _hoisted_2 = { class: "tw-flex ui segment main-graph" };
const _hoisted_3 = {
  key: 0,
  class: "gt-tc tw-m-auto"
};
const _hoisted_4 = { key: 0 };
const _hoisted_5 = {
  key: 1,
  class: "text red"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SvgIcon = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("SvgIcon");
  const _component_ChartLine = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("ChartLine");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, [
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(
      "div",
      _hoisted_1,
      (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(_ctx.isLoading ? $props.locale.loadingTitle : _ctx.errorText ? $props.locale.loadingTitleFailed : `Code frequency over the history of ${_ctx.repoLink.slice(1)}`),
      1
      /* TEXT */
    ),
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [
      _ctx.isLoading || _ctx.errorText !== "" ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_3, [
        _ctx.isLoading ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_4, [
          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_SvgIcon, {
            name: "octicon-sync",
            class: "tw-mr-2 job-status-rotate"
          }),
          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(
            " " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.locale.loadingInfo),
            1
            /* TEXT */
          )
        ])) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_5, [
          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_SvgIcon, { name: "octicon-x-circle-fill" }),
          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(
            " " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(_ctx.errorText),
            1
            /* TEXT */
          )
        ]))
      ])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true),
      _ctx.data.length !== 0 ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.withMemo)(_ctx.data, () => ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_ChartLine, {
        key: 1,
        data: $options.toGraphData(_ctx.data),
        options: $options.getOptions()
      }, null, 8, ["data", "options"])), _cache, 0) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)
    ])
  ]);
}


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-2.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-2.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0]!./web_src/js/components/RepoCodeFrequency.vue?vue&type=style&index=0&id=6ae6f1d4&scoped=true&lang=css":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-2.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-2.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0]!./web_src/js/components/RepoCodeFrequency.vue?vue&type=style&index=0&id=6ae6f1d4&scoped=true&lang=css ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./web_src/js/components/RepoCodeFrequency.vue":
/*!*****************************************************!*\
  !*** ./web_src/js/components/RepoCodeFrequency.vue ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _RepoCodeFrequency_vue_vue_type_template_id_6ae6f1d4_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RepoCodeFrequency.vue?vue&type=template&id=6ae6f1d4&scoped=true */ "./web_src/js/components/RepoCodeFrequency.vue?vue&type=template&id=6ae6f1d4&scoped=true");
/* harmony import */ var _RepoCodeFrequency_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RepoCodeFrequency.vue?vue&type=script&lang=js */ "./web_src/js/components/RepoCodeFrequency.vue?vue&type=script&lang=js");
/* harmony import */ var _RepoCodeFrequency_vue_vue_type_style_index_0_id_6ae6f1d4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RepoCodeFrequency.vue?vue&type=style&index=0&id=6ae6f1d4&scoped=true&lang=css */ "./web_src/js/components/RepoCodeFrequency.vue?vue&type=style&index=0&id=6ae6f1d4&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;


const __exports__ = /*#__PURE__*/(0,_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__["default"])(_RepoCodeFrequency_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_RepoCodeFrequency_vue_vue_type_template_id_6ae6f1d4_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render],['__scopeId',"data-v-6ae6f1d4"],['__file',"web_src/js/components/RepoCodeFrequency.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ __webpack_exports__["default"] = (__exports__);

/***/ }),

/***/ "./web_src/js/components/RepoCodeFrequency.vue?vue&type=script&lang=js":
/*!*****************************************************************************!*\
  !*** ./web_src/js/components/RepoCodeFrequency.vue?vue&type=script&lang=js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* reexport safe */ _node_modules_esbuild_loader_dist_index_cjs_clonedRuleSet_1_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_RepoCodeFrequency_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]; }
/* harmony export */ });
/* harmony import */ var _node_modules_esbuild_loader_dist_index_cjs_clonedRuleSet_1_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_RepoCodeFrequency_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/esbuild-loader/dist/index.cjs??clonedRuleSet-1.use[0]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0]!./RepoCodeFrequency.vue?vue&type=script&lang=js */ "./node_modules/esbuild-loader/dist/index.cjs??clonedRuleSet-1.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0]!./web_src/js/components/RepoCodeFrequency.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./web_src/js/components/RepoCodeFrequency.vue?vue&type=template&id=6ae6f1d4&scoped=true":
/*!***********************************************************************************************!*\
  !*** ./web_src/js/components/RepoCodeFrequency.vue?vue&type=template&id=6ae6f1d4&scoped=true ***!
  \***********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: function() { return /* reexport safe */ _node_modules_esbuild_loader_dist_index_cjs_clonedRuleSet_1_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_RepoCodeFrequency_vue_vue_type_template_id_6ae6f1d4_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render; }
/* harmony export */ });
/* harmony import */ var _node_modules_esbuild_loader_dist_index_cjs_clonedRuleSet_1_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_RepoCodeFrequency_vue_vue_type_template_id_6ae6f1d4_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/esbuild-loader/dist/index.cjs??clonedRuleSet-1.use[0]!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0]!./RepoCodeFrequency.vue?vue&type=template&id=6ae6f1d4&scoped=true */ "./node_modules/esbuild-loader/dist/index.cjs??clonedRuleSet-1.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0]!./web_src/js/components/RepoCodeFrequency.vue?vue&type=template&id=6ae6f1d4&scoped=true");


/***/ }),

/***/ "./web_src/js/components/RepoCodeFrequency.vue?vue&type=style&index=0&id=6ae6f1d4&scoped=true&lang=css":
/*!*************************************************************************************************************!*\
  !*** ./web_src/js/components/RepoCodeFrequency.vue?vue&type=style&index=0&id=6ae6f1d4&scoped=true&lang=css ***!
  \*************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_2_use_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_2_use_2_node_modules_vue_loader_dist_index_js_ruleSet_0_RepoCodeFrequency_vue_vue_type_style_index_0_id_6ae6f1d4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/mini-css-extract-plugin/dist/loader.js!../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-2.use[1]!../../../node_modules/vue-loader/dist/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-2.use[2]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0]!./RepoCodeFrequency.vue?vue&type=style&index=0&id=6ae6f1d4&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-2.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-2.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0]!./web_src/js/components/RepoCodeFrequency.vue?vue&type=style&index=0&id=6ae6f1d4&scoped=true&lang=css");


/***/ })

}]);
//# sourceMappingURL=code-frequency-graph.71f16827.js.1f5fb6cc.map