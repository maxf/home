(function($, d3) {

  // from a date as 2015-05-30_21.22.29
  // return a number from 0 to 1 depending on the time, midnight to midnight
  function timeOfDay(dateString) {
    var time = dateString.match(/_(\d{2})\.(\d{2})\.(\d{2})/);
    return (time[1] * 3600 + time[2] * 60 + parseInt(time[3],10)) / 86400;
  }


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
      day.append('svg').attr('width', 1000).attr('height', 300)
        .selectAll('g')
        .data(function(d) { return d.events; })
        .enter()
        .append('a')
          .attr('xlink:href', function(d) { return d.href + '.jpg'; })
          .append('image')
            .attr('xlink:href', function(d) { return d.href + '.jpg'; })
            .attr('x', function(d) {
              return timeOfDay(d.filePrefix) * 1000;
            })
            .attr('y', 0)
            .attr('width', 50).attr('height', 50)
      ;
    });
  });
})($, d3);
