<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, data} from './day16.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    let data = '38006F45291200'

    let message = {hex: data.split(''), bin: []}
    let packets = []
    function parsePackets(message) {
      let version = parseInt(getBits(message, 3).join(''), 2)
      let typeId = parseInt(getBits(message, 3).join(''), 2)

      if (typeId === 4) {
        let value = []
        for(let n=0; n<10; n++) {
          let leadingBit = getBits(message,1)[0]
          value.push(...getBits(message,4))
          if (leadingBit === '0') {
            break
          }

        }
        packets.push({version, typeId, value: parseInt(value.join(''), 2)})
      } else {
        let lengthTypeId = getBits(message, 1)[0]
        // TODO: I'm here
        if (lengthTypeId === '0') {
          let bitLength = parseInt(getBits(message, 15).join(''), 2)
          parseBits(message, bitLength)
        } else {
          let packetLength = parseInt(getBits(message, 11).join(''), 2)
          parsePackets(message, packetLength)
        }
      }


      // let header = getHeader(hex)
      console.log({version, typeId, packets})
    }

    parsePackets(message)

    function getBits(message, n) {
      if (message.bin.length < n) {
        let neededDigits = Math.ceil((n-message.bin.length)/4)
        message.bin.push( ...hexToBinary(message.hex.splice(0, neededDigits)) )
      }
      return message.bin.splice(0,n)
    }

    function getHeader(hex) {
      return hexToBinary(hex.slice(0,2)).slice(0,6)
    }

    function hexToBinary(hex) {
      let length = hex.length*4
      return parseInt(hex.join(''), 16).toString(2).padStart(length, '0').split('')
    }



    expose({data, hexToBinary, message, getBits})

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