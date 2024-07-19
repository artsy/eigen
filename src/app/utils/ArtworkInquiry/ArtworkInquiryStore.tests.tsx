import { reducer } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import {
  ArtworkInquiryActions,
  ArtworkInquiryContextState,
} from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"

let inquiryState: ArtworkInquiryContextState
let inquiryAction: ArtworkInquiryActions

// TODO: Add tests for location reducer
// describe("selectShippingLocation", () => {})

describe("selectInquiryQuestion", () => {
  it("when a question is checked it pushes that question into the inquiryQuestions array", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryQuestions: [],
      message: null,
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
      inquiryQuestions: [{ questionID: "condition_and_provenance", details: null }],
      message: null,
    })
  })

  it("when a question is deselected it gets removed from the inquiryQuestions array", () => {
    inquiryState = {
      shippingLocation: null,
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
      inquiryQuestions: [{ questionID: "shipping_quote", details: null }],
      message: null,
    })
  })
})
