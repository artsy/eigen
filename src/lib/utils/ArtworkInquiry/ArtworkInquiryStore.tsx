import {
  ArtworkInquiryActions,
  ArtworkInquiryContextProps,
  ArtworkInquiryContextState,
} from "lib/utils/ArtworkInquiry/ArtworkInquiryTypes"
import React, { createContext, Reducer, useReducer } from "react"

const artworkInquiryState: ArtworkInquiryContextState = {
  shippingLocation: null,
  inquiryType: null,
}

// NOTE: We will need to handle clearing the location fields and other CRUD like actions
// But since we are working this in different streams we'll have to come back to this
export const reducer = (
  inquiryState: ArtworkInquiryContextState,
  action: ArtworkInquiryActions
): ArtworkInquiryContextState => {
  switch (action.type) {
    case "selectInquiryType":
      return {
        shippingLocation: inquiryState.shippingLocation,
        inquiryType: action.payload,
      }

    case "selectShippingLocation":
      return {
        shippingLocation: action.payload,
        inquiryType: inquiryState.inquiryType,
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
