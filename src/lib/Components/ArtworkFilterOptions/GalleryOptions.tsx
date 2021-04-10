import { StackScreenProps } from "@react-navigation/stack"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import {
  AggregateOption,
  aggregationForFilter,
  FilterData,
  FilterDisplayName,
  FilterParamName,
  ParamDefaultValues,
} from "lib/Components/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { FilterModalNavigationStack } from "../ArtworkFilter"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface GalleryOptionsScreenProps extends StackScreenProps<FilterModalNavigationStack, "GalleryOptionsScreen"> {}

export const GalleryOptionsScreen: React.FC<GalleryOptionsScreenProps> = ({ navigation }) => {
  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)

  const paramName = FilterParamName.gallery
  const filterKey = "gallery"
  const aggregation = aggregationForFilter(filterKey, aggregations)
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
    selectFiltersAction({
      displayText: option.displayText,
      paramValue: option.paramValue,
      paramName,
      filterKey,
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
