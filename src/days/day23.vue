<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import * as math from 'mathjs'

expose({math, testData, _})

let testData = `
...........
##B#C#B#D##
##A#D#C#A##
`


function remap(data) {
  let theMap = {'.': 0, '#': -1, 'A': 1, 'B': 2, 'C': 3, 'D': 4}
  return data.trim.split('\n').map((line) => {
    return line.split('').map((spot) => {
      return theMap[spot]
    })
  })
}

export default {
  setup(){
    let data = testData

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