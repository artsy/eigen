import { StackScreenProps } from "@react-navigation/stack"
import {
  ArtworkFilterNavigationStack,
  ArtworkFilterOptionsScreen,
  FilterModalMode,
} from "app/Components/ArtworkFilter"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtworkFiltersState } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { mockNavigate } from "app/utils/tests/navigationMocks"

export const closeModalMock = jest.fn()

export const getEssentialProps = (params: {} = {}) =>
  ({
    navigation: {
      navigate: mockNavigate,
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

export const MockFilterScreen = ({ initialState }: { initialState?: ArtworkFiltersState }) => (
  <ArtworkFiltersStoreProvider initialData={initialState}>
    <ArtworkFilterOptionsScreen {...getEssentialProps()} />
  </ArtworkFiltersStoreProvider>
)
