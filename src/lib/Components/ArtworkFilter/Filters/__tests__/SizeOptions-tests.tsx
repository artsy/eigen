import { Aggregations, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import React from "react"
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

  const MockSizeScreen = () => <SizeOptionsScreen {...getEssentialProps()} />

  const aggregateParams: ValidationParams = {
    Screen: MockSizeScreen,
    aggregations: mockAggregations,
    paramName: FilterParamName.size,
    filterKey: FilterParamName.size,
    name: "size",
  }

  sharedAggregateFilterValidation(aggregateParams)
})
