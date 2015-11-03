/*global $, d3*/
(function($, d3) {
  'use strict';

  const canvasWidth = 3000; // TODO: read from SVG attributes
  const canvasHeight = 1000;
  const currentYear = 2015;
  const firstTime = new Date(currentYear, 0, 1);
  const lastTime = new Date(currentYear, 11, 31, 23, 59, 59);
  const mSecsYear = lastTime - firstTime;

  // from a date as currentYear-05-30_21.22.29
  // return a number from 0 to 1 depending on the time, midnight to midnight
  function timeMapping(hours, minutes, seconds) {
    return (hours*3600 + minutes*60 + seconds) / 86400;
  }

  function timeOfDay(dateString) {
    var timeMatch = dateString.match(/_(\d{2})\.(\d{2})\.(\d{2})/);
    // console.log(timeMatch);
    // console.log(timeMapping(timeMatch[1], timeMatch[2], timeMatch[3]));
    return timeMapping(parseInt(timeMatch[1], 10),
                       parseInt(timeMatch[2], 10),
                       parseInt(timeMatch[3], 10));
  }

  function scaleDay(dateString) {
    var dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    var date = new Date(dateMatch[1], dateMatch[2] - 1, dateMatch[3]);
    return (date.getTime() + 43200000 - firstTime) / mSecsYear;
  }

  var hoursScale = d3.scale.linear().domain([0, 24]).range([0, canvasHeight]);
  var daysScale = d3.time.scale().domain([new Date(currentYear, 0, 1), new Date(currentYear+1, 0, 1)]).range([0, canvasWidth]);

  $(function() {
    var plot = d3.select('svg')
      .append('g')
      .attr('transform', 'translate(54, 30)')
    ;

    d3.select('#tooltip div.close')
      .on('click', d => {
        d3.select('#tooltip').style('display', 'none');
      })
    ;


    d3.json('/media', media => {
      d3.json('/data/schedule.json', schedule => {
        schedule.map(intervals => {
          switch(intervals.type) {
            case 'hours':
              intervals.ranges.map( range => {
                var startTimeMatch = range[0].match(/^(\d{2}):(\d{2})$/);
                var endTimeMatch = range[1].match(/^(\d{2}):(\d{2})$/);
                var topLeftY = timeMapping(parseInt(startTimeMatch[1]), parseInt(startTimeMatch[2]), 0);
                var bottomLeftY = timeMapping(parseInt(endTimeMatch[1], 10), parseInt(endTimeMatch[2], 10), 0);
                plot
                  .append('rect').attr('class', 'interval')
                  .attr('x', 0).attr('y', topLeftY * canvasHeight)
                  .attr('width', canvasWidth).attr('height', (bottomLeftY - topLeftY) * canvasHeight)
                ;
              });
            break;
            case 'weekdays':
              // loop through all days in the year and highlight if day isn't in interval
              let startMs = new Date(currentYear, 0, 1).getTime();
              let endMs = new Date(currentYear+1, 0, 1).getTime();
              for (let ms=startMs; ms<endMs; ms+=24*3600*1000) {
                let date = new Date(ms);
                let dow = (date.getDay()+1)%7;
                intervals.ranges.map( range => {
                  console.log(range, dow);
                  if (range && dow >= range[0] && dow <= range[1]) {
                    console.log('yes');
                    let x = daysScale(date);
                    let width = daysScale(date.getTime() + 24*3600*1000) - x;
                    plot
                      .append('rect').attr('class', 'interval2')
                      .attr('x', x).attr('y', 0)
                      .attr('width', width).attr('height', canvasHeight)
                    ;
                  }
                });
              }
            break;
          }
        });

        let timeAxis = d3.svg.axis().scale(hoursScale).ticks(24).tickFormat(d => `${d}:00`).orient('left');
        let dayAxis = d3.svg.axis().scale(daysScale).ticks(12).orient('top');

        plot.append('g').call(timeAxis);
        plot.append('g').call(dayAxis);

        plot.selectAll('use.dot')
          .data(media)
          .enter()
            .append('use')
              .attr('class', 'dot')
              .attr('xlink:href', '#dot')
              .attr('x', d => scaleDay(d.filePrefix) * canvasWidth)
              .attr('y', d => timeOfDay(d.filePrefix) * canvasHeight)
              .attr('data:date-time', d => d.filePrefix)
              .on('mouseover', d => {
                d3.select('#tooltip')
                  .style('top', `${d3.event.pageY - 80}px`)
                  .style('left', `${d3.event.pageX + 10}px`)
                  .style('display', 'block')
                  .select('#vidlink')
                    .attr('href', `${d.href}.mp4`)
                ;
                d3.select('#tooltip img')
                  .attr('src', `${d.href}.jpg`)
                ;
                d3.select('#tooltip div.title')
                  .text(d.filePrefix)
                ;
              })
        ;
      });
    });
  });
})($, d3);
