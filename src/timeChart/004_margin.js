const convertDateToMoment = ({start, end}) => ({
  start: moment(start, 'YYYY-MM-DD hh:mm:ss'),
  end: moment(end, 'YYYY-MM-DD hh:mm:ss')
});

const lineItems = [
  [
    { start: '2017-07-01 00:00:00', end: '2017-07-31 23:59:59' },
    { start: '2017-08-01 00:00:00', end: '2017-08-31 23:59:59' }
  ].map(convertDateToMoment),
  [
    { start: '2017-07-01 00:00:00', end: '2017-07-15 23:59:59' },
    { start: '2017-07-16 00:00:00', end: '2017-08-15 23:59:59' },
    { start: '2017-08-16 00:00:00', end: '2017-08-31 23:59:59' }
  ].map(convertDateToMoment)
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


const margin = {
  left: 10,
  right: 10,
  top: 10,
  bottom: 10,
};

const chartWidth = 800;
const chartHeight = 100;

const width = chartWidth - margin.left - margin.right;
const height = chartHeight - margin.top - margin.bottom;

const barHeight = 20;
const svg = d3.select('.chart')
  .append('svg')
  .attr('width', chartWidth)
  .attr('height', chartHeight)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

svg.append('rect')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'lightyellow');

// Define the div for the tooltip
var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const showTooltip = (d) => {
  div.transition()
    .duration(200)
    .style("opacity", .9);
  div.html(`start: ${d.start.format('YYYY-MM-DD')}` + "<br/>"  + `end: ${d.end.format('YYYY-MM-DD')}`)
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
};

const hideTooltip = () => {
  div.transition()
    .duration(500)
    .style("opacity", 0);
};

const getX = d => timeScale(d.start) * width;
const getWidth = d => (timeScale(d.end) - timeScale(d.start)) * width;
const getHeight = () => barHeight;

const bar1 = svg.append('g');
bar1.selectAll('rect')
  .data(lineItems[0])
  .enter()
  .append('rect')
  .attr('x', getX)
  .attr('y', 0)
  .attr('width', getWidth)
  .attr('height', getHeight)
  .style('fill', (d, i) => colors(i))
  .on("mouseover", showTooltip)
  .on("mouseout", hideTooltip);

const bar2 = svg.append('g')
  .attr('transform', `translate(0, ${barHeight + 5})`);
bar2.selectAll('rect')
  .data(lineItems[1])
  .enter()
  .append('rect')
  .attr('x', getX)
  .attr('width', getWidth)
  .attr('height', getHeight)
  .style('fill', (d, i) => colors(i))
  .on("mouseover", showTooltip)
  .on("mouseout", hideTooltip);
