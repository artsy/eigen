import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { Button } from "../Button"

import { BiddingThemeProvider } from "../BiddingThemeProvider"

it("renders properly", () => {
  const bg = renderer
    .create(
      <BiddingThemeProvider>
        <Button text="next" />
      </BiddingThemeProvider>
    )
    .toJSON()
  expect(bg).toMatchSnapshot()
})
