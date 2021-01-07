import { ArtworkFilterContext, reducer } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { InitialState } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Theme } from "palette"
import React from "react"
import { FakeNavigator as MockNavigator } from "../../Bidding/__tests__/Helpers/FakeNavigator"
import { FilterModalMode, FilterOptions } from "../FilterModal"

const mockNavigator = new MockNavigator()
export const closeModalMock = jest.fn()

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
        <FilterOptions
          id="id"
          slug="slug"
          closeModal={closeModalMock}
          navigator={mockNavigator as any}
          mode={FilterModalMode.ArtistArtworks}
          title="Filter"
        />
      </ArtworkFilterContext.Provider>
    </Theme>
  )
}
