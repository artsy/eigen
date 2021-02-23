import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { CheckIcon } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { act } from "react-test-renderer"
import { __filterArtworksStoreTestUtils__ } from "../../../utils/ArtworkFilter/ArtworkFiltersStore"
import { CATEGORIES_OPTIONS, CategoriesOptionsScreen } from "../CategoriesOptions"
import { CheckMarkOptionListItem } from "../MultiSelectCheckOption"
import { getEssentialProps } from "./helper"

describe("Categories options screen", () => {
  let state: ArtworkFiltersState
  const MockCategoryScreen = () => {
    return (
      <ArtworkFiltersStoreProvider>
        <CategoriesOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  beforeEach(() => {
    state = {
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

    __filterArtworksStoreTestUtils__?.injectState(state)
  })

  it("selects only the option that is selected", () => {
    const tree = renderWithWrappers(<MockCategoryScreen initialState={state} {...getEssentialProps()} />)

    const selectedCategoryIndex = Math.floor(Math.random() * Math.floor(CATEGORIES_OPTIONS.length)) // selected category index

    const selectedCategory = tree.root.findAllByType(CheckMarkOptionListItem)[selectedCategoryIndex]
    act(() => selectedCategory.findAllByType(TouchableOpacity)[0].props.onPress())
    expect(selectedCategory.findAllByType(CheckIcon)).toHaveLength(1)
  })

  it("allows multiple categories to be selected", () => {
    const tree = renderWithWrappers(<MockCategoryScreen initialState={state} {...getEssentialProps()} />)

    const firstCategoryInstance = tree.root.findAllByType(CheckMarkOptionListItem)[0].findAllByType(TouchableOpacity)[0]
    const secondCategoryInstance = tree.root
      .findAllByType(CheckMarkOptionListItem)[1]
      .findAllByType(TouchableOpacity)[0]
    const thirdCategoryInstance = tree.root.findAllByType(CheckMarkOptionListItem)[2].findAllByType(TouchableOpacity)[0]

    act(() => firstCategoryInstance.props.onPress())
    act(() => secondCategoryInstance.props.onPress())
    act(() => thirdCategoryInstance.props.onPress())

    expect(tree.root.findAllByType(CheckIcon)).toHaveLength(3)
  })
})
