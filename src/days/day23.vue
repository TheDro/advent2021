<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import * as math from 'mathjs'

expose({math, _})

let nx = 2

function str(state) {
  return state.map((row) => {
    return row.join('')
  }).join('\n')
}

function parse(code) {
  return code.split('\n').map((line) => {
    return line.split('').map(a => parseInt(a))
  })
}

function remap(data) {
  let theMap = {'.': 0, '#': 9, 'A': 1, 'B': 2, 'C': 3, 'D': 4}
  return data.trim().split('\n').map((line) => {
    return line.split('').map((spot) => {
      return theMap[spot]
    })
  })
}

function getGoodness(state) {
  let good = 0
  ;[2,4,6,8].forEach((j) => {
    let expectedValue = j/2
    let bad = 1
    for (let i=nx; i>=1; i--) {
      if (state[i][j] === 0) {
        continue
      }
      if (state[i][j] !== expectedValue) {
        bad = -1
      }
      good += bad*i
    }
  })

  return good
}

function showAll(nodes) {

  for (let index in nodes) {
    let node = nodes[index]
    let goodness = node.goodness || getGoodness(node.state)
    let code = node.code || str(node.state)
    console.log(`${node.cost}:${goodness}\n${code}`)
  }
}

expose({str, getGoodness, parse, showAll})

export default {
  setup(){
    let completeData = `
...........
##A#B#C#D##
##A#B#C#D##
`
    let completeState = remap(completeData)
    let completeGoodness = getGoodness(completeState)
    console.log({completeGoodness, completeData, completeState})
    expose({completeData, completeGoodness})

    let testData = `
...........
##B#C#B#D##
##A#D#C#A##
`

//     testData = `
// ...........
// ##B#A#C#D##
// ##A#B#C#D##
// `
//     testData = `
// ...........
// ##D#B#C#D##
// ##A#B#C#A##
// `
    let realData = `
...........
##B#C#A#D##
##B#C#D#A##
`
    let data = remap(testData)
    data = remap(realData)

    let firstNode = {cost: 0, prev: null, code: str(data), state: data, goodness: getGoodness(data)}
    let visitedNodes = {}
    let nextNodes = getNextNodes(firstNode, visitedNodes)
    visitedNodes[firstNode.code] = firstNode
    for (let n=0; n<300000; n++) {
      let nextNode = popShortest(nextNodes)
      if (nextNode === undefined) {
        debugger
      }
      if (visitedNodes[nextNode.code]) {
        continue
      }

      if (nextNode.goodness === completeGoodness) {
        let path = getPath(nextNode, visitedNodes)
        expose({finalNode: nextNode, path})
        showAll(path)
        console.log(`DONE AFTER ${n}`)
        visitedNodes[nextNode.code] = nextNode
        break
      }
      if (n%100 ===0) {
        console.log(nextNode.cost)
      }
      nextNodes.push(...getNextNodes(nextNode, visitedNodes))
      visitedNodes[nextNode.code] = nextNode

    }
    // console.log('visited')
    // showAll(visitedNodes)
    // console.log('next')
    // showAll(nextNodes)
    console.log({visitedNodes, nextNodes})


    function getPath(node, visitedNodes) {
      let path = []
      while (true) {
        path.unshift(node)
        if (!node.prev) {
          break
        }
        node = visitedNodes[node.prev]
      }
      return path
    }


    function popShortest(nextNodes) {
      let lowestValue = Infinity
      let lowestIndex = -1
      for (let i in nextNodes) {
        if (nextNodes[i].cost < lowestValue) {
          lowestValue = nextNodes[i].cost
          lowestIndex = i
        }
      }
      return nextNodes.splice(lowestIndex,1)[0]
    }


    expose({getNextNodes, data, visitedNodes, nextNodes})



    function getNextNodes(stateObj, visitedCodes) {
      let debug = false
      let state = stateObj.state || parse(stateObj.code)
      let prev = stateObj.code
      let cost = stateObj.cost
      let goodness = getGoodness(state)
      let possibleNodes = []
      ;[1,3,5,7,9].forEach((i) => {
        if (state[0][i] === 0) {
          let bottomLeft = state[1][i-1]
          if (isPawn(bottomLeft)) {
            possibleNodes.push({ prev, cost: cost+2*price(bottomLeft), state: getSwapped(state, [0,i], [1,i-1]) })
          }
          let bottomRight = state[1][i+1]
          if (isPawn(bottomRight)) {
            possibleNodes.push({ prev, cost: cost+2*price(bottomRight), state: getSwapped(state, [0,i], [1,i+1]) })
          }
          let left = state[0][i-2]
          if (isPawn(left)) {
            possibleNodes.push({ prev, cost: cost+2*price(left), state: getSwapped(state, [0,i], [0,i-2]) })
          }
          let right = state[0][i+2]
          if (isPawn(right)) {
            possibleNodes.push({ prev, cost: cost+2*price(right), state: getSwapped(state, [0,i], [0,i+2]) })
          }
        }
      })
      // if (state[0][0] === 0) {
      //   let right = state[0][1]
      //   if (isPawn(right)) {
      //     possibleNodes.push({ prev, cost: cost+1*price(right), state: getSwapped(state, [0,0], [0,1]) })
      //   }
      // }
      // if (state[0][10] === 0) {
      //   let left = state[0][9]
      //   if (isPawn(left)) {
      //     possibleNodes.push({ prev, cost: cost+1*price(left), state: getSwapped(state, [0,10], [0,9]) })
      //   }
      // }
      ;[2,4,6,8].forEach((i) => {
        if (state[1][i] === 0) {
          let topLeft = state[0][i-1]
          if (isPawn(topLeft)) {
            // debugger
            // debug = true
            possibleNodes.push({ prev, cost: cost+2*price(topLeft), state: getSwapped(state,[1,i], [0,i-1]) })
          }
          let topRight = state[0][i+1]
          if (isPawn(topRight)) {
            possibleNodes.push({ prev, cost: cost+2*price(topRight), state: getSwapped(state, [1,i], [0,i+1]) })
          }
          let bottom = state[2][i]
          if (isPawn(bottom)) {
            possibleNodes.push({ prev, cost: cost+1*price(bottom), state: getSwapped(state, [1,i], [2,i]) })
          }
        }
        if (state[2][i] === 0) {
          let top = state[1][i]
          if (isPawn(top)) {
            possibleNodes.push({ prev, cost: cost+1*price(top), state: getSwapped(state, [2,i], [1,i]) })
          }
        }
      })
      return possibleNodes.filter((node) => {
        if (debug) {
          debugger
        }
        node.code = str(node.state)
        node.goodness = getGoodness(node.state)

        if (visitedCodes[node.code]) {
          return false
        }
        return node.goodness >= goodness
        // return true
      })

    }

    function price(pawn) {
      return 10**(pawn-1)
    }

    function getSwapped(state, coord1, coord2) {
      try {
        let newState = _.cloneDeep(state)
        let value1 = newState[coord1[0]][coord1[1]]
        newState[coord1[0]][coord1[1]] = newState[coord2[0]][coord2[1]]
        newState[coord2[0]][coord2[1]] = value1
        return newState

      } catch (e) {
        debugger
      }
    }

    function isPawn(value) {
      return value > 0 && value < 5
    }



    expose({data, str, parse, showAll})

    return {}
  }
}

</script>

<template>
  <!--  <div v-for="line of basins">-->
  <!--    <code>{{line}}</code>-->
  <!--  </div>-->
</template>

<style>

</style>