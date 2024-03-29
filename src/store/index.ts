import { Adventure } from '.prisma/client'
import create, { GetState, SetState } from 'zustand'
import { getCellIndexFromCellPosition, getCellPositionFromCellIndex, getIndexesToFloodFill, getRelativeCellIndex, twoIndexesIntoIndexesOfSquare } from '../utils/math'
import { variableProxy, subscriberProxy, visibleVariablesProxy, dataProxy, cellSubscriberProxy } from './proxy'
import { addToGridIntervals, clearGridIntervals, move, getMovePrefilled, movement, sleep, getMovementPrefilled, random, moveToGrid, setText, setText3, setText2, setText1, alertDelayed } from '../utils/globalFunctions'
import { animate, getAnimatePrefilled } from '../utils/animate'
import { evalScript } from '../utils/evalScript'
import { activeMusic, pauseMusic, playMusic, resumeMusic, stopMusic } from '../utils/music'
import { openConfirmModal, openContextModal } from '@mantine/modals'
import { alertModal, confirmModal, multipleChoiceModal, promptModal } from '../utils/modals'
import { showNotification } from '@mantine/notifications'

export type Cell = {
  color?: string
  emoji?: string
  onClickCScript?: string
  onViewCScript?: string
  onLeaveCScript?: string
  onInitCScript?: string
  // when a cell moves to a cell, the original cell is pushed in underlayers
  underlayers?: Omit<Cell, "underlayers">[]
  // keep track if the content comes from a movement
  _movementId?: number
  backgroundImage?: string
}

export type HoveringText = {
  x: number,
  y: number,
  text: string
}

export type Grid = {
  // an id is necessary so it can be referenced from scripts
  id: number
  cells: Cell[]
  text?: string
  onViewGScript?: string
  onLeaveGScript?: string
  onInitGScript?: string
  backgroundImage?: string
  areClickSquaresHidden?: boolean
  areTitlesHidden?: boolean
  hoveringTexts?: HoveringText[]
}

export const defaultCellFactory = (): Cell => { return {} }

export const defaultGridFactory = (): Omit<Grid, "id"> => {
  return {
    cells: (new Array(100)).fill({}).map(defaultCellFactory)
  }
}

export const defaultAdventureFactory = (): Omit<Adventure, "id" | "createdAt" | "updatedAt" | "userId"> => {
  return {
    name: "",
    description: "",
    data: JSON.stringify({
      grids: [{ id: 0, ...defaultGridFactory() }],
      firstGridId: 0,
      onInitAScript: ""
    }),
    isAccessible: true,
    isPublished: false,
    areTitlesHiddenByDefault: false,
    areClickSquaresHiddenByDefault: false
  }
}

const getDefaultStoreValues: () => any = (): Partial<Store> => ({
  activeGridId: 0,
  selectedTool: "",
  isToolCursorVisible: false,
  selectedColor: null,
  selectedEmoji: null,
  mouseDownCellIndex: null,
  lastEmojis: [],
  copiedCell: defaultCellFactory(),
  // adventure data
  grids: [{ id: 0, ...defaultGridFactory() }],
  firstGridId: 0,
  onInitAScript: "",
  // adventure info
  adventure: null,
  isChanged: false,
  activeCScriptTab: "onClickCScript",
  isInitFinished: false,
  text1: "",
  text2: "",
  text3: "",
  variables: {},
  subscribers: {},
  visibleVariables: {},
  cellSubscribers: {}
})

