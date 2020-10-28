import { Dispatch } from "react"

export type ArtworkInquiryActions = SelectInquiryType | SelectLocation | HandleSentMessageNotification

export interface ArtworkInquiryContextProps {
  state: ArtworkInquiryContextState
  dispatch: Dispatch<ArtworkInquiryActions>
}

export interface ArtworkInquiryContextState {
  readonly inquiryType: InquiryTypes | null
  readonly shippingLocation: string | null
  readonly showMessageSentNotification: boolean
}

export type InquiryTypes = "Request Price" | "Contact Gallery" | "Inquire to Purchase"

interface SelectInquiryType {
  type: "selectInquiryType"
  payload: InquiryTypes
}

interface SelectLocation {
  type: "selectShippingLocation"
  payload: string
}

interface HandleSentMessageNotification {
  type: "showMessageSentNotification"
  payload: boolean
}

export enum InquiryOptions {
  RequestPrice = "Request Price",
  ContactGallery = "Contact Gallery",
  InquireToPurchase = "Inquire to Purchase",
}

/**
 * NOTE: This is a subset of https://github.com/artsy/gravity/blob/66ced0ea399eb3179163223a5901c526a0954570/app/models/domain/inquiry_request.rb#L83.
 * These id values are expected to stay the same, even if the text value of the questions change.
 */
export enum InquiryQuestionIDs {
  Shipping = "shipping_quote",
  PriceAndAvailability = "price_and_availability",
}
