import { Vec } from '@/logic/math.js'

export class GameMap {
  constructor({
                type = 'circle',
                width,
                height,
                radius = 3.0e3,
                centerVec = new Vec(0, 0),
                color = '#000',
                collisionType = {
                  default: 'smooth-bounce',
                  ship: 'slow'
                }
              } = {}) {
    this.type = type
    this.width = width
    this.height = height
    this.radius = radius
    this.centerVec = centerVec
    this.color = color
    this.collisionType = collisionType
  }
}
