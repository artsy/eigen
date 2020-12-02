import { FilterData, NewStore, ParamDefaultValues } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { AggregateOption, FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { NavigatorIOS } from "react-native"
import { aggregationForFilter } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface MediumOptionsScreenProps {
  navigator: NavigatorIOS
}

export const MediumOptionsScreen: React.FC<MediumOptionsScreenProps> = ({ navigator }) => {
  const paramName = FilterParamName.medium

  const selectedFilters = NewStore.useStoreState((state) => state.selectedFiltersComputed)
  const selectedFilter = selectedFilters[paramName]

  const aggregations = NewStore.useStoreState((state) => state.aggregations)
  const aggregation = aggregationForFilter(paramName, aggregations)
  const options = aggregation?.counts.map((aggCount) => {
    return {
      displayText: aggCount.name,
      paramValue: aggCount.value,
      paramName,
      count: aggCount.count,
    }
  })

  const allOption: FilterData = {
    displayText: "All",
    paramName,
    paramValue: ParamDefaultValues.medium,
  }
  const displayOptions = [allOption].concat(options ?? [])

  const selectedOption = displayOptions.find((option) => option.paramValue === selectedFilter) ?? allOption

  const updateValue = NewStore.useStoreActions((actions) => actions.selectFilter)
  const selectOption = (option: AggregateOption) => {
    updateValue({
      paramName,
      value: option.paramValue,
      display: option.displayText,
      filterScreenType: "medium",
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.medium}
      filterOptions={displayOptions}
      selectedOption={selectedOption}
      navigator={navigator}
      withExtraPadding
    />
  )
}
