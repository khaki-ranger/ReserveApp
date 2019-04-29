'use strict';
import $ from 'jquery';

$(window).on('load', function(){
  $('header .icon').on('click', function() {
    $('header .mymenu:not(:animated)').slideToggle('fast');
  });
});

const confirmationElems = document.getElementsByClassName('confirmation');
const confirmIt = ((e) => {
  if (!confirm('削除して良いですか?')) e.preventDefault();
});
for (let i = 0, l = confirmationElems.length; i < l; i++) {
  confirmationElems[i].addEventListener('click', confirmIt, false);
}
