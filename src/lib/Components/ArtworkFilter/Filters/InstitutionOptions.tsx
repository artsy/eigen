import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import { FilterData, FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import React from "react"
import { useArtworkFiltersAggregation } from "../useArtworkFilters"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

interface InstitutionOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "InstitutionOptionsScreen"> {}

export const InstitutionOptionsScreen: React.FC<InstitutionOptionsScreenProps> = ({ navigation }) => {
  const { aggregation } = useArtworkFiltersAggregation({ paramName: FilterParamName.institution })

  const options: FilterData[] = (aggregation?.counts ?? []).map(({ value: paramValue, name }) => {
    return { displayText: name, paramName: FilterParamName.institution, paramValue }
  })

  const { handleSelect, isSelected, handleClear, isActive } = useMultiSelect({
    options,
    paramName: FilterParamName.institution,
  })

  const filterOptions = options.map((option) => ({ ...option, paramValue: isSelected(option) }))

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.institution}
      filterOptions={filterOptions}
      navigation={navigation}
      {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
    />
  )
}
