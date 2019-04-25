'use strict';
import $ from 'jquery';

$(window).on('load', function(){
  $('header .icon').on('click', function() {
    $('header .mymenu:not(:animated)').slideToggle('fast');
  });
});
