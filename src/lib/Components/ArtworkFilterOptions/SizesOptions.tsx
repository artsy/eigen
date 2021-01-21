import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterContext, FilterData } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { FilterDisplayName, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Separator, Text } from "palette"
import React, { useContext, useRef, useState } from "react"
import { FilterModalNavigationStack } from "../FilterModal"
import { MultiSelectCheckOptionScreen } from "./MultiSelectCheckOption"

interface SizesOptionsScreenProps extends StackScreenProps<FilterModalNavigationStack, "SizesOptionsScreen"> {}

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
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const oldAppliedFilterSizs = useRef(
    state.appliedFilters.find((filter) => filter.paramName === FilterParamName.sizes)?.paramValue as
      | string[]
      | undefined
  )

  const oldSelectedFilterSizs = useRef(
    state.selectedFilters.find((filter) => filter.paramName === FilterParamName.sizes)?.paramValue as
      | string[]
      | undefined
  )
  const [selectedOptions, setSelectedOptions] = useState(oldSelectedFilterSizs.current || oldAppliedFilterSizs.current)

  const toggleOption = (option: FilterData) => {
    let updatedParamValue: string[]

    // The user is trying to uncheck the size
    if (typeof option.paramValue === "string" && selectedOptions?.includes(option.paramValue)) {
      updatedParamValue = selectedOptions.filter((paramValue) => paramValue !== option.paramValue)
    } else {
      // The user is trying to check the size
      updatedParamValue = [...(selectedOptions || []), option.paramValue as string]
    }

    setSelectedOptions(updatedParamValue)
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: updatedParamValue,
        paramName: FilterParamName.sizes,
      },
    })
  }

  return (
    <MultiSelectCheckOptionScreen
      onSelect={toggleOption}
      ListHeaderComponent={
        <>
          <Text variant="caption" color="black60" textAlign="center" my={15}>
            Based on the artwork’s average dimension
          </Text>
          <Separator />
        </>
      }
      filterHeaderText={FilterDisplayName.sizes}
      filterOptions={SIZES_OPTIONS}
      selectedOptions={selectedOptions}
      navigation={navigation}
    />
  )
}
