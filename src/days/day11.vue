<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, data} from './day11.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    let data = testData

    let state = reactive( {
      grid: _.cloneDeep(data), flashCount: 0, colors: []
    })
    state.colors = [
        [255, 255, 0],
        [0, 20, 100],
        [0, 30, 120],
        [0, 40, 140],
        [0, 50, 160],
        [0, 60, 180],
        [0, 70, 200],
        [0, 80, 220],
        [0, 90, 240],
        [0, 100, 250],
    ].map((color) => {
      return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    })


    let steps = 200
    advance(steps)


    function advance(stepsLeft) {
      console.log(`STEP ${steps-stepsLeft+1}`)
      state.grid = math.add(state.grid, 1)
      let currentFlashes = applyFlash(state.grid)
      state.flashCount += currentFlashes
      console.log({currentFlashes, flashCount: state.flashCount})
      if (currentFlashes === state.grid.length*state.grid[0].length) {
        console.log(`ALL FLASH TOGETHER AT STEP ${steps-stepsLeft+1}`)
      } else if (stepsLeft > 0) {
        setTimeout(() => {advance(stepsLeft-1)}, 200)
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


    expose({data, state})

    return {steps, state}
  }
}

</script>

<template>
<!--    <div style="margin: 1rem">{{steps-1}}</div>-->
<!--    <div v-for="line of previousGrid">-->
<!--      <div style="display: inline-block; width: 2rem;"-->
<!--           :class="{bright: value<1}"-->
<!--           v-for="value of line">{{value}}</div>-->
<!--    </div>-->
    <div v-for="line of state.grid">
      <div :style="{backgroundColor: state.colors[value]}"
           class="grid-cell"
           v-for="value of line">{{value}}</div>
    </div>


</template>

<style>
.grid-cell {
  display: inline-block;
  width: 2rem;
}
</style>