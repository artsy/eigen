import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import { FilterData, FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { Separator, Text } from "palette"
import React from "react"
import { MultiSelectCheckOptionScreen } from "./MultiSelectCheckOption"
import { useMultiSelect } from "./useMultiSelect"

interface SizesOptionsScreenProps extends StackScreenProps<ArtworkFilterNavigationStack, "SizesOptionsScreen"> {}

export const SIZES_OPTIONS: FilterData[] = [
  {
    displayText: "Small (under 40cm)",
    paramName: FilterParamName.sizes,
    paramValue: "SMALL",
  },
  {
    displayText: "Medium (40cm – 100cm)",
    paramName: FilterParamName.sizes,
    paramValue: "MEDIUM",
  },
  {
    displayText: "Large (over 100cm)",
    paramName: FilterParamName.sizes,
    paramValue: "LARGE",
  },
]

export const SizesOptionsScreen: React.FC<SizesOptionsScreenProps> = ({ navigation }) => {
  const { handleSelect, isSelected } = useMultiSelect({
    options: SIZES_OPTIONS,
    paramName: FilterParamName.sizes,
  })

  const filterOptions = SIZES_OPTIONS.map((option) => ({ ...option, paramValue: isSelected(option) }))

  return (
    <MultiSelectCheckOptionScreen
      onSelect={handleSelect}
      ListHeaderComponent={
        <>
          <Text variant="caption" color="black60" textAlign="center" my={15}>
            Based on the artwork’s average dimension
          </Text>
          <Separator />
        </>
      }
      filterHeaderText={FilterDisplayName.sizes}
      filterOptions={filterOptions}
      navigation={navigation}
    />
  )
}
