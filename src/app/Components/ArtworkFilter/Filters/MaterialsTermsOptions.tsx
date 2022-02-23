import { toTitleCase } from "@artsy/to-title-case"
import { StackScreenProps } from "@react-navigation/stack"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { useArtworkFiltersAggregation } from "app/Components/ArtworkFilter/useArtworkFilters"
import { orderBy } from "lodash"
import React from "react"
import { ArtworkFilterNavigationStack } from "../ArtworkFilterNavigator"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

interface MaterialsTermsOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "MaterialsTermsOptionsScreen"> {}

export const MaterialsTermsOptionsScreen: React.FC<MaterialsTermsOptionsScreenProps> = ({
  navigation,
}) => {
  const { aggregation } = useArtworkFiltersAggregation({
    paramName: FilterParamName.materialsTerms,
  })

  const options: FilterData[] = (aggregation?.counts ?? []).map(
    ({ value: paramValue, name, count }) => {
      return {
        displayText: toTitleCase(name),
        paramName: FilterParamName.materialsTerms,
        paramValue,
        count,
      }
    }
  )

  const { handleSelect, handleClear, isSelected, isActive } = useMultiSelect({
    options,
    paramName: FilterParamName.materialsTerms,
  })

  // Convert options to boolean options for checkboxes
  const filterOptions = options.map((option) => ({ ...option, paramValue: isSelected(option) }))
  const sortedFilterOptions = orderBy(filterOptions, ["count", "name"], ["desc", "asc"])

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.materialsTerms}
      filterOptions={sortedFilterOptions}
      navigation={navigation}
      searchable
      noResultsLabel="No results found"
      {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
    />
  )
}
