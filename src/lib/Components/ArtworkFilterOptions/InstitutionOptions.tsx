import { AggregateOption, FilterParamName } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, FilterData, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { aggregationForFilter } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface InstitutionOptionsScreenProps {
  navigator: NavigatorIOS
}

export const InstitutionOptionsScreen: React.SFC<InstitutionOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const paramName = FilterParamName.institution
  const aggregation = aggregationForFilter("institution", state.aggregations)
  const options = aggregation.counts.map(aggCount => {
    return {
      displayText: aggCount.name,
      paramName,
      paramValue: aggCount.value,
    }
  })
  const allOption: FilterData = { displayText: "All", paramName }
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
      filterHeaderText="Institution"
      filterOptions={displayOptions}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
