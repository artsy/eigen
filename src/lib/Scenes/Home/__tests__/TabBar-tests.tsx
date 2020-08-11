import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Animated } from "react-native"

import TabBar from "lib/Components/TabBar"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderWithWrappers(
    <Theme>
      <TabBar tabs={["Page 1", "Page 2", "Page 3"]} scrollValue={new Animated.Value(0)} />
    </Theme>
  )
})
