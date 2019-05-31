import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import ConnectivityBanner from "../ConnectivityBanner"

import { Theme } from "@artsy/palette"

it("looks like expected", () => {
  const tree = renderer
    .create(
      <Theme>
        <ConnectivityBanner />
      </Theme>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
