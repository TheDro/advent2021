let testData =
`dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`

let testData2 =
  `start-A
start-b
A-c
A-b
b-d
A-end
b-end`

let testData3 =
  `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`

let data =
`zs-WO
zs-QJ
WO-zt
zs-DP
WO-end
gv-zt
iu-SK
HW-zs
iu-WO
gv-WO
gv-start
gv-DP
start-WO
HW-zt
iu-HW
gv-HW
zs-SK
HW-end
zs-end
DP-by
DP-iu
zt-start`

function remap(data) {
  return data.split("\n").map((line) => {
    return line.split('-')
  })
}

data = remap(data)
testData = remap(testData)
testData2 = remap(testData2)
testData3 = remap(testData3)


export {data, testData, testData2, testData3}