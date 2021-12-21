<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
// import {testData, data} from './day10.data.js'
import * as math from 'mathjs'

let realData = {player1: 7, player2: 10}
let testData = {player1: 4, player2: 8}
expose({math, testData, _})

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