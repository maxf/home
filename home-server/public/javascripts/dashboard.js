/*global $ */
(function($) {
  'use strict';

  var sliderOptions = {
    max: 24,
    min: 0,
    range: true,
    values: [8, 18],
    change: function(event, ui) { console.log(event.target, ui.values); }
  }

  $('.slider').slider(sliderOptions);

  $('#switch-0-on').on('click', function(event) { $.post('api/0/on'); });
  $('#switch-0-off').on('click', function(event) { $.post('api/0/off'); });
  $('#switch-1-on').on('click', function(event) { $.post('api/1/on'); });
  $('#switch-1-off').on('click', function(event) { $.post('api/1/off'); });
  $('#switch-2-on').on('click', function(event) { $.post('api/2/on'); });
  $('#switch-2-off').on('click', function(event) { $.post('api/2/off'); });

})($);
