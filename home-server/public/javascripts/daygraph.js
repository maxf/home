'use strict';
var d3;

var dayGraph = {};

dayGraph.build = function(data) {

  d3.selectAll('svg')
    .selectAll('text')
    .data([1,2,3,4,5])
    .enter()
    .append('text')
    .text('OK');
};
