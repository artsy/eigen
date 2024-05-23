import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { Action, action } from "easy-peasy"
import { MyCollectionArtworkModel } from "./MyCollectionArtworkModel"

export interface MyCollectionModel {
  artwork: MyCollectionArtworkModel
  draft: {
    values: ArtworkDetailsFormModel
    currentStep: string
    navigationState: any
  } | null
  setDraft: Action<this, this["draft"]>
}

export const getMyCollectionModel = (): MyCollectionModel => ({
  artwork: MyCollectionArtworkModel,
  draft: null,
  setDraft: action((state, payload) => {
    state.draft = payload
  }),
})
