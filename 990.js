(self['webpackChunkwebdeck_plugin_template'] = self['webpackChunkwebdeck_plugin_template'] || []).push([["990"], {
"251": (function (__unused_webpack_module, exports, __webpack_require__) {
/** @license React v16.14.0
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ 'use strict';
var f = __webpack_require__(/*! react */"478"), g = 60103;
exports.Fragment = 60107;
if ("function" === typeof Symbol && Symbol.for) {
    var h = Symbol.for;
    g = h("react.element");
    exports.Fragment = h("react.fragment");
}
var m = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, n = Object.prototype.hasOwnProperty, p = {
    key: !0,
    ref: !0,
    __self: !0,
    __source: !0
};
function q(c, a, k) {
    var b, d = {}, e = null, l = null;
    void 0 !== k && (e = "" + k);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (l = a.ref);
    for(b in a)n.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for(b in a = c.defaultProps, a)void 0 === d[b] && (d[b] = a[b]);
    return {
        $$typeof: g,
        type: c,
        key: e,
        ref: l,
        props: d,
        _owner: m.current
    };
}
exports.jsx = q;
exports.jsxs = q;
}),
"893": (function (module, __unused_webpack_exports, __webpack_require__) {
'use strict';
module.exports = __webpack_require__(/*! ./cjs/react-jsx-runtime.production.min.js */"251");
}),
"130": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */"893");
/* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */"478");
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


var App = function(param) {
    var title = param.title;
    return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        style: {
            borderRadius: "4px",
            padding: "2em",
            backgroundColor: "red",
            color: "white"
        },
        "data-e2e": "APP_2__WIDGET",
        children: title
    });
};
var __WEBPACK_DEFAULT_EXPORT__ = App;
}),

}]);
//# sourceMappingURL=990.js.map