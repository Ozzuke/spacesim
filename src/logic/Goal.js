import { SpaceObject } from '@/logic/SpaceObject.js'
import { Vec } from '@/logic/math.js'
import { useDataTracker } from '@/logic/states.js'
import { onGoal } from '@/logic/game.js'

export class Goal extends SpaceObject {
  constructor({
                posVec = new Vec(30, -300),
                radius = 50,
    density = -1,
                colors = { fillStyle: 'blue', strokeStyle: 'black' },
                angularVel = 0.1,
                props = {
                  isStatic: true,
                  isCollidable: true,
                  hasGravity: false,
                  hitboxShape: 'circle',
                  type: 'goal',
                }
              } = {}) {
    super({ posVec, radius, colors, angularVel, props, density })
    this.image = new Image()
    this.image.src = 'assets/goal.png'
    this.props.onCollision = this.onCollision

    const {
      data
    } = useDataTracker()
    this.data = data
  }

  onCollision(obj) {
    if (obj.props.type === 'ball') {
      onGoal()
    }
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
