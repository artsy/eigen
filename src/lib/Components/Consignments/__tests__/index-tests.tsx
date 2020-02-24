import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

jest.mock("@react-native-community/cameraroll", () => jest.fn())

import Consignments from "../"

import { Theme } from "@artsy/palette"

it("Sets up the right navigator view hierarchy", () => {
  const tree = renderer
    .create(
      <Theme>
        <Consignments />
      </Theme>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
