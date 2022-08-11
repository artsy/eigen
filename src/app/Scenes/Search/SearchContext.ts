import { InputRef } from "palette"
import { createContext, Ref, useRef } from "react"

export const SearchContext = createContext<{
  inputRef: Ref<InputRef>
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