export type Store = {
  set: SetState<Store>
  reset: () => void
  undo: () => void
  getCell: ({
    gridId,
    cellIndex
  }: {
    gridId: number,
    cellIndex: number
  }) => Cell | null,
  updateCell: ({
    gridId,
    cellIndex,
    cellUpdate,
    cellReplacement
  }: {
    gridId: number,
    cellIndex: number,
    cellUpdate?: Partial<Cell>,
    cellReplacement?: Cell,
  }) => void
  updateCellWithAppend: ({
    gridId,
    cellIndex,
    cellUpdate
  }: {
    gridId: number,
    cellIndex: number,
    cellUpdate: Partial<Cell>
  }) => void
  updateSquare: ({
    gridId,
    cellIndex1,
    cellIndex2,
    cellUpdate
  }: {
    gridId: number,
    cellIndex1: number,
    cellIndex2: number,
    cellUpdate: Partial<Cell>
  }) => void
  floodFill: ({
    gridId,
    cellIndex,
    cellUpdate
  }: {
    gridId: number,
    cellIndex: number,
    cellUpdate: Partial<Cell>
  }) => void
  pickEmoji: (pickedEmoji: string) => void
  updateGrid: ({
    gridId
  }: {
    gridId: number
    gridUpdate: Partial<Grid>
  }) => void
  createGrid: ({
    name,
    idOfGridToCopy,
  }: {
    name?: string
    idOfGridToCopy?: number
  }) => Grid
  deleteGrid: (gridIdToDelete: number) => void
  createHoveringText: ({
    gridId,
    hoveringText
  }: {
    gridId: number,
    hoveringText: HoveringText
  }) => number
  updateHoveringText: ({
    gridId,
    hoveringTextIndex,
    hoveringTextUpdate
  }: {
    gridId: number,
    hoveringTextIndex: number,
    hoveringTextUpdate: Partial<HoveringText>
  }) => HoveringText
  deleteHoveringText: ({
    gridId,
    hoveringTextIndex
  }: {
    gridId: number,
    hoveringTextIndex: number
  }) => boolean
  activeGridId: number
  grids: Grid[]
  selectedTool: "pencil" | "square" | "bucket" | "colorPicker" | "emojiPicker" | "eraser" | "copyEverything" | "pasteEverything" | "undo" | "hoveringText" | ""
  isToolCursorVisible: boolean
  // "blue": the color is selected with the color blue
  // "": the eraser of color is selected
  // null: something else is selected (ex: emoji)
  selectedColor: string | null
  selectedEmoji: string | null
  // used by the square tool to compute which cells should be colored
  mouseDownCellIndex: number | null
  // used by the selector to quickly use last used emojis
  lastEmojis: string[]
  // the whole cell data stored by "copyEverything"
  copiedCell: Cell
  // the first grid where the player will play
  firstGridId: number
  // eval when the adventure is loaded
  onInitAScript?: string
  adventure: Omit<Adventure, "data"> | null
  // in the editor, turns true if a change is made
  isChanged: boolean
  // so the autogenerated scripts are added to the correct property
  activeCScriptTab: "onClickCScript" | "onViewCScript" | "onLeaveCScript" | "onInitCScript"
  // necessary so view scripts are executed after init scripts
  isInitFinished: boolean
  // text displayed under the grid
  text1: string
  text2: string
  text3: string
  variables: { [key: string]: any }
  subscribers: { [key: string]: Function[] }
  visibleVariables: { [key: string]: string }
  cellSubscribers: { [key: string]: Function[] }
}

export let gridHistory: Pick<Store, "activeGridId" | "grids">[] = []

export const pushToGridHistory = (store: Store) => {
  gridHistory.push(JSON.parse(JSON.stringify({ activeGridId: store.activeGridId, grids: store.grids })))
  if (gridHistory.length > 20) {
    gridHistory.shift()
  }
}
export const emptyHistory = () => gridHistory = []

