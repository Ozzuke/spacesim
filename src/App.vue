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
  gravity: 2.0e-3,
  map: {
    type: 'circle',
    radius: 3000,
    center: { x: 0, y: 0 },
    collisionType: 'smooth',
    outwardForce: 1
  }
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
  if (data.value.state === 'ship') {
    applyMouseForce(data.value.specials.ship, data.value.mouse)
  }
  checkCollisions(data.value.objects, data.value.gravity, data.value.map)
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
  drawGridAndBackground()
  applyCanvasTransform()
  data.value.objects.forEach(obj => obj.draw(ctx.value))
  drawMapBorder()
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

const drawBackground = () => {
  const context = ctx.value
  const radius = (data.value.map.radius * 2) || 5000
  const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius)
  const pixel = 1 / radius
  gradient.addColorStop(0, '#3b2d7a')
  gradient.addColorStop(500 * pixel, '#1a1a3f')
  gradient.addColorStop(1, '#001')
  // draw circle
  context.beginPath()
  context.fillStyle = gradient
  context.arc(0, 0, data.value.map.radius * 2, 0, Math.PI * 2)
  context.fill()
}

const drawMapBorder = () => {
  const context = ctx.value
  const gradient = context.createRadialGradient(
    data.value.map.center.x, data.value.map.center.y, data.value.map.radius,
    data.value.map.center.x, data.value.map.center.y, data.value.map.radius * 6)
  gradient.addColorStop(0, 'rgba(0, 0, 16, 0)')
  gradient.addColorStop(0.1, 'rgba(0, 0, 16, 1)')
  gradient.addColorStop(1, 'rgba(0, 0, 16, 1)')
  // draw circle
  context.beginPath()
  context.arc(data.value.map.center.x, data.value.map.center.y, data.value.map.radius * 6, 0, Math.PI * 2)
  context.fillStyle = gradient
  context.fill()
}

const drawGridAndBackground = () => {
  const context = ctx.value
  const width = canvas.value?.width / devicePixelRatio
  const height = canvas.value?.height / devicePixelRatio
  const panx = data.value.pan.x
  const pany = data.value.pan.y

  let gridSize = 30
  const startX = Math.floor((-gridSize - (panx % gridSize)) * 2) / 2
  const startY = Math.floor((-gridSize - (pany % gridSize)) * 2) / 2
  const endX = Math.floor((width + gridSize * 2) * 2) / 2
  const endY = Math.floor((height + gridSize * 2) * 2) / 2
  context.clearRect(startX, startY, endX, endY)

  applyCanvasTransform()
  drawBackground()
  resetCanvasTransform()

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
