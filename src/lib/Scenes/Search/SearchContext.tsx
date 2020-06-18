import { Input } from "lib/Components/Input/Input"
import React, { RefObject } from "react"

export const SearchContext = React.createContext<{
  inputRef: RefObject<Input>
  query: RefObject<string>
}>(null as any)
