<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {fish as fishes} from './day06.data.js'
import * as math from 'mathjs'

window.math = math


export default {
  setup(){

    let fishHistory = [fishes]

    let groupedFishes = math.zeros(9).toArray()
    fishes.forEach((fish) => {
      groupedFishes[fish] += 1
    })

    let currentGroup = groupedFishes
    for (let n=0; n<256; n++) {
      let nextGroup = math.zeros(9).toArray()
      for (let i=0; i<9; i++) {
        let sources
        if (i <= 5) {
          sources = [i+1]
        } else if (i === 6) {
          sources = [0, 7]
        } else if (i === 7) {
          sources = [8]
        } else if (i === 8) {
          sources = [0]
        }
        sources.forEach((source) => {
          nextGroup[i] += currentGroup[source]
        })
      }
      console.log(JSON.stringify({currentGroup, nextGroup}))
      currentGroup = nextGroup
    }
    console.log({sum: math.sum(currentGroup)})


    expose({fishHistory, groupedFishes, currentGroup})
    return {fishHistory}
  }
}

</script>

<template>

</template>

<style>

</style>