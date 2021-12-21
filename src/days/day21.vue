<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
// import {testData, data} from './day10.data.js'
import * as math from 'mathjs'

let realData = {player1: 7, player2: 10}
let testData = {player1: 4, player2: 8}
expose({math, testData, _})

function Die(startingValue) {
  let value = startingValue
  let maxValue = 100
  let self = {value, roll, totalRolls: 0}
  return self

  function roll(n) {
    let result = 0
    for (let i=0; i<n; i++) {
      result += self.value
      self.value = self.value % maxValue + 1
    }
    self.totalRolls += n
    return result
  }
}


export default {
  setup(){
    let data = testData
    data = realData

    let die = Die(1)

    let players = [
      {position: data.player1-1, score: 0},
      {position: data.player2-1, score: 0}
    ]


    for (let n=0; n<1000; n++) {
      let playerIndex = n % 2
      let player = players[playerIndex]
      let roll = die.roll(3)
      player.position = (player.position+roll) % 10
      player.score += player.position+1
      if (player.score >= 1000) {
        break
      }
    }
    console.log({players, die})
    console.log({result1: die.totalRolls*math.min(players[0].score, players[1].score)})


    expose({data, die, Die})

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