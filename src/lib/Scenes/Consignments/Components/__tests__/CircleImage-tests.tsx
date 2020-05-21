import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import { CircleImage } from "../CircleImage"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderer.create(
    <Theme>
      <CircleImage source={require("../../../../../../images/consignments/email.png")} />
    </Theme>
  )
})
