import {
  ArtworkInquiryActions,
  ArtworkInquiryContextProps,
  ArtworkInquiryContextState,
  InquiryOptions,
  InquiryQuestionIDs,
} from "lib/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { remove } from "lodash"
import React, { createContext, Reducer, useReducer } from "react"

const artworkInquiryState: ArtworkInquiryContextState = {
  shippingLocation: null,
  inquiryType: null,
  inquiryQuestions: [],
}

export const reducer = (
  inquiryState: ArtworkInquiryContextState,
  action: ArtworkInquiryActions
): ArtworkInquiryContextState => {
  switch (action.type) {
    case "resetForm":
      return artworkInquiryState
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

      if (isChecked) {
        inquiryState.inquiryQuestions.push(payloadQuestion)
      } else {
        remove(inquiryState.inquiryQuestions, (question) => question.questionID === payloadQuestion.questionID)
      }

      return {
        ...inquiryState,
        inquiryQuestions: inquiryState.inquiryQuestions,
      }
  }
}

export const ArtworkInquiryContext = createContext<ArtworkInquiryContextProps>(null as any)

export const ArtworkInquiryStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer<Reducer<ArtworkInquiryContextState, ArtworkInquiryActions>>(
    reducer,
    artworkInquiryState
  )
  return <ArtworkInquiryContext.Provider value={{ state, dispatch }}>{children}</ArtworkInquiryContext.Provider>
}
