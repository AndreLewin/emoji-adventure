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
  const shouldLoop = code[code.length - 1] === "*"
  let partToLoop = ""
  if (shouldLoop) {
    code = code.slice(0, -1)
    partToLoop = code
  }

  let lastCell: any = null

  // if the grid where the movement takes place is not visible, don't move!
  // @ts-ignore
  let activeGridId = window._ss().activeGridId as number

  while (code.length > 0 && activeGridId === gridId) {
    await sleep(delay)

    const firstLetter = code[0]
    code = code.slice(1)

    // wait
    if (firstLetter === "W") continue
    // disappear
    if (firstLetter === "X") {
      const realGridId = lastCell._gridId ?? gridId
      const realCellIndex = lastCell._cellIndex ?? cellIndex
      // @ts-ignore
      const cell = (window._ss().grids?.[realGridId]?.cells?.[realCellIndex] ?? null) as Cell
      const { color, ...rest } = cell
      // remove everything from the cell, except the color
      const restWithUndefined = Object.fromEntries(Object.entries(rest).map(([key, value]) => [key, undefined]))
      // @ts-ignore
      window._ss().updateCell({
        gridId: realGridId,
        cellIndex: realCellIndex,
        cellUpdate: {
          ...restWithUndefined,
        }
      })
      break
    }

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

    // first move
    if (lastCell === null) {
      console.log("cellIndex | globalFunctions.ts l157", cellIndex)

      lastCell = move({ gridId, cellIndex, direction, isRound })
    } else {
      lastCell = move({ gridId: lastCell._gridId, cellIndex: lastCell._cellIndex, direction, isRound })
    }

    // no need to move anymore if the cell is not more visible
    if (lastCell === null) break

    // @ts-ignore
    activeGridId = window._ss().activeGridId as number

    if (shouldLoop) {
      if (code.length === 0) {
        code = partToLoop
      }
    }
  }
}

