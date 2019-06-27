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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ({

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mainComponent = Vue.extend({
  props: ['reservations'],
  methods: {
    showModal: function showModal(reservation) {
      this.$emit('show-modal', reservation);
    }
  },
  template: '<section class="my-reservation">\n               <div class="container">\n                 <div class="head-component">\n                   <h1>Reservation<span>\u3054\u4E88\u7D04\u4E00\u89A7</span></h1>\n                 </div>\n               </div>\n               <div class="container">\n                 <div class="my-reservation-list">\n                   <div class="block">\n                     <div class="line date">\n                       <div class="head">\u4E88\u5B9A\u65E5\u6642</div>\n                     </div>\n                     <div class="line officename">\n                       <div class="head">\u65BD\u8A2D</div>\n                     </div>\n                     <div class="line spacename">\n                       <div class="head">\u90E8\u5C4B</div>\n                     </div>\n                     <div class="line guestname">\n                       <div class="head">\u304A\u540D\u524D</div>\n                     </div>\n                     <div class="line action">\n                       <div class="head">\u30AD\u30E3\u30F3\u30BB\u30EB</div>\n                     </div>\n                   </div>\n                   <div class="block" v-for="reservation in reservations" v-bind:key="reservation.reservationId">\n                     <div class="line date">\n                       <div class="head">\u4E88\u5B9A\u65E5\u6642</div>\n                       <div class="body">{{reservation.formattedDate}}\n                         <span>{{reservation.startTimeString}}-{{reservation.endTimeString}}</span>\n                       </div>\n                     </div>\n                     <div class="line officename">\n                       <div class="head">\u65BD\u8A2D</div>\n                       <div class="body">{{reservation.officename}}</div>\n                     </div>\n                     <div class="line spacename">\n                       <div class="head">\u90E8\u5C4B</div>\n                       <div class="body">{{reservation.space.spacename}}</div>\n                     </div>\n                     <div class="line guestname">\n                       <div class="head">\u304A\u540D\u524D</div>\n                       <div class="body">{{reservation.guestname}}</div>\n                     </div>\n                     <div class="line action">\n                       <div class="head">\u30AD\u30E3\u30F3\u30BB\u30EB</div>\n                       <div class="body">\n                         <span v-if="reservation.canceled" key="canceled">\u30AD\u30E3\u30F3\u30BB\u30EB\u6E08\u307F</span>\n                         <div class="btn-cancel" v-else key="not-canceled" v-on:click="showModal(reservation)">\u30AD\u30E3\u30F3\u30BB\u30EB</div>\n                       </div>\n                     </div>\n                   </div>\n                 </div>\n               </div>\n             </section>'
});

var modalComponent = Vue.extend({
  props: ['period_data', 'modal_visibility'],
  methods: {
    clearModal: function clearModal() {
      this.$emit('clear-modal');
    }
  },
  template: '<transition>\n                   <div class="overlay" v-show="modal_visibility" v-on:click.self="clearModal">\n                     <div class="modal">\n                       <div class="panel">\n                         <div class="section cancel">\n                           <div class="message">\n                             <h1>\u4E88\u7D04\u5185\u5BB9</h1>\n                             <div class="information">\n                               <div class="office">\n                                 <div class="head">\u65BD\u8A2D\u540D</div>\n                                 <div class="body">{{period_data.officename}}</div>\n                               </div>\n                               <div class="space">\n                                 <div class="head">\u90E8\u5C4B</div>\n                                 <div class="body">{{period_data.spacename}}</div>\n                               </div>\n                               <div class="date">\n                                 <div class="head">\u65E5\u6642</div>\n                                 <div class="body">{{period_data.formattedDate}} {{period_data.startTimeString}}-{{period_data.endTimeString}}</div>\n                               </div>\n                               <div class="name">\n                                 <div class="head">\u304A\u540D\u524D</div>\n                                 <div class="body">{{period_data.guestname}}</div>\n                               </div>\n                             </div>\n                           </div>\n                           <div class="nav-holder">\n                             <div class="btn-holder">\n                               <div class="btn-close ui-component" v-on:click="clearModal">\u9589\u3058\u308B</div>\n                             </div>\n                             <div class="btn-holder">\n                               <a class="ui-component confirm" v-bind:href="\'/reserve/cancel/\' + period_data.reservationId">\u4E88\u7D04\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3059\u308B</a>\n                             </div>\n                           </div>\n                         </div>\n                       </div>\n                       <div class="close" v-on:click="clearModal"></div>\n                     </div>\n                   </div>\n                 </transition>'
});

var app = new Vue({
  el: '#app',
  components: {
    'main-component': mainComponent,
    'modal-component': modalComponent
  },
  data: {
    modal_visibility: false,
    periodData: {},
    reservations: []
  },
  mounted: function mounted() {
    var _this = this;

    axios.get('/mypage/myReservations').then(function (response) {
      _this.reservations = response.data;
    });
  },

  methods: {
    showModal: function showModal(period) {
      this.modal_visibility = true;
      this.periodData = period;
    },
    clearModal: function clearModal() {
      this.modal_visibility = false;
    }
  }
});

/***/ })

/******/ });