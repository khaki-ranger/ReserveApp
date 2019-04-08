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

  $('header .icon').on('click', function() {
    $('header .mymenu:not(:animated)').slideToggle('fast');
  });

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
    var dateText = $(this).data('year') + '年' + $(this).data('month') + '月' + $(this).data('day') + '日(' + $(this).data('dayofweek') + ') ' + $(this).data('periodname');
    $('.cancel .confirm').attr('href', href);
    $('.cancel .information .name .body').text($(this).data('name'));
    $('.cancel .information .office .body').text($(this).data('office'));
    $('.cancel .information .space .body').text($(this).data('space'));
    $('.cancel .information .date .body').text(dateText);
  });

});
