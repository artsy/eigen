import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"

export type SubmitArtworkScreen = keyof SubmitArtworkStackNavigation

export const ARTWORK_FORM_STEPS: SubmitArtworkScreen[] = [
  "StartFlow",
  "SelectArtist",
  "AddTitle",
  "AddPhotos",
  "AddDetails",
  "AddDimensions",
  "PurchaseHistory",
  "CompleteYourSubmission",
  "ArtistRejected",
  "SelectArtworkMyCollectionArtwork",
]
