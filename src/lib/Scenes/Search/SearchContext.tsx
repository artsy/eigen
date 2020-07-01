import React, { RefObject } from "react"
import { Input } from "./Input"

export const SearchContext = React.createContext<{
  inputRef: RefObject<Input>
  query: RefObject<string>
}>(null as any)
