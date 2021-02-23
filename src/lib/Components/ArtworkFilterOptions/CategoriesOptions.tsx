import { StackScreenProps } from "@react-navigation/stack"
import { ArtworksFiltersStore } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { FilterData, FilterDisplayName, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { xor } from "lodash"
import React, { useState } from "react"
import { FilterModalNavigationStack } from "../FilterModal"
import { MultiSelectCheckOptionScreen } from "./MultiSelectCheckOption"

interface ArtistIDsArtworksOptionsScreenProps
  extends StackScreenProps<FilterModalNavigationStack, "CategoriesOptionsScreen"> {}

export const CATEGORIES_OPTIONS: FilterData[] = [
  {
    displayText: "Painting",
    paramName: FilterParamName.categories,
    paramValue: "Painting",
  },
  {
    displayText: "Work on paper",
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
    displayText: "Textile arts",
    paramName: FilterParamName.categories,
    paramValue: "Textile Arts",
  },
]

export const CategoriesOptionsScreen: React.FC<ArtistIDsArtworksOptionsScreenProps> = ({ navigation }) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)

  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const selectedFilters = ArtworksFiltersStore.useStoreState((state) => state.selectedFilters)

  const oldAppliedFilterCategories = appliedFilters.find((filter) => filter.paramName === FilterParamName.categories)
    ?.paramValue as string[] | undefined

  const oldSelectedFilterCategories = selectedFilters.find((filter) => filter.paramName === FilterParamName.categories)
    ?.paramValue as string[] | undefined

  // Get the Symmetric difference of the previously applied filters and the ones that were selected but not yet applied
  // Read more about Symmetric difference here https://en.wikipedia.org/wiki/Symmetric_difference
  const initialState = xor(oldAppliedFilterCategories, oldSelectedFilterCategories)
  const [selectedOptions, setSelectedOptions] = useState(initialState)

  const toggleOption = (option: FilterData) => {
    let updatedParamValue: string[]

    // The user is trying to uncheck the category
    if (typeof option.paramValue === "string" && selectedOptions?.includes(option.paramValue)) {
      updatedParamValue = selectedOptions.filter((paramValue) => paramValue !== option.paramValue)
    } else {
      // The user is trying to check the category
      updatedParamValue = [...(selectedOptions || []), option.paramValue as string]
    }

    setSelectedOptions(updatedParamValue)

    selectFiltersAction({
      displayText: option.displayText,
      paramValue: updatedParamValue,
      paramName: FilterParamName.categories,
    })
  }

  return (
    <MultiSelectCheckOptionScreen
      onSelect={toggleOption}
      filterHeaderText={FilterDisplayName.categories}
      filterOptions={CATEGORIES_OPTIONS}
      selectedOptions={selectedOptions}
      navigation={navigation}
    />
  )
}
