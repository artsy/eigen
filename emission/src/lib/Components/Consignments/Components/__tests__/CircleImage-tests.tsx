import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import Circle from "../CircleImage"

import { Theme } from "@artsy/palette"

it("renders properly", () => {
  const button = renderer
    .create(
      <Theme>
        <Circle source={require("../../../../../../images/consignments/email.png")} />
      </Theme>
    )
    .toJSON()
  expect(button).toMatchSnapshot()
})
