import { number } from 'prop-types'
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
  selectedColor: "",
  selectedTool: "",
  mouseDownCellIndex: null
})

type Store = {
  set: SetState<Store>
  reset: () => void
  undo: () => void
  changeCell: (cellIndex: number, { color, emoji }: { color?: string, emoji?: string }) => void
  changeCellsLikeSquare: (
    { index1, index2 }: { index1: number, index2: number },
    { color, emoji }: { color?: string, emoji?: string }
  ) => void
  activeGrid: number
  grids: Grid[]
  selectedColor: string
  selectedTool: "pencil" | "square" | "eraser" | "undo" | ""
  // used by the square tool to compute which cells should be colored
  mouseDownCellIndex: number | null
}

const history: Store[] = []

const pushToHistory = (store: Store) => {
  history.push(store)
  if (history.length > 20) {
    history.shift()
  }
}

const store = create<Store>((set: SetState<Store>, get: GetState<Store>) => ({
  set: (partial) => {
    set(partial)
    const currentStore = get()
    localStorage.setItem("store", JSON.stringify(currentStore))
    pushToHistory(currentStore)
  },
  reset: () => set(getDefaultStoreValues()),
  ...getDefaultStoreValues(),
  undo: () => {
    if (history.length > 1) {
      history.pop()
      set(history[history.length - 1]!)
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
  }
}))

export default store;

// easier debugging from the browser
if (typeof window !== 'undefined') {
  // @ts-ignore
  window._history = history
  // @ts-ignore
  window._store = store
  // @ts-ignore
  window._s = () => store.getState()
}