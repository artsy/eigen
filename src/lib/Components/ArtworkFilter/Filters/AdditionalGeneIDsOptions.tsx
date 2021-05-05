import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import { FilterData, FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { useArtworkFiltersAggregation } from "lib/Components/ArtworkFilter/useArtworkFilters"
import React from "react"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

interface AdditionalGeneIDsOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "AdditionalGeneIDsOptionsScreen"> {}

export const AdditionalGeneIDsOptionsScreen: React.FC<AdditionalGeneIDsOptionsScreenProps> = ({ navigation }) => {
  // Uses the medium aggregations
  const { aggregation } = useArtworkFiltersAggregation({ paramName: FilterParamName.medium })

  // Convert aggregations to filter options
  const options: FilterData[] = (aggregation?.counts ?? []).map(({ name: displayText, value: paramValue }) => {
    return { paramName: FilterParamName.additionalGeneIDs, displayText, paramValue }
  })

  const { isSelected, handleClear, handleSelect, isActive } = useMultiSelect({
    options,
    paramName: FilterParamName.additionalGeneIDs,
  })

  // Convert options to boolean options for checkboxes
  const filterOptions = options.map((option) => ({ ...option, paramValue: isSelected(option) }))

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.additionalGeneIDs}
      filterOptions={filterOptions}
      navigation={navigation}
      {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
    />
  )
}
