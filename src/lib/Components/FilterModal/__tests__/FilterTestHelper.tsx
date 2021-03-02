import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFiltersStoreProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { Theme } from "palette"
import React from "react"
import node from "../../../../__generated__/MockRelayRendererFixtures_artwork.graphql"
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

export const MockFilterScreen = ({ StoreConsumer }: { StoreConsumer: React.FC<any> }) => {
  return (
    <Theme>
      <ArtworkFiltersStoreProvider>
        <FilterOptionsScreen {...getEssentialProps()} />
        <StoreConsumer />
      </ArtworkFiltersStoreProvider>
    </Theme>
  )
}
