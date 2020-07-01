import { Theme } from "@artsy/palette"
import { FilterParamName } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import React from "react"
import { Aggregations, ArtworkFilterContext, reducer } from "../../../utils/ArtworkFiltersStore"
import { SizeOptionsScreen } from "../SizeOptions"
import { sharedAggregateFilterValidation, ValidationParams } from "./AggregationOptionCommonValidation"

describe("Size Options Screen", () => {
  const mockAggregations: Aggregations = [
    {
      slice: "DIMENSION_RANGE",
      counts: [
        {
          name: "Small",
          count: 3202,
          value: "*-24.0",
        },
        {
          name: "Medium",
          count: 746,
          value: "24.0-48.0",
        },
        {
          name: "Large",
          count: 42,
          value: "48.0-84.0",
        },
        {
          name: "Very Large",
          count: 7,
          value: "84.0-*",
        },
      ],
    },
  ]

  const MockSizeScreen = ({ initialState, navigator }: any) => {
    const [filterState, dispatch] = React.useReducer(reducer, initialState)

    return (
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: filterState,
            dispatch,
          }}
        >
          <SizeOptionsScreen navigator={navigator} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )
  }

  const aggregateParams: ValidationParams = {
    Screen: MockSizeScreen,
    aggregations: mockAggregations,
    paramName: FilterParamName.size,
    filterKey: FilterParamName.size,
    name: "size",
  }

  sharedAggregateFilterValidation(aggregateParams)
})
