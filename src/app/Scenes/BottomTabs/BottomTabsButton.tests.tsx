import { ModalStack } from "app/navigation/ModalStack"
import { switchTab } from "app/navigation/navigate"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { useTracking } from "react-tracking"
import { BottomTabsButton } from "./BottomTabsButton"

const trackEvent = useTracking().trackEvent

const TestWrapper: React.FC<React.ComponentProps<typeof BottomTabsButton>> = (props) => {
  return (
    <GlobalStoreProvider>
      <ModalStack>
        <BottomTabsButton {...props} />
      </ModalStack>
    </GlobalStoreProvider>
  )
}

describe(BottomTabsButton, () => {
  it(`updates the selected tab state on press`, async () => {
    const tree = renderWithWrappers(<TestWrapper tab="search" />)
    expect(__globalStoreTestUtils__?.getCurrentState().bottomTabs.sessionState.selectedTab).toBe(
      "home"
    )
    tree.root.findByType(TouchableWithoutFeedback).props.onPress()
    await flushPromiseQueue()
    expect(switchTab).toHaveBeenCalledWith("search")
  })

  it(`dispatches an analytics action on press`, async () => {
    const tree = renderWithWrappers(<TestWrapper tab="sell" />)
    expect(trackEvent).not.toHaveBeenCalled()
    tree.root.findByType(TouchableWithoutFeedback).props.onPress()
    await flushPromiseQueue()
    expect(switchTab).toHaveBeenCalledWith("sell")
    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedTabBar",
      badge: false,
      context_module: "tabBar",
      context_screen_owner_type: "home",
      tab: "sell",
    })
  })

  describe(`badge`, () => {
    it(`doesn't show anything when the number is 0`, async () => {
      const tree = renderWithWrappers(<TestWrapper tab="sell" />)
      expect(extractText(tree.root)).toBe("")
      tree.update(<TestWrapper tab="sell" badgeCount={0} />)
      expect(extractText(tree.root)).toBe("")
    })
    it(`shows the number when the number is bigger than 0`, async () => {
      const tree = renderWithWrappers(<TestWrapper tab="sell" badgeCount={1} />)
      expect(extractText(tree.root)).toBe("1")
      tree.update(<TestWrapper tab="sell" badgeCount={5} />)
      expect(extractText(tree.root)).toBe("5")
      tree.update(<TestWrapper tab="sell" badgeCount={52} />)
      expect(extractText(tree.root)).toBe("52")
    })
    it(`tops out at 99`, async () => {
      const tree = renderWithWrappers(<TestWrapper tab="sell" badgeCount={1} />)
      expect(extractText(tree.root)).toBe("1")
      tree.update(<TestWrapper tab="sell" badgeCount={99} />)
      expect(extractText(tree.root)).toBe("99")
      tree.update(<TestWrapper tab="sell" badgeCount={100} />)
      expect(extractText(tree.root)).toBe("99+")
      tree.update(<TestWrapper tab="sell" badgeCount={2343} />)
      expect(extractText(tree.root)).toBe("99+")
    })
  })
})
