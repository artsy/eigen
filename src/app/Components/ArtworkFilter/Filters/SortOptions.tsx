import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworksFiltersStore,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import React from "react"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface SortOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "SortOptionsScreen"> {}

// Sorting types
enum ArtworkSorts {
  "Gallery Curated" = "partner_show_position",
  "Default" = "-decayed_merch",
  "Price (High to Low)" = "sold,-has_price,-prices",
  "Price (Low to High)" = "sold,-has_price,prices",
  "Recently Updated" = "-partner_updated_at",
  "Recently Added" = "-published_at",
  "Artwork Year (Descending)" = "-year",
  "Artwork Year (Ascending)" = "year",
}

export type SortOption = keyof typeof ArtworkSorts

export const DEFAULT_ARTWORK_SORT = {
  displayText: "Default",
  paramName: FilterParamName.sort,
  paramValue: "-decayed_merch",
}

const GALLERY_CURATED_ARTWORK_SORT = {
  displayText: "Gallery Curated",
  paramName: FilterParamName.sort,
  paramValue: "partner_show_position",
}

const DEFAULT_GENE_SORT = {
  displayText: "Default",
  paramName: FilterParamName.sort,
  paramValue: "-partner_updated_at",
}

const DEFAULT_TAG_SORT = {
  displayText: "Default",
  paramName: FilterParamName.sort,
  paramValue: "-partner_updated_at",
}

export const ORDERED_ARTWORK_SORTS: FilterData[] = [
  {
    displayText: "Price (High to Low)",
    paramName: FilterParamName.sort,
    paramValue: "sold,-has_price,-prices",
  },
  {
    displayText: "Price (Low to High)",
    paramName: FilterParamName.sort,
    paramValue: "sold,-has_price,prices",
  },
  {
    displayText: "Recently Updated",
    paramName: FilterParamName.sort,
    paramValue: "-partner_updated_at",
  },
  {
    displayText: "Recently Added",
    paramName: FilterParamName.sort,
    paramValue: "-published_at",
  },
  {
    displayText: "Artwork Year (Descending)",
    paramName: FilterParamName.sort,
    paramValue: "-year",
  },
  {
    displayText: "Artwork Year (Ascending)",
    paramName: FilterParamName.sort,
    paramValue: "year",
  },
]

export const ORDERED_SALE_ARTWORK_SORTS: FilterData[] = [
  {
    displayText: "Lot Number Ascending",
    paramName: FilterParamName.sort,
    paramValue: "position",
  },
  {
    displayText: "Lot Number Descending",
    paramName: FilterParamName.sort,
    paramValue: "-position",
  },
  {
    displayText: "Most Bids",
    paramName: FilterParamName.sort,
    paramValue: "-bidder_positions_count",
  },
  {
    displayText: "Least Bids",
    paramName: FilterParamName.sort,
    paramValue: "bidder_positions_count",
  },
  {
    displayText: "Highest Bid",
    paramName: FilterParamName.sort,
    paramValue: "-searchable_estimate",
  },
  {
    displayText: "Lowest Bid",
    paramName: FilterParamName.sort,
    paramValue: "searchable_estimate",
  },
]

export const ORDERED_AUCTION_RESULTS_SORTS: FilterData[] = [
  {
    displayText: "Most Recent Sale Date",
    paramName: FilterParamName.sort,
    paramValue: "DATE_DESC",
  },
  {
    displayText: "Estimate",
    paramName: FilterParamName.sort,
    paramValue: "ESTIMATE_AND_DATE_DESC",
  },
  {
    displayText: "Sale Price",
    paramName: FilterParamName.sort,
    paramValue: "PRICE_AND_DATE_DESC",
  },
]

export const SortOptionsScreen: React.FC<SortOptionsScreenProps> = ({ navigation }) => {
  const filterType = ArtworksFiltersStore.useStoreState((state) => state.filterType)
  const localSortOptions = ArtworksFiltersStore.useStoreState((state) => state.sortOptions)
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(
    (option) => option.paramName === FilterParamName.sort
  )!

  const filterOptions = {
    artwork: [DEFAULT_ARTWORK_SORT, ...ORDERED_ARTWORK_SORTS],
    saleArtwork: ORDERED_SALE_ARTWORK_SORTS,
    showArtwork: [GALLERY_CURATED_ARTWORK_SORT, DEFAULT_ARTWORK_SORT, ...ORDERED_ARTWORK_SORTS],
    auctionResult: ORDERED_AUCTION_RESULTS_SORTS,
    geneArtwork: [DEFAULT_GENE_SORT, ...ORDERED_ARTWORK_SORTS],
    tagArtwork: [DEFAULT_TAG_SORT, ...ORDERED_ARTWORK_SORTS],
    local: localSortOptions ?? [],
  }[filterType]

  const selectOption = (option: FilterData) => selectFiltersAction(option)

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
