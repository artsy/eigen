import { StackScreenProps } from "@react-navigation/stack"
import {
  ArtworkFilterContext,
  FilterData,
  ParamDefaultValues,
  useSelectedOptionsDisplay,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import {
  AggregateOption,
  aggregationForFilter,
  FilterDisplayName,
  FilterParamName,
} from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React, { useContext } from "react"
import { FilterModalNavigationStack } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface GalleryOptionsScreenProps extends StackScreenProps<FilterModalNavigationStack, "GalleryOptionsScreen"> {}

export const GalleryOptionsScreen: React.FC<GalleryOptionsScreenProps> = ({ navigation }) => {
  const paramName = FilterParamName.gallery
  const filterKey = "gallery"
  const aggregation = aggregationForFilter(filterKey, state.aggregations)
  const options = aggregation?.counts.map((aggCount) => {
    return {
      displayText: aggCount.name,
      paramName,
      paramValue: aggCount.value,
      filterKey,
    }
  })
  const allOption: FilterData = { displayText: "All", paramName, filterKey, paramValue: ParamDefaultValues.partnerID }
  const displayOptions = [allOption].concat(options ?? [])

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find((option) => option.paramName === paramName)!

  const selectOption = (option: AggregateOption) => {
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: option.paramValue,
        paramName,
        filterKey,
      },
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.gallery}
      filterOptions={displayOptions}
      selectedOption={selectedOption}
      navigation={navigation}
    />
  )
}
