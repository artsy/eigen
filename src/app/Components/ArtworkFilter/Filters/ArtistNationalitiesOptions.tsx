import { toTitleCase } from "@artsy/to-title-case"
import { StackScreenProps } from "@react-navigation/stack"
import React from "react"
import { FilterData, FilterDisplayName, FilterParamName } from "../ArtworkFilterHelpers"
import { ArtworkFilterNavigationStack } from "../ArtworkFilterNavigator"
import { useArtworkFiltersAggregation } from "../useArtworkFilters"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

const PARAM_NAME = FilterParamName.artistNationalities

interface ArtistNationalitiesOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "ArtistNationalitiesOptionsScreen"> {}

export const ArtistNationalitiesOptionsScreen: React.FC<ArtistNationalitiesOptionsScreenProps> = ({
  navigation,
}) => {
  const { aggregation } = useArtworkFiltersAggregation({ paramName: PARAM_NAME })

  const options: FilterData[] = (aggregation?.counts ?? []).map(({ value: paramValue, name }) => {
    return { displayText: toTitleCase(name), paramName: PARAM_NAME, paramValue }
  })

  const { handleSelect, isSelected, handleClear, isActive } = useMultiSelect({
    options,
    paramName: PARAM_NAME,
  })

  const filterOptions = options.map((option) => ({ ...option, paramValue: isSelected(option) }))

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.artistNationalities}
      filterOptions={filterOptions}
      navigation={navigation}
      searchable
      {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
    />
  )
}
