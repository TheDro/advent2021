<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, realData} from './day25.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    let data = testData
    data = realData
    show(data)
    for (let n=0; n<10000; n++) {
      let rightMoves = getMoves(data, '>')
      rightMoves.forEach((move) => swap(data, move[0], move[1]))
      let downMoves = getMoves(data, 'v')
      downMoves.forEach((move) => swap(data, move[0], move[1]))
      if (rightMoves.length === 0 && downMoves.length === 0) {
        console.log('Done after '+(n+1))
        break
      }
    }
    show(data)
    expose({swap, getMoves, data, show})

    function getMoves(state, direction) {
      let moves = []
      let nx = state.length
      let ny = state[0].length
      for (let i=0; i<nx; i++) {
        for (let j=0; j<ny; j++) {
          let current = state[i][j]
          if (direction === '>' && current === '>') {
            if (state[i][ (j+1) % ny ] === '.') {
              moves.push([[i,j],[i, (j+1) % ny ]])
            }
          }
          if (direction === 'v' && current === 'v') {
            if (state[ (i+1) % nx ][j] === '.') {
              moves.push([[i,j], [ (i+1) % nx, j]])
            }
          }
        }
      }
      return moves
    }


    expose({data})

    function show(state) {
      console.log( state.map((row) => row.join('')).join('\n') )
    }

    function swap(state, coord1, coord2) {
      try {
        let value1 = state[coord1[0]][coord1[1]]
        state[coord1[0]][coord1[1]] = state[coord2[0]][coord2[1]]
        state[coord2[0]][coord2[1]] = value1
        return state

      } catch (e) {
        debugger
      }
    }

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