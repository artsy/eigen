import { InquiryQuestionInput } from "__generated__/SubmitInquiryRequestMutation.graphql"
import {
  ArtworkInquiryActions,
  ArtworkInquiryContextProps,
  ArtworkInquiryContextState,
} from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { createContext, Reducer, useReducer } from "react"

const initialArtworkInquiryState: ArtworkInquiryContextState = {
  shippingLocation: null,
  inquiryQuestions: [],
  message: undefined,
  isInquiryDialogOpen: false,
  isShippingQuestionDialogOpen: false,
  isInquirySuccessNotificationOpen: false,
}

export const reducer = (
  inquiryState: ArtworkInquiryContextState,
  action: ArtworkInquiryActions
): ArtworkInquiryContextState => {
  switch (action.type) {
    case "resetForm":
      return {
        ...inquiryState,
        shippingLocation: initialArtworkInquiryState.shippingLocation,
        inquiryQuestions: initialArtworkInquiryState.inquiryQuestions,
        message: initialArtworkInquiryState.message,
      }
    case "selectShippingLocation":
      return {
        ...inquiryState,
        shippingLocation: action.payload,
      }
    case "selectInquiryQuestion": {
      const { isChecked, ...payloadQuestion } = action.payload
      const { inquiryQuestions = [] } = inquiryState
      const newSelection: InquiryQuestionInput[] = isChecked
        ? [...inquiryQuestions, payloadQuestion]
        : inquiryQuestions.filter((q) => q.questionID !== payloadQuestion.questionID)

      return {
        ...inquiryState,
        inquiryQuestions: newSelection,
      }
    }
    case "setMessage":
      return {
        ...inquiryState,
        message: action.payload,
      }
    case "openInquiryDialog": {
      return {
        ...inquiryState,
        isInquiryDialogOpen: true,
      }
    }
    case "closeInquiryDialog": {
      return {
        ...inquiryState,
        isInquiryDialogOpen: false,
      }
    }
    case "openShippingQuestionDialog": {
      return {
        ...inquiryState,
        isInquiryDialogOpen: false,
        isShippingQuestionDialogOpen: true,
      }
    }
    case "closeShippingQuestionDialog": {
      return {
        ...inquiryState,
        isInquiryDialogOpen: true,
        isShippingQuestionDialogOpen: false,
      }
    }
    case "openInquirySuccessNotification": {
      return {
        ...inquiryState,
        isInquirySuccessNotificationOpen: true,
      }
    }
    case "closeInquirySuccessNotification": {
      return {
        ...inquiryState,
        isInquirySuccessNotificationOpen: false,
      }
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
