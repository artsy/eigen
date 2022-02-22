import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  aggregationForFilter,
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworksFiltersStore,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import React from "react"
import { MultiSelectCheckOptionScreen } from "./MultiSelectCheckOption"
import { useMultiSelect } from "./useMultiSelect"

interface ArtistIDsSaleArtworksOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "ArtistIDsOptionsScreen"> {}

const isArtistsIFollowFilter = (option: FilterData) => {
  return option.paramName === FilterParamName.artistsIFollow
}
const isAllArtistsFilter = (option: FilterData) => {
  return option.displayText === "All Artists"
}

export const ArtistIDsSaleArtworksOptionsScreen: React.FC<
  ArtistIDsSaleArtworksOptionsScreenProps
> = ({ navigation }) => {
  const paramName = FilterParamName.artistIDs
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )
  const counts = ArtworksFiltersStore.useStoreState((state) => state.counts)
  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const aggregation = aggregationForFilter(paramName, aggregations)

  const options: FilterData[] | undefined =
    aggregation?.counts.map((aggCount) => {
      return {
        displayText: aggCount.name,
        paramName,
        paramValue: aggCount.value,
        count: aggCount.count,
      }
    }) ?? []

  const selectedOptions = useSelectedOptionsDisplay()
  const { handleSelect, handleClear, isActive, isSelected } = useMultiSelect({
    options,
    paramName,
  })

  const artistIFollowFilter = selectedOptions.find(isArtistsIFollowFilter)
  const isSelectedArtistIFollowFilter = !!artistIFollowFilter?.paramValue
  const displayOptions = [
    {
      displayText: "Artists You Follow",
      paramName: FilterParamName.artistsIFollow,
      paramValue: isSelectedArtistIFollowFilter,
      count: counts.followedArtists,
    },
    {
      displayText: "All Artists",
      paramName,
      paramValue: !isSelectedArtistIFollowFilter && !isActive,
    },
    ...options.map((option) => ({ ...option, paramValue: isSelected(option) })),
  ]

  const selectOption = (option: FilterData, updatedValue: boolean) => {
    selectFiltersAction({
      displayText: option.displayText,
      paramValue: isArtistsIFollowFilter(option),
      paramName: FilterParamName.artistsIFollow,
    })

    if (isArtistsIFollowFilter(option) || isAllArtistsFilter(option)) {
      handleClear()
    } else {
      handleSelect(option, updatedValue)
    }
  }

  const shouldAddIndent = (option: FilterData) => {
    return !(isArtistsIFollowFilter(option) || isAllArtistsFilter(option))
  }

  return (
    <MultiSelectCheckOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.artistIDs}
      filterOptions={displayOptions}
      navigation={navigation}
      shouldAddIndent={shouldAddIndent}
    />
  )
}
