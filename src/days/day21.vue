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
    // data = realData

    let die = Die(1)

    let players = [
      {position: data.player1-1, score: 0},
      {position: data.player2-1, score: 0}
    ]

    let str = JSON.stringify
    let parse = JSON.parse

    let stateCounter = {[str(players)]: 1}
    // let completeStateCount = {}
    let wins = [0,0]
    for (let n=0; n<11; n++) {
      let playerIndex = n % 2
      let nextStateCounter = {}

      if (Object.keys(stateCounter).length === 0) {
        break
      }
      for (let stateStr in stateCounter) {
        let count = stateCounter[stateStr]
        let newStateStrs = generateStateStrs(stateStr, playerIndex)
        newStateStrs.forEach((stateStr) => {
          nextStateCounter[stateStr] = (nextStateCounter[stateStr] || 0) + count
        })
      }

      let stateStrs = Object.keys(nextStateCounter)
      for (let stateStr of stateStrs) {
        let state = parse(stateStr)
        if (state[0].score >= 21) {
          wins[0] += nextStateCounter[stateStr]
          delete nextStateCounter[stateStr]
        }
        if (state[1].score >= 21) {
          wins[1] += nextStateCounter[stateStr]
          delete nextStateCounter[stateStr]
        }
      }

      stateCounter = nextStateCounter
      console.log({stateCounter, wins: str(wins)})
    }
    // console.log({players, die})
    // console.log({result1: die.totalRolls*math.min(players[0].score, players[1].score)})

    function generateStateStrs(stateStr, playerIndex) {
      let newStateStrs = []
      for (let i=1; i<=3; i++) {
        let newState = parse(stateStr)
        let player = newState[playerIndex]
        player.position = (player.position+i) % 10
        player.score += player.position+1
        newStateStrs.push(str(newState))
      }
      return newStateStrs
    }

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