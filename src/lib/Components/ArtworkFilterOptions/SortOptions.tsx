import { StackScreenProps } from "@react-navigation/stack"
import {
  ArtworkFilterContext,
  FilterData,
  useSelectedOptionsDisplay,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { FilterDisplayName, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React, { useContext } from "react"
import { FilterModalNavigationStack } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface SortOptionsScreenProps extends StackScreenProps<FilterModalNavigationStack, "SortOptionsScreen"> {}

// Sorting types
enum ArtworkSorts {
  "Gallery Curated" = "partner_show_position",
  "Default" = "-decayed_merch",
  "Price (high to low)" = "sold,-has_price,-prices",
  "Price (low to high)" = "sold,-has_price,prices",
  "Recently updated" = "-partner_updated_at",
  "Recently added" = "-published_at",
  "Artwork year (descending)" = "-year",
  "Artwork year (ascending)" = "year",
}

export type SortOption = keyof typeof ArtworkSorts

const DEFAULT_ARTWORK_SORT = {
  displayText: "Default",
  paramName: FilterParamName.sort,
  paramValue: "-decayed_merch",
}

const GALLERY_CURATED_ARTWORK_SORT = {
  displayText: "Gallery Curated",
  paramName: FilterParamName.sort,
  paramValue: "partner_show_position",
}

export const ORDERED_ARTWORK_SORTS: FilterData[] = [
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

export const ORDERED_SALE_ARTWORK_SORTS: FilterData[] = [
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

<<<<<<< HEAD
export const ORDERED_AUCTION_RESULTS_SORTS: FilterData[] = [
  {
    displayText: "Most recent sale date",
    paramName: FilterParamName.sort,
    paramValue: "DATE_DESC",
  },
  {
    displayText: "Estimate",
    paramName: FilterParamName.sort,
    paramValue: "ESTIMATE_AND_DATE_DESC",
  },
  {
    displayText: "Sale price",
    paramName: FilterParamName.sort,
    paramValue: "PRICE_AND_DATE_DESC",
  },
]

=======
>>>>>>> 326ab798f (refactor(FilterModal): use react-navigation instead of react-native-navigator-ios for sort options screens)
export const SortOptionsScreen: React.FC<SortOptionsScreenProps> = ({ navigation }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)
  const filterType = state.filterType

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find((option) => option.paramName === FilterParamName.sort)!

  const filterOptions = {
    artwork: [DEFAULT_ARTWORK_SORT, ...ORDERED_ARTWORK_SORTS],
    saleArtwork: ORDERED_SALE_ARTWORK_SORTS,
    showArtwork: [GALLERY_CURATED_ARTWORK_SORT, DEFAULT_ARTWORK_SORT, ...ORDERED_ARTWORK_SORTS],
    auctionResult: ORDERED_AUCTION_RESULTS_SORTS,
  }[filterType]

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
      navigation={navigation}
    />
  )
}
