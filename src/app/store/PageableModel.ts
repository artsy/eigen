import { action, Action } from "easy-peasy"

export interface PageableModel {
  pageableSlugs: string[]
  setPageableSlugs: Action<this, string[]>
  resetPageableSlugs: Action<this>
}

export const getPageableModel = (): PageableModel => ({
  pageableSlugs: [],
  setPageableSlugs: action((state, payload) => {
    state.pageableSlugs = payload
  }),
  resetPageableSlugs: action((state) => {
    state.pageableSlugs = []
  }),
})
