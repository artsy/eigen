import { SellConditionPhoto } from "app/Scenes/Sell/Components/SellConditionPhotos"
import { SellConditionRating } from "app/Scenes/Sell/Components/SellConditionRatingPicker"
import { Action, Computed, action, computed, createContextStore } from "easy-peasy"

/** Step 2's answers. The provider lives on the Condition screen, so going back to step 1 drops them. */
export interface SellConditionStoreModel {
  rating: SellConditionRating | null
  photos: SellConditionPhoto[]
  notes: string
  /** Whole US dollars as digits, or "" when nothing is entered */
  askingPrice: string
  hasAnswers: Computed<this, boolean>
  setRating: Action<this, SellConditionRating>
  setPhotos: Action<this, SellConditionPhoto[]>
  setNotes: Action<this, string>
  setAskingPrice: Action<this, string>
}

export const sellConditionStoreModel: SellConditionStoreModel = {
  rating: null,
  photos: [],
  notes: "",
  askingPrice: "",
  hasAnswers: computed(
    (state) => !!state.rating || state.photos.length > 0 || !!state.notes || !!state.askingPrice
  ),
  setRating: action((state, rating) => {
    state.rating = rating
  }),
  setPhotos: action((state, photos) => {
    state.photos = photos
  }),
  setNotes: action((state, notes) => {
    state.notes = notes
  }),
  setAskingPrice: action((state, askingPrice) => {
    state.askingPrice = askingPrice
  }),
}

export const SellConditionStore = createContextStore<SellConditionStoreModel>((runtimeModel) => ({
  ...sellConditionStoreModel,
  ...runtimeModel,
}))
