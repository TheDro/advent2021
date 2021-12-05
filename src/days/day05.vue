<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {data} from './day05.data.js'
import {zeros} from "../helpers/arrayHelper";

function expose(obj) {
  for (let key in obj) {
    window[key] = obj[key]
  }
}

export default {
  setup(){

    let grid = zeros(1000,1000)

    for (let n=0; n<data.length; n++) {
      let [start, end] = data[n]
      let vector = []
      let length = 0
      if (start[0] == end[0]) {
        vector = start[1] < end[1] ? [0,1] : [0,-1]
        length = Math.abs(start[1]-end[1])
      } else if (start[1] == end[1]) {
        vector = start[0] < end[0] ? [1,0] : [-1,0]
        length = Math.abs(start[0]-end[0])
      } else if (Math.abs(start[0]-end[0]) === Math.abs(start[1]-end[1])) {
        vector = [
          (end[0]-start[0])/Math.abs(end[0]-start[0]),
          (end[1]-start[1])/Math.abs(end[1]-start[1])
        ]
        length = Math.abs(start[0]-end[0])
      } else {
        continue
      }

      for (let i=0; i <= length; i++) {
        let x = start[0]+vector[0]*i
        let y = start[1]+vector[1]*i
        grid[y][x] += 1
      }
    }

    let nOverlaps = 0
    deepIterate(grid, (i,j,value)=> {
      if (value > 1) nOverlaps++
    } )

    console.log(nOverlaps)


    function deepIterate(matrix, callback) {
      for (let i=0; i<matrix.length; i++) {
        for (let j=0; j<matrix[i].length; j++) {
          callback(i,j,matrix[i][j])
        }
      }
    }

    expose({grid})
    return {grid}
  }
}

</script>

<template>
  <div v-if="grid.length === 10">
    <div style="font-size: 4pt" v-for="line of grid">
      {{line}}
    </div>
  </div>
</template>