'use strict';

var mainComponent = Vue.extend({
  props:['spaces'],
  methods: {
    showModal: function(space) {
      this.$emit('show-modal', space);
    }
  },
  template: `
  `,
});

var modalComponent = Vue.extend({
  props:['space_data', 'modal_visibility'],
  methods: {
    showModal: function(reservation) {
      this.$emit('show-modal', reservation);
    }
  },
  template: `<section class="my-reservation">
               <div class="container">
                 <div class="head-component">
                   <h1>Reservation<span>ご予約一覧</span></h1>
                 </div>
               </div>
               <div class="container">
                 <div class="my-reservation-list">
                   <div class="block">
                     <div class="line date">
                       <div class="head">予定日時</div>
                     </div>
                     <div class="line officename">
                       <div class="head">施設</div>
                     </div>
                     <div class="line spacename">
                       <div class="head">部屋</div>
                     </div>
                     <div class="line guestname">
                       <div class="head">お名前</div>
                     </div>
                     <div class="line action">
                       <div class="head">キャンセル</div>
                     </div>
                   </div>
                   <div class="block" v-for="reservation in reservations" v-bind:key="reservation.reservationId">
                     <div class="line date">
                       <div class="head">予定日時</div>
                       <div class="body">{{reservation.formattedDate}}
                         <span>{{reservation.startTimeString}}-{{reservation.endTimeString}}</span>
                       </div>
                     </div>
                     <div class="line officename">
                       <div class="head">施設</div>
                       <div class="body">{{reservation.officename}}</div>
                     </div>
                     <div class="line spacename">
                       <div class="head">部屋</div>
                       <div class="body">{{reservation.space.spacename}}</div>
                     </div>
                     <div class="line guestname">
                       <div class="head">お名前</div>
                       <div class="body">{{reservation.guestname}}</div>
                     </div>
                     <div class="line action">
                       <div class="head">キャンセル</div>
                       <div class="body">
                         <span v-if="reservation.canceled" key="canceled">キャンセル済み</span>
                         <div class="btn-cancel" v-else key="not-canceled" v-on:click="showModal(reservation)">キャンセル</div>
                       </div>
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
  template: `<div>
               <transition>
                 <div class="overlay" v-show="modal_visibility" v-on:click.self="clearModal"></div>
               </transition>
               <transition>
                 <div class="modal" v-show="modal_visibility">
                   <div class="panel">
                     <div class="wrapper">
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
                           <div class="body">{{period_data.formattedDate}} {{period_data.startTimeString}}-{{period_data.endTimeString}}</div>
                         </div>
                         <div class="name">
                           <div class="head">お名前</div>
                           <div class="body">{{period_data.guestname}}</div>
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
                     <div class="close" v-on:click="clearModal"></div>
                   </div>
                 </div>
               </transition>
             </div>`,
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
  mounted() {
    axios
      .get('/mypage/myReservations')
      .then(response => {
        this.reservations = response.data;
      })
  },
  methods: {
    showModal: function(period) {
      this.modal_visibility = true;
      this.periodData = period;
    },
    clearModal: function() {
      this.modal_visibility = false;
    }
  }
})
