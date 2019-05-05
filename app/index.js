'use strict';

var searchComponent = Vue.extend({
  methods: {
    inputSearch: function(event) {
      this.$emit('input-search', event.target.value);
    }
  },
  template: `<section class="search-box">
               <div class="holder clearfix">
                 <span class="search-btn">
                   <i class="fas fa-search"></i>
                 </span>
                 <input class="search-txt" type="text" name="" placeholder="search" v-on:input="inputSearch">
               </div>
             </section>`,
});

var dateComponent = Vue.extend({
  props:['current_date'],
  components: {
    vuejsDatepicker,
    'search-component': searchComponent
  },
  data: function() {
    return {
      defaultDate: new Date(),
      inputClassName: 'datepicker-input',
      wrapperClassName: 'datepicker-wrapper',
      calendarButtonIcon: 'fas fa-calendar-alt fa-2x',
      disabledDates: {
        to: new Date(new Date().setDate(new Date().getDate()-1))
      },
      language:{
        language: 'Japanese',
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        monthsAbbr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        days: ['日', '月', '火', '水', '木', '金', '土'],
        rtl: false,
        ymd: 'yyyy-MM-dd',
        yearSuffix: '年'
      }
    }
  },
  methods: {
    changeDate: function(direction) {
      this.$emit('change-date', direction, null);
      // 1日づつの日付変更をカレンダーに反映させるための処理
      if(direction === 0) {
        this.defaultDate = new Date();
      } else {
        this.defaultDate = new Date(this.current_date.year, this.current_date.month - 1, this.current_date.day + direction);
      }
    },
    selected: function(selectDate){
      this.$emit('change-date', null, selectDate);
    },
    inputSearch: function(value){
      this.$emit('input-search', value);
    }
  },
  template: `<section class="date">
               <div class="holder">
                 <div class="block search">
                   <search-component v-on:input-search="inputSearch"></search-component>
                 </div>
                 <div class="block present">
                   <div class="holder">
                     <template v-if="current_date.isToday">
                       <div class="nav prev disabled"> 
                         <i class="fas fa-chevron-left fa-lg"></i>
                       </div>
                     </template>
                     <template v-else>
                       <div class="nav prev" v-on:click="changeDate(-1)"> 
                         <i class="fas fa-chevron-left fa-lg"></i>
                       </div>
                     </template>
                     <div class="text">
                       <span class="num">{{current_date.year}}</span>
                       <span class="unit">年</span>
                       <span class="num">{{current_date.month}}</span>
                       <span class="unit">月</span>
                       <span class="num">{{current_date.day}}</span>
                       <span class="unit">日</span>
                       <span class="unit">(</span>
                       <span class="dayofweek">{{current_date.dayOfWeekString}}</span>
                       <span class="unit">)</span>
                     </div>
                     <div class="nav next" v-on:click="changeDate(1)">
                       <i class="fas fa-chevron-right fa-lg"></i>
                     </div>
                   </div>
                 </div>
                 <div class="block select">
                   <div class="holder">
                     <div class="btn-today">
                       <div v-if="current_date.isToday" class="ui-component disabled">本日</div>
                       <div v-else class="ui-component" v-on:click="changeDate(0)">本日</div>
                     </div>
                     <div class="pick">
                       <vuejs-datepicker
                         v-model="defaultDate"
                         :disabledDates="disabledDates"
                         :language="language"
                         :monday-first=true
                         :input-class="this.inputClassName"
                         :wrapper-class="this.wrapperClassName"
                         :calendar-button=true
                         :calendar-button-icon="this.calendarButtonIcon"
                         @selected="selected"></vuejs-datepicker>
                     </div>
                   </div>
                 </div>
               </div>
             </section>`,
});

var modalComponent = Vue.extend({
  props:['period_data', 'modal_visibility'],
  methods: {
    clearModal: function() {
      this.$emit('clear-modal');
    }
  },
  template: `<transition>
               <div class="overlay" v-show="modal_visibility" v-on:click.self="clearModal">
                 <div class="modal">
                   <div class="panel">
                     <div class="section cancel">
                       <div class="message">
                         <h1>予約内容</h1>
                         <div class="information">
                           <div class="office">
                             <div class="head">施設名</div>
                             <div class="body">{{period_data.officename}}</div>
                           </div>
                           <div class="space">
                             <div class="head">部屋</div>
                             <div class="body">{{period_data.spacename}}</div>
                           </div>
                           <div class="date">
                             <div class="head">日時</div>
                             <div class="body">{{period_data.year}}年 {{period_data.month}}月 {{period_data.day}}日({{period_data.dayofweek}}) {{period_data.periodname}}</div>
                           </div>
                           <div class="name">
                             <div class="head">お名前</div>
                             <div class="body">{{period_data.guestname}}</div>
                           </div>
                         </div>
                       </div>
                       <div class="nav-holder">
                         <div class="btn-holder">
                           <div class="btn-close ui-component" v-on:click="clearModal">閉じる</div>
                         </div>
                         <div class="btn-holder">
                           <a class="ui-component confirm" v-bind:href="'/reserve/cancel/' + period_data.reservationId">予約をキャンセルする</a>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div class="close" v-on:click="clearModal"></div>
                 </div>
               </div>
             </transition>`,
});

