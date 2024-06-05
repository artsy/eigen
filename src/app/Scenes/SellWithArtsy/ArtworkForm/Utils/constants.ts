import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"

export type SubmitArtworkScreen = keyof SubmitArtworkStackNavigation

export const ARTWORK_FORM_STEPS: SubmitArtworkScreen[] = [
  "StartFlow",
  "SelectArtist",
  "AddTitle",
  "AddPhotos",
  "AddDetails",
  "PurchaseHistory",
  "AddDimensions",
  "AddPhoneNumber",
  "CompleteYourSubmission",
  "ArtistRejected",
  "SelectArtworkMyCollectionArtwork",
]

export const LAST_STEP: SubmitArtworkScreen = "AddPhoneNumber"
