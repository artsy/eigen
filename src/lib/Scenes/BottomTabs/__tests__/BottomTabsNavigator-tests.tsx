import { NativeViewController } from "lib/Components/NativeViewController"
import { __globalStoreTestUtils__, GlobalStore } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { BottomTabsNavigator } from "../BottomTabsNavigator"

describe(BottomTabsNavigator, () => {
  it("shows the current tab content", () => {
    const tree = renderWithWrappers(<BottomTabsNavigator />)
    expect(
      tree.root.findAll((node) => node.type === NativeViewController && node.props.viewProps.tabName === "home")
    ).toHaveLength(1)
    expect(
      tree.root.findAll((node) => node.type === NativeViewController && node.props.viewProps.tabName === "search")
    ).toHaveLength(0)

    GlobalStore.actions.bottomTabs.switchTab("search")

    expect(
      tree.root.findAll((node) => node.type === NativeViewController && node.props.viewProps.tabName === "search")
    ).toHaveLength(1)
  })
})
