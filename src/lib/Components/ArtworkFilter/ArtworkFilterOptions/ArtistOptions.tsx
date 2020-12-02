import { useStoreState } from "easy-peasy"
import { AggregationName, FilterData, NewStore } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/FilterArtworksHelpers"
import { sortBy } from "lodash"
import React, { useContext } from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

interface ArtistIDsArtworksOptionsScreenProps {
  navigator: NavigatorIOS
}

export const ArtistOptionsScreen: React.FC<ArtistOptionsScreenProps> = ({ navigator }) => {
  const paramName = FilterParamName.artist
  const selectedFilters = NewStore.useStoreState((state) => state.selectedFiltersComputed)
  const selectedArtists = selectedFilters.artistIDs
  const selectedArtistIFollow = selectedFilters.includeArtworksByFollowedArtists

  const aggregations = NewStore.useStoreState((state) => state.aggregations)
  const aggregation = aggregationForFilter("artist", aggregations)

  const artistDisplayOptions = aggregation?.counts.map((aggCount) => {
    return {
      displayText: aggCount.name,
      paramName: FilterParamName.artistIDs,
      paramValue: aggCount.value,
      filterKey: "artist",
    }
  })

  const sortedArtistOptions = sortBy(artistDisplayOptions ?? [], ["displayText"])

  // Add in Artists I Follow at the start of the list
  const allOptions = [
    {
      displayText: "All artists I follow",
      paramName: FilterParamName.artistsIFollow,
      paramValue: selectedArtistIFollow,
    },
    ...sortedArtistOptions,
  ]

  const updateValue = NewStore.useStoreActions((actions) => actions.selectFilter)

  const selectOption = (option: FilterData) => {
    // Send the paramValue directly if we're dealing with an artist filter.
    // If we're selecting the "Artists I Follow" filter, instead
    // send the opposite of the current val.
    const selectedVal = option.paramName === FilterParamName.artistIDs ? option.paramValue : !option.paramValue

    updateValue({
      paramName,
      value: selectedVal,
      display: option.displayText,
      filterScreenType: "artist",
    })
  }

  const itemIsSelected = (item: FilterData): boolean => {
    if (item.paramName === FilterParamName.artist) {
      return !!selectedArtists?.includes(item.paramValue)
    }
    return !!item.paramValue
  }

  // If FOLLOWED_ARTISTS is included in the list of available aggregations, it means
  // the user has at least one artist they follow in the fair.
  const hasWorksByFollowedArtists = !!aggregations.find((agg) => agg.slice === ("FOLLOWED_ARTISTS" as AggregationName))
  const itemIsDisabled = (item: FilterData): boolean => {
    return item.paramName === FilterParamName.artistsIFollow && !hasWorksByFollowedArtists
  }

  return (
    <MultiSelectOptionScreen
      filterHeaderText={FilterDisplayName.artistIDs}
      filterOptions={allOptions}
      onSelect={selectOption}
      navigator={navigator}
      isSelected={itemIsSelected}
      isDisabled={itemIsDisabled}
    />
  )
}
