'use strict';

var mainComponent = Vue.extend({
  components: {
    vuejsDatepicker
  },
  data: function() {
    return {
      datePickerStart: new Date(),
      datePickerEnd: new Date(),
      datePickerFormrt: 'yyyy年MMMdd日（D）',
      inputClassName: 'ui-component',
      wrapperClassName: 'datepicker-wrapper',
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
  template: `<section>
               <div class="container">
                 <div class="head-component">
                   <h1>Close<span>お休み設定</span></h1>
                 </div>
                 <div class="add">
                   <h2>新規追加</h2>
                   <form action="/admin/space/config" method="post" class="ui-component">
                     <table class="close-config date">
                       <tr>
                         <th>日付で設定</th>
                         <td>
                           <div class="pick">
                             <vuejs-datepicker
                               v-model="datePickerStart"
                               name="datePickerStart"
                               :format="this.datePickerFormrt"
                               :disabledDates="disabledDates"
                               :language="language"
                               :monday-first=true
                               :input-class="this.inputClassName"
                               :wrapper-class="this.wrapperClassName"></vuejs-datepicker>
                           </div>
                         </td>
                         <td>〜</td>
                         <td>
                           <div class="pick">
                             <vuejs-datepicker
                               v-model="datePickerEnd"
                               name="datePickerEnd"
                               :format="this.datePickerFormrt"
                               :disabledDates="disabledDates"
                               :language="language"
                               :monday-first=true
                               :input-class="this.inputClassName"
                               :wrapper-class="this.wrapperClassName"></vuejs-datepicker>
                           </div>
                         </td>
                         <td>
                           <button type="submit" class="ui-component">追加</button>
                         </td>
                       </tr>
                     </table>
                   </form>
                   <table class="close-config day">
                     <tr>
                       <th>曜日で設定</th>
                       <td></td>
                       <td>
                         <button type="submit" class="ui-component">追加</button>
                       </td>
                     </tr>
                   </table>
                 </div>
                 <div class="list">
                   <h2>一覧</h2>
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
