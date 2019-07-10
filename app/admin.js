'use strict';

var mainComponent = Vue.extend({
  components: {
    vuejsDatepicker
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
    selected: function(selectDate){
      console.log(selectDate);
    }
  },
  template: `<section>
               <div class="container">
                 <div class="head-component">
                   <h1>Close<span>お休み設定</span></h1>
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
             </section>`
});

var app = new Vue({
  el: '#app',
  components: {
    'main-component': mainComponent,
  }
})
