import { ActiveTabBorder, TabBarContainer } from "app/Components/LegacyTabs/LegacyTabBarContainer"
import { StepTabs, Tab } from "app/Components/LegacyTabs/index"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { LayoutRectangle, TouchableOpacity, Pressable } from "react-native"
import { act } from "react-test-renderer"

const tabLayouts: LayoutRectangle[] = [
  {
    width: 100,
    x: 0,
    y: 0,
    height: 40,
  },
  {
    width: 120,
    x: 10,
    y: 0,
    height: 40,
  },
]

const tabs = [{ label: "Tab one" }, { label: "Tab Two" }]

describe("Tab", () => {
  it("renders without throwing a error", () => {
    renderWithWrappersLEGACY(
      <Tab onPress={() => null} label="Tab" active={false} onLayout={() => null} />
    )
  })

  it("Is pressable", () => {
    const mockOnPress = jest.fn()

    const tree = renderWithWrappersLEGACY(
      <Tab onPress={mockOnPress} label="TabLabel" active={false} onLayout={() => null} />
    )
    tree.root.findAllByType(Pressable)[0].props.onPress()
    expect(mockOnPress).toHaveBeenCalled()
  })
})

describe("General TabBar Behaviour", () => {
  const activeIndex = 0
  const tree = renderWithWrappersLEGACY(
    <TabBarContainer tabLayouts={tabLayouts} activeTabIndex={0} scrollEnabled>
      {tabs.map((tab, index) => (
        <Tab
          key={`${index}`}
          label={tab.label}
          onPress={() => null}
          onLayout={() => null}
          active={activeIndex === index}
        />
      ))}
    </TabBarContainer>
  )
  it("renders tabs", () => {
    expect(tree.root.findAllByType(Tab).length).toEqual(2)
  })

  it("underlines only active tab", () => {
    const activeBorders = tree.root.findAllByType(ActiveTabBorder)
    expect(activeBorders.length).toEqual(1)
    // the width of the underline must be equal to width of the tab
    expect(activeBorders[0].props.tabLayouts[activeBorders[0].props.activeTabIndex].width).toEqual(
      tabLayouts[activeBorders[0].props.activeTabIndex].width
    )
  })
})

describe("StepTabs Behaviour", () => {
  // Testing differently because step tabs behave differently
  // A Step Tab onPress will not trigger if the previous tab is not completed
  const sTabs = tabs.map((tab, i) => ({ label: tab.label, completed: i === 0 }))
  sTabs.push({ label: "Tab 3", completed: false })

  it("Is always able to go back to step 0", async () => {
    const mockOnTabPress = jest.fn()
    const tree = renderWithWrappersLEGACY(
      <StepTabs tabs={sTabs} onTabPress={mockOnTabPress} activeTab={1} />
    )

    const touchables = tree.root.findAllByType(TouchableOpacity)
    await act(() => touchables[0].props.onPress())
    expect(mockOnTabPress).toHaveBeenCalled()
  })

  it("Should not be able to go to step 2 because step 1 is not completed", async () => {
    const mockOnTabPress = jest.fn()
    const tree = renderWithWrappersLEGACY(
      <StepTabs tabs={sTabs} onTabPress={mockOnTabPress} activeTab={1} />
    )

    const touchables = tree.root.findAllByType(TouchableOpacity)
    await act(() => touchables[2].props.onPress())
    expect(mockOnTabPress).not.toHaveBeenCalled()
  })
})
