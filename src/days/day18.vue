<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, data as realTests} from './day18.data.js'
import * as math from 'mathjs'

let str = JSON.stringify

expose({math, testData, _, str})

export default {
  setup(){
    let data = []
    let tests = []
    // tests.push([[[[[9,8],1],2],3],4])
    // tests.push([7,[6,[5,[4,[3,2]]]]])
    // tests.push([[6,[5,[4,[3,2]]]],1])
    // tests.push([[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]])
    tests = [
      [[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]],
      [[[5,[2,8]],4],[5,[[9,9],0]]],
      [6,[[[6,2],[5,6]],[[7,6],[4,7]]]],
      [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]],
      [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]],
      [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]],
      [[[[5,4],[7,7]],8],[[8,3],8]],
      [[9,3],[[9,9],[6,[4,9]]]],
      [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]],
      [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]],
      ]




    function doTheOtherThing(tests) {
      let maxValue = 0
      let maxPair = [0,0]
      for (let i=0; i<tests.length; i++) {
        for (let j=0; j<tests.length; j++) {
          // if (j===i) continue
          let value = snailSum(add(_.cloneDeep(tests[i]), _.cloneDeep(tests[j])))
          console.log({value, pair: str([i,j])})
          if (value > maxValue) {
            maxValue = value
            maxPair = [i,j]
          }
        }
      }
      console.log({maxValue, maxPair})
    }

    doTheThing(_.cloneDeep(realTests))

    doTheOtherThing(_.cloneDeep(realTests))

    function doTheThing(tests) {
      let result = tests.reduce((data, newEntry) => {
        return add(data, newEntry)
      },[])
      console.log({result: str(result), sum: snailSum(result)})

    }
    expose({realTests})

    function snailSum(data) {
      if (typeof data === 'number') {
        return data
      }
      return 3*snailSum(data[0]) + 2*snailSum(data[1])
    }

    function add(first, second) {
      if (first.length === 0) return second
      return process([first, second])
    }

    function process(data) {
      // let coords = getCoords(data)
      for (let n=0; n<1000; n++) {
        let before = str(data)
        let change = explode(data) || split(data)
        let after = str(data)
        // if (change) {
        //   console.log(`${before} -> ${after}`)
        // }

        if (!change) break
      }
      return data
    }

    function split(data) {
      let coords = getCoords(data)
      let change = false
      for (let i=0; i<coords.length; i++) {
        let coord = coords[i]
        let value = get(data, coord)
        if (value >= 10) {
          let left = Math.floor(value/2)
          let right = Math.ceil(value/2)
          set(data, coord, [left, right])
          change = true
          break
        }
      }
      return change
    }

    function explode(data) {
      let coords = getCoords(data)
      let change = false
      for (let i = 0; i < coords.length; i++) {
        let coord = coords[i]
        if (coord.length === 5) {
          // explode
          let firstCoord = coords[i]
          let secondCoord = coords[i + 1]
          let leftCoord = coords[i - 1]
          let rightCoord = coords[i + 2]
          if (leftCoord) {
            set(data, leftCoord, get(data, leftCoord) + get(data, firstCoord))
          }
          if (rightCoord) {
            set(data, rightCoord, get(data, rightCoord) + get(data, secondCoord))
          }
          set(data, firstCoord.slice(0, 4), 0)
          change = true
          break
        }
      }
      return change
    }




    expose({getCoords, get, data, set, process, snailSum})

    function set(data, coord, value) {
      let array = coord.slice(0, coord.length-1).reduce((data, c) => {
        return data[c]
      }, data)
      array[coord[coord.length-1]] = value
    }

    function get(data, coord) {
      return coord.reduce((data, c) => {
        return data[c]
      }, data)
    }

    function getCoords(data) {
      let result = []
      for (let i=0; i<data.length; i++) {
        if (typeof data[i] === 'number') {
          result.push([i])
        } else {
          let coords = getCoords(data[i])
          coords.forEach((coord) => {
            result.push([i,...coord])
          })
        }
      }
      return result
    }



    expose({data})

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