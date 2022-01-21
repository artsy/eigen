import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack, ArtworkFilterOptionsScreen, FilterModalMode } from "lib/Components/ArtworkFilter"
import { ArtworkFiltersStoreProvider , ArtworkFiltersState } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { GlobalStoreProvider } from "lib/store/GlobalStore"
import { Theme } from "palette"
import React from "react"

export const closeModalMock = jest.fn()
export const navigateMock = jest.fn()

export const getEssentialProps = (params: Record<string, unknown> = {}) =>
  ({
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
  } as unknown as StackScreenProps<ArtworkFilterNavigationStack, "FilterOptionsScreen">)

export const MockFilterScreen = ({ initialState }: { initialState?: ArtworkFiltersState }) => {
  return (
    <GlobalStoreProvider>
      <Theme>
        <ArtworkFiltersStoreProvider initialData={initialState}>
          <ArtworkFilterOptionsScreen {...getEssentialProps()} />
        </ArtworkFiltersStoreProvider>
      </Theme>
    </GlobalStoreProvider>
  )
}
