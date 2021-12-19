<script>
import {watchEffect, reactive} from 'vue'
import _ from 'lodash'
import {imagesc, expose} from "../helpers/helper.js";
import {testData, data, rotations} from './day19.data.js'
import * as math from 'mathjs'

let str = (obj) => { return JSON.stringify(obj) }
expose({math, testData, _, rotations, str})


export default {
  setup(){
    // let data = testData

    let probes = data.map((probe) => {
      let coords = probe.sort((coordA, coordB) => {
        return math.norm(coordA) - math.norm(coordB)
      })
      let distances = getDistances(coords)
      return {coords, distances, oriented: false}
    })
    probes[0].oriented = true
    probes[0].translation = [0,0,0]

    let orientedProbes = probes.slice(0,1)
    let unorientedProbes = probes.slice(1,probes.length)

    for (let n=0; n<40; n++) {
      reorientOne(orientedProbes, unorientedProbes)
      console.log({oriented: orientedProbes.length, unoriented: unorientedProbes.length})
      if (unorientedProbes.length === 0) {
        break
      }
    }

    let coordSet = new Set()
    orientedProbes.forEach((probe) => {
      probe.coords.forEach((coord) => {
        coordSet.add(str(coord))
      })
    })
    console.log(coordSet) // PART 1

    let largest = 0
    for (let i=0; i<orientedProbes.length; i++) {
      let left = orientedProbes[i].translation
      for (let j=i+1; j<orientedProbes.length; j++) {
        let right = orientedProbes[j].translation
        if (!right) {
          debugger
        }
        let dist = manhattanDistance(left, right)
        if (dist > largest) {
          largest = dist
        }
      }
    }
    console.log({largest}) // PART 2

    function manhattanDistance(arr1, arr2) {
      try {
        return math.sum( math.abs( math.subtract(arr1, arr2) ) )
      } catch (e) {
        debugger
      }
    }





    expose({orientedProbes, unorientedProbes, manhattanDistance})
    console.log({orientedProbes, unorientedProbes})

    function reorientOne(orientedProbes, unorientedProbes) {
      for (let i=0; i<orientedProbes.length; i++) {
        let leftProbe = orientedProbes[i]
        for (let j=0; j<unorientedProbes.length; j++) {
          let rightProbe = unorientedProbes[j]
          let matchingPairs = getMatchingDistancePairs(leftProbe.distances, rightProbe.distances)
          if (matchingPairs.length >= 12) {

            let correctRotation = rotations.filter((rotation) => {
              let deltas = matchingPairs.map(([left, right]) => {
                return math.subtract(math.multiply(rightProbe.coords[right], rotation), leftProbe.coords[left])
              })
              return _.isEqual(deltas.slice(0,3), deltas.slice(1,4)) // Good enough
            })[0]
            if (!correctRotation) {
              debugger
            }
            rightProbe.coords = rightProbe.coords.map((coord) => {
              try {

                return math.multiply(coord, correctRotation)
              } catch (e) {
                debugger
              }
            })
            let delta = math.subtract(rightProbe.coords[matchingPairs[0][1]], leftProbe.coords[matchingPairs[0][0]])
            rightProbe.coords = rightProbe.coords.map((coord) => {
              return math.subtract(coord, delta)
            })


            rightProbe.rotation = correctRotation
            rightProbe.translation = delta
            rightProbe.oriented = true

            orientedProbes.push(...unorientedProbes.splice(j,1))
            return true
          }
        }
      }
      return false
    }


    // console.log(getMatchingDistancePairs(probes[0].distances, probes[1].distances))


    function getMatchingDistancePairs(distancesA, distancesB) {
      let possiblePairs = {}
      for (let i=0; i<distancesA.length; i++) {
        for (let j=0; j<distancesB.length; j++) {
          if (distancesA[i].distance === distancesB[j].distance) {
            possiblePairs[str([distancesA[i].a, distancesB[j].a])] = (possiblePairs[str([distancesA[i].a, distancesB[j].a])] || 0) +1
            possiblePairs[str([distancesA[i].a, distancesB[j].b])] = (possiblePairs[str([distancesA[i].a, distancesB[j].b])] || 0) +1
            possiblePairs[str([distancesA[i].b, distancesB[j].a])] = (possiblePairs[str([distancesA[i].b, distancesB[j].a])] || 0) +1
            possiblePairs[str([distancesA[i].b, distancesB[j].b])] = (possiblePairs[str([distancesA[i].b, distancesB[j].b])] || 0) +1

          }
        }
      }
      let goodPairs = []
      for (let pair in possiblePairs) {
        if (possiblePairs[pair] >= 10) {
          goodPairs.push(JSON.parse(pair))
        }
      }
      return goodPairs
    }


    function getDistances(coords) {
      let distances = []
      for (let i=0; i<coords.length; i++) {
        for (let j=i+1; j<coords.length; j++) {
          if (i === j) continue
          distances.push({ a: i, b: j, distance: math.distance(coords[i], coords[j]) })
        }
      }
      distances.sort((d1, d2) => {
        return d1.distance-d2.distance
      })

      return distances
    }

    console.log({data})

    expose({data, getDistances, probes, getMatchingDistancePairs})

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