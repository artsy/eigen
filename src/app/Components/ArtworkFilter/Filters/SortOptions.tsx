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
import { SingleSelectOptionScreen } from "./SingleSelectOption"

type SortOptionsScreenProps = StackScreenProps<ArtworkFilterNavigationStack, "SortOptionsScreen">

export const DEFAULT_ARTWORK_SORT = {
  displayText: "Recommended",
  paramName: FilterParamName.sort,
  paramValue: "-decayed_merch",
}

const GALLERY_CURATED_ARTWORK_SORT = {
  displayText: "Gallery Curated",
  paramName: FilterParamName.sort,
  paramValue: "partner_show_position",
}

const DEFAULT_GENE_SORT = {
  displayText: "Recommended",
  paramName: FilterParamName.sort,
  paramValue: "-partner_updated_at",
}

const DEFAULT_TAG_SORT = {
  displayText: "Recommended",
  paramName: FilterParamName.sort,
  paramValue: "-partner_updated_at",
}

export const DEFAULT_NEW_SALE_ARTWORK_SORT = {
  displayText: "Lot Number Ascending",
  paramName: FilterParamName.sort,
  paramValue: "sale_position",
}

export const ORDERED_ARTWORK_SORTS: FilterData[] = [
  {
    displayText: "Price (High to Low)",
    paramName: FilterParamName.sort,
    paramValue: "-has_price,-prices",
  },
  {
    displayText: "Price (Low to High)",
    paramName: FilterParamName.sort,
    paramValue: "-has_price,prices",
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

// TODO: Replace DEFAULT_NEW_SALE_ARTWORKS_PARAMS with DEFAULT_SALE_ARTWORKS_PARAMS when AREnableArtworksConnectionForAuction is released
export const ORDERED_NEW_SALE_ARTWORK_SORTS: FilterData[] = [
  DEFAULT_NEW_SALE_ARTWORK_SORT,
  {
    displayText: "Lot Number Descending",
    paramName: FilterParamName.sort,
    paramValue: "-sale_position",
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
    displayText: "Price Ascending",
    paramName: FilterParamName.sort,
    paramValue: "prices",
  },
  {
    displayText: "Price Descending",
    paramName: FilterParamName.sort,
    paramValue: "-prices",
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
    // TODO: Replace newSaleArtwork with saleArtwork when AREnableArtworksConnectionForAuction is released
    newSaleArtwork: ORDERED_NEW_SALE_ARTWORK_SORTS,
    showArtwork: [GALLERY_CURATED_ARTWORK_SORT, ...ORDERED_ARTWORK_SORTS],
    auctionResult: ORDERED_AUCTION_RESULTS_SORTS,
    geneArtwork: [DEFAULT_GENE_SORT, ...ORDERED_ARTWORK_SORTS],
    tagArtwork: [DEFAULT_TAG_SORT, ...ORDERED_ARTWORK_SORTS],
    local: localSortOptions ?? [],
    collect: [DEFAULT_ARTWORK_SORT, ...ORDERED_ARTWORK_SORTS],
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
