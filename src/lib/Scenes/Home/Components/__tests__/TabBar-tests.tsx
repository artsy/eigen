import React from "react"
import { Animated } from "react-native"
import * as renderer from "react-test-renderer"

import TabBar from "lib/Components/TabBar"

import { Theme } from "@artsy/palette"

it("renders correctly", () => {
  const tabBar = renderer.create(
    <Theme>
      <TabBar tabs={["Page 1", "Page 2", "Page 3"]} scrollValue={new Animated.Value(0)} />
    </Theme>
  ) as any
  expect(tabBar).toMatchSnapshot()
})
