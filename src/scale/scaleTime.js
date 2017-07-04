const timeScale = d3.scaleTime()
  .domain([
    moment('2017-06-29 11:00:00', 'YYYY-MM-DD hh:mm:ss'),
    moment('2017-06-29 12:00:00', 'YYYY-MM-DD hh:mm:ss')
  ])
  .range([0, 1])
  .clamp(true);

[
  '2017-06-29 11:00:00',
  '2017-06-29 11:30:00',
  '2017-06-29 12:00:00',
].forEach(t => {
  console.log(`timeScale(${t}) =`, timeScale(moment(t, 'YYYY-MM-DD hh:mm:ss')));
});