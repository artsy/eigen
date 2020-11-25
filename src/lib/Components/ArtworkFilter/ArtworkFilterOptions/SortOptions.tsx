import { NewStore } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
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

const defaultOption = {
  displayText: "Default",
  paramName: FilterParamName.sort,
  paramValue: "-decayed_merch",
}

export const OrderedArtworkSorts = [
  defaultOption,
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

export const SortOptionsScreen: React.FC<SortOptionsScreenProps> = ({ navigator }) => {
  const selectedFilters = NewStore.useStoreState((state) => state.selectedFiltersComputed)
  const selectedFilter = selectedFilters.sort

  const updateValue = NewStore.useStoreActions((actions) => actions.selectFilter)

  const selectedOption =
    OrderedArtworkSorts.find((sortOption) => sortOption.paramValue === selectedFilter) ?? defaultOption

  return (
    <SingleSelectOptionScreen
      onSelect={(option) =>
        updateValue({
          paramName: FilterParamName.sort,
          value: option.paramValue,
          display: option.displayText,
          filterScreenType: "sort",
        })
      }
      filterHeaderText={FilterDisplayName.sort}
      filterOptions={OrderedArtworkSorts}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
