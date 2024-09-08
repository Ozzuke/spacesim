import { SpaceObject } from '@/logic/SpaceObject.js'
import { Vec } from '@/logic/math.js'

export class Goal extends SpaceObject {
  constructor({
                posVec = new Vec(30, -300),
                radius = 50,
                colors = { fillStyle: 'blue', strokeStyle: 'black' },
                angularVel = 0.1,
                props = {
                  isStatic: true,
                  isCollidable: true,
                  hasGravity: false,
                  hitboxShape: 'circle',
                  type: 'goal'
                }
              } = {}) {
    super({ posVec, radius, colors, angularVel, props })
    this.image = new Image()
    this.image.src = 'assets/goal.png'
  }

  update() {
    this.angle += this.angularVel
    this.angle %= Math.PI * 2
  }

  draw(ctx) {
    try {
      ctx.drawImage(this.image, this.posVec.x - this.radius, this.posVec.y - this.radius, this.radius * 2, this.radius * 2)
    } catch (e) {
      super.draw(ctx)
    }
  }
}
