<template>
  <div id="app">
    <canvas ref="canvas"
            @mousedown="onMouseDown"
            @mouseup="onMouseUp"
            @mousemove="onMouseMove"
            @mouseenter="onMouseEnter"
            @mouseleave="onMouseLeave"
            @wheel="onMouseWheel"></canvas>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { SpaceObject } from '@/SpaceObject.js'
import { checkCollision, getGravitationalForce, resolveCollision, reverseVector } from '@/physics.js'

const canvas = ref(null)
const ctx = ref(null) // canvas context
const objects = ref([])
// const isDragging = ref(false)
// const dragStart = ref(null)
const pan = ref({ x: 0, y: 0 })
const center = ref({ x: 0, y: 0 })
const gravity = 2.0e-1

const devicePixelRatio = window.devicePixelRatio || 1 // for HiDPI displays

onMounted(() => {
  canvas.value.width = window.innerWidth * devicePixelRatio
  canvas.value.height = window.innerHeight * devicePixelRatio
  canvas.value.style.width = `${window.innerWidth}px`
  canvas.value.style.height = `${window.innerHeight}px`
  ctx.value = canvas.value.getContext('2d')
  ctx.value.scale(devicePixelRatio, devicePixelRatio)
  pan.value.x = -canvas.value.width / devicePixelRatio / 2
  pan.value.y = -canvas.value.height / devicePixelRatio / 2
  center.value = {...pan.value}
  initializeSpace()
})

const initializeSpace = () => {
  objects.value.push(new SpaceObject({ pos: { x: 50, y: 70 }, vel: {x: 1, y: 2} }))
  objects.value.push(new SpaceObject({ pos: { x: 150, y: 180 }, colors: { fill: 'red', stroke: 'black' }, radius: 50 }))
  loop()
}

const loop = () => {
  checkCollisions()
  objects.value.forEach(obj => obj.update())
  pan.value = { x: objects.value[0].pos.x + center.value.x, y: objects.value[0].pos.y + center.value.y }
  draw()
  requestAnimationFrame(loop)
}

const checkCollisions = () => {
  for (let i = 0; i < objects.value.length; i++) {
    const obj1 = objects.value[i]
    for (let j = i + 1; j < objects.value.length; j++) {
      const obj2 = objects.value[j]
      if (gravity) {
        const gravitationalForce = getGravitationalForce(obj1, obj2, gravity)
        obj1.addForce(gravitationalForce)
        obj2.addForce(reverseVector(gravitationalForce))
      }
      if (checkCollision(obj1, obj2)) {
        resolveCollision(obj1, obj2)
      }
    }
  }
}

const draw = () => {
  drawGrid()
  applyCanvasTransform()
  objects.value.forEach(obj => obj.draw(ctx.value))
  resetCanvasTransform()
  moveBackgroundGradient()
}

const applyCanvasTransform = () => {
  ctx.value.save()
  ctx.value.translate(-pan.value.x, -pan.value.y)
}

const resetCanvasTransform = () => {
  ctx.value.restore()
}

const moveBackgroundGradient = () => {
  canvas.value.style.background = `radial-gradient(circle at ${-pan.value.x}px ${-pan.value.y}px, #225, #050515, #001)`
}

const drawGrid = () => {
  const context = ctx.value
  const width = canvas.value?.width / devicePixelRatio
  const height = canvas.value?.height / devicePixelRatio
  const panx = pan.value.x
  const pany = pan.value.y

  const gridSize = 30
  const startX = Math.floor((-gridSize - (panx % gridSize)) * 2) / 2
  const startY = Math.floor((-gridSize - (pany % gridSize)) * 2) / 2
  const endX = Math.floor((width + gridSize * 2) * 2) / 2
  const endY = Math.floor((height + gridSize * 2) * 2) / 2
  context.clearRect(startX, startY, endX, endY)

  context.strokeStyle = '#444' // grid color
  context.lineWidth = 0.5

  // vertical lines
  for (let x = startX; x <= endX; x += gridSize) {
    context.beginPath()
    context.moveTo(x, startY)
    context.lineTo(x, endY)
    context.stroke()
  }
  // horizontal lines
  for (let y = startY; y <= endY; y += gridSize) {
    context.beginPath()
    context.moveTo(startX, y)
    context.lineTo(endX, y)
    context.stroke()
  }

}


</script>


<style scoped>

#app {
  //overflow: hidden;
  margin: 0;
  padding: 0;
}

canvas {
  display: block;
  background-color: #001;
  background: radial-gradient(circle at 0% 0%, #225, #001);
}
</style>
