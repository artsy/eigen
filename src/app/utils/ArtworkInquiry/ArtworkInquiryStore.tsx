import { InquiryQuestionInput } from "__generated__/useSubmitInquiryRequestMutation.graphql"
import {
  ArtworkInquiryActions,
  ArtworkInquiryContextProps,
  ArtworkInquiryContextState,
} from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { createContext, Reducer, useReducer } from "react"

export const initialArtworkInquiryState: ArtworkInquiryContextState = {
  shippingLocation: null,
  inquiryQuestions: [],
  message: null,
  successNotificationVisible: false,
  collectionPromptVisible: false,
  profilePromptVisible: false,
}

export const reducer = (
  inquiryState: ArtworkInquiryContextState,
  action: ArtworkInquiryActions
): ArtworkInquiryContextState => {
  switch (action.type) {
    case "resetForm":
      return initialArtworkInquiryState

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
    case "setSuccessNotificationVisible":
      return {
        ...inquiryState,
        successNotificationVisible: action.payload,
      }
    case "setCollectionPromptVisible":
      return {
        ...inquiryState,
        collectionPromptVisible: action.payload,
      }
    case "setProfilePromptVisible":
      console.log("🦃", action.payload)
      return {
        ...inquiryState,
        profilePromptVisible: action.payload,
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