const store = create<Store>((set: SetState<Store>, get: GetState<Store>) => ({
  // call get().set() instead of set() to add the new store state to the localStorage
  set: (partial) => {
    set(partial)
    set({ isChanged: true })
    const currentStore = get()
    //// TODO: reactivate the localStorage
    // localStorage.setItem("store", JSON.stringify(currentStore))
  },
  reset: () => set(getDefaultStoreValues()),
  ...getDefaultStoreValues(),
  undo: () => {
    if (gridHistory.length > 1) {
      gridHistory.pop()
      const oldGridToUse = gridHistory[gridHistory.length - 1]!
      get().set(JSON.parse(JSON.stringify(oldGridToUse)))
    }
  },
  getCell({
    gridId,
    cellIndex
  }: {
    gridId: number,
    cellIndex: number
  }) {
    const { grids } = get()
    const grid = grids.find(g => g.id === gridId)
    if (typeof grid === "undefined") return null
    return grid.cells?.[cellIndex] ?? null
  },
  updateCell({
    gridId,
    cellIndex,
    cellUpdate,
    cellReplacement
  }: {
    gridId: number,
    cellIndex: number,
    cellUpdate?: Partial<Cell>,
    cellReplacement?: Cell,
  }) {
    const { grids } = get()
    const grid = grids.find(g => g.id === gridId)
    if (typeof grid === "undefined") return console.error(`grid ${gridId} not found in the store`)
    if (cellIndex >= 100) return console.error(`cellIndex ${cellIndex} does not exist (must be 0-100)`)

    const oldCell = JSON.parse(JSON.stringify(grid.cells[cellIndex]!)) as Cell
    let newCell: Cell | null = null

    if (cellReplacement === undefined && cellUpdate === undefined) {
      throw new Error("Property cellUpdate or cellReplacement must be provided to updateCell")
    }

    if (cellReplacement !== undefined) {
      newCell = JSON.parse(JSON.stringify(cellReplacement))
    }

    if (cellUpdate !== undefined) {
      newCell = JSON.parse(JSON.stringify({
        ...grid.cells[cellIndex]!,
        ...cellUpdate
      }))
    }

    grid.cells[cellIndex]! = newCell!
    get().set({ grids: [...grids] })

    pushToGridHistory(get())

    // trigger cell subscribers
    // ??? do it also in updateCellWithAppend, updateSquare and floodFill?
    // I expect most users to use the quick #: or @: instead (so only updateCell)
    const { cellSubscribers } = get()
    const cellSubscribersForThisCell = cellSubscribers[`_${gridId}_${cellIndex}`] ?? []
    const af = async () => {
      for (const subscriber of cellSubscribersForThisCell) {
        await subscriber(newCell, oldCell)
      }
    }
    af()
  },
  updateCellWithAppend({
    gridId,
    cellIndex,
    cellUpdate
  }: {
    gridId: number,
    cellIndex: number,
    cellUpdate: Partial<Cell>
  }) {
    const { grids } = get()
    const grid = grids.find(g => g.id === gridId)
    if (typeof grid === "undefined") return console.error(`grid ${gridId} not found in the store`)
    if (cellIndex >= 100) return console.error(`cellIndex ${cellIndex} does not exist (must be 0-100)`)
    const newCell = { ...grid.cells[cellIndex]! }

    if (cellUpdate.emoji !== undefined) {
      newCell.emoji = (newCell?.emoji ?? "") + cellUpdate.emoji
    }
    if (cellUpdate.onClickCScript !== undefined) {
      newCell.onClickCScript = (newCell?.onClickCScript ?? "") + ((newCell?.onClickCScript ?? "") === "" ? "" : "\n") + cellUpdate.onClickCScript
    }
    if (cellUpdate.onViewCScript !== undefined) {
      newCell.onViewCScript = (newCell?.onViewCScript ?? "") + ((newCell?.onViewCScript ?? "") === "" ? "" : "\n") + cellUpdate.onViewCScript
    }
    if (cellUpdate.onInitCScript !== undefined) {
      newCell.onInitCScript = (newCell?.onInitCScript ?? "") + ((newCell?.onInitCScript ?? "") === "" ? "" : "\n") + cellUpdate.onInitCScript
    }

    grid.cells[cellIndex]! = {
      ...grid.cells[cellIndex]!,
      ...newCell
    }
    get().set({ grids: [...grids] })
    pushToGridHistory(get())
  },
  updateSquare: ({
    gridId,
    cellIndex1,
    cellIndex2,
    cellUpdate
  }: {
    gridId: number,
    cellIndex1: number,
    cellIndex2: number,
    cellUpdate: Partial<Cell>
  }) => {
    const { grids } = get()
    const grid = grids.find(g => g.id === gridId)
    if (typeof grid === "undefined") return console.error(`grid ${gridId} not found in the store`)
    if (cellIndex1 >= 100 || cellIndex1 < 0) return console.error(`cellIndex ${cellIndex1} does not exist (must be 0-100)`)
    if (cellIndex2 >= 100 || cellIndex2 < 0) return console.error(`cellIndex ${cellIndex2} does not exist (must be 0-100)`)

    const ITEMS_PER_LINE = 10
    const ITEMS_PER_COLUMN = 10
    const cellIndexesToChange = twoIndexesIntoIndexesOfSquare(cellIndex1, cellIndex2, ITEMS_PER_LINE, ITEMS_PER_COLUMN)

    cellIndexesToChange.forEach((cellIndex) => {
      grid.cells[cellIndex]! = {
        ...grid.cells[cellIndex]!,
        ...cellUpdate
      }
    })

    get().set({ grids: [...grids] })
    pushToGridHistory(get())
  },
  floodFill: ({
    gridId,
    cellIndex,
    cellUpdate
  }: {
    gridId: number,
    cellIndex: number,
    cellUpdate: Partial<Cell>
  }) => {
    const { grids } = get()
    const grid = grids.find(g => g.id === gridId)
    if (typeof grid === "undefined") return console.error(`grid ${gridId} not found in the store`)
    if (cellIndex >= 100 || cellIndex < 0) return console.error(`cellIndex ${cellIndex} does not exist (must be 0-100)`)

    // for now we allow flood fill only for color and emojis
    // and not both at the same time
    let cellIndexesToChange: number[] = []
    const isChangingColor = cellUpdate?.color !== undefined
    if (isChangingColor) {
      cellIndexesToChange = getIndexesToFloodFill(cellIndex, grid.cells.map(c => c?.color ?? ""))
    }
    const isChangingEmoji = cellUpdate?.emoji !== undefined
    if (isChangingEmoji) {
      cellIndexesToChange = getIndexesToFloodFill(cellIndex, grid.cells.map(c => c?.emoji ?? ""))
    }

    cellIndexesToChange.forEach((cellIndex) => {
      grid.cells[cellIndex]! = {
        ...grid.cells[cellIndex]!,
        ...cellUpdate
      }
    })

    get().set({ grids: [...grids] })
    pushToGridHistory(get())
  },
  pickEmoji: (pickedEmoji: string) => {
    // for better UX, automatically switch to a drawing tool (if it was not already the case)
    const selectedTool = get().selectedTool
    if (selectedTool !== "pencil" && selectedTool !== "square") {
      set({ selectedTool: "pencil" })
    }
    set({ selectedEmoji: pickedEmoji, selectedColor: null })
    const oldLastEmojis = get().lastEmojis
    if (!oldLastEmojis.includes(pickedEmoji)) {
      const lastEmojis = [pickedEmoji, ...oldLastEmojis]
      if (lastEmojis.length > 20) lastEmojis.length = 20
      set({ lastEmojis })
    }
  },
  getGrid: ({
    gridId
  }: {
    gridId: number
  }) => {
    const { grids } = get()
    const grid = grids.find(g => g.id === gridId)
    if (typeof grid === "undefined") return null
    return grid
  },
  updateGrid: ({
    gridId,
    gridUpdate
  }: {
    gridId: number
    gridUpdate: Partial<Grid>
  }) => {
    const { grids } = get()
    const gridIndex = grids.findIndex(g => g.id === gridId)
    if (gridIndex === -1) return console.error(`grid ${gridId} not found in the store`)
    grids[gridIndex]! = {
      ...grids[gridIndex]!,
      ...gridUpdate
    }
    get().set({ grids: [...grids] })
    pushToGridHistory(get())
  },
  createGrid: ({
    name,
    idOfGridToCopy,
  }: {
    name?: string
    idOfGridToCopy?: number
  }) => {
    const { grids, adventure } = get()
    const { areTitlesHiddenByDefault, areClickSquaresHiddenByDefault } = adventure ?? {}

    const nextGridId = Math.max(...grids.map(g => g.id)) + 1

    let gridToCopy = {}
    if (idOfGridToCopy !== undefined) {
      const matchingGrid = grids.find(g => g.id === idOfGridToCopy)
      if (matchingGrid === undefined) return
      gridToCopy = {
        ...matchingGrid,
        cells: matchingGrid.cells.map(c => {
          // don't keep the scripts
          const { onClickCScript, onViewCScript, onInitCScript, ...rest } = c
          return {
            ...rest
          }
        })
      }
    }

    const newGrid = {
      ...defaultGridFactory(),
      ...(idOfGridToCopy !== undefined ? gridToCopy : {}),
      ...(name !== undefined ? { text: name } : {}),
      ...(areTitlesHiddenByDefault ? { areTitlesHidden: true } : {}),
      ...(areClickSquaresHiddenByDefault ? { areClickSquaresHidden: true } : {}),
      id: nextGridId
    }

    const newGrids = [...grids, newGrid]
    get().set({ grids: newGrids })
    pushToGridHistory(get())
    return newGrid
  },
  deleteGrid: (gridIdToDelete: number) => {
    const { grids, activeGridId, firstGridId } = get()
    // can't delete the last grid
    if (grids.length <= 1) return
    const isRemovingActiveGridId = gridIdToDelete === activeGridId
    const isRemovingFirstGridId = gridIdToDelete === firstGridId
    const newGrids = grids.filter(g => g.id !== gridIdToDelete)
    get().set({ activeGridId: isRemovingActiveGridId ? newGrids[newGrids.length - 1]!.id : activeGridId })
    get().set({ firstGridId: isRemovingFirstGridId ? newGrids[newGrids.length - 1]!.id : firstGridId })
    get().set({ grids: newGrids })
    pushToGridHistory(get())
  },
  createHoveringText: ({
    gridId,
    hoveringText
  }: {
    gridId: number,
    hoveringText: HoveringText
  }) => {
    const { grids } = get()
    const grid = grids.find(g => g.id === gridId)
    if (grid === undefined) throw new Error(`gridId ${gridId} not found`)

    const hoveringTexts = grid.hoveringTexts ?? []
    const nextIndex = hoveringTexts.length
    hoveringTexts[nextIndex] = hoveringText
    grid.hoveringTexts = hoveringTexts

    get().set({ grids: [...grids] })
    return nextIndex
  },
  updateHoveringText: ({
    gridId,
    hoveringTextIndex,
    hoveringTextUpdate
  }: {
    gridId: number,
    hoveringTextIndex: number,
    hoveringTextUpdate: Partial<HoveringText>
  }) => {
    const { grids } = get()
    const grid = grids.find(g => g.id === gridId)
    if (grid === undefined) throw new Error(`gridId ${gridId} not found`)

    const hoveringTexts = grid.hoveringTexts ?? []
    const oldHoveringText = hoveringTexts[hoveringTextIndex]
    if (oldHoveringText === undefined) throw new Error(`hovering text at hoveringTextIndex ${hoveringTextIndex} in gridId ${gridId} not found`)

    const newHoveringText = {
      ...oldHoveringText,
      ...hoveringTextUpdate
    }

    hoveringTexts[hoveringTextIndex] = newHoveringText
    grid.hoveringTexts = hoveringTexts

    get().set({ grids: [...grids] })
    return newHoveringText
  },
  deleteHoveringText: ({
    gridId,
    hoveringTextIndex
  }: {
    gridId: number,
    hoveringTextIndex: number
  }) => {
    const { grids } = get()
    const grid = grids.find(g => g.id === gridId)
    if (grid === undefined) throw new Error(`gridId ${gridId} not found`)

    const oldHoveringTexts = grid.hoveringTexts ?? []
    const oldHoveringText = oldHoveringTexts[hoveringTextIndex]
    if (oldHoveringText === undefined) throw new Error(`hovering text at hoveringTextIndex ${hoveringTextIndex} in gridId ${gridId} not found`)

    const newHoveringTexts = [...oldHoveringTexts.slice(0, hoveringTextIndex), ...oldHoveringTexts.slice(hoveringTextIndex + 1)]
    grid.hoveringTexts = newHoveringTexts

    get().set({ grids: [...grids] })
    return true
  }
}))

