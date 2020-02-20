import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import Separator from "../Separator"

import { Theme } from "@artsy/palette"

it("looks like expected", () => {
  const tree = renderer
    .create(
      <Theme>
        <Separator />
      </Theme>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
