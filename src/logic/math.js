export class Vec { // vector class
  constructor(x, y) {
    if (x instanceof Vec) {
      this.x = x.x
      this.y = x.y
    } else {
      this.x = x
      this.y = y
    }
  }

  add(toAdd) {
    if (toAdd instanceof Vec) {
      return new Vec(this.x + toAdd.x, this.y + toAdd.y)
    } else {
      return new Vec(this.x + toAdd, this.y + toAdd)
    }
  }

  subtract(toSubtract) {
    if (toSubtract instanceof Vec) {
      return new Vec(this.x - toSubtract.x, this.y - toSubtract.y)
    } else {
      return new Vec(this.x - toSubtract, this.y - toSubtract)
    }
  }

  multiply(toMultiply) {
    if (toMultiply instanceof Vec) {
      return new Vec(this.x * toMultiply.x, this.y * toMultiply.y)
    } else {
      return new Vec(this.x * toMultiply, this.y * toMultiply)
    }
  }

  divide(toDivide) {
    if (toDivide instanceof Vec) {
      return new Vec(this.x / toDivide.x, this.y / toDivide.y)
    } else {
      return new Vec(this.x / toDivide, this.y / toDivide)
    }
  }

  cross(toCross) {
    if (toCross instanceof Vec) {
      return this.x * toCross.y - this.y * toCross.x;
    } else {
      throw new Error("Argument must be an instance of Vec");
    }
  }

  rotate(angle) {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return new Vec(this.x * cos - this.y * sin, this.x * sin + this.y * cos)
  }

  getMagnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  getDistance() {
    return this.getMagnitude()
  }

  getDistanceTo(vec) {
    return this.getVectorTo(vec).getDistance()
  }

  getVectorTo(vec) {
    return new Vec(vec.x - this.x, vec.y - this.y)
  }

  getDirection() {
    return Math.atan2(this.y, this.x)
  }

  getDirectionTo(vec) {
    return this.getVectorTo(vec).getDirection()
  }

  getAngleBetween(vec) {
    return this.getDirectionTo(vec) - this.getDirection()
  }

  getNormal() {
    const distance = this.getDistance()
    return new Vec(this.x / distance || 0, this.y / distance || 0)
  }

  getNormalTo(vec) {
    return this.getVectorTo(vec).getNormal()
  }

  getTangent() {
    return new Vec(-this.y, this.x)
  }

  reverse() {
    return new Vec(-this.x, -this.y)
  }

  convertUsingNormal(normal) {
    const tangent = normal.getTangent()
    return new Vec(
      this.x * normal.x + this.y * normal.y,
      this.x * tangent.x + this.y * tangent.y
    )
  }

  convertNormalToOriginal(normal) {
    const tangent = normal.getTangent()
    return new Vec(
      this.x * normal.x + this.y * tangent.x,
      this.x * normal.y + this.y * tangent.y
    )
  }
}
