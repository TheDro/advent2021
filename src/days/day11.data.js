let testData =
  `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`

let data =
  `2344671212
6611742681
5575575573
3167848536
1353827311
4416463266
2624761615
1786561263
3622643215
4143284653`

function remap(data) {
  return data.split("\n").map((line) => {
    return line.split('').map((value) => parseInt(value))
  })
}

data = remap(data)
testData = remap(testData)


export {data, testData}