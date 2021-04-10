import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { CheckIcon } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { act } from "react-test-renderer"
import { CheckMarkOptionListItem } from "../MultiSelectCheckOption"
import { SIZES_OPTIONS, SizesOptionsScreen } from "../SizesOptions"
import { getEssentialProps } from "./helper"

describe("Sizes options screen", () => {
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

  const MockSizesScreen = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <SizesOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("selects only the option that is selected", () => {
    const tree = renderWithWrappers(<MockSizesScreen {...getEssentialProps()} initialData={initialState} />)

    const selectedSizeIndex = Math.floor(Math.random() * Math.floor(SIZES_OPTIONS.length)) // selected size index

    const selectedSize = tree.root.findAllByType(CheckMarkOptionListItem)[selectedSizeIndex]
    act(() => selectedSize.findAllByType(TouchableOpacity)[0].props.onPress())
    expect(selectedSize.findAllByType(CheckIcon)).toHaveLength(1)
  })

  it("allows multiple sizes to be selected", () => {
    const tree = renderWithWrappers(<MockSizesScreen {...getEssentialProps()} initialData={initialState} />)

    const firstSizeInstance = tree.root.findAllByType(CheckMarkOptionListItem)[0].findAllByType(TouchableOpacity)[0]
    const thirdSizeInstance = tree.root.findAllByType(CheckMarkOptionListItem)[2].findAllByType(TouchableOpacity)[0]

    act(() => firstSizeInstance.props.onPress())
    act(() => thirdSizeInstance.props.onPress())

    expect(tree.root.findAllByType(CheckIcon)).toHaveLength(2)
  })
})
