import { MyCollectionCustomArtistSchema } from "app/Scenes/MyCollection/Screens/Artist/AddMyCollectionArtist"
import { Action, Computed, action, computed, createContextStore } from "easy-peasy"
import { isEqual } from "lodash"

export interface MyCollectionAddCollectedArtistsStoreModel {
  artistIds: Array<string>
  customArtists: Array<MyCollectionCustomArtistSchema>
  addOrRemoveArtist: Action<this, string>
  addCustomArtist: Action<this, MyCollectionCustomArtistSchema>
  count: Computed<this, number>
}

export const MyCollectionAddCollectedArtistsStore =
  createContextStore<MyCollectionAddCollectedArtistsStoreModel>({
    artistIds: [],
    customArtists: [],
    addOrRemoveArtist: action((state, artistId) => {
      const next = new Set(state.artistIds)
      if (next.has(artistId)) {
        // Remove artist
        next.delete(artistId)
      } else {
        // Add artist
        next.add(artistId)
      }
      state.artistIds = Array.from(next)
    }),
    addCustomArtist: action((state, artist) => {
      // Do not allow duplicate artists to be added
      if (state.customArtists.find((a) => isEqual(a, artist))) {
        return
      }
      state.customArtists.push(artist)
    }),
    count: computed((state) => state.artistIds.length + state.customArtists.length),
  })
