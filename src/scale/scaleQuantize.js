// map [0, 10) to 1
// map [10, 20) to 2
// map [20, 30) to 3
const quantizeScale = d3.scaleQuantize()
  .domain([0, 30])
  .range([1, 2, 3]);

[0, 1, 2, 3, 4, 5, 9.9, 10, 10.1, 15, 20, 25, 30].forEach(it => {
  console.log(`quantizeScale(${it}) =`, quantizeScale(it));
});
console.log(`quantizeScale.invertExtent(1) =`, quantizeScale.invertExtent(1));
console.log(`quantizeScale.invertExtent(2) =`, quantizeScale.invertExtent(2));
console.log(`quantizeScale.invertExtent(3) =`, quantizeScale.invertExtent(3));

// quantizeScale(0) = 1
// app.js:9 quantizeScale(1) = 1
// app.js:9 quantizeScale(2) = 1
// app.js:9 quantizeScale(3) = 1
// app.js:9 quantizeScale(4) = 1
// app.js:9 quantizeScale(5) = 1
// app.js:9 quantizeScale(9.9) = 1
// app.js:9 quantizeScale(10) = 2
// app.js:9 quantizeScale(10.1) = 2
// app.js:9 quantizeScale(15) = 2
// app.js:9 quantizeScale(20) = 3
// app.js:9 quantizeScale(25) = 3
// app.js:9 quantizeScale(30) = 3
// app.js:11 quantizeScale.invertExtent(1) = (2) [0, 10]
// app.js:12 quantizeScale.invertExtent(2) = (2) [10, 20]
// app.js:13 quantizeScale.invertExtent(3) = (2) [20, 30]
