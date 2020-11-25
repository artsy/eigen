import { NewStore } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { AggregateOption, FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { NavigatorIOS } from "react-native"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

interface WaysToBuyOptionsScreenProps {
  navigator: NavigatorIOS
}

export const WaysToBuyOptionsScreen: React.FC<WaysToBuyOptionsScreenProps> = ({ navigator }) => {
  const selectedFilters = NewStore.useStoreState((state) => state.selectedFiltersComputed)

  const OrderedWaysToBuy: AggregateOption[] = [
    {
      paramName: FilterParamName.waysToBuyBuy,
      paramValue: selectedFilters.acquireable,
      displayText: "Buy now",
    },
    {
      paramName: FilterParamName.waysToBuyInquire,
      paramValue: selectedFilters.inquireableOnly,
      displayText: "Inquire",
    },
    {
      paramName: FilterParamName.waysToBuyMakeOffer,
      paramValue: selectedFilters.offerable,
      displayText: "Make offer",
    },
    {
      paramName: FilterParamName.waysToBuyBid,
      paramValue: selectedFilters.atAuction,
      displayText: "Bid",
    },
  ]

  const updateValue = NewStore.useStoreActions((actions) => actions.selectFilter)
  const selectOption = (option: AggregateOption) => {
    updateValue({
      paramName: option.paramName!,
      value: !option.paramValue,
      display: option.displayText,
      filterScreenType: "waysToBuy",
    })
  }

  return (
    <MultiSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.waysToBuy}
      filterOptions={OrderedWaysToBuy}
      navigator={navigator}
    />
  )
}
