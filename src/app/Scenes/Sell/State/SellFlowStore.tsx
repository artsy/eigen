import { SellConditionPhoto } from "app/Scenes/Sell/Components/SellConditionPhotos"
import { SellConditionRating } from "app/Scenes/Sell/Components/SellConditionRatingPicker"
import { Action, action, createContextStore } from "easy-peasy"

export interface SellConditionStep {
  rating: SellConditionRating | null
  photos: SellConditionPhoto[]
  notes: string
  /** Whole US dollars as digits, or "" when nothing is entered */
  askingPrice: string
}

const EMPTY_CONDITION_STEP: SellConditionStep = {
  rating: null,
  photos: [],
  notes: "",
  askingPrice: "",
}

export interface SellFlowStoreModel {
  activeArtworkID: string | null
  conditionStep: SellConditionStep
  setActiveArtworkID: Action<this, string>
  setRating: Action<this, SellConditionRating>
  setPhotos: Action<this, SellConditionPhoto[]>
  setNotes: Action<this, string>
  setAskingPrice: Action<this, string>
}

export const sellFlowStoreModel: SellFlowStoreModel = {
  activeArtworkID: null,
  conditionStep: EMPTY_CONDITION_STEP,
  setActiveArtworkID: action((state, artworkID) => {
    if (state.activeArtworkID !== artworkID) {
      state.conditionStep = EMPTY_CONDITION_STEP
    }
    state.activeArtworkID = artworkID
  }),
  setRating: action((state, rating) => {
    state.conditionStep.rating = rating
  }),
  setPhotos: action((state, photos) => {
    state.conditionStep.photos = photos
  }),
  setNotes: action((state, notes) => {
    state.conditionStep.notes = notes
  }),
  setAskingPrice: action((state, askingPrice) => {
    state.conditionStep.askingPrice = askingPrice
  }),
}

export const SellFlowStore = createContextStore<SellFlowStoreModel>((injections) => ({
  ...sellFlowStoreModel,
  ...injections,
}))
