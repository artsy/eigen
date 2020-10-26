import { Dispatch } from "react"

export type ArtworkInquiryActions = SelectInquiryType | SelectLocation

export interface ArtworkInquiryContextProps {
  state: ArtworkInquiryContextState
  dispatch: Dispatch<ArtworkInquiryActions>
}

export interface ArtworkInquiryContextState {
  readonly inquiryType: InquiryTypes | null
  readonly shippingLocation: string | null
}

export type InquiryTypes = "Inquire on price" | "Contact gallery" | "Inquire to purchase"

interface SelectInquiryType {
  type: "selectInquiryType"
  payload: InquiryTypes
}

interface SelectLocation {
  type: "selectShippingLocation"
  payload: string
}

export enum InquiryOptions {
  RequestPrice = "Inquire on price",
  ContactGallery = "Contact gallery",
  InquireToPurchase = "Inquire to purchase",
}

/**
 * NOTE: This is a subset of https://github.com/artsy/gravity/blob/66ced0ea399eb3179163223a5901c526a0954570/app/models/domain/inquiry_request.rb#L83.
 * These id values are expected to stay the same, even if the text value of the questions change.
 */
export enum InquiryQuestionIDs {
  Shipping = "shipping_quote",
  PriceAndAvailability = "price_and_availability",
}
