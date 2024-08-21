import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"

export type SubmitArtworkScreen = keyof SubmitArtworkStackNavigation

export const ARTWORK_FORM_TIER_1_FINAL_STEP = "AddPhoneNumber"
export const ARTWORK_FORM_TIER_2_FINAL_STEP = "Condition"

const TIER_1_STEPS: SubmitArtworkScreen[] = [
  "SubmitArtworkFromMyCollection",
  "SelectArtist",
  "AddTitle",
  "AddPhotos",
  "AddDetails",
  "PurchaseHistory",
  "AddDimensions",
  "AddPhoneNumber",
]

export const SUBMIT_ARTWORK_DRAFT_SUBMISSION_STEPS: SubmitArtworkScreen[] = [
  "StartFlow",
  ...TIER_1_STEPS,
  "CompleteYourSubmission",
  "ArtistRejected",
]

const TIER_2_STEPS: SubmitArtworkScreen[] = [
  "ShippingLocation",
  "FrameInformation",
  "AdditionalDocuments",
  "Condition",
]

export const SUBMIT_ARTWORK_APPROVED_SUBMISSION_STEPS: SubmitArtworkScreen[] = [
  "StartFlow",
  ...TIER_1_STEPS,
  ...TIER_2_STEPS,
  "CompleteYourSubmission",
  "CompleteYourSubmissionPostApproval",
  "ArtistRejected",
]

export const TIER_1_STATES = ["DRAFT", "SUBMITTED"]
