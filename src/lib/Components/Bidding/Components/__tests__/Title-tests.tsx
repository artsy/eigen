import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { Title } from "../Title"

import { Theme } from "@artsy/palette"

it("renders properly", () => {
  const bg = renderer
    .create(
      <Theme>
        <Title>Confirm your bid</Title>
      </Theme>
    )
    .toJSON()
  expect(bg).toMatchSnapshot()
})
