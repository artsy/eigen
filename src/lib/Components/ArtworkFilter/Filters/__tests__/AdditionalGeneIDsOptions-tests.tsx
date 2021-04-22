import { OptionListItem as FilterModalOptionListItem } from "lib/Components/ArtworkFilter"
import { MockFilterScreen } from "lib/Components/ArtworkFilter/__tests__/FilterTestHelper"
import { Aggregations, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { RightButtonContainer } from "lib/Components/FancyModal/FancyModalHeader"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Check } from "palette"
import React from "react"
import { AdditionalGeneIDsOptionsScreen } from "../AdditionalGeneIDsOptions"
import { OptionListItem } from "../MultiSelectOption"
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
    const tree = renderWithWrappers(<MockAdditionalGeneIDsOptionsScreen initialData={initialState} />)

    expect(tree.root.findAllByType(OptionListItem)).toHaveLength(8)

    const items = tree.root.findAllByType(OptionListItem)
    expect(items.map(extractText)).toEqual([
      "Prints",
      "Design",
      "Sculpture",
      "Work on Paper",
      "Painting",
      "Drawing",
      "Jewelry",
      "Photography",
    ])
  })

  it("does not display the default text when no filter selected on the filter modal screen", () => {
    const tree = renderWithWrappers(<MockFilterScreen initialState={initialState} />)
    const items = tree.root.findAllByType(FilterModalOptionListItem)
    expect(extractText(items[items.length - 1])).not.toContain("All")
  })

  it("displays all the selected filters on the filter modal screen", () => {
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
    }

    const tree = renderWithWrappers(<MockFilterScreen initialState={injectedState} />)
    const items = tree.root.findAllByType(FilterModalOptionListItem)

    expect(extractText(items[1])).toContain("Prints, Sculpture")
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
    }

    const tree = renderWithWrappers(<MockAdditionalGeneIDsOptionsScreen initialData={injectedState} />)
    const options = tree.root.findAllByType(Check)

    expect(options[0].props.selected).toBe(true)
    expect(options[1].props.selected).toBe(false)
    expect(options[2].props.selected).toBe(true)
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
    }

    const tree = renderWithWrappers(<MockAdditionalGeneIDsOptionsScreen initialData={injectedState} />)
    const options = tree.root.findAllByType(Check)
    const clear = tree.root.findByType(RightButtonContainer)

    expect(options[0].props.selected).toBe(true)
    expect(options[1].props.selected).toBe(false)
    expect(options[2].props.selected).toBe(true)

    clear.props.onPress()

    expect(options[0].props.selected).toBe(false)
    expect(options[1].props.selected).toBe(false)
    expect(options[2].props.selected).toBe(false)
  })
})
