import create, { GetState, SetState } from 'zustand'
import { twoIndexesIntoIndexesOfSquare } from '../utils/math'

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
}

export const defaultGridFactory = (): Omit<Grid, "id"> => {
  return {
    text: "",
    cells: (new Array(100)).fill({}).map(() => ({ color: "", emoji: "", script: "" }))
  }
}

const getDefaultStoreValues: () => any = (): Partial<Store> => ({
  activeGridId: 0,
  gridIdCounter: 0,
  grids: [{ id: 0, ...defaultGridFactory() }],
  selectedTool: "",
  selectedColor: null,
  selectedEmoji: null,
  mouseDownCellIndex: null,
  lastEmojis: []
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
  changeCell: (cellIndex: number, { color, emoji }: { color?: string, emoji?: string }) => void
  changeCellsLikeSquare: (
    { index1, index2 }: { index1: number, index2: number },
    { color, emoji }: { color?: string, emoji?: string }
  ) => void
  pickEmoji: (pickedEmoji: string) => void
  changeGridText: (text: string) => void
  createGrid: () => void
  deleteGrid: (index: number) => void
  activeGridId: number
  gridIdCounter: number
  grids: Grid[]
  selectedTool: "pencil" | "square" | "colorPicker" | "emojiPicker" | "eraser" | "undo" | ""
  // "blue": the color is selected with the color blue
  // "": the eraser of color is selected
  // null: something else is selected (ex: emoji)
  selectedColor: string | null
  selectedEmoji: string | null
  // used by the square tool to compute which cells should be colored
  mouseDownCellIndex: number | null
  // used by the selector to quickly use last used emojis
  lastEmojis: string[]
}

const gridHistory: Pick<Store, "activeGridId" | "grids">[] = []

export const pushToGridHistory = (store: Store) => {
  gridHistory.push(JSON.parse(JSON.stringify({ activeGridId: store.activeGridId, grids: store.grids })))
  if (gridHistory.length > 20) {
    gridHistory.shift()
  }
  // console.log("history | index.ts l56", gridHistory)
}

const store = create<Store>((set: SetState<Store>, get: GetState<Store>) => ({
  set: (partial) => {
    set(partial)
    const currentStore = get()
    localStorage.setItem("store", JSON.stringify(currentStore))
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
    console.log("la cellule a été changée")
    // grids reference must be changed to recalculate component Grid and their children
    get().set({ grids: [...grids] })
  },
  changeCell: (cellIndex: number, { color, emoji }: { color?: string, emoji?: string }) => {
    const { activeGridId, grids } = get()
    const newGrids = grids.map((g, index) => {
      if (index === activeGridId) {
        const cell = g.cells[cellIndex]!
        if (typeof color === "string") {
          cell.color = color
        }
        if (typeof emoji === "string") {
          cell.emoji = emoji
        }
      }
      return g
    })
    get().set({ grids: newGrids })
    pushToGridHistory(get())
  },
  changeCellsLikeSquare: (
    { index1, index2 }: { index1: number, index2: number },
    { color, emoji }: { color?: string, emoji?: string }
  ) => {
    const ITEMS_PER_LINE = 10
    const ITEMS_PER_COLUMN = 10
    const indexesToChange = twoIndexesIntoIndexesOfSquare(index1, index2, ITEMS_PER_LINE, ITEMS_PER_COLUMN)

    const { activeGridId, grids } = get()
    const newGrids = grids.map((g, index) => {
      if (index === activeGridId) {
        indexesToChange.forEach((index) => {
          const cell = g.cells[index]!
          if (typeof color === "string") {
            cell.color = color
          }
          if (typeof emoji === "string") {
            cell.emoji = emoji
          }
        })
      }
      return g
    })
    get().set({ grids: newGrids })
    pushToGridHistory(get())
  },
  pickEmoji: (pickedEmoji: string) => {
    get().set({ selectedEmoji: pickedEmoji, selectedColor: null })
    const oldLastEmojis = get().lastEmojis
    if (!oldLastEmojis.includes(pickedEmoji)) {
      const lastEmojis = [pickedEmoji, ...oldLastEmojis]
      if (lastEmojis.length > 20) lastEmojis.length = 20
      get().set({ lastEmojis })
    }
  },
  changeGridText: (text: string) => {
    const { activeGridId, grids } = get()
    const newGrids = grids.map((g, index) => {
      if (index === activeGridId) {
        return { ...g, text }
      }
      return g
    })
    get().set({ grids: newGrids })
    pushToGridHistory(get())
  },
  createGrid: () => {
    const { grids, gridIdCounter } = get()
    const newGrids = [...grids, { id: gridIdCounter + 1, ...defaultGridFactory() }]
    get().set({ grids: newGrids, activeGridId: newGrids.length - 1, gridIdCounter: gridIdCounter + 1 })
    pushToGridHistory(get())
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