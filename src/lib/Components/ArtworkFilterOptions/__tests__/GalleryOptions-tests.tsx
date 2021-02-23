import { Aggregations, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { ArtworkFiltersStoreProvider } from "../../../utils/ArtworkFilter/ArtworkFiltersStore"
import { GalleryOptionsScreen } from "../GalleryOptions"
import { sharedAggregateFilterValidation, ValidationParams } from "./AggregationOptionCommonValidation"
import { getEssentialProps } from "./helper"

describe("Gallery Options Screen", () => {
  const mockAggregations: Aggregations = [
    {
      slice: "GALLERY",
      counts: [
        {
          name: "RoGallery",
          count: 241,
          value: "rogallery",
        },
        {
          name: "John Szoke",
          count: 131,
          value: "john-szoke-1",
        },
        {
          name: "ByNewArt",
          count: 106,
          value: "bynewart",
        },
        {
          name: "ArtWise",
          count: 92,
          value: "artwise",
        },
        {
          name: "HELENE BAILLY GALLERY",
          count: 87,
          value: "helene-bailly-gallery",
        },
        {
          name: "BAILLY GALLERY",
          count: 82,
          value: "bailly-gallery",
        },
      ],
    },
  ]

  const MockGalleryScreen = () => {
    return (
      <ArtworkFiltersStoreProvider>
        <GalleryOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  const aggregateParams: ValidationParams = {
    Screen: MockGalleryScreen,
    aggregations: mockAggregations,
    paramName: FilterParamName.gallery,
    filterKey: "gallery",
    name: "gallery",
  }

  sharedAggregateFilterValidation(aggregateParams)
})
