import {
  mapToFilterTypes,
  OrderedWaysToBuyFilters,
  WaysToBuyFilterTypes,
  WaysToBuyOptions,
} from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

interface WaysToBuyOptionsScreenProps {
  navigator: NavigatorIOS
}

export const WaysToBuyOptionsScreen: React.SFC<WaysToBuyOptionsScreenProps> = ({ navigator }) => {
  const { dispatch } = useContext(ArtworkFilterContext)
  const selectedOptions = useSelectedOptionsDisplay()

  const selectOption = (option: WaysToBuyOptions) => {
    const value = !selectedOptions.find(filter => filter.filterType === mapToFilterTypes[option])?.value as boolean

    dispatch({
      type: "selectFilters",
      payload: { filterType: WaysToBuyFilterTypes[option], value },
    })
  }

  return (
    <MultiSelectOptionScreen
      onSelect={selectOption}
      filterText="Ways to Buy"
      filterOptions={OrderedWaysToBuyFilters}
      navigator={navigator}
    />
  )
}
