import { FilterData, NewStore, ParamDefaultValues } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { AggregateOption, FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { NavigatorIOS } from "react-native"
import { aggregationForFilter } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface InstitutionOptionsScreenProps {
  navigator: NavigatorIOS
}

export const InstitutionOptionsScreen: React.FC<InstitutionOptionsScreenProps> = ({ navigator }) => {
  const paramName = FilterParamName.institution
  const filterKey = "institution"

  const selectedFilters = NewStore.useStoreState((state) => state.selectedFiltersComputed)
  const selectedFilter = selectedFilters[paramName]

  const aggregations = NewStore.useStoreState((state) => state.aggregations)
  const aggregation = aggregationForFilter(filterKey, aggregations)

  const options = aggregation?.counts.map((aggCount) => {
    return {
      displayText: aggCount.name,
      paramName,
      paramValue: aggCount.value,
      filterKey,
    }
  })
  const allOption: FilterData = { displayText: "All", paramName, filterKey, paramValue: ParamDefaultValues.partnerID }
  const displayOptions = [allOption].concat(options ?? [])
  const selectedOption = displayOptions.find((option) => option.paramValue === selectedFilter) ?? allOption

  const updateValue = NewStore.useStoreActions((actions) => actions.selectFilter)
  const selectOption = (option: AggregateOption) => {
    updateValue({
      paramName,
      value: option.paramValue,
      display: option.displayText,
      filterScreenType: "institution",
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.institution}
      filterOptions={displayOptions}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
