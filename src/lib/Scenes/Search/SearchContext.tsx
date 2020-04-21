import React, { MutableRefObject } from "react"
import { Input } from "./Input"

export const SearchContext = React.createContext<{
  inputRef: MutableRefObject<Input>
  query: MutableRefObject<string>
}>(null as any /* STRICTNESS_MIGRATION */)
