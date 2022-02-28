import { toTitleCase } from "@artsy/to-title-case"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { useArtworkFiltersAggregation } from "app/Components/ArtworkFilter/useArtworkFilters"
import React from "react"
import { ArtworksFiltersStore } from "../ArtworkFilterStore"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

interface AdditionalGeneIDsOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "AdditionalGeneIDsOptionsScreen"> {}

export const AdditionalGeneIDsOptionsScreen: React.FC<AdditionalGeneIDsOptionsScreenProps> = ({
  navigation,
}) => {
  const filterType = ArtworksFiltersStore.useStoreState((state) => state.filterType)
  const localFilterOptions = ArtworksFiltersStore.useStoreState((state) => state.filterOptions)

  // Uses the medium aggregations
  const { aggregation } = useArtworkFiltersAggregation({ paramName: FilterParamName.medium })

  let options: FilterData[] = []
  if (filterType === "local") {
    options = (localFilterOptions ?? []).find((o) => o.filterType === "additionalGeneIDs")!.values!
  } else {
    // Convert aggregations to filter options
    options = (aggregation?.counts ?? []).map(({ name: displayText, value: paramValue }) => {
      return {
        paramName: FilterParamName.additionalGeneIDs,
        displayText: toTitleCase(displayText),
        paramValue,
      }
    })
  }

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
