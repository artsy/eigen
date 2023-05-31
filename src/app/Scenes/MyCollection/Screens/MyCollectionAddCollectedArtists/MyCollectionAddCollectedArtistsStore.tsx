import { Action, action, createContextStore } from "easy-peasy"

export interface MyCollectionAddCollectedArtistsStoreModel {
  artistIds: Set<string>
  addOrRemoveArtist: Action<this, string>
}

export const MyCollectionAddCollectedArtistsStore =
  createContextStore<MyCollectionAddCollectedArtistsStoreModel>({
    artistIds: new Set(),
    addOrRemoveArtist: action((state, artistId) => {
      const next = new Set(state.artistIds)
      if (state.artistIds.has(artistId)) {
        // Remove artist
        next.delete(artistId)
      } else {
        // Add artist
        next.add(artistId)
      }
      state.artistIds = next
    }),
  })
