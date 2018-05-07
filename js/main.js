/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var name_class_1 = __webpack_require__(1);
var scrollTo_module_1 = __webpack_require__(3);
function getScrollOffset(element) {
    var scrolledAmt = document.documentElement.scrollTop;
    return scrolledAmt + element.getBoundingClientRect().top;
}
(function () {
    document.addEventListener('DOMContentLoaded', function (event) {
        var instance = new name_class_1.NameClass();
        instance.foo();
        var button = document.querySelector('#start');
        button.addEventListener('click', function () {
            scrollTo_module_1["default"](getScrollOffset(document.querySelector('.lesson-modules')), 600);
        });
        var nextLessonBtns = Array.prototype.slice.call(document.querySelectorAll('.button--next-lesson'));
        nextLessonBtns.forEach(function (element) {
            element.addEventListener('click', function () {
                scrollTo_module_1["default"](getScrollOffset(element.parentElement.nextElementSibling), 600);
            });
        });
    });
})();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var NameClass = /** @class */ (function () {
    function NameClass() {
        this.init();
    }
    ;
    NameClass.prototype.init = function () {
    };
    ;
    NameClass.prototype.foo = function () {
        console.log('Foo!');
    };
    ;
    return NameClass;
}());
exports.NameClass = NameClass;
;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
function default_1(to, duration) {
    var element = document.scrollingElement || document.documentElement, start = element.scrollTop, change = to - start, startDate = +new Date(), 
    // t = current time
    // b = start value
    // c = change in value
    // d = duration
    easeInOutQuad = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }, animateScroll = function () {
        var currentDate = +new Date();
        var currentTime = currentDate - startDate;
        element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
        if (currentTime < duration) {
            requestAnimationFrame(animateScroll);
        }
        else {
            element.scrollTop = to;
        }
    };
    animateScroll();
}
exports["default"] = default_1;
;


/***/ })
/******/ ]);