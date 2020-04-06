import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import Location from "../Location"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  const nav = {} as any
  const route = {} as any
  renderer.create(
    <Theme>
      <Location navigator={nav} route={route} />
    </Theme>
  )
})
