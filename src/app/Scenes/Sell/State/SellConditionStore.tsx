import { SellConditionPhoto } from "app/Scenes/Sell/Components/SellConditionPhotos"
import { SellConditionRating } from "app/Scenes/Sell/Components/SellConditionRatingPicker"
import { Action, Computed, action, computed, createContextStore } from "easy-peasy"

/** Step 2's answers. The provider lives on the Condition screen, so going back to step 1 drops them. */
export interface SellConditionStoreModel {
  rating: SellConditionRating | null
  photos: SellConditionPhoto[]
  /** The photos saved on the submission when it was last loaded or saved */
  savedPhotoIDs: string[]
  notes: string
  /** The notes saved on the submission, so loading them doesn’t count as an answer */
  savedNotes: string
  /** Whole US dollars as digits, or "" when nothing is entered */
  askingPrice: string
  hasAnswers: Computed<this, boolean>
  setRating: Action<this, SellConditionRating>
  setPhotos: Action<this, SellConditionPhoto[]>
  /** Replaces the list with what the submission now holds, after a save */
  setSavedPhotos: Action<this, SellConditionPhoto[]>
  /** Takes in what the submission holds after a failed save, so a retry sends nothing twice */
  restoreSavedPhotos: Action<this, SellConditionPhoto[]>
  setNotes: Action<this, string>
  /** Takes the notes just saved, so they no longer count as an answer */
  setSavedNotes: Action<this, string>
  setAskingPrice: Action<this, string>
}

export const toSavedPhotoIDs = (photos: SellConditionPhoto[]) =>
  photos.flatMap((photo) => (photo.imageID ? [photo.imageID] : []))

export const sellConditionStoreModel: SellConditionStoreModel = {
  rating: null,
  photos: [],
  savedPhotoIDs: [],
  notes: "",
  savedNotes: "",
  askingPrice: "",
  hasAnswers: computed(
    (state) =>
      !!state.rating ||
      state.photos.some((photo) => !photo.imageID) ||
      state.savedPhotoIDs.some((id) => !state.photos.some((photo) => photo.imageID === id)) ||
      state.notes.trim() !== state.savedNotes.trim() ||
      !!state.askingPrice
  ),
  setRating: action((state, rating) => {
    state.rating = rating
  }),
  setPhotos: action((state, photos) => {
    state.photos = photos
  }),
  setSavedPhotos: action((state, saved) => {
    state.photos = saved
    state.savedPhotoIDs = toSavedPhotoIDs(saved)
  }),
  restoreSavedPhotos: action((state, saved) => {
    const previousIDs = state.savedPhotoIDs
    const wasSaved = (photo: SellConditionPhoto) =>
      !!photo.imageID && previousIDs.includes(photo.imageID)
    const kept = saved.filter(
      (photo) => wasSaved(photo) && state.photos.some(({ imageID }) => imageID === photo.imageID)
    )
    // Metaphysics adds new photos in order, so these are the first of the new local ones
    const added = saved.filter((photo) => !wasSaved(photo))
    const unsaved = state.photos.filter((photo) => !photo.imageID).slice(added.length)

    state.photos = [...kept, ...added, ...unsaved]
    state.savedPhotoIDs = toSavedPhotoIDs(saved)
  }),
  setNotes: action((state, notes) => {
    state.notes = notes
  }),
  setSavedNotes: action((state, notes) => {
    state.savedNotes = notes
  }),
  setAskingPrice: action((state, askingPrice) => {
    state.askingPrice = askingPrice
  }),
}

export const SellConditionStore = createContextStore<
  SellConditionStoreModel,
  {},
  Partial<SellConditionStoreModel>
>((runtimeModel) => ({
  ...sellConditionStoreModel,
  ...runtimeModel,
}))
