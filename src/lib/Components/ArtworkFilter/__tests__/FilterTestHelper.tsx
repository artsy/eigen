import { StackScreenProps } from "@react-navigation/stack"
import { FilterModalMode, FilterModalNavigationStack, FilterOptionsScreen } from "lib/Components/ArtworkFilter"
import { ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { ArtworkFiltersState } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { GlobalStoreProvider } from "lib/store/GlobalStore"
import { Theme } from "palette"
import React from "react"

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

export const MockFilterScreen = ({ initialState }: { initialState?: ArtworkFiltersState }) => {
  return (
    <GlobalStoreProvider>
      <Theme>
        <ArtworkFiltersStoreProvider initialData={initialState}>
          <FilterOptionsScreen {...getEssentialProps()} />
        </ArtworkFiltersStoreProvider>
      </Theme>
    </GlobalStoreProvider>
  )
}
