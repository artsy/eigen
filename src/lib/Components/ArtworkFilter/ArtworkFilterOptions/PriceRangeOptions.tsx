import { FilterData, NewStore } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { AggregateOption, FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { NavigatorIOS } from "react-native"
import { aggregationForFilter } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface PriceRangeOptionsScreenProps {
  navigator: NavigatorIOS
}

const priceRangeDisplayText: Map<string, string> = new Map([
  ["*-*", "All"],
  ["*-1000", "$0-1,000"],
  ["1000-5000", "$1,000-5,000"],
  ["5000-10000", "$5,000-10,000"],
  ["10000-50000", "$10,000-50,000"],
  ["50000-*", "$50,000+"],
])

const priceSort = (left: FilterData, right: FilterData): number => {
  const sortOrder = ["*-*", "*-1000", "1000-5000", "5000-10000", "10000-50000", "50000-*"]
  const leftParam = left.paramValue as string
  const rightParam = right.paramValue as string
  if (sortOrder.indexOf(leftParam) < sortOrder.indexOf(rightParam)) {
    return -1
  } else {
    return 1
  }
}

export const PriceRangeOptionsScreen: React.FC<PriceRangeOptionsScreenProps> = ({ navigator }) => {
  const paramName = FilterParamName.priceRange

  const selectedFilters = NewStore.useStoreState((state) => state.selectedFiltersComputed)
  const selectedFilter = selectedFilters.priceRange

  const aggregations = NewStore.useStoreState((state) => state.aggregations)
  const aggregation = aggregationForFilter(paramName, aggregations)
  const options = aggregation?.counts.map((aggCount) => {
    return {
      displayText: priceRangeDisplayText.get(aggCount.value) ?? aggCount.name,
      paramName,
      paramValue: aggCount.value,
    }
  })
  const sortedOptions = options?.sort(priceSort) ?? []
  const selectedOption = sortedOptions.find((option) => option.paramValue === selectedFilter)

  const updateValue = NewStore.useStoreActions((actions) => actions.selectFilter)
  const selectOption = (option: AggregateOption) => {
    updateValue({
      paramName,
      value: option.paramValue,
      display: option.displayText,
      filterScreenType: "priceRange",
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.priceRange}
      filterOptions={sortedOptions}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
