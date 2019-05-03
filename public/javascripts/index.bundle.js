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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dateComponent = Vue.extend({
  props: ['current_date'],
  components: {
    vuejsDatepicker: vuejsDatepicker
  },
  data: function data() {
    return {
      defaultDate: new Date(),
      inputClassName: 'datepicker-input',
      wrapperClassName: 'datepicker-wrapper',
      calendarButtonIcon: 'fas fa-calendar-alt fa-2x',
      language: {
        language: 'Japanese',
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        monthsAbbr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        days: ['日', '月', '火', '水', '木', '金', '土'],
        rtl: false,
        ymd: 'yyyy-MM-dd',
        yearSuffix: '年'
      }
    };
  },
  methods: {
    changeDate: function changeDate(direction) {
      this.$emit('change-date', direction);
      // 1日づつの日付変更をカレンダーに反映させるための処理
      this.defaultDate = new Date(this.current_date.year, this.current_date.month - 1, this.current_date.day + direction);
    },
    selected: function selected(selectValue) {
      console.log(selectValue);
    }
  },
  template: '<section class="date">\n               <div class="holder">\n                 <div class="block today">\n                   <div class="ui-component" v-on:click="changeDate(0)">\u672C\u65E5</div>\n                 </div>\n                 <div class="block present">\n                   <div class="holder">\n                     <template v-if="current_date.isToday">\n                       <div class="nav prev disabled"> \n                         <i class="fas fa-chevron-left fa-lg"></i>\n                       </div>\n                     </template>\n                     <template v-else>\n                       <div class="nav prev" v-on:click="changeDate(-1)"> \n                         <i class="fas fa-chevron-left fa-lg"></i>\n                       </div>\n                     </template>\n                     <div class="text">\n                       <span class="num">{{current_date.year}}</span>\n                       <span class="unit">\u5E74</span>\n                       <span class="num">{{current_date.month}}</span>\n                       <span class="unit">\u6708</span>\n                       <span class="num">{{current_date.day}}</span>\n                       <span class="unit">\u65E5</span>\n                       <span class="unit">(</span>\n                       <span class="dayofweek">{{current_date.dayOfWeekString}}</span>\n                       <span class="unit">)</span>\n                     </div>\n                     <div class="nav next" v-on:click="changeDate(1)">\n                       <i class="fas fa-chevron-right fa-lg"></i>\n                     </div>\n                   </div>\n                 </div>\n                 <div class="block select">\n                   <vuejs-datepicker\n                     v-model="defaultDate"\n                     :language="language"\n                     :monday-first=true\n                     :input-class="this.inputClassName"\n                     :wrapper-class="this.wrapperClassName"\n                     :calendar-button=true\n                     :calendar-button-icon="this.calendarButtonIcon"\n                     @selected="selected"></vuejs-datepicker>\n                 </div>\n               </div>\n             </section>'
});

var modalComponent = Vue.extend({
  props: ['period_data', 'modal_visibility'],
  methods: {
    clearModal: function clearModal() {
      this.$emit('clear-modal');
    }
  },
  template: '<transition>\n               <div class="overlay" v-show="modal_visibility" v-on:click.self="clearModal">\n                 <div class="modal">\n                   <div class="panel">\n                     <div class="section cancel">\n                       <div class="message">\n                         <h1>\u4E88\u7D04\u5185\u5BB9</h1>\n                         <div class="information">\n                           <div class="office">\n                             <div class="head">\u65BD\u8A2D\u540D</div>\n                             <div class="body">{{period_data.officename}}</div>\n                           </div>\n                           <div class="space">\n                             <div class="head">\u90E8\u5C4B</div>\n                             <div class="body">{{period_data.spacename}}</div>\n                           </div>\n                           <div class="date">\n                             <div class="head">\u65E5\u6642</div>\n                             <div class="body">{{period_data.year}}\u5E74 {{period_data.month}}\u6708 {{period_data.day}}\u65E5({{period_data.dayofweek}}) {{period_data.periodname}}</div>\n                           </div>\n                           <div class="name">\n                             <div class="head">\u304A\u540D\u524D</div>\n                             <div class="body">{{period_data.guestname}}</div>\n                           </div>\n                         </div>\n                       </div>\n                       <div class="nav-holder">\n                         <div class="btn-holder">\n                           <div class="btn-close ui-component" v-on:click="clearModal">\u9589\u3058\u308B</div>\n                         </div>\n                         <div class="btn-holder">\n                           <a class="ui-component confirm" v-bind:href="\'/reserve/cancel/\' + period_data.reservationId">\u4E88\u7D04\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3059\u308B</a>\n                         </div>\n                       </div>\n                     </div>\n                   </div>\n                   <div class="close" v-on:click="clearModal"></div>\n                 </div>\n               </div>\n             </transition>'
});

