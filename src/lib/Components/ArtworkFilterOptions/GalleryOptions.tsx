import { AggregateOption, FilterParamName, FilterType } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, FilterData, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { aggregationForFilterType } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface GalleryOptionsScreenProps {
  navigator: NavigatorIOS
}

export const GalleryOptionsScreen: React.SFC<GalleryOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const filterType = FilterType.gallery
  const paramName = FilterParamName.gallery
  const aggregation = aggregationForFilterType(filterType, state.aggregations)
  const options = aggregation.counts.map(aggCount => {
    return {
      displayText: aggCount.name,
      paramName,
      paramValue: aggCount.value,
      filterType,
    }
  })
  const allOption: FilterData = { displayText: "All", paramName, filterType }
  const displayOptions = [allOption].concat(options)

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)!

  const selectOption = (option: AggregateOption) => {
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: option.paramValue,
        paramName,
        filterType,
      },
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText="Gallery"
      filterOptions={displayOptions}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
