import { Cell } from "../store"
import { getRelativeCellIndex } from "./math"

type MoveProperties = {
  gridId: number
  cellIndex: number,
  direction: "up" | "right" | "down" | "left",
  distance?: number,
  isRound?: boolean,
  moveColor?: boolean,
  // the original content of the cell will reappear if moved out of it
  keepOriginalContent?: boolean
}

export const move = ({
  gridId,
  cellIndex,
  direction,
  distance = 1,
  isRound = false,
  moveColor = false,
  keepOriginalContent = true
}: MoveProperties) => {
  // @ts-ignore
  const cell = (window._store.getState().grids?.[gridId]?.cells?.[cellIndex] ?? null) as Cell | null
  if (cell === null) throw new Error(`No cell found for gridId ${gridId} cellIndex ${cellIndex}`)
  if (!["up", "right", "down", "left"].includes(direction)) throw new Error(`Invalid direction value`)

  const cellIndexToMoveTo = getRelativeCellIndex({
    cellIndex,
    direction,
    distance,
    isRound
  })

  // place everything in the destination cell
  // @ts-ignore
  const destinationCell = (window._store.getState().grids?.[gridId]?.cells?.[cellIndexToMoveTo]) as Cell
  const { color, ...rest } = cell
  if (cellIndexToMoveTo !== null) {
    const cellReplacement = moveColor ? {} : { color: destinationCell.color, ...rest }
    // @ts-ignore
    if (keepOriginalContent) cellReplacement.original = JSON.parse(JSON.stringify(destinationCell))
    // @ts-ignore
    window._store.getState().updateCell({
      gridId,
      cellIndex: cellIndexToMoveTo,
      cellReplacement
    })
  }

  // remove everything from the origin cell
  let cellReplacement = moveColor ? {} : { color: cell.color }
  // @ts-ignore
  if (keepOriginalContent && typeof cell.original === "object") cellReplacement = { ...cellReplacement, ...cell.original }
  // @ts-ignore
  window._store.getState().updateCell({
    gridId,
    cellIndex,
    cellReplacement
  })

  // return destination cell (useful if we want to do something after moving)
  if (cellIndexToMoveTo === null) return null

  return {
    ...destinationCell,
    _gridId: gridId,
    _cellIndex: cellIndexToMoveTo
  }
}

export const getMovePrefilled = (partialMoveObject1: Partial<MoveProperties>) => {
  return (partialMoveObject2: Partial<MoveProperties>) => {
    move({
      ...partialMoveObject1,
      ...partialMoveObject2
    } as MoveProperties)
  }
}

export const clearGridIntervals = () => {
  const gridIntervals = window._gridIntervals
  gridIntervals.forEach(gI => clearInterval(gI))
  window._gridIntervals = []
}

export const addToGridIntervals = (f: Function, timer = 1000) => {
  const newIntervalId = setInterval(f, timer)
  window._gridIntervals.push(newIntervalId)
}

export const sleep = (delay: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, delay))
}

type MovementProperties = {
  gridId: number
  cellIndex: number,
  code: string,
  delay?: number,
  isRound?: boolean,
  moveColor?: boolean,
  keepOriginalContent?: boolean
}

export const movement = async ({
  gridId,
  cellIndex,
  code,
  delay = 500,
  isRound = false,
  moveColor = false,
  keepOriginalContent = true
}: MovementProperties) => {
  const shouldLoop = code[code.length - 1] === "*"
  let partToLoop = ""
  if (shouldLoop) {
    code = code.slice(0, -1)
    partToLoop = code
  }

  let lastCell: any = null

  while (code.length > 0) {
    await sleep(delay)

    /*
    //// probably not worth the complications of resetting the cell position
    // if the grid where the movement takes place is not visible, stop!
    // @ts-ignore
    const activeGridId = window._store.getState().activeGridId as number
    if (activeGridId !== gridId) {
      break;
    }
    */

    const firstLetter = code[0]
    code = code.slice(1)

    // wait
    if (firstLetter === "W") continue
    // disappear
    if (firstLetter === "X") {
      const realGridId = lastCell._gridId ?? gridId
      const realCellIndex = lastCell._cellIndex ?? cellIndex
      // @ts-ignore
      const cell = (window._store.getState().grids?.[realGridId]?.cells?.[realCellIndex] ?? null) as Cell
      let cellReplacement = moveColor ? {} : { color: cell.color }
      // @ts-ignore
      if (keepOriginalContent && typeof cell.original === "object") cellReplacement = { ...cellReplacement, ...cell.original }
      // @ts-ignore
      window._store.getState().updateCell({
        gridId: realGridId,
        cellIndex: realCellIndex,
        cellReplacement
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
      lastCell = move({ gridId, cellIndex, direction, isRound, moveColor, keepOriginalContent })
    } else {
      lastCell = move({ gridId: lastCell._gridId, cellIndex: lastCell._cellIndex, direction, isRound, moveColor, keepOriginalContent })
    }

    // no need to move anymore if the cell is not more visible
    if (lastCell === null) break

    if (shouldLoop) {
      if (code.length === 0) {
        code = partToLoop
      }
    }
  }
  // gives time for the cell to be updated before the rest of a script is executed (after await _movement)
  await sleep(10)
}

export const getMovementPrefilled = (partialMovementObject1: Partial<MovementProperties>) => {
  return (partialMovementObject2: Partial<MovementProperties> | string) => {
    // shortcut for strings codes
    if (typeof partialMovementObject2 === "string") {
      return movement({
        ...partialMovementObject1,
        code: partialMovementObject2
      } as MovementProperties)
    }

    return movement({
      ...partialMovementObject1,
      ...partialMovementObject2
    } as MovementProperties)
  }
}

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}