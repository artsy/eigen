import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { Title } from "../Title"

import { BiddingThemeProvider } from "../BiddingThemeProvider"

it("renders without throwing an error", () => {
  renderer.create(
    <BiddingThemeProvider>
      <Title>Confirm your bid</Title>
    </BiddingThemeProvider>
  )
})
