import { fireEvent, screen } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersStoreProvider,
  ArtworkFiltersState,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { MockFilterScreen } from "app/Components/ArtworkFilter/FilterTestHelper"
import { TimePeriodOptionsScreen } from "app/Components/ArtworkFilter/Filters/TimePeriodOptions"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("TimePeriodOptions Screen", () => {
  const initialState: ArtworkFiltersState = {
    aggregations: [
      {
        slice: "MAJOR_PERIOD",
        counts: [
          {
            count: 100,
            name: "2020",
            value: "2020",
          },
          {
            count: 200,
            name: "2010",
            value: "2010",
          },
          {
            count: 50,
            name: "In the year 2000!",
            value: "In the year 2000!",
          },
        ],
      },
    ],
    appliedFilters: [],
    applyFilters: false,
    counts: {
      total: null,
      followedArtists: null,
    },
    filterType: "artwork",
    previouslyAppliedFilters: [],
    selectedFilters: [],
    showFilterArtworksModal: false,
    sizeMetric: "cm",
  }

  const MockTimePeriodOptionsScreen = ({
    initialData = initialState,
  }: {
    initialData?: ArtworkFiltersState
  }) => {
    return (
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...initialData,
        }}
      >
        <TimePeriodOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  describe("before any filters are selected", () => {
    it("should render name without count label", () => {
      renderWithWrappers(<MockFilterScreen initialState={initialState} />)

      expect(screen.getByText("Time Period")).toBeTruthy()
    })

    it("renders all options present in the aggregation", () => {
      renderWithWrappers(<MockTimePeriodOptionsScreen initialData={initialState} />)

      expect(screen.getByText("2020–Today")).toBeTruthy()
      expect(screen.getByText("2010–2019")).toBeTruthy()
      expect(screen.getByText("In the Year 2000!")).toBeTruthy()
    })
  })

  describe("when filters are selected", () => {
    const state: ArtworkFiltersState = {
      ...initialState,
      selectedFilters: [
        {
          displayText: "2020–Today",
          paramName: FilterParamName.timePeriod,
          paramValue: ["2020"],
        },
      ],
    }

    it("displays the number of the selected filters on the filter modal screen", () => {
      renderWithWrappers(<MockFilterScreen initialState={state} />)

      expect(screen.getByText("Time Period • 1")).toBeTruthy()
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      renderWithWrappers(<MockTimePeriodOptionsScreen initialData={state} />)
      const options = screen.getAllByTestId("multi-select-option-button")
      const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

      expect(options).toHaveLength(3)
      expect(options[0]).toHaveTextContent("2020–Today")
      expect(options[1]).toHaveTextContent("2010–2019")
      expect(options[2]).toHaveTextContent("In the Year 2000!")

      expect(checkboxes[0]).toHaveProp("selected", true)
      expect(checkboxes[1]).toHaveProp("selected", false)
      expect(checkboxes[2]).toHaveProp("selected", false)

      fireEvent.press(options[0])

      expect(checkboxes[0]).toHaveProp("selected", false)
      expect(checkboxes[1]).toHaveProp("selected", false)
      expect(checkboxes[2]).toHaveProp("selected", false)

      fireEvent.press(options[2])

      expect(checkboxes[0]).toHaveProp("selected", false)
      expect(checkboxes[1]).toHaveProp("selected", false)
      expect(checkboxes[2]).toHaveProp("selected", true)
    })
  })
})
