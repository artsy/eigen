import { OptionListItem as FilterModalOptionListItem } from "lib/Components/ArtworkFilter"
import { MockFilterScreen } from "lib/Components/ArtworkFilter/__tests__/FilterTestHelper"
import { FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Check } from "palette"
import React from "react"
import { OptionListItem } from "../MultiSelectOption"
import { WaysToBuyOptionsScreen } from "../WaysToBuyOptions"
import { getEssentialProps } from "./helper"

describe("Ways to Buy Options Screen", () => {
  const initialState: ArtworkFiltersState = {
    selectedFilters: [],
    appliedFilters: [],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: [],
    filterType: "artwork",
    counts: {
      total: null,
      followedArtists: null,
    },
  }

  const MockWaysToBuyScreen = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => (
    <ArtworkFiltersStoreProvider initialData={initialData}>
      <WaysToBuyOptionsScreen {...getEssentialProps()} />
    </ArtworkFiltersStoreProvider>
  )

  it("renders the correct ways to buy options", () => {
    const tree = renderWithWrappers(<MockWaysToBuyScreen initialData={initialState} />)

    expect(tree.root.findAllByType(OptionListItem)).toHaveLength(4)

    const listItems = tree.root.findAllByType(OptionListItem)
    const firstListItem = listItems[0]
    expect(extractText(firstListItem)).toBe("Buy now")

    const secondListItem = listItems[1]
    expect(extractText(secondListItem)).toBe("Make offer")

    const thirdListItem = listItems[2]
    expect(extractText(thirdListItem)).toBe("Bid")

    const fourthListItem = listItems[3]
    expect(extractText(fourthListItem)).toBe("Inquire")
  })

  it("does not display the default text when no filter selected on the filter modal screen", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const tree = renderWithWrappers(<MockFilterScreen initialState={injectedState} />)

    const waysToBuyListItem = tree.root.findAllByType(FilterModalOptionListItem)[1]

    expect(extractText(waysToBuyListItem)).not.toContain("All")
  })

  it("displays all the selected filters on the filter modal screen", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Buy now",
          paramName: FilterParamName.waysToBuyBuy,
          paramValue: true,
        },
        {
          displayText: "Inquire",
          paramName: FilterParamName.waysToBuyInquire,
          paramValue: true,
        },
        {
          displayText: "Bid",
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
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
    }

    const tree = renderWithWrappers(<MockFilterScreen initialState={injectedState} />)

    expect(extractText(tree.root)).toContain("Buy now, Inquire, Bid")
  })

  it("toggles selected filters 'ON' and unselected filters 'OFF", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Buy now",
          paramName: FilterParamName.waysToBuyBuy,
          paramValue: true,
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
    }

    const tree = renderWithWrappers(<MockWaysToBuyScreen initialData={injectedState} />)
    const options = tree.root.findAllByType(Check)

    expect(options[0].props.selected).toBe(true)

    expect(options[1].props.selected).toBe(false)

    expect(options[2].props.selected).toBe(false)

    expect(options[3].props.selected).toBe(false)
  })

  it("it toggles applied filters 'ON' and unapplied filters 'OFF", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [],
      appliedFilters: [
        {
          displayText: "Inquire",
          paramName: FilterParamName.waysToBuyInquire,
          paramValue: true,
        },
      ],
      previouslyAppliedFilters: [
        {
          displayText: "Inquire",
          paramName: FilterParamName.waysToBuyInquire,
          paramValue: true,
        },
      ],
      applyFilters: false,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const tree = renderWithWrappers(<MockWaysToBuyScreen initialData={injectedState} />)
    const options = tree.root.findAllByType(Check)

    expect(options[0].props.selected).toBe(false)

    expect(options[1].props.selected).toBe(false)

    expect(options[2].props.selected).toBe(false)

    expect(options[3].props.selected).toBe(true)
  })
})
