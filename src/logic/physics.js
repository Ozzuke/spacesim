import { Vec } from '@/logic/math.js'

export const getGravitationalForce = (obj1, obj2, G = 1.0e-3) => {
  const distance = obj1.posVec.getDistanceTo(obj2.posVec)
  const force = G * obj1.getMass() * obj2.getMass() / (distance * distance)
  const normal = obj1.posVec.getNormalTo(obj2.posVec)
  return normal.multiply(force)
}

export const applyMouseForce = (obj, data) => {
  if (data.value.mouse.isMoved) {
    const maxDist = data.value.physics.maxMouseDistance
    const distance = Math.min(obj.posVec.getDistanceTo(data.value.mouse.posVec), maxDist)
    const force = Math.max(Math.log(distance / 100 + 1), 0) * data.value.physics.mouseForceMultiplier
    const normal = obj.posVec.getNormalTo(data.value.mouse.posVec)
    data.value.mouse.forceVec = normal.multiply(force)
  }
  obj.addForce(data.value.mouse.forceVec.multiply(obj.density))
}

export const checkCollision = (obj1, obj2) => {
  if (obj1 === obj2 || !obj1.props.isCollidable || !obj2.props.isCollidable) {
    return false
  }
  if (obj1.props.hitboxShape === 'circle' && obj2.props.hitboxShape === 'circle') {
    return obj1.posVec.getDistanceTo(obj2.posVec) < obj1.radius + obj2.radius
  }
}

export const resolveMapCollision = (obj, data) => {
  if (!data.value.map || !obj.props.isCollidable || obj.props.isStatic) {
    return
  }
  const collisionType = data.value.map.collisionType[obj.props.type] || data.value.map.collisionType.default
  if (data.value.map.type === 'circle') {
    if (obj.props.hitboxShape === 'circle') {
      const amountOver = obj.posVec.getDistanceTo(data.value.map.centerVec) + obj.radius - data.value.map.radius
      if (amountOver > 0) {
        const normalV = obj.posVec.getNormalTo(data.value.map.centerVec)

        if (collisionType === 'smooth-bounce') {
          const amountOverMultiplier = Math.pow(amountOver, 1.1)
          obj.addForce(normalV.multiply(amountOverMultiplier * data.value.physics.mapOutwardForce / data.value.map.radius))
          obj.velVec = obj.velVec.divide(1 + data.value.physics.mapCollisionDamping)
        } else if (collisionType === 'slow') {
          let drag = Math.cos(normalV.getDirection() - obj.velVec.getDirection())
          if (drag < 0) {
            if (amountOver >= data.value.map.radius / 2) {
              // bounce back if too far over border
              obj.velVec = normalV.multiply(Math.sqrt(data.value.map.radius) * 3.0e-1)
            } else {
              drag = drag / data.value.map.radius
              obj.velVec = obj.velVec.divide(1 - drag * data.value.physics.mapSlowingForce * Math.pow(amountOver, 1.5))
            }
          }
        }
      }
    }
  }
}

export const resolveCollisionBetweenCircles = (obj1, obj2, data) => {
  const m1 = obj1.getMass()
  const m2 = obj2.getMass()
  const normal = obj1.posVec.getNormalTo(obj2.posVec)
  const vel1normal = obj1.velVec.convertUsingNormal(normal)
  const vel2normal = obj2.velVec.convertUsingNormal(normal)
  const vel1afterX = (vel1normal.x * (m1 - m2) + 2 * m2 * vel2normal.x) / (m1 + m2)
  const vel2afterX = (vel2normal.x * (m2 - m1) + 2 * m1 * vel1normal.x) / (m1 + m2)
  const vel1after = new Vec(vel1afterX, vel1normal.y)
  const vel2after = new Vec(vel2afterX, vel2normal.y)
  let vel1final = vel1after.convertNormalToOriginal(normal)
  let vel2final = vel2after.convertNormalToOriginal(normal)
  vel1final = vel1final.divide(1 + data.value.physics.collisionDamping)
  vel2final = vel2final.divide(1 + data.value.physics.collisionDamping)
  obj1.velVec = vel1final
  obj2.velVec = vel2final

  // move objects apart so they don't collide again
  const overlap = obj1.radius + obj2.radius - obj1.posVec.getDistanceTo(obj2.posVec)
  if (overlap > 0) {
    let correction = overlap / 2
    if (!obj1.props.isStatic && !obj2.props.isStatic) {
      obj1.posVec = obj1.posVec.subtract(normal.multiply(correction))
      obj2.posVec = obj2.posVec.add(normal.multiply(correction))
    } else if (!obj1.props.isStatic) {
      correction *= 2
      obj1.posVec = obj1.posVec.subtract(normal.multiply(correction))
    } else if (!obj2.props.isStatic) {
      correction *= 2
      obj2.posVec = obj2.posVec.add(normal.multiply(correction))
    }
  }
}

export const checkCollisions = (data) => {
  const objects = data.value.objects
  for (let i = 0; i < objects.length; i++) {
    const obj1 = objects[i]
    for (let j = i + 1; j < objects.length; j++) {
      const obj2 = objects[j]
      if (obj1.props.isCollidable && obj2.props.isCollidable && checkCollision(obj1, obj2)) {
        if (obj1.props.hitboxShape === 'circle' && obj2.props.hitboxShape === 'circle') {
          resolveCollisionBetweenCircles(obj1, obj2, data)
        } else {
          console.error('Unsupported hitbox shape')
        }
        if (obj1.props.onCollision) {
          obj1.props.onCollision(obj2)
        }
        if (obj2.props.onCollision) {
          obj2.props.onCollision(obj1)
        }
      }
      if (data.value.physics.gravity) {
        const gravitationalForce = getGravitationalForce(obj1, obj2, data.value.physics.gravity)
        obj1.props.isAffByGravity && obj1.addForce(gravitationalForce)
        obj2.props.isAffByGravity && obj2.addForce(gravitationalForce.multiply(-1))
      }
    }
    if (data.value.map) {
      resolveMapCollision(obj1, data)
    }
  }
}
