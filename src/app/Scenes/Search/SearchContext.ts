import { Input2Ref } from "@artsy/palette-mobile"
import { createContext, Ref, RefObject, useRef } from "react"

export const SearchContext = createContext<{
  inputRef: RefObject<Input2Ref>
  queryRef: Ref<string>
}>(null as any)

export function useSearchProviderValues(query: string) {
  const inputRef = useRef<Input2Ref>(null)
  const queryRef = useRef(query)
  queryRef.current = query

  return {
    inputRef,
    queryRef,
  }
}
