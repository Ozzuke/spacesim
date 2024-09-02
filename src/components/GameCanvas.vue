<template>
    <canvas ref="canvas"
            tabindex="1"
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
import { ref, onMounted, onUnmounted } from 'vue'
import { Vec } from '@/logic/math.js'
import { calcAndSetCenterVec, setFocusOnCanvas, startGame } from '@/logic/game.js'

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
  resizeCanvas()
  window.addEventListener('blur', state.value.actions.onblur)
  window.addEventListener('resize', resizeCanvas)
  state.value.mounted.canvas = true
})

onUnmounted(() => {
  window.removeEventListener('blur', state.value.actions.onblur)
  window.removeEventListener('resize', resizeCanvas)
  state.value.mounted.canvas = false
})

const resizeCanvas = () => {
  canvas.value.width = window.innerWidth * data.value.devicePixelRatio
  canvas.value.height = window.innerHeight * data.value.devicePixelRatio
  canvas.value.style.width = `${window.innerWidth}px`
  canvas.value.style.height = `${window.innerHeight}px`
  ctx.value = canvas.value.getContext('2d')
  ctx.value.scale(data.value.devicePixelRatio, data.value.devicePixelRatio)
  calcAndSetCenterVec()
}

</script>


<style scoped>
  canvas {
    outline: none;
  }
</style>
