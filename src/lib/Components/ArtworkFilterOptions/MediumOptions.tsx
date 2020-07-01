import { AggregateOption, FilterParamName } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, FilterData, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { aggregationForFilter } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface MediumOptionsScreenProps {
  navigator: NavigatorIOS
}

export const MediumOptionsScreen: React.SFC<MediumOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const paramName = FilterParamName.medium
  const aggregation = aggregationForFilter(paramName, state.aggregations)
  const options = aggregation.counts.map(aggCount => {
    return {
      displayText: aggCount.name,
      paramValue: aggCount.value,
      paramName,
    }
  })

  const allOption: FilterData = { displayText: "All", paramName, paramValue: "*" }
  const displayOptions = [allOption].concat(options)

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
      filterHeaderText="Medium"
      filterOptions={displayOptions}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
