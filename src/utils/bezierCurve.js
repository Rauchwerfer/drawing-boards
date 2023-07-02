const line = (pointA, pointB) => {
  const lengthX = pointB.x - pointA.x
  const lengthY = pointB.y - pointA.y
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  };
}

const controlPoint = (controlPoints) => {
  const current = controlPoints.current,
      next = controlPoints.next,
      previous = controlPoints.previous,
      reverse = controlPoints.reverse
  const p = previous || current
  const n = next || current
  const smoothing = 0.2
  const o = line(p, n)
  const angle = o.angle + (reverse ? Math.PI : 0)
  const length = o.length * smoothing
  const x = current.x + Math.cos(angle) * length
  const y = current.y + Math.sin(angle) * length
  return [x, y]
}

const bezierCommand = (point, i, a) => {
  //console.log(point)
  //console.log(i)
  //console.log(a)
  let cpsX = null
  let cpsY = null

  switch (i) {
    case 0:
      const _controlPoint = controlPoint({
        current: point
      })

      cpsX = _controlPoint[0]
      cpsY = _controlPoint[1]
      break

    case 1:
      const _controlPoint2 = controlPoint({
        current: a[i - 1],
        next: point
      });

      cpsX = _controlPoint2[0]
      cpsY = _controlPoint2[1]
      break

    default:
      const _controlPoint3 = controlPoint({
        current: a[i - 1],
        previous: a[i - 2],
        next: point
      });

      cpsX = _controlPoint3[0]
      cpsY = _controlPoint3[1]
      break
  }

  const _controlPoint4 = controlPoint({
    current: point,
    previous: a[i - 1],
    next: a[i + 1],
    reverse: true
  }),
      cpeX = _controlPoint4[0],
      cpeY = _controlPoint4[1];
  //const result = 
  //console.log(result)
  return "C " + cpsX + "," + cpsY + " " + cpeX + "," + cpeY + " " + point.x + ", " + point.y
}

export default bezierCommand