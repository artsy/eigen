import { StackScreenProps } from "@react-navigation/stack"
import {
  aggregationForFilter,
  AggregationName,
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworksFiltersStore,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"

import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import { sortBy } from "lodash"
import React from "react"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

interface ArtistIDsArtworksOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "ArtistIDsOptionsScreen"> {}

export const ArtistIDsArtworksOptionsScreen: React.FC<ArtistIDsArtworksOptionsScreenProps> = ({
  navigation,
}) => {
  const selectedOptions = useSelectedOptionsDisplay()
  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )
  const counts = ArtworksFiltersStore.useStoreState((state) => state.counts)
  const filterType = ArtworksFiltersStore.useStoreState((state) => state.filterType)
  const localFilterOptions = ArtworksFiltersStore.useStoreState((state) => state.filterOptions)

  const selectedArtistIFollowOption = selectedOptions.find((value) => {
    return value.paramName === FilterParamName.artistsIFollow
  })

  let artistDisplayOptions: FilterData[] = []
  if (filterType === "local") {
    artistDisplayOptions = (localFilterOptions ?? []).find((o) => o.filterType === "artistIDs")!
      .values!
  } else {
    const aggregation = aggregationForFilter(FilterParamName.artistIDs, aggregations)
    artistDisplayOptions =
      aggregation?.counts.map((aggCount) => {
        return {
          displayText: aggCount.name,
          paramName: FilterParamName.artistIDs,
          paramValue: aggCount.value,
          filterKey: "artist",
        }
      }) ?? []
  }

  const { handleSelect, isSelected } = useMultiSelect({
    options: artistDisplayOptions,
    paramName: FilterParamName.artistIDs,
  })

  const formattedArtistOptions = artistDisplayOptions.map((option) => ({
    ...option,
    paramValue: isSelected(option),
  }))
  const sortedArtistOptions = sortBy(formattedArtistOptions, ["displayText"])

  // If FOLLOWED_ARTISTS is included in the list of available aggregations, it means
  // the user has at least one artist they follow (basically necessary for a fair).
  const hasFollowedArtistsInAggregations = !!aggregations.find(
    (agg) => agg.slice === ("FOLLOWED_ARTISTS" as AggregationName)
  )
  const hasFollowedArtistsInCounts = !!counts.followedArtists

  // Add in Artists I Follow at the start of the list
  let allOptions: FilterData[] = sortedArtistOptions

  if (hasFollowedArtistsInAggregations || hasFollowedArtistsInCounts) {
    allOptions = [
      {
        displayText: "All Artists I Follow",
        paramName: FilterParamName.artistsIFollow,
        paramValue: !!selectedArtistIFollowOption?.paramValue,
      },
      ...sortedArtistOptions,
    ]
  }

  const selectOption = (option: FilterData, updatedValue: boolean) => {
    if (option.paramName === FilterParamName.artistsIFollow) {
      selectFiltersAction({
        displayText: "All Artists I Follow",
        paramName: FilterParamName.artistsIFollow,
        paramValue: !selectedArtistIFollowOption?.paramValue,
      })
    } else {
      handleSelect(option, updatedValue)
    }
  }

  return (
    <MultiSelectOptionScreen
      filterHeaderText={FilterDisplayName.artistIDs}
      filterOptions={allOptions}
      onSelect={selectOption}
      navigation={navigation}
    />
  )
}
