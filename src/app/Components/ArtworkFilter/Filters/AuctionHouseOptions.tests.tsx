import { fireEvent } from "@testing-library/react-native"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { AuctionHouseOptionsScreen } from "./AuctionHouseOptions"
import { getEssentialProps } from "./helper"

describe("AuctionHouse options screen", () => {
  const MockAuctionHouseScreen = ({
    initialData = initialState,
  }: {
    initialData?: ArtworkFiltersState
  }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <AuctionHouseOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  const initialState: ArtworkFiltersState = {
    selectedFilters: [],
    appliedFilters: [],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: [],
    filterType: "auctionResult",
    counts: {
      total: null,
      followedArtists: null,
    },
    sizeMetric: "cm",
  }

  it("selects only the option that is selected", () => {
    const { getByText, getAllByA11yState } = renderWithWrappersTL(
      <MockAuctionHouseScreen {...getEssentialProps()} initialData={initialState} />
    )
    fireEvent.press(getByText("Sotheby's"))

    const selectedOptions = getAllByA11yState({ checked: true })
    expect(selectedOptions).toHaveLength(1)
    expect(selectedOptions[0]).toHaveTextContent("Sotheby's")
    expect(getByText("Clear")).toBeTruthy()
  })

  it("allows multiple auction houses to be selected", () => {
    const { getByText, getAllByA11yState } = renderWithWrappersTL(
      <MockAuctionHouseScreen {...getEssentialProps()} initialData={initialState} />
    )
    fireEvent.press(getByText("Sotheby's"))
    fireEvent.press(getByText("Christie's"))

    const selectedOptions = getAllByA11yState({ checked: true })
    expect(selectedOptions).toHaveLength(2)
    expect(selectedOptions[0]).toHaveTextContent("Sotheby's")
    expect(selectedOptions[1]).toHaveTextContent("Christie's")
  })
})
