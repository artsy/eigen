import {
  AggregateOption,
  FilterDisplayName,
  FilterParamName,
} from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import {
  ArtworkFilterContext,
  FilterData,
  ParamDefaultValues,
  useSelectedOptionsDisplay,
} from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { aggregationForFilter } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface SizeOptionsScreenProps {
  navigator: NavigatorIOS
}

export const SizeOptionsScreen: React.SFC<SizeOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const paramName = FilterParamName.size
  const aggregation = aggregationForFilter(paramName, state.aggregations)
  const options = aggregation?.counts.map(aggCount => {
    return {
      displayText: aggCount.name,
      paramName,
      paramValue: aggCount.value,
    }
  })

  const allOption: FilterData = { displayText: "All", paramName, paramValue: ParamDefaultValues.dimensionRange }
  const displayOptions = [allOption].concat(options ?? [])
  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.paramName === paramName)!

  const selectOption = (option: AggregateOption) => {
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: option.paramValue,
        paramName,
      },
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.size}
      filterOptions={displayOptions}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
