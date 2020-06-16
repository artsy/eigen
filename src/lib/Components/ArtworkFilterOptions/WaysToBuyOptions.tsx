import { FilterType } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
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

  const waysToBuyFilterTypes = [
    FilterType.waysToBuyBuy,
    FilterType.waysToBuyMakeOffer,
    FilterType.waysToBuyBid,
    FilterType.waysToBuyInquire,
  ]
  const waysToBuyOptions = selectedOptions.filter(value => waysToBuyFilterTypes.includes(value.filterType))

  const waysToBuySort = (left: FilterData, right: FilterData): number => {
    const leftParam = left.filterType
    const rightParam = right.filterType
    if (waysToBuyFilterTypes.indexOf(leftParam) < waysToBuyFilterTypes.indexOf(rightParam)) {
      return -1
    } else {
      return 1
    }
  }

  const sortedOptions = waysToBuyOptions.sort(waysToBuySort)

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
      filterOptions={sortedOptions}
      navigator={navigator}
    />
  )
}
