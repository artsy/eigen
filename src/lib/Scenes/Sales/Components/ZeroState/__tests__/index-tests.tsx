import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { ZeroState } from "../index"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderWithWrappers(
    <Theme>
      <ZeroState />
    </Theme>
  )
})
