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
import { applyMouseForce, checkCollisions } from '@/physics.js'
import { Ship } from '@/Ship.js'

const canvas = ref(null)
const ctx = ref(null)
const devicePixelRatio = window.devicePixelRatio || 1 // for HiDPI displays
const data = ref({
  state: 'idle',
  isDragging: false,
  dragStart: null,
  objects: [],
  lockOn: null,
  specials: {
    ship: new Ship()
  },
  pan: { x: 0, y: 0 },
  center: { x: 0, y: 0 },
  mouse: { x: 0, y: 0, moved: false },
  frame: 0,
  gravity: 2.0e-3
})


onMounted(() => {
  canvas.value.width = window.innerWidth * devicePixelRatio
  canvas.value.height = window.innerHeight * devicePixelRatio
  canvas.value.style.width = `${window.innerWidth}px`
  canvas.value.style.height = `${window.innerHeight}px`
  ctx.value = canvas.value.getContext('2d')
  ctx.value.scale(devicePixelRatio, devicePixelRatio)
  data.value.pan.x = -canvas.value.width / devicePixelRatio / 2
  data.value.pan.y = -canvas.value.height / devicePixelRatio / 2
  data.value.center = {...data.value.pan}
  initializeSpace()
})

const initializeSpace = () => {
  data.value.objects.push(new SpaceObject({ pos: { x: 50, y: 70 }, vel: {x: 1, y: 2} }))
  data.value.objects.push(new SpaceObject({ pos: { x: -50, y: 300 }, vel: {x: 0, y: 0}, density: 50 }))
  data.value.objects.push(new SpaceObject({ pos: { x: 150, y: 180 }, colors: { fill: 'red', stroke: 'black' }, radius: 50 }))

  data.value.objects.push(data.value.specials.ship)
  data.value.state = 'ship'
  data.value.lockOn = data.value.specials.ship.pos
  loop()
}

const loop = () => {
  checkCollisions(data.value.objects, data.value.gravity)
  if (data.value.state === 'ship') {
    applyMouseForce(data.value.specials.ship, data.value.mouse)
  }
  data.value.objects.forEach(obj => obj.update())
  changePan(data.value.lockOn || { x: 0, y: 0 })
  draw()
  data.value.mouse.moved = false
  data.value.frame++
  requestAnimationFrame(loop)
}

const onMouseMove = (e) => {
  data.value.mouse = {
    x: e.offsetX + data.value.pan.x,
    y: e.offsetY + data.value.pan.y,
    moved: true
  }
}

const draw = () => {
  drawGrid()
  applyCanvasTransform()
  data.value.objects.forEach(obj => obj.draw(ctx.value))
  resetCanvasTransform()
  moveBackgroundGradient()
}

const changePan = (pos) => {
  data.value.pan = {
    x: pos.x + data.value.center.x,
    y: pos.y + data.value.center.y }
}

const applyCanvasTransform = () => {
  ctx.value.save()
  ctx.value.translate(-data.value.pan.x, -data.value.pan.y)
}

const resetCanvasTransform = () => {
  ctx.value.restore()
}

const moveBackgroundGradient = () => {
  canvas.value.style.background = `radial-gradient(circle at ${-data.value.pan.x}px ${-data.value.pan.y}px, #225, #050515, #001)`
}

const drawGrid = () => {
  const context = ctx.value
  const width = canvas.value?.width / devicePixelRatio
  const height = canvas.value?.height / devicePixelRatio
  const panx = data.value.pan.x
  const pany = data.value.pan.y

  const gridSize = 30
  const startX = Math.floor((-gridSize - (panx % gridSize)) * 2) / 2
  const startY = Math.floor((-gridSize - (pany % gridSize)) * 2) / 2
  const endX = Math.floor((width + gridSize * 2) * 2) / 2
  const endY = Math.floor((height + gridSize * 2) * 2) / 2
  context.clearRect(startX, startY, endX, endY)

  context.strokeStyle = '#666' // grid color
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
