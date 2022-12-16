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
import { useMemo } from "react"
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
  const artistDisplayOptions = useDisplayOptions()

  const selectedArtistIFollowOption = selectedOptions.find((value) => {
    return value.paramName === FilterParamName.artistsIFollow
  })
  const sortedArtistOptions = useMemo(
    () => sortBy(artistDisplayOptions, ["displayText"]),
    [artistDisplayOptions]
  )

  const { handleSelect, isSelected } = useMultiSelect({
    options: artistDisplayOptions,
    paramName: FilterParamName.artistIDs,
  })

  const formattedArtistOptions = sortedArtistOptions.map((option) => ({
    ...option,
    paramValue: isSelected(option),
  }))

  // If FOLLOWED_ARTISTS is included in the list of available aggregations, it means
  // the user has at least one artist they follow (basically necessary for a fair).
  const hasFollowedArtistsInAggregations = !!aggregations.find(
    (agg) => agg.slice === ("FOLLOWED_ARTISTS" as AggregationName)
  )
  const hasFollowedArtistsInCounts = !!counts.followedArtists

  // Add in Artists I Follow at the start of the list
  let allOptions: FilterData[] = formattedArtistOptions

  if (hasFollowedArtistsInAggregations || hasFollowedArtistsInCounts) {
    allOptions = [
      {
        displayText: "All Artists I Follow",
        paramName: FilterParamName.artistsIFollow,
        paramValue: !!selectedArtistIFollowOption?.paramValue,
      },
      ...formattedArtistOptions,
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

const useDisplayOptions = (): FilterData[] => {
  const filterType = ArtworksFiltersStore.useStoreState((state) => state.filterType)
  const localFilterOptions = ArtworksFiltersStore.useStoreState((state) => state.filterOptions)
  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)

  return useMemo(() => {
    if (filterType === "local") {
      const options = localFilterOptions ?? []
      const localArtistFilterOption = options.find((filterOption) => {
        return filterOption.filterType === "artistIDs"
      })

      return localArtistFilterOption?.values ?? []
    }

    const aggregation = aggregationForFilter(FilterParamName.artistIDs, aggregations)
    const counts = aggregation?.counts ?? []

    return counts.map((aggCount) => {
      return {
        displayText: aggCount.name,
        paramName: FilterParamName.artistIDs,
        paramValue: aggCount.value,
        filterKey: "artist",
      }
    })
  }, [filterType, aggregations, localFilterOptions])
}
