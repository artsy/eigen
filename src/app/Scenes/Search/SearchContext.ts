import { InputRef } from "@artsy/palette-mobile"
import { createContext, Ref, RefObject, useRef } from "react"

export const SearchContext = createContext<{
  inputRef: RefObject<InputRef | null>
  queryRef: Ref<string>
}>(null as any)

export function useSearchProviderValues(query: string) {
  const inputRef = useRef<InputRef>(null)
  const queryRef = useRef(query)
  queryRef.current = query

  return {
    inputRef,
    queryRef,
  }
}
