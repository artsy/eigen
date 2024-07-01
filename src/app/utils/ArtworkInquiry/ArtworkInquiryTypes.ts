import { InquiryQuestionInput } from "__generated__/SubmitInquiryRequestMutation.graphql"
import { LocationWithDetails } from "app/utils/googleMaps"
import { Dispatch } from "react"

export type ArtworkInquiryActions =
  | SelectInquiryType
  | SelectLocation
  | SelectInquiryQuestion
  | SetMessage
  | ResetForm
  | ShowProfileUpdatePrompt
  | HideProfileUpdatePrompt

export interface ArtworkInquiryContextProps {
  state: ArtworkInquiryContextState
  dispatch: Dispatch<ArtworkInquiryActions>
}

export interface ArtworkInquiryContextState {
  readonly inquiryType: InquiryTypes | null
  readonly shippingLocation: LocationWithDetails | null
  readonly inquiryQuestions: InquiryQuestionInput[]
  readonly message: string | null
  readonly isProfileUpdatePromptVisible: boolean
}

export type InquiryTypes = "Inquire on price" | "Contact Gallery" | "Inquire to purchase"

interface ResetForm {
  type: "resetForm"
  payload: null
}
interface SelectInquiryType {
  type: "selectInquiryType"
  payload: InquiryTypes
}

interface SelectLocation {
  type: "selectShippingLocation"
  payload: LocationWithDetails
}

interface SetMessage {
  type: "setMessage"
  payload: string
}

interface SelectInquiryQuestion {
  type: "selectInquiryQuestion"
  payload: InquiryQuestionInput & { isChecked: boolean }
}

interface ShowProfileUpdatePrompt {
  type: "showProfileUpdatePrompt"
}

interface HideProfileUpdatePrompt {
  type: "hideProfileUpdatePrompt"
}

export enum InquiryOptions {
  RequestPrice = "Inquire on price",
  ContactGallery = "Contact Gallery",
  InquireToPurchase = "Inquire to purchase",
}

/**
 * NOTE: This is a subset of https://github.com/artsy/gravity/blob/66ced0ea399eb3179163223a5901c526a0954570/app/models/domain/inquiry_request.rb#L83.
 * These id values are expected to stay the same, even if the text value of the questions change.
 */
export enum InquiryQuestionIDs {
  Shipping = "shipping_quote",
  PriceAndAvailability = "price_and_availability",
  ConditionAndProvance = "condition_and_provenance",
  SimilarWork = "similar_work",
  ArtistInformation = "artist_information",
  ArtworkInformation = "artwork_information",
}
