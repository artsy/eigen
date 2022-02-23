import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { Animated } from "react-native"

import TabBar from "app/Components/TabBar"

it("renders without throwing an error", () => {
  renderWithWrappers(
    <TabBar tabs={["Page 1", "Page 2", "Page 3"]} scrollValue={new Animated.Value(0)} />
  )
})