var spaceComponent = Vue.extend({
  props: ['space', 'current_date'],
  methods: {
    showModal: function showModal(period) {
      this.$emit('show-modal', period);
    }
  },
  template: '<li class="space clearfix">\n                    <div class="information clearfix">\n                      <div class="name">{{space.spacename}}</div>\n                      <div class="capacity">\n                        \u6700\u5927<span>{{space.capacity}}</span>\u540D\n                      </div>\n                    </div>\n                    <div class="reservation">\n                      <div class="period" v-for="period in space.periods" v-bind:key="period.num">\n                        <div class="time">{{period.periodname}}</div>\n                        <a v-if="period.availability"\n                           class="status available"\n                           key="reserve-available"\n                           v-bind:href="\'/reserve/space/\' + space.spaceId + \'/period/\' + period.num + \'/year/\' + current_date.year + \'/month/\' + current_date.month + \'/day/\' + current_date.day"\n                        >\n                           &#9675;\n                        </a>\n                        <div v-else-if="period.isSelf"\n                          class="status unavailable nav-detail"\n                          key="reserve-is-self"\n                          v-on:click="showModal(period)"\n                        >\n                          \u4E88\u7D04\u6E08\n                        </div>\n                        <div v-else\n                          class="status unavailable"\n                          key="reserve-not-available"\n                        >\n                          &#10005;\n                        </div>\n                      </div>\n                    </div>\n                  </li>'
});

var officeComponent = Vue.extend({
  props: ['office', 'spaces', 'current_date'],
  data: function data() {
    return {
      showImg: false
    };
  },
  components: {
    'space-component': spaceComponent
  },
  methods: {
    showModal: function showModal(period) {
      this.$emit('show-modal', period);
    }
  },
  template: '<div class="box">\n              <div class="information">\n                <div class="photo"><img v-bind:src="office.imgPath" v-on:load="showImg=true" v-bind:class="{hide: !showImg}" class="responsive-img"></div>\n                <div class="name">{{office.officename}}</div>\n              </div>\n              <div class="data">\n                <ul class="space-list">\n                  <space-component v-for="space in spaces" v-bind:key="space.spaceId" v-bind:space="space" v-bind:current_date="current_date" v-on:show-modal="showModal"></space-component>\n                </ul>\n              </div>\n            </div>'
});

var app = new Vue({
  el: '#app',
  components: {
    'office-component': officeComponent,
    'date-component': dateComponent,
    'modal-component': modalComponent
  },
  data: {
    currentDate: {},
    offices: [],
    officeSpaceObject: {},
    periodData: {},
    modal_visibility: false
  },
  created: function created() {
    var uri = window.location.href.split('?');
    if (uri.length == 2) {
      var vars = uri[1].split('&');
      var getVars = {};
      var tmp = '';
      vars.forEach(function (v) {
        tmp = v.split('=');
        if (tmp.length == 2) getVars[tmp[0]] = tmp[1];
      });
      this.currentDate.year = Number(getVars.year);
      this.currentDate.month = Number(getVars.month);
      this.currentDate.day = Number(getVars.day);
    }
  },
  mounted: function mounted() {
    var _this = this;

    var url = '/dateOfCurrentDay';
    if (this.currentDate.year && this.currentDate.month && this.currentDate.day) {
      var parameter = '?year=' + this.currentDate.year + '&month=' + this.currentDate.month + '&day=' + this.currentDate.day;
      url += parameter;
    }
    axios.get(url).then(function (response) {
      _this.currentDate = response.data.currentDate;
      _this.offices = response.data.offices;
      _this.officeSpaceObject = response.data.officeSpaceObject;
    });
  },

  methods: {
    showModal: function showModal(period) {
      this.modal_visibility = true;
      this.periodData = period;
    },
    clearModal: function clearModal() {
      this.modal_visibility = false;
    },
    changeDate: function changeDate(direction) {
      var _this2 = this;

      var url = '/dateOfCurrentDay';
      if (direction !== 0) {
        var day = Number(this.currentDate.day) + direction;
        var parameter = '?year=' + this.currentDate.year + '&month=' + this.currentDate.month + '&day=' + day;
        url += parameter;
      }
      axios.get(url).then(function (response) {
        _this2.currentDate = response.data.currentDate;
        _this2.offices = response.data.offices;
        _this2.officeSpaceObject = response.data.officeSpaceObject;
      });
    }
  }
});

/***/ })

/******/ });