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
      inquiryQuestions: [],
    }

    inquiryAction = {
      type: "selectInquiryType",
      payload: InquiryOptions.RequestPrice,
    }

    const r = reducer(inquiryState, inquiryAction)

    expect(r).toEqual({
      shippingLocation: null,
      inquiryType: "Request Price",
      inquiryQuestions: [{ questionID: "price_and_availability" }],
    })
  })

  it("updates the global state when payload is Contact Gallery", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryType: null,
      inquiryQuestions: [],
    }

    inquiryAction = {
      type: "selectInquiryType",
      payload: InquiryOptions.ContactGallery,
    }

    const r = reducer(inquiryState, inquiryAction)

    expect(r).toEqual({
      shippingLocation: null,
      inquiryType: "Contact Gallery",
      inquiryQuestions: [],
    })
  })

  it("updates the global state when payload is Inquire to Purchase", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryType: null,
      inquiryQuestions: [],
    }

    inquiryAction = {
      type: "selectInquiryType",
      payload: InquiryOptions.InquireToPurchase,
    }

    const r = reducer(inquiryState, inquiryAction)

    expect(r).toEqual({
      shippingLocation: null,
      inquiryType: "Inquire to Purchase",
      inquiryQuestions: [],
    })
  })
})

// TODO: Add tests for location reducer
// describe("selectShippingLocation", () => {})

describe("selectInquiryQuestion", () => {
  it("when a question is checked it pushes that question into the inquiryQuestions array", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryType: null,
      inquiryQuestions: [],
    }

    inquiryAction = {
      type: "selectInquiryQuestion",
      payload: {
        questionID: "condition_and_provenance",
        details: null,
        isChecked: true,
      },
    }

    const r = reducer(inquiryState, inquiryAction)

    expect(r).toEqual({
      shippingLocation: null,
      inquiryType: null,
      inquiryQuestions: [{ questionID: "condition_and_provenance", details: null }],
    })
  })

  it("when a question is deselected it gets removed from the inquiryQuestions array", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryType: "Inquire to Purchase",
      inquiryQuestions: [
        {
          questionID: "shipping_quote",
          details: null,
        },
        {
          questionID: "condition_and_provenance",
          details: null,
        },
      ],
    }

    inquiryAction = {
      type: "selectInquiryQuestion",
      payload: {
        questionID: "condition_and_provenance",
        details: null,
        isChecked: false,
      },
    }

    const r = reducer(inquiryState, inquiryAction)

    expect(r).toEqual({
      shippingLocation: null,
      inquiryType: "Inquire to Purchase",
      inquiryQuestions: [{ questionID: "shipping_quote", details: null }],
    })
  })
})
