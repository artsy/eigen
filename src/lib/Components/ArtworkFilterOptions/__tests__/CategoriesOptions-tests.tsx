import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  ArtworksFiltersStore,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { CheckIcon } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { act } from "react-test-renderer"
import { CATEGORIES_OPTIONS, CategoriesOptionsScreen } from "../CategoriesOptions"
import { CheckMarkOptionListItem } from "../MultiSelectCheckOption"
import { getEssentialProps } from "./helper"

describe("Categories options screen", () => {
  let storeInstance: ReturnType<typeof ArtworksFiltersStore.useStore>

  const ArtworkFiltersStoreConsumer = () => {
    storeInstance = ArtworksFiltersStore.useStore()
    return null
  }

  const MockCategoryScreen = () => {
    return (
      <ArtworkFiltersStoreProvider>
        <CategoriesOptionsScreen {...getEssentialProps()} />
        <ArtworkFiltersStoreConsumer />
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
    const tree = renderWithWrappers(<MockCategoryScreen {...getEssentialProps()} />)
    ;(storeInstance as any).getActions().__injectState?.(initialState)

    const selectedCategoryIndex = Math.floor(Math.random() * Math.floor(CATEGORIES_OPTIONS.length)) // selected category index

    const selectedCategory = tree.root.findAllByType(CheckMarkOptionListItem)[selectedCategoryIndex]
    act(() => selectedCategory.findAllByType(TouchableOpacity)[0].props.onPress())
    expect(selectedCategory.findAllByType(CheckIcon)).toHaveLength(1)
  })

  it("allows multiple categories to be selected", () => {
    const tree = renderWithWrappers(<MockCategoryScreen {...getEssentialProps()} />)
    ;(storeInstance as any).getActions().__injectState?.(initialState)

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
