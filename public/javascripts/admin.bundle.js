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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ({

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mainComponent = Vue.extend({
  props: ['spaces'],
  methods: {
    showModal: function showModal(space) {
      this.$emit('show-modal', space);
    }
  },
  template: '<section class="admin-list">\n               <div class="container">\n                 <div class="head-component">\n                   <h1>OfficeList<span>\u30B9\u30DA\u30FC\u30B9\u4E00\u89A7</span></h1>\n                 </div>\n                 <table>\n                   <thead>\n                     <tr>\n                       <th>No</th>\n                       <th>\u30B9\u30DA\u30FC\u30B9\u540D</th>\n                       <th>\u6240\u5C5E\u30AA\u30D5\u30A3\u30B9</th>\n                       <th>\u64CD\u4F5C</th>\n                     </tr>\n                   </thead>\n                   <tbody>\n                     <tr v-for="(space, index) in spaces" v-bind:key="space.spaceId">\n                       <td class="num">{{index + 1}}</td>\n                       <td class="name">{{space.spacename}}</td>\n                       <td class="office">{{space["office.officename"]}}</td>\n                       <td class="action">\n                         <div class="flex-container">\n                           <div class="ui-component config" v-on:click="showModal(space)">\u304A\u4F11\u307F\u8A2D\u5B9A</div>\n                           <a class="ui-component update" v-bind:href="\'/admin/space/update/\' + space.spaceId">\u7DE8\u96C6</a>\n                           <a class="ui-component delete confirmation" v-bind:href="\'/admin/space/delete/\' + space.spaceId">\u524A\u9664</a>\n                         </div>\n                       </td>\n                     </tr>\n                   </tbody>\n                 </table>\n               </div>\n             </section>'
});

var modalComponent = Vue.extend({
  props: ['space_data', 'modal_visibility'],
  components: {
    vuejsDatepicker: vuejsDatepicker
  },
  data: function data() {
    return {
      dayofweek: [],
      isButtonDisabled: true,
      permanent: false,
      datePickerStart: new Date(),
      datePickerEnd: new Date(),
      datePickerFormrt: 'yyyy年MMMdd日（D）',
      inputClassName: 'ui-component',
      wrapperClassName: 'datepicker-wrapper',
      disabledDates: {
        to: new Date(new Date().setDate(new Date().getDate() - 1))
      },
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
    selected: function selected(selectDate) {
      this.disabledDates.to = selectDate;
      if (selectDate.getTime() > this.datePickerEnd.getTime()) {
        this.datePickerEnd = selectDate;
      }
    },
    changedayofweek: function changedayofweek(e) {
      if (this.dayofweek.length === 0) {
        this.isButtonDisabled = true;
      } else {
        this.isButtonDisabled = false;
      }
    },
    clearModal: function clearModal() {
      this.$emit('clear-modal');
    }
  },
  template: '<div>\n               <transition>\n                 <div class="overlay" v-show="modal_visibility" v-on:click.self="clearModal"></div>\n               </transition>\n               <transition>\n                 <div class="modal admin-modal" v-show="modal_visibility">\n                   <div class="panel">\n                     <div class="wrapper">\n                       <div class="information close-config">\n                         <h2>\u65B0\u898F\u8A2D\u5B9A\u8FFD\u52A0</h2>\n                         <form action="/admin/space/close" method="post" class="ui-component">\n                           <input type="hidden" name="spaceId" v-bind:value="space_data.spaceId">\n                           <h3>\u65E5\u4ED8\u3067\u8A2D\u5B9A</h3>\n                           <table class="add date">\n                             <tr>\n                               <td>\n                                 <div class="pick">\n                                   <vuejs-datepicker\n                                     v-model="datePickerStart"\n                                     name="datePickerStart"\n                                     :format="this.datePickerFormrt"\n                                     :disabledDates="disabledDates"\n                                     :language="language"\n                                     :monday-first=true\n                                     :input-class="this.inputClassName"\n                                     :wrapper-class="this.wrapperClassName"\n                                     @selected="selected"></vuejs-datepicker>\n                                 </div>\n                               </td>\n                               <td>\n                                 <input type="checkbox" v-model="permanent" id="permanent" name="permanent" class="ui-component">\n                                 <label for="permanent" class="ui-component checkbox-label single-label">\u4EE5\u964D\u305A\u3063\u3068</label>\n                               </td>\n                               <td class="or">\u301C</td>\n                               <td>\n                                 <div class="pick">\n                                   <vuejs-datepicker\n                                     v-model="datePickerEnd"\n                                     name="datePickerEnd"\n                                     :disabled="permanent"\n                                     :format="this.datePickerFormrt"\n                                     :disabledDates="disabledDates"\n                                     :language="language"\n                                     :monday-first=true\n                                     :input-class="this.inputClassName"\n                                     :wrapper-class="this.wrapperClassName"></vuejs-datepicker>\n                                 </div>\n                               </td>\n                               <td>\n                                 <button type="submit" class="ui-component">\u8FFD\u52A0</button>\n                               </td>\n                             </tr>\n                           </table>\n                         </form>\n                         <form action="/admin/space/close" method="post" class="ui-component">\n                           <input type="hidden" name="spaceId" v-bind:value="space_data.spaceId">\n                           <h3>\u66DC\u65E5\u3067\u8A2D\u5B9A</h3>\n                           <table class="add day">\n                             <tr>\n                               <td>\n                                 <div class="checkbox-wrapper">\n                                   <input type="checkbox" name="dayofweek" id="monday" value="1" v-model="dayofweek" @change="changedayofweek($event)" class="ui-component">\n                                   <label for="monday" class="ui-component checkbox-label">\u6708</label>\n                                   <input type="checkbox" name="dayofweek" id="tuesday" value="2" v-model="dayofweek" @change="changedayofweek($event)" class="ui-component">\n                                   <label for="tuesday" class="ui-component checkbox-label">\u706B</label>\n                                   <input type="checkbox" name="dayofweek" id="wednesday" value="3" v-model="dayofweek" @change="changedayofweek($event)" class="ui-component">\n                                   <label for="wednesday" class="ui-component checkbox-label">\u6C34</label>\n                                   <input type="checkbox" name="dayofweek" id="thursday" value="4" v-model="dayofweek" @change="changedayofweek($event)" class="ui-component">\n                                   <label for="thursday" class="ui-component checkbox-label">\u6728</label>\n                                   <input type="checkbox" name="dayofweek" id="friday" value="5" v-model="dayofweek" @change="changedayofweek($event)" class="ui-component">\n                                   <label for="friday" class="ui-component checkbox-label">\u91D1</label>\n                                   <input type="checkbox" name="dayofweek" id="saturday" value="6" v-model="dayofweek" @change="changedayofweek($event)" class="ui-component">\n                                   <label for="saturday" class="ui-component checkbox-label">\u571F</label>\n                                   <input type="checkbox" name="dayofweek" id="sunday" value="0" v-model="dayofweek" @change="changedayofweek($event)" class="ui-component">\n                                   <label for="sunday" class="ui-component checkbox-label">\u65E5</label>\n                                 </div>\n                               </td>\n                               <td>\n                                 <button type="submit" v-bind:disabled="isButtonDisabled" class="ui-component">\u8FFD\u52A0</button>\n                               </td>\n                             </tr>\n                           </table>\n                         </form>\n                         <template v-if="space_data.closeDataArray">\n                           <h2>\u8A2D\u5B9A\u4E00\u89A7</h2>\n                           <ul class="list">\n                             <li v-for="close in space_data.closeDataArray" v-bind:key="close.closeId">\n                               <form action="/admin/space/close/cancel" method="post" class="ui-component">\n                                 <input type="hidden" name="closeId" v-bind:value="close.closeId">\n                                 <table>\n                                   <tr>\n                                     <template v-if="close.dayofweek">\n                                       <th>\u66DC\u65E5</th>\n                                       <td>{{close.dayOfWeekString}}</td>\n                                     </template>\n                                     <template  v-else-if="close.permanent">\n                                       <th>\u65E5\u4ED8</th>\n                                       <td>\n                                         {{close.formattedStartdate}}\n                                         <span>\u4EE5\u964D\u305A\u3063\u3068</span>\n                                       </td>\n                                     </template>\n                                     <template v-else>\n                                       <th>\u65E5\u4ED8</th>\n                                       <td>\n                                         {{close.formattedStartdate}}\n                                         <span>\u301C</span>\n                                         {{close.formattedEnddate}}\n                                       </td>\n                                     </template>\n                                     <td>\n                                       <button type="submit" class="ui-component">\u524A\u9664</button>\n                                     </td>\n                                   </tr>\n                                 </table>\n                               </form>\n                             </li>\n                           </ul>\n                         </template>\n                       </div>\n                     </div>\n                     <div class="close" v-on:click="clearModal"></div>\n                   </div>\n                 </div>\n               </transition>\n             </div>'
});

var app = new Vue({
  el: '#app',
  components: {
    'main-component': mainComponent,
    'modal-component': modalComponent
  },
  data: {
    modal_visibility: false,
    spaceData: {},
    spaces: []
  },
  mounted: function mounted() {
    var _this = this;

    axios.get('/admin/space/list').then(function (response) {
      _this.spaces = response.data;
      console.log(response.data);
    });
  },

  methods: {
    showModal: function showModal(space) {
      this.modal_visibility = true;
      this.spaceData = space;
    },
    clearModal: function clearModal() {
      this.modal_visibility = false;
    }
  }
});

/***/ })

/******/ });