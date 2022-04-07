import { within } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { MockFilterScreen } from "app/Components/ArtworkFilter/FilterTestHelper"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { AttributionClassOptionsScreen } from "./AttributionClassOptions"
import { getEssentialProps } from "./helper"

describe("AttributionClassOptions Screen", () => {
  const MockAttributionClassOptionsScreen = ({
    initialData,
  }: {
    initialData?: ArtworkFiltersState
  }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <AttributionClassOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders the options", () => {
    const { getByText } = renderWithWrappersTL(<MockAttributionClassOptionsScreen />)

    expect(getByText("Unique")).toBeTruthy()
    expect(getByText("Limited Edition")).toBeTruthy()
    expect(getByText("Open Edition")).toBeTruthy()
    expect(getByText("Unknown Edition")).toBeTruthy()
  })

  it("displays all the selected filters on the filter modal screen", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Unique, Unknown Edition",
          paramName: FilterParamName.attributionClass,
          paramValue: ["unique", "unknown edition"],
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      sizeMetric: "cm",
    }

    const { getByText } = renderWithWrappersTL(<MockFilterScreen initialState={injectedState} />)

    expect(within(getByText("Rarity")).getByText("• 2")).toBeTruthy()
  })

  it("toggles selected filters 'ON' and unselected filters 'OFF", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Unique, Unknown Edition",
          paramName: FilterParamName.attributionClass,
          paramValue: ["unique", "unknown edition"],
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      sizeMetric: "cm",
    }

    const { getAllByA11yState } = renderWithWrappersTL(
      <MockAttributionClassOptionsScreen initialData={injectedState} />
    )
    const options = getAllByA11yState({ checked: true })

    expect(options).toHaveLength(2)
    expect(options[0]).toHaveTextContent("Unique")
    expect(options[1]).toHaveTextContent("Unknown Edition")
  })
})
