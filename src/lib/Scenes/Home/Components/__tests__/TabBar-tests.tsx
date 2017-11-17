import React from "react"
import { Animated } from "react-native"
import * as renderer from "react-test-renderer"

import TabBar from "lib/Components/TabBar"

it("renders correctly", () => {
  const tabBar = renderer.create(
    <TabBar tabs={["Page 1", "Page 2", "Page 3"]} scrollValue={new Animated.Value(0)} />
  ) as any
  expect(tabBar).toMatchSnapshot()
})
