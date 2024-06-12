import { InquiryQuestionInput } from "__generated__/SubmitInquiryRequestMutation.graphql"
import { LocationWithDetails } from "app/utils/googleMaps"
import { Dispatch } from "react"

export type ArtworkInquiryActions =
  | SelectLocation
  | SelectInquiryQuestion
  | SetMessage
  | ResetForm
  | OpenInquiryDialog
  | CloseInquiryDialog
  | OpenShippingQuestionDialog
  | CloseShippingQuestionDialog
  | OpenInquirySuccessNotification
  | CloseInquirySuccessNotification

export interface ArtworkInquiryContextProps {
  state: ArtworkInquiryContextState
  dispatch: Dispatch<ArtworkInquiryActions>
}

export interface ArtworkInquiryContextState {
  readonly shippingLocation: LocationWithDetails | null
  readonly inquiryQuestions: InquiryQuestionInput[]
  readonly message: string | undefined
  readonly isInquiryDialogOpen: boolean
  readonly isShippingQuestionDialogOpen: boolean
  readonly isInquirySuccessNotificationOpen: boolean
}

interface ResetForm {
  type: "resetForm"
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

interface OpenInquiryDialog {
  type: "openInquiryDialog"
}

interface CloseInquiryDialog {
  type: "closeInquiryDialog"
}

interface OpenShippingQuestionDialog {
  type: "openShippingQuestionDialog"
}

interface CloseShippingQuestionDialog {
  type: "closeShippingQuestionDialog"
}

interface OpenInquirySuccessNotification {
  type: "openInquirySuccessNotification"
}

interface CloseInquirySuccessNotification {
  type: "closeInquirySuccessNotification"
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
