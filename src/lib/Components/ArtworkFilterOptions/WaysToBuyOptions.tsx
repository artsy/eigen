import {
  FilterOption,
  mapWaysToBuyTypesToFilterTypes,
  OrderedWaysToBuyFilters,
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
    const value = !selectedOptions.find(filter => filter.filterType === mapWaysToBuyTypesToFilterTypes[option])
      ?.value as boolean
    const filterType = mapWaysToBuyTypesToFilterTypes[option] as FilterOption
    dispatch({
      type: "selectFilters",
      payload: { filterType, value },
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
