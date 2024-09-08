import { Vec } from '@/logic/math.js'

export class SpaceObject {
  constructor({
                name = null,
                posVec = null,
                velVec = null,
                radius = 30,
                density = 10,
                angle = 0,
                angularVel = 0,
                colors = null,
                props = null
              } = {}) {
    this.name = name
    this.posVec = posVec || new Vec(0, 0)
    this.velVec = velVec || new Vec(0, 0)
    this.radius = radius || 30
    this.density = density || 10
    this.angle = angle || 0
    this.angularVel = angularVel || 0
    this.colors = colors || { fillStyle: null, strokeStyle: null }
    this.props = props || {}
    this.forceVec = new Vec(0, 0)

    this.resolveProps()

  }

  resolveProps() {
    const defaultProps = {
      isAffByGravity: true,
      hasGravity: true,
      isStatic: false,
      isCollidable: true,
      hitboxShape: 'circle',
      onCollision: null,
      rotates: true,
      type: 'default'
    }
    for (const propsKey in defaultProps) {
      if (!(propsKey in this.props)) {
        this.props[propsKey] = defaultProps[propsKey]
      }
    }
  }

  getArea() {
    return Math.PI * this.radius * this.radius
  }

  getMass() {
    return this.density * this.getArea()
  }

  getVelocity() {
    return this.velVec.getMagnitude()
  }

  getVelocityDirection() {
    return this.velVec.getDirection()
  }

  getForce() {
    return this.forceVec.getMagnitude()
  }

  getForceDirection() {
    return this.forceVec.getDirection()
  }

  getMomentum() {
    return this.getMass() * this.getVelocity()
  }
  addForce(force) {
    this.forceVec = this.forceVec.add(force)
  }

  clearForce() {
    this.forceVec = new Vec(0, 0)
  }

  applyForce() {
    this.velVec = this.velVec.add(this.forceVec.divide(this.getMass()))
    this.clearForce()
  }

  move() {
    this.posVec = this.posVec.add(this.velVec)
  }

  update() {
    this.applyForce()
    this.move()
    this.angle += this.angularVel
    this.angle %= Math.PI * 2
  }

  draw(ctx) {
    const { fillStyle, strokeStyle } = this.resolveColors()
    ctx.beginPath()
    ctx.arc(this.posVec.x, this.posVec.y, this.radius, 0, 2 * Math.PI)
    ctx.fillStyle = fillStyle
    ctx.fill()
    ctx.strokeStyle = strokeStyle
    ctx.stroke()
  }

  resolveColors() {
    let fill = this.colors.fillStyle
    let stroke = this.colors.strokeStyle
    if (!fill) {
      // based on density
      // density 0 - 50: whiteish green to green
      // density 50 - 500: green to dark green
      this.density < 50
        ? fill = `rgb(${150 - 3 * this.density}, 255, ${150 - 3 * this.density})`
        : fill = `rgb(0, ${255 - Math.min(150 * Math.log(this.density / 50) / Math.log(10), 150)}, 0)`
    }
    if (!stroke) {
      stroke = 'rgba(0, 0, 0, 0)'
    }
    return { fillStyle: fill, strokeStyle: stroke }
  }
}
