import { ArtworkFilterContext, FilterData, ParamDefaultValues } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { aggregationForFilter, FilterDisplayName, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

interface WaysToBuyOptionsScreenProps {
  navigator: NavigatorIOS
}

export const ArtistsOptionsScreen: React.FC<WaysToBuyOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const paramName = FilterParamName.artistIDs
  const aggregation = aggregationForFilter(paramName, state.aggregations)
  const options = aggregation?.counts.map((aggCount) => {
    return {
      displayText: aggCount.name,
      paramName,
      paramValue: aggCount.value,
      filterKey: paramName,
    }
  })
  const allOption: FilterData = {
    displayText: "All artists",
    paramName,
    filterKey: paramName,
    paramValue: ParamDefaultValues.artistIDs,
  }
  const displayOptions = [allOption].concat(options ?? [])

  console.log({ displayOptions })
  const selectOption = (option: FilterData, updatedValue: boolean) => {
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: updatedValue,
        paramName: option.paramName,
      },
    })
  }

  return (
    <MultiSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.waysToBuy}
      filterOptions={displayOptions}
      navigator={navigator}
      withCheckMark
    />
  )
}
