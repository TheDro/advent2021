let testData =
  ``

let data =
  ``

function remap(data) {
  return data.split("\n")
}

data = remap(data)
testData = remap(testData)


export {data, testData}