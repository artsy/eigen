import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

jest.mock("@react-native-community/cameraroll", () => jest.fn())

import Consignments from "../"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderer.create(
    <Theme>
      <Consignments />
    </Theme>
  )
})
