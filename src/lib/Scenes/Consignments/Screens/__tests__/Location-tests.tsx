import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import Location from "../Location"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  const nav = {} as any
  const route = {} as any
  renderWithWrappers(
    <Theme>
      <Location navigator={nav} route={route} />
    </Theme>
  )
})
