/*global d3*/
(function(d3) {
  'use strict';

  const canvasWidth = 1000; // TODO: read from SVG attributes
  const canvasHeight = 500;
  const currentYear = 2016;

  // from a date, return a number from 0 to 24 depending on the time, midnight to midnight
  function timeOfDay(date) {
    return (date.getHours()*3600 + date.getMinutes()*60 + date.getSeconds()) / 3600;
  }

  function dateOnly(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  var hoursScale = d3.scale.linear().domain([0, 24]).range([0, canvasHeight]);

  var plot = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(54, 30)')
  ;

  d3.select('#tooltip div.close')
    .on('click', d => {
      d3.select('#tooltip').style('display', 'none');
    })
  ;

  function convertTypes(data) {
    return data.map(datum => {
      const date = new Date(
        datum.date.substring(0,4),
        datum.date.substring(5,7) - 1,
        datum.date.substring(8,10),
        datum.date.substring(11,13),
        datum.date.substring(14,16),
        datum.date.substring(17,19)
      );
      return { avi: datum.avi, jpg: datum.jpg, date: date};
    });
  }

  function dayScaleFromData(data) {
    // find min and max dates and create a time scale from it
    const dates = data
      .map(datum => datum.date)
      .sort((a,b) => b - a);
    const maxDate = dates[0];
    const minDate = dateOnly(dates[dates.length-1]);
    return d3.time.scale()
      .domain([minDate, maxDate])
      .range([0, canvasWidth]);
  }

  function main() {
    d3.json('/media', media => {
      const data = convertTypes(media);
      const scaleDay = dayScaleFromData(data);

    //   d3.json('/data/schedule.json', schedule => {
    //     schedule.map(intervals => {
    //       switch(intervals.type) {
    //         case 'hours':
    //           intervals.ranges.map( range => {
    //             var startTimeMatch = range[0].match(/^(\d{2}):(\d{2})$/);
    //             var endTimeMatch = range[1].match(/^(\d{2}):(\d{2})$/);
    //             var topLeftY = timeMapping(parseInt(startTimeMatch[1]), parseInt(startTimeMatch[2]), 0);
    //             var bottomLeftY = timeMapping(parseInt(endTimeMatch[1], 10), parseInt(endTimeMatch[2], 10), 0);
    //             plot
    //               .append('rect').attr('class', 'interval')
    //               .attr('x', 0).attr('y', topLeftY * canvasHeight)
    //               .attr('width', canvasWidth).attr('height', (bottomLeftY - topLeftY) * canvasHeight)
    //             ;
    //           });
    //         break;
    //         case 'weekdays':
    //           // loop through all days in the year and highlight if day isn't in interval
    //           let startMs = new Date(currentYear, 0, 1).getTime();
    //           let endMs = new Date(currentYear+1, 0, 1).getTime();
    //           for (let ms=startMs; ms<endMs; ms+=24*3600*1000) {
    //             let date = new Date(ms);
    //             let dow = (date.getDay()+1)%7;
    //             intervals.ranges.map( range => {
    //               if (range && dow >= range[0] && dow <= range[1]) {
    //                 let x = daysScale(date);
    //                 let width = daysScale(date.getTime() + 24*3600*1000) - x;
    //                 plot
    //                   .append('rect').attr('class', 'interval2')
    //                   .attr('x', x).attr('y', 0)
    //                   .attr('width', width).attr('height', canvasHeight)
    //                 ;
    //               }
    //             });
    //           }
    //         break;
    //       }
    //     });
    //   });

    let timeAxis = d3.svg.axis().scale(hoursScale).ticks(24).tickFormat(d => `${d}:00`).orient('left');
    let dayAxis = d3.svg.axis().scale(scaleDay).ticks(12).orient('top');

    plot.append('g').call(timeAxis);
    plot.append('g').call(dayAxis);

    plot.selectAll('use.dot')
      .data(data)
      .enter()
      .append('use')
        .attr('class', 'dot')
        .attr('xlink:href', '#dot')
        .attr('x', d => scaleDay(dateOnly(d.date)))
        .attr('y', d => hoursScale(timeOfDay(d.date)))
        .attr('data:date-time', d => d.date)
        .on('mouseover', d => {
          d3.select('#tooltip')
            .style('top', `${d3.event.pageY - 80}px`)
            .style('left', `${d3.event.pageX + 10}px`)
            .style('display', 'block')
            .select('#vidlink')
            .attr('href', `/media/${d.avi}`);
          d3.select('#tooltip img')
            .attr('src', `/media/${d.jpg}`);
          d3.select('#tooltip div.title')
            .text(d.date);
      });
    });
  }

  main();

})(d3);
