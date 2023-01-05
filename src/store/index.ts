import create, { GetState, SetState } from 'zustand'
import { twoIndexesIntoIndexesOfSquare } from '../utils/math'

export type Cell = {
  color: string
  emoji: string
}

export type Grid = {
  text: string
  cells: Cell[]
}

export const defaultGridFactory = (): Grid => {
  return {
    text: "",
    cells: (new Array(100)).fill({ color: "", emoji: "" })
  }
}

const getDefaultStoreValues: () => any = (): Partial<Store> => ({
  activeGrid: 0,
  grids: [defaultGridFactory()],
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
  changeCell: (cellIndex: number, { color, emoji }: { color?: string, emoji?: string }) => void
  changeCellsLikeSquare: (
    { index1, index2 }: { index1: number, index2: number },
    { color, emoji }: { color?: string, emoji?: string }
  ) => void
  pickEmoji: (pickedEmoji: string) => void
  activeGrid: number
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

const gridHistory: Pick<Store, "activeGrid" | "grids">[] = []

export const pushToGridHistory = (store: Store) => {
  gridHistory.push(JSON.parse(JSON.stringify({ activeGrid: store.activeGrid, grids: store.grids })))
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
  changeCell: (cellIndex: number, { color, emoji }: { color?: string, emoji?: string }) => {
    const { activeGrid, grids } = get()
    const newGrids = grids.map((g, index) => {
      if (index === activeGrid) {
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

    const { activeGrid, grids } = get()
    const newGrids = grids.map((g, index) => {
      if (index === activeGrid) {
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
  }
}))

export default store;

// easier debugging from the browser
if (typeof window !== 'undefined') {
  // @ts-ignore
  window._history = gridHistory
  // @ts-ignore
  window._store = store
  // @ts-ignore
  window._s = () => store.getState()
}