var spaceComponent = Vue.extend({
  props:['space', 'current_date'],
  methods: {
    showModal: function(period) {
      this.$emit('show-modal', period)
    }
  },
  template: `<li class="space clearfix">
                    <div class="information clearfix">
                      <div class="name">{{space.spacename}}</div>
                      <div class="capacity">
                        最大<span>{{space.capacity}}</span>名
                      </div>
                    </div>
                    <div class="reservation">
                      <div class="period" v-for="period in space.periods" v-bind:key="period.num">
                        <div class="time">{{period.periodname}}</div>
                        <a v-if="period.availability"
                           class="status available"
                           key="reserve-available"
                           v-bind:href="'/reserve/space/' + space.spaceId + '/period/' + period.num + '/year/' + current_date.year + '/month/' + current_date.month + '/day/' + current_date.day"
                        >
                           &#9675;
                        </a>
                        <div v-else-if="period.isSelf"
                          class="status unavailable nav-detail"
                          key="reserve-is-self"
                          v-on:click="showModal(period)"
                        >
                          予約済
                        </div>
                        <div v-else
                          class="status unavailable"
                          key="reserve-not-available"
                        >
                          &#10005;
                        </div>
                      </div>
                    </div>
                  </li>`,
});

var officeComponent = Vue.extend({
  props:['office', 'spaces', 'current_date'],
  data: function() {
    return {
      showImg: false
    }
  },
  components: {
    'space-component': spaceComponent
  },
  methods: {
    showModal: function(period) {
      this.$emit('show-modal', period)
    }
  },
  template: `<div class="box">
              <div class="information">
                <div class="photo"><img v-bind:src="office.imgPath" v-on:load="showImg=true" v-bind:class="{hide: !showImg}" class="responsive-img"></div>
                <div class="name">{{office.officename}}</div>
              </div>
              <div class="data">
                <ul class="space-list">
                  <space-component v-for="space in spaces" v-bind:key="space.spaceId" v-bind:space="space" v-bind:current_date="current_date" v-on:show-modal="showModal"></space-component>
                </ul>
              </div>
            </div>`,
});

var app = new Vue({
  el: '#app',
  components: {
    'office-component': officeComponent,
    'date-component': dateComponent,
    'modal-component': modalComponent,
  },
  data: {
    currentDate: {},
    offices: [],
    officeSpaceObject: {},
    periodData: {},
    modal_visibility: false,
    pattern: ''
  },
  created() {
    var uri = window.location.href.split('?');
    if (uri.length == 2) {
      var vars = uri[1].split('&');
      var getVars = {};
      var tmp = '';
      vars.forEach(function(v){
        tmp = v.split('=');
        if(tmp.length == 2)
        getVars[tmp[0]] = tmp[1];
      });
      this.currentDate.year = Number(getVars.year);
      this.currentDate.month = Number(getVars.month);
      this.currentDate.day = Number(getVars.day);
    }
  },
  mounted() {
    var url = '/dateOfCurrentDay';
    if (this.currentDate.year && this.currentDate.month && this.currentDate.day) {
      var parameter = '?year=' + this.currentDate.year + '&month=' + this.currentDate.month + '&day=' + this.currentDate.day;
      url += parameter;
    }
    axios
      .get(url)
      .then(response => {
        this.currentDate = response.data.currentDate;
        this.offices = response.data.offices;
        this.officeSpaceObject = response.data.officeSpaceObject;
      })
  },
  methods: {
    inputSearch: function(value) {
      this.pattern = value
    },
    showModal: function(period) {
      this.modal_visibility = true;
      this.periodData = period
    },
    clearModal: function() {
      this.modal_visibility = false;
    },
    changeDate: function(direction, selectDate) {
      var url = '/dateOfCurrentDay';
      if (direction && direction !== 0) {
        var day = Number(this.currentDate.day) + direction;
        var parameter = '?year=' + this.currentDate.year + '&month=' + this.currentDate.month + '&day=' + day;
        url += parameter;
      } else if (selectDate) {
        var year = selectDate.getFullYear();
        var month = selectDate.getMonth() + 1;
        var day = selectDate.getDate();
        var parameter = '?year=' + year + '&month=' + month + '&day=' + day;
        url += parameter;
      }
      axios
        .get(url)
        .then(response => {
          this.currentDate = response.data.currentDate;
          this.offices = response.data.offices;
          this.officeSpaceObject = response.data.officeSpaceObject;
        })
    }
  },
  computed: {
    matched: function() {
      return this.offices.filter(function (office) {
        var pattern = new RegExp(this.pattern, 'i');
        return pattern.test(office.officename)
      }, this)
    },
  }
})
