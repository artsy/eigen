import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterContext, FilterData } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { FilterDisplayName, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React, { useContext, useState } from "react"
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
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const oldSelectedCategories = state.appliedFilters.find((filter) => filter.paramName === FilterParamName.categories)
    ?.paramValue as string[] | undefined
  const [selectedOptions, setSelectedOptions] = useState(oldSelectedCategories || [])

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
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: updatedParamValue,
        paramName: FilterParamName.categories,
      },
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
