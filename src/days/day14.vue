<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, data} from './day14.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    // let data = testData

    expose({data})

    let {sequence, insertions} = _.cloneDeep(data)
    let occurrences = {}
    let firstLetter = sequence[0]
    let lastLetter = sequence[sequence.length-1]
    for (let i=sequence.length-2; i>=0; i--) {
      let pair = sequence[i]+sequence[i+1]
      occurrences[pair] = (occurrences[pair] || 0) + 1
    }



    for (let n=0; n<40; n++) {
      let nextOccurrences = {}
      for (let pair in occurrences) {
        // let pair = sequence[i]+sequence[i+1]
        let insertion = insertions[pair]
        let newPair1 = pair[0]+insertion
        let newPair2 = insertion+pair[1]
        nextOccurrences[newPair1] = (nextOccurrences[newPair1] || 0) + occurrences[pair]
        nextOccurrences[newPair2] = (nextOccurrences[newPair2] || 0) + occurrences[pair]

      }
      console.log({occurrences, nextOccurrences})
      occurrences = nextOccurrences
    }

    let count = {[firstLetter]: 0.5, [lastLetter]: 0.5}
    for (let pair in occurrences) {
      let [letter1, letter2] = pair.split('')
      count[letter1] = (count[letter1] || 0) + occurrences[pair]/2
      count[letter2] = (count[letter2] || 0) + occurrences[pair]/2
    }




    // OLD SOLUTION
    // for (let n=0; n<10; n++) {
    //   for (let i=sequence.length-2; i>=0; i--) {
    //     let insertion = insertions[sequence[i]+sequence[i+1]]
    //     sequence.splice(i+1, 0, insertion)
    //   }
    // }
    //
    // let count = {}
    // sequence.forEach((letter) => {
    //   count[letter] = (count[letter] || 0) + 1
    // })

    let {min: leastCommon, max: mostCommon} = getExtremes(count)
    let result1 = Object.values(mostCommon)[0] - Object.values(leastCommon)[0]
    console.log({count, leastCommon, mostCommon, result1})

    function getExtremes(obj) {
      let largestValue = -Infinity
      let smallestValue = Infinity
      let largestObj = {}
      let smallestObj = {}
      for (let key in obj) {
        if (obj[key] >= largestValue) {
          largestValue = obj[key]
          largestObj = {[key]: obj[key]}
        }
        if (obj[key] <= smallestValue) {
          smallestValue = obj[key]
          smallestObj = {[key]: obj[key]}
        }
      }
      return {min: smallestObj, max: largestObj}
    }

    expose({sequence, leastCommon, mostCommon})

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