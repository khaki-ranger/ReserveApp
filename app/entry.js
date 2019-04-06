'use strict';
import $ from 'jquery';

$(window).on('load', function(){
  const overlay = $('.overlay');
  const modal = $('.modal');

  function openModal() {
    overlay.addClass('visible');
    modal.addClass('visible');
  }

  $('.overlay').on('click', function() {
    overlay.removeClass('visible');
    modal.removeClass('visible');
  });
  $('.overlay .panel').on('click', function(event) {
    event.stopPropagation();
  });

  $('.date .select').on('click', function() {
    openModal();
  });

  $('.btn-cancel').on('click', function() {
    openModal();
    var id = $(this).data('id');
    var href = '/reserve/cancel/' + id;
    $('.cancel .confirm').attr('href', href);
  });

});
