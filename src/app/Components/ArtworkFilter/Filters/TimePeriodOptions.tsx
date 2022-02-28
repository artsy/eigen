import { toTitleCase } from "@artsy/to-title-case"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
  getDisplayNameForTimePeriod,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { useArtworkFiltersAggregation } from "app/Components/ArtworkFilter/useArtworkFilters"
import React from "react"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

interface TimePeriodOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "TimePeriodOptionsScreen"> {}

export const TimePeriodOptionsScreen: React.FC<TimePeriodOptionsScreenProps> = ({ navigation }) => {
  const { aggregation } = useArtworkFiltersAggregation({ paramName: FilterParamName.timePeriod })

  const options: FilterData[] = (aggregation?.counts ?? []).map(({ value: paramValue, name }) => {
    const label = getDisplayNameForTimePeriod(name)
    const displayText = toTitleCase(label)

    return { displayText, paramName: FilterParamName.timePeriod, paramValue }
  })

  const { handleSelect, handleClear, isSelected, isActive } = useMultiSelect({
    options,
    paramName: FilterParamName.timePeriod,
  })

  // Convert options to boolean options for checkboxes
  const filterOptions = options.map((option) => ({ ...option, paramValue: isSelected(option) }))

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.timePeriod}
      filterOptions={filterOptions}
      navigation={navigation}
      {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
    />
  )
}
