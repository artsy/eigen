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
      inquiryType: "Request Price",
    })
  })

  it("updates the global state when payload is Contact Gallery", () => {
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
      inquiryType: "Contact Gallery",
    })
  })

  it("updates the global state when payload is Inquire to Purchase", () => {
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
      inquiryType: "Inquire to Purchase",
    })
  })
})

// TODO: Add tests for location reducer
// describe("selectShippingLocation", () => {})
