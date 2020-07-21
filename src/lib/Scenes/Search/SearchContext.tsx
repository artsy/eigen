import { Input } from "lib/Components/Input/Input"
import React, { RefObject, useRef } from "react"

export const SearchContext = React.createContext<{
  inputRef: RefObject<Input>
  queryRef: RefObject<string>
}>(null as any)

export function useSetupSearchContext(query: string) {
  const inputRef = useRef<Input>(null)
  const queryRef = useRef(query)
  queryRef.current = query

  return {
    inputRef,
    queryRef,
  }
}
