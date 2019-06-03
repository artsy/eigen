import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import NavigationButton from "../NavigationButton"

import { Theme } from "@artsy/palette"

it("renders properly", () => {
  const button = renderer
    .create(
      <Theme>
        <NavigationButton title={"I am a navigation button"} href="/some/path" />
      </Theme>
    )
    .toJSON()
  expect(button).toMatchSnapshot()
})
