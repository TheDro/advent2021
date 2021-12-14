<script>
import {reactive} from 'vue'
import Day from '../days/day14.vue'

export default {
  components: {Day}
}
</script>

<template>
  <h2>Advent Calendar 2021</h2>
  <Day/>
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
