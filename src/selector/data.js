/*
  <div class="chart">
    <div>Alice</div>
    <div>David</div>
    <div>Zach</div>
  </div>
 */
const scores = [
  { name: 'Alice', score: 96 },
  { name: 'Billy', score: 83 },
  { name: 'Cindy', score: 91 },
  { name: 'David', score: 96 },
  { name: 'Emily', score: 88 }
];

// d3.data
// https://github.com/d3/d3-selection/blob/master/README.md#selection_data
const updates = d3.select('.chart')
  .selectAll('div')
  .data(scores, function (d) { console.log(d); return d ? d.name : this.innerHTML; });

console.log('updates.size()', updates.size()); // 2
updates.style('color', 'red'); // Alice and David are red

const enters = updates.enter();
console.log('enters.size()', enters.size()); // 3

const entered = enters.append('div')
  .text((d) => d.name)
  .style('color', 'orange'); // Billy, Cindy, Emily got added to the list

console.log('updates.size()', updates.size()); // 2
updates.style('color', 'green'); // Alice and David are green

const exits = updates.exit();
console.log('exits.size()', exits.size()); // 1
exits.style('color', 'magenta'); // Zach is magenta


exits.remove(); // Zach is removed from the list