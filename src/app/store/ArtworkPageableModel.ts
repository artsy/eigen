import { action, Action } from "easy-peasy"

export interface ArtworkPageableModel {
  pageableArtworkSlugs: string[]
  setPageableArtworkSlugs: Action<this, string[]>
  resetPageableArtworkSlugs: Action<this>
}

export const getArtworkPageableModel = (): ArtworkPageableModel => ({
  pageableArtworkSlugs: [],
  setPageableArtworkSlugs: action((state, payload) => {
    state.pageableArtworkSlugs = payload
  }),
  resetPageableArtworkSlugs: action((state) => {
    state.pageableArtworkSlugs = []
  }),
})
