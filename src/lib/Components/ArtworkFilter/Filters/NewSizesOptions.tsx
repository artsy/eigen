import { StackScreenProps } from "@react-navigation/stack"
import React from "react"
import { ArtworkFilterNavigationStack } from ".."
import { FilterData, FilterDisplayName, FilterParamName } from "../ArtworkFilterHelpers"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

interface NewSizesOptionsScreenProps extends StackScreenProps<ArtworkFilterNavigationStack, "SizesOptionsScreen"> {}

export const SIZES_OPTIONS: FilterData[] = [
  {
    displayText: "Small (under 40cm)",
    paramName: FilterParamName.sizes,
    paramValue: "SMALL",
  },
  {
    displayText: `Medium (40cm – 100cm)`,
    paramName: FilterParamName.sizes,
    paramValue: "MEDIUM",
  },
  {
    displayText: "Large (over 100cm)",
    paramName: FilterParamName.sizes,
    paramValue: "LARGE",
  },
]

export const NewSizesOptionsScreen: React.FC<NewSizesOptionsScreenProps> = ({ navigation }) => {
  const { handleSelect, isSelected } = useMultiSelect({
    options: SIZES_OPTIONS,
    paramName: FilterParamName.sizes,
  })
  const filterOptions = SIZES_OPTIONS.map((option) => ({ ...option, paramValue: isSelected(option) }))

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.sizes}
      filterOptions={filterOptions}
      navigation={navigation}
    />
  )
}
