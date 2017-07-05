const convertDateToMoment = ({start, end, budget}) => ({
  start: moment(start, 'YYYY-MM-DD HH:mm:ss'),
  end: moment(end, 'YYYY-MM-DD HH:mm:ss'),
  budget
});

const loadInsertionOrder = (id) => new Promise(function (resolve) {
  d3.json(`data/insertionOrder${id}.json`, (res) => {
    resolve(res['insertion-order']);
  });
});
const loadLineItem = (id) => new Promise(function (resolve) {
  d3.json(`data/lineItem${id}.json`, (res) => {
    resolve(res['line-item']);
  });
});

(async () => {
  const insertionOrder = await loadInsertionOrder(442427);
  const ioNamesMap = new Map();
  ioNamesMap.set(insertionOrder.id, insertionOrder.name);
  console.log(insertionOrder);

  const lineItems = await Promise.all(_.map(insertionOrder.line_items, ({id}) => loadLineItem(id)));

  // const lineItem = lineItems[0];
  // console.log(lineItem);

  // const insertionOrders = [insertionOrder];
  // console.log(insertionOrders);

  const billingPeriods = _.map(insertionOrder.budget_intervals, interval => _.assignIn({}, interval, {
      start_date: moment(interval.start_date, 'YYYY-MM-DD HH:mm:ss'),
      end_date: _.isNull(interval.end_date) ? null : moment(interval.end_date, 'YYYY-MM-DD HH:mm:ss')
    }));
  console.log(billingPeriods);

  const flights = _.map(lineItems, lineItem => lineItem['budget_intervals']
    .map(interval => _.assignIn({}, interval, {
      start_date: moment(interval.start_date, 'YYYY-MM-DD HH:mm:ss'),
      end_date: _.isNull(interval.end_date) ? null : moment(interval.end_date, 'YYYY-MM-DD HH:mm:ss')
    }))
  );
  console.log(flights);

  const dataRange = (() => {
    const flattened = [...billingPeriods, ..._.flatten(flights)];
    return {
      start: _(flattened).map('start_date').minBy(m => m.unix()),
      end: _.maxBy([
        ..._(flattened).map('start_date').reject(_.isNull).value(),
        ..._(flattened).map('end_date').reject(_.isNull).value(),
      ], m => m.unix()),
    };
  })();
  console.log(dataRange);

  const colors = d3.scaleOrdinal(d3.schemePastel2)
    .domain([insertionOrder.id]);

  const margin = {
    left: 100,
    right: 10,
    top: 10,
    bottom: 35,
  };

  const chartWidth = 1000;
  const chartHeight = 150;

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
      .html(`<pre>${JSON.stringify(_.assignIn({}, d, {
        start_date: d.start_date.format('YYYY-MM-DD HH:mm:ss'),
        end_date: d.end_date.format('YYYY-MM-DD HH:mm:ss')
      }), null, 2)}</pre>`)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px")
      .style("height", 500)
      .style("width", 500)
      .style("text-align", 'left');
  };

  const hideTooltip = () => {
    div.transition()
      .duration(500)
      .style("opacity", 0);
  };

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
    .domain([`${insertionOrder.name}`, ...lineItems.map(lineItem => `${lineItem.name}`)])
    .range([0, height]);

  const barBillingPeriods = svg.append('g');
  const barBillingPeriodsRects = barBillingPeriods.selectAll('rect')
    .data(billingPeriods)
    .enter()
    .append('rect')
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  const renderBillingPeriodsRects = () => {
    barBillingPeriodsRects
      .attr('x', d => xScale(d.start_date))
      .attr('y', d => yScale(`${insertionOrder.name}`))
      .attr('width', d => {
        return !_.isNull(d.end_date)
          ? (xScale(d.end_date) - xScale(d.start_date))
          : width - xScale(d.start_date);
      })
      .attr('height', d => yScale.bandwidth())
      .style('fill', d => colors(d.object_id))
      .style('stroke', 'teal')
    ;
  };

  const barBillingPeriodsTexts = barBillingPeriods.selectAll('text')
    .data(billingPeriods)
    .enter()
    .append('text');
  const renderBarBillingPeriodsTexts = () => {
    barBillingPeriodsTexts
      .attr('x', d => {
        return !_.isNull(d.end_date)
          ? (xScale(d.end_date) + xScale(d.start_date)) / 2
          : (width + xScale(d.start_date)) / 2
      })
      .attr('y', d => yScale(`${insertionOrder.name}`) + yScale.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .text(d => `${ioNamesMap.get(d.object_id)} ($${d.lifetime_budget})`)
      // .text(d => `(IO:${d.object_id}) $${d.lifetime_budget}`)
      .style('fill', 'black')
      .attr('opacity', function (d) {
        const barWidth = !_.isNull(d.end_date)
          ? xScale(d.end_date) - xScale(d.start_date)
          : width - xScale(d.start_date);
        const isVisible = this.getBBox().width < barWidth;
        return isVisible ? 1: 0;
      });
  };

  const {
    barFlightsArray,
    barFlightsRectsArray,
    renderFlightsRectsArray,
    barFlightsTextsArray,
    renderBarFlightsTextsArray,
  } = (() => {
    const barFlightsArray = [];
    const barFlightsRectsArray = [];
    const renderFlightsRectsArray = [];
    const barFlightsTextsArray = [];
    const renderBarFlightsTextsArray = [];

    lineItems.forEach((lineItem, i) => {
      const barFlights = svg.append('g');
      barFlightsArray.push(barFlights);

      const barFlightsRects = barFlights.selectAll('rect')
        .data(flights[i])
        .enter()
        .append('rect')
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);
      barFlightsRectsArray.push(barFlightsRects);

      const renderFlightsRects = () => {
        barFlightsRects
          .attr('x', d => xScale(d.start_date))
          .attr('y', d => yScale(`${lineItem.name}`))
          .attr('width', d => (xScale(d.end_date) - xScale(d.start_date)))
          .attr('height', d => yScale.bandwidth())
          .style('fill', 'white')
          .style('stroke', 'orange')
      };
      renderFlightsRectsArray.push(renderFlightsRects);

      const barFlightsTexts = barFlights.selectAll('text')
        .data(flights[i])
        .enter()
        .append('text');
      barFlightsTextsArray.push(barFlightsTexts);

      const renderBarFlightsTexts = () => {
        barFlightsTexts
          .attr('x', d => (xScale(d.end_date) + xScale(d.start_date)) / 2)
          .attr('y', d => yScale(`${lineItem.name}`) + yScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "central")
          .attr("font-family", "sans-serif")
          .attr("font-size", "12px")
          .text(d => `$${d.lifetime_budget}`)
          .style('fill', 'black')
          .attr('opacity', function (d) {
            const isVisible = this.getBBox().width < (xScale(d.end_date) - xScale(d.start_date));
            return isVisible ? 1: 0;
          });
      };
      renderBarFlightsTextsArray.push(renderBarFlightsTexts);
    });

    return {
      barFlightsArray,
      barFlightsRectsArray,
      renderFlightsRectsArray,
      barFlightsTextsArray,
      renderBarFlightsTextsArray,
    };
  })();

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
    .text("now")
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
  renderBillingPeriodsRects();
  renderBarBillingPeriodsTexts();
  renderFlightsRectsArray.forEach(renderFlightsRects => { renderFlightsRects(); });
  renderBarFlightsTextsArray.forEach(renderBarFlightsTexts => { renderBarFlightsTexts(); });
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

const onZoom = function () {
  // console.log(d3.select);
  // console.log('zoom, d3.event.target', d3.event.target);
  // console.log('zoom, d3.event.type', d3.event.type);
  // console.log('zoom, d3.event.scale', d3.event.transform);
  // console.log('zoom, d3.event.sourceEvent', d3.event.sourceEvent);
  // const [x, y] = d3.mouse(this);
  // console.log('x', x);
  // console.log('y', y);

  const [x] = d3.mouse(this);
  const momentX = xScale.invert(x);
  // console.log(momentX);
  const duration = moment.duration(moment(dataRange.end).diff(moment(dataRange.start))).asMilliseconds();
  const zoomFactor = d3.zoomTransform(this).k;
  // console.log('zoomFactor', zoomFactor);
  const scaledDuration = duration * 1.1 * zoomFactor;
  xRange.start = moment(momentX).subtract(scaledDuration * (x / width), 'ms');
  xRange.end = moment(momentX).add(scaledDuration * (width - x) / width, 'ms');
  xScale.domain([
    xRange.start,
    xRange.end,
  ]);
  renderAll();
};



svg.call(
  d3.zoom()
    .on('zoom', onZoom)
);
d3.select(window).on('keydown', () => {
  if(d3.event.keyCode === 'R'.charCodeAt(0)) { // reset by key press 'r'
    resetXRange();
  }
});

d3.select(window).on('resize', () => {

});

renderAll();

})();