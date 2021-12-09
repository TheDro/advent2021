<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, data} from './day09.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    // let data = testData
    let lowestGrid = math.zeros(data.length, data[0].length).toArray()
    let lowestValues = []

    for (let i=0; i<data.length; i++) {
      for (let j=0; j<data[i].length; j++) {
        if (i-1 < 0 || data[i-1][j] > data[i][j]) {
          lowestGrid[i][j]--
        }
        if (i+1 >= data.length || data[i+1][j] > data[i][j]) {
          lowestGrid[i][j]--
        }
        if (j-1 < 0 || data[i][j-1] > data[i][j]) {
          lowestGrid[i][j]--
        }
        if (j+1 >= data[i].length || data[i][j+1] > data[i][j]) {
          lowestGrid[i][j]--
        }
        if (lowestGrid[i][j] === -4) {
          lowestValues.push(data[i][j])
        }
      }
    }
    let result1 = math.sum(lowestValues) + lowestValues.length
    console.log({result1})

    let counter = 0
    let basins = math.zeros(data.length, data[0].length).toArray()
    for (let i=0; i<data.length; i++) {
      for (let j=0; j<data[i].length; j++) {
        if (lowestGrid[i][j] === -4) {
          counter++
          basins[i][j] = counter
        } else if (data[i][j] === '9') {
          basins[i][j] = -1
        } else {
          basins[i][j] = 0
        }
      }
    }

    let max = math.max
    let min = math.min
    for (let n=0; n<10; n++) {
      let changes = 0
      for (let i = 0; i < data.length; i++) {
        let maxX = data.length-1
        for (let j = 0; j < data[i].length; j++) {
          if (basins[i][j] === -1) continue
          let maxY = data[i].length-1
          let highestIndex = math.max(basins[i][j],
              basins[min(i+1, maxX)][j], basins[max(i-1, 0)][j],
              basins[i][min(j+1, maxY)], basins[i][max(j-1, 0)]
          )
          if (highestIndex !== basins[i][j]) {
            changes++
            basins[i][j] = highestIndex
          }
        }
      }
      console.log({changes})
    }
    imagesc(math.transpose(data), 4)
    imagesc(math.transpose(basins), 4, false)

    let groupedCounts = {}
    basins.forEach((line) => {
      line.forEach((value) => {
        if (value > 0) {
          groupedCounts[value] = (groupedCounts[value] || 0) + 1
        }
      })
    })

    let counts = math.sort(Object.values(groupedCounts))
    console.log({counts, result2: math.prod(counts.slice(-3))})



    expose({data, lowestGrid, lowestValues, result1, basins, counts, groupedCounts})

    return {basins}
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