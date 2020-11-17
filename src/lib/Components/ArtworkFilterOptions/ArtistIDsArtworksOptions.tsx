import {
  AggregationName,
  ArtworkFilterContext,
  FilterData,
  useSelectedOptionsDisplay,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { aggregationForFilter, FilterDisplayName, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { sortBy } from "lodash"
import React, { useContext } from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

interface ArtistIDsArtworksOptionsScreenProps {
  navigator: NavigatorIOS
}

export const ArtistIDsArtworksOptionsScreen: React.FC<ArtistIDsArtworksOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)
  const selectedOptions = useSelectedOptionsDisplay()

  const selectedArtistOptions = selectedOptions.filter((value) => {
    return value.paramName === FilterParamName.artistIDs
  })

  const selectedArtistIFollowOptions = selectedOptions.filter((value) => {
    return value.paramName === FilterParamName.artistsIFollow
  })

  const aggregation = aggregationForFilter(FilterParamName.artistIDs, state.aggregations)
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
      paramValue: !!(selectedArtistIFollowOptions ?? [])[0]?.paramValue,
    },
    ...sortedArtistOptions,
  ]

  const selectOption = (option: FilterData) => {
    // Send the paramValue directly if we're dealing with an artist filter.
    // If we're selecting the "Artists I Follow" filter, instead
    // send the opposite of the current val.
    const selectedVal = option.paramName === FilterParamName.artistIDs ? option.paramValue : !option.paramValue

    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: selectedVal,
        paramName: option.paramName,
        filterKey: option.filterKey,
      },
    })
  }

  const selectedValuesForParam = [...selectedArtistOptions, ...selectedArtistIFollowOptions]
  const itemIsSelected = (item: FilterData): boolean => {
    if (item.paramName === FilterParamName.artistIDs) {
      return !!(selectedValuesForParam ?? []).find(({ paramValue }) => item.paramValue === paramValue)
    }
    return !!item.paramValue
  }

  // If FOLLOWED_ARTISTS is included in the list of available aggregations, it means
  // the user has at least one artist they follow in the fair.
  const hasWorksByFollowedArtists = !!state.aggregations.find(
    (agg) => agg.slice === ("FOLLOWED_ARTISTS" as AggregationName)
  )
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
