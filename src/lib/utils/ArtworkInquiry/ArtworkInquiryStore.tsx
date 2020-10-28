import {
  ArtworkInquiryActions,
  ArtworkInquiryContextProps,
  ArtworkInquiryContextState,
} from "lib/utils/ArtworkInquiry/ArtworkInquiryTypes"
import React, { createContext, Reducer, useReducer } from "react"

const artworkInquiryState: ArtworkInquiryContextState = {
  shippingLocation: null,
  inquiryType: null,
  showMessageSentNotification: false,
}

export const reducer = (
  inquiryState: ArtworkInquiryContextState,
  action: ArtworkInquiryActions
): ArtworkInquiryContextState => {
  switch (action.type) {
    case "showMessageSentNotification":
      return {
        shippingLocation: inquiryState.shippingLocation,
        inquiryType: inquiryState.inquiryType,
        showMessageSentNotification: action.payload,
      }

    case "selectInquiryType":
      return {
        shippingLocation: inquiryState.shippingLocation,
        inquiryType: action.payload,
        showMessageSentNotification: inquiryState.showMessageSentNotification,
      }

    case "selectShippingLocation":
      return {
        shippingLocation: action.payload,
        inquiryType: inquiryState.inquiryType,
        showMessageSentNotification: inquiryState.showMessageSentNotification,
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
