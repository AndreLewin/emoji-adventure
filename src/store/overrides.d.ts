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
  _activeMovements: Omit<Cell, "underlayers">[]
  _moveToGrid: Function
  _animate: Function
  _a: Function
  _setText: Function
  // math
  _getCellPositionFromCellIndex: Function
  _getCellIndexFromCellPosition: Function
  _getRelativeCellIndex: Function
}