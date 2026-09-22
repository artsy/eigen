import { fireEvent, screen } from "@testing-library/react-native"
import { CityFilterPills } from "app/Scenes/CityGuide/Components/CityFilterPills"
import { BucketResults } from "app/Scenes/CityGuide/utils/bucketCityResults"
import { cityTabs } from "app/Scenes/CityGuide/utils/cityTabs"
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

  it("does not render tabs without results", () => {
    renderWithWrappers(
      <CityFilterPills
        selectedTabId="all"
        onSelectTab={jest.fn()}
        bottomSheetAnimatedIndex={bottomSheetAnimatedIndex}
        bucketResults={{ ...bucketResultsWithResults, museums: [], fairs: [] }}
      />
    )

    expect(screen.queryByText("Fairs")).not.toBeOnTheScreen()
    expect(screen.queryByText("Museums")).not.toBeOnTheScreen()
    expect(screen.getByText("All")).toBeOnTheScreen()
    expect(screen.getByText("Saved")).toBeOnTheScreen()
    expect(screen.getByText("Galleries")).toBeOnTheScreen()
  })

  it("renders only the All pill when every other tab is empty", () => {
    const onSelectTab = jest.fn()
    renderWithWrappers(
      <CityFilterPills
        selectedTabId="all"
        onSelectTab={onSelectTab}
        bottomSheetAnimatedIndex={bottomSheetAnimatedIndex}
        bucketResults={emptyBucketResults}
      />
    )

    expect(screen.getByText("All")).toBeOnTheScreen()
    expect(screen.queryByText("Saved")).not.toBeOnTheScreen()
    expect(screen.queryByText("Fairs")).not.toBeOnTheScreen()
    expect(screen.queryByText("Galleries")).not.toBeOnTheScreen()
    expect(screen.queryByText("Museums")).not.toBeOnTheScreen()
  })

  it("falls back to highlighting All when the selected tab has no results", () => {
    // Simulates the drawer/pager selecting a tab that CityFilterPills has hidden because it
    // has no results — the pill row should still show a sensible highlight, not none at all.
    renderWithWrappers(
      <CityFilterPills
        selectedTabId="museums"
        onSelectTab={jest.fn()}
        bottomSheetAnimatedIndex={bottomSheetAnimatedIndex}
        bucketResults={{ ...bucketResultsWithResults, museums: [] }}
      />
    )

    expect(screen.queryByText("Museums")).not.toBeOnTheScreen()
    expect(screen.getByTestId("city-filter-pill-all")).toHaveProp("accessibilityState", {
      selected: true,
    })
  })

  it("renders fine with bottomSheetAnimatedIndex omitted", () => {
    // The itineraries-flagged map never mounts a bottom sheet, so there's nothing to fade
    // against — the pill row must still render without one.
    renderWithWrappers(
      <CityFilterPills
        selectedTabId="all"
        onSelectTab={jest.fn()}
        bucketResults={bucketResultsWithResults}
      />
    )

    cityTabs.forEach((tab) => {
      expect(screen.getByText(tab.text)).toBeOnTheScreen()
    })
  })
})
