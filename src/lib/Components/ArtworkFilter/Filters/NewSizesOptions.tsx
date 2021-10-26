import { StackScreenProps } from "@react-navigation/stack"
import React from "react"
import { ArtworkFilterNavigationStack } from ".."
import { FilterData, FilterDisplayName, FilterParamName } from "../ArtworkFilterHelpers"
import { IS_USA } from "./helpers"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

interface NewSizesOptionsScreenProps extends StackScreenProps<ArtworkFilterNavigationStack, "SizesOptionsScreen"> {}

const EUROPE_SIZE_OPTIONS: FilterData[] = [
  {
    displayText: "Small (under 40cm)",
    paramName: FilterParamName.sizes,
    paramValue: "SMALL",
  },
  {
    displayText: "Medium (40cm – 100cm)",
    paramName: FilterParamName.sizes,
    paramValue: "MEDIUM",
  },
  {
    displayText: "Large (over 100cm)",
    paramName: FilterParamName.sizes,
    paramValue: "LARGE",
  },
]

const USA_SIZE_OPTIONS: FilterData[] = [
  {
    displayText: "Small (under 16in)",
    paramName: FilterParamName.sizes,
    paramValue: "SMALL",
  },
  {
    displayText: "Medium (16in – 40in)",
    paramName: FilterParamName.sizes,
    paramValue: "MEDIUM",
  },
  {
    displayText: "Large (over 40in)",
    paramName: FilterParamName.sizes,
    paramValue: "LARGE",
  },
]

export const SIZES_OPTIONS = IS_USA ? USA_SIZE_OPTIONS : EUROPE_SIZE_OPTIONS

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
