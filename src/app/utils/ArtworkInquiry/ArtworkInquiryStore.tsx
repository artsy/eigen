import { InquiryQuestionInput } from "__generated__/useSubmitInquiryRequestMutation.graphql"
import {
  ArtworkInquiryActions,
  ArtworkInquiryContextProps,
  ArtworkInquiryContextState,
} from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { createContext, useContext, useReducer } from "react"

export const initialArtworkInquiryState: ArtworkInquiryContextState = {
  shippingLocation: null,
  inquiryQuestions: [],
  inquiryModalVisible: false,
  collectionPromptVisible: false,
  profilePromptVisible: false,
}

export const artworkInquiryStateReducer = (
  inquiryState: ArtworkInquiryContextState,
  action: ArtworkInquiryActions
): ArtworkInquiryContextState => {
  switch (action.type) {
    case "resetForm":
      return {
        ...inquiryState,
        inquiryQuestions: [],
        shippingLocation: null,
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
    case "setInquiryModalVisible":
      return {
        ...inquiryState,
        inquiryModalVisible: action.payload,
      }
    case "setCollectionPromptVisible":
      return {
        ...inquiryState,
        collectionPromptVisible: action.payload,
      }
    case "setProfilePromptVisible":
      return {
        ...inquiryState,
        profilePromptVisible: action.payload,
      }
  }
}

export const ArtworkInquiryContext = createContext<ArtworkInquiryContextProps>(null as any)

export const useArtworkInquiryContext = () => useContext(ArtworkInquiryContext)

export const ArtworkInquiryStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer<ArtworkInquiryContextState, [ArtworkInquiryActions]>(
    artworkInquiryStateReducer,
    initialArtworkInquiryState
  )

  return (
    <ArtworkInquiryContext.Provider value={{ state, dispatch }}>
      {children}
    </ArtworkInquiryContext.Provider>
  )
}
