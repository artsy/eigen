import { Input } from "palette"
import React, { RefObject, useRef } from "react"

export const SearchContext = React.createContext<{
  inputRef: RefObject<Input>
  queryRef: RefObject<string>
}>(null as any)

export function useSearchProviderValues(query: string) {
  const inputRef = useRef<Input>(null)
  const queryRef = useRef(query)
  queryRef.current = query

  return {
    inputRef,
    queryRef,
  }
}
