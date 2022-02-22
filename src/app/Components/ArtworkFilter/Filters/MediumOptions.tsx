import { toTitleCase } from "@artsy/to-title-case"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  AggregateOption,
  aggregationForFilter,
  FilterData,
  FilterDisplayName,
  FilterParamName,
  ParamDefaultValues,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworksFiltersStore,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import React from "react"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface MediumOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "MediumOptionsScreen"> {}

export const MediumOptionsScreen: React.FC<MediumOptionsScreenProps> = ({ navigation }) => {
  const paramName = FilterParamName.medium

  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )

  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const aggregation = aggregationForFilter(paramName, aggregations)
  const options = aggregation?.counts.map((aggCount) => {
    return {
      displayText: toTitleCase(aggCount.name),
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
      filterHeaderText={FilterDisplayName.medium}
      filterOptions={displayOptions}
      selectedOption={selectedOption}
      navigation={navigation}
      withExtraPadding
    />
  )
}
