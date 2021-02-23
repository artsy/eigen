import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFiltersStoreProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { Theme } from "palette"
import React from "react"
import { FilterModalMode, FilterModalNavigationStack, FilterOptionsScreen } from "../FilterModal"

export const closeModalMock = jest.fn()
export const navigateMock = jest.fn()

export const getEssentialProps = (params: {} = {}) =>
  (({
    navigation: {
      navigate: navigateMock,
    },
    route: {
      params: {
        closeModal: closeModalMock,
        exitModal: jest.fn(),
        id: "id",
        initiallyAppliedFilters: [],
        mode: FilterModalMode.ArtistArtworks,
        slug: "slug",
        title: "Filter",
        ...params,
      },
    },
    // navigation
  } as unknown) as StackScreenProps<FilterModalNavigationStack, "FilterOptionsScreen">)

export const MockFilterScreen = () => {
  return (
    <Theme>
      <ArtworkFiltersStoreProvider>
        <FilterOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    </Theme>
  )
}
