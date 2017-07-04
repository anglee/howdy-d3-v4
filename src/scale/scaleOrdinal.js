const ordinalScale = d3.scaleOrdinal()
  .domain(['A', 'B', 'C'])
  .range(['red', 'green', 'blue']);

console.log(`ordinalScale(A) =`, ordinalScale('A')); // red
console.log(`ordinalScale(B) =`, ordinalScale('B')); // green
console.log(`ordinalScale(C) =`, ordinalScale('C')); // blue
