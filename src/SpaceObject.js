export class SpaceObject {
  constructor({
                name = null,
                pos = { x: 0, y: 0 },
                vel = { x: 0, y: 0 },
                radius = 30,
                density = 10,
                colors = { fill: null, stroke: null },
                props = {
                  affByGravity: true,
                  hasGravity: true,
                  static: false,
                  collidable: true,
                  onCollision: null,
                }
              } = {}) {
    this.name = name
    this.pos = pos
    this.vel = vel
    this.radius = radius
    this.density = density
    this.colors = colors
    this.props = props
    this.force = { x: 0, y: 0 }
  }

  getArea() {
    return Math.PI * this.radius * this.radius
  }

  getMass() {
    return this.density * this.getArea()
  }

  getVelocity() {
    return Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y)
  }

  getVelocityDirection() {
    return Math.atan2(this.vel.y, this.vel.x)
  }

  getForce() {
    return Math.sqrt(this.force.x * this.force.x + this.force.y * this.force.y)
  }

  getforceDirection() {
    return Math.atan2(this.force.y, this.force.x)
  }

  getMomentum() {
    return this.getMass() * this.getVelocity()
  }

  addForce(force) {
    this.force.x += force.x
    this.force.y += force.y
  }

  clearForce() {
    this.force.x = 0
    this.force.y = 0
  }

  applyForce() {
    this.vel.x += this.force.x / this.getMass()
    this.vel.y += this.force.y / this.getMass()
    this.clearForce()
  }

  move() {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
  }

  clearCollides() {
    this.collides = []
  }

  resolveColors() {
    let fill = this.colors.fill
    let stroke = this.colors.stroke
    if (!fill) {
      // based on density
      this.density < 50
        ? fill = `rgb(${150 - 3 * this.density}, 255, ${150 - 3 * this.density})`
        : fill = `rgb(0, ${255 - Math.min(150 * Math.log(this.density / 50) / Math.log(10), 150)}, 0)`
    }
    if (!stroke) {
      stroke = 'rgba(0, 0, 0, 0)'
    }
    return { fill, stroke }
  }

  draw(ctx) {
    const { fill: fillColor, stroke: strokeColor } = this.resolveColors()
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
    ctx.fillStyle = fillColor
    ctx.fill()
    ctx.strokeStyle = strokeColor
    ctx.stroke()
  }

  update() {
    this.applyForce()
    this.move()
  }
}
