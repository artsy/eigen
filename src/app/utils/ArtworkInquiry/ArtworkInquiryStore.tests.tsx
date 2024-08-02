import {
  initialArtworkInquiryState,
  artworkInquiryStateReducer,
} from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { ArtworkInquiryActions } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"

describe("selectInquiryQuestion", () => {
  it("when a question is checked it pushes that question into the inquiryQuestions array", () => {
    const inquiryAction: ArtworkInquiryActions = {
      type: "selectInquiryQuestion",
      payload: {
        questionID: "condition_and_provenance",
        details: null,
        isChecked: true,
      },
    }

    const r = artworkInquiryStateReducer(initialArtworkInquiryState, inquiryAction)

    expect(r).toEqual({
      ...initialArtworkInquiryState,
      inquiryQuestions: [{ questionID: "condition_and_provenance", details: null }],
    })
  })

  it("when a question is deselected it gets removed from the inquiryQuestions array", () => {
    const modifiedArtworkInquiryState = {
      ...initialArtworkInquiryState,
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

    const inquiryAction: ArtworkInquiryActions = {
      type: "selectInquiryQuestion",
      payload: {
        questionID: "condition_and_provenance",
        details: null,
        isChecked: false,
      },
    }

    const r = artworkInquiryStateReducer(modifiedArtworkInquiryState, inquiryAction)

    expect(r).toEqual({
      ...modifiedArtworkInquiryState,
      inquiryQuestions: [{ questionID: "shipping_quote", details: null }],
    })
  })
})
