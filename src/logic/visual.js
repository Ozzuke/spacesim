export const generateGradient = (ctx, colors, posV, radius) => {
    const gradient = ctx.createRadialGradient(posV.x, posV.y, 0, posV.x, posV.y, radius)
    gradient.addColorStop(0, colors.start)
    gradient.addColorStop(1, colors.end)
    return gradient
  }

 export const renderCanvas = (data) => {
  drawGridAndBackground(data)
  applyCanvasTransform(data)
  data.value.objects.forEach(obj => obj.draw(data.value.ctx))
  drawMapBorder(data)
  resetCanvasTransform(data)
  moveBackgroundGradient(data)
}


const applyCanvasTransform = (data) => {
  data.value.ctx.save()
  data.value.ctx.translate(-data.value.camera.posVec.x, -data.value.camera.posVec.y)
}

const resetCanvasTransform = (data) => {
  data.value.ctx.restore()
}

const moveBackgroundGradient = (data) => {
  data.value.canvas.style.background = `radial-gradient(circle at ${-data.value.camera.posVec.x}px ${-data.value.camera.posVec.y}px, #225, #050515, #001)`
}

const drawBackground = (data) => {
  const ctx = data.value.ctx
  const radius = (data.value.map.radius * 2) || 5000
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
  const pixel = 1 / radius
  gradient.addColorStop(0, '#3b2d7a')
  gradient.addColorStop(500 * pixel, '#1a1a3f')
  gradient.addColorStop(1, '#001')
  // draw circle
  ctx.beginPath()
  ctx.fillStyle = gradient
  ctx.arc(0, 0, data.value.map.radius * 2, 0, Math.PI * 2)
  ctx.fill()
}

const drawMapBorder = (data) => {
  const ctx = data.value.ctx
  const gradient = ctx.createRadialGradient(
    data.value.map.centerVec.x, data.value.map.centerVec.y, data.value.map.radius,
    data.value.map.centerVec.x, data.value.map.centerVec.y, data.value.map.radius * 6)
  gradient.addColorStop(0, 'rgba(0, 0, 16, 0)')
  gradient.addColorStop(0.1, 'rgba(0, 0, 16, 1)')
  gradient.addColorStop(1, 'rgba(0, 0, 16, 1)')
  // draw circle
  ctx.beginPath()
  ctx.arc(data.value.map.centerVec.x, data.value.map.centerVec.y, data.value.map.radius * 6, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()
}

const drawGridAndBackground = (data) => {
  const ctx = data.value.ctx
  const width = data.value.canvas?.width / data.value.devicePixelRatio
  const height = data.value.canvas?.height / data.value.devicePixelRatio
  const panx = data.value.camera.posVec.x
  const pany = data.value.camera.posVec.y

  let gridSize = 30
  const startX = Math.floor((-gridSize - (panx % gridSize)) * 2) / 2
  const startY = Math.floor((-gridSize - (pany % gridSize)) * 2) / 2
  const endX = Math.floor((width + gridSize * 2) * 2) / 2
  const endY = Math.floor((height + gridSize * 2) * 2) / 2
  ctx.clearRect(startX, startY, endX, endY)

  applyCanvasTransform(data)
  drawBackground(data)
  resetCanvasTransform(data)

  ctx.strokeStyle = '#666' // grid color
  ctx.lineWidth = 0.5

  // vertical lines
  for (let x = startX; x <= endX; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, startY)
    ctx.lineTo(x, endY)
    ctx.stroke()
  }
  // horizontal lines
  for (let y = startY; y <= endY; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(startX, y)
    ctx.lineTo(endX, y)
    ctx.stroke()
  }

}
