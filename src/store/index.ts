import create, { GetState, SetState } from 'zustand'

const getDefaultStoreValues: () => any = () => ({
  selectedColor: "",
  selectedTool: ""
})

type Store = {
  set: SetState<Store>
  reset: () => void
  selectedColor: string
  selectedTool: string
}

const store = create<Store>((set: SetState<Store>, get: GetState<Store>) => ({
  set: (partial) => set(partial),
  reset: () => set(getDefaultStoreValues()),
  selectedColor: getDefaultStoreValues().selectedColor,
  selectedTool: getDefaultStoreValues().selectedTool
}))

export default store;
