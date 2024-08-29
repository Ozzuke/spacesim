export const getDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
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
    x: (p2.x - p1.x) / distance,
    y: (p2.y - p1.y) / distance
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

export const getGravitationalForce = (obj1, obj2, G=1.0e-3) => {
  const distance = getDistance(obj1.pos, obj2.pos)
  const force = G * obj1.getMass() * obj2.getMass() / (distance * distance)
  const normalVector = getNormalVector(obj1.pos, obj2.pos)
  return {
    x: force * normalVector.x,
    y: force * normalVector.y
  }
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
  const move = overlap / 2
  obj1.pos.x -= move * normal.x
  obj1.pos.y -= move * normal.y
  obj2.pos.x += move * normal.x
  obj2.pos.y += move * normal.y
}
