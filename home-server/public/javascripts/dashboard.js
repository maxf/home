/*global $ */
(function($) {
  'use strict';
  $('#switch-on').on('click', function(event) {
    $.post('api/on', function(data) {
      event.target.disabled = true;
      document.getElementById('switch-off').disabled = false;
    });
  });

  $('#switch-off').on('click', function(event) {
    $.post('api/off', function(data) {
      event.target.disabled = true;
      document.getElementById('switch-on').disabled = false;
    });
  });

})($);
