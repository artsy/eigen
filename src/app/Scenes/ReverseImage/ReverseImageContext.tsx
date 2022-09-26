import { createContext, useContext } from "react"
import { ReverseImageOwner } from "./types"

export interface ReverseImageContextValue {
  isRootScreenFocused: boolean
  analytics: {
    owner: ReverseImageOwner
  }
}

export const ReverseImageContext = createContext<ReverseImageContextValue>(null as any)

export const useReverseImageContext = () => {
  return useContext(ReverseImageContext)
}
