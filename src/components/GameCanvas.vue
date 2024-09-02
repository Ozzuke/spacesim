<template>
  <canvas ref="canvas"
          @mousedown="state.actions.onmousedown"
          @mouseup="state.actions.onmouseup"
          @mousemove="state.actions.onmousemove"
          @mouseenter="state.actions.onmouseenter"
          @mouseleave="state.actions.onmouseleave"
          @wheel="state.actions.onwheel"
          @keydown="state.actions.onkeydown"
    >
  </canvas>
</template>


<script setup>
import { useDataTracker, useStateTracker } from '@/logic/states.js'
import { ref, onMounted } from 'vue'
import { Vec } from '@/logic/math.js'
import { startGame } from '@/logic/game.js'

const {
  state,
  isVisible,
  setVisible,
  addVisible,
  removeVisible,
  isGameMode,
  setGameMode,
  addGameMode,
  removeGameMode,
  setAction,
  getAction
} = useStateTracker()
const {
  data
} = useDataTracker()

const canvas = ref(null)
const ctx = ref(null)
data.value.canvas = canvas
data.value.ctx = ctx

onMounted(() => {
  data.value.devicePixelRatio = window.devicePixelRatio || 1
  canvas.value.width = window.innerWidth * data.value.devicePixelRatio
  canvas.value.height = window.innerHeight * data.value.devicePixelRatio
  canvas.value.style.width = `${window.innerWidth}px`
  canvas.value.style.height = `${window.innerHeight}px`
  ctx.value = canvas.value.getContext('2d')
  ctx.value.scale(data.value.devicePixelRatio, data.value.devicePixelRatio)
  data.value.camera.posVec = new Vec(
    -canvas.value.width / data.value.devicePixelRatio / 2,
    -canvas.value.height / data.value.devicePixelRatio / 2)
  data.value.centerVec = new Vec(data.value.camera.posVec)
  startGame()
})

</script>


<style scoped>

</style>
