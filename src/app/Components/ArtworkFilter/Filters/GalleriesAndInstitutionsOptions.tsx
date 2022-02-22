import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import React from "react"
import { useArtworkFiltersAggregation } from "../useArtworkFilters"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

interface GalleriesAndInstitutionsOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "GalleriesAndInstitutionsOptionsScreen"> {}

export const GalleriesAndInstitutionsOptionsScreen: React.FC<
  GalleriesAndInstitutionsOptionsScreenProps
> = ({ navigation }) => {
  const { aggregation } = useArtworkFiltersAggregation({ paramName: FilterParamName.partnerIDs })

  const options: FilterData[] = (aggregation?.counts ?? []).map(({ value: paramValue, name }) => {
    return { displayText: name, paramName: FilterParamName.partnerIDs, paramValue }
  })

  const { handleSelect, isSelected, handleClear, isActive } = useMultiSelect({
    options,
    paramName: FilterParamName.partnerIDs,
  })

  const filterOptions = options.map((option) => ({ ...option, paramValue: isSelected(option) }))

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.partnerIDs}
      filterOptions={filterOptions}
      navigation={navigation}
      searchable
      {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
    />
  )
}
