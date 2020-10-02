import {
  ArtworkFilterContext,
  FilterData,
  ParamDefaultValues,
  useSelectedOptionsDisplay,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { AggregateOption, FilterDisplayName, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { aggregationForFilter } from "../FilterModal/FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface MediumOptionsScreenProps {
  navigator: NavigatorIOS
}

export const MediumOptionsScreen: React.FC<MediumOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const paramName = FilterParamName.medium
  const aggregation = aggregationForFilter(paramName, state.aggregations)
  const options = aggregation?.counts.map((aggCount) => {
    return {
      displayText: aggCount.name,
      paramValue: aggCount.value,
      paramName,
    }
  })

  const allOption: FilterData = { displayText: "All", paramName, paramValue: ParamDefaultValues.medium }
  const displayOptions = [allOption].concat(options ?? [])

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find((option) => option.paramName === paramName)!

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
      filterHeaderText={FilterDisplayName.medium}
      filterOptions={displayOptions}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
