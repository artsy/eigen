import { Theme } from "@artsy/palette"
import { StoreProvider } from "easy-peasy"
import React from "react"
import { store } from "./State/store"

interface BootProps {
  children: React.ReactNode
}

export const Boot: React.FC<BootProps> = ({ children }) => {
  return (
    <StoreProvider store={store}>
      <Theme>{children}</Theme>
    </StoreProvider>
  )
}
