import { SpaceObject } from '@/SpaceObject.js'

export class Ship extends SpaceObject {
  constructor({
                pos = { x: 0, y: 0 },
                radius = 10,
                density = 50,
                colors = { fill: 'red', stroke: 'gray', flame: 'yellow' }
              } = {}) {
    super({ pos, radius, density, colors })
    this.lastDirection
    this.mouseForceScale = 1
    this.prevMouseForce = { x: 0, y: 0 }
  }

  draw(ctx) {
    const { fill, stroke, flame } = this.colors
    const { x, y } = this.pos
    const r = this.radius
    const velDirection = this.getVelocityDirection()
    const direction = velDirection

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(direction + Math.PI / 2)

    ctx.fillStyle = fill
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1

    // draw ship as a triangle
    const xPoints = [0, 1.5 * r, -1.5 * r]
    const yPoints = [-2.5 * r, r, r]
    const points = xPoints.map((x, i) => ({ x, y: yPoints[i] }))
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    ctx.lineTo(points[1].x, points[1].y)
    ctx.lineTo(points[2].x, points[2].y)
    ctx.lineTo(points[0].x, points[0].y)
    ctx.fill()
    ctx.stroke()

    ctx.restore()
  }
}
