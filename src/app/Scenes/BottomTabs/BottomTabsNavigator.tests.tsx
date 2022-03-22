import { NativeTabs } from "app/Components/NativeTabs"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { act } from "react-test-renderer"
import { BottomTabsNavigator } from "./BottomTabsNavigator"

describe(BottomTabsNavigator, () => {
  it("shows the current tab content", async () => {
    const tree = renderWithWrappers(<BottomTabsNavigator />)
    expect(
      tree.root.findAll(
        (node) => node.type === NativeTabs && node.props.viewProps.tabName === "home"
      )
    ).toHaveLength(1)
    expect(
      tree.root.findAll(
        (node) => node.type === NativeTabs && node.props.viewProps.tabName === "search"
      )
    ).toHaveLength(0)

    await act(() => {
      GlobalStore.actions.bottomTabs.switchTab("search")
    })

    expect(
      tree.root.findAll(
        (node) => node.type === NativeTabs && node.props.viewProps.tabName === "search"
      )
    ).toHaveLength(1)
  })
})
