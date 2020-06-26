import { FilterParamName, FilterType } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, FilterData, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface SortOptionsScreenProps {
  navigator: NavigatorIOS
}

// Sorting types
enum ArtworkSorts {
  "Default" = "-decayed_merch",
  "Price (high to low)" = "sold,-has_price,-prices",
  "Price (low to high)" = "sold,-has_price,prices",
  "Recently updated" = "-partner_updated_at",
  "Recently added" = "-published_at",
  "Artwork year (descending)" = "-year",
  "Artwork year (ascending)" = "year",
}

export type SortOption = keyof typeof ArtworkSorts

export const OrderedArtworkSorts: FilterData[] = [
  {
    displayText: "Default",
    paramName: FilterParamName.sort,
    paramValue: "-decayed_merch",
    filterType: FilterType.sort,
  },
  {
    displayText: "Price (high to low)",
    paramName: FilterParamName.sort,
    paramValue: "sold,-has_price,-prices",
    filterType: FilterType.sort,
  },
  {
    displayText: "Price (low to high)",
    paramName: FilterParamName.sort,
    paramValue: "sold,-has_price,prices",
    filterType: FilterType.sort,
  },
  {
    displayText: "Recently updated",
    paramName: FilterParamName.sort,
    paramValue: "-partner_updated_at",
    filterType: FilterType.sort,
  },
  {
    displayText: "Recently added",
    paramName: FilterParamName.sort,
    paramValue: "-published_at",
    filterType: FilterType.sort,
  },
  {
    displayText: "Artwork year (descending)",
    paramName: FilterParamName.sort,
    paramValue: "-year",
    filterType: FilterType.sort,
  },
  {
    displayText: "Artwork year (ascending)",
    paramName: FilterParamName.sort,
    paramValue: "year",
    filterType: FilterType.sort,
  },
]

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
