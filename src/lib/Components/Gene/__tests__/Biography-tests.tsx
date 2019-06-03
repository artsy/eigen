import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import Biography from "../Biography"

import { Theme } from "@artsy/palette"

it("renders properly", () => {
  const gene = {
    description: "Watercolor painting is very nice",
  }
  const biography = renderer
    .create(
      <Theme>
        <Biography gene={gene as any} />
      </Theme>
    )
    .toJSON()
  expect(biography).toMatchSnapshot()
})
