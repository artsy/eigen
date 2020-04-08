import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import TabView from "../TabView"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderer.create(
    <Theme>
      <TabView
        titles={["one", "two"]}
        selectedIndex={1}
        onSelectionChange={() => {
          //
        }}
      />
    </Theme>
  )
})
