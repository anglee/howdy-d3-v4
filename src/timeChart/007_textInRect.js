const convertDateToMoment = ({start, end, budget}) => ({
  start: moment(start, 'YYYY-MM-DD hh:mm:ss'),
  end: moment(end, 'YYYY-MM-DD hh:mm:ss'),
  budget
});

const lineItems = [
  [
    { start: '2017-07-01 00:00:00', end: '2017-07-31 23:59:59', budget: 100 },
    { start: '2017-08-01 00:00:00', end: '2017-08-31 23:59:59', budget: 200 }
  ].map(convertDateToMoment),
  [
    { start: '2017-07-01 00:00:00', end: '2017-07-15 23:59:59', budget: 300 },
    { start: '2017-07-16 00:00:00', end: '2017-08-15 23:59:59', budget: 400 },
    { start: '2017-08-16 00:00:00', end: '2017-08-31 23:59:59', budget: 500 }
  ].map(convertDateToMoment)
];

const colors = d3.scaleOrdinal()
  .range(['red', 'orange', 'brown']);

const margin = {
  left: 70,
  right: 10,
  top: 10,
  bottom: 30,
};

const chartWidth = 800;
const chartHeight = 100;

const width = chartWidth - margin.left - margin.right;
const height = chartHeight - margin.top - margin.bottom;

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

const xScale = d3.scaleTime()
  .domain([
    moment('2017-06-01 00:00:00', 'YYYY-MM-DD hh:mm:ss'),
    moment('2017-12-30 23:59:59', 'YYYY-MM-DD hh:mm:ss')
  ])
  .range([0, width])
  .clamp(true);

const yScale = d3.scaleBand()
  .padding(0.2)
  .domain(['Line Item 1', 'Line Item 2'])
  .range([0, height]);

const bar1 = svg.append('g');
bar1.selectAll('rect')
  .data(lineItems[0])
  .enter()
  .append('rect')
  .attr('x', d => xScale(d.start))
  .attr('y', d => yScale('Line Item 1'))
  .attr('width', d => (xScale(d.end) - xScale(d.start)))
  .attr('height', d => yScale.bandwidth())
  .style('fill', (d, i) => colors(i))
  .on("mouseover", showTooltip)
  .on("mouseout", hideTooltip);
bar1.selectAll('text')
  .data(lineItems[0])
  .enter()
  .append('text')
  .attr('x', d => (xScale(d.end) + xScale(d.start)) / 2)
  .attr('y', d => yScale('Line Item 1') + yScale.bandwidth() / 2)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "central")
  .attr("font-family", "sans-serif")
  .attr("font-size", "12px")
  .text(d => `$${d.budget}`)
  .style('fill', 'black');

const bar2 = svg.append('g');
bar2.selectAll('rect')
  .data(lineItems[1])
  .enter()
  .append('rect')
  .attr('x', d => xScale(d.start))
  .attr('y', d => yScale('Line Item 2'))
  .attr('width', d => (xScale(d.end) - xScale(d.start)))
  .attr('height', d => yScale.bandwidth())
  .style('fill', (d, i) => colors(i))
  .on("mouseover", showTooltip)
  .on("mouseout", hideTooltip);
bar2.selectAll('text')
  .data(lineItems[1])
  .enter()
  .append('text')
  .attr('x', d => (xScale(d.end) + xScale(d.start)) / 2)
  .attr('y', d => yScale('Line Item 2') + yScale.bandwidth() / 2)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "central")
  .attr("font-family", "sans-serif")
  .attr("font-size", "12px")
  .text(d => `$${d.budget}`)
  .style('fill', 'black');


const xAxis = d3.axisBottom(xScale);
svg.append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(xAxis);

const yAxis = d3.axisLeft(yScale);
svg.append('g')
  .attr('transform', `translate(0, 0)`)
  .call(yAxis);