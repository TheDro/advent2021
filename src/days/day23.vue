<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import * as math from 'mathjs'
import Heap from 'heap-js'

expose({math, _, Heap})

let nx = 4

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
    console.log(`${node.cost}:${goodness}\n${code.replaceAll('9',' ').replaceAll('0','.')}`)
  }
}

expose({str, getGoodness, parse, showAll})

export default {
  setup(){
    let completeData = `
...........
##A#B#C#D##
##A#B#C#D##
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
##D#C#B#A##
##D#B#A#C##
##A#D#C#A##
`


    let realData = `
...........
##B#C#A#D##
##D#C#B#A##
##D#B#A#C##
##B#C#D#A##
`
    testData = `
...........
##B#C#B#D##
##D#C#B#A##
##D#B#A#C##
##A#D#C#A##
`

    let data = remap(testData)
    // data = remap(realData)

    let firstNode = {cost: 0, prev: null, code: str(data), goodness: getGoodness(data)}
    let visitedNodes = {}
    let nextNodes = new Heap((a,b) => a.cost - b.cost)
    merge(nextNodes, [firstNode])

    // let newNodes = getNextNodes(firstNode, visitedNodes)
    // visitedNodes[firstNode.code] = firstNode

    let iterations = 1e8

    for (let n=0; n<iterations; n++) {
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
      // if (n%1e6===0) {
      //   prune(nextNodes, visitedNodes)
      // }
      if (n%2000 ===0) {
        console.log(n/1e6+':'+nextNode.cost+':'+nextNode.goodness)
      }
      let newNodes = getNextNodes(nextNode, visitedNodes)
      visitedNodes[nextNode.code] = nextNode
      merge(nextNodes, newNodes)


      // newNodes.forEach((node) => {
      //   visitedNodes[node.code] = node
      // })
      // nextNodes.push(...getNextNodes(nextNode, visitedNodes))
      // visitedNodes[nextNode.code] = nextNode

    }
    if (iterations < 10) {
      console.log('visited:')
      showAll(visitedNodes)
      console.log('next:')
      showAll(nextNodes.toArray())
    }
    // console.log('visited')
    // showAll(visitedNodes)
    // console.log('next')
    // showAll(nextNodes)
    console.log({visitedNodes, nextNodes})



    function getNextNodes(stateObj, visitedCodes) {
      let debug = false
      let state = stateObj.state || parse(stateObj.code)
      let prev = stateObj.code
      if (!prev) {
        debugger
      }
      let cost = stateObj.cost
      let goodness = getGoodness(state)
      let possibleNodes = []
      ;[1,3,5,7,9].forEach((j) => {
        if (state[0][j] === 0) {
          // Leave hole
          for (let i=0; i<=nx; i++) {
            let bottomLeft = state[i][j-1]
            if (isPawn(bottomLeft)) {
              possibleNodes.push({ prev, cost: cost+(i+1)*price(bottomLeft), state: getSwapped(state, [0,j], [i,j-1]) })
              break
            }
          }
          for (let i=0; i<=nx; i++) {
            let bottomRight = state[i][j+1]
            if (isPawn(bottomRight)) {
              possibleNodes.push({ prev, cost: cost+(i+1)*price(bottomRight), state: getSwapped(state, [0,j], [i,j+1]) })
              break
            }
          }
          // Move within corridor
          let left = state[0][j-2]
          if (isPawn(left)) {
            possibleNodes.push({ prev, cost: cost+2*price(left), state: getSwapped(state, [0,j], [0,j-2]) })
          }
          let right = state[0][j+2]
          if (isPawn(right)) {
            possibleNodes.push({ prev, cost: cost+2*price(right), state: getSwapped(state, [0,j], [0,j+2]) })
          }
        }

        // Enter hole
        if (isPawn(state[0][j])) {
          for (let i=nx; i>=1; i--) {
            let bottomLeft = state[i][j-1]
            if (bottomLeft === 0) {
              possibleNodes.push({ prev, cost: cost+(i+1)*price(state[0][j]), state: getSwapped(state, [0,j], [i,j-1]) })
              break
            }
          }
          for (let i=nx; i>=1; i--) {
            let bottomRight = state[i][j+1]
            if (bottomRight === 0) {
              possibleNodes.push({ prev, cost: cost+(i+1)*price(state[0][j]), state: getSwapped(state, [0,j], [i,j+1]) })
              break
            }
          }
        }
      })
      // Corners
      ;[0,9].forEach((j) => {
        if (state[0][j] === 0) {
          let right = state[0][j+1]
          if (isPawn(right)) {
            possibleNodes.push({ prev, cost: cost+1*price(right), state: getSwapped(state, [0,j], [0,j+1]) })
          }
        }
        if (state[0][j+1] === 0) {
          let left = state[0][j]
          if (isPawn(left)) {
            possibleNodes.push({ prev, cost: cost+1*price(left), state: getSwapped(state, [0,j+1], [0,j]) })
          }
        }
      })

      // // Move out of holes
      // ;[2,4,6,8].forEach((iBottom) => {
      //   let bottom = state[1][iBottom]
      //   if (!isPawn(bottom)) return
      //
      //   let lefts =  [0,1,3,5,7,9,10].filter((iTop) => iTop < iBottom).sort((a,b) => b-a)
      //   let rights = [0,1,3,5,7,9,10].filter((iTop) => iTop > iBottom).sort((a,b) => a-b)
      //   for (let iTop of lefts) {
      //     let top = state[0][iTop]
      //     if (top === 0) {
      //       possibleNodes.push({prev, cost: cost+(iBottom-iTop+1)*price(bottom), state: getSwapped(state, [0,iTop], [1, iBottom])})
      //     } else {
      //       break
      //     }
      //   }
      //   for (let iTop of rights) {
      //     let top = state[0][iTop]
      //     if (top === 0) {
      //       possibleNodes.push({prev, cost: cost+(iTop-iBottom+1)*price(bottom), state: getSwapped(state, [0,iTop], [1, iBottom])})
      //     } else {
      //       break
      //     }
      //   }
      // })
      //
      // // Move into holes
      // ;[2,4,6,8].forEach((iBottom) => {
      //   let bottom = state[1][iBottom]
      //   if (isPawn(bottom)) return
      //
      //   let lefts =  [0,1,3,5,7,9,10].filter((iTop) => iTop < iBottom).sort((a,b) => b-a)
      //   let rights = [0,1,3,5,7,9,10].filter((iTop) => iTop > iBottom).sort((a,b) => a-b)
      //   for (let iTop of lefts) {
      //     let top = state[0][iTop]
      //     if (isPawn(top)) {
      //       possibleNodes.push({prev, cost: cost+(iBottom-iTop+1)*price(top), state: getSwapped(state, [0,iTop], [1, iBottom])})
      //       break
      //     }
      //   }
      //   for (let iTop of rights) {
      //     let top = state[0][iTop]
      //     if (isPawn(top)) {
      //       possibleNodes.push({prev, cost: cost+(iTop-iBottom+1)*price(top), state: getSwapped(state, [0,iTop], [1, iBottom])})
      //       break
      //     }
      //   }
      // })


      // Move within holes
      // ;[2,4,6,8].forEach((j) => {
      //   if (state[1][j] === 0) {
      //     let bottom = state[2][j]
      //     if (isPawn(bottom)) {
      //       possibleNodes.push({ prev, cost: cost+1*price(bottom), state: getSwapped(state, [1,j], [2,j]) })
      //     }
      //   }
      //
      //   ;[2,3,4].forEach((i) => {
      //     if (state[i]?.[j] === 0) {
      //       let top = state[i-1]?.[j]
      //       if (isPawn(top)) {
      //         possibleNodes.push({ prev, cost: cost+1*price(top), state: getSwapped(state, [i,j], [i-1,j]) })
      //       }
      //       let bottom = state[i+1]?.[j]
      //       if (isPawn(bottom)) {
      //         possibleNodes.push({ prev, cost: cost+1*price(bottom), state: getSwapped(state, [i,j], [i+1,j]) })
      //       }
      //     }
      //   })
      // })

      return possibleNodes.filter((node) => {
        if (debug) {
          debugger
        }
        node.code = str(node.state)
        node.goodness = getGoodness(node.state)
        delete node.state

        if (visitedCodes[node.code]) {
          return false
        }
        return node.goodness >= goodness
      })

    }







    function prune(nextNodes, visitedNodes) {
      let newNodes = new Heap((a,b) => a.cost - b.cost)

      // let node =
    }


    function merge(existingNodes, newNodes) {
      existingNodes.push(...newNodes)
    }

    function getPath(node, visitedNodes) {
      let path = []
      while (true) {
        try {
          path.unshift(node)
          if (!node.prev) {
            break
          }
          node = visitedNodes[node.prev]
        } catch (e) {
          debugger
        }

      }
      return path
    }


    function popShortest(nextNodes) {
      return nextNodes.pop()
    }


    expose({getNextNodes, data, visitedNodes, nextNodes})


    function price(pawn) {
      return 10**(pawn-1)
    }

    function getSwapped(state, coord1, coord2) {
      try {
        let newState = state.map((row) => [...row])
        // let newState = _.cloneDeep(state)
        // let newState = parse(str(state))
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