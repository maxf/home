/*global $, d3*/
(function($, d3) {
  'use strict';

  // from a date as 2015-05-30_21.22.29
  // return a number from 0 to 1 depending on the time, midnight to midnight
  function timeOfDay(dateString) {
    var time = dateString.match(/_(\d{2})\.(\d{2})\.(\d{2})/);
    return (time[1] * 3600 + time[2] * 60 + parseInt(time[3], 10)) / 86400;
  }

  function scaleDay(dateString) {
    var date = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return ((parseInt(date[2], 10)-1)*31 + parseInt(date[3])) / 372; // FIXME
  }

  var hoursScale = d3.scale.linear().domain([0, 24]).range([0, 1000]);
  var daysScale = d3.scale.linear().domain([0, 365]).range([0, 1000]);

  $(function() {
    var plot = d3.select('svg')
      .append('g')
      .attr('transform', 'translate(30, 30)')
    ;
    var timeAxis = d3.svg.axis().scale(hoursScale).ticks(24).orient('left');
    var dayAxis = d3.svg.axis().scale(daysScale).ticks(12).orient('bottom');

    d3.json('/media', data => {

      plot.append('g').call(timeAxis);
      plot.append('g').call(dayAxis);

      plot.selectAll('use.dot')
        .data(data)
        .enter()
          .append('use')
            .attr('class', 'dot')
            .attr('xlink:href', '#dot')
            .attr('x', d => scaleDay(d.filePrefix) * 1000 )
            .attr('y', d => timeOfDay(d.filePrefix) * 1000 )
            .attr('data:date-time', d => d.filePrefix)
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
