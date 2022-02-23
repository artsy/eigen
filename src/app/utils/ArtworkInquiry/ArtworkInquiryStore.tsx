import { InquiryQuestionInput } from "__generated__/SubmitInquiryRequestMutation.graphql"
import {
  ArtworkInquiryActions,
  ArtworkInquiryContextProps,
  ArtworkInquiryContextState,
  InquiryOptions,
  InquiryQuestionIDs,
} from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import React, { createContext, Reducer, useReducer } from "react"

const initialArtworkInquiryState: ArtworkInquiryContextState = {
  shippingLocation: null,
  inquiryType: null,
  inquiryQuestions: [],
  message: null,
}

export const reducer = (
  inquiryState: ArtworkInquiryContextState,
  action: ArtworkInquiryActions
): ArtworkInquiryContextState => {
  switch (action.type) {
    case "resetForm":
      return initialArtworkInquiryState
    case "selectInquiryType":
      return {
        ...inquiryState,
        inquiryType: action.payload,
        inquiryQuestions:
          action.payload === InquiryOptions.RequestPrice
            ? [{ questionID: InquiryQuestionIDs.PriceAndAvailability }]
            : inquiryState.inquiryQuestions,
      }

    case "selectShippingLocation":
      return {
        ...inquiryState,
        shippingLocation: action.payload,
      }

    case "selectInquiryQuestion":
      const { isChecked, ...payloadQuestion } = action.payload
      const { inquiryQuestions = [] } = inquiryState
      const newSelection: InquiryQuestionInput[] = isChecked
        ? [...inquiryQuestions, payloadQuestion]
        : inquiryQuestions.filter((q) => q.questionID !== payloadQuestion.questionID)

      return {
        ...inquiryState,
        inquiryQuestions: newSelection,
      }
    case "setMessage":
      return {
        ...inquiryState,
        message: action.payload,
      }
  }
}

export const ArtworkInquiryContext = createContext<ArtworkInquiryContextProps>(null as any)

export const ArtworkInquiryStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer<Reducer<ArtworkInquiryContextState, ArtworkInquiryActions>>(
    reducer,
    initialArtworkInquiryState
  )
  return (
    <ArtworkInquiryContext.Provider value={{ state, dispatch }}>
      {children}
    </ArtworkInquiryContext.Provider>
  )
}
