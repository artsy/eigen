import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import ConnectivityBanner from "../ConnectivityBanner"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderWithWrappers(
    <Theme>
      <ConnectivityBanner />
    </Theme>
  )
})
