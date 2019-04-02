'use strict';
import $ from 'jquery';

$(window).on('load', function(){

  const overlay = $('.overlay');
  const modal = $('.modal');
  $('.date .select').on('click', function() {
    overlay.addClass('visible');
    modal.addClass('visible');
  });
  $('.overlay').on('click', function() {
    overlay.removeClass('visible');
    modal.removeClass('visible');
  });
  $('.overlay .panel').on('click', function(event) {
    event.stopPropagation();
  });

});
