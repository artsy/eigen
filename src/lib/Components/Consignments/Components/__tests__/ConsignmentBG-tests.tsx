import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import ConsignmentsBG from "../ConsignmentBG"

import { Theme } from "@artsy/palette"

it("renders properly", () => {
  const bg = renderer
    .create(
      <Theme>
        <ConsignmentsBG />
      </Theme>
    )
    .toJSON()
  expect(bg).toMatchSnapshot()
})
