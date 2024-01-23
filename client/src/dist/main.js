"use strict";
exports.__esModule = true;
require("@/styles/element-variables.scss");
require("@/styles/index.scss");
var App_vue_1 = require("@/App.vue");
var store_1 = require("@/store");
var router_1 = require("@/router");
require("@/icons/components");
require("@/permission");
var vue_1 = require("vue");
require("normalize.css");
var element_ui_1 = require("element-ui");
var vue_svgicon_1 = require("vue-svgicon");
vue_1["default"].use(element_ui_1["default"]);
vue_1["default"].use(vue_svgicon_1["default"], {
    'tagName': 'svg-icon',
    defaultWidth: '1em',
    defaultHeight: '1em'
});
vue_1["default"].config.productionTip = false;
new vue_1["default"]({
    router: router_1["default"],
    store: store_1["default"],
    render: function (h) { return h(App_vue_1["default"]); }
}).$mount('#app');
