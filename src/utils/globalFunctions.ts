import { Cell } from "../store"
import { getRelativeCellIndex } from "./math"

export const move = ({
  gridId,
  cellIndex,
  direction,
  distance = 1,
  isRound = false
}: {
  gridId: number
  cellIndex: number,
  direction: "up" | "right" | "down" | "left",
  distance?: number,
  isRound?: boolean
}) => {
  // @ts-ignore
  const cell = (window._ss().grids?.[gridId]?.cells?.[cellIndex] ?? null) as Cell | null
  if (cell === null) throw new Error(`No cell found for gridId ${gridId} cellIndex ${cellIndex}`)

  const cellIndexToMoveTo = getRelativeCellIndex({
    cellIndex,
    direction,
    distance,
    isRound
  })

  // place everything in the destination cell, except the color
  const { color, ...rest } = cell
  if (cellIndexToMoveTo !== null) {
    // @ts-ignore
    window._ss().updateCell({
      gridId,
      cellIndex: cellIndexToMoveTo,
      cellUpdate: {
        ...rest,
      }
    })
  }

  // remove everything from the origin cell, except the color
  const restWithUndefined = Object.fromEntries(Object.entries(rest).map(([key, value]) => [key, undefined]))
  // @ts-ignore
  window._ss().updateCell({
    gridId,
    cellIndex,
    cellUpdate: {
      ...restWithUndefined,
    }
  })

  // return destination cell (useful if we want to do something after moving)
  if (cellIndexToMoveTo === null) return null
  // @ts-ignore
  const destinationCell = (window._ss().grids?.[gridId]?.cells?.[cellIndexToMoveTo]) as Cell
  return {
    ...destinationCell,
    _gridId: gridId,
    _cellIndex: cellIndexToMoveTo
  }
}

export const clearGridIntervals = () => {
  const gridIntervals = window._gridIntervals
  gridIntervals.forEach(gI => clearInterval(gI))
  window._gridIntervals = []
}

export const addToGridIntervals = (f: Function, timer: number = 1000) => {
  const newIntervalId = setInterval(f, timer)
  window._gridIntervals.push(newIntervalId)
}

export const sleep = (delay: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, delay))
}

// await _movement({ gridId: 0, cellIndex: 0, code: "RDLU"})
// console.log("kat")
export const movement = async ({
  gridId,
  cellIndex,
  code,
  delay = 500,
  isRound = false
}: {
  gridId: number
  cellIndex: number,
  code: string,
  delay?: number,
  isRound?: boolean
}) => {
  let lastCell: any = null

  // TODO: handle loops (* at the end)

  // TODO: if the activeGrid is not this one, break!
  while (code.length > 0) {
    const firstLetter = code[0]
    code = code.slice(1)

    let direction: "up" | "right" | "down" | "left" = "right"
    if (firstLetter === "U") {
      direction = "up"
    } else if (firstLetter === "R") {
      direction = "right"
    } else if (firstLetter === "D") {
      direction = "down"
    } else if (firstLetter === "L") {
      direction = "left"
    } else {
      throw new Error(`Direction of ${firstLetter} unknown`)
    }

    await sleep(delay)

    // first move
    if (lastCell === null) {
      lastCell = move({ gridId, cellIndex, direction, isRound })
    } else {
      lastCell = move({ gridId: lastCell._gridId, cellIndex: lastCell._cellIndex, direction, isRound })
    }

    // no need to move anymore if the cell is not more visible
    if (lastCell === null) break
  }
}

