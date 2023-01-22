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
