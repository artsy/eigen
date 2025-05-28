import { InquiryQuestionInput } from "__generated__/useSubmitInquiryRequestMutation.graphql"
import { LocationWithDetails } from "app/utils/googleMaps"
import { Dispatch } from "react"

export type ArtworkInquiryActions =
  | SelectLocation
  | SelectInquiryQuestion
  | ResetForm
  | SetInquiryModalVisible
  | SetCollectionPromptVisible
  | SetProfilePromptVisible

export interface ArtworkInquiryContextProps {
  state: ArtworkInquiryContextState
  dispatch: Dispatch<ArtworkInquiryActions>
}

export interface ArtworkInquiryContextState {
  readonly shippingLocation: LocationWithDetails | null
  readonly inquiryQuestions: InquiryQuestionInput[]
  readonly inquiryModalVisible: boolean
  readonly collectionPromptVisible: boolean
  readonly profilePromptVisible: boolean
}

interface ResetForm {
  type: "resetForm"
  payload: null
}

interface SelectLocation {
  type: "selectShippingLocation"
  payload: LocationWithDetails
}

interface SelectInquiryQuestion {
  type: "selectInquiryQuestion"
  payload: InquiryQuestionInput & { isChecked: boolean }
}

interface SetInquiryModalVisible {
  type: "setInquiryModalVisible"
  payload: boolean
}

interface SetCollectionPromptVisible {
  type: "setCollectionPromptVisible"
  payload: boolean
}

interface SetProfilePromptVisible {
  type: "setProfilePromptVisible"
  payload: boolean
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
