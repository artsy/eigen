import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import {
  aggregationForFilter,
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import React, { useState } from "react"
import { MultiSelectCheckOptionScreen } from "./MultiSelectCheckOption"

interface ArtistIDsSaleArtworksOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "ArtistIDsOptionsScreen"> {}

export const ArtistIDsSaleArtworksOptionsScreen: React.FC<ArtistIDsSaleArtworksOptionsScreenProps> = ({
  navigation,
}) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)

  const paramName = FilterParamName.artistIDs
  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const aggregation = aggregationForFilter(paramName, aggregations)

  const selectedOptions = useSelectedOptionsDisplay()

  const previouslyAppliedArtistFilters: FilterData | undefined = selectedOptions.find(
    (filter) => filter.paramName === paramName
  )

  const previouslyArtistIFollowFilters: FilterData | undefined = selectedOptions.find(
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
  const [selectedParamValues, setSelectedParamValues] = useState<string[]>(previousSelectedOptions as string[])

  const options: FilterData[] | undefined =
    aggregation?.counts.map((aggCount) => {
      return {
        displayText: aggCount.name,
        paramName,
        paramValue: aggCount.value,
        count: aggCount.count,
      }
    }) ?? []

  const displayOptions = [
    {
      displayText: "Artists You Follow",
      paramName: FilterParamName.artistsIFollow,
      paramValue: "artistsYouFollow",
      count: counts.followedArtists,
    },
    {
      displayText: "All Artists",
      paramName,
      paramValue: "all",
    },
    ...options,
  ]

  const selectOption = (option: FilterData) => {
    let updatedParamValue: string[] = []

    // If the user selected the artists I follow option
    if (option.paramName === FilterParamName.artistsIFollow) {
      setSelectedParamValues(["artistsYouFollow"])
      selectFiltersAction({
        displayText: option.displayText,
        paramValue: true,
        paramName: FilterParamName.artistsIFollow,
      })

      selectFiltersAction({
        displayText: "All Artists",
        paramValue: [],
        paramName,
      })

      return
    }
    // If the user did not select the all option
    if (option.paramValue !== "all") {
      // Add/Remove the new artist to the selectedOptions
      if (selectedParamValues.includes(option.paramValue as string)) {
        updatedParamValue = selectedParamValues.filter((paramValue) => paramValue !== option.paramValue)
      } else {
        updatedParamValue = [...selectedParamValues, option.paramValue as string]
      }
      // Remove the "all artists" and "Artists you follow" filters from the selectedParamValues
      if (updatedParamValue.includes("all") || updatedParamValue.includes("artistsYouFollow")) {
        updatedParamValue = updatedParamValue.filter(
          (paramValue) => paramValue !== "all" && paramValue !== "artistsYouFollow"
        )
      }
      setSelectedParamValues(updatedParamValue)
    } else {
      // The user selected the all artists option
      setSelectedParamValues(["all"])
    }

    selectFiltersAction({
      displayText: option.displayText,
      paramValue: false,
      paramName: FilterParamName.artistsIFollow,
    })

    const displayText = updatedParamValue.map((paramValue) => {
      const optionItem = options.find((currentOption) => currentOption.paramValue === paramValue)
      return optionItem?.displayText
    })

    selectFiltersAction({
      displayText: displayText.join(", "),
      paramValue: updatedParamValue,
      paramName,
    })
  }

  return (
    <MultiSelectCheckOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.artistIDs}
      filterOptions={displayOptions}
      selectedOptions={selectedParamValues}
      navigation={navigation}
      withIndent
    />
  )
}
