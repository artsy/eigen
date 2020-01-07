import React from "react"
import * as renderer from "react-test-renderer"

import MyProfile from "../MyProfile"

import { Theme } from "@artsy/palette"

it("looks like expected", () => {
  const tree = renderer
    .create(
      <Theme>
        <MyProfile />
      </Theme>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
