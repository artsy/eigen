import { within } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { MockFilterScreen } from "app/Components/ArtworkFilter/FilterTestHelper"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { getEssentialProps } from "./helper"
import { WaysToBuyOptionsScreen } from "./WaysToBuyOptions"

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
    sizeMetric: "cm",
  }

  const MockWaysToBuyScreen = ({
    initialData = initialState,
  }: {
    initialData?: ArtworkFiltersState
  }) => (
    <ArtworkFiltersStoreProvider initialData={initialData}>
      <WaysToBuyOptionsScreen {...getEssentialProps()} />
    </ArtworkFiltersStoreProvider>
  )

  it("renders the correct ways to buy options", () => {
    const { getByText } = renderWithWrappersTL(<MockWaysToBuyScreen initialData={initialState} />)

    expect(getByText("Buy Now")).toBeTruthy()
    expect(getByText("Make Offer")).toBeTruthy()
    expect(getByText("Bid")).toBeTruthy()
    expect(getByText("Inquire")).toBeTruthy()
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
      sizeMetric: "cm",
    }

    const { getByText } = renderWithWrappersTL(<MockFilterScreen initialState={injectedState} />)

    expect(getByText("Ways to Buy")).toBeTruthy()
  })

  it("displays the number of the selected filters on the filter modal screen", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Buy Now",
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
      sizeMetric: "cm",
    }

    const { getByText } = renderWithWrappersTL(<MockFilterScreen initialState={injectedState} />)
    expect(within(getByText("Ways to Buy")).getByText("• 3")).toBeTruthy()
  })

  it("toggles selected filters 'ON' and unselected filters 'OFF", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Buy Now",
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
      sizeMetric: "cm",
    }

    const { getAllByA11yState } = renderWithWrappersTL(
      <MockWaysToBuyScreen initialData={injectedState} />
    )
    const options = getAllByA11yState({ checked: true })

    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent("Buy Now")
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
      sizeMetric: "cm",
    }

    const { getAllByA11yState } = renderWithWrappersTL(
      <MockWaysToBuyScreen initialData={injectedState} />
    )
    const options = getAllByA11yState({ checked: true })

    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent("Inquire")
  })
})
