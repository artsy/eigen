import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { CheckIcon } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { act } from "react-test-renderer"
import { AUCTION_HOUSE_OPTIONS, AuctionHouseOptionsScreen } from "../AuctionHouseOptions"
import { CheckMarkOptionListItem } from "../MultiSelectCheckOption"
import { getEssentialProps } from "./helper"

describe("AuctionHouse options screen", () => {
  const MockAuctionHouseScreen = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => {
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
  }

  it("selects only the option that is selected", () => {
    const tree = renderWithWrappers(<MockAuctionHouseScreen {...getEssentialProps()} initialData={initialState} />)

    // selected auction house index
    const selectedAuctionHouseIndex = Math.floor(Math.random() * Math.floor(AUCTION_HOUSE_OPTIONS.length))
    const selectedAuctionHouse = tree.root.findAllByType(CheckMarkOptionListItem)[selectedAuctionHouseIndex]

    act(() => selectedAuctionHouse.findAllByType(TouchableOpacity)[0].props.onPress())
    expect(selectedAuctionHouse.findAllByType(CheckIcon)).toHaveLength(1)
  })

  it("allows multiple auction houses to be selected", () => {
    const tree = renderWithWrappers(<MockAuctionHouseScreen {...getEssentialProps()} initialData={initialState} />)

    const firstAuctionHouseInstance = tree.root
      .findAllByType(CheckMarkOptionListItem)[0]
      .findAllByType(TouchableOpacity)[0]
    const secondAuctionHouseInstance = tree.root
      .findAllByType(CheckMarkOptionListItem)[1]
      .findAllByType(TouchableOpacity)[0]
    const thirdAuctionHouseInstance = tree.root
      .findAllByType(CheckMarkOptionListItem)[2]
      .findAllByType(TouchableOpacity)[0]

    act(() => firstAuctionHouseInstance.props.onPress())
    act(() => secondAuctionHouseInstance.props.onPress())
    act(() => thirdAuctionHouseInstance.props.onPress())

    expect(tree.root.findAllByType(CheckIcon)).toHaveLength(3)
  })
})
