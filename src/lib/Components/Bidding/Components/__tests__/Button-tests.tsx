import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { Button } from "../Button"

import { Theme } from "@artsy/palette"

it("renders properly", () => {
  const bg = renderer
    .create(
      <Theme>
        <Button text="next" />
      </Theme>
    )
    .toJSON()
  expect(bg).toMatchSnapshot()
})
