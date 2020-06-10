import { FilterParamName, FilterType, OrderedArtworkSorts } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, FilterData, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface SortOptionsScreenProps {
  navigator: NavigatorIOS
}

export const SortOptionsScreen: React.SFC<SortOptionsScreenProps> = ({ navigator }) => {
  const { dispatch } = useContext(ArtworkFilterContext)

  const filterType = FilterType.sort

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)!

  const selectOption = (option: FilterData) => {
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramName: FilterParamName.sort,
        paramValue: option.paramValue,
        filterType,
      },
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText="Sort"
      filterOptions={OrderedArtworkSorts}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
