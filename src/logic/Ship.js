import { SpaceObject } from '@/logic/SpaceObject.js'
import { Vec } from '@/logic/math.js'
import { useDataTracker } from '@/logic/states.js'
import tinycolor from 'tinycolor2'
import { generateGradient } from '@/logic/visual.js'

export class Ship extends SpaceObject {
  constructor({
                name = 'ship',
                posV = new Vec(0, 0),
                velV = new Vec(0, 0),
                radius = 10,
                density = 400,
                colors = {
                  fillStyle: null,
                  strokeStyle: 'black',
                  flameFillStyle: null,
                  flameStrokeStyle: null,
                  thrusterFillStyle: 'gray',
                  thrusterStrokeStyle: tinycolor('black')
                },
                props = {
                  type: 'ship'
                }
              } = {}) {
    super({ name, posV, velV, radius, density, colors, props })

    const {
      data
    } = useDataTracker()
    this.data = data
  }

  draw(ctx) {
    const {
      fillStyle,
      strokeStyle,
      flameFillStyle,
      flameStrokeStyle,
      thrusterFillStyle,
      thrusterStrokeStyle
    } = this.colors
    const { x, y } = this.posVec
    const r = this.radius
    const flameLength = 1.5 + Math.random() * this.data.mouse.forceVec.getMagnitude() / 5
    this.resolveColors(ctx, flameLength)

    const direction = this.data.mouse.forceVec.getMagnitude()
      ? this.data.mouse.forceVec.getDirection()
      : this.getVelocityDirection()

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(direction + Math.PI / 2)

    ctx.lineWidth = 1

    // draw flickering ship glow
    // generate gradient
    const glowRadius = 10 + 20 * Math.random() + Math.sqrt(10 * (0.5 + 0.5 * Math.random()) * r * this.data.mouse.forceVec.getMagnitude()) //  / (this.density)
    const gradient = ctx.createRadialGradient(0, 1.3 * r, 0, 0, 1.3 * r, glowRadius)
    gradient.addColorStop(0, 'rgba(255,155,0,0.15)')
    gradient.addColorStop(0.5, 'rgba(255,255,133,0.05)')
    gradient.addColorStop(1, 'rgba(255,255,133,0)')
    // draw circle
    ctx.beginPath()
    ctx.fillStyle = gradient
    ctx.arc(0, 1.3 * r, glowRadius, 0, Math.PI * 2)
    ctx.fill()

    // draw ship as a triangle
    // fill as gradient from fill to black
    ctx.fillStyle = fillStyle
    ctx.strokeStyle = strokeStyle
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
    ctx.fillStyle = flameFillStyle
    ctx.strokeStyle = flameStrokeStyle
    xPoints = [0, 0.5 * r, -0.5 * r]
    yPoints = [flameLength * r, r, r]
    points = xPoints.map((x, i) => ({ x, y: yPoints[i] }))
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    ctx.lineTo(points[1].x, points[1].y)
    ctx.lineTo(points[2].x, points[2].y)
    ctx.lineTo(points[0].x, points[0].y)
    ctx.fill()
    flameStrokeStyle && ctx.stroke()

    // draw engine
    ctx.fillStyle = thrusterFillStyle
    ctx.strokeStyle = thrusterStrokeStyle
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

  resolveColors(ctx, flameLength) {
    if (!this.colors.fillStyle) {
      this.colors.fillStyle = generateGradient(
        ctx,
        { start: 'red', end: '#200' },
        new Vec(0, -2.5 * this.radius),
        this.radius * 5)
    }
    if (!this.colors.strokeStyle) {
      this.colors.strokeStyle = 'black'
    }
    if (!this.colors.flameFillStyle) {
      this.colors.flameFillStyle = generateGradient(
        ctx,
        { start: 'rgba(255,205,0,0.9)', end: 'rgba(255,100,0,0.4)' },
        new Vec(0, 1.5 * this.radius),
        this.radius * flameLength)
    }
    if (!this.colors.thrusterFillStyle) {
      this.colors.thrusterFillStyle = 'gray'
    }
    if (!this.colors.thrusterStrokeStyle) {
      this.colors.thrusterStrokeStyle = 'black'
    }
  }
}
