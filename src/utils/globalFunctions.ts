import { Cell } from "../store"
import { getRelativeCellIndex } from "./math"

type MoveProperties = {
  gridId: number
  cellIndex: number,
  direction: "up" | "right" | "down" | "left" | "void",
  distance?: number,
  isRound?: boolean,
  moveColor?: boolean,
  // the content to moved. if undefined, the content of the cell at gridId cellIndex (outside of underlayers) will be used
  // this can be problematic if the content has been covered by an other moving object
  content?: any,
  movementId?: number
}

export const move = ({
  gridId,
  cellIndex,
  direction,
  distance = 1,
  isRound = false,
  moveColor = false,
  content,
  movementId
}: MoveProperties) => {
  if (!["up", "right", "down", "left", "void"].includes(direction)) throw new Error(`Invalid direction value`)

  // @ts-ignore
  const originCell = (window._store.getState().grids?.[gridId]?.cells?.[cellIndex] ?? null) as Cell | null
  if (originCell === null) throw new Error(`No cell found for gridId ${gridId} cellIndex ${cellIndex}`)

  const getContentOfCell = (cell: Cell) => {
    const { color, underlayers, ...cellContent } = cell
    return {
      ...cellContent,
      ...(moveColor ? { color } : {})
    }
  }

  const contentToMove = content ? content : getContentOfCell(originCell)

  const cellIndexToMoveTo = getRelativeCellIndex({
    cellIndex,
    direction,
    distance,
    isRound
  })


  // place in the destination cell
  // @ts-ignore
  const destinationCell = (window._store.getState().grids?.[gridId]?.cells?.[cellIndexToMoveTo]) as Cell
  if (cellIndexToMoveTo !== null) {
    const destinationCellContent = getContentOfCell(destinationCell)
    const cellReplacement = {
      ...contentToMove,
      ...(movementId !== undefined ? { _movementId: movementId } : {}),
      ...(moveColor ? {} : { color: destinationCell.color }),
      underlayers: [...(destinationCell.underlayers ?? []), destinationCellContent]
    }

    // @ts-ignore
    window._store.getState().updateCell({
      gridId,
      cellIndex: cellIndexToMoveTo,
      cellReplacement
    })
  }


  // remove from the origin cell
  let cellReplacement: any;
  const underlayers = [...(originCell.underlayers ?? [])]

  // by default, we remove the "top" content
  const uppermostUnderlayer = underlayers[underlayers.length - 1] ?? {}
  cellReplacement = {
    ...uppermostUnderlayer,
    ...(moveColor ? {} : { color: originCell.color }),
    underlayers: underlayers.slice(0, -1)
  }

  // unless the move is part of a movement, and the content of that movement was
  // shoved in an underlayer because of an other movement that is now covering the cell
  // then we don't have to update the display, just to remove from the underlayers
  const indexInUnderlayers = underlayers.findIndex(underlayer => underlayer._movementId === movementId ?? -1)
  if (indexInUnderlayers > -1) {
    cellReplacement = {
      ...originCell,
      underlayers: [...underlayers.slice(0, indexInUnderlayers), ...underlayers.slice(indexInUnderlayers + 1)]
    }
  }

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
  pause?: boolean,
  stop?: boolean,
  remove?: boolean,
  // to dynamically change the content of a moving thing
  content?: Omit<Cell, "underlayers">,
  // used to keep track "which content comes from which movement"
  movementId?: number
}

let movementCount = 0

export const removeFromActiveMovements = (movementId: number) => {
  const indexOfActiveMovement = window._activeMovements.findIndex(aM => aM.movementId === movementId)
  if (indexOfActiveMovement !== -1) window._activeMovements.splice(indexOfActiveMovement, 1)
}

export const movement = async (options: MovementProperties) => {
  window._activeMovements.push(options)
  // options is not destructered here because the values can change dynamicly

  options.movementId = movementCount
  movementCount++

  // @ts-ignore
  const cell = (window._store.getState().grids?.[options.gridId]?.cells?.[options.cellIndex] ?? null) as Cell
  const { underlayers, ...initialContent } = cell
  options.content = initialContent

  const shouldLoop = options.code[options.code.length - 1] === "*"
  let partToLoop = ""
  if (shouldLoop) {
    options.code = options.code.slice(0, -1)
    partToLoop = options.code
  }

  let previousCell: any = null

  while (options.code.length > 0) {
    await sleep(options.delay ?? 500)

    /*
    //// probably not worth the complications of resetting the cell position
    // if the grid where the movement takes place is not visible, stop!
    // @ts-ignore
    const activeGridId = window._store.getState().activeGridId as number
    if (activeGridId !== gridId) {
      break;
    }
    */

    if (options.pause) {
      continue;
    }

    let firstLetter = options.code[0]!
    options.code = options.code.slice(1)

    // W = "wait"
    if (firstLetter === "W") continue

    let direction: "up" | "right" | "down" | "left" | "void" = "right"
    if (firstLetter === "U") {
      direction = "up"
    } else if (firstLetter === "R") {
      direction = "right"
    } else if (firstLetter === "D") {
      direction = "down"
    } else if (firstLetter === "L") {
      direction = "left"
    } else if (firstLetter === "X") {
      direction = "void"
    } else {
      throw new Error(`Direction of ${firstLetter} unknown`)
    }

    if (options.stop || options.remove) removeFromActiveMovements(options.movementId)
    if (options.stop) break
    if (options.remove) direction = "void"

    previousCell = move({
      // previousCell === null means it's the first cell of the movement
      gridId: previousCell === null ? options.gridId : previousCell._gridId,
      cellIndex: previousCell === null ? options.cellIndex : previousCell._cellIndex,
      direction,
      isRound: options.isRound,
      moveColor: options.moveColor,
      content: options.content,
      movementId: options.movementId
    })

    if (options.remove) break

    // no need to move anymore if the cell is not more visible
    if (previousCell === null) break

    if (shouldLoop) {
      if (options.code.length === 0) {
        options.code = partToLoop
      }
    }
  }
  removeFromActiveMovements(options.movementId)
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