import { InquiryQuestionInput } from "__generated__/useSubmitInquiryRequestMutation.graphql"
import {
  ArtworkInquiryActions,
  ArtworkInquiryContextProps,
  ArtworkInquiryContextState,
} from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { createContext, Reducer, useContext, useReducer } from "react"

export const initialArtworkInquiryState: ArtworkInquiryContextState = {
  shippingLocation: null,
  inquiryQuestions: [],
  inquiryModalVisible: false,
  successNotificationVisible: false,
  collectionPromptVisible: false,
  profilePromptVisible: false,
  isMyCollectionArtistsPromptVisible: false,
}

export const artworkInquiryStateReducer = (
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
    case "setInquiryModalVisible":
      return {
        ...inquiryState,
        inquiryModalVisible: action.payload,
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
      return {
        ...inquiryState,
        profilePromptVisible: action.payload,
      }
    case "setMyCollectionArtistsPromptVisible":
      return {
        ...inquiryState,
        isMyCollectionArtistsPromptVisible: action.payload,
      }
  }
}

export const ArtworkInquiryContext = createContext<ArtworkInquiryContextProps>(null as any)

export const useArtworkInquiryContext = () => useContext(ArtworkInquiryContext)

export const ArtworkInquiryStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer<Reducer<ArtworkInquiryContextState, ArtworkInquiryActions>>(
    artworkInquiryStateReducer,
    initialArtworkInquiryState
  )

  return (
    <ArtworkInquiryContext.Provider value={{ state, dispatch }}>
      {children}
    </ArtworkInquiryContext.Provider>
  )
}
