import { AggregateOption, FilterParamName, FilterType } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, FilterData, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { aggregationForFilterType } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface InstitutionOptionsScreenProps {
  navigator: NavigatorIOS
}

export const InstitutionOptionsScreen: React.SFC<InstitutionOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const filterType = FilterType.institution
  const aggregation = aggregationForFilterType(filterType, state.aggregations)
  const options = aggregation.counts.map(aggCount => {
    return {
      displayText: aggCount.name,
      paramName: FilterParamName.institution,
      paramValue: aggCount.value,
      filterType,
    }
  })
  const allOption: FilterData = { displayText: "All", paramName: FilterParamName.institution, filterType }
  const displayOptions = [allOption].concat(options)
  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)!

  const selectOption = (option: AggregateOption) => {
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: option.paramValue,
        paramName: FilterParamName.institution,
        filterType,
      },
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText="Institution"
      filterOptions={displayOptions}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
