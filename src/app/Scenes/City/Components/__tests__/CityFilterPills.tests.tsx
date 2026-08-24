import { fireEvent, screen } from "@testing-library/react-native"
import { CityFilterPills } from "app/Scenes/City/Components/CityFilterPills"
import { cityTabs } from "app/Scenes/City/cityTabs"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { SharedValue } from "react-native-reanimated"

const bottomSheetAnimatedIndex = { value: -1 } as SharedValue<number>

describe("CityFilterPills", () => {
  it("renders a pill for every city tab", () => {
    renderWithWrappers(
      <CityFilterPills
        selectedTabId="all"
        onSelectTab={jest.fn()}
        bottomSheetAnimatedIndex={bottomSheetAnimatedIndex}
      />
    )

    cityTabs.forEach((tab) => {
      expect(screen.getByText(tab.text)).toBeOnTheScreen()
    })
  })

  it("calls onSelectTab with the pressed tab", () => {
    const onSelectTab = jest.fn()
    renderWithWrappers(
      <CityFilterPills
        selectedTabId="all"
        onSelectTab={onSelectTab}
        bottomSheetAnimatedIndex={bottomSheetAnimatedIndex}
      />
    )

    fireEvent.press(screen.getByText("Museums"))

    expect(onSelectTab).toHaveBeenCalledWith(cityTabs.find((tab) => tab.id === "museums"))
  })
})
