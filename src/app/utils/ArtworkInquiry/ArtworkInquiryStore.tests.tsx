import { reducer } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import {
  ArtworkInquiryActions,
  ArtworkInquiryContextState,
  InquiryOptions,
} from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"

let inquiryState: ArtworkInquiryContextState
let inquiryAction: ArtworkInquiryActions

describe("selectInquiryType", () => {
  it("updates the global state when payload is Request Price", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryType: null,
      inquiryQuestions: [],
      message: null,
      isProfileUpdatePromptVisible: false,
    }

    inquiryAction = {
      type: "selectInquiryType",
      payload: InquiryOptions.RequestPrice,
    }

    const r = reducer(inquiryState, inquiryAction)

    expect(r).toEqual({
      shippingLocation: null,
      inquiryType: "Inquire on price",
      inquiryQuestions: [{ questionID: "price_and_availability" }],
      message: null,
      isProfileUpdatePromptVisible: false,
    })
  })

  it("updates the global state when payload is Contact gallery", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryType: null,
      inquiryQuestions: [],
      message: null,
      isProfileUpdatePromptVisible: false,
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
      message: null,
      isProfileUpdatePromptVisible: false,
    })
  })

  it("updates the global state when payload is Inquire to purchase", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryType: null,
      inquiryQuestions: [],
      message: null,
      isProfileUpdatePromptVisible: false,
    }

    inquiryAction = {
      type: "selectInquiryType",
      payload: InquiryOptions.InquireToPurchase,
    }

    const r = reducer(inquiryState, inquiryAction)

    expect(r).toEqual({
      shippingLocation: null,
      inquiryType: "Inquire to purchase",
      inquiryQuestions: [],
      message: null,
      isProfileUpdatePromptVisible: false,
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
      message: null,
      isProfileUpdatePromptVisible: false,
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
      message: null,
      isProfileUpdatePromptVisible: false,
    })
  })

  it("when a question is deselected it gets removed from the inquiryQuestions array", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryType: "Inquire to purchase",
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
      message: null,
      isProfileUpdatePromptVisible: false,
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
      inquiryType: "Inquire to purchase",
      inquiryQuestions: [{ questionID: "shipping_quote", details: null }],
      message: null,
      isProfileUpdatePromptVisible: false,
    })
  })
})
