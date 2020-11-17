import {
  ArtworkFilterContext,
  FilterData,
  useSelectedOptionsDisplay,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { FilterDisplayName, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React, { useContext } from "react"
import NavigatorIOS from "react-native-navigator-ios"
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

const defaulArtworkSort = {
  displayText: "Default",
  paramName: FilterParamName.sort,
  paramValue: "-decayed_merch",
}

export const OrderedArtworkSorts: FilterData[] = [
  {
    displayText: "Price (high to low)",
    paramName: FilterParamName.sort,
    paramValue: "sold,-has_price,-prices",
  },
  {
    displayText: "Price (low to high)",
    paramName: FilterParamName.sort,
    paramValue: "sold,-has_price,prices",
  },
  {
    displayText: "Recently updated",
    paramName: FilterParamName.sort,
    paramValue: "-partner_updated_at",
  },
  {
    displayText: "Recently added",
    paramName: FilterParamName.sort,
    paramValue: "-published_at",
  },
  {
    displayText: "Artwork year (descending)",
    paramName: FilterParamName.sort,
    paramValue: "-year",
  },
  {
    displayText: "Artwork year (ascending)",
    paramName: FilterParamName.sort,
    paramValue: "year",
  },
]

export const OrderedSaleArtworkSorts: FilterData[] = [
  {
    displayText: "Lot number ascending",
    paramName: FilterParamName.sort,
    paramValue: "position",
  },
  {
    displayText: "Lot number descending",
    paramName: FilterParamName.sort,
    paramValue: "-position",
  },
  {
    displayText: "Most bids",
    paramName: FilterParamName.sort,
    paramValue: "-bidder_positions_count",
  },
  {
    displayText: "Least bids",
    paramName: FilterParamName.sort,
    paramValue: "bidder_positions_count",
  },
  {
    displayText: "Highest bid",
    paramName: FilterParamName.sort,
    paramValue: "-searchable_estimate",
  },
  {
    displayText: "Lowest bid",
    paramName: FilterParamName.sort,
    paramValue: "searchable_estimate",
  },
]

export const SortOptionsScreen: React.FC<SortOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)
  const filterType = state.filterType

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find((option) => option.paramName === FilterParamName.sort)!

  const filterOptions =
    filterType === "artwork" ? [defaulArtworkSort, ...OrderedArtworkSorts] : [...OrderedSaleArtworkSorts]

  const selectOption = (option: FilterData) => {
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramName: FilterParamName.sort,
        paramValue: option.paramValue,
      },
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.sort}
      filterOptions={filterOptions}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
