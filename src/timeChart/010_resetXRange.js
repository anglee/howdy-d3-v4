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
  bottom: 35,
};

const chartWidth = 800;
const chartHeight = 120;

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
  div
    .html(
      `start: ${d.start.format('YYYY-MM-DD')}<br/>`
      + `end: ${d.end.format('YYYY-MM-DD')}<br/>`
      + `budget: $${d.budget}`
    )
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
};

const hideTooltip = () => {
  div.transition()
    .duration(500)
    .style("opacity", 0);
};

const getDataRange = (data) => {
  const flattened = _.flatten(data);
  return {
    start: _(flattened).map('start').minBy(m => m.unix()),
    end: _(flattened).map('end').maxBy(m => m.unix()),
  };
};

const dataRange = getDataRange(lineItems);
const paddRange = ({start, end}) => {
  const duration = moment.duration(moment(end).diff(moment(start))).asMilliseconds();
  return {
    start: moment(start).subtract(duration * 0.05, 'ms'),
    end: moment(end).add(duration * 0.05, 'ms')
  };
};

const xRange = (() => {
  const paddedDataRange = paddRange(dataRange);
  return {
    start: paddedDataRange.start,
    end: paddedDataRange.end
  };
})();

const resetXRange = () => {
  const paddedDataRange = paddRange(dataRange);
  xRange.start = paddedDataRange.start;
  xRange.end = paddedDataRange.end;
  xScale.domain([
    xRange.start,
    xRange.end,
  ]);
  renderAll();
};

const xScale = d3.scaleTime()
  .domain([xRange.start, xRange.end])
  .range([0, width])
  .clamp(true);

const yScale = d3.scaleBand()
  .padding(0.2)
  .domain(['Line Item 1', 'Line Item 2'])
  .range([0, height]);

const bar1 = svg.append('g');
const bar1Rects = bar1.selectAll('rect')
  .data(lineItems[0])
  .enter()
  .append('rect');

const renderBar1Rects = () => {
  bar1Rects
    .attr('x', d => xScale(d.start))
    .attr('y', d => yScale('Line Item 1'))
    .attr('width', d => (xScale(d.end) - xScale(d.start)))
    .attr('height', d => yScale.bandwidth())
    .style('fill', (d, i) => colors(i));
};

const bar1Texts = bar1.selectAll('text')
  .data(lineItems[0])
  .enter()
  .append('text');
const renderBar1Texts = () => {
  bar1Texts
    .attr('x', d => (xScale(d.end) + xScale(d.start)) / 2)
    .attr('y', d => yScale('Line Item 1') + yScale.bandwidth() / 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .text(d => `$${d.budget}`)
    .style('fill', 'black')
    .attr('opacity', function (d) {
      const isVisible = this.getBBox().width < (xScale(d.end) - xScale(d.start));
      return isVisible ? 1: 0;
    });
};


const bar2 = svg.append('g');
const bar2Rects = bar2.selectAll('rect')
  .data(lineItems[1])
  .enter()
  .append('rect');

const renderBar2Rects = () => {
  bar2Rects
    .attr('x', d => xScale(d.start))
    .attr('y', d => yScale('Line Item 2'))
    .attr('width', d => (xScale(d.end) - xScale(d.start)))
    .attr('height', d => yScale.bandwidth())
    .style('fill', (d, i) => colors(i));
};

const bar2Texts = bar2.selectAll('text')
  .data(lineItems[1])
  .enter()
  .append('text');
const renderBar2Texts = () => {
  bar2Texts
    .attr('x', d => (xScale(d.end) + xScale(d.start)) / 2)
    .attr('y', d => yScale('Line Item 2') + yScale.bandwidth() / 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .text(d => `$${d.budget}`)
    .style('fill', 'black')
    .attr('opacity', function (d) {
      const isVisible = this.getBBox().width < (xScale(d.end) - xScale(d.start));
      return isVisible ? 1: 0;
    });
};

const now = moment(new Date());

const verticalLine = svg.append('line');
const renderVerticalLine = () => {
  verticalLine
    .attr('x1', xScale(now))
    .attr('y1', 0)
    .attr('x2', xScale(now))
    .attr('y2', height + 15)
    .attr('stroke', 'brown')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '5,3')
    .attr('opacity', function () {
      const isVisible = xScale(now) > 0;
      return isVisible ? 1: 0;
    });
};

const labelToday = svg.append('text');
const renderLabelToday = () => {
  labelToday
    .attr('x', xScale(now))
    .attr('y', height + 25)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .text("Today")
    .style('fill', 'brown')
    .attr('opacity', function () {
      const isVisible = xScale(now) > 0;
      return isVisible ? 1: 0;
    });
};

const xAxisElement = svg.append('g')
  .attr('transform', `translate(0, ${height})`);
const renderXAxisElement = () => {
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  xAxisElement.call(xAxis);
};

const yAxis = d3.axisLeft(yScale).tickSize(0);
svg.append('g')
  .attr('transform', `translate(0, 0)`)
  .call(yAxis);

const renderAll = () => {
  renderBar1Rects();
  renderBar1Texts();
  renderBar2Rects();
  renderBar2Texts();
  renderVerticalLine();
  renderLabelToday();
  renderXAxisElement();
};

let dragStartX = null;
function onDragStart() {
  dragStartX = d3.event.x;
}
function onDrag() {
  const rangeXScale = d3.scaleTime()
    .domain([xRange.start, xRange.end])
    .range([0, width]);
  const offsetX = d3.event.x - dragStartX;
  const duration = moment.duration(moment(xRange.start).diff(moment(rangeXScale.invert(offsetX))));
  xScale.domain([
    moment(xRange.start).add(duration),
    moment(xRange.end).add(duration),
  ]);
  renderAll();
}
function onDragEnd() {
  const rangeXScale = d3.scaleTime()
    .domain([xRange.start, xRange.end])
    .range([0, width]);
  const offsetX = d3.event.x - dragStartX;
  const duration = moment.duration(moment(xRange.start).diff(moment(rangeXScale.invert(offsetX))));
  xRange.start = moment(xRange.start).add(duration);
  xRange.end = moment(xRange.end).add(duration);
  xScale.domain([
    xRange.start,
    xRange.end,
  ]);
  renderAll();
}
svg.call(
  d3.drag()
    .on('start', onDragStart)
    .on('drag', onDrag)
    .on('end', onDragEnd)
);
d3.select(window).on('keydown', () => {
  if(d3.event.keyCode === 'R'.charCodeAt(0)) { // reset by key press 'r'
    resetXRange();
  }
});

renderAll();