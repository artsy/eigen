import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"

export type SubmitArtworkScreen = keyof SubmitArtworkStackNavigation

export const ARTWORK_FORM_FINAL_STEP = "AddPhoneNumber"

export const ARTWORK_FORM_STEPS: SubmitArtworkScreen[] = [
  "StartFlow",
  "SubmitArtworkFromMyCollection",
  "SelectArtist",
  "AddTitle",
  "AddPhotos",
  "AddDetails",
  "PurchaseHistory",
  "AddDimensions",
  "AddPhoneNumber",
  "CompleteYourSubmission",
  "ArtistRejected",
]
