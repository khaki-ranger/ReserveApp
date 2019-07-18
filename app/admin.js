'use strict';

var mainComponent = Vue.extend({
  components: {
    vuejsDatepicker
  },
  data: function() {
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
      this.disabledDates.to = selectDate;
      if (selectDate.getTime() > this.datePickerEnd.getTime()) {
        this.datePickerEnd = selectDate;
      }
    },
    changedayofweek: function(e) {
      if(this.dayofweek.length === 0) {
        this.isButtonDisabled = true;
      } else {
        this.isButtonDisabled = false;
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
                               :wrapper-class="this.wrapperClassName"
                               @selected="selected"></vuejs-datepicker>
                           </div>
                         </td>
                         <td>
                           <input type="checkbox" v-model="permanent" id="permanent" name="permanent" class="ui-component">
                           <label for="permanent" class="ui-component checkbox-label single-label">以降ずっと</label>
                         </td>
                         <td class="or">〜</td>
                         <td>
                           <div class="pick">
                             <vuejs-datepicker
                               v-model="datePickerEnd"
                               name="datePickerEnd"
                               :disabled="permanent"
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
                   <form action="/admin/space/config" method="post" class="ui-component">
                     <table class="close-config day">
                       <tr>
                         <th>曜日で設定</th>
                         <td>
                           <div class="checkbox-wrapper">
                             <input type="checkbox" name="dayofweek" id="monday" value="1" v-model="dayofweek" @change="changedayofweek($event)" class="ui-component">
                             <label for="monday" class="ui-component checkbox-label">月</label>
                             <input type="checkbox" name="dayofweek" id="tuesday" value="2" v-model="dayofweek" @change="changedayofweek($event)" class="ui-component">
                             <label for="tuesday" class="ui-component checkbox-label">火</label>
                             <input type="checkbox" name="dayofweek" id="wednesday" value="3" v-model="dayofweek" @change="changedayofweek($event)" class="ui-component">
                             <label for="wednesday" class="ui-component checkbox-label">水</label>
                             <input type="checkbox" name="dayofweek" id="thursday" value="4" v-model="dayofweek" @change="changedayofweek($event)" class="ui-component">
                             <label for="thursday" class="ui-component checkbox-label">木</label>
                             <input type="checkbox" name="dayofweek" id="friday" value="5" v-model="dayofweek" @change="changedayofweek($event)" class="ui-component">
                             <label for="friday" class="ui-component checkbox-label">金</label>
                             <input type="checkbox" name="dayofweek" id="saturday" value="6" v-model="dayofweek" @change="changedayofweek($event)" class="ui-component">
                             <label for="saturday" class="ui-component checkbox-label">土</label>
                             <input type="checkbox" name="dayofweek" id="sunday" value="0" v-model="dayofweek" @change="changedayofweek($event)" class="ui-component">
                             <label for="sunday" class="ui-component checkbox-label">日</label>
                           </div>
                         </td>
                         <td>
                           <button type="submit" v-bind:disabled="isButtonDisabled" class="ui-component">追加</button>
                         </td>
                       </tr>
                     </table>
                   </form>
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
