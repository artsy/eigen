import { MyCollectionArtwork_sharedProps$data } from "__generated__/MyCollectionArtwork_sharedProps.graphql"
import { ArtworkFormMode } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { Action, action, createContextStore } from "easy-peasy"

interface MyCollectionArtworkStoreModel {
  mode: ArtworkFormMode
  onSuccess: () => void
  source: "My Collection" | "Saves" | "Insights"
  onDelete: () => void
  artwork: Omit<MyCollectionArtwork_sharedProps$data, " $refType"> | null

  setState: Action<this, Partial<MyCollectionArtworkStoreModel>>
}

const MyCollectionArtworkStoreModel: MyCollectionArtworkStoreModel = {
  mode: "add",
  onSuccess: () => {},
  source: "My Collection",
  onDelete: () => {},
  artwork: null,
  setState: action((state, payload) => {
    Object.assign(state, payload)
  }),
}

export const MyCollectionArtworkStore = createContextStore((injections) => ({
  ...MyCollectionArtworkStoreModel,
  ...injections,
}))
