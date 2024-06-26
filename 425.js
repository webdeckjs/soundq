(self['webpackChunksoundq'] = self['webpackChunksoundq'] || []).push([["425"], {
"251": (function (__unused_webpack_module, exports, __webpack_require__) {
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ 'use strict';
var f = __webpack_require__(/*! react */"458"), k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = {
    key: !0,
    ref: !0,
    __self: !0,
    __source: !0
};
function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for(b in a)m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for(b in a = c.defaultProps, a)void 0 === d[b] && (d[b] = a[b]);
    return {
        $$typeof: k,
        type: c,
        key: e,
        ref: h,
        props: d,
        _owner: n.current
    };
}
exports.Fragment = l;
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
  "default": function() { return __WEBPACK_DEFAULT_EXPORT__; },
  onPress: function() { return onPress; }
});
/* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */"893");
/* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */"458");
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
function _define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    else ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
    return target;
}


var context = new AudioContext();
 var onPress = function(param) {
    var config = param.config;
    // Create Nodes
    var osc = context.createOscillator();
    var gain = context.createGain();
    var filter = context.createBiquadFilter();
    filter.frequency.setValueAtTime(config.filterFreq, context.currentTime, 0);
    gain.gain.setValueAtTime(config.gain, context.currentTime);
    osc.type = config.waveform || "sine";
    osc.frequency.value = config.frequency || 100;
    // Connect Nodes
    osc.connect(filter);
    filter.connect(context.destination);
    osc.connect(gain);
    gain.connect(context.destination);
    // Play
    osc.start(0);
    // g.gain.exponentialRampToValueAtTime(
    //     config.ramp || 1.0,
    //     context.currentTime + 2
    // );
    osc.stop(context.currentTime + 2);
};
var App = function(param) {
    var config = param.config, setConfig = param.setConfig;
    var onChange = function(event) {
        console.log(event.target.name, event.target.value);
        setConfig(_object_spread_props(_object_spread({}, config), _define_property({}, event.target.name, event.target.value)));
    };
    return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        style: {
            height: "100%",
            background: "pink"
        },
        children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            style: {
                padding: "2em"
            },
            children: [
                /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
                    children: "SoundQ Oscillator Plugin"
                }),
                /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: "settings",
                    children: [
                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "setting",
                            children: [
                                /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
                                    htmlFor: "waveform",
                                    children: "Waveform: "
                                }),
                                /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", {
                                    required: true,
                                    name: "waveform",
                                    onChange: onChange,
                                    value: config.waveform || "",
                                    children: [
                                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", {
                                            value: "",
                                            disabled: true,
                                            hidden: true,
                                            children: "sine"
                                        }),
                                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", {
                                            value: "sine",
                                            children: "sine"
                                        }),
                                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", {
                                            value: "square",
                                            children: "square"
                                        }),
                                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", {
                                            value: "sawtooth",
                                            children: "sawtooth"
                                        }),
                                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", {
                                            value: "triangle",
                                            children: "triangle"
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "setting",
                            children: [
                                /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
                                    htmlFor: "filterType",
                                    children: "Filter Type: "
                                }),
                                /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", {
                                    required: true,
                                    name: "filterType",
                                    onChange: onChange,
                                    value: config.filterType || "",
                                    children: [
                                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", {
                                            value: "",
                                            disabled: true,
                                            hidden: true,
                                            children: "lowpass"
                                        }),
                                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", {
                                            value: "lowpass",
                                            children: "Low Pass"
                                        }),
                                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", {
                                            value: "highpass",
                                            children: "High Pass"
                                        }),
                                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", {
                                            value: "bandpass",
                                            children: "Band Pass"
                                        }),
                                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", {
                                            value: "lowshelf",
                                            children: "Low Shelf"
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "setting",
                            children: [
                                /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
                                    htmlFor: "frequency",
                                    children: "Frequency: "
                                }),
                                /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
                                    type: "number",
                                    name: "frequency",
                                    placeholder: "403",
                                    onChange: onChange,
                                    value: config.frequency || ""
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "setting",
                            children: [
                                /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
                                    htmlFor: "filterFreq",
                                    children: "Filter Freq: "
                                }),
                                /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
                                    type: "range",
                                    name: "filterFreq",
                                    min: "30",
                                    max: "1000",
                                    step: "1",
                                    onChange: onChange,
                                    value: config.filterFreq || 1.0
                                }),
                                parseFloat(config.filterFreq || 1.0).toFixed(0)
                            ]
                        }),
                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "setting",
                            children: [
                                /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
                                    htmlFor: "ramp",
                                    children: "Ramp: "
                                }),
                                /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
                                    type: "range",
                                    name: "ramp",
                                    min: "0.0001",
                                    max: "1",
                                    step: "0.0001",
                                    onChange: onChange,
                                    value: config.ramp || 1.0
                                }),
                                parseFloat(config.ramp || 1.0).toFixed(4)
                            ]
                        }),
                        /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "setting",
                            children: [
                                /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
                                    htmlFor: "ramp",
                                    children: "Gain: "
                                }),
                                /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
                                    type: "range",
                                    name: "gain",
                                    min: "0.0001",
                                    max: "1",
                                    step: "0.0001",
                                    onChange: onChange,
                                    value: config.gain || 1.0
                                }),
                                parseFloat(config.gain || 1.0).toFixed(4)
                            ]
                        })
                    ]
                })
            ]
        })
    });
};
var __WEBPACK_DEFAULT_EXPORT__ = App;
}),
"447": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */"893");
/* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */var _App__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./App */"130");
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */"458");
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */var react_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-dom */"261");
/* harmony import */var react_dom__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_3__);




// Nothing needs to chagne here.
// Make all changes in <App> component.
react_dom__WEBPACK_IMPORTED_MODULE_3___default().render(/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_App__WEBPACK_IMPORTED_MODULE_1__["default"], {
    config: {},
    setConfig: function() {}
}), document.getElementById("root"));
}),

}]);
//# sourceMappingURL=425.js.map