import { initialArtworkInquiryState, reducer } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import {
  ArtworkInquiryActions,
  ArtworkInquiryContextState,
} from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"

describe("reducer", () => {
  const inquiryState: ArtworkInquiryContextState = initialArtworkInquiryState

  describe("selectShippingLocation", () => {
    it("sets the shipping location in the global state", () => {
      const action: ArtworkInquiryActions = {
        type: "selectShippingLocation",
        payload: {
          id: "123",
          name: "Artsy HQ",
          city: "New York",
          state: "NY",
          postalCode: "10013",
          country: "US",
        },
      }

      const r = reducer(inquiryState, action)

      expect(r).toEqual({
        shippingLocation: {
          id: "123",
          name: "Artsy HQ",
          city: "New York",
          state: "NY",
          postalCode: "10013",
          country: "US",
        },
        inquiryQuestions: [],
        message: undefined,
        isInquiryDialogOpen: false,
        isShippingQuestionDialogOpen: false,
        isInquirySuccessNotificationOpen: false,
      })
    })
  })

  describe("selectInquiryQuestion", () => {
    it("adds a question to the global state", () => {
      const action: ArtworkInquiryActions = {
        type: "selectInquiryQuestion",
        payload: {
          questionID: "shipping_quote",
          details: null,
          isChecked: true,
        },
      }

      const r = reducer(inquiryState, action)

      expect(r).toEqual({
        shippingLocation: null,
        inquiryQuestions: [
          {
            questionID: "shipping_quote",
            details: null,
          },
        ],
        message: undefined,
        isInquiryDialogOpen: false,
        isShippingQuestionDialogOpen: false,
        isInquirySuccessNotificationOpen: false,
      })
    })

    it("removes a question from the global state", () => {
      const inquiryState: ArtworkInquiryContextState = {
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

      const action: ArtworkInquiryActions = {
        type: "selectInquiryQuestion",
        payload: {
          questionID: "shipping_quote",
          details: null,
          isChecked: false,
        },
      }

      const r = reducer(inquiryState, action)

      expect(r).toEqual({
        shippingLocation: null,
        inquiryQuestions: [
          {
            questionID: "condition_and_provenance",
            details: null,
          },
        ],
        message: undefined,
        isInquiryDialogOpen: false,
        isShippingQuestionDialogOpen: false,
        isInquirySuccessNotificationOpen: false,
      })
    })
  })

  describe("setMessage", () => {
    it("sets the message in the global state", () => {
      const action: ArtworkInquiryActions = {
        type: "setMessage",
        payload: "Hello",
      }

      const r = reducer(inquiryState, action)

      expect(r).toEqual({
        shippingLocation: null,
        inquiryQuestions: [],
        message: "Hello",
        isInquiryDialogOpen: false,
        isShippingQuestionDialogOpen: false,
        isInquirySuccessNotificationOpen: false,
      })
    })
  })

  describe("resetForm", () => {
    it("resets the form fields to their initial state", () => {
      const inquiryState: ArtworkInquiryContextState = {
        shippingLocation: {
          id: "",
          name: "",
          city: "New York",
          state: "NY",
          postalCode: "10013",
          country: "US",
        },
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
        message: "Hello",
        isInquiryDialogOpen: true,
        isShippingQuestionDialogOpen: false,
        isInquirySuccessNotificationOpen: false,
      }

      const action: ArtworkInquiryActions = {
        type: "resetForm",
      }

      const r = reducer(inquiryState, action)

      expect(r).toEqual({
        shippingLocation: null,
        inquiryQuestions: [],
        message: undefined,
        isInquiryDialogOpen: true,
        isShippingQuestionDialogOpen: false,
        isInquirySuccessNotificationOpen: false,
      })
    })
  })

  describe("openInquiryDialog", () => {
    it("opens the inquiry dialog", () => {
      const action: ArtworkInquiryActions = {
        type: "openInquiryDialog",
      }

      const r = reducer(inquiryState, action)

      expect(r).toEqual({
        shippingLocation: null,
        inquiryQuestions: [],
        message: undefined,
        isInquiryDialogOpen: true,
        isShippingQuestionDialogOpen: false,
        isInquirySuccessNotificationOpen: false,
      })
    })
  })

  describe("closeInquiryDialog", () => {
    it("closes the inquiry dialog without resetting the form", () => {
      const inquiryState: ArtworkInquiryContextState = {
        ...initialArtworkInquiryState,
        inquiryQuestions: [
          {
            questionID: "condition_and_provenance",
            details: null,
          },
        ],
        message: "Hello",
        isInquiryDialogOpen: true,
      }

      const action: ArtworkInquiryActions = {
        type: "closeInquiryDialog",
      }

      const r = reducer(inquiryState, action)

      expect(r).toEqual({
        shippingLocation: null,
        inquiryQuestions: [
          {
            questionID: "condition_and_provenance",
            details: null,
          },
        ],
        message: "Hello",
        isInquiryDialogOpen: false,
        isShippingQuestionDialogOpen: false,
        isInquirySuccessNotificationOpen: false,
      })
    })
  })

  describe("openShippingQuestionDialog", () => {
    it("opens the shipping question dialog", () => {
      const action: ArtworkInquiryActions = {
        type: "openShippingQuestionDialog",
      }

      const r = reducer(inquiryState, action)

      expect(r).toEqual({
        shippingLocation: null,
        inquiryQuestions: [],
        message: undefined,
        isInquiryDialogOpen: false,
        isShippingQuestionDialogOpen: true,
        isInquirySuccessNotificationOpen: false,
      })
    })
  })

  describe("closeShippingQuestionDialog", () => {
    it("closes the shipping question dialog", () => {
      const action: ArtworkInquiryActions = {
        type: "closeShippingQuestionDialog",
      }

      const r = reducer(inquiryState, action)

      expect(r).toEqual({
        shippingLocation: null,
        inquiryQuestions: [],
        message: undefined,
        isInquiryDialogOpen: false,
        isShippingQuestionDialogOpen: false,
        isInquirySuccessNotificationOpen: false,
      })
    })
  })

  describe("openInquirySuccessNotification", () => {
    it("opens the inquiry success notification", () => {
      const action: ArtworkInquiryActions = {
        type: "openInquirySuccessNotification",
      }

      const r = reducer(inquiryState, action)

      expect(r).toEqual({
        shippingLocation: null,
        inquiryQuestions: [],
        message: undefined,
        isInquiryDialogOpen: false,
        isShippingQuestionDialogOpen: false,
        isInquirySuccessNotificationOpen: true,
      })
    })
  })

  describe("closeInquirySuccessNotification", () => {
    it("closes the inquiry success notification", () => {
      const action: ArtworkInquiryActions = {
        type: "closeInquirySuccessNotification",
      }

      const r = reducer(inquiryState, action)

      expect(r).toEqual({
        shippingLocation: null,
        inquiryQuestions: [],
        message: undefined,
        isInquiryDialogOpen: false,
        isShippingQuestionDialogOpen: false,
        isInquirySuccessNotificationOpen: false,
      })
    })
  })
})
