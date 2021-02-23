import { StackScreenProps } from "@react-navigation/stack"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import {
  AggregateOption,
  aggregationForFilter,
  FilterData,
  FilterDisplayName,
  FilterParamName,
  ParamDefaultValues,
} from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { FilterModalNavigationStack } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface SizeOptionsScreenProps extends StackScreenProps<FilterModalNavigationStack, "SizeOptionsScreen"> {}

export const SizeOptionsScreen: React.FC<SizeOptionsScreenProps> = ({ navigation }) => {
  const paramName = FilterParamName.size
  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const aggregation = aggregationForFilter(paramName, aggregations)

  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)

  const options = aggregation?.counts.map((aggCount) => {
    return {
      displayText: aggCount.name,
      paramName,
      paramValue: aggCount.value,
    }
  })

  const allOption: FilterData = { displayText: "All", paramName, paramValue: ParamDefaultValues.dimensionRange }
  const displayOptions = [allOption].concat(options ?? [])
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
      filterHeaderText={FilterDisplayName.size}
      filterOptions={displayOptions}
      selectedOption={selectedOption}
      navigation={navigation}
    />
  )
}
