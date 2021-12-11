<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, data} from './day11.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    // let data = testData

    let grid = _.cloneDeep(data)

    let flashCount = 0;
    let previousGrid
    let steps = 1000
    for (let n=1; n<=steps; n++) {
      previousGrid = _.cloneDeep(grid)
      console.log(`STEP ${n}`)
      grid = math.add(grid, 1)
      let currentFlashes = applyFlash(grid)
      flashCount += currentFlashes
      console.log({currentFlashes, flashCount})
      if (currentFlashes === grid.length*grid[0].length) {
        console.log(`ALL FLASH TOGETHER AT STEP ${n}`)
        break
      }
    }

    function applyFlash(grid) {
      let nx = grid.length
      let ny = grid[0].length
      let totalFlashes = 0
      for (let n=0; n<50; n++) {
        let currentFlashes = 0
        for (let i=0; i<nx; i++) {
          for (let j=0; j<ny; j++) {
            if (grid[i][j] > 9) {
              currentFlashes++
              grid[i][j] = -1000000
              rangeAround(i,j,nx,ny,(x,y) => {
                grid[x][y]++
              })
            }
          }
        }
        // console.log({currentFlashes})
        if (currentFlashes === 0) {
          break
        }
        totalFlashes += currentFlashes
      }
      for (let i=0; i<nx; i++) {
        for (let j=0; j<ny; j++) {
          grid[i][j] = Math.max(grid[i][j], 0)
        }
      }

      return totalFlashes
    }

    function rangeAround(i, j, sizeX, sizeY, callback) {
      for (let x=Math.max(i-1, 0); x<=Math.min(i+1, sizeX-1); x++) {
        for (let y=Math.max(j-1, 0); y<=Math.min(j+1, sizeY-1); y++) {
          callback(x,y)
        }
      }
    }


    expose({data, grid, previousGrid})

    return {grid, previousGrid, steps}
  }
}

</script>

<template>
    <div style="margin: 1rem">{{steps-1}}</div>
    <div v-for="line of previousGrid">
      <div style="display: inline-block; width: 2rem;"
           :class="{bright: value<1}"
           v-for="value of line">{{value}}</div>
    </div>
    <div style="margin: 1rem">{{steps}}</div>
    <div v-for="line of grid">
      <div style="display: inline-block; width: 2rem;"
           :class="{bright: value<1}"
           v-for="value of line">{{value}}</div>
    </div>


</template>

<style>
.bright {
  background-color: aqua;
}
</style>