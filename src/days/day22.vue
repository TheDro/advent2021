<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, realData} from './day22.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    let data = testData
    data = realData

    let reactor = math.zeros([101,101,101])

    let min = Math.min
    let max = Math.max
    for (let n=0; n<data.length; n++) {
      let cuboid = data[n]
      let [[x1,x2],[y1,y2],[z1,z2]] = cuboid.ranges
      x1 = max(x1, -50)
      y1 = max(y1, -50)
      z1 = max(z1, -50)
      x2 = min(x2, 50)
      y2 = min(y2, 50)
      z2 = min(z2, 50)
      for (let i=x1; i<=x2; i++) {
        for (let j=y1; j<=y2; j++) {
          for (let k=z1; k<=z2; k++) {
            reactor[i+50][j+50][k+50] = cuboid.value
          }
        }
      }
    }

    console.log({sum: math.sum(reactor)})

    expose({data,reactor})

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