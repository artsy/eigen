import { StackScreenProps } from "@react-navigation/stack"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import {
  AggregateOption,
  aggregationForFilter,
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "lib/Components/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { FilterModalNavigationStack } from "lib/Components/ArtworkFilter"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface PriceRangeOptionsScreenProps
  extends StackScreenProps<FilterModalNavigationStack, "PriceRangeOptionsScreen"> {}

const priceRangeDisplayText: Map<string, string> = new Map([
  ["*-*", "All"],
  ["*-1000", "$0-1,000"],
  ["1000-5000", "$1000-5,000"],
  ["5000-10000", "$5,000-10,000"],
  ["10000-50000", "$10,000-50,000"],
  ["50000-*", "$50,000+"],
])

const priceSort = (left: FilterData, right: FilterData): number => {
  const sortOrder = ["*-*", "50000-*", "10000-50000", "5000-10000", "1000-5000", "*-1000"]
  const leftParam = left.paramValue as string
  const rightParam = right.paramValue as string
  if (sortOrder.indexOf(leftParam) < sortOrder.indexOf(rightParam)) {
    return -1
  } else {
    return 1
  }
}

export const PriceRangeOptionsScreen: React.FC<PriceRangeOptionsScreenProps> = ({ navigation }) => {
  const paramName = FilterParamName.priceRange

  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)

  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const aggregation = aggregationForFilter(paramName, aggregations)
  const options = aggregation?.counts.map((aggCount) => {
    return {
      displayText: priceRangeDisplayText.get(aggCount.value) ?? aggCount.name,
      paramName,
      paramValue: aggCount.value,
    }
  })
  const sortedOptions = options?.sort(priceSort) ?? []
  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find((option) => option.paramName === paramName)!

  const selectOption = (option: AggregateOption) => {
    selectFiltersAction({
      displayText: option.displayText,
      paramValue: option.paramValue,
      paramName,
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.priceRange}
      filterOptions={sortedOptions}
      selectedOption={selectedOption}
      navigation={navigation}
    />
  )
}
