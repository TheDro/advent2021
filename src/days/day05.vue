<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {data} from './day05.data.js'
import * as math from 'mathjs'

window.math = math

function expose(obj) {
  for (let key in obj) {
    window[key] = obj[key]
  }
}

function imagesc(img, scale = 1) {
  let oldCanvas = document.getElementById('canvas')
  oldCanvas?.remove()

  let nx = math.min(img.length, 1000)
  let ny = math.min(img[0].length, 1000)
  let minVal = math.min(img)
  let maxVal = math.max(img)
  let valRange = maxVal-minVal
  if (valRange === 0) valRange = 1

  let canvas = document.createElement('canvas')
  canvas.height = scale*ny
  canvas.width = scale*nx
  canvas.id = 'canvas'
  let ctx = canvas.getContext("2d")
  ctx.imageSmoothingEnabled = false;

  let imgData = ctx.createImageData(nx, ny)
  for (let i=0; i<nx; i++) {
    for (let j=0; j<ny; j++) {
      imgData.data[4*i + 4*nx*j + 0] = Math.round((img[i][j]-minVal)/valRange*255)
      imgData.data[4*i + 4*nx*j + 1] = Math.round((img[i][j]-minVal)/valRange*255)
      imgData.data[4*i + 4*nx*j + 2] = Math.round((img[i][j]-minVal)/valRange*255)
      imgData.data[4*i + 4*nx*j + 3] = 255
    }
  }
  // ctx.drawImage(imgData, 0,0)
  ctx.putImageData(imgData, 0, 0)

  // let canvas2 = document.createElement('canvas')
  // let ctx2 = canvas2.getContext('2d')
  ctx.drawImage(canvas, 0, 0, nx, ny, 0, 0, scale*nx, scale*ny)
  document.querySelector('body').appendChild(canvas)
}

export default {
  setup(){

    let grid = math.zeros(1000,1000).toArray()

    for (let n=0; n<data.length; n++) {
      let [start, end] = data[n]
      let vector = []
      let length = 0
      if (start[0] == end[0]) {
        vector = start[1] < end[1] ? [0,1] : [0,-1]
        length = Math.abs(start[1]-end[1])
      } else if (start[1] == end[1]) {
        vector = start[0] < end[0] ? [1,0] : [-1,0]
        length = Math.abs(start[0]-end[0])
      } else if (Math.abs(start[0]-end[0]) === Math.abs(start[1]-end[1])) {
        vector = [
          (end[0]-start[0])/Math.abs(end[0]-start[0]),
          (end[1]-start[1])/Math.abs(end[1]-start[1])
        ]
        length = Math.abs(start[0]-end[0])
      } else {
        continue
      }

      for (let i=0; i <= length; i++) {
        let x = start[0]+vector[0]*i
        let y = start[1]+vector[1]*i
        grid[y][x] += 1
      }
    }

    imagesc(grid, 2)
    let nOverlaps = 0
    deepIterate(grid, (i,j,value)=> {
      if (value > 1) nOverlaps++
    } )

    console.log(nOverlaps)


    function deepIterate(matrix, callback) {
      for (let i=0; i<matrix.length; i++) {
        for (let j=0; j<matrix[i].length; j++) {
          callback(i,j,matrix[i][j])
        }
      }
    }

    expose({grid})
    return {grid}
  }
}

</script>

<template>
<!--  <canvas id="canvas" width="1000" heigth="1000"></canvas>-->
<!--  <div v-if="grid.length === 10">-->
<!--    <div style="font-size: 4pt" v-for="line of grid">-->
<!--      {{line}}-->
<!--    </div>-->
<!--  </div>-->
</template>

<style>
canvas {
  image-rendering: optimizeSpeed;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: optimize-contrast;
  -ms-interpolation-mode: nearest-neighbor;
}
</style>