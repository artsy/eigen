import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { ZeroState } from "../index"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderer.create(
    <Theme>
      <ZeroState />
    </Theme>
  )
})
