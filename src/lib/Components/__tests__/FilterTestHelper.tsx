import { Theme } from "@artsy/palette"
import { InitialState } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, reducer } from "lib/utils/ArtworkFiltersStore"
import { OwnerEntityTypes, PageNames } from "lib/utils/track/schema"
import React from "react"
import { FakeNavigator as MockNavigator } from "../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { FilterOptions } from "../FilterModal"

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
          trackingOwnerEntity={OwnerEntityTypes.Artist}
          trackingScreenName={PageNames.ArtistPage}
        />
      </ArtworkFilterContext.Provider>
    </Theme>
  )
}
