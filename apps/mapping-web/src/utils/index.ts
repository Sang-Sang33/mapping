export function getUniqueId() {
    return 'selected-rect' + new Date().getTime()
}

export function getPointsFromRect(rect: IRect) {
    let { x, y, width, height } = rect
    let x2 = x + width
    let y2 = y + height
    if (x > x2) [x, x2] = [x2, x]
    if (y > y2) [y, y2] = [y2, y]
    return {
        x1: x,
        y1: y,
        x2,
        y2
    }
}

export function isPointInRect(rect: IRect, point: IPoints) {
    const { x, y } = point
    const { x1, y1, x2, y2 } = getPointsFromRect(rect)
    return x > x1 && x < x2 && y > y1 && y < y2
}

export function isRectOverlap(rect1: IRect, rect2: IRect) {
    const rt1Pos = getPointsFromRect(rect1)
    const rt2Pos = getPointsFromRect(rect2)
    return !(rt1Pos.x2 < rt2Pos.x1 || rt2Pos.x2 < rt1Pos.x1 || rt1Pos.y2 < rt2Pos.y1 || rt2Pos.y2 < rt1Pos.y1)
  }


export function isJsonString(str: string) {
    try {
        if (typeof JSON.parse(str) == "object") {
            return true;
        }
    } catch(e) {
    }
    return false;
}