import { Action, action, createContextStore } from "easy-peasy"

interface TabsContextStore {
  currentScrollY: number
  updateCurrentScrollY: Action<this, number>
}

export const TabsContext = createContextStore<TabsContextStore>({
  currentScrollY: 0,

  updateCurrentScrollY: action((state, currentScrollY) => {
    state.currentScrollY = currentScrollY
  }),
})
