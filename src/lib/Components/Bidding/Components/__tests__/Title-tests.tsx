import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { Title } from "../Title"

import { BiddingThemeProvider } from "../BiddingThemeProvider"

it("renders without throwing an error", () => {
  renderWithWrappers(
    <BiddingThemeProvider>
      <Title>Confirm your bid</Title>
    </BiddingThemeProvider>
  )
})
