var $, d3;

$(function() {
  'use strict';

  d3.json('/media', function(data) {
    var day = d3.select('#content')
      .selectAll('div')
      .data(data)
      .enter()
      .append('div')
    ;

    day.append('h2').text(function(d) { return d.date; });
    day.append('svg')
      .selectAll('g')
      .data(function(d) { return d.events; })
      .enter()
      .append('g')
      .append('text').text(function(d) { return d.filePrefix; })
      ;
  });

});
