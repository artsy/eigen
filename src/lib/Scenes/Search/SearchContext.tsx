import React, { MutableRefObject } from "react"
import { Input } from "./Input"

export const SearchContext = React.createContext<{ inputRef: MutableRefObject<Input> }>(null)
