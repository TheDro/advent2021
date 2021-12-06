import _ from 'lodash'
import * as math from "mathjs";

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
  ctx.putImageData(imgData, 0, 0)

  ctx.drawImage(canvas, 0, 0, nx, ny, 0, 0, scale*nx, scale*ny)
  document.querySelector('body').appendChild(canvas)
}

function expose(obj) {
  for (let key in obj) {
    window[key] = obj[key]
  }
}

export {imagesc, expose}