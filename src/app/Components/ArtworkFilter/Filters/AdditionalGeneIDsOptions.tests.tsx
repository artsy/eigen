import { fireEvent, within } from "@testing-library/react-native"
import { Aggregations, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { MockFilterScreen } from "app/Components/ArtworkFilter/FilterTestHelper"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { AdditionalGeneIDsOptionsScreen } from "./AdditionalGeneIDsOptions"
import { getEssentialProps } from "./helper"

const MOCK_AGGREGATIONS: Aggregations = [
  {
    slice: "MEDIUM",
    counts: [
      { name: "Prints", count: 2956, value: "prints" },
      { name: "Design", count: 513, value: "design" },
      { name: "Sculpture", count: 277, value: "sculpture" },
      { name: "Work on Paper", count: 149, value: "work-on-paper" },
      { name: "Painting", count: 145, value: "painting" },
      { name: "Drawing", count: 83, value: "drawing" },
      { name: "Jewelry", count: 9, value: "jewelry" },
      { name: "Photography", count: 4, value: "photography" },
    ],
  },
]

describe("AdditionalGeneIDsOptions Screen", () => {
  const initialState: ArtworkFiltersState = {
    selectedFilters: [],
    appliedFilters: [],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: MOCK_AGGREGATIONS,
    filterType: "artwork",
    counts: {
      total: null,
      followedArtists: null,
    },
    sizeMetric: "cm",
  }

  const MockAdditionalGeneIDsOptionsScreen = ({
    initialData = initialState,
  }: {
    initialData?: ArtworkFiltersState
  }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <AdditionalGeneIDsOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders the options", () => {
    const { getByText } = renderWithWrappersTL(
      <MockAdditionalGeneIDsOptionsScreen initialData={initialState} />
    )

    expect(getByText("Prints")).toBeTruthy()
    expect(getByText("Design")).toBeTruthy()
    expect(getByText("Sculpture")).toBeTruthy()
    expect(getByText("Work on Paper")).toBeTruthy()
    expect(getByText("Painting")).toBeTruthy()
    expect(getByText("Drawing")).toBeTruthy()
    expect(getByText("Jewelry")).toBeTruthy()
    expect(getByText("Photography")).toBeTruthy()
  })

  it("displays the number of the selected filters on the filter modal screen", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Prints, Sculpture",
          paramName: FilterParamName.additionalGeneIDs,
          paramValue: ["prints", "sculpture"],
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: MOCK_AGGREGATIONS,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      sizeMetric: "cm",
    }

    const { getByText } = renderWithWrappersTL(<MockFilterScreen initialState={injectedState} />)

    expect(within(getByText("Medium")).getByText("• 2")).toBeTruthy()
  })

  it("toggles selected filters 'ON' and unselected filters 'OFF", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Prints, Sculpture",
          paramName: FilterParamName.additionalGeneIDs,
          paramValue: ["prints", "sculpture"],
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: MOCK_AGGREGATIONS,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      sizeMetric: "cm",
    }

    const { getAllByA11yState } = renderWithWrappersTL(
      <MockAdditionalGeneIDsOptionsScreen initialData={injectedState} />
    )
    const options = getAllByA11yState({ checked: true })

    expect(options).toHaveLength(2)
    expect(options[0]).toHaveTextContent("Prints")
    expect(options[1]).toHaveTextContent("Sculpture")
  })

  it("clears all when clear button is tapped", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Prints, Sculpture",
          paramName: FilterParamName.additionalGeneIDs,
          paramValue: ["prints", "sculpture"],
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: MOCK_AGGREGATIONS,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      sizeMetric: "cm",
    }

    const { getByText, queryAllByA11yState } = renderWithWrappersTL(
      <MockAdditionalGeneIDsOptionsScreen initialData={injectedState} />
    )

    expect(queryAllByA11yState({ checked: true })).toHaveLength(2)

    fireEvent.press(getByText("Clear"))

    expect(queryAllByA11yState({ checked: true })).toHaveLength(0)
  })
})
