interface Window {
  _move: Function
  _getMovePrefilled: Function
  _gridIntervals: number[]
  _clearGridIntervals: Function
  _i: Function
  _sleep: Function
  _movement: Function
  _getMovementPrefilled: Function
  _evalScript: Function
  _random: Function
  _getCellPositionFromCellIndex: Function
  _getCellIndexFromCellPosition: Function
  _getRelativeCellIndex: Function
  _activeMovements: Omit<Cell, "underlayers">[]
}