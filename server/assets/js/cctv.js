/*global d3*/
(function(d3) {
  'use strict';

  var svg = d3.select('svg');
  const canvasWidth = svg.attr('width');
  const canvasHeight = svg.attr('height');

  // from a date, return a number from 0 to 24 depending on the time, midnight to midnight
  function timeOfDay(date) {
    return (date.getHours()*3600 + date.getMinutes()*60 + date.getSeconds()) / 3600;
  }

  function dateOnly(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  var hoursScale = d3.scale.linear().domain([0, 24]).range([0, canvasHeight-100]);


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
      .range([0, canvasWidth-100]);
  }

  function showWorkHours(plot, timeScale) {
    plot.append('rect')
      .attr('class', 'work-hours')
      .attr('x', 0)
      .attr('y', timeScale(9))
      .attr('width', canvasWidth-100)
      .attr('height', timeScale(17-9));
  }

  function main() {
    d3.json('/media', media => {
      const data = convertTypes(media);
      const scaleDay = dayScaleFromData(data);
      const timeAxis = d3.svg.axis().scale(hoursScale).ticks(24).tickFormat(d => `${d}:00`).orient('left');
      const dayAxis = d3.svg.axis().scale(scaleDay).ticks(12).orient('top');
      const plot = d3.select('svg')
        .append('g')
        .attr('transform', 'translate(54, 30)');
      const displayTimeFormat = d3.time.format('%d %b %Y, %H:%M');

      showWorkHours(plot, hoursScale);
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
              .text(displayTimeFormat(d.date));
        });
      });
  }

  main();

})(d3);
