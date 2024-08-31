import { Ship } from '@/Ship.js'

export const getDistance = (p1, p2 = { x: 0, y: 0 }) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

export const getDirection = (vec1) => {
  return Math.atan2(vec1.y, vec1.x)
}

export const getVector = (p1, p2) => {
  return {
    x: p2.x - p1.x,
    y: p2.y - p1.y
  }
}

export const reverseVector = (vector) => {
  return {
    x: -vector.x,
    y: -vector.y
  }
}

export const getNormalVector = (p1, p2) => {
  const distance = getDistance(p1, p2)
  return {
    x: (p2.x - p1.x) / distance || 0,
    y: (p2.y - p1.y) / distance || 0
  }
}

export const getTangentVector = (vector) => {
  return {
    x: -vector.y,
    y: vector.x
  }
}

export const convertVectorUsingNormal = (vector, normal) => {
  const tangent = getTangentVector(normal)
  return {
    x: vector.x * normal.x + vector.y * normal.y,
    y: vector.x * tangent.x + vector.y * tangent.y
  }
}

export const convertNormalToOriginal = (vector, normal) => {
  const tangent = getTangentVector(normal)
  return {
    x: vector.x * normal.x + vector.y * tangent.x,
    y: vector.x * normal.y + vector.y * tangent.y
  }
}

export const getGravitationalForce = (obj1, obj2, G = 1.0e-3) => {
  const distance = getDistance(obj1.pos, obj2.pos)
  const force = G * obj1.getMass() * obj2.getMass() / (distance * distance)
  const normalVector = getNormalVector(obj1.pos, obj2.pos)
  return {
    x: force * normalVector.x,
    y: force * normalVector.y
  }
}

export const applyMouseForce = (object, mouse) => {
  if (mouse.moved) {
    const maxDist = 500
    const distance = Math.min(getDistance(object.pos, mouse), maxDist)
    const force = Math.max(Math.log(distance / 100 + 1), 0) * object.mouseForceScale
    const normalVector = getNormalVector(object.pos, mouse)
    object.prevMouseForce = {
      x: force * normalVector.x,
      y: force * normalVector.y
    }
  }
  object.addForce(object.prevMouseForce)
}

export const checkCollision = (obj1, obj2) => {
  // check if close by x or y
  if (Math.abs(obj1.pos.x - obj2.pos.x) >= obj1.radius + obj2.radius
    || Math.abs(obj1.pos.y - obj2.pos.y) >= obj1.radius + obj2.radius) {
    return false
  }
  const dx = obj1.pos.x - obj2.pos.x
  const dy = obj1.pos.y - obj2.pos.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance < obj1.radius + obj2.radius
}

export const checkCollisions = (objects, gravity, map) => {
  for (let i = 0; i < objects.length; i++) {
    const obj1 = objects[i]
    for (let j = i + 1; j < objects.length; j++) {
      const obj2 = objects[j]
      if (gravity) {
        const gravitationalForce = getGravitationalForce(obj1, obj2, gravity)
        obj1.addForce(gravitationalForce)
        obj2.addForce(reverseVector(gravitationalForce))
      }
      if (checkCollision(obj1, obj2)) {
        resolveCollision(obj1, obj2)
      }
    }

    if (map.type === 'circle') {
      let amountOver = getDistance(obj1.pos, map.center) + obj1.radius - map.radius
      if (amountOver > 0) {
        const normal = getNormalVector(obj1.pos, map.center)
        if (!(obj1 instanceof Ship)) {
          amountOver = Math.pow(amountOver, 1.1)
          obj1.addForce({
            x: amountOver * normal.x * map.outwardForce / map.radius * 1.0e4,
            y: amountOver * normal.y * map.outwardForce / map.radius * 1.0e4
          })
          obj1.vel.x *= 0.99
          obj1.vel.y *= 0.99
        } else {
          let drag = Math.cos(getDirection(normal) - getDirection(obj1.vel))
          if (drag < 0) {
            if (amountOver >= map.radius / 2) {
              obj1.vel = {
                x: normal.x * Math.sqrt(map.radius) * 3.0e-1,
                y: normal.y * Math.sqrt(map.radius) * 3.0e-1
              }
            } else {
              drag = drag / map.radius
              obj1.vel.x /= 1 - drag * 2.0e-2 * Math.pow(amountOver, 1.5)
              obj1.vel.y /= 1 - drag * 2.0e-2 * Math.pow(amountOver, 1.5)
            }
          }
        }
      }
    }
  }
}

export const resolveCollision = (obj1, obj2) => {
  const normal = getNormalVector(obj1.pos, obj2.pos)
  const v1 = convertVectorUsingNormal(obj1.vel, normal)
  const v2 = convertVectorUsingNormal(obj2.vel, normal)
  const m1 = obj1.getMass()
  const m2 = obj2.getMass()
  const v1f = {
    x: (v1.x * (m1 - m2) + 2 * m2 * v2.x) / (m1 + m2),
    y: v1.y
  }
  const v2f = {
    x: (v2.x * (m2 - m1) + 2 * m1 * v1.x) / (m1 + m2),
    y: v2.y
  }
  obj1.vel = convertNormalToOriginal(v1f, normal)
  obj2.vel = convertNormalToOriginal(v2f, normal)

  // dampen the velocity
  const dampen = 0.99
  obj1.vel.x *= dampen
  obj1.vel.y *= dampen
  obj2.vel.x *= dampen
  obj2.vel.y *= dampen

  // move the objects so they don't overlap
  const overlap = obj1.radius + obj2.radius - getDistance(obj1.pos, obj2.pos)
  if (overlap > 0) {
    const correctionFactor = 0.5
    const correction = overlap * correctionFactor

    obj1.pos.x -= correction * normal.x
    obj1.pos.y -= correction * normal.y
    obj2.pos.x += correction * normal.x
    obj2.pos.y += correction * normal.y
  }
}
