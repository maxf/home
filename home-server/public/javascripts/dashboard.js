/*global $ */
(function($) {
  'use strict';
  $('#switch-on').on('click', function(event) {
    $.post('api/on');
  });

  $('#switch-off').on('click', function(event) {
    $.post('api/off');
  });

})($);
