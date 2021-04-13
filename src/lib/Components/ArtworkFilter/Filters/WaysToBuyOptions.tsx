import { StackScreenProps } from "@react-navigation/stack"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { FilterData, FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import React from "react"
import { FilterModalNavigationStack } from "lib/Components/ArtworkFilter"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

interface WaysToBuyOptionsScreenProps extends StackScreenProps<FilterModalNavigationStack, "WaysToBuyOptionsScreen"> {}

export const WaysToBuyOptionsScreen: React.FC<WaysToBuyOptionsScreenProps> = ({ navigation }) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)

  const selectedOptions = useSelectedOptionsDisplay()

  const waysToBuyFilterNames = [
    FilterParamName.waysToBuyBuy,
    FilterParamName.waysToBuyMakeOffer,
    FilterParamName.waysToBuyBid,
    FilterParamName.waysToBuyInquire,
  ]
  const waysToBuyOptions = selectedOptions.filter((value) => waysToBuyFilterNames.includes(value.paramName))

  const waysToBuySort = (left: FilterData, right: FilterData): number => {
    const leftParam = left.paramName
    const rightParam = right.paramName
    if (waysToBuyFilterNames.indexOf(leftParam) < waysToBuyFilterNames.indexOf(rightParam)) {
      return -1
    } else {
      return 1
    }
  }

  const sortedOptions = waysToBuyOptions.sort(waysToBuySort)

  const selectOption = (option: FilterData, updatedValue: boolean) => {
    selectFiltersAction({
      displayText: option.displayText,
      paramValue: updatedValue,
      paramName: option.paramName,
    })
  }

  return (
    <MultiSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.waysToBuy}
      filterOptions={sortedOptions}
      navigation={navigation}
    />
  )
}
