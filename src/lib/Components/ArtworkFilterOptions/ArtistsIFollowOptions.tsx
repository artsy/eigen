import {
  ArtworkFilterContext,
  FilterData,
  useSelectedOptionsDisplay,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { FilterDisplayName, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

interface ArtistsIFollowOptionsScreenProps {
  navigator: NavigatorIOS
}

export const ArtistsIFollowOptionsScreen: React.FC<ArtistsIFollowOptionsScreenProps> = ({ navigator }) => {
  const { dispatch } = useContext(ArtworkFilterContext)
  const selectedOptions = useSelectedOptionsDisplay()

  const artistsIFollowFilterNames = [FilterParamName.artistsIFollow]
  const artistsIFollowOptions = selectedOptions.filter((value) => artistsIFollowFilterNames.includes(value.paramName))

  const selectOption = (option: FilterData, updatedValue: boolean) => {
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: updatedValue,
        paramName: option.paramName,
      },
    })
  }

  return (
    <MultiSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.artistsIFollow}
      filterOptions={artistsIFollowOptions}
      navigator={navigator}
    />
  )
}
