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

interface LocationCitiesOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "LocationCitiesOptionsScreen"> {}

export const LocationCitiesOptionsScreen: React.FC<LocationCitiesOptionsScreenProps> = ({
  navigation,
}) => {
  const { aggregation } = useArtworkFiltersAggregation({
    paramName: FilterParamName.locationCities,
  })

  const options: FilterData[] = (aggregation?.counts ?? []).map(({ value: paramValue, name }) => {
    return { displayText: name, paramName: FilterParamName.locationCities, paramValue }
  })

  const { handleSelect, isSelected, handleClear, isActive } = useMultiSelect({
    options,
    paramName: FilterParamName.locationCities,
  })

  const filterOptions = options.map((option) => ({ ...option, paramValue: isSelected(option) }))

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.locationCities}
      filterOptions={filterOptions}
      navigation={navigation}
      searchable
      {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
    />
  )
}
