import { Aggregations, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  sharedAggregateFilterValidation,
  ValidationParams,
} from "app/Components/ArtworkFilter/Filters/AggregationOptionCommonValidation"
import { MediumOptionsScreen } from "app/Components/ArtworkFilter/Filters/MediumOptions"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"

describe("Medium Options Screen", () => {
  const mockAggregations: Aggregations = [
    {
      slice: "MEDIUM",
      counts: [
        {
          name: "Prints",
          count: 2956,
          value: "prints",
        },
        {
          name: "Design",
          count: 513,
          value: "design",
        },
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
        {
          name: "Jewelry",
          count: 9,
          value: "jewelry",
        },
        {
          name: "Photography",
          count: 4,
          value: "photography",
        },
      ],
    },
  ]

  const MockMediumScreen = () => <MediumOptionsScreen {...getEssentialProps()} />

  const aggregateParams: ValidationParams = {
    Screen: MockMediumScreen,
    aggregations: mockAggregations,
    paramName: FilterParamName.medium,
    filterKey: FilterParamName.medium,
    name: "medium",
  }
  sharedAggregateFilterValidation(aggregateParams)
})
