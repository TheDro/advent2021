<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, data} from './day17.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    // let data = testData
    let maxTime = 5000
    let yPairs = getYTimePairs(data)
    let xPairs = getXTimePairs(data)

    let matches = new Set()
    for (let i=yPairs.length-1; i >= 0; i--) {
      let yPair = yPairs[i]
      for (let j=0; j<xPairs.length; j++) {
        let xPair = xPairs[j]
        if (yPair.t === xPair.t) {
          matches.add([xPair.vx, yPair.vy].toString())
        }
      }
    }
    console.log({matches})


    function getXTimePairs(ranges) {
      let [minX, maxX] = ranges.x
      let pairs = []
      for (let i=0; i<=maxX; i++) {
        let x = 0
        let vx = i
        for (let t=1; t <= maxTime; t++) {
          if (vx === 0 && x < minX) {
            break
          }
          x = x + vx
          vx = Math.max(vx - 1, 0)
          if (x > maxX) {
            break
          } else if (x >= minX) {
            pairs.push({t, x, vx: i})
          }
        }
      }
      return pairs
    }


    function getYTimePairs(ranges) {
      let [minY,maxY] = ranges.y
      let pairs = []
      for (let i=minY; i<500; i++) {
        let y = 0
        let vy = i
        let highest = y
        for (let t=1; t <= maxTime; t++) {
          y = y + vy
          vy = vy - 1
          highest = Math.max(highest, y)

          if (y < minY) {
            break
          } else if (y <= maxY) {
            pairs.push({t, y, vy: i, highest})
          }
        }
      }
      return pairs
    }

    console.log({yPairs, xPairs})
    expose({data, yPairs, xPairs})

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