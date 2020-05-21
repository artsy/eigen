import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { ConnectivityBanner } from "../ConnectivityBanner"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderer.create(
    <Theme>
      <ConnectivityBanner />
    </Theme>
  )
})
