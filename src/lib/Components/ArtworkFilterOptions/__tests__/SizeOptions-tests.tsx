import { FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { Aggregations, ArtworkFilterContext, reducer } from "../../../utils/ArtworkFilter/ArtworkFiltersStore"
import { SizeOptionsScreen } from "../SizeOptions"
import { sharedAggregateFilterValidation, ValidationParams } from "./AggregationOptionCommonValidation"
import { getEssentialProps } from "./helper"

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

  const MockSizeScreen = ({ initialState }: any) => {
    const [filterState, dispatch] = React.useReducer(reducer, initialState)

    return (
      <ArtworkFilterContext.Provider
        value={{
          state: filterState,
          dispatch,
        }}
      >
        <SizeOptionsScreen {...getEssentialProps()} />
      </ArtworkFilterContext.Provider>
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
