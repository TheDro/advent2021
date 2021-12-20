<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, data} from './day20.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    // let data = testData
    let {decoder, image} = data
    let multiplier = [[256,128,64],[32,16,8],[4,2,1]]



    let outsideValue = 0
    for (let n=0; n<50; n++) {
      console.log(n)
      image = transformOnce(decoder, image, outsideValue)
      let outsideIndex = math.sum(math.dotMultiply(multiplier, outsideValue))
      outsideValue = decoder[outsideIndex]
    }
    console.log({image, sum: math.sum(image)})






    function transformOnce(decoder, image, outsideValue) {
      let nextImage = math.zeros(image.length+2, image[0].length+2).toArray()
      let currentImage = doublePadImage(image, outsideValue)
      for (let i=1; i<currentImage.length-1; i++) {
        for (let j=1; j<currentImage[0].length-1; j++) {
          let decoderValue = 0
          for (let x=-1; x<=1; x++) {
            for (let y=-1; y<=1; y++) {
              decoderValue += currentImage[i+x][j+y]*multiplier[x+1][y+1]
            }
          }
          nextImage[i-1][j-1] = decoder[decoderValue]
        }
      }
      return nextImage
    }

    function imageSubset(image, xRange, yRange) {
      return math.subset(image, math.index(math.range(xRange[0], xRange[1]), math.range(yRange[0], yRange[1])))
    }

    function doublePadImage(image, value) {
      let paddedImage = math.dotMultiply(value, math.ones(image.length+4, image[0].length+4)).toArray()
      paddedImage = math.subset(paddedImage,
          math.index(math.range(2, 2+image.length), math.range(2, 2+image[0].length)),
          image
      )
      return paddedImage
    }


    expose({decoder, image, imageSubset, data})

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