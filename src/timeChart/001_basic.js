const lineItemA = [
  { start: '2017-07-01 00:00:00', end: '2017-07-31 23:59:59' },
  { start: '2017-08-01 00:00:00', end: '2017-08-31 23:59:59' }
];
const lineItemB = [
  { start: '2017-07-01 00:00:00', end: '2017-07-15 23:59:59' },
  { start: '2017-07-16 00:00:00', end: '2017-08-15 23:59:59' },
  { start: '2017-08-16 00:00:00', end: '2017-08-31 23:59:59' }
];

const colors = d3.scaleOrdinal()
  .range(['red', 'orange', 'brown']);

const timeScale = d3.scaleTime()
  .domain([
    moment('2017-07-01 00:00:00', 'YYYY-MM-DD hh:mm:ss'),
    moment('2017-08-31 23:59:59', 'YYYY-MM-DD hh:mm:ss')
  ])
  .range([0, 1])
  .clamp(true);

const overallWidth = 800;
const barHeight = 30;
const chart = d3.select('.chart');
const svg = chart.append('svg');
svg.attr('width', overallWidth);

const bar1 = svg.append('g');
bar1.selectAll('rect')
  .data(lineItemA)
  .enter()
  .append('rect')
  .attr('x', (d, i) => {
    console.log(d.start, timeScale(moment(d.start, 'YYYY-MM-DD hh:mm:ss')));
    return timeScale(moment(d.start, 'YYYY-MM-DD hh:mm:ss')) * overallWidth;
  })
  .attr('y', 0)
  .attr('width',
    d => (
      timeScale(moment(d.end, 'YYYY-MM-DD hh:mm:ss')) -
      timeScale(moment(d.start, 'YYYY-MM-DD hh:mm:ss'))
    ) * overallWidth
  )
  .attr('height', barHeight)
  .style('fill', (d, i) => colors(i));

const bar2 = svg.append('g');
bar2.selectAll('rect')
  .data(lineItemB)
  .enter()
  .append('rect')
  .attr('x', (d, i) => {
    console.log(d.start, timeScale(moment(d.start, 'YYYY-MM-DD hh:mm:ss')));
    return timeScale(moment(d.start, 'YYYY-MM-DD hh:mm:ss')) * overallWidth;
  })
  .attr('y', barHeight + 5)
  .attr('width',
    d => (
      timeScale(moment(d.end, 'YYYY-MM-DD hh:mm:ss')) -
      timeScale(moment(d.start, 'YYYY-MM-DD hh:mm:ss'))
    ) * overallWidth
  )
  .attr('height', barHeight)
  .style('fill', (d, i) => colors(i));
