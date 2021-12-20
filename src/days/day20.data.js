let testData =
  `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`

let data =
  ``

function remap(data) {
  let [decoder, image] = data.split("\n\n")
  decoder = decoder.replaceAll('.','0').replaceAll('#','1')
  decoder = decoder.split('').map((char) => parseInt(char))
  image = image.split('\n').map((line) => {
    line = line.replaceAll('.','0').replaceAll('#','1')
    return line.split('').map((char) => parseInt(char))
  })
  return {decoder, image}
}

// data = remap(data)
testData = remap(testData)

export {data, testData}