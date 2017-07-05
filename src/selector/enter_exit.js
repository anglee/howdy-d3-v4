/*
<body>
  <div class="main"></div>
</body>
 */

/*
main = d3.select('.main')
main.append('p').text('Foo')
// <p>Foo</p>

updates = main.selectAll('p').data(['A', 'B', 'C'])
updates.size()
// 1

updates.text(d => 'Update ' + d)
// <p>Update A</p>

enters = updates.enter()
updates.size()
// 1

enters.size()
// 2

entered = enters.append('p').text(d => 'Enter ' + d)
// <p>Update A</p>
// <p>Enter B</p>
// <p>Enter C</p>

updates.merge(entered).style('color', 'red')
// all <p>'s now becomes red

updates.size()
// 1

updates.text(d => 'Update again ' + d)
// <p>Update again A</p>
// <p>Enter B</p>
// <p>Enter C</p>

enters2 = updates.enter()

enters2.size()
// 2

enters2 === enters
// false

enters2.append('p').text(d => 'Enter2 ' + d)
// <p>Update again A</p>
// <p>Enter B</p>
// <p>Enter C</p>
// <p>Enter2 B</p>
// <p>Enter2 C</p>

updates2 = main.selectAll('p').data(['X', 'Y'])
updates2.size()
// 2

updates2.text(d => 'Update2 ' + d)
// <p>Update2 X</p>
// <p>Update2 Y</p>
// <p>Enter C</p>
// <p>Enter2 B</p>
// <p>Enter2 C</p>

enters3 = updates2.enter()
enters3.size()
// 0

exits = updates2.exit()
exits.size()
// 3

updates2.size()
// 2

exits.remove()
// <p>Update2 X</p>
// <p>Update2 Y</p>

exits.size()
// 3

updates2.size()
// 2

main.selectAll('p').data()
// ["X", "Y"]
*/