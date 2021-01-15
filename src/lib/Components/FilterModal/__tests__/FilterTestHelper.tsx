import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterContext, reducer } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { InitialState } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
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

export const MockFilterScreen = ({ initialState }: InitialState) => {
  const [filterState, dispatch] = React.useReducer(reducer, initialState)

  return (
    <Theme>
      <ArtworkFilterContext.Provider
        value={{
          state: filterState,
          dispatch,
        }}
      >
        <FilterOptionsScreen {...getEssentialProps()} />
      </ArtworkFilterContext.Provider>
    </Theme>
  )
}
