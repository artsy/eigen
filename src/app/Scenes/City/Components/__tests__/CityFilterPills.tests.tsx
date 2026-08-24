import { fireEvent, screen } from "@testing-library/react-native"
import { CityFilterPills } from "app/Scenes/City/Components/CityFilterPills"
import { cityTabs } from "app/Scenes/City/cityTabs"
import { BucketResults } from "app/utils/cityGuide/bucketCityResults"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { SharedValue } from "react-native-reanimated"

const bottomSheetAnimatedIndex = { value: -1 } as SharedValue<number>

const bucketResultsWithResults = {
  saved: [{}],
  fairs: [{}],
  galleries: [{}],
  museums: [{}],
  closing: [],
  opening: [],
} as unknown as BucketResults

const emptyBucketResults = {
  saved: [],
  fairs: [],
  galleries: [],
  museums: [],
  closing: [],
  opening: [],
} as unknown as BucketResults

describe("CityFilterPills", () => {
  it("renders a pill for every city tab", () => {
    renderWithWrappers(
      <CityFilterPills
        selectedTabId="all"
        onSelectTab={jest.fn()}
        bottomSheetAnimatedIndex={bottomSheetAnimatedIndex}
        bucketResults={bucketResultsWithResults}
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
        bucketResults={bucketResultsWithResults}
      />
    )

    fireEvent.press(screen.getByText("Museums"))

    expect(onSelectTab).toHaveBeenCalledWith(cityTabs.find((tab) => tab.id === "museums"))
  })

  it("pushes tabs without results to the end and disables them", () => {
    renderWithWrappers(
      <CityFilterPills
        selectedTabId="all"
        onSelectTab={jest.fn()}
        bottomSheetAnimatedIndex={bottomSheetAnimatedIndex}
        bucketResults={{ ...bucketResultsWithResults, museums: [], fairs: [] }}
      />
    )

    // The last two pills rendered should be the ones without results (Fairs, Museums).
    const renderedOrder = screen.getAllByTestId(/^city-filter-pill-/).map((el) => el.props.testID)

    expect(renderedOrder.slice(-2)).toEqual(
      expect.arrayContaining(["city-filter-pill-fairs", "city-filter-pill-museums"])
    )
  })

  it("does not call onSelectTab for a disabled (empty) tab", () => {
    const onSelectTab = jest.fn()
    renderWithWrappers(
      <CityFilterPills
        selectedTabId="all"
        onSelectTab={onSelectTab}
        bottomSheetAnimatedIndex={bottomSheetAnimatedIndex}
        bucketResults={emptyBucketResults}
      />
    )

    fireEvent.press(screen.getByText("Saved"))

    expect(onSelectTab).not.toHaveBeenCalled()
  })
})
