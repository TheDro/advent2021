<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, data} from './day20.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    let data = testData
    let {decoder, image} = data

    function transformOnce(decoder, image) {
      let nextImage = math.zeros(image.length+2, image[0].length+2).toArray()
    }


    expose({decoder, image})

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