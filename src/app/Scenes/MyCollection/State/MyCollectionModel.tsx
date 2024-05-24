import { Action, action } from "easy-peasy"
import { MyCollectionArtworkModel } from "./MyCollectionArtworkModel"

export interface MyCollectionModel {
  artwork: MyCollectionArtworkModel
  draft: {
    submissionID: string
    currentStep: string
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
