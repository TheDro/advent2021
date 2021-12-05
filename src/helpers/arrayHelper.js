import _ from 'lodash'

function zeros(x,y) {
  if (y === undefined) {
    return _.fill(new Array(x), 0)
  } else {
    let result = []
    for (let i=0; i<x; i++) {
      result.push(_.fill(new Array(y), 0))
    }
    return result
  }
}

export {zeros}