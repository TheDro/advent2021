<script>
  import {watchEffect, reactive} from 'vue'
  import _ from 'lodash'
  import {imagesc, expose} from "../helpers/helper.js";
  import {positions, testPositions} from './day07.data.js'
  import * as math from 'mathjs'

  expose({math})


  export default {
    setup(){
      // let positions = testPositions
      expose({positions})

      let maxPosition = math.max(positions)

      let minCost = Infinity
      let bestPosition = 0
      let costs = []
      for (let i=0; i<=maxPosition; i++) {
        let cost = getCost(positions, i)
        costs.push(cost)
        if (cost < minCost) {
          minCost = cost
          bestPosition = i
        }
      }
      console.log({minCost, bestPosition})

      function getCost(positions, center) {
        let cost = 0
        for (let i=0; i<positions.length; i++) {
          let delta = Math.abs(positions[i]-center)
          cost += delta*(delta+1)/2
        }

        return cost
      }

      expose({costs})
      return {}
    }
  }

</script>

<template>

</template>

<style>

</style>