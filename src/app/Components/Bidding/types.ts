export interface Address {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  country: Country
  postalCode: string
  phoneNumber: string
}

export interface Country {
  /*
   * the full text description or name of the address component as returned by the Geocoder.
   */
  longName: string

  /*
   * An abbreviated textual name for the address component, if available. For example, an address component for the
   * state of Alaska may have a long_name of "Alaska" and a short_name of "AK" using the 2-letter postal abbreviation.
   */
  shortName: string
}

export interface Bid {
  display: string
  cents: number
}

export interface BidderPositionResult {
  /*
   * Represents the status of a bidder position. The logic that determines the status is as follows:
   *
   *   bidder position created?
   *     - yes
   *       - bidder position processed?
   *         - yes
   *           --> OUTBID | RESERVE_NOT_MET | WINNING
   *         - no
   *           --> PENDING
   *     - no
   *       - do we know why?
   *         - yes
   *           --> SALE_CLOSED | LIVE_BIDDING_STARTED | BIDDER_NOT_QUALIFIED
   *         - no
   *           --> ERROR
   **/
  status: // bidder position status
  | "OUTBID"
    | "PENDING"
    | "RESERVE_NOT_MET"
    | "WINNING"
    // mutation status
    | "SALE_CLOSED"
    | "LIVE_BIDDING_STARTED"
    | "BIDDER_NOT_QUALIFIED"
    // general error status for e.g. Gravity not available, no internet in the device
    | "ERROR"
    // the createBidderPosition mutation may return 'SUCCESS' when it successfully placed a bid
    | "SUCCESS"

  messageHeader: string
  messageDescriptionMD: string
  position: {
    id: string
    suggestedNextBid: {
      cents: string
      display: string
    }
  }
}

// values from the Tipsi PaymentCardTextField component
export interface PaymentCardTextFieldParams {
  last4: string
  expiryMonth: string | number
  expiryYear: string | number
  name?: string
  addressLine1?: string
  addressLine2?: string
  addressCity?: string
  addressState?: string
  addressZip?: string
}
