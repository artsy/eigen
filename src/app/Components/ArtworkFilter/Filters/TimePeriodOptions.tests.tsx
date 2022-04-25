import { within } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtworkFiltersState } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { MockFilterScreen } from "app/Components/ArtworkFilter/FilterTestHelper"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { getEssentialProps } from "./helper"
import { TimePeriodOptionsScreen } from "./TimePeriodOptions"

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
    sizeMetric: "cm",
  }

  const MockTimePeriodOptionsScreen = ({
    initialData = initialState,
  }: {
    initialData?: ArtworkFiltersState
  }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <TimePeriodOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  describe("before any filters are selected", () => {
    it("should render name without count label", () => {
      const { getByText } = renderWithWrappersTL(<MockFilterScreen initialState={initialState} />)

      expect(getByText("Time Period")).toBeTruthy()
    })

    it("renders all options present in the aggregation", () => {
      const { getByText } = renderWithWrappersTL(
        <MockTimePeriodOptionsScreen initialData={initialState} />
      )

      expect(getByText("2020–Today")).toBeTruthy()
      expect(getByText("2010–2019")).toBeTruthy()
      expect(getByText("In the Year 2000!")).toBeTruthy()
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
      const { getByText } = renderWithWrappersTL(<MockFilterScreen initialState={state} />)

      expect(within(getByText("Time Period")).getByText("• 1")).toBeTruthy()
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      const { getAllByA11yState } = renderWithWrappersTL(
        <MockTimePeriodOptionsScreen initialData={state} />
      )
      const options = getAllByA11yState({ checked: true })

      expect(options).toHaveLength(1)
      expect(options[0]).toHaveTextContent("2020–Today")
    })
  })
})
