import { ArtworkFilterContext, FilterData } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { aggregationForFilter, FilterDisplayName, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React, { useContext, useState } from "react"
import { NavigatorIOS } from "react-native"
import { MultiSelectCheckOptionScreen } from "./MultiSelectCheckOption"

interface ArtistIDsSaleArtworksOptionsScreenProps {
  navigator: NavigatorIOS
}

export const ArtistIDsSaleArtworksOptionsScreen: React.FC<ArtistIDsSaleArtworksOptionsScreenProps> = ({
  navigator,
}) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)
  const paramName = FilterParamName.artistIDs
  const aggregation = aggregationForFilter(paramName, state.aggregations)

  const artistIDsFilterData: FilterData | undefined = state.appliedFilters.find(
    (filter) => filter.paramName === paramName
  )

  let oldSelectedOptions = artistIDsFilterData?.paramValue
  // Make sure that the option "All Artist" is selected if the user did not select any artistS
  if (!oldSelectedOptions || (Array.isArray(oldSelectedOptions) && oldSelectedOptions.length === 0)) {
    oldSelectedOptions = ["all"]
  }

  const [selectedOptions, setSelectedOptions] = useState<string[]>(oldSelectedOptions as string[])

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

  const displayOptions = [allOption].concat(options ?? [])

  const selectOption = (option: FilterData) => {
    let updatedParamValue: string[] = []

    // If the user selected the all option
    if (option.paramValue !== "all") {
      // Add/Remove the new artist to the selectedOptions
      if (selectedOptions.includes(option.paramValue as string)) {
        updatedParamValue = selectedOptions.filter((paramValue) => paramValue !== option.paramValue)
      } else {
        updatedParamValue = [...selectedOptions, option.paramValue as string]
      }
      // Remove the all artists filter from the selectedOptions
      if (updatedParamValue.includes("all")) {
        updatedParamValue = updatedParamValue.filter((paramValue) => paramValue !== "all")
      }
      setSelectedOptions(updatedParamValue)
    } else {
      setSelectedOptions(["all"])
    }

    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: updatedParamValue,
        paramName,
      },
    })
  }

  return (
    <MultiSelectCheckOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.artistIDs}
      filterOptions={displayOptions}
      selectedOptions={selectedOptions}
      navigator={navigator}
    />
  )
}
