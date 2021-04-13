import { StackScreenProps } from "@react-navigation/stack"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import {
  aggregationForFilter,
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "lib/Components/ArtworkFilter/FilterArtworksHelpers"
import React, { useState } from "react"
import { FilterModalNavigationStack } from "../ArtworkFilter"
import { MultiSelectCheckOptionScreen } from "./MultiSelectCheckOption"

interface ArtistIDsSaleArtworksOptionsScreenProps
  extends StackScreenProps<FilterModalNavigationStack, "ArtistIDsOptionsScreen"> {}

export const ArtistIDsSaleArtworksOptionsScreen: React.FC<ArtistIDsSaleArtworksOptionsScreenProps> = ({
  navigation,
}) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)

  const paramName = FilterParamName.artistIDs
  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const aggregation = aggregationForFilter(paramName, aggregations)

  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)

  const previouslyAppliedArtistFilters: FilterData | undefined = appliedFilters.find(
    (filter) => filter.paramName === paramName
  )

  const previouslyArtistIFollowFilters: FilterData | undefined = appliedFilters.find(
    (filter) => filter.paramName === FilterParamName.artistsIFollow && filter.paramValue
  )

  const counts = ArtworksFiltersStore.useStoreState((state) => state.counts)

  let previousSelectedOptions = previouslyAppliedArtistFilters?.paramValue

  // Make sure the option Artists you follow is selected if th user already applied it
  if (previouslyArtistIFollowFilters) {
    previousSelectedOptions = ["artistsYouFollow"]
  }

  // Make sure that the option "All Artist" is selected if the user did not select any artists
  if (!previousSelectedOptions || (Array.isArray(previousSelectedOptions) && previousSelectedOptions.length === 0)) {
    previousSelectedOptions = ["all"]
  }
  const [selectedOptions, setSelectedOptions] = useState<string[]>(previousSelectedOptions as string[])

  const options: FilterData[] | undefined = aggregation?.counts.map((aggCount) => {
    return {
      displayText: aggCount.name,
      paramName,
      paramValue: aggCount.value,
      count: aggCount.count,
    }
  })

  const allOption: FilterData = {
    displayText: "All artists",
    paramName,
    paramValue: "all",
  }

  const artistsYouFollowOption: FilterData = {
    displayText: "Artists you follow",
    paramName: FilterParamName.artistsIFollow,
    paramValue: "artistsYouFollow",
    count: counts.followedArtists,
  }

  const displayOptions = [artistsYouFollowOption, allOption].concat(options ?? [])

  const selectOption = (option: FilterData) => {
    let updatedParamValue: string[] = []

    // If the user selected the artists I follow option
    if (option.paramName === FilterParamName.artistsIFollow) {
      setSelectedOptions(["artistsYouFollow"])
      selectFiltersAction({
        displayText: option.displayText,
        paramValue: true,
        paramName: FilterParamName.artistsIFollow,
      })

      selectFiltersAction({
        displayText: "All artists",
        paramValue: [],
        paramName,
      })

      return
    }
    // If the user did not select the all option
    if (option.paramValue !== "all") {
      // Add/Remove the new artist to the selectedOptions
      if (selectedOptions.includes(option.paramValue as string)) {
        updatedParamValue = selectedOptions.filter((paramValue) => paramValue !== option.paramValue)
      } else {
        updatedParamValue = [...selectedOptions, option.paramValue as string]
      }
      // Remove the "all artists" and "Artists you follow" filters from the selectedOptions
      if (updatedParamValue.includes("all") || updatedParamValue.includes("artistsYouFollow")) {
        updatedParamValue = updatedParamValue.filter(
          (paramValue) => paramValue !== "all" && paramValue !== "artistsYouFollow"
        )
      }
      setSelectedOptions(updatedParamValue)
    } else {
      // The user selected the all artists option
      setSelectedOptions(["all"])
    }

    selectFiltersAction({
      displayText: option.displayText,
      paramValue: false,
      paramName: FilterParamName.artistsIFollow,
    })

    selectFiltersAction({
      displayText: option.displayText,
      paramValue: updatedParamValue,
      paramName,
    })
  }

  return (
    <MultiSelectCheckOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.artistIDs}
      filterOptions={displayOptions}
      selectedOptions={selectedOptions}
      navigation={navigation}
      withIndent
    />
  )
}
