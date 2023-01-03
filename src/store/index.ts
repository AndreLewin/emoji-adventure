import create, { GetState, SetState } from 'zustand'

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

const getDefaultStoreValues: () => any = () => ({
  activeGrid: 0,
  grids: [defaultGridFactory()],
  selectedColor: "",
  selectedTool: ""
})

type Store = {
  set: SetState<Store>
  reset: () => void
  undo: () => void
  activeGrid: number
  grids: Grid[]
  selectedColor: string
  selectedTool: string
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