import { SpaceObject } from '@/SpaceObject.js'

export class Ship extends SpaceObject {
  constructor({
                pos = { x: 0, y: 0 },
                radius = 30,
                density = 1,
                colors = { fill: 'red', stroke: 'gray', flame: 'yellow' }
              } = {}) {
    super({ pos, radius, density, colors })
  }
}
