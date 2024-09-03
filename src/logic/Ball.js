import { SpaceObject } from '@/logic/SpaceObject.js'
import { Vec } from '@/logic/math.js'

export class Ball extends SpaceObject {
  constructor({
                name = 'ball',
                posVec,
                velVec,
                radius = 25,
                density = 1,
                angle = 0,
                angularVel = 0,
                colors = {
                  fillStyle: '#fff',
                  strokeStyle: '#000',
                  strokeWidth: 0.5,
                  centerColor: '#ff0',
                  centerRadiusPercent: 0.35,
                  ballSections: 6,
                  sectionStartHue: 30,
                  sectionEndHue: 420
                },
                props = {
                  type: 'ball'
                }
              } = {}) {
    super({ name, posVec, velVec, radius, density, angle, angularVelocity: angularVel, colors, props })
  }

  draw(ctx) {
    let { x, y } = this.posVec
    const radius = this.radius
    const colors = this.colors
    const sectionAngle = Math.PI * 2 / colors.ballSections
    const hues = []
    for (let i = 0; i < colors.ballSections; i++) {
      hues.push(colors.sectionStartHue + Math.round((colors.sectionEndHue - colors.sectionStartHue) / colors.ballSections * i))
    }

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(this.angle)
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.fillStyle = colors.fillStyle
    ctx.fill()
    ctx.strokeStyle = colors.strokeStyle
    ctx.lineWidth = colors.strokeWidth
    colors.strokeWidth && ctx.stroke()

    for (let i = 0; i < colors.ballSections; i++) {
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, radius, i * sectionAngle, (i + 1) * sectionAngle)
      ctx.fillStyle = `hsl(${hues[i]}, 100%, 50%)`
      ctx.fill()
      colors.strokeWidth && ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(0, 0, radius * colors.centerRadiusPercent, 0, Math.PI * 2)
    ctx.fillStyle = colors.centerColor
    ctx.fill()
    colors.strokeWidth && ctx.stroke()

    ctx.restore()
  }
}
