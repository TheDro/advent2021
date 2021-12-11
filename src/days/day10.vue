<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, data} from './day10.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    // let data = testData
    let brackets = [
      {open: '(', close: ')', score: 3, score2: 1},
      {open: '[', close: ']', score: 57, score2: 2},
      {open: '{', close: '}', score: 1197, score2: 3},
      {open: '<', close: '>', score: 25137, score2: 4},
    ]

    let corruptBrackets = []
    let queues = []
    for (let n=0; n<data.length; n++) {
      let {corruptBracket, queue} = validate(data[n])
      if (corruptBracket) {
        corruptBrackets.push(corruptBracket)
      } else if (queue) {
        queues.push(queue)
      }
    }

    let result1 = corruptBrackets.reduce((total, bracket) => {
      return total + bracket.score
    }, 0)
    console.log({result1})


    let totals = queues.reduce((total, queue) => {

      let subTotal = 0
      for (let i=queue.length-1; i>=0; i--) {
        let bracket = queue[i]
        subTotal = subTotal*5 + bracket.score2
      }
      total.push(subTotal)
      return total

    }, [])

    console.log({totals, result2: math.median(totals)})

    function validate(line) {
      let queue = []
      for (let i=0; i<line.length; i++) {
        let nextCharacter = line[i]
        let nextOpenBracket = _.find(brackets, {open: nextCharacter})
        let nextClosedBracket = _.find(brackets, {close: nextCharacter})
        if (nextOpenBracket) {
          queue.push(nextOpenBracket)
        } else if (nextClosedBracket) {

          if (nextClosedBracket === queue[queue.length-1]) {
            queue.pop()
          } else {
            let corruptBracket = nextClosedBracket
            return {corruptBracket}
          }
        }
      }
      return {queue}
    }



    expose({data, brackets, corruptBrackets, queues})

    return {}
  }
}
// [({([[{{

</script>

<template>
  <!--  <div v-for="line of basins">-->
  <!--    <code>{{line}}</code>-->
  <!--  </div>-->
</template>

<style>

</style>