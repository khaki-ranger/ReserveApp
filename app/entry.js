'use strict';
import $ from 'jquery';

$(window).on('load', function(){
  const overlay = $('.overlay');
  const modal = $('.modal');

  function openModal() {
    overlay.addClass('visible');
    modal.addClass('visible');
  }
  function closeModal() {
    overlay.removeClass('visible');
    modal.removeClass('visible');
  }

  $('.overlay, .close, .btn-close').on('click', function() {
    closeModal();
  });
  $('.overlay .panel').on('click', function(event) {
    event.stopPropagation();
  });
  $('.btn-cancel, .nav-detail').on('click', function() {
    openModal();
    var id = $(this).data('id');
    var href = '/reserve/cancel/' + id;
    $('.cancel .confirm').attr('href', href);
  });

});
