import { AggregateOption, FilterParamName, FilterType } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, FilterData, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { aggregationForFilterType } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface MediumOptionsScreenProps {
  navigator: NavigatorIOS
}

export const MediumOptionsScreen: React.SFC<MediumOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, aggregations } = useContext(ArtworkFilterContext)

  const filterType = FilterType.medium
  const paramName = FilterParamName.medium
  const aggregation = aggregationForFilterType(filterType, aggregations!)
  const options = aggregation.counts.map(aggCount => {
    return {
      displayText: aggCount.name,
      paramValue: aggCount.value,
      paramName,
      filterType,
    }
  })

  const allOption: FilterData = { displayText: "All", paramName, paramValue: "*", filterType }
  const displayOptions = [allOption].concat(options)

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)!

  const selectOption = (option: AggregateOption) => {
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: option.paramValue,
        paramName: FilterParamName.medium,
        filterType,
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
