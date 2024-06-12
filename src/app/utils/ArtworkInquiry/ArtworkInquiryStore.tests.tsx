import { reducer } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import {
  ArtworkInquiryActions,
  ArtworkInquiryContextState,
} from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"

let inquiryState: ArtworkInquiryContextState
let inquiryAction: ArtworkInquiryActions

/**
 * TODO: Update these tests to match the changes in ArtworkInquiryStore and ArtworkInquiryType.
 *
 * Specifically, the tests should reflect that we only use the Contact Gallery inquiry type so the
 * other types were removed.
 */

describe("selectInquiryType", () => {
  it("updates the global state when payload is Request Price", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryQuestions: [],
      message: undefined,
      isInquiryDialogOpen: false,
      isShippingQuestionDialogOpen: false,
      isInquirySuccessNotificationOpen: false,
    }

    const r = reducer(inquiryState, inquiryAction)

    expect(r).toEqual({
      shippingLocation: null,
      inquiryType: "Inquire on price",
      inquiryQuestions: [{ questionID: "price_and_availability" }],
      message: null,
    })
  })

  it("updates the global state when payload is Contact gallery", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryQuestions: [],
      message: undefined,
      isInquiryDialogOpen: false,
      isShippingQuestionDialogOpen: false,
      isInquirySuccessNotificationOpen: false,
    }

    const r = reducer(inquiryState, inquiryAction)

    expect(r).toEqual({
      shippingLocation: null,
      inquiryType: "Contact Gallery",
      inquiryQuestions: [],
      message: null,
    })
  })

  it("updates the global state when payload is Inquire to purchase", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryQuestions: [],
      message: undefined,
      isInquiryDialogOpen: false,
      isShippingQuestionDialogOpen: false,
      isInquirySuccessNotificationOpen: false,
    }

    const r = reducer(inquiryState, inquiryAction)

    expect(r).toEqual({
      shippingLocation: null,
      inquiryType: "Inquire to purchase",
      inquiryQuestions: [],
      message: null,
    })
  })
})

// TODO: Add tests for location reducer
// describe("selectShippingLocation", () => {})

describe("selectInquiryQuestion", () => {
  it("when a question is checked it pushes that question into the inquiryQuestions array", () => {
    inquiryState = {
      shippingLocation: null,
      inquiryQuestions: [],
      message: undefined,
      isInquiryDialogOpen: false,
      isShippingQuestionDialogOpen: false,
      isInquirySuccessNotificationOpen: false,
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
      message: undefined,
      isInquiryDialogOpen: false,
      isShippingQuestionDialogOpen: false,
      isInquirySuccessNotificationOpen: false,
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
    })
  })
})
