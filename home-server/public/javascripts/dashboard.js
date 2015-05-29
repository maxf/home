$(function() {
  'use strict';
  $.get('/media',
    function(data) { console.log(data); }
  );
});
