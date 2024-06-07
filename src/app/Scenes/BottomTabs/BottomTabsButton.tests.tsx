import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { ModalStack } from "app/system/navigation/ModalStack"
import { switchTab } from "app/system/navigation/navigate"
import { extractText } from "app/utils/tests/extractText"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { TouchableWithoutFeedback } from "react-native"
import { BottomTabsButton } from "./BottomTabsButton"

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
    const tree = renderWithWrappersLEGACY(<TestWrapper tab="search" />)
    expect(__globalStoreTestUtils__?.getCurrentState().bottomTabs.sessionState.selectedTab).toBe(
      "home"
    )
    tree.root.findByType(TouchableWithoutFeedback).props.onPress()
    await flushPromiseQueue()
    expect(switchTab).toHaveBeenCalledWith("search")
  })

  it(`dispatches an analytics action on press`, async () => {
    const tree = renderWithWrappersLEGACY(<TestWrapper tab="sell" />)
    expect(mockTrackEvent).not.toHaveBeenCalled()
    tree.root.findByType(TouchableWithoutFeedback).props.onPress()
    await flushPromiseQueue()
    expect(switchTab).toHaveBeenCalledWith("sell")
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedTabBar",
      badge: false,
      context_module: "tabBar",
      context_screen_owner_type: "home",
      tab: "sell",
    })
  })

  describe(`badge`, () => {
    it(`doesn't show anything when the number is 0`, async () => {
      const tree = renderWithWrappersLEGACY(<TestWrapper tab="sell" />)
      expect(extractText(tree.root)).toBe("Sell")
      tree.update(<TestWrapper tab="sell" badgeCount={0} />)
      expect(extractText(tree.root)).toBe("Sell")
    })
    it(`shows the number when the number is bigger than 0`, async () => {
      const tree = renderWithWrappersLEGACY(<TestWrapper tab="sell" badgeCount={1} />)
      expect(extractText(tree.root)).toBe("Sell1")
      tree.update(<TestWrapper tab="sell" badgeCount={5} />)
      expect(extractText(tree.root)).toBe("Sell5")
      tree.update(<TestWrapper tab="sell" badgeCount={52} />)
      expect(extractText(tree.root)).toBe("Sell52")
    })
    it(`tops out at 99`, async () => {
      const tree = renderWithWrappersLEGACY(<TestWrapper tab="sell" badgeCount={1} />)
      expect(extractText(tree.root)).toBe("Sell1")
      tree.update(<TestWrapper tab="sell" badgeCount={99} />)
      expect(extractText(tree.root)).toBe("Sell99")
      tree.update(<TestWrapper tab="sell" badgeCount={100} />)
      expect(extractText(tree.root)).toBe("Sell99+")
      tree.update(<TestWrapper tab="sell" badgeCount={2343} />)
      expect(extractText(tree.root)).toBe("Sell99+")
    })
  })
})
