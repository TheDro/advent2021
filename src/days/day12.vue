<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, testData2, testData3, data as routes} from './day12.data.js'
import * as math from 'mathjs'

expose({math, testData, _})

export default {
  setup(){
    // let routes = testData3
    console.log({routes})

    let paths = []
    paths = getMatches('start', routes)

    let closedPaths =  []
    for (let n=0; n<15; n++) {
      if (paths.length === 0) break
      let nextPaths = []
      paths.forEach((path) => {
        let matches = getMatches(last(path), routes)
        matches.forEach((match) => {
          nextPaths.push([...path, match[1]])
        })
      })

      let ends = removeEnds(nextPaths)
      closedPaths.push(...ends)
      // console.log('remove overlaps:')
      // console.log(JSON.stringify(nextPaths))
      removeOverlaps(nextPaths)
      // console.log(JSON.stringify(nextPaths))
      paths = nextPaths


      expose({nextPaths, ends, removeOverlaps})
    }
    expose({paths, closedPaths})
    console.log("closed/remaining", `${closedPaths.length}/${paths.length}`)

    function removeOverlaps(paths) {
      for (let i=paths.length-1; i>=0; i--) {
        let path = paths[i]
        // let smallCaves = ['start', 'end']
        let doubleVisit = false
        let smallCaves = []
        for (let j=0; j<path.length; j++) {
          let cave = path[j]
          // debugger
          if (count(smallCaves, cave) >= 1) {
            if (!doubleVisit && cave !== 'start' && cave !== 'end') {
              doubleVisit = true
              continue
            }
            paths.splice(i,1)
            break
          } else if (cave.toLowerCase() === cave) {
            smallCaves.push(cave)
          }
        }
      }
    }

    function count(array, value) {
      let result = 0;
      array.forEach((val) => {
        if (val === value) {
          result++
        }
      })
      return result
    }


    function removeEnds(paths) {
      let ends = []
      for (let i=paths.length-1; i>=0; i--) {
        let path = paths[i]
        if (last(path) === 'end') {
          ends.push(...paths.splice(i,1))
        }
      }
      return ends
    }


    function last(array) {
      return array[array.length-1]
    }

    function getMatch(cave, route) {
      if (route[0] === cave) {
        return [route[0], route[1]]
      } else if (route[1] === cave) {
        return [route[1], route[0]]
      }
    }

    function getMatches(cave, routes) {
      let result = []
      routes.forEach((route) => {
        let match = getMatch(cave, route)
        if (match) {
          result.push(match)
        }
      })
      return result
    }

    function clone(input) {
      return _.cloneDeep(input)
    }

    expose({routes, paths, getMatch, getMatches})

    return {paths, closedPaths}
  }
}

</script>

<template>
<!--  <h3>{{closedPaths.length}} closed paths</h3>-->
<!--  <div v-for="line of closedPaths">-->
<!--    <code>{{line}}</code>-->
<!--  </div>-->
<!--  <h3>{{paths.length}} remaining paths</h3>-->
<!--  <div v-for="line of paths">-->
<!--    <code>{{line}}</code>-->
<!--  </div>-->
</template>

<style>

</style>