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
  activeGrid: number
  grids: Grid[]
  selectedColor: string
  selectedTool: string
}

const store = create<Store>((set: SetState<Store>, get: GetState<Store>) => ({
  set: (partial) => set(partial),
  reset: () => set(getDefaultStoreValues()),
  ...getDefaultStoreValues()
}))

export default store;
