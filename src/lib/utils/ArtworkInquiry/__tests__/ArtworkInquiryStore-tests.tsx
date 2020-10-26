import { reducer } from "lib/utils/ArtworkInquiry/ArtworkInquiryStore"
import { ArtworkInquiryActions, ArtworkInquiryContextState } from "lib/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { InquiryOptions } from "lib/utils/ArtworkInquiry/ArtworkInquiryTypes"

let inquiryState: ArtworkInquiryContextState
let inquiryAction: ArtworkInquiryActions

describe("selectInquiryType", () => {
  it("updates the global state when payload is Request Price", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryType: null,
    }

    inquiryAction = {
      type: "selectInquiryType",
      payload: InquiryOptions.RequestPrice,
    }

    const r = reducer(inquiryState, inquiryAction)

    expect(r).toEqual({
      shippingLocation: null,
      inquiryType: "Request price",
    })
  })

  it("updates the global state when payload is Contact gallery", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryType: null,
    }

    inquiryAction = {
      type: "selectInquiryType",
      payload: InquiryOptions.ContactGallery,
    }

    const r = reducer(inquiryState, inquiryAction)

    expect(r).toEqual({
      shippingLocation: null,
      inquiryType: "Contact gallery",
    })
  })

  it("updates the global state when payload is Inquire to purchase", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryType: null,
    }

    inquiryAction = {
      type: "selectInquiryType",
      payload: InquiryOptions.InquireToPurchase,
    }

    const r = reducer(inquiryState, inquiryAction)

    expect(r).toEqual({
      shippingLocation: null,
      inquiryType: "Inquire to purchase",
    })
  })
})

// TODO: Add tests for location reducer
// describe("selectShippingLocation", () => {})
