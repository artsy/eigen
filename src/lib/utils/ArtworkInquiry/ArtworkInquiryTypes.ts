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

export type InquiryTypes = "Request Price" | "Contact Gallery" | "Inquire to Purchase"

interface SelectInquiryType {
  type: "selectInquiryType"
  payload: InquiryTypes
}

interface SelectLocation {
  type: "selectShippingLocation"
  payload: string
}

export enum InquiryOptions {
  RequestPrice = "Request Price",
  ContactGallery = "Contact Gallery",
  InquireToPurchase = "Inquire to Purchase",
  PriceAvailability = "Price & Availability",
  Shipping = "Shipping",
}
