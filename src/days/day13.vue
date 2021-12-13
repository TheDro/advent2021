<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, data} from './day13.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    // let data = testData

    let {points, folds} = data
    for (let i=0; i<folds.length; i++) {
      applyFold(points, folds[i])
      removeDuplicates(points)
      console.log(points.length)
    }


    function applyFold(points, fold) {
      for (let i=0; i<points.length; i++) {
        let point = points[i]
        if (fold[0] === 'x' && point[0] > fold[1]) {
          point[0] = (2*fold[1]-point[0])
        } else if (fold[0] === 'y' && point[1] > fold[1]) {
          point[1] = (2*fold[1]-point[1])
        }
      }
    }

    expose({data, applyFold, removeDuplicates, points, folds})


    function removeDuplicates(points) {
      points = points.sort((pairA, pairB) => {
        return compare(pairA, pairB)
      })

      for (let i=points.length-1; i>=1; i--) {
        if (compare(points[i],points[i-1]) === 0) {
          points.splice(i,1)
        }
      }
    }

    function compare(pairA, pairB) {
      let diff = pairA[0]-pairB[0]
      if (diff === 0) {
        diff = pairA[1]-pairB[1]
      }
      return diff
    }



    return {points}
  }
}

</script>

<template>
  <svg width="1000">
    <g>
      <circle v-for="point of points" :cx="10*point[0]+5" :cy="10*point[1]+5" r="3" fill="rgb(0,0,0)"></circle>
    </g>
  </svg>
</template>

<style>

</style>