<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, data as realData} from './day15.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    let data = realData

    data = timesFive(data)

    let costs = math.zeros(data.length, data[0].length).toArray()
    for2D(data, (i,j) => {
      costs[i][j] = {value: Infinity, from: null, visited: false}
    })
    costs[0][0].value = 0

    let nx = data.length
    let ny = data[0].length
    let queue = [[0,0]]
    for (let n=0; n<1000000; n++) {

      // let [x,y] = queue.pop()
      let [x,y] = popLowest(queue, costs)
      let currentCost = costs[x][y]
      let neighbours = getNeighbours(x, y, nx, ny)

      neighbours.forEach((neighbour) => {
        let newValue = currentCost.value+data[neighbour[0]][neighbour[1]]
        let nextCost = costs[neighbour[0]][neighbour[1]]
        if (nextCost.value > newValue && nextCost.visited === false) {
          nextCost.value = newValue
          nextCost.from = [x,y]
          nextCost.visited = true
          queue.push(neighbour)
        }
      })

      if (n%10000 === 0) {
        console.log(`queue length: ${queue.length}`)
      }
      if (queue.length === 0) {
        console.log(`queue length: ${queue.length}`)
        break
      }
    }

    expose({queue, costs})



    function popLowest(queue, costs) {
      let lowest = Infinity
      let lowestIndex = 0
      for (let i=0; i<queue.length; i++) {
        let value = costs[queue[i][0]][queue[i][1]].value
        if (value < lowest) {
          lowest = value
          lowestIndex = i
        }
      }
      return queue.splice(lowestIndex,1)[0]
    }

    function timesFive(data) {
      let nx = data.length;
      let ny = data[0].length;
      let newData = []
      for (let i=0; i<nx*5; i++) {
        newData.push([])
        for (let j=0; j<ny*5; j++) {
          let value = data[i % nx][j % ny]
          value = (value + math.floor(i/nx) + math.floor(j/ny) - 1) % 9 + 1
          newData[i][j] = value
        }
      }
      return newData
    }


    function getNeighbours(x, y, sizeX, sizeY) {
      let neighbours = []
      if (x-1 >= 0) {
        neighbours.push([x-1, y])
      }
      if (x+1 < sizeX) {
        neighbours.push([x+1, y])
      }
      if (y-1 >= 0) {
        neighbours.push([x, y-1])
      }
      if (y+1 < sizeY) {
        neighbours.push([x, y+1])
      }
      return neighbours
    }

    function for2D(arr, callback) {
      for (let i=0; i<arr.length; i++){
        for (let j=0; j<arr[i].length; j++) {
          callback(i,j)
        }
      }
    }


    console.log({result: costs[costs.length-1][costs[0].length-1].value})

    let scale = 2

    expose({data})
    let costImage = costs.map((line) => {
      return line.map((cost) => {
        return cost.value > 1e9 ? 0 : cost.value
      })
    })
    imagesc(data, scale)
    imagesc(costImage, scale, false)
    let pathImage = _.cloneDeep(costImage)

    let next = [costs.length-1, costs[0].length-1]
    let increase = costs[costs.length-1][costs[0].length-1].value/5
    while (!!next) {
      pathImage[next[0]][next[1]] += increase
      next = costs[next[0]][next[1]].from
    }
    imagesc(pathImage, scale, false)
    expose({costImage})
    return {data}
  }
}

</script>

<template>
<!--    <div v-for="line of data">-->
<!--      <code>{{line}}</code>-->
<!--    </div>-->
</template>

<style>

</style>