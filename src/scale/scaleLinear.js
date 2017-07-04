const linearScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, 1])
  .clamp(true);

console.log('linearScale, with clamping');
[0, 50, 100, -10, 103].forEach(it => {
  console.log(`linearScale(${it}) =`, linearScale(it));
});

console.log('linearScale.invert');
[0, 0.5, 1].forEach(it => {
  console.log(`linearScale.invert(${it}) =`, linearScale.invert(it));
});