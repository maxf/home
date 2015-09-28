/*global $, d3*/
(function($, d3) {
  'use strict';

  // from a date as 2015-05-30_21.22.29
  // return a number from 0 to 1 depending on the time, midnight to midnight
  function timeOfDay(dateString) {
    var time = dateString.match(/_(\d{2})\.(\d{2})\.(\d{2})/);
    return (time[1] * 3600 + time[2] * 60 + parseInt(time[3], 10)) / 86400;
  }

  var hoursScale = d3.scale.linear().domain([0, 24]).range([0, 1000]);

  $(function() {

    d3.json('/media', data => {
      var svg, timeAxis;
      var day = d3.select('#content')
        .selectAll('div')
        .data(data)
        .enter()
        .append('div')
      ;

      day.append('h2').text( d => d.date );
      svg = day.append('svg').attr('width', 1000).attr('height', 50);
      svg
        .append('defs')
          .append('symbol')
            .attr('id', 'dot')
            .append('circle')
              .attr('cx', 5).attr('cy', 5).attr('r', 5)
              .style('stroke', 'none')
              .style('fill', 'black')
      ;

      timeAxis = d3.svg.axis().scale(hoursScale).ticks(24);

      svg.append('g')
        .attr('transform', 'translate(0, 28)')
        .call(timeAxis);

      svg.selectAll('a')
        .data( d => d.events )
        .enter()
        .append('a')
          .attr('xlink:href', d => `${d.href}.mp4` )
          .append('use')
            .attr('xlink:href', '#dot')
            .attr('x', function(d) {
              return timeOfDay(d.filePrefix) * 1000;
            })
            .attr('y', 10)
            .on('mouseover', d => {
              d3.select('#tooltip')
                .style('top', `${d3.event.pageY - 80}px`)
                .style('left', `${d3.event.pageX + 10}px`)
                .style('display', 'block');
              d3.select('#tooltip img')
                .attr('src', `${d.href}.jpg`)
              ;
            })
            .on('mouseout', () => {
              d3.select('#tooltip').style('display', 'none');
            })
      ;
    });
  });
})($, d3);
