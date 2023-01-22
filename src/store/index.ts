import { Adventure } from '.prisma/client'
import create, { GetState, SetState } from 'zustand'
import { getIndexesToFloodFill, twoIndexesIntoIndexesOfSquare } from '../utils/math'

export type Cell = {
  color: string
  emoji: string
  script: string
}

export type Grid = {
  // an id is necessary so it can be referenced from scripts
  id: number
  text: string
  cells: Cell[]
  script: string
}

export const defaultGridFactory = (): Omit<Grid, "id"> => {
  return {
    text: "",
    cells: (new Array(100)).fill({}).map(() => ({ color: "", emoji: "", script: "" })),
    script: ""
  }
}

export const defaultAdventureFactory = (): Omit<Adventure, "id" | "createdAt" | "updatedAt" | "userId"> => {
  return {
    name: "",
    description: "",
    data: JSON.stringify({
      grids: [{ id: 0, ...defaultGridFactory() }],
      firstGridId: 0,
      initialScript: ""
    }),
    isAccessible: false,
    isPublished: false
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
  // adventure data
  grids: [{ id: 0, ...defaultGridFactory() }],
  firstGridId: 0,
  initialScript: "",
  // adventure info
  adventure: null,
  //
  isChanged: false
})

export type Store = {
  set: SetState<Store>
  reset: () => void
  undo: () => void
  updateCell: ({
    gridId,
    cellIndex,
    cellUpdate
  }: {
    gridId: number,
    cellIndex: number,
    cellUpdate: {
      color?: string,
      emoji?: string,
      script?: string
    }
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
    cellUpdate: {
      color?: string,
      emoji?: string,
      script?: string
    }
  }) => void
  floodFill: ({
    gridId,
    cellIndex,
    cellUpdate
  }: {
    gridId: number,
    cellIndex: number,
    cellUpdate: {
      color?: string,
      emoji?: string,
      script?: string
    }
  }) => void
  pickEmoji: (pickedEmoji: string) => void
  updateGrid: ({
    gridId
  }: {
    gridId: number
    gridUpdate: {
      text?: string
    }
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
  selectedTool: "pencil" | "square" | "bucket" | "colorPicker" | "emojiPicker" | "eraser" | "undo" | ""
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
  // the first grid where the player will play
  firstGridId: number
  // eval when the adventure is loaded
  initialScript: string
  adventure: Omit<Adventure, "data"> | null
  isChanged: boolean
}

export let gridHistory: Pick<Store, "activeGridId" | "grids">[] = []

export const pushToGridHistory = (store: Store) => {
  gridHistory.push(JSON.parse(JSON.stringify({ activeGridId: store.activeGridId, grids: store.grids })))
  if (gridHistory.length > 20) {
    gridHistory.shift()
  }
  // console.log("history | index.ts l56", gridHistory)
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
      get().set(oldGridToUse)
    }
  },
  updateCell({
    gridId,
    cellIndex,
    cellUpdate
  }: {
    gridId: number,
    cellIndex: number,
    cellUpdate: {
      color?: string,
      emoji?: string,
      script?: string
    }
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
  updateSquare: ({
    gridId,
    cellIndex1,
    cellIndex2,
    cellUpdate
  }: {
    gridId: number,
    cellIndex1: number,
    cellIndex2: number,
    cellUpdate: {
      color?: string,
      emoji?: string,
      script?: string
    }
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
    cellUpdate: {
      color?: string,
      emoji?: string,
      script?: string
    }
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
      cellIndexesToChange = getIndexesToFloodFill(cellIndex, grid.cells.map(c => c.color))
    }
    const isChangingEmoji = cellUpdate?.emoji !== undefined
    if (isChangingEmoji) {
      cellIndexesToChange = getIndexesToFloodFill(cellIndex, grid.cells.map(c => c.emoji))
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
  updateGrid: ({
    gridId,
    gridUpdate
  }: {
    gridId: number
    gridUpdate: {
      text?: string
    }
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
    const { grids } = get()
    const nextGridId = Math.max(...grids.map(g => g.id)) + 1

    let gridToCopy = {}
    if (idOfGridToCopy !== undefined) {
      const matchingGrid = grids.find(g => g.id === idOfGridToCopy)
      if (matchingGrid === undefined) return
      gridToCopy = {
        ...matchingGrid,
        cells: matchingGrid.cells.map(c => {
          return {
            ...c,
            // don't keep scripts 
            script: ""
          }
        })
      }
    }

    const newGrid = {
      ...defaultGridFactory(),
      ...(idOfGridToCopy !== undefined ? gridToCopy : {}),
      ...(name !== undefined ? { text: name } : {}),
      id: nextGridId
    }
    console.log("newGrid | index.ts l267", newGrid)

    const newGrids = [...grids, newGrid]
    get().set({ grids: newGrids })
    pushToGridHistory(get())
    return newGrid
  },
  deleteGrid: (gridIdToDelete: number) => {
    const { grids, activeGridId } = get()
    // can't delete the last grid
    if (grids.length <= 1) return
    const isRemovingActiveGridId = gridIdToDelete === activeGridId
    const newGrids = grids.filter(g => g.id !== gridIdToDelete)
    get().set({ activeGridId: isRemovingActiveGridId ? newGrids[newGrids.length - 1]!.id : activeGridId })
    get().set({ grids: newGrids })
    pushToGridHistory(get())
  }
}))

export default store;

// easier debugging from the browser
if (typeof window !== 'undefined') {
  // @ts-ignore
  window._h = gridHistory
  // @ts-ignore
  window._s = store
  // @ts-ignore
  window._ss = () => store.getState()
}