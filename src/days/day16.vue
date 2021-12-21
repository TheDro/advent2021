<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, data as realData} from './day16.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    let data = ''
    data = 'D2FE28'
    data = '38006F45291200'
    data = 'EE00D40C823060'
    data = '8A004A801A8002F478'
    data = '620080001611562C8802118E34'
    data = 'C0015000016115A2E0802F182340'
    data = 'A0016C880162017C3686B18A3D4780'
    data = realData

    let message = {hex: data.split(''), bin: []}
    // let packets = []
    function parsePackets(message, number) {
      let packets = []
      for (let i=0; i<number; i++) {
        if (message.bin.length === 0 && message.hex.length === 0) {
          break
        }
        let messageStr = JSON.stringify({hex: message.hex.join(''), bin: message.bin.join('')})
        let version = parseInt(getBits(message, 3).join(''), 2)
        let typeId = parseInt(getBits(message, 3).join(''), 2)
        // console.log({version, typeId, messageStr})
        let packet = {version, typeId}

        if (typeId === 4) {

          let value = []
          for (let n = 0; n < 99; n++) {
            let leadingBit = getBits(message, 1)[0]
            value.push(...getBits(message, 4))
            if (leadingBit === '0') {
              break
            }

          }
          packet.value = parseInt(value.join(''), 2)
          // console.log(`getting raw value: ${packet.value}`)
          packets.push(packet)
          // message.bin = []
        } else {
          let lengthTypeId = getBits(message, 1)[0]
          if (lengthTypeId === '0') {
            let bitLength = parseInt(getBits(message, 15).join(''), 2)

            let subMessage = {hex: [], bin: getBits(message, bitLength)}
            // console.log(`getting packets from next ${bitLength} bits: ${subMessage.bin.join('')}`)
            packet.subPackets = parsePackets(subMessage, 99)
            packets.push(packet)
          } else {
            let packetLength = parseInt(getBits(message, 11).join(''), 2)
            // console.log(`getting next ${packetLength} packets from ${JSON.stringify(message)}`)
            packet.subPackets = parsePackets(message, packetLength)
            packets.push(packet)
          }
        }

      }
      // console.log({packets})
      return packets
    }

    let result = parsePackets(message, 1)[0]
    console.log({result})
    console.log({sum: versionSum([result])})


    let testHexes = [
        'C200B40A82', '04005AC33890', '880086C3E88112', 'CE00C43D881120',
        'D8005AC2A8F0', 'F600BC2D8F', '9C005AC2F8F0', '9C0141080250320F1802104A08', realData
    ]


    testHexes.forEach((hex) => {
      let message = {hex: hex.split(''), bin: []}
      console.log(`Value for ${hex} is ${compute(parsePackets(message,1)[0])}`)
    })


    function compute(packet) {

        if (packet.typeId === 0) {
          return math.sum( packet.subPackets.map((subPacket) => compute(subPacket)) )
        } else if (packet.typeId === 1) {
          return math.prod( packet.subPackets.map((subPacket) => compute(subPacket)) )
        } else if (packet.typeId === 2) {
          return math.min( packet.subPackets.map((subPacket) => compute(subPacket)) )
        } else if (packet.typeId === 3) {
          return math.max( packet.subPackets.map((subPacket) => compute(subPacket)) )
        } else if (packet.typeId === 4) {
          return packet.value
        } else if (packet.typeId === 5) {
          return compute(packet.subPackets[0]) > compute(packet.subPackets[1]) ? 1 : 0
        } else if (packet.typeId === 6) {
          return compute(packet.subPackets[0]) < compute(packet.subPackets[1]) ? 1 : 0
        } else if (packet.typeId === 7) {
          return compute(packet.subPackets[0]) === compute(packet.subPackets[1]) ? 1 : 0
        }

    }


    function versionSum(packets) {
      let sum = 0
      packets.forEach((packet) => {
        sum += packet.version
        if (packet.subPackets) {
          sum += versionSum(packet.subPackets)
        }
      })
      return sum
    }

    function getBits(message, n) {
      if (message.bin.length < n) {
        let neededDigits = Math.ceil((n-message.bin.length)/4)
        for (let i=0; i<neededDigits; i++) {
          message.bin.push( ...hexToBinary(message.hex.splice(0, 1)) )
        }
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



    expose({data, hexToBinary, message, getBits, result})

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