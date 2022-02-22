import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import React from "react"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

interface ArtistIDsArtworksOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "CategoriesOptionsScreen"> {}

export const CATEGORIES_OPTIONS: FilterData[] = [
  {
    displayText: "Painting",
    paramName: FilterParamName.categories,
    paramValue: "Painting",
  },
  {
    displayText: "Work on Paper",
    paramName: FilterParamName.categories,
    paramValue: "Work on Paper",
  },
  {
    displayText: "Sculpture",
    paramName: FilterParamName.categories,
    paramValue: "Sculpture",
  },
  {
    displayText: "Print",
    paramName: FilterParamName.categories,
    paramValue: "Print",
  },
  {
    displayText: "Photography",
    paramName: FilterParamName.categories,
    paramValue: "Photography",
  },
  {
    displayText: "Textile Arts",
    paramName: FilterParamName.categories,
    paramValue: "Textile Arts",
  },
]

export const CategoriesOptionsScreen: React.FC<ArtistIDsArtworksOptionsScreenProps> = ({
  navigation,
}) => {
  const { handleSelect, isSelected, handleClear, isActive } = useMultiSelect({
    options: CATEGORIES_OPTIONS,
    paramName: FilterParamName.categories,
  })

  const filterOptions = CATEGORIES_OPTIONS.map((option) => ({
    ...option,
    paramValue: isSelected(option),
  }))

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.categories}
      filterOptions={filterOptions}
      navigation={navigation}
      {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
    />
  )
}
