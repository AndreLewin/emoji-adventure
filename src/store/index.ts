import { Adventure } from '.prisma/client'
import create, { GetState, SetState } from 'zustand'
import { getIndexesToFloodFill, twoIndexesIntoIndexesOfSquare } from '../utils/math'
import { variableProxy, subscriberProxy, visibleVariablesProxy, dataProxy } from './proxy'
import { move } from '../utils/globalFunctions'

export type Cell = {
  color?: string
  emoji?: string
  onClickCScript?: string
  onViewCScript?: string
  onInitCScript?: string
}

export type Grid = {
  // an id is necessary so it can be referenced from scripts
  id: number
  cells: Cell[]
  text?: string
  onViewGScript?: string
  onInitGScript?: string
  backgroundImage?: string
  areClickSquaresHidden?: boolean
  areTitlesHidden?: boolean
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
  visibleVariables: {}
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
    cellUpdate
  }: {
    gridId: number,
    cellIndex: number,
    cellUpdate: Partial<Cell>
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
  activeGridId: number
  grids: Grid[]
  selectedTool: "pencil" | "square" | "bucket" | "colorPicker" | "emojiPicker" | "eraser" | "copyEverything" | "pasteEverything" | "undo" | ""
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
  activeCScriptTab: "onClickCScript" | "onViewCScript" | "onInitCScript"
  // necessary so view scripts are executed after init scripts
  isInitFinished: boolean
  // text displayed under the grid
  text1: string
  text2: string
  text3: string
  variables: { [key: string]: any }
  subscribers: { [key: string]: ((v: any) => any)[] }
  visibleVariables: { [key: string]: string }
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
    grid.cells[cellIndex]! = {
      ...grid.cells[cellIndex]!,
      ...cellUpdate
    }
    get().set({ grids: [...grids] })
    pushToGridHistory(get())
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
  }
}))

export default store;

// easier debugging from the browser
if (typeof window !== 'undefined') {
  // @ts-ignore
  window._h = () => gridHistory
  // @ts-ignore
  window._s = store
  // @ts-ignore
  window._ss = () => store.getState()
  // for global variables
  // @ts-ignore
  window._g = {}
  // for proxy (variables)
  // @ts-ignore
  window._variableProxy = variableProxy
  // for assigning new subscribers easily
  // @ts-ignore
  window._subscriberProxy = subscriberProxy
  // for assigning new config for variable easily
  // @ts-ignore
  window._visibleVariablesProxy = visibleVariablesProxy
  // for changing data (of cell, grid or adventure)
  // @ts-ignore
  window._dataProxy = dataProxy
  // ask for confirmation when closing tab if there is an unsaved change
  window.addEventListener('beforeunload', (e) => {
    // @ts-ignore
    const isChanged = window._ss().isChanged
    if (isChanged) {
      e.preventDefault();
      e.returnValue = '';
    }
  })
  window._move = move
  // list of intervals to remove before each grid transition
  window._gridIntervals = []
}