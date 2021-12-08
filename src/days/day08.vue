<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, data} from './day08.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    // let data = testData


    let allResults = []
    for (let i=0; i<data.length; i++) {
      let cypher = getCypher(data[i].calibration)
      let decypheredCalibration = decypher(cypher, data[i].calibration)
      let decodedCalibration = decode(decypheredCalibration)
      let decypheredSignal = decypher(cypher, data[i].signal)
      let decodedSignal = decode(decypheredSignal)
      console.log(decodedCalibration.join(',')+' | '+decodedSignal)
      allResults.push(decodedSignal)
    }
    console.log(allResults)
    expose({allResults})

    console.log('part 1', countMatches(_.flatten(allResults), [1,4,7,8]))

    let sum = allResults.reduce((total, arr) => {
      return total + parseInt(arr.join(''))
    }, 0)

    console.log('part 2', sum)




    function countMatches(arr, values) {
      let count = 0
      arr.forEach((value) => {
        if (_.includes(values, value)) {
          count++
        }
      })
      return count
    }

    function decode(numbers) {
      let decodeMap = {
        ABCEFG: 0,
        CF: 1,
        ACDEG: 2,
        ACDFG: 3,
        BCDF: 4,
        ABDFG: 5,
        ABDEFG: 6,
        ACF: 7,
        ABCDEFG: 8,
        ABCDFG: 9,
      }

      return numbers.map((number) => {
        return decodeMap[number]
      })
    }

    function decypher(cypher, numbers) {
      let inverseCypher = {}
      for (let key in cypher) {
        inverseCypher[cypher[key].value] = key
      }

      let result = numbers.map((number) => {
        let decypheredArray = number.split('').map((letter) => {
          return inverseCypher[letter]
        })
        return decypheredArray.sort().join('')
      })

      expose({cypher, inverseCypher, result, numbers})
      return result
    }

    function getCypher(calibration) {
      let cypher = newCypher()
      let statistics = {}
      for (let i=0; i<calibration.length; i++) {
        let number = calibration[i]
        let length = number.length
        number.split('').forEach((letter) => {
          if (statistics[letter] === undefined) {
            statistics[letter] = {count: 0, group2: 0, group4: 0}
          }
          statistics[letter].count++
          if (length === 2 || length === 4) {
            statistics[letter][`group${length}`]++
          }
        })
      }

      for(let key in cypher) {
        let rules = cypher[key].rules
        for (let letter in statistics) {
          let matches = 0
          for (let ruleName in rules) {
            if (rules[ruleName] === statistics[letter][ruleName]) {
              matches++
            }
          }
          if (matches === Object.keys(rules).length) {
            cypher[key].value = letter
          }
        }
      }

      return cypher
    }


    function newCypher() {
      return {
        A: {value: null, rules: { count: 8, group2: 0}},
        B: {value: null, rules: { count: 6 }},
        C: {value: null, rules: { count: 8, group2: 1 }},
        D: {value: null, rules: { count: 7, group4: 1 }},
        E: {value: null, rules: { count: 4 }},
        F: {value: null, rules: { count: 9 }},
        G: {value: null, rules: { count: 7, group4: 0 }},
      }
    }

    expose({})
    return {}
  }
}

</script>

<template>

</template>

<style>

</style>