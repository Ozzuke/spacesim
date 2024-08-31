import { SpaceObject } from '@/SpaceObject.js'
import { getDistance } from '@/physics.js'

export class Ship extends SpaceObject {
  constructor({
                pos = { x: 0, y: 0 },
                radius = 10,
                density = 400,
                colors = { fill: null, stroke: 'black', flame: null, flameStroke: null }
              } = {}) {
    super({ pos, radius, density, colors })
    this.mouseForceScale = 40 * this.density
    this.prevMouseForce = { x: 0, y: 0 }
  }

  generateGradient(ctx, colors, pos, radius) {
    const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius)
    gradient.addColorStop(0, colors.start)
    gradient.addColorStop(1, colors.end)
    return gradient
  }

  draw(ctx) {
    const { fill, stroke, flame, flameStroke } = this.colors
    const { x, y } = this.pos
    const r = this.radius
    const flameLength = (1.5 + Math.random() * getDistance(this.prevMouseForce) / (5 * this.density))
    if (!fill) {
      this.colors.fill = this.generateGradient(ctx, { start: 'red', end: '#200' }, {x: 0, y: -2.5 * r}, this.radius * 5)
    }
      this.colors.flame = this.generateGradient(ctx, { start: 'rgba(255,205,0,0.9)', end: 'rgba(255,100,0,0.4)' }, {x: 0, y: 1.5 * r}, this.radius * flameLength)

    const velDirection = this.getVelocityDirection()
    let mouseDirection = null
    if (this.prevMouseForce.x || this.prevMouseForce.y) {
      mouseDirection = Math.atan2(this.prevMouseForce.y, this.prevMouseForce.x)
    }
    const direction = (mouseDirection !== null) ? mouseDirection : velDirection

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(direction + Math.PI / 2)

    ctx.lineWidth = 1

    // draw ship as a triangle
    // fill as gradient from fill to black
    ctx.fillStyle = fill
    ctx.strokeStyle = stroke
    let xPoints = [0, 1.5 * r, -1.5 * r]
    let yPoints = [-2.5 * r, r, r]
    let points = xPoints.map((x, i) => ({ x, y: yPoints[i] }))
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    ctx.lineTo(points[1].x, points[1].y)
    ctx.lineTo(points[2].x, points[2].y)
    ctx.lineTo(points[0].x, points[0].y)
    ctx.fill()
    ctx.stroke()

    // draw flame
    ctx.fillStyle = flame
    ctx.strokeStyle = flameStroke
    xPoints = [0, 0.5 * r, -0.5 * r]
    yPoints = [flameLength * r, r, r]
    points = xPoints.map((x, i) => ({ x, y: yPoints[i] }))
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    ctx.lineTo(points[1].x, points[1].y)
    ctx.lineTo(points[2].x, points[2].y)
    ctx.lineTo(points[0].x, points[0].y)
    ctx.fill()
    flameStroke ? ctx.stroke() : null

    // draw engine
    ctx.fillStyle = 'gray'
    ctx.strokeStyle = 'black'
    xPoints = [0.75 * r, 0.5 * r, -0.5 * r, -0.75 * r]
    yPoints = [r, 1.3 * r, 1.3 * r, r]
    points = xPoints.map((x, i) => ({ x, y: yPoints[i] }))
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    ctx.lineTo(points[1].x, points[1].y)
    ctx.lineTo(points[2].x, points[2].y)
    ctx.lineTo(points[3].x, points[3].y)
    ctx.lineTo(points[0].x, points[0].y)
    ctx.fill()
    ctx.stroke()

    ctx.restore()
  }
}