export default store;

// easier debugging from the browser
if (typeof window !== 'undefined') {
  // @ts-ignore
  window._h = () => gridHistory
  // @ts-ignore
  window._store = store
  // place all store functions in the window so they can be accessed more quickly from the scripts
  const entries = Object.entries(store.getState())
  entries.forEach(([name, value]) => {
    if (typeof value === "function") {
      // @ts-ignore
      window[`_${name}`] = value
    }
  })
  // to quickly get the updated store state
  // @ts-ignore
  window._ss = () => store.getState()
  // for global variables
  // @ts-ignore
  window._g = {}
  // for proxy (variables)
  // @ts-ignore
  window._variableProxy = variableProxy
  // for assigning new variable subscribers easily
  // @ts-ignore
  window._subscriberProxy = subscriberProxy
  // for assigning new config for variable easily
  // @ts-ignore
  window._visibleVariablesProxy = visibleVariablesProxy
  // for changing data (of cell, grid or adventure)
  // @ts-ignore
  window._dataProxy = dataProxy
  // for assigning new variable subscribers easily
  // @ts-ignore
  window._cellSubscriberProxy = cellSubscriberProxy
  // ask for confirmation when closing tab if there is an unsaved change
  window.addEventListener('beforeunload', (e) => {
    // @ts-ignore
    const isChanged = window._store.getState().isChanged
    if (isChanged) {
      e.preventDefault();
      e.returnValue = '';
    }
  })
  window._move = move
  window._getMovePrefilled = getMovePrefilled
  window._gridIntervals = []
  window._clearGridIntervals = clearGridIntervals
  window._i = addToGridIntervals
  window._movement = movement
  window._getMovementPrefilled = getMovementPrefilled
  window._sleep = sleep
  window._evalScript = evalScript
  window._random = random
  window._activeMovements = []
  window._animate = animate
  window._getAnimatePrefilled = getAnimatePrefilled
  window._a = animate
  window._setText = setText
  // math.ts
  window._getCellPositionFromCellIndex = getCellPositionFromCellIndex
  window._getCellIndexFromCellPosition = getCellIndexFromCellPosition
  window._getRelativeCellIndex = getRelativeCellIndex
  // music.ts
  window._playMusic = playMusic
  window._pauseMusic = pauseMusic
  window._resumeMusic = resumeMusic
  window._stopMusic = stopMusic
  window._activeMusic = activeMusic
  //
  window._tt = setText3
  window._tt = setText2
  window._t = setText1
  window._gs = store.getState
  window._ss = store.setState
  window._a = alertModal
  window._ad = alertDelayed
  window._c = confirmModal
  window._m = multipleChoiceModal
  window._p = promptModal
  window._l = window.console.log
  window._g = moveToGrid
  // mantine
  window._openConfirmModal = openConfirmModal
  window._openContextModal = openContextModal
  window._showNotification = showNotification
}
