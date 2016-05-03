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
        datum.date.substring(4,6) - 1,
        datum.date.substring(6,8),
        datum.date.substring(8,10),
        datum.date.substring(10,12),
        datum.date.substring(12,14)
      );
      return { avi: datum.avi, jpg: datum.jpg, date: date, diff: datum.diff };
    }).sort((a, b) => a.diff - b.diff);
  }

  function dateFromDateString(str) {
    var matches = str.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
    return new Date(matches[1], matches[2]-1, matches[3], matches[4], matches[5], matches[6]);
  }
  function dayOnlyFromDateString(str) {
    var matches = str.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
    return new Date(matches[1], matches[2]-1, matches[3]);
  }
  function timeFromDateString(str) {
    var matches = str.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
    return (parseInt(matches[4]*3600, 10) + parseInt(matches[5]*60, 10) + parseInt(matches[6], 10)) / 3600;
  }

  function dayScaleFromData(data) {
    const maxDate = dateOnly(data[data.length-1].date);
    const minDate = dateOnly(data[0].date);
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
      const diffColours = d3.scale.linear()
        .domain([0, 1])
        .range(["green", "red"]);
      showWorkHours(plot, hoursScale);
      plot.append('g').call(timeAxis);
      plot.append('g').call(dayAxis);

      plot.selectAll('circle.dot')
        .data(data)
        .enter()
        .append('circle')
          .attr('class', 'dot')
          .attr('fill', d => diffColours(d.diff/1000000))
          .attr('cx', d => scaleDay(dateOnly(d.date)))
          .attr('cy', d => hoursScale(timeOfDay(d.date)))
          .attr('r', d => 3+d.diff/1000000)
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
              .text(displayTimeFormat(d.date)+' - '+((d.diff/10000).toFixed(0))+'%');
          });
    });

  }

  main();

})(d3);
