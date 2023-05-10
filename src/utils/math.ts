export const twoIndexesIntoIndexesOfSquare = (index1: number, index2: number, itemsPerLine: number, itemsPerColumn: number): number[] => {
  const indexesOfSquare: number[] = []

  // starts at 0
  const lineOfIndex1 = Math.floor(index1 / itemsPerLine)
  const lineOfIndex2 = Math.floor(index2 / itemsPerLine)
  const columnOfIndex1 = index1 % itemsPerLine
  const columnOfIndex2 = index2 % itemsPerLine

  const startingLine = Math.min(lineOfIndex1, lineOfIndex2)
  const endingLine = Math.max(lineOfIndex1, lineOfIndex2)
  const startingColumn = Math.min(columnOfIndex1, columnOfIndex2)
  const endingColumn = Math.max(columnOfIndex1, columnOfIndex2)

  for (let line = startingLine; line <= endingLine; line++) {
    for (let column = startingColumn; column <= endingColumn; column++) {
      indexesOfSquare.push(column + line * itemsPerLine)
    }
  }

  return indexesOfSquare
}

export const getSymmetricalCellIndex = (index: number, itemsPerLine: number): number => {
  const { line, column } = getCellPositionFromCellIndex(index)
  const symmetricalLine = (itemsPerLine + 1) - line
  const symmetricalColumn = (itemsPerLine + 1) - column
  return getCellIndexFromCellPosition({ line: symmetricalLine, column: symmetricalColumn })
}

export const getSameLineSymmetricalCellIndex = (index: number, itemsPerLine: number): number => {
  const { line, column } = getCellPositionFromCellIndex(index)
  const symmetricalLine = line
  const symmetricalColumn = (itemsPerLine + 1) - column
  return getCellIndexFromCellPosition({ line: symmetricalLine, column: symmetricalColumn })
}

export const getSameColumnSymmetricalCellIndex = (index: number, itemsPerLine: number): number => {
  const { line, column } = getCellPositionFromCellIndex(index)
  const symmetricalLine = (itemsPerLine + 1) - line
  const symmetricalColumn = column
  return getCellIndexFromCellPosition({ line: symmetricalLine, column: symmetricalColumn })
}

export const getCellPositionFromCellIndex = (cellIndex: number): { line: number, column: number } => {
  return {
    line: (Math.floor(cellIndex / 10)) + 1,
    column: (cellIndex % 10) + 1
  }
}

export const getCellIndexFromCellPosition = ({ line, column }: { line: number, column: number }): number => {
  return ((line - 1) * 10) + (column - 1)
}

export const getRelativeCellIndex = ({
  cellIndex,
  direction,
  distance = 1,
  isRound = false
}: {
  cellIndex: number,
  direction: "up" | "right" | "down" | "left" | "void",
  distance?: number,
  isRound?: boolean
}): number | null => {
  if (direction === "void") {
    return null
  }

  let { line, column } = getCellPositionFromCellIndex(cellIndex)

  if (direction === "up") {
    line = line - distance
    if (line <= 0 && !isRound) return null
    while (line <= 0) {
      line += 10
    }
  } else if (direction === "right") {
    column = column + distance
    if (column > 10 && !isRound) return null
    while (column > 10) {
      column -= 10
    }
  } else if (direction === "down") {
    line = line + distance
    if (line > 10 && !isRound) return null
    while (line > 10) {
      line -= 10
    }
  } else if (direction === "left") {
    column = column - distance
    if (column <= 0 && !isRound) return null
    while (column <= 0) {
      column += 10
    }
  }

  return getCellIndexFromCellPosition({ line, column })
}

// https://en.wikipedia.org/wiki/Flood_fill
export const getIndexesToFloodFill = (targetIndex: number, gridValues: string[]) => {
  const targetValue = gridValues[targetIndex]
  const indexesWithTargetValue: number[] = []
  const indexesAlreadyChecked: number[] = []

  // for each index (starting from targetIndex)
  const checkIndexThenLookAround = (index: number) => {
    if (indexesAlreadyChecked.includes(index)) return
    indexesAlreadyChecked.push(index)

    const value = gridValues[index]
    if (value !== targetValue) return
    indexesWithTargetValue.push(index)

    const indexUp = getRelativeCellIndex({ cellIndex: index, direction: "up" })
    if (indexUp !== null) checkIndexThenLookAround(indexUp)
    const indexDown = getRelativeCellIndex({ cellIndex: index, direction: "down" })
    if (indexDown !== null) checkIndexThenLookAround(indexDown)
    const indexRight = getRelativeCellIndex({ cellIndex: index, direction: "right" })
    if (indexRight !== null) checkIndexThenLookAround(indexRight)
    const indexLeft = getRelativeCellIndex({ cellIndex: index, direction: "left" })
    if (indexLeft !== null) checkIndexThenLookAround(indexLeft)
  }

  checkIndexThenLookAround(targetIndex)

  return indexesWithTargetValue
}