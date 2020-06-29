import { Theme } from "@artsy/palette"
import { InitialState } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { Aggregations, ArtworkFilterContext, reducer } from "lib/utils/ArtworkFiltersStore"
import { OwnerEntityTypes, PageNames } from "lib/utils/track/schema"
import React from "react"
import { FakeNavigator as MockNavigator } from "../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { FilterOptions } from "../FilterModal"

const mockNavigator = new MockNavigator()
export const closeModalMock = jest.fn()

const mockAggregations: Aggregations = [
  {
    slice: "MEDIUM",
    counts: [
      {
        name: "Sculpture",
        count: 277,
        value: "sculpture",
      },
      {
        name: "Work on Paper",
        count: 149,
        value: "work-on-paper",
      },
      {
        name: "Painting",
        count: 145,
        value: "painting",
      },
      {
        name: "Drawing",
        count: 83,
        value: "drawing",
      },
    ],
  },
  {
    slice: "PRICE_RANGE",
    counts: [
      {
        name: "for Sale",
        count: 2028,
        value: "*-*",
      },
      {
        name: "between $10,000 & $50,000",
        count: 598,
        value: "10000-50000",
      },
      {
        name: "between $1,000 & $5,000",
        count: 544,
        value: "1000-5000",
      },
      {
        name: "Under $1,000",
        count: 393,
        value: "*-1000",
      },
      {
        name: "between $5,000 & $10,000",
        count: 251,
        value: "5000-10000",
      },
      {
        name: "over $50,000",
        count: 233,
        value: "50000-*",
      },
    ],
  },
  {
    slice: "MAJOR_PERIOD",
    counts: [
      {
        name: "Late 19th Century",
        count: 6,
        value: "Late 19th Century",
      },
      {
        name: "2010",
        count: 10,
        value: "2010",
      },
      {
        name: "2000",
        count: 4,
        value: "2000",
      },
      {
        name: "1990",
        count: 20,
        value: "1990",
      },
      {
        name: "1980",
        count: 46,
        value: "1980",
      },
      {
        name: "1970",
        count: 524,
        value: "1970",
      },
    ],
  },
]

export const MockFilterScreen = ({ initialState }: InitialState) => {
  const [filterState, dispatch] = React.useReducer(reducer, initialState)

  return (
    <Theme>
      <ArtworkFilterContext.Provider
        value={{
          state: filterState,
          aggregations: mockAggregations,
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
