<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, realData} from './day24.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    let data = testData
    data = realData


    let pairs = []
    let limitZ = Infinity
    for (let n=0; n<1; n++) {
      let number = randomNumber()
      let {w,x,y,z} = applyCommands(data, number)
      // console.log(`${number}: ${w}/${x}/${y}/${z}`)
      if (z <= limitZ) {
        pairs.push([parseInt(number), z])
      }
      // console.log(number/z)
    }
    pairs = _.uniqBy(pairs, JSON.stringify)

    function randomNumber() {
      //            ?  ?  ?  ?  ?  ?  +  ?  ?  ?  ?  ?  ?  ?
      let digits = [2, 4, 9, 1, 3, 1, 1, 1, 6, 1, 6, 1, 5, 1]
      for (let i=0; i<digits.length; i++) {
        if (digits[i] === 0) {
          digits[i] = Math.floor(Math.random()*9) + 1
        }
      }
      return digits.join('')
    }


    expose({data, applyCommand, applyCommands, newVariables, randomNumber})

    function applyCommands(commands, number, variables = newVariables()) {
      let stream = number.toString().split('').map((char) => parseInt(char))
      commands.forEach((command) => {
        applyCommand(command, stream, variables)
      })
      return variables
    }

    function applyCommand(command, stream, variables) {
      let {action, input, output} = command
      let inputValue;
      if (!!input?.match(/[wxyz]/)) {
        inputValue = variables[input]
      } else {
        inputValue = parseInt(input)
      }

      if (action === 'inp') {
        // Object.assign(variables, newVariables())
        // variables.z = 25
        variables[output] = parseInt(stream.shift())
      } else if (action === 'add') {
        variables[output] += inputValue
      } else if (action === 'mul') {
        variables[output] *= inputValue
      } else if (action === 'div') {
        variables[output] = Math.floor(variables[output]/inputValue)
      } else if (action === 'mod') {
        variables[output] = variables[output] % inputValue
      } else if (action === 'eql') {
        let value = variables[output] === inputValue ? 1 : 0
        variables[output] = value
      } else {
        throw "unexpected operation"
      }
      let Z = variables.z.toString(26).split('').map((letter) => {
        return parseInt(letter, 26)
      }).join(',')
      if (action === 'inp') {
        console.log({op: action+' '+output+' '+input, Z, ...variables })
      }
    }

    function getCode(value) {

    }

    function newVariables() {
      return {w: 0, x: 0, y: 0, z: 0}
    }

    let X = []
    let Y = []
    pairs.forEach((pair) => {
      X.push(pair[0])
      Y.push(pair[1])
    })
    let minX = Math.min(...X)
    let maxX = Math.max(...X)
    let minY = Math.min(...Y)
    let maxY = Math.max(...Y)

    console.log({minY: Math.min(...Y), maxY: Math.max(...Y), maxX: Math.max(...X)})

    function getDigit(value, pos) {
      return parseInt(value.toString()[pos-1])
    }

    limitZ = minY+1*(maxY-minY)
    let goodOnes = pairs.filter((pair) => {
      return pair[1] <= limitZ
    }).sort((pairA, pairB) => 0*(pairA[1]-pairB[1])*1e14+pairA[0]-pairB[0])
    console.log({goodOnes})
    console.log(goodOnes)
    expose({getDigit})
    return {points: pairs, minX, maxX, minY, maxY, limitZ, getDigit}
  }
}

</script>

<template>
  <div>[ {{minX}},{{maxX}} ] : {{minY}}, {{maxY}}</div>
  <svg transform="scale(1, -1) translate(0, 0)" width="400" height="400" style="background-color: white">
    <g>
      <circle v-for="point of points"
              :cx="400*(point[0]-minX)/(maxX-minX)"
              :cy="400*(point[1])/(maxY)"
              r="1" fill="rgb(0,0,0)"></circle>
    </g>
  </svg>
<!--  <svg transform="scale(1, -1) translate(0, 0)" width="400" height="400" style="background-color: white">-->
<!--    <g>-->
<!--      <circle v-for="point of points"-->
<!--              :cx="(getDigit(point[0], 1)*10+getDigit(point[0], 2))*4"-->
<!--              :cy="400*(point[1])/(maxY)"-->
<!--              r="1" fill="rgb(0,0,150)"></circle>-->
<!--    </g>-->
<!--  </svg>-->
</template>

<style>
body {
  background-color: #ccc
}
</style>


(2) [11111111616152, 6408]
1: (2) [11111111627152, 6408]
2: (2) [11111111738252, 6408]
3: (2) [11111111827352, 6408]
4: (2) [11111111938451, 166611]
5: (2) [11111111627153, 166613]
6: (2) [11111111649153, 166613