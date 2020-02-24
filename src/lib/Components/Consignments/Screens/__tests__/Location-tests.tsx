import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import Location from "../Location"

import { Theme } from "@artsy/palette"

it("Sets up the right view hierarchy", () => {
  const nav = {} as any
  const route = {} as any
  const tree = renderer
    .create(
      <Theme>
        <Location navigator={nav} route={route} />
      </Theme>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
