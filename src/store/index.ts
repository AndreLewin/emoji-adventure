import create, { GetState, SetState } from 'zustand'

const getDefaultStoreValues: () => any = () => ({
  selectedColor: ""
})

type Store = {
  set: SetState<Store>
  reset: () => void
  selectedColor: string
}

const store = create<Store>((set: SetState<Store>, get: GetState<Store>) => ({
  set: (partial) => set(partial),
  reset: () => set(getDefaultStoreValues()),
  selectedColor: getDefaultStoreValues().selectedColor
}))

export default store;
