import { OrderedWaysToBuyFilters } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, FilterData, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

interface WaysToBuyOptionsScreenProps {
  navigator: NavigatorIOS
}

export const WaysToBuyOptionsScreen: React.SFC<WaysToBuyOptionsScreenProps> = ({ navigator }) => {
  const { dispatch } = useContext(ArtworkFilterContext)
  const selectedOptions = useSelectedOptionsDisplay()
  const selectOption = (option: FilterData) => {
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: option.paramValue,
        paramName: option.paramName,
        filterType: option.filterType,
      },
    })
  }

  return (
    <MultiSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText="Ways to Buy"
      filterOptions={OrderedWaysToBuyFilters}
      navigator={navigator}
    />
  )
}